import { useMemo, useRef, useState } from "react";

import { TextInput } from "react-native";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { VerifyEmailViewModel } from "@/presentation/viewmodels/VerifyEmailViewModel";

import {
  verifyEmailSchema,
  VerifyEmailFormData,
} from "@/presentation/validation/verify-email.schema";

type MessageType = "success" | "error" | "warning" | "info";

interface Params {
  verificationId: string;
  email: string;
  password: string;
}

export function useVerifyEmailForm({
  verificationId,
  email,
  password,
}: Params) {
  const vm = useMemo(() => new VerifyEmailViewModel(), []);

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
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),

    defaultValues: {
      otp: "",
    },

    mode: "onSubmit",
  });

  const otp = watch("otp");

  const handleVerify = async (data: VerifyEmailFormData) => {
    if (loading || resending) {
      return;
    }

    setLoading(true);

    setMessage("");

    try {
      const result = await vm.verify(verificationId, data.otp, email, password);

      if (!result.success) {
        setMessage(result.error ?? "Verification failed.");

        setMessageType("error");

        return;
      }

      setMessage(`Welcome ${result.data?.user?.name ?? ""}!`);

      setMessageType("success");
    } catch (error) {
      console.error("Email verification error:", error);

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
        setMessage("Verification code resent. Check your email.");

        setMessageType("info");
      } else {
        setMessage(result.error ?? "Failed to resend code.");

        setMessageType("error");
      }
    } catch (error) {
      console.error("Resend verification error:", error);

      setMessage("Unable to resend the code. Please try again.");

      setMessageType("error");
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);

    /*
     * Handle full OTP paste.
     */
    if (digits.length === 6) {
      setValue("otp", digits, {
        shouldValidate: false,
        shouldDirty: true,
      });

      inputRefs.current[5]?.focus();

      return;
    }

    /*
     * Only use the first digit
     * for the current input.
     */
    const digit = digits.slice(-1);

    const otpArray = otp.padEnd(6, "").split("");

    otpArray[index] = digit;

    const newOtp = otpArray.join("").slice(0, 6);

    setValue("otp", newOtp, {
      shouldValidate: false,
      shouldDirty: true,
    });

    /*
     * Move to next input.
     */
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    /*
     * Move backwards when
     * pressing backspace on
     * an empty field.
     */
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
