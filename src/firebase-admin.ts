import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

        if (!projectId) {
            throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set');
        }

        // För production: använd service account från environment variable
        if (
            process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
            process.env.FIREBASE_ADMIN_CLIENT_EMAIL
        ) {
            // GitHub Actions / Production deployment
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: projectId,
                    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(
                        /\\n/g,
                        '\n',
                    ),
                }),
            });
            console.log(
                'Firebase Admin SDK initialized with service account (production)',
            );
        } else {
            // Development: Använd minimal config (funkar för emulator eller basic operations)
            // OBS: Detta kräver att du kör på en miljö med gcloud credentials,
            // eller att du lägger till service account credentials i .env.local
            admin.initializeApp({
                projectId: projectId,
            });
            console.log('Firebase Admin SDK initialized (development mode)');
        }
    } catch (error) {
        console.error('Firebase Admin SDK initialization error:', error);
        // För development - fortsätt ändå
        if (process.env.NODE_ENV === 'development') {
            try {
                admin.initializeApp({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                });
                console.warn(
                    'Firebase Admin initialized with minimal config (may have limited functionality)',
                );
            } catch (initError) {
                console.error(
                    'Failed to initialize Firebase Admin SDK:',
                    initError,
                );
            }
        } else {
            throw error;
        }
    }
}

// Export admin Firestore instance
export const adminDb = admin.apps.length > 0 ? admin.firestore() : null;
export const adminAuth = admin.apps.length > 0 ? admin.auth() : null;

export default admin;
