/**
 * @athenna/resource
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Test, type Context } from '@athenna/test'
import { UserResource } from '#tests/fixtures/resources/UserResource'

export default class BaseResourceTest {
  @Test()
  public async shouldBeAbleToTransformAnItemToAUserResource({ assert }: Context) {
    const item = {
      _id: '1',
      _name: 'John Doe',
      _email: 'john.doe@example.com'
    }

    const resource = new UserResource(item)

    assert.instanceOf(resource, UserResource)
    assert.deepEqual(resource.toJSON(), {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com'
    })
  }

  @Test()
  public async shouldBeAbleToTransformAnArrayOfItemsToAUserResource({ assert }: Context) {
    const items = [
      {
        _id: '1',
        _name: 'John Doe',
        _email: 'john.doe@example.com'
      },
      {
        _id: '2',
        _name: 'Jane Doe',
        _email: 'jane.doe@example.com'
      }
    ]

    const resource = new UserResource(items)

    assert.instanceOf(resource, UserResource)
    assert.deepEqual(resource.toJSON(), [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com'
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane.doe@example.com'
      }
    ])
  }
}
