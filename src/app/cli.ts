import minimist from 'minimist'
import packageJson from '../../package.json'

/*
 *  * If there isn't any of the below arguments, it will simply open the app
 */
export default function hasAnyValidArgument() {
	const args = minimist(process.argv)

	/*
	 * -v , --version
	 * Print Graviton's version
	 */
	if (args.version || args.v) {
		console.log(packageJson.version)
		return true
	}

	return false
}
