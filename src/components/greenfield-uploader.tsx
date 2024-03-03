import { Button, Card, Image, Space, Typography } from "antd";
import { ChangeEvent, useCallback, useRef } from "react";
import { client } from "@/client/client";
import { authenticate } from "@/client/auth";
import { uploadFile } from "@/client/greenfieldUploadFile";
import { v4 as uuidv4 } from 'uuid';
type ValuesItem = { file?: File; url: string };

interface GreenfieldPushProps {
    values?: Array<ValuesItem>;
    onChange: (values: Array<ValuesItem>) => void;
    onInsert: (imageIndex: number) => void;
    className?: string;
  }

export async function publishToGreenfield({ title, brief, markdown, images, bucket, address, readClient, walletClient}) {
    try {
        const dirName = uuidv4();
        const textContent = `${title}\n\n----\n\n${brief}`;
        // Convert text content to a Blob (you might need to adjust MIME type and encoding as necessary)
        const textBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const textFileName = `${dirName}/name_description.txt`;
        
        // Convert markdown content to a Blob
        const markdownBlob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const markdownFileName = `${dirName}/content.md`;
        
        // Upload text file
        await uploadFile(textFileName, bucket, textBlob, { user: address, viemClient: walletClient, readClient, window });
        
        // Upload markdown file
        await uploadFile(markdownFileName, bucket, markdownBlob, { user: address, viemClient: walletClient, readClient, window });

        // Upload images
        for (const image of images) {
            const imageName = image.file.name; // Ensure this gets a valid name from your `image` object
            const imagePath = `${dirName}/images/${imageName}`;
            await uploadFile(imagePath, bucket, image.file, { user: address, viemClient: walletClient, readClient, window });
        }

        console.log('Article published successfully');
    } catch (error) {
        // Handle errors
        console.error('Error publishing article:', error);
    }
}
