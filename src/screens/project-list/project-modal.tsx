import { Button, Drawer } from 'antd'
import React from 'react'

export const ProjectModal = (props: {
  projectModalOpen: boolean
  onClose: () => void
}) => {
  return (
    <Drawer visible={props.projectModalOpen} width={'100%'}>
      <h1>ProjectModal</h1>
      <Button onClick={props.onClose}>关闭</Button>
    </Drawer>
  )
}
