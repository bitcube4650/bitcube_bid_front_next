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
}

export interface EditInputProps {
    defaultValue: any;
    editData: MapType;
    setEditData: Dispatch<SetStateAction<MapType>>;
    name: string;
    maxLength?: number;
}

export interface EditInputRadioProps {
    editData: MapType;
    setEditData: Dispatch<SetStateAction<MapType>>;
    id: string;
    name: string;
    value: string;
    label: string;
    checked?: boolean;
    disabled?: boolean;
}

export interface EditInputFileProps {
    setUploadFile: Dispatch<SetStateAction<File | undefined | null>>;
    editData: MapType;
    setEditData: Dispatch<SetStateAction<MapType>>;
    fileName?:string
}

export interface PageProps {
    srcData: MapType;
    setSrcData: Dispatch<SetStateAction<MapType>>;
    list: MapType;
}

export interface ListProps {
    content: MapType;
    isMain?: boolean;
}
