import { action, observable } from 'mobx'
import { SocialLinkModel } from './types'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
export default class SocialStore {
  @observable socialLinks: SocialLinkModel[] = [
    {
      url: 'https://github.com/Innei',
      title: 'GitHub',
      icon: faGithub,
    },
  ]

  @action setSocialLinks(links: SocialLinkModel[]) {
    this.socialLinks = links
  }
}
