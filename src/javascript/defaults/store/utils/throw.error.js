import Notification from '../../../constructors/notification'

function throwError(message) {
	new Notification({
		title: 'Error',
		content: message,
	})
}

export default throwError
