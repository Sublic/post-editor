"use client";

import { Button, Card, Image, Space, Typography } from "antd";
import { ChangeEvent, useCallback, useRef } from "react";

type ValuesItem = { file?: File; url: string };

interface ImagesProps {
  values?: Array<ValuesItem>;
  onChange: (values: Array<ValuesItem>) => void;
  onInsert: (imageIndex: number) => void;
  className?: string;
}

export function Images({ values, className, onChange, onInsert }: ImagesProps) {
  const input = useRef<HTMLInputElement>(null);

  const onClick = useCallback(() => {
    if (input.current) {
      input.current.click();
    }
  }, [input]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        const url = reader.result.toString();
        onChange([...(values || []), { file: e.target!.files![0], url }]);

        e.target.files = null;
      }
    };

    if (e.target?.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <Card className={className} classNames={{ body: "flex justify-start" }}>
      <input
        type="file"
        className="hidden"
        style={{ display: "none" }}
        accept=".jpg,.jpeg,.png,.svg"
        ref={input}
        onChange={onFileChange}
      />
      <Space wrap size={[8, 8]}>
        {values?.map((v, i) => (
          <Image
            key={i}
            src={v.url}
            alt={`img:${i}`}
            width={64}
            height={64}
            className="hover:blur-sm"
            preview={{
              toolbarRender: () => (
                <Space className="toolbar-wrapper" size={12}>
                  <Button type="primary" onClick={() => onInsert(i)}>
                    Insert
                  </Button>
                  <Button
                    type="dashed"
                    onClick={() =>
                      onChange(values.filter((oldValue) => oldValue !== v))
                    }
                  >
                    Delete
                  </Button>
                </Space>
              ),
            }}
          />
        ))}
        <Button
          type="dashed"
          className="w-[64px] h-[64px] flex text-center items-center justify-center"
          onClick={onClick}
        >
          <Typography.Text>+</Typography.Text>
        </Button>
      </Space>
    </Card>
  );
}
