/**
 * @athenna/resource
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { File, Path } from '@athenna/common'
import { Test, type Context } from '@athenna/test'
import { BaseCommandTest } from '#tests/helpers/BaseCommandTest'

export default class MakeResourceCommandTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToCreateAResourceFile({ assert, command }: Context) {
    const output = await command.run('make:resource TestResource')

    output.assertSucceeded()
    output.assertLogged('[ MAKING RESOURCE ]')
    output.assertLogged('[  success  ] Resource "TestResource" successfully created.')
    assert.isTrue(await File.exists(Path.fixtures('storage/resources/resources/TestResource.ts')))
  }

  @Test()
  public async shouldBeAbleToCreateAResourceFileWithDifferentDestination({ assert, command }: Context) {
    const output = await command.run('make:resource TestResource', {
      path: Path.fixtures('consoles/dest-import-console.ts')
    })

    output.assertSucceeded()
    output.assertLogged('[ MAKING RESOURCE ]')
    output.assertLogged('[  success  ] Resource "TestResource" successfully created.')
    assert.isTrue(await File.exists(Path.fixtures('storage/resources/TestResource.ts')))
  }

  @Test()
  public async shouldThrowAnExceptionWhenTheFileAlreadyExists({ command }: Context) {
    await command.run('make:resource TestResource')
    const output = await command.run('make:resource TestResource')

    output.assertFailed()
    output.assertLogged('[ MAKING RESOURCE ]')
    output.assertLogged('The file')
    output.assertLogged('TestResource.ts')
    output.assertLogged('already exists')
  }
}
