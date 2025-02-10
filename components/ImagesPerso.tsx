import React from 'react';
import Image from 'next/image';
export default function ImagesFunko({ src, width, height }: any) {


    return (
        <div className='flex flex-col'>
            <Image
                src={src}
                alt="Funkos"
                className="w-auto h-auto rounded-lg shadow-lg border-2 "
                width={width}
                height={height}>
            </Image>
        </div>
    );
}
