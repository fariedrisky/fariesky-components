import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
	.name("fariesky")
	.description("CLI untuk menginstall komponen UI")
	.version("0.1.0");

// Fungsi untuk mendapatkan daftar komponen yang tersedia
async function getAvailableComponents() {
	// Path ke direktori komponen sumber
	let sourceDir = path.join(__dirname, "src", "components", "ui");

	// Coba baca semua file komponen
	let files;
	try {
		files = await fs.readdir(sourceDir);
	} catch (err) {
		// Coba lokasi alternatif
		const altSourceDir = path.resolve(__dirname, "src", "components", "ui");
		try {
			files = await fs.readdir(altSourceDir);
		} catch (altErr) {
			// Jika tidak bisa menemukan direktori, kembalikan array kosong
			return [];
		}
	}

	// Filter hanya file .tsx dan hapus ekstensi
	return files
		.filter((file) => file.endsWith(".tsx"))
		.map((file) => file.replace(".tsx", ""));
}

// Buat command "add" dengan subcommands
const addCommand = program
	.command("add")
	.description("Tambahkan komponen atau utilitas ke project");

// Fungsi untuk mengecek dan menambahkan komponen
async function addComponentToProject(component) {
	try {
		console.log(chalk.blue(`🚀 Menambahkan komponen ${component}...`));

		// Periksa atau buat direktori components/ui
		const uiDir = path.join(process.cwd(), "components", "ui");
		await fs.ensureDir(uiDir);

		// Definisikan destPath
		const destPath = path.join(uiDir, `${component}.tsx`);

		// Path ke komponen sumber
		const sourcePath = path.join(
			__dirname,
			"src",
			"components",
			"ui",
			`${component}.tsx`
		);

		// Cek apakah file sumber ada
		if (!(await fs.pathExists(sourcePath))) {
			console.error(
				chalk.red(`❌ File sumber tidak ditemukan di ${sourcePath}`)
			);
			// Coba cek lokasi alternatif
			const altSourcePath = path.resolve(
				__dirname,
				"src",
				"components",
				"ui",
				`${component}.tsx`
			);
			console.log(
				chalk.yellow(`Mencoba lokasi alternatif: ${altSourcePath}`)
			);

			if (await fs.pathExists(altSourcePath)) {
				console.log(
					chalk.green(`✅ File ditemukan di lokasi alternatif`)
				);
				// Gunakan lokasi alternatif
				await fs.copyFile(altSourcePath, destPath);
			} else {
				return false;
			}
		} else {
			// Copy file komponen
			await fs.copyFile(sourcePath, destPath);
		}

		console.log(
			chalk.green(
				`✅ Komponen ${component} berhasil ditambahkan ke components/ui/${component}.tsx`
			)
		);

		return true;
	} catch (error) {
		console.error(chalk.red("❌ Error:"), error.message);
		console.error(chalk.yellow("Stack trace:"), error.stack);
		return false;
	}
}

// Subcommand untuk menambahkan komponen spesifik
addCommand
	.command("component <component>")
	.description("Tambahkan komponen UI spesifik ke project")
	.action(async (component) => {
		// Dapatkan daftar komponen yang tersedia secara dinamis
		const availableComponents = await getAvailableComponents();

		if (availableComponents.length === 0) {
			console.error(
				chalk.red(
					`❌ Tidak dapat menemukan daftar komponen yang tersedia`
				)
			);
			return;
		}

		if (!availableComponents.includes(component)) {
			console.log(
				chalk.red(`❌ Komponen "${component}" tidak tersedia.`)
			);
			console.log(
				chalk.yellow(
					`Komponen yang tersedia: ${availableComponents.join(", ")}`
				)
			);
			return;
		}

		await addComponentToProject(component);
	});

// Subcommand untuk menambahkan semua komponen
addCommand
	.command("components")
	.description("Tambahkan semua komponen UI ke project")
	.action(async () => {
		try {
			console.log(chalk.blue(`🚀 Menambahkan semua komponen...`));

			// Dapatkan daftar komponen yang tersedia
			const availableComponents = await getAvailableComponents();

			if (availableComponents.length === 0) {
				console.log(
					chalk.yellow(`⚠️ Tidak ada komponen yang ditemukan`)
				);
				return;
			}

			// Install each component
			let successCount = 0;
			for (const component of availableComponents) {
				const success = await addComponentToProject(component);
				if (success) successCount++;
			}

			console.log(
				chalk.green(
					`🎉 ${successCount} dari ${availableComponents.length} komponen berhasil ditambahkan!`
				)
			);
		} catch (error) {
			console.error(chalk.red("❌ Error:"), error.message);
			console.error(chalk.yellow("Stack trace:"), error.stack);
		}
	});

// Fungsi untuk mendapatkan daftar utilitas yang tersedia
async function getAvailableUtils() {
	// Path ke direktori utilitas sumber
	let sourceDir = path.join(__dirname, "src", "utils");

	// Coba baca semua file utilitas
	let files;
	try {
		files = await fs.readdir(sourceDir);
	} catch (err) {
		// Coba lokasi alternatif
		const altSourceDir = path.resolve(__dirname, "src", "utils");
		try {
			files = await fs.readdir(altSourceDir);
		} catch (altErr) {
			// Jika tidak bisa menemukan direktori, kembalikan array kosong
			return [];
		}
	}

	// Filter hanya file .ts dan hapus ekstensi
	return files
		.filter((file) => file.endsWith(".ts"))
		.map((file) => file.replace(".ts", ""));
}

