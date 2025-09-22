from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
import base64

def generate_vapid_keys():
    private_key = ec.generate_private_key(ec.SECP256R1())
    public_key = private_key.public_key()

    # Exportar claves en formato base64 (estándar VAPID)
    priv_b64 = base64.urlsafe_b64encode(
        private_key.private_numbers().private_value.to_bytes(32, "big")
    ).decode("utf-8").rstrip("=")

    pub_b64 = base64.urlsafe_b64encode(
        public_key.public_bytes(
            encoding=serialization.Encoding.X962,
            format=serialization.PublicFormat.UncompressedPoint
        )
    ).decode("utf-8").rstrip("=")

    return pub_b64, priv_b64

if __name__ == "__main__":
    pub, priv = generate_vapid_keys()
    print("VAPID_PUBLIC_KEY =", pub)
    print("VAPID_PRIVATE_KEY =", priv)
