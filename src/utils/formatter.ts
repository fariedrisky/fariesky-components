export const formatGender = (value: string) => {
    try {
        return value === "l" ? "Laki-laki" : "Perempuan";
    } catch {
        return value;
    }
};

export const formatWhatsApp = (value: string) => {
    try {
        // Format nomor WhatsApp jika perlu
        return value;
    } catch {
        return value;
    }
};

export const formatAddress = (value: string) => {
    try {
        // Truncate alamat yang terlalu panjang
        return value.length > 50 ? value.substring(0, 47) + "..." : value;
    } catch {
        return value;
    }
};

export const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString("id-ID");
    } catch {
        return dateString;
    }
};

export const formatCurrency = (value: number) => {
    try {
        return value.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
        });
    } catch {
        return value.toString();
    }
};