// Fungsi untuk mengecek dan menambahkan utilitas
async function addUtilToProject(util) {
	try {
		console.log(chalk.blue(`🚀 Menambahkan utilitas ${util}...`));

		// Periksa atau buat direktori utils
		const utilsDir = path.join(process.cwd(), "utils");
		await fs.ensureDir(utilsDir);

		// Path ke file utilitas sumber
		const sourcePath = path.join(__dirname, "src", "utils", `${util}.ts`);

		// Definisikan destPath
		const destPath = path.join(utilsDir, `${util}.ts`);

		// Cek apakah file sumber ada
		if (!(await fs.pathExists(sourcePath))) {
			console.error(
				chalk.red(`❌ File utilitas tidak ditemukan di ${sourcePath}`)
			);
			// Coba cek lokasi alternatif
			const altSourcePath = path.resolve(
				__dirname,
				"src",
				"utils",
				`${util}.ts`
			);
			console.log(
				chalk.yellow(`Mencoba lokasi alternatif: ${altSourcePath}`)
			);

			if (await fs.pathExists(altSourcePath)) {
				console.log(
					chalk.green(`✅ File ditemukan di lokasi alternatif`)
				);
				// Gunakan lokasi alternatif
				await fs.copyFile(altSourcePath, destPath);
			} else {
				return false;
			}
		} else {
			// Copy file utilitas
			await fs.copyFile(sourcePath, destPath);
		}

		console.log(
			chalk.green(
				`✅ Utilitas ${util} berhasil ditambahkan ke utils/${util}.ts`
			)
		);

		return true;
	} catch (error) {
		console.error(chalk.red("❌ Error:"), error.message);
		console.error(chalk.yellow("Stack trace:"), error.stack);
		return false;
	}
}

// Subcommand untuk menambahkan utilitas tertentu
addCommand
	.command("util <util>")
	.description("Tambahkan file utilitas tertentu ke project")
	.action(async (util) => {
		// Dapatkan daftar utilitas yang tersedia secara dinamis
		const availableUtils = await getAvailableUtils();

		if (availableUtils.length === 0) {
			console.error(
				chalk.red(
					`❌ Tidak dapat menemukan daftar utilitas yang tersedia`
				)
			);
			return;
		}

		if (!availableUtils.includes(util)) {
			console.log(chalk.red(`❌ Utilitas "${util}" tidak tersedia.`));
			console.log(
				chalk.yellow(
					`Utilitas yang tersedia: ${availableUtils.join(", ")}`
				)
			);
			return;
		}

		await addUtilToProject(util);
	});

// Subcommand untuk menambahkan semua utilitas
addCommand
	.command("utils")
	.description("Tambahkan semua file utilitas ke project")
	.action(async () => {
		try {
			console.log(chalk.blue(`🚀 Menambahkan semua file utilitas...`));

			// Dapatkan daftar utilitas yang tersedia
			const availableUtils = await getAvailableUtils();

			if (availableUtils.length === 0) {
				console.log(
					chalk.yellow(`⚠️ Tidak ada file utilitas yang ditemukan`)
				);
				return;
			}

			// Install each utility
			let successCount = 0;
			for (const util of availableUtils) {
				const success = await addUtilToProject(util);
				if (success) successCount++;
			}

			console.log(
				chalk.green(
					`🎉 ${successCount} dari ${availableUtils.length} file utilitas berhasil ditambahkan!`
				)
			);
		} catch (error) {
			console.error(chalk.red("❌ Error:"), error.message);
			console.error(chalk.yellow("Stack trace:"), error.stack);
		}
	});

// Subcommand untuk menginstall semua (komponen dan utilitas)
addCommand
	.command("all")
	.description("Tambahkan semua komponen UI dan utilitas ke project")
	.action(async () => {
		try {
			console.log(
				chalk.blue(`🚀 Menambahkan semua komponen dan utilitas...`)
			);

			// Tambahkan semua komponen
			const components = await getAvailableComponents();
			let componentsSuccess = 0;
			if (components.length > 0) {
				console.log(
					chalk.blue(
						`📦 Menginstall ${components.length} komponen...`
					)
				);
				for (const component of components) {
					const success = await addComponentToProject(component);
					if (success) componentsSuccess++;
				}
			} else {
				console.log(
					chalk.yellow(`⚠️ Tidak ada komponen yang ditemukan`)
				);
			}

			// Tambahkan semua utilitas
			const utils = await getAvailableUtils();
			let utilsSuccess = 0;
			if (utils.length > 0) {
				console.log(
					chalk.blue(`📦 Menginstall ${utils.length} utilitas...`)
				);
				for (const util of utils) {
					const success = await addUtilToProject(util);
					if (success) utilsSuccess++;
				}
			} else {
				console.log(
					chalk.yellow(`⚠️ Tidak ada utilitas yang ditemukan`)
				);
			}

			// Tampilkan ringkasan
			console.log(
				chalk.green(
					`🎉 Instalasi selesai: ${componentsSuccess}/${components.length} komponen dan ${utilsSuccess}/${utils.length} utilitas berhasil ditambahkan!`
				)
			);
		} catch (error) {
			console.error(chalk.red("❌ Error:"), error.message);
			console.error(chalk.yellow("Stack trace:"), error.stack);
		}
	});

// Parse command line arguments
program.parse();
