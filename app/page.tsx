"use client";
import React, { useState } from "react";
import {
  CldUploadButton,
  CldUploadWidgetResults,
  CldUploadWidget,
} from "next-cloudinary";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

type Props = {};

function HomePage({}: Props) {
  const [urls, setUrls] = useState<string[]>([]);
  const [isCopiedArray, setIsCopiedArray] = useState<boolean[]>([]);
  const { toast } = useToast();
  const handleImageUpload = (result: CldUploadWidgetResults) => {
    const info = result.info as object;
    if ("secure_url" in info && "public_id" in info) {
      const url = info.secure_url as string;
      setUrls((prevUrls) => [...prevUrls, url]);
      setIsCopiedArray((prevArray) => [...prevArray, false]);
    }
  };
  const copyToClipboard = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied the url.", duration: 1000 });
    setIsCopiedArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = true; // Set copied state to true for the specific URL
      return newArray;
    });
    setTimeout(() => {
      setIsCopiedArray((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = false; // Reset copied state to false after 1 second
        return newArray;
      });
    }, 1000);
  };
  const deleteImage = (index: number) => {
    setUrls((prevUrls) => {
      const newUrls = [...prevUrls];
      newUrls.splice(index, 1); // Remove the URL at the specified index
      return newUrls;
    });
    toast({ title: "image deleted.", duration: 1000, variant: "destructive" });
    setIsCopiedArray((prevArray) => {
      const newArray = [...prevArray];
      newArray.splice(index, 1); // Remove the copied state at the specified index
      return newArray;
    });
  };
  return (
    <>
      <div className="flex items-center justify-center flex-col gap-3 p-4 min-h-screen">
        <CldUploadWidget
          options={{ folder: "upload" }}
          onUpload={handleImageUpload}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        >
          {({ open }) => {
            return <Button onClick={() => open()}>Upload an Image</Button>;
          }}
        </CldUploadWidget>
        {urls.length > 0 && (
          <Table>
            <TableCaption>List of your images</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead className="w-[50px]">Url</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urls.map((url, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Image src={url} width={200} height={175} alt={url} />
                  </TableCell>
                  <TableCell>{url}</TableCell>
                  <TableCell className="space-x-3">
                    <Button
                      disabled={isCopiedArray[index]}
                      onClick={() => copyToClipboard(url, index)}
                    >
                      {isCopiedArray[index] ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => deleteImage(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

export default HomePage;
