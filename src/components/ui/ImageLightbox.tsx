"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface ImageLightboxProps {
	src: string;
	alt: string;
	thumbnailWidth?: number;
	thumbnailHeight?: number;
}

const ImageLightbox = ({
	src,
	alt,
	thumbnailWidth = 40,
	thumbnailHeight = 40,
}: ImageLightboxProps) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* Thumbnail dengan position relative untuk memastikan gambar mengisi area dengan benar */}
			<div
				className="relative h-full w-full cursor-pointer overflow-hidden rounded-full"
				onClick={() => setOpen(true)}
				style={{ width: thumbnailWidth, height: thumbnailHeight }}
			>
				<Image
					src={src}
					alt={alt}
					fill
					sizes={`${Math.max(thumbnailWidth, thumbnailHeight)}px`}
					className="object-cover"
					priority
				/>
			</div>

			{/* Yet Another React Lightbox */}
			<Lightbox
				open={open}
				close={() => setOpen(false)}
				slides={[{ src, alt }]}
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
		</>
	);
};

export default ImageLightbox;
