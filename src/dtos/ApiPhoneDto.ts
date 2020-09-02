export default interface ApiPhoneDto {
    phoneId: number;
    categoryId: number;
    name: string;
    os: "Android" | "iOS" | "Windows" | "Blackberry";
    description: string
    ramSize: number;
    storageSize: number;
    screenSize: number;
    phoneNetworks: {
        phoneNetworkId: number;
        networkId: number;
        band: string;
    }[];
    networks: {
        networkId: number;
        name: string;
    }[];
    phonePrices: {
        phonePriceId: number;
        price: number;
    }[];
    photos: {
        photoId: number;
        imagePath: string;
    }[];
    category: {
        name: string;
    };
}

//ova struktura je ona koju dobijamo