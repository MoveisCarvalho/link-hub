import { ImageResponse } from 'next/og';

// Configurações do tamanho do ícone
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Geração do ícone com o emoji desejado
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                🏛️
            </div>
        ),
        { ...size }
    );
}