export interface ImageType {
    name: string;
    tags: string[];
    height: number;
    width: number;
    title?: string;
    description?: string;
}

export interface Size {
    width: number;
    height: number;
}

export interface Position extends Size {
    top: number;
    left: number;
}

export interface PositionOnly {
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export type ImageMetaData = {
    fNumber: string;
    focalLength: string;
    iso: string;
    shutterSpeed: string;
    dateTime: string;
    lensModel: string;
    cameraModel: string;
    description?: string;
    title?: string;
};