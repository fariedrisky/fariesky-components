"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
			<div className="relative mb-4 h-96 w-96 md:h-[500px] md:w-[500px]">
				<Image
					src="/assets/images/404.jpg"
					alt="404 Error"
					fill
					className="object-contain"
					priority
				/>
			</div>

			<p className="mb-8 max-w-md text-gray-600">
				Sorry, we couldn't find the page you're looking for. The page
				might have been removed, had its name changed, or is temporarily
				unavailable.
			</p>
			<Button onClick={() => router.back()}>
				Kembali ke Halaman Sebelumnya
			</Button>
		</div>
	);
}
