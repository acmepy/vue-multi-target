import { Notification } from 'electron/main'

export default (title = 'Titulo', body = 'prueba body') => {
  const notification = new Notification({
    title: title,
    body: body,
    silent: false,
    timeoutType: 'never',
  })

  notification.on('show', () => console.log('Notification shown'))
  notification.on('click', () => {
    console.log('Notification clicked')
    //openDetailsWindow();
  })
  notification.on('close', () => console.log('Notification closed'))
  notification.on('reply', (event, reply) => {
    console.log(`Reply: ${reply}`)
  })

  notification.show()
}

/*
  const toastXml = `<toast launch="${appProtocol}://?action=click" activationType="protocol">
  <visual>
    <binding template="ToastGeneric"><text>${title}</text><text>${body}</text></binding>
  </visual>
  <actions>
    <action content="Yes" arguments="${appProtocol}://?action=yes" activationType="protocol" />
    <action content="No" arguments="${appProtocol}://?action=no" activationType="protocol" />
  </actions>
</toast>`
  const notification = new Notification({toastXml,timeoutType:'never'});
*/
