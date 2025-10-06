/**
 * @athenna/resource
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is, Json } from '@athenna/common'

export abstract class BaseResource<R = any, I = any> {
  /**
   * Holds the original items of this resource.
   * These items will be used to parse the content
   * with the `schema()` method. We always use array
   * values to standardize iterations, maps, etc.
   */
  // TODO Convert to symbol
  private items: I[]

  private defaultValues: {
    key: string
    value?: any
    closure?: (item?: I, json?: R) => any
  }[]

  /**
   * Indicates if the item received in the constructor
   * was an array of not. This is important to validate
   * if we should return an object or an array in `toJSON()`
   * method.
   */
  private readonly isArray: boolean

  public constructor(data: I | I[]) {
    this.defaultValues = []
    this.isArray = Is.Array(data)
    this.items = this.isArray ? (data as I[]) : [data as I]
  }

  /**
   * Method that defines the resource schema. All items
   * will always be parsed using this method.
   */
  protected abstract schema(item: I): R

  /**
   * Transform the data of the resource to a valid JSON.
   *
   * @example
   * ```ts
   * const items = [...]
   * const json = new MyResource(items).toJSON<any>()
   * ```
   */
  public toJSON<T = any>(): T {
    const transformed = this.items.map(item => {
      const json = this.schema(item)

      if (this.defaultValues.length) {
        this.defaultValues.forEach(defaultValue => {
          if (defaultValue.closure) {
            Json.set(json, defaultValue.key, defaultValue.closure(item, json))

            return
          }

          Json.set(json, defaultValue.key, defaultValue.value)
        })
      }

      return json
    })

    return this.isArray ? (transformed as any) : (transformed[0] as any as T)
  }

  /**
   * Get values from a key defined inside the items of the resource.
   * Items are the raw value set for the resource used to build the
   * JSON structure.
   *
   * @example
   * ```ts
   * const items = [{ hello: { world: 'hello' }}]
   * const hellos = new MyResource(items).getFromItem('hello.world') // ['hello']
   * ```
   */
  public getFromItem<T = any>(key: string): T {
    const values = this.items.map(item => Json.get(item, key))

    return this.isArray ? (values as any) : (values[0] as any as T)
  }

  /**
   * Get values from a key defined inside the JSON of the resource.
   * The JSON of the resource are the items parsed using the structure
   * you have defined in the `schema()` method.
   *
   * @example
   * ```ts
   * const items = [{ hello: { world: 'hello' }}]
   * const hellos = new MyResource(items).getFromJson('schemaHello') // ['hello']
   * ```
   */
  public getFromJson<T = any>(key: string): T {
    const json = this.toJSON()

    if (!json) {
      return undefined
    }

    if (this.isArray) {
      return json.map(json => Json.get(json, key))
    }

    return Json.get(json, key)
  }

  /**
   * Set a value that will overwritte the original value defined in
   * your original item structure. This method is useful when you let
   * your framework manually call the `toJSON()` method and want to
   * transform.
   *
   * @example
   * ```ts
   * const items = [{ hello: { world: 'hello' }}]
   * new MyResource(items).setInItem('hello.world', 'hello2')
   * ```
   */
  public setInItem(key: string, value: any) {
    this.items.map(item => Json.set(item, key, value))

    return this
  }

  /**
   * Set a value that will overwritte the original value created by
   * your original structure defined in your `schema()` method. This
   * method is useful when you want to change the value directly from
   * your JSON structure.
   *
   * @example
   * ```ts
   * const items = [{ hello: { world: 'hello' }}]
   * new MyResource(items).setInJson('schemaHello', 'hello2')
   * ```
   */
  public setInJson(key: string, value: any) {
    if (Is.Function(value)) {
      this.defaultValues.push({ key, closure: value })

      return this
    }

    this.defaultValues.push({ key, value })

    return this
  }
}
