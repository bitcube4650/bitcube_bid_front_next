import React, { Dispatch, SetStateAction } from 'react';

export interface MapType {
    [key: string]: any;
}

export interface SrcInputProps {
    onSearch: Function;
    srcData: MapType;
    setSrcData: Dispatch<SetStateAction<MapType>>;
    name?: string;
    maxLength?: number;
};

export interface PageProps {
    srcData: MapType;
    setSrcData: Dispatch<SetStateAction<MapType>>;
    list: MapType;
}

export interface ListProps {
    content: MapType;
    isMain?: boolean;
}