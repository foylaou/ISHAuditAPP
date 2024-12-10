import { Turnstile } from '@marsidev/react-turnstile';

interface CaptchaWidgetProps {
  onSuccess: () => void;
  onError: () => void;
}

const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({ onSuccess, onError }) => {
  const key = process.env.NEXT_PUBLIC_SIDEKEY; // 從環境變數讀取 siteKey

  return (
    <div className="flex justify-center items-center my-4">
      <Turnstile
        siteKey={key || ""} // 傳遞 siteKey
        onSuccess={onSuccess} // 成功回呼函數
        onError={onError}     // 失敗回呼函數
      />
    </div>
  );
};

export default CaptchaWidget;
