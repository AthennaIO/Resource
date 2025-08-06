/**
 * @athenna/resource
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ResourceConfigurer from '../../../configurer/index.js'

import { Rc } from '@athenna/config'
import { LoggerProvider } from '@athenna/logger'
import { File, Folder, Path } from '@athenna/common'
import { Test, type Context, Mock, AfterEach, BeforeEach } from '@athenna/test'

export default class ResourceConfigurerTest {
  private cwd = process.cwd()
  private pjsonPath = Path.pwd('package.json')
  private pjson = new File(this.pjsonPath).getContentAsStringSync()

  @BeforeEach()
  public async beforeEach() {
    new LoggerProvider().register()
    await Rc.setFile(this.pjsonPath)
    await new Folder(Path.fixtures('storage')).load()
    process.chdir(Path.fixtures('storage'))
  }

  @AfterEach()
  public async afterEach() {
    ioc.reconstruct()
    Mock.restoreAll()
    process.chdir(this.cwd)
    await Folder.safeRemove(Path.fixtures('storage'))
    await new File(this.pjsonPath).setContent(this.pjson)
  }

  @Test()
  public async shouldBeAbleToRunResourceConfigurer({ assert }: Context) {
    const configurer = new ResourceConfigurer()

    Mock.when(configurer.npm, 'install').resolve(undefined)

    await configurer.configure()

    const pjsonFile = await new File(this.pjsonPath).getContentAsJson()

    assert.containSubset(pjsonFile.athenna, {
      commands: {
        'make:resource': '@athenna/resource/commands/MakeResourceCommand'
      },
      templates: {
        resource: 'node_modules/@athenna/resource/templates/resource.edge'
      },
      providers: ['@athenna/resource/providers/ResourceProvider']
    })
  }
}
