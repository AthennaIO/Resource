/**
 * @athenna/resource
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseConfigurer } from '@athenna/artisan'

export default class ResourceConfigurer extends BaseConfigurer {
  public async configure() {
    await this.logger
      .task()
      .addPromise('Update commands of .athennarc.json', () => {
        return this.rc
          .setTo(
            'commands',
            'make:resource',
            '@athenna/resource/commands/MakeResourceCommand'
          )
          .save()
      })
      .addPromise('Update templates of .athennarc.json', () => {
        return this.rc
          .setTo(
            'templates',
            'resource',
            'node_modules/@athenna/resource/templates/resource.edge'
          )
          .save()
      })
      .addPromise('Update providers of .athennarc.json', () => {
        return this.rc
          .pushTo('providers', '@athenna/resource/providers/ResourceProvider')
          .save()
      })
      .run()

    console.log()
    this.logger.success(
      'Successfully configured ({dim,yellow} @athenna/resource) library'
    )
  }
}
