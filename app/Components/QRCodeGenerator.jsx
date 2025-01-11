import QRCode from "react-qr-code";

export default function QRCodeGenerator({ value }) {
    return (
        <div className="flex justify-center">
            <QRCode value={value} size={128} />
        </div>
    );
}
