import React, { useState, useRef, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  Image,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, verifyOtp } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Timer state for Resend OTP
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let interval;
    if (isVerifying && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isVerifying, timer]);

  const handleResendOtp = () => {
    setTimer(30);
    setCanResend(false);
    setOtpDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUpSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await signUp(firstName.trim(), lastName.trim(), email.trim(), password);
      setIsVerifying(true);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setErrors({ general: "Sign up failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text, index) => {
    const newDigits = [...otpDigits];

    if (text.length > 1) {
      const pasted = text.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || "";
      }
      setOtpDigits(newDigits);
      inputRefs.current[5]?.focus();
      return;
    }

    newDigits[index] = text;
    setOtpDigits(newDigits);
    if (errors.otp) setErrors({ ...errors, otp: undefined });

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifySubmit = async () => {
    const fullCode = otpDigits.join("");
    if (fullCode.length < 6) {
      setErrors({ otp: "Please enter all 6 digits of the code" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await verifyOtp(fullCode);
      router.replace("/(root)/(tabs)");
    } catch (err) {
      setErrors({ otp: "Invalid verification code. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require("../../assets/images/app_logo_1785056480414.png")} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
          </View>

          {isVerifying ? (
            /* OTP VERIFICATION VIEW */
            <View style={styles.formContainer}>
              <Text style={styles.title}>Verify Email 📩</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to{"\n"}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>

              {errors.otp ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{errors.otp}</Text>
                </View>
              ) : null}

              {/* 6 Digit Input Boxes */}
              <View style={styles.otpRow}>
                {otpDigits.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(ref) => (inputRefs.current[idx] = ref)}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, idx)}
                    onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                    keyboardType="number-pad"
                    maxLength={idx === 0 ? 6 : 1}
                    selectTextOnFocus
                    style={[
                      styles.otpBox,
                      digit ? styles.otpBoxFilled : null,
                      errors.otp ? styles.otpBoxError : null,
                    ]}
                  />
                ))}
              </View>

              {/* Resend Option */}
              <View style={styles.resendContainer}>
                {canResend ? (
                  <TouchableOpacity onPress={handleResendOtp} activeOpacity={0.7}>
                    <Text style={styles.resendActiveText}>Resend Code</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.resendText}>
                    Resend code in <Text style={styles.timerText}>{timer}s</Text>
                  </Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleVerifySubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <Text style={styles.buttonText}>Verify & Continue</Text>
                )}
              </TouchableOpacity>

              {/* Back to Edit Email */}
              <TouchableOpacity 
                style={styles.linkButton} 
                onPress={() => setIsVerifying(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.linkText}>
                  Wrong email? <Text style={styles.linkHighlight}>Edit Email</Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* SIGN UP DETAILS VIEW */
            <View style={styles.formContainer}>
              <Text style={styles.title}>Create Account ✨</Text>
              <Text style={styles.subtitle}>Enter your personal details to get started</Text>

              {errors.general ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{errors.general}</Text>
                </View>
              ) : null}

              {/* Row for First Name and Last Name */}
              <View style={styles.row}>
                <View style={styles.flexHalf}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    value={firstName}
                    placeholder="John"
                    placeholderTextColor="#71717A"
                    onChangeText={(text) => {
                      setFirstName(text);
                      if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                    }}
                    style={[styles.input, errors.firstName && styles.inputError]}
                  />
                  {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
                </View>

                <View style={styles.flexHalf}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    value={lastName}
                    placeholder="Doe"
                    placeholderTextColor="#71717A"
                    onChangeText={(text) => {
                      setLastName(text);
                      if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                    }}
                    style={[styles.input, errors.lastName && styles.inputError]}
                  />
                  {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
                </View>
              </View>

              {/* Email Address */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  placeholder="john.doe@example.com"
                  placeholderTextColor="#71717A"
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  style={[styles.input, errors.email && styles.inputError]}
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              {/* Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  value={password}
                  placeholder="At least 8 characters"
                  placeholderTextColor="#71717A"
                  secureTextEntry
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  style={[styles.input, errors.password && styles.inputError]}
                />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSignUpSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              {/* Link to Sign In */}
              <TouchableOpacity 
                style={styles.linkButton} 
                onPress={() => router.push("/(auth)/sign_in")}
                activeOpacity={0.7}
              >
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkHighlight}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  logoImage: {
    width: 140,
    height: 140,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#A1A1AA",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  emailHighlight: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  errorBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: "100%",
  },
  errorBannerText: {
    color: "#F87171",
    fontSize: 13,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 380,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
    width: "100%",
  },
  flexHalf: {
    flex: 1,
  },
  fieldGroup: {
    width: "100%",
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A1A1AA",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    backgroundColor: "#18181B",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#F87171",
    fontSize: 11,
    marginTop: 4,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginVertical: 12,
    width: "100%",
  },
  otpBox: {
    flex: 1,
    height: 54,
    backgroundColor: "#18181B",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  otpBoxFilled: {
    borderColor: "#FFFFFF",
    backgroundColor: "#27272A",
  },
  otpBoxError: {
    borderColor: "#EF4444",
  },
  resendContainer: {
    alignItems: "center",
    marginVertical: 14,
  },
  resendText: {
    color: "#71717A",
    fontSize: 13,
  },
  timerText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  resendActiveText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  linkText: {
    color: "#A1A1AA",
    fontSize: 14,
  },
  linkHighlight: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
