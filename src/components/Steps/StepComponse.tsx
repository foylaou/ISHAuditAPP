// 'use client'
// import React, { ReactNode, useState, useRef, useEffect, createContext, useContext } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
//
// // Step Context to manage state across steps
// const StepContext = createContext({
//   currentStep: 0,
//   totalSteps: 0,
//   goToStep: (step: number) => {},
//   nextStep: () => {},
//   prevStep: () => {},
//   stepData: {},
//   updateStepData: (data: any) => {}
// });
//
// // Hook to use step context
// export const useStepContext = () => useContext(StepContext);
//
// // Types for our components
// interface MultiStepFormProps {
//   children: ReactNode;
//   initialData?: any;
//   onComplete?: (formData: any) => void;
//   defaultStep?: number;
// }
//
// interface StepsContainerProps {
//   children: ReactNode;
//   vertical?: boolean;
//   className?: string;
// }
//
// interface StepProps {
//   children: ReactNode;
//   status?: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
//   onClick?: () => void;
//   disabled?: boolean;
//   className?: string;
// }
//
// interface StepContentProps {
//   step: number;
//   children: ReactNode;
// }
//
// // Main MultiStepForm Component
// export const MultiStepForm: React.FC<MultiStepFormProps> = ({
//   children,
//   initialData = {},
//   onComplete,
//   defaultStep = 0
// }) => {
//   const [currentStep, setCurrentStep] = useState(defaultStep);
//   const [stepData, setStepData] = useState(initialData);
//
//   // Count total steps
//   const totalSteps = React.Children.count(children);
//
//   // Navigate to a specific step
//   const goToStep = (step: number) => {
//     if (step >= 0 && step < totalSteps) {
//       setCurrentStep(step);
//     }
//   };
//
//   // Go to next step
//   const nextStep = () => {
//     if (currentStep < totalSteps - 1) {
//       setCurrentStep(prev => prev + 1);
//     } else if (onComplete) {
//       onComplete(stepData);
//     }
//   };
//
//   // Go to previous step
//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(prev => prev - 1);
//     }
//   };
//
//   // Update form data
//   const updateStepData = (data: any) => {
//     setStepData(prev => ({
//       ...prev,
//       ...data
//     }));
//   };
//
//   // Context value
//   const contextValue = {
//     currentStep,
//     totalSteps,
//     goToStep,
//     nextStep,
//     prevStep,
//     stepData,
//     updateStepData
//   };
//
//   return (
//     <StepContext.Provider value={contextValue}>
//       <div className="flex flex-col w-full">
//         {children}
//       </div>
//     </StepContext.Provider>
//   );
// };
//
// // Step Container Component
// export const StepsContainer: React.FC<StepsContainerProps> = ({
//   children,
//   vertical = false,
//   className = ""
// }) => {
//   return (
//     <ul className={`steps ${vertical ? 'steps-vertical' : ''} w-full ${className}`}>
//       {children}
//     </ul>
//   );
// };
//
// // Single Step Component
// export const Step: React.FC<StepProps> = ({
//   children,
//   status = 'default',
//   onClick,
//   disabled = false,
//   className = ""
// }) => {
//   // In DaisyUI, step status: default, primary, secondary, accent, info, success, warning, error
//   const statusClass = status !== 'default' ? `step-${status}` : '';
//
//   return (
//     <li
//       className={`step text-neutral-content ${statusClass} ${className} ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
//       onClick={disabled ? undefined : onClick}
//     >
//       {children}
//     </li>
//   );
// };
//
// // StepContent - Content for each step that will be shown/hidden based on current step
// export const StepContent: React.FC<StepContentProps> = ({ step, children }) => {
//   const { currentStep } = useStepContext();
//
//   if (step !== currentStep) return null;
//
//   return (
//     <motion.div
//       key={step}
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       transition={{ duration: 0.3 }}
//       className="w-full"
//     >
//       {children}
//     </motion.div>
//   );
// };
//
// // StepAnimation - Container for animating between steps
// export const StepAnimation: React.FC<{children: ReactNode}> = ({ children }) => {
//   const { currentStep } = useStepContext();
//
//   return (
//     <AnimatePresence mode="wait">
//       <div key={currentStep} className="w-full">
//         {children}
//       </div>
//     </AnimatePresence>
//   );
// };
//
// // Navigation Helper Component
// export const StepNavigation: React.FC<{
//   prevLabel?: string;
//   nextLabel?: string;
//   onNext?: () => boolean | Promise<boolean>; // Return false to prevent navigation
//   onPrev?: () => boolean | Promise<boolean>; // Return false to prevent navigation
//   isNextLoading?: boolean;
//   isPrevLoading?: boolean;
//   hideNext?: boolean;
//   hidePrev?: boolean;
// }> = ({
//   prevLabel = "Previous",
//   nextLabel = "Next",
//   onNext,
//   onPrev,
//   isNextLoading = false,
//   isPrevLoading = false,
//   hideNext = false,
//   hidePrev = false
// }) => {
//   const { nextStep, prevStep, currentStep, totalSteps } = useStepContext();
//
//   const handleNext = async () => {
//     if (onNext) {
//       const canProceed = await onNext();
//       if (canProceed !== false) {
//         nextStep();
//       }
//     } else {
//       nextStep();
//     }
//   };
//
//   const handlePrev = async () => {
//     if (onPrev) {
//       const canProceed = await onPrev();
//       if (canProceed !== false) {
//         prevStep();
//       }
//     } else {
//       prevStep();
//     }
//   };
//
//   return (
//     <div className="flex justify-between w-full mt-6">
//       {!hidePrev && currentStep > 0 && (
//         <button
//           className="btn btn-outline"
//           onClick={handlePrev}
//           disabled={isPrevLoading}
//         >
//           {isPrevLoading ? (
//             <>
//               <span className="loading loading-spinner loading-xs"></span>
//               Loading...
//             </>
//           ) : prevLabel}
//         </button>
//       )}
//
//       {!hideNext && (
//         <button
//           className="btn btn-primary ml-auto"
//           onClick={handleNext}
//           disabled={isNextLoading}
//         >
//           {isNextLoading ? (
//             <>
//               <span className="loading loading-spinner loading-xs"></span>
//               Loading...
//             </>
//           ) : currentStep === totalSteps - 1 ? "Complete" : nextLabel}
//         </button>
//       )}
//     </div>
//   );
// };
//
// // Card Component for Step Content
// export const StepCard: React.FC<{
//   title?: string | ReactNode;
//   children: ReactNode;
//   className?: string;
// }> = ({ title, children, className = "" }) => {
//   return (
//     <div className={`card w-full bg-base-200 shadow-md text-base-content ${className}`}>
//       <div className="card-body">
//         {title && (
//           typeof title === 'string'
//             ? <h3 className="card-title text-primary">{title}</h3>
//             : title
//         )}
//         {children}
//       </div>
//     </div>
//   );
// };
//
// // Export all components
// export {
//   StepContext
// };
