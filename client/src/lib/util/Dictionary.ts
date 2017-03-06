/**
 * 字典
 * @author j
 *
 */
class Dictionary extends egret.HashObject
{
	private _length:number;
	private _content:any;

	public constructor()
	{
		super();

		this._length = 0;
		this._content = {};
	}

	/**
	 * 长度
	 * @return
	 *
	 */
	public length():number
	{
		return this._length;
	}

	/**
	 * 添加键值对，返回key的旧value值，没有则返回null
	 * @param key
	 * @param value
	 * @return
	 *
	 */
	public add(key:any, value:any):any
	{
		if(key == null)
		{
			console.log("Dictionary.add == Cannot Add Null Key");
			return null;
		}

		if(key in this._content == false)
		{
			this._length++;
		}

		var temp:any = this.getValue(key);
		this._content[key] = value;
		return temp;
	}

	/**
	 * 移除键值对，返回key的旧value值，没有则返回null
	 * @param key
	 * @return
	 *
	 */
	public remove(key:any):any
	{
		if(key in this._content == false)
		{
			return null;
		}
		this._length--;

		var temp:any = this._content[key];
		delete this._content[key];
		return temp;
	}

	/**
	 * 通过value获取key
	 * @param value
	 * @return
	 *
	 */
	public getKey(value:any):any
	{
		for(var k in this._content)
		{
			if(this._content[k] == value)
			{
				return k;
			}
		}
		return null;
	}

	/**
	 * 获取key列表
	 * @return
	 *
	 */
	public getKeys():any[]
	{
		var temp:any[] = [];
		var index:number = 0;

		for(var k in this._content)
		{
			temp[index] = k;
			index++;
		}
		return temp;
	}

	/**
	 * 通过key获取value
	 * @param key
	 * @return
	 *
	 */
	public getValue(key:any):any
	{
		return this._content[key];
	}

	/**
	 * 获取value列表
	 * @return
	 *
	 */
	public getValues():any[]
	{
		var temp:any[] = [];
		var index:number = 0;

		for(var k in this._content)
		{
			temp[index] = this._content[k];
			index++;
		}
		return temp;
	}

	/**
	 * 是否包含指定key
	 * @param key
	 * @return
	 *
	 */
	public containsKey(key:any):boolean
	{
		return key in this._content;
	}

	/**
	 * 是否包含指定value
	 * @param value
	 * @return
	 *
	 */
	public containsValue(value:any):boolean
	{
		for(var k in this._content)
		{
			if(this._content[k] == value)
			{
				return true;
			}
		}
		return false;
	}

	/**
	 * 对key列表的每一项执行测试函数
	 * @param fun
	 *
	 */
	public eachKey(fun:Function, thisObject:any):void
	{
		for(var k in this._content)
		{
			fun.call(thisObject, k);
		}
	}

	/**
	 * 对value列表的每一项执行测试函数
	 * @param fun
	 *
	 */
	public eachValue(fun:Function, thisObject:any):void
	{
		for(var k in this._content)
		{
			fun.call(thisObject, this._content[k]);
		}
	}

	/**
	 * 对Dictionary的每一项执行测试函数，第一个参数为key，第二个参数为value
	 * @param fun
	 *
	 */
	public forEach(fun:Function, thisObject:any):void
	{
		for(var k in this._content)
		{
			fun.call(thisObject, k, this._content[k]);
		}
	}

	/**
	 * 对Dictionary的每一项执行测试函数，第一个参数为key，第二个参数为value，如果测试结果为true，则将此项的value添加进返回的Array中
	 * @param fun
	 * @return
	 *
	 */
	public filter(fun:any, thisObject:any):any[]
	{
		var temp:any[] = [];

		for(var k in this._content)
		{
			if(fun.call(thisObject, k, this._content[k]) == true)
			{
				temp.push(this._content[k]);
			}
		}
		return temp;
	}

	/**
	 * 对Dictionary的每一项执行测试函数，第一个参数为key，第二个参数为value，直到获得测试结果为true的项
	 * @param fun
	 * @return
	 *
	 */
	public some(fun:any, thisObject:any):boolean
	{
		for(var k in this._content)
		{
			if(fun.call(thisObject, k, this._content[k]) == false)
			{
				return true;
			}
		}
		return true;
	}

	/**
	 * 对Dictionary的每一项执行测试函数，第一个参数为key，第二个参数为value，直到获得测试结果为false的项
	 * @param fun
	 * @return
	 *
	 */
	public every(fun:any, thisObject:any):boolean
	{
		for(var k in this._content)
		{
			if(fun.call(thisObject, k, this._content[k]) == false)
			{
				return false;
			}
		}
		return true;
	}

	/**
	 * 清空
	 *
	 */
	public clear():void
	{
		this._length = 0;
		this._content = {};
	}

	/**
	 * 克隆
	 * @return
	 *
	 */
	public clone():Dictionary
	{
		var temp:Dictionary = new Dictionary();

		for(var k in this._content)
		{
			temp.add(k, this._content[k]);
		}
		return temp;
	}

	/**
	 * 返回Dictionary的字符串描述信息
	 * @return
	 *
	 */
	public toString():string
	{
		var content:string = "";

		for(var k in this._content)
		{
			content = content + k + " -> " + this._content[k] + "\n";
		}

		if (content == "")
		{
			return "Dictionary Content： Empty";
		}
		else
		{
			return "Dictionary Content：\n" + content;
		}
	}
}