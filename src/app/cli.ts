import minimist from 'minimist'
import packageJson from '../../package.json'

/*
 * CLI
 * If there isn't any of the above arguments, it will simple open the app
 */

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
