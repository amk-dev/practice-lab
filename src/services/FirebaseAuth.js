import { auth, authProviders } from '@/config.js'

export function signInWithEmailAndPassword(email, password) {
	return auth.signInWithEmailAndPassword(email, password)
}

export function createUserWithEmailAndPassword(email, password) {
	return auth.createUserWithEmailAndPassword(email, password)
}

export function updateProfile(updates) {
	console.log(auth.currentUser)
	return auth.currentUser.updateProfile(updates)
}

export function signInWithGoogle() {
	let provider = new authProviders.GoogleAuthProvider()
	return auth.signInWithPopup(provider)
}

export async function getIdToken() {
	return await auth.currentUser.getIdToken(false)
}

export function signout() {
	return auth.signOut()
}
