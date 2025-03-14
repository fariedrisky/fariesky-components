// utils/formValidation.ts

/**
 * Validates username format and restrictions
 * @param username Username to validate
 * @returns Error message if validation fails, null otherwise
 */
export function validateUsername(username: string): string | null {
    // Check if username is empty
    if (!username) {
        return 'Username wajib diisi';
    }

    // Username must be lowercase
    if (username !== username.toLowerCase()) {
        return 'Username harus huruf kecil';
    }

    // Username must not contain spaces
    if (username.includes(' ')) {
        return 'Username tidak boleh mengandung spasi';
    }

    // Username must not contain hyphens
    if (username.includes('-')) {
        return 'Username tidak boleh mengandung tanda strip (-)';
    }

    // Validate username using regex (lowercase, allow letters, numbers, underscore)
    const usernameRegex = /^[a-z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return 'Username hanya boleh mengandung huruf kecil, angka, dan underscore (_)';
    }

    return null;
}

/**
 * Validates email format
 * @param email Email to validate
 * @returns Error message if validation fails, null otherwise
 */
export function validateEmail(email: string): string | null {
    if (!email) {
        return 'Email wajib diisi';
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Format email tidak valid';
    }

    return null;
}

/**
 * Validates password strength
 * @param password Password to validate
 * @param isEditMode Whether in edit mode (where password can be empty)
 * @returns Error message if validation fails, null otherwise
 */
export function validatePassword(password: string, isEditMode: boolean): string | null {
    // In edit mode, empty password is allowed (meaning no change)
    if (isEditMode && !password) {
        return null;
    }

    if (!password) {
        return 'Password wajib diisi';
    }

    if (password.length < 6) {
        return 'Password minimal 6 karakter';
    }

    return null;
}

/**
 * Validates phone number format
 * @param phoneNumber Phone number to validate
 * @returns Error message if validation fails, null otherwise
 */
export function validatePhoneNumber(phoneNumber: string): string | null {
    if (!phoneNumber) {
        return 'Nomor wajib diisi';
    }

    // Remove spaces, dashes, and parentheses for validation
    const cleanedNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');

    // Handle + prefix separately to avoid issues with the digit check
    const hasPlus = cleanedNumber.startsWith('+');
    const digitsOnly = hasPlus ? cleanedNumber.substring(1) : cleanedNumber;

    // Check if remaining chars are only digits
    if (!/^\d+$/.test(digitsOnly)) {
        return 'Nomor hanya boleh berisi angka';
    }

    // Prepare number for length validation (with or without + sign)
    const numberForValidation = hasPlus ? cleanedNumber : cleanedNumber;

    // Check specific formats for Indonesia
    if (numberForValidation.startsWith('08')) {
        // Indonesian format starting with 08
        if (numberForValidation.length < 10) {
            return 'Nomor Indonesia harus terdiri dari 10-13 digit';
        } else if (numberForValidation.length > 13) {
            return 'Nomor anda kelebihan atau nomor anda tidak sesuai';
        }
    } else if (numberForValidation.startsWith('+62') || numberForValidation.startsWith('62')) {
        // Indonesian format with country code
        const withoutCountryCode = numberForValidation.replace(/^\+?62/, '');
        if (withoutCountryCode.length < 8) {
            return 'Nomor Indonesia harus terdiri dari 10-13 digit (termasuk kode negara)';
        } else if (withoutCountryCode.length > 12) {
            return 'Nomor anda kelebihan atau nomor anda tidak sesuai';
        }
    } else if (hasPlus || /^\d{1,3}/.test(numberForValidation)) {
        // International format (starting with + or 1-3 digit country code)
        if (numberForValidation.length < 8) {
            return 'Nomor internasional harus terdiri dari 8-15 digit (termasuk kode negara)';
        } else if (numberForValidation.length > 15) {
            return 'Nomor anda kelebihan atau nomor anda tidak sesuai';
        }
    } else {
        // If doesn't match any known format
        return 'Format nomor tidak valid. Gunakan format Indonesia (08xx/+62) atau format internasional (+kode negara)';
    }

    return null;
}
/**
 * Validates that the name is not empty
 * @param name Name to validate
 * @returns Error message if validation fails, null otherwise
 */
export function validateName(name: string): string | null {
    if (!name) {
        return 'Nama lengkap wajib diisi';
    }

    if (name.length < 3) {
        return 'Nama terlalu pendek';
    }

    return null;
}

/**
 * Validates gender selection
 * @param gender Selected gender
 * @returns Error message if validation fails, null otherwise
 */
export function validateGender(gender: string): string | null {
    if (!gender) {
        return 'Jenis kelamin wajib dipilih';
    }

    if (gender !== 'MALE' && gender !== 'FEMALE') {
        return 'Jenis kelamin tidak valid';
    }

    return null;
}
