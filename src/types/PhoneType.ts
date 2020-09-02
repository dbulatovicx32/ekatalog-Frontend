export default class PhoneType {
    phoneId?: number;
    name?: string;
    os?: "Android" | "iOS" | "Windows" | "Blackberry";
    ramSize?: number;
    storageSize?: number;
    screenSize?: number;
    description?: string;
    imageUrl?: string;
    price?: number;
    phoneNetworks?: {
        phoneNetworkId: number;
        networkId: number;
        band: string;
    }[];
    networks?: {
        networkId: number;
        name: string;
    }[];
    phonePrices?: {
        phonePriceId: number;
        price: number;
    }[];
    photos?: {
        photoId: number;
        imagePath: string;
    }[];
    category?: {
        name: string;
    };
}
