import { useMemo, useRef, useState } from "react";

import { TextInput } from "react-native";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { VerifyForgotPasswordViewModel } from "@/presentation/viewmodels/VerifyForgotPasswordViewModel";

import {
  verifyForgotPasswordSchema,
  VerifyForgotPasswordFormData,
} from "@/presentation/validation/verify-forgot-password.schema";

import { VerifyForgotPasswordResult } from "@/domain/repositories/user.repository";

type MessageType = "success" | "error" | "warning" | "info";

interface Params {
  verificationId: string;

  email: string;

  onVerified?: (result: VerifyForgotPasswordResult) => void;
}

export function useVerifyResetCodeForm({
  verificationId,
  email,
  onVerified,
}: Params) {
  const vm = useMemo(() => new VerifyForgotPasswordViewModel(), []);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState<MessageType>("info");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyForgotPasswordFormData>({
    resolver: zodResolver(verifyForgotPasswordSchema),

    defaultValues: {
      otp: "",
    },

    mode: "onSubmit",
  });

  const otp = watch("otp");

  const handleVerify = async (data: VerifyForgotPasswordFormData) => {
    if (loading || resending) {
      return;
    }

    setLoading(true);

    setMessage("");

    try {
      const result = await vm.verify(verificationId, data.otp);

      if (!result.success) {
        setMessage(result.error ?? "Verification failed.");

        setMessageType("error");

        return;
      }

      if (result.data) {
        onVerified?.(result.data);
      }
    } catch (error) {
      console.error("Reset code verification error:", error);

      setMessage("Something went wrong. Please try again.");

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (loading || resending) {
      return;
    }

    setResending(true);

    setMessage("");

    try {
      const result = await vm.resend(email);

      if (result.success) {
        setMessage("Reset code resent. Check your email.");

        setMessageType("info");
      } else {
        setMessage(result.error ?? "Failed to resend code.");

        setMessageType("error");
      }
    } catch (error) {
      console.error("Resend reset code error:", error);

      setMessage("Unable to resend the code. Please try again.");

      setMessageType("error");
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);

    if (digits.length === 6) {
      setValue("otp", digits, {
        shouldValidate: false,
        shouldDirty: true,
      });

      inputRefs.current[5]?.focus();

      return;
    }

    const digit = digits.slice(-1);

    const otpArray = otp.padEnd(6, "").split("");

    otpArray[index] = digit;

    const newOtp = otpArray.join("").slice(0, 6);

    setValue("otp", newOtp, {
      shouldValidate: false,
      shouldDirty: true,
    });

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return {
    control,

    errors,

    otp,

    inputRefs,

    message,

    messageType,

    loading,

    resending,

    handleSubmit,

    handleVerify,

    handleResend,

    handleOtpChange,

    handleOtpKeyPress,
  };
}
