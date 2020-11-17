import minimist from 'minimist'
import packageJson from '../../package.json'

export default function hasAnyValidArgument() {
	const args = minimist(process.argv)

	if (args.version || args.v) {
		/*
		 * -v , --version
		 * Print Graviton's version
		 */
		console.log(packageJson.version)
		return true
	}

	return false
}
