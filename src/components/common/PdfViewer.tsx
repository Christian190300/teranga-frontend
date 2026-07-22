interface PdfViewerProps {
    url: string;
}

export function PdfViewer({ url }: PdfViewerProps) {

    return (
        <iframe
            src={url}
            width="100%"
            height="800px"
            style={{
                border: "none",
                borderRadius: "12px"
            }}
            title="Document PDF"
        />
    );
}