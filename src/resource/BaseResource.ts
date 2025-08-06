/**
 * @athenna/resource
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is } from '@athenna/common'

export abstract class BaseResource<R = any, I = any> {
  /**
   * Holds the original items of this resource.
   * These items will be used to parse the content
   * with the `schema()` method. We always use array
   * values to standardize iterations, maps, etc.
   */
  private readonly items: I[]

  /**
   * Indicates if the item received in the constructor
   * was an array of not. This is important to validate
   * if we should return an object or an array in `toJSON()`
   * method.
   */
  private readonly isArray: boolean

  public constructor(data: I | I[]) {
    this.isArray = Is.Array(data)
    this.items = this.isArray ? (data as I[]) : [data as I]
  }

  /**
   * Method that defines the resource schema. All items
   * will always be parsed using this method.
   */
  protected abstract schema(item: I): R

  public toJSON(): R[]
  public toJSON(): R

  /**
   * Transform the data of the resource to a valid JSON.
   */
  public toJSON(): R | R[] {
    const transformed = this.items.map(item => this.schema(item))

    return this.isArray ? transformed : transformed[0]
  }
}
