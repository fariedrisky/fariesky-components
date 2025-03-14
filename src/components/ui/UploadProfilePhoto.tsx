"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Upload, Trash2, Clipboard } from "lucide-react";
import { getInitials } from "@/utils/getInitialts";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface UploadProfilePhotoProps {
	name?: string;
	photoUrl: string | null;
	onPhotoChange: (file: File | null) => void;
	onPhotoDelete: () => void;
	isEditing: boolean;
	className?: string;
}

export default function UploadProfilePhoto({
	name,
	photoUrl,
	onPhotoChange,
	onPhotoDelete,
	isEditing,
	className,
}: UploadProfilePhotoProps) {
	const [photoPreview, setPhotoPreview] = useState<string | null>(photoUrl);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dropdownContentRef = useRef<HTMLDivElement>(null);
	const photoContainerRef = useRef<HTMLDivElement>(null);
	const initials = name ? getInitials(name) : "";
	const [isPasteMode, setIsPasteMode] = useState(false);
	const [lightboxOpen, setLightboxOpen] = useState(false);

	// Sync preview with props
	useEffect(() => {
		setPhotoPreview(photoUrl);
	}, [photoUrl]);

	// This is a single handler for paste events that will work when the container is clicked
	useEffect(() => {
		// Only set up paste listener when in paste mode
		if (!isPasteMode) return;

		const handleDirectPaste = (e: ClipboardEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (!e.clipboardData) return;

			const items = e.clipboardData.items;
			for (let i = 0; i < items.length; i++) {
				if (items[i].type.indexOf("image") !== -1) {
					const blob = items[i].getAsFile();
					if (blob) {
						// Create a proper File object with name
						const filename = `pasted-image-${Date.now()}.png`;
						const file = new File([blob], filename, {
							type: blob.type,
						});

						// Create preview
						const reader = new FileReader();
						reader.onload = (event) => {
							if (event.target?.result) {
								setPhotoPreview(event.target.result as string);
							}
						};
						reader.readAsDataURL(file);

						// Call parent handler
						onPhotoChange(file);

						// Exit paste mode
						setIsPasteMode(false);
						break;
					}
				}
			}
		};

		// Add listener to window (broader capture)
		window.addEventListener("paste", handleDirectPaste);

		// Make the paste container visible and focus it
		if (photoContainerRef.current) {
			photoContainerRef.current.focus();
		}

		return () => {
			window.removeEventListener("paste", handleDirectPaste);
		};
	}, [isPasteMode, onPhotoChange]);

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			setPhotoPreview(event.target?.result as string);
		};
		reader.readAsDataURL(file);

		onPhotoChange(file);
		// Reset file input value
		e.target.value = "";

		// Exit paste mode if active
		if (isPasteMode) {
			setIsPasteMode(false);
		}
	};

	const handleDeletePhoto = () => {
		setPhotoPreview(null);
		onPhotoDelete();
	};

	// Start paste mode
	const startPasteMode = () => {
		setIsPasteMode(true);
	};

	// Cancel paste mode on blur or escape
	const cancelPasteMode = () => {
		setIsPasteMode(false);
	};

	// Handle key events
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			cancelPasteMode();
		}
	};

	// Render profile photo in editing mode
	if (isEditing) {
		return (
			<div className="mb-6 flex flex-col items-center">
				<div className="relative">
					<DropdownMenu>
						{/* Use the rounded photo container directly as the trigger */}
						<DropdownMenuTrigger asChild>
							<div
								ref={photoContainerRef}
								className={`h-32 w-32 cursor-pointer overflow-hidden rounded-full border ${
									isPasteMode
										? "border-green-500 ring-2 ring-green-300"
										: "border-gray-300"
								} bg-gray-200 outline-none transition-all hover:border-gray-400`}
								onKeyDown={handleKeyDown}
							>
								{photoPreview ? (
									<Image
										src={photoPreview}
										alt="Profile"
										width={128}
										height={128}
										className="h-full w-full select-none object-cover"
									/>
								) : (
									<div className="flex h-32 w-32 items-center justify-center rounded-full border border-gray-300 bg-gray-200">
										<Camera className="h-10 w-10 text-gray-400" />
									</div>
								)}

								{/* Circular overlay for paste mode */}
								{isPasteMode && (
									<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white">
										<p className="px-2 text-center text-sm font-medium">
											Tekan Ctrl+V untuk paste
										</p>
									</div>
								)}
							</div>
						</DropdownMenuTrigger>

						<DropdownMenuContent ref={dropdownContentRef}>
							<DropdownMenuItem onClick={triggerFileInput}>
								<Upload className="mr-2 h-4 w-4" />
								Unggah
							</DropdownMenuItem>
							<DropdownMenuItem onClick={startPasteMode}>
								<Clipboard className="mr-2 h-4 w-4" />
								Tempel (Ctrl+V)
							</DropdownMenuItem>
							{photoPreview && (
								<DropdownMenuItem
									className="text-red-500"
									onClick={handleDeletePhoto}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Hapus
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						accept="image/*"
						onChange={handlePhotoChange}
					/>
				</div>

				<p className="mt-2 text-sm text-gray-500">
					{isPasteMode
						? "Tekan Ctrl+V untuk paste gambar dari clipboard"
						: "Klik pada foto untuk opsi"}
				</p>
			</div>
		);
	}

	// Render profile photo in view mode with Lightbox
	return (
		<div className="mb-6 flex justify-center">
			{photoUrl ? (
				<div
					className="h-32 w-32 cursor-pointer overflow-hidden rounded-full border border-gray-300"
					onClick={() => setLightboxOpen(true)}
				>
					<Image
						src={photoUrl}
						alt="Foto Profil"
						width={128}
						height={128}
						className="h-full w-full object-cover"
					/>

					{/* Lightbox untuk melihat foto dengan zoom */}
					<Lightbox
						open={lightboxOpen}
						close={() => setLightboxOpen(false)}
						slides={[{ src: photoUrl, alt: "Foto Profil" }]}
						plugins={[Zoom]}
						zoom={{
							maxZoomPixelRatio: 3,
							zoomInMultiplier: 2,
							doubleTapDelay: 300,
							doubleClickDelay: 300,
							keyboardMoveDistance: 50,
							wheelZoomDistanceFactor: 100,
							pinchZoomDistanceFactor: 100,
						}}
						carousel={{
							finite: true,
						}}
						render={{
							buttonPrev: () => null,
							buttonNext: () => null,
						}}
					/>
				</div>
			) : (
				<div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-600">
					<span className="text-5xl text-white">{initials}</span>
				</div>
			)}
		</div>
	);
}
