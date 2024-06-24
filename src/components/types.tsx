import React, { Dispatch, SetStateAction } from 'react';

export interface MapType {
    [key: string]: any;
}

export interface SrcInputProps {
    onSearch?: Function;
    srcData: MapType;
    setSrcData: Dispatch<SetStateAction<MapType>>;
    type?: string;
    className?: string;
    value?: string;
    placeholder?: string;
    name?: string;
    maxLength?: number;
    readOnly?: boolean;
    disabled?: boolean;
    style? : React.CSSProperties;
}

export interface SrcCheckProps {
    srcData: MapType;
    setSrcData: Dispatch<SetStateAction<MapType>>;
    name?: string;
    maxLength?: number;
    id?: string;
    text?: string;
    defaultChecked?: boolean;
}

export interface SrcDatePickerProps {
    name: string;
    srcData: MapType;
    setSrcData: Dispatch<SetStateAction<MapType>>;
    selected?: Date;
}

export interface EditDatePickerProps {
    name: string;
    data: any;
    setData: Dispatch<SetStateAction<any>>;
    selected?: Date;
}

export interface SrcSelectBoxProps {
    onSearch: Function;
    srcData: MapType;
    setSrcData: Dispatch<SetStateAction<MapType>>;
    name?: string;
    optionList?: Array<MapType>;
    valueKey?: string;
    nameKey?: string;
    totalText?: string;
    value?: string;
}

export interface EditInputProps {
    editData: MapType;
    setEditData: Dispatch<SetStateAction<MapType>>;
    type?: string;
    className?: string;
    value?: string;
    placeholder?: string;
    name?: string;
    maxLength?: number;
    readOnly?: boolean;
    disabled?: boolean;
}

export interface EditInputRadioProps {
    editData: MapType;
    setEditData: Dispatch<SetStateAction<MapType>>;
    id: string;
    name: string;
    value: string;
    label: string;
    className?: string;
    checked?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
}

export interface EditInputFileProps {
    setUploadFile: Dispatch<SetStateAction<File | undefined | null>>;
    editData: MapType;
    setEditData: Dispatch<SetStateAction<MapType>>;
    fileName?:string;
    name:string;
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