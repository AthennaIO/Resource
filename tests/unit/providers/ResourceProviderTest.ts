/**
 * @athenna/resource
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ResourceProvider } from '#src'
import { Path } from '@athenna/common'
import { Config } from '@athenna/config'
import { Test, Mock, AfterEach, BeforeEach, type Context } from '@athenna/test'

export default class ResourceProviderTest {
  @BeforeEach()
  public async beforeEach() {
    await Config.loadAll(Path.fixtures('config'))
  }

  @AfterEach()
  public async afterEach() {
    Mock.restoreAll()
    ioc.reconstruct()
    Config.clear()
  }

  @Test()
  public async shouldRegisterResourcesInAthennaRcInTheContainer({ assert }: Context) {
    Config.set('rc.resources', ['#tests/fixtures/resources/UserResource'])

    await new ResourceProvider().register()

    assert.isTrue(ioc.has('App/Resources/UserResource'))
  }
}
