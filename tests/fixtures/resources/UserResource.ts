/**
 * @athenna/resource
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseResource } from '#src/resource/BaseResource'

type Item = {
  _id: number
  _name: string
  _email: string
}

export class UserResource extends BaseResource {
  public schema(item: Item) {
    return {
      id: item._id,
      name: item._name,
      email: item._email
    }
  }
}
