'use client'
import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {IconMail, IconMessage, IconDeviceMobile, IconLoader} from '@tabler/icons-react';

import TurnstileWidget from "@/components/ui/CaptchaWidget";
import {useCaptcha} from "@/hooks/useCaptcha";

// LoginForm.tsx
interface LoginFormProps {
    onLogin: (username: string, password: string, CAPTCHA: boolean) => Promise<void>;  // 更新這行
    onEmailAuth: () => void;
    onSmsAuth: () => void;
    onDeviceAuth: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
                                                 onLogin,
                                                 onEmailAuth,
                                                 onSmsAuth,
                                                 onDeviceAuth
                                             }) => {
    const {
        isCaptchaVerified,
        handleCaptchaSuccess,
        handleCaptchaError,
        verifyCaptcha
    } = useCaptcha();
    const [currentStep, setCurrentStep] = useState<'username' | 'password' | 'otherOptions'>('username');
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState({username: '', password: ''});
    const [isLoading, setIsLoading] = useState(false);

    const pageTransition = {
        hidden: {
            opacity: 0,
            scale: direction === 'forward' ? 0.95 : 1.05,
            transition: {
                duration: 0.3
            }
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                type: "spring",
                bounce: 0.25
            }
        },
        exit: {
            opacity: 0,
            scale: direction === 'forward' ? 1.05 : 0.95,
            transition: {
                duration: 0.3
            }
        }
    };

    const stepOrder = ['username', 'password', 'otherOptions'];

    const handleStepChange = (newStep: typeof currentStep) => {
        const currentIndex = stepOrder.indexOf(currentStep);
        const newIndex = stepOrder.indexOf(newStep);
        setDirection(newIndex > currentIndex ? 'forward' : 'backward');
        setCurrentStep(newStep);
    };

    const handleNextStep = async () => {
        if (!username.trim()) {
            setError(prev => ({...prev, username: '請輸入帳號'}));
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setNickname(username);
            handleStepChange('password');
            setError(prev => ({...prev, username: ''}));
        } catch (err) {
            setError(prev => ({...prev, username: '帳號驗證失敗'}));
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

// handleLogin 函數更新
    const handleLogin = async () => {
        if (!password.trim()) {
            setError(prev => ({...prev, password: '請輸入密碼'}));
            return;
        }

        if (!isCaptchaVerified) {
            setError(prev => ({...prev, password: '請完成人機驗證'}));
            return;
        }

        setIsLoading(true);
        try {
            const isVerified = await verifyCaptcha();
            if (!isVerified) {
                setError(prev => ({...prev, password: 'CAPTCHA 驗證失敗'}));
                return;
            }
            await onLogin(username, password, isCaptchaVerified);  // 確保這裡傳遞 3 個參數
            setError(prev => ({...prev, password: ''}));
        } catch (err) {
            setError(prev => ({...prev, password: '登入失敗'}));
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md relative">
                <div className="h-[450px] flex items-center justify-center">
                    <AnimatePresence mode="wait" initial={false}>
                        {currentStep === 'username' && (
                            <motion.div
                                key="username"
                                variants={pageTransition}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="w-full bg-white rounded-lg shadow-lg p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">登入</h2>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="usernameInput"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="輸入您的帳號"
                                            required
                                        />
                                        <AnimatePresence>
                                            {error.username && (
                                                <motion.p
                                                    initial={{opacity: 0, y: -10}}
                                                    animate={{opacity: 1, y: 0}}
                                                    exit={{opacity: 0, y: -10}}
                                                    className="text-red-500 text-sm mt-1"
                                                >
                                                    {error.username}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                        {isLoading && (
                                            <div className="absolute right-3 top-3">
                                                <IconLoader className="animate-spin" size={20}/>
                                            </div>
                                        )}
                                    </div>
                                    <motion.button
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                        onClick={handleNextStep}
                                        disabled={isLoading}
                                        className={`w-full bg-blue-600 text-white py-2 rounded-lg transition-colors
                      ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                    >
                                        下一步
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 'password' && (
                            <motion.div
                                key="password"
                                variants={pageTransition}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="w-full bg-white rounded-lg shadow-lg p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">歡迎使用</h2>
                                <div className="text-lg text-gray-600 mb-6">{nickname}</div>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="passwordInput"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}

                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="輸入您的密碼"
                                            required
                                        />
                                        <AnimatePresence>
                                            {error.password && (
                                                <motion.p
                                                    initial={{opacity: 0, y: -10}}
                                                    animate={{opacity: 1, y: 0}}
                                                    exit={{opacity: 0, y: -10}}
                                                    className="text-red-500 text-sm mt-1"
                                                >
                                                    {error.password}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                        <TurnstileWidget
                                            onSuccess={handleCaptchaSuccess}
                                            onError={handleCaptchaError}
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                        onClick={handleLogin}
                                        disabled={isLoading}
                                        className={`w-full bg-blue-600 text-white py-2 rounded-lg transition-colors
                      ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                    >
                                        登入
                                    </motion.button>
                                    <div className="flex space-x-4">
                                        <motion.button
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            onClick={() => handleStepChange('otherOptions')}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            其他登入方式
                                        </motion.button>
                                        <motion.button
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            onClick={() => handleStepChange('username')}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            返回
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 'otherOptions' && (
                            <motion.div
                                key="otherOptions"
                                variants={pageTransition}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="w-full bg-white rounded-lg shadow-lg p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">其他登入方式</h2>
                                <div className="space-y-4">
                                    <motion.button
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                        onClick={onEmailAuth}
                                        className="w-full flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <IconMail className="mr-3" size={20}/>
                                        <span>電子信箱驗證碼</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                        onClick={onSmsAuth}
                                        className="w-full flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <IconMessage className="mr-3" size={20}/>
                                        <span>簡訊驗證碼</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                        onClick={onDeviceAuth}
                                        className="w-full flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <IconDeviceMobile className="mr-3" size={20}/>
                                        <span>裝置憑證/PassKey 驗證</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                        onClick={() => handleStepChange('password')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mt-4"
                                    >
                                        返回密碼登入
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
