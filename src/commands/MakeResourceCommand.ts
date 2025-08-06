/**
 * @athenna/resource
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@athenna/common'
import { Config } from '@athenna/config'
import { BaseCommand, Argument } from '@athenna/artisan'

export class MakeResourceCommand extends BaseCommand {
  @Argument({
    description: 'The resource name.'
  })
  public name: string

  public static signature(): string {
    return 'make:resource'
  }

  public static description(): string {
    return 'Make a new resource file.'
  }

  public async handle(): Promise<void> {
    this.logger.simple('({bold,green} [ MAKING RESOURCE ])\n')

    const destination = Config.get(
      'rc.commands.make:resource.destination',
      Path.apiResources()
    )
    const file = await this.generator
      .fileName(this.name)
      .destination(destination)
      .template('resource')
      .setNameProperties(true)
      .make()

    this.logger.success(
      `Resource ({yellow} "${file.name}") successfully created.`
    )

    const importPath = this.generator.getImportPath()

    await this.rc.pushTo('resources', importPath).save()

    this.logger.success(
      `Athenna RC updated: ({dim,yellow} [ resources += "${importPath}" ])`
    )
  }
}
