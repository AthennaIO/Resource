/**
 * @athenna/resource
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { debug } from '#src/debug'
import { Module } from '@athenna/common'
import { Config } from '@athenna/config'
import { ServiceProvider } from '@athenna/ioc'

export class ResourceProvider extends ServiceProvider {
  public async register() {
    const paths: string[] = Config.get('rc.resources', [])

    await paths.athenna.concurrently(path => {
      debug('registering %s resource', path)

      return Module.resolve(path, Config.get('rc.parentURL')).then(Resource => {
        this.container.transient(`App/Resources/${Resource.name}`, Resource)
      })
    })
  }
}
