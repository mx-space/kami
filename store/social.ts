import { action, observable } from 'mobx'
import { SocialLinkModel } from './types'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import configs from 'configs'

export default class SocialStore {
  @observable socialLinks: SocialLinkModel[] = configs.social

  @action setSocialLinks(links: SocialLinkModel[]) {
    this.socialLinks = links
  }
}
