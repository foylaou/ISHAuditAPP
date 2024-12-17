// types/webauthn.ts
export interface PublicKeyCredentialCreationOptionsJSON {
  challenge: string;
  rp: PublicKeyCredentialRpEntity;
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: PublicKeyCredentialParameters[];
  timeout?: number;
  excludeCredentials?: PublicKeyCredentialDescriptorJSON[];
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  attestation?: AttestationConveyancePreference;
}

export interface PublicKeyCredentialDescriptorJSON {
  id: string;
  type: PublicKeyCredentialType;
  transports?: AuthenticatorTransport[];
}

export interface AuthenticationResponseJSON {
  id: string;
  rawId: string;
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle: string | null;
  };
  type: PublicKeyCredentialType;
}

export interface RegistrationResponseJSON {
  id: string;
  rawId: string;
  response: {
    attestationObject: string;
    clientDataJSON: string;
  };
  type: PublicKeyCredentialType;
}

