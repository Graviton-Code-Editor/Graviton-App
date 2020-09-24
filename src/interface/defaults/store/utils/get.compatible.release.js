import semver from 'semver'

function getCompatibleRelease(gravitonVersion, releases) {
	if (!releases) return false
	return releases.find(rel => {
		if (gravitonVersion.match(new RegExp(rel.target)) && semver.gte(gravitonVersion, rel.minTarget)) {
			return rel
		}
	})
}

export default getCompatibleRelease
