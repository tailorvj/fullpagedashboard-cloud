import React from 'react'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'

const Tab = (props) => (
  <Segment placeholder>
    <Header icon>
      <Icon name='pdf file outline' />
      No documents are listed for this customer.
    </Header>
    <Button primary>Add Document</Button>

    {props.children}
    
  </Segment>
)

export default Tab
