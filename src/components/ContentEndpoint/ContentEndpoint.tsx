import * as React from 'react'
import Loading from '../Loading/Loading'
import {getParameterByName} from '../../utils/location'
import {StoredState} from '../../utils/statestore'
import Markdown from '../Markdown/Markdown'
import TrackLink from '../TrackLink/TrackLink'
import {Parser} from 'commonmark'

const styles: any = require('./ContentEndpoint.module.styl')

interface Props {
}

interface State {
}

interface Context {
  storedState: StoredState
  updateStoredState: (keyPath: string[], value: any) => void
}

const parser = new Parser()
const ast = parser.parse(require('../../../content/introduction/get-started-bottom.md'))

export default class ContentEndpoint extends React.Component<Props, State> {

  static contextTypes = {
    storedState: React.PropTypes.object.isRequired,
    updateStoredState: React.PropTypes.func.isRequired,
  }

  context: Context

  render() {
    const redirectUrl = `${window.location.origin}${window.location.pathname}#graphql-endpoint`
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${__GITHUB_OAUTH_CLIENT_ID__}&scope=user:email&redirect_uri=${redirectUrl}` // tslint:disable-line

    if (getParameterByName('code')) {
      return (
        <Loading />
      )
    }

    if (this.context.storedState.skippedAuth) {
      return (
        <div>
          <div className='tc'>
            <TrackLink
              href={githubUrl}
              className={`pa3 pointer ${styles.getEndpoint}`}
              eventMessage='open github auth'
            >
              Get GraphQL Endpoint
            </TrackLink>
          </div>
          <Markdown ast={ast}/>
        </div>
      )
    }

    if (this.context.storedState.user && this.context.storedState.user.endpoint) {
      return (
        <div className='flex flex-column'>
          Congrats this is your endpoint:
          <div className={`pa3 ${styles.showEndpoint}`}>
            {this.context.storedState.user.endpoint}
          </div>
          <Markdown ast={ast}/>
        </div>
      )
    }

    return (
      <div className='tc'>
        <TrackLink
          href={githubUrl}
          className={`pa3 pointer ${styles.getEndpoint}`}
          eventMessage='open github auth'
        >
          Get GraphQL Endpoint
        </TrackLink>
        <div className='db mb4 pointer accent f6' onClick={this.skipEndpoint}>
          Read on without GraphQL endpoint (non-interactive)
        </div>
      </div>
    )
  }

  private skipEndpoint = () => {
    analytics.track('skip endpoint')
    this.context.updateStoredState(['skippedAuth'], true)
  }
}
