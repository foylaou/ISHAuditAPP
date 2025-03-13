// Define proper types based on backend implementation
export interface ServerOptions {
  options: PublicKeyCredentialRequestOptions & {
    challenge: string;
    allowCredentials?: Array<{
      id: string;
      type: string;
      transports?: AuthenticatorTransport[];
    }>;
  };
  sessionData: string; // This is a string in the server's implementation
}

export interface SessionData {
  challenge: string;
  userId?: string;
  timeout?: number;
  [key: string]: unknown;
}

export interface VerificationResponse {
  success: boolean;
  token?: string;
  message?: string;
}

// Match the exact structure expected by the server
export interface AssertionResult {
  // These properties match your backend's AuthenticatorAssertionRawResponse structure
  id: string;
  rawId: string;
  type: string;
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle: string | null;
  };
  sessionData: string; // String to match the backend's implementation
}
