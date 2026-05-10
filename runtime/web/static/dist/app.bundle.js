var wD=Object.defineProperty;var ID=(_)=>_;function xD(_,$){this[_]=ID.bind(null,$)}var $_=(_,$)=>{for(var j in $)wD(_,j,{get:$[j],enumerable:!0,configurable:!0,set:xD.bind($,j)})};var J1=(_,$)=>()=>(_&&($=_(_=0)),$);var hZ={};$_(hZ,{useState:()=>C,useRef:()=>g,useReducer:()=>vZ,useMemo:()=>q0,useLayoutEffect:()=>G5,useImperativeHandle:()=>vD,useErrorBoundary:()=>hD,useEffect:()=>b,useDebugValue:()=>cD,useContext:()=>mD,useCallback:()=>R,render:()=>U$,html:()=>U,h:()=>M3,createContext:()=>uD,Component:()=>d5});function F$(_,$){for(var j in $)_[j]=$[j];return _}function A3(_){_&&_.parentNode&&_.parentNode.removeChild(_)}function M3(_,$,j){var Z,X,G,q={};for(G in $)G=="key"?Z=$[G]:G=="ref"?X=$[G]:q[G]=$[G];if(arguments.length>2&&(q.children=arguments.length>3?q2.call(arguments,2):j),typeof _=="function"&&_.defaultProps!=null)for(G in _.defaultProps)q[G]===void 0&&(q[G]=_.defaultProps[G]);return $2(_,q,Z,X,null)}function $2(_,$,j,Z,X){var G={type:_,props:$,key:j,ref:Z,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:X==null?++yZ:X,__i:-1,__u:0};return X==null&&I1.vnode!=null&&I1.vnode(G),G}function V2(_){return _.children}function d5(_,$){this.props=_,this.context=$}function j5(_,$){if($==null)return _.__?j5(_.__,_.__i+1):null;for(var j;$<_.__k.length;$++)if((j=_.__k[$])!=null&&j.__e!=null)return j.__e;return typeof _.type=="function"?j5(_):null}function fD(_){if(_.__P&&_.__d){var $=_.__v,j=$.__e,Z=[],X=[],G=F$({},$);G.__v=$.__v+1,I1.vnode&&I1.vnode(G),k3(_.__P,G,$,_.__n,_.__P.namespaceURI,32&$.__u?[j]:null,Z,j==null?j5($):j,!!(32&$.__u),X),G.__v=$.__v,G.__.__k[G.__i]=G,SZ(Z,G,X),$.__e=$.__=null,G.__e!=j&&PZ(G)}}function PZ(_){if((_=_.__)!=null&&_.__c!=null)return _.__e=_.__c.base=null,_.__k.some(function($){if($!=null&&$.__e!=null)return _.__e=_.__c.base=$.__e}),PZ(_)}function O3(_){(!_.__d&&(_.__d=!0)&&c$.push(_)&&!G2.__r++||DZ!=I1.debounceRendering)&&((DZ=I1.debounceRendering)||wZ)(G2)}function G2(){try{for(var _,$=1;c$.length;)c$.length>$&&c$.sort(IZ),_=c$.shift(),$=c$.length,fD(_)}finally{c$.length=G2.__r=0}}function fZ(_,$,j,Z,X,G,q,Q,K,V,Y){var N,F,B,D,W,H,z,k=Z&&Z.__k||X2,J=$.length;for(K=RD(j,$,k,K,J),N=0;N<J;N++)(B=j.__k[N])!=null&&(F=B.__i!=-1&&k[B.__i]||Z2,B.__i=N,H=k3(_,B,F,X,G,q,Q,K,V,Y),D=B.__e,B.ref&&F.ref!=B.ref&&(F.ref&&T3(F.ref,null,B),Y.push(B.ref,B.__c||D,B)),W==null&&D!=null&&(W=D),(z=!!(4&B.__u))||F.__k===B.__k?(K=RZ(B,K,_,z),z&&F.__e&&(F.__e=null)):typeof B.type=="function"&&H!==void 0?K=H:D&&(K=D.nextSibling),B.__u&=-7);return j.__e=W,K}function RD(_,$,j,Z,X){var G,q,Q,K,V,Y=j.length,N=Y,F=0;for(_.__k=Array(X),G=0;G<X;G++)(q=$[G])!=null&&typeof q!="boolean"&&typeof q!="function"?(typeof q=="string"||typeof q=="number"||typeof q=="bigint"||q.constructor==String?q=_.__k[G]=$2(null,q,null,null,null):Q2(q)?q=_.__k[G]=$2(V2,{children:q},null,null,null):q.constructor===void 0&&q.__b>0?q=_.__k[G]=$2(q.type,q.props,q.key,q.ref?q.ref:null,q.__v):_.__k[G]=q,K=G+F,q.__=_,q.__b=_.__b+1,Q=null,(V=q.__i=SD(q,j,K,N))!=-1&&(N--,(Q=j[V])&&(Q.__u|=2)),Q==null||Q.__v==null?(V==-1&&(X>Y?F--:X<Y&&F++),typeof q.type!="function"&&(q.__u|=4)):V!=K&&(V==K-1?F--:V==K+1?F++:(V>K?F--:F++,q.__u|=4))):_.__k[G]=null;if(N)for(G=0;G<Y;G++)(Q=j[G])!=null&&(2&Q.__u)==0&&(Q.__e==Z&&(Z=j5(Q)),gZ(Q,Q));return Z}function RZ(_,$,j,Z){var X,G;if(typeof _.type=="function"){for(X=_.__k,G=0;X&&G<X.length;G++)X[G]&&(X[G].__=_,$=RZ(X[G],$,j,Z));return $}_.__e!=$&&(Z&&($&&_.type&&!$.parentNode&&($=j5(_)),j.insertBefore(_.__e,$||null)),$=_.__e);do $=$&&$.nextSibling;while($!=null&&$.nodeType==8);return $}function SD(_,$,j,Z){var X,G,q,Q=_.key,K=_.type,V=$[j],Y=V!=null&&(2&V.__u)==0;if(V===null&&Q==null||Y&&Q==V.key&&K==V.type)return j;if(Z>(Y?1:0)){for(X=j-1,G=j+1;X>=0||G<$.length;)if((V=$[q=X>=0?X--:G++])!=null&&(2&V.__u)==0&&Q==V.key&&K==V.type)return q}return-1}function zZ(_,$,j){$[0]=="-"?_.setProperty($,j==null?"":j):_[$]=j==null?"":typeof j!="number"||PD.test($)?j:j+"px"}function e6(_,$,j,Z,X){var G,q;_:if($=="style")if(typeof j=="string")_.style.cssText=j;else{if(typeof Z=="string"&&(_.style.cssText=Z=""),Z)for($ in Z)j&&$ in j||zZ(_.style,$,"");if(j)for($ in j)Z&&j[$]==Z[$]||zZ(_.style,$,j[$])}else if($[0]=="o"&&$[1]=="n")G=$!=($=$.replace(xZ,"$1")),q=$.toLowerCase(),$=q in _||$=="onFocusOut"||$=="onFocusIn"?q.slice(2):$.slice(2),_.l||(_.l={}),_.l[$+G]=j,j?Z?j[n5]=Z[n5]:(j[n5]=E3,_.addEventListener($,G?H3:W3,G)):_.removeEventListener($,G?H3:W3,G);else{if(X=="http://www.w3.org/2000/svg")$=$.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if($!="width"&&$!="height"&&$!="href"&&$!="list"&&$!="form"&&$!="tabIndex"&&$!="download"&&$!="rowSpan"&&$!="colSpan"&&$!="role"&&$!="popover"&&$ in _)try{_[$]=j==null?"":j;break _}catch(Q){}typeof j=="function"||(j==null||j===!1&&$[4]!="-"?_.removeAttribute($):_.setAttribute($,$=="popover"&&j==1?"":j))}}function WZ(_){return function($){if(this.l){var j=this.l[$.type+_];if($[_2]==null)$[_2]=E3++;else if($[_2]<j[n5])return;return j(I1.event?I1.event($):$)}}}function k3(_,$,j,Z,X,G,q,Q,K,V){var Y,N,F,B,D,W,H,z,k,J,L,x,I,E,M,O=$.type;if($.constructor!==void 0)return null;128&j.__u&&(K=!!(32&j.__u),G=[Q=$.__e=j.__e]),(Y=I1.__b)&&Y($);_:if(typeof O=="function")try{if(z=$.props,k=O.prototype&&O.prototype.render,J=(Y=O.contextType)&&Z[Y.__c],L=Y?J?J.props.value:Y.__:Z,j.__c?H=(N=$.__c=j.__c).__=N.__E:(k?$.__c=N=new O(z,L):($.__c=N=new d5(z,L),N.constructor=O,N.render=gD),J&&J.sub(N),N.state||(N.state={}),N.__n=Z,F=N.__d=!0,N.__h=[],N._sb=[]),k&&N.__s==null&&(N.__s=N.state),k&&O.getDerivedStateFromProps!=null&&(N.__s==N.state&&(N.__s=F$({},N.__s)),F$(N.__s,O.getDerivedStateFromProps(z,N.__s))),B=N.props,D=N.state,N.__v=$,F)k&&O.getDerivedStateFromProps==null&&N.componentWillMount!=null&&N.componentWillMount(),k&&N.componentDidMount!=null&&N.__h.push(N.componentDidMount);else{if(k&&O.getDerivedStateFromProps==null&&z!==B&&N.componentWillReceiveProps!=null&&N.componentWillReceiveProps(z,L),$.__v==j.__v||!N.__e&&N.shouldComponentUpdate!=null&&N.shouldComponentUpdate(z,N.__s,L)===!1){$.__v!=j.__v&&(N.props=z,N.state=N.__s,N.__d=!1),$.__e=j.__e,$.__k=j.__k,$.__k.some(function(T){T&&(T.__=$)}),X2.push.apply(N.__h,N._sb),N._sb=[],N.__h.length&&q.push(N);break _}N.componentWillUpdate!=null&&N.componentWillUpdate(z,N.__s,L),k&&N.componentDidUpdate!=null&&N.__h.push(function(){N.componentDidUpdate(B,D,W)})}if(N.context=L,N.props=z,N.__P=_,N.__e=!1,x=I1.__r,I=0,k)N.state=N.__s,N.__d=!1,x&&x($),Y=N.render(N.props,N.state,N.context),X2.push.apply(N.__h,N._sb),N._sb=[];else do N.__d=!1,x&&x($),Y=N.render(N.props,N.state,N.context),N.state=N.__s;while(N.__d&&++I<25);N.state=N.__s,N.getChildContext!=null&&(Z=F$(F$({},Z),N.getChildContext())),k&&!F&&N.getSnapshotBeforeUpdate!=null&&(W=N.getSnapshotBeforeUpdate(B,D)),E=Y!=null&&Y.type===V2&&Y.key==null?bZ(Y.props.children):Y,Q=fZ(_,Q2(E)?E:[E],$,j,Z,X,G,q,Q,K,V),N.base=$.__e,$.__u&=-161,N.__h.length&&q.push(N),H&&(N.__E=N.__=null)}catch(T){if($.__v=null,K||G!=null)if(T.then){for($.__u|=K?160:128;Q&&Q.nodeType==8&&Q.nextSibling;)Q=Q.nextSibling;G[G.indexOf(Q)]=null,$.__e=Q}else{for(M=G.length;M--;)A3(G[M]);L3($)}else $.__e=j.__e,$.__k=j.__k,T.then||L3($);I1.__e(T,$,j)}else G==null&&$.__v==j.__v?($.__k=j.__k,$.__e=j.__e):Q=$.__e=bD(j.__e,$,j,Z,X,G,q,K,V);return(Y=I1.diffed)&&Y($),128&$.__u?void 0:Q}function L3(_){_&&(_.__c&&(_.__c.__e=!0),_.__k&&_.__k.some(L3))}function SZ(_,$,j){for(var Z=0;Z<j.length;Z++)T3(j[Z],j[++Z],j[++Z]);I1.__c&&I1.__c($,_),_.some(function(X){try{_=X.__h,X.__h=[],_.some(function(G){G.call(X)})}catch(G){I1.__e(G,X.__v)}})}function bZ(_){return typeof _!="object"||_==null||_.__b>0?_:Q2(_)?_.map(bZ):F$({},_)}function bD(_,$,j,Z,X,G,q,Q,K){var V,Y,N,F,B,D,W,H=j.props||Z2,z=$.props,k=$.type;if(k=="svg"?X="http://www.w3.org/2000/svg":k=="math"?X="http://www.w3.org/1998/Math/MathML":X||(X="http://www.w3.org/1999/xhtml"),G!=null){for(V=0;V<G.length;V++)if((B=G[V])&&"setAttribute"in B==!!k&&(k?B.localName==k:B.nodeType==3)){_=B,G[V]=null;break}}if(_==null){if(k==null)return document.createTextNode(z);_=document.createElementNS(X,k,z.is&&z),Q&&(I1.__m&&I1.__m($,G),Q=!1),G=null}if(k==null)H===z||Q&&_.data==z||(_.data=z);else{if(G=G&&q2.call(_.childNodes),!Q&&G!=null)for(H={},V=0;V<_.attributes.length;V++)H[(B=_.attributes[V]).name]=B.value;for(V in H)B=H[V],V=="dangerouslySetInnerHTML"?N=B:V=="children"||(V in z)||V=="value"&&("defaultValue"in z)||V=="checked"&&("defaultChecked"in z)||e6(_,V,null,B,X);for(V in z)B=z[V],V=="children"?F=B:V=="dangerouslySetInnerHTML"?Y=B:V=="value"?D=B:V=="checked"?W=B:Q&&typeof B!="function"||H[V]===B||e6(_,V,B,H[V],X);if(Y)Q||N&&(Y.__html==N.__html||Y.__html==_.innerHTML)||(_.innerHTML=Y.__html),$.__k=[];else if(N&&(_.innerHTML=""),fZ($.type=="template"?_.content:_,Q2(F)?F:[F],$,j,Z,k=="foreignObject"?"http://www.w3.org/1999/xhtml":X,G,q,G?G[0]:j.__k&&j5(j,0),Q,K),G!=null)for(V=G.length;V--;)A3(G[V]);Q||(V="value",k=="progress"&&D==null?_.removeAttribute("value"):D!=null&&(D!==_[V]||k=="progress"&&!D||k=="option"&&D!=H[V])&&e6(_,V,D,H[V],X),V="checked",W!=null&&W!=_[V]&&e6(_,V,W,H[V],X))}return _}function T3(_,$,j){try{if(typeof _=="function"){var Z=typeof _.__u=="function";Z&&_.__u(),Z&&$==null||(_.__u=_($))}else _.current=$}catch(X){I1.__e(X,j)}}function gZ(_,$,j){var Z,X;if(I1.unmount&&I1.unmount(_),(Z=_.ref)&&(Z.current&&Z.current!=_.__e||T3(Z,null,$)),(Z=_.__c)!=null){if(Z.componentWillUnmount)try{Z.componentWillUnmount()}catch(G){I1.__e(G,$)}Z.base=Z.__P=null}if(Z=_.__k)for(X=0;X<Z.length;X++)Z[X]&&gZ(Z[X],$,j||typeof _.type!="function");j||A3(_.__e),_.__c=_.__=_.__e=void 0}function gD(_,$,j){return this.constructor(_,j)}function U$(_,$,j){var Z,X,G,q;$==document&&($=document.documentElement),I1.__&&I1.__(_,$),X=(Z=typeof j=="function")?null:j&&j.__k||$.__k,G=[],q=[],k3($,_=(!Z&&j||$).__k=M3(V2,null,[_]),X||Z2,Z2,$.namespaceURI,!Z&&j?[j]:X?null:$.firstChild?q2.call($.childNodes):null,G,!Z&&j?j:X?X.__e:$.firstChild,Z,q),SZ(G,_,q)}function uD(_){function $(j){var Z,X;return this.getChildContext||(Z=new Set,(X={})[$.__c]=this,this.getChildContext=function(){return X},this.componentWillUnmount=function(){Z=null},this.shouldComponentUpdate=function(G){this.props.value!=G.value&&Z.forEach(function(q){q.__e=!0,O3(q)})},this.sub=function(G){Z.add(G);var q=G.componentWillUnmount;G.componentWillUnmount=function(){Z&&Z.delete(G),q&&q.call(G)}}),j.children}return $.__c="__cC"+CZ++,$.__=_,$.Provider=$.__l=($.Consumer=function(j,Z){return j.children(Z)}).contextType=$,$}function X5(_,$){g1.__h&&g1.__h(w1,_,Z5||$),Z5=0;var j=w1.__H||(w1.__H={__:[],__h:[]});return _>=j.__.length&&j.__.push({}),j.__[_]}function C(_){return Z5=1,vZ(mZ,_)}function vZ(_,$,j){var Z=X5(h$++,2);if(Z.t=_,!Z.__c&&(Z.__=[j?j($):mZ(void 0,$),function(Q){var K=Z.__N?Z.__N[0]:Z.__[0],V=Z.t(K,Q);K!==V&&(Z.__N=[V,Z.__[1]],Z.__c.setState({}))}],Z.__c=w1,!w1.__f)){var X=function(Q,K,V){if(!Z.__c.__H)return!0;var Y=Z.__c.__H.__.filter(function(F){return F.__c});if(Y.every(function(F){return!F.__N}))return!G||G.call(this,Q,K,V);var N=Z.__c.props!==Q;return Y.some(function(F){if(F.__N){var B=F.__[0];F.__=F.__N,F.__N=void 0,B!==F.__[0]&&(N=!0)}}),G&&G.call(this,Q,K,V)||N};w1.__f=!0;var{shouldComponentUpdate:G,componentWillUpdate:q}=w1;w1.componentWillUpdate=function(Q,K,V){if(this.__e){var Y=G;G=void 0,X(Q,K,V),G=Y}q&&q.call(this,Q,K,V)},w1.shouldComponentUpdate=X}return Z.__N||Z.__}function b(_,$){var j=X5(h$++,3);!g1.__s&&y3(j.__H,$)&&(j.__=_,j.u=$,w1.__H.__h.push(j))}function G5(_,$){var j=X5(h$++,4);!g1.__s&&y3(j.__H,$)&&(j.__=_,j.u=$,w1.__h.push(j))}function g(_){return Z5=5,q0(function(){return{current:_}},[])}function vD(_,$,j){Z5=6,G5(function(){if(typeof _=="function"){var Z=_($());return function(){_(null),Z&&typeof Z=="function"&&Z()}}if(_)return _.current=$(),function(){return _.current=null}},j==null?j:j.concat(_))}function q0(_,$){var j=X5(h$++,7);return y3(j.__H,$)&&(j.__=_(),j.__H=$,j.__h=_),j.__}function R(_,$){return Z5=8,q0(function(){return _},$)}function mD(_){var $=w1.context[_.__c],j=X5(h$++,9);return j.c=_,$?(j.__==null&&(j.__=!0,$.sub(w1)),$.props.value):_.__}function cD(_,$){g1.useDebugValue&&g1.useDebugValue($?$(_):_)}function hD(_){var $=X5(h$++,10),j=C();return $.__=_,w1.componentDidCatch||(w1.componentDidCatch=function(Z,X){$.__&&$.__(Z,X),j[1](Z)}),[j[0],function(){j[1](void 0)}]}function lD(){for(var _;_=uZ.shift();){var $=_.__H;if(_.__P&&$)try{$.__h.some(j2),$.__h.some(J3),$.__h=[]}catch(j){$.__h=[],g1.__e(j,_.__v)}}}function pD(_){var $,j=function(){clearTimeout(Z),kZ&&cancelAnimationFrame($),setTimeout(_)},Z=setTimeout(j,35);kZ&&($=requestAnimationFrame(j))}function j2(_){var $=w1,j=_.__c;typeof j=="function"&&(_.__c=void 0,j()),w1=$}function J3(_){var $=w1;_.__c=_.__(),w1=$}function y3(_,$){return!_||_.length!==$.length||$.some(function(j,Z){return j!==_[Z]})}function mZ(_,$){return typeof $=="function"?$(_):$}function rD(_){var $=TZ.get(this);return $||($=new Map,TZ.set(this,$)),($=cZ(this,$.get(_)||($.set(_,$=function(j){for(var Z,X,G=1,q="",Q="",K=[0],V=function(F){G===1&&(F||(q=q.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?K.push(0,F,q):G===3&&(F||q)?(K.push(3,F,q),G=2):G===2&&q==="..."&&F?K.push(4,F,0):G===2&&q&&!F?K.push(5,0,!0,q):G>=5&&((q||!F&&G===5)&&(K.push(G,0,q,X),G=6),F&&(K.push(G,F,0,X),G=6)),q=""},Y=0;Y<j.length;Y++){Y&&(G===1&&V(),V(Y));for(var N=0;N<j[Y].length;N++)Z=j[Y][N],G===1?Z==="<"?(V(),K=[K],G=3):q+=Z:G===4?q==="--"&&Z===">"?(G=1,q=""):q=Z+q[0]:Q?Z===Q?Q="":q+=Z:Z==='"'||Z==="'"?Q=Z:Z===">"?(V(),G=1):G&&(Z==="="?(G=5,X=q,q=""):Z==="/"&&(G<5||j[Y][N+1]===">")?(V(),G===3&&(K=K[0]),G=K,(K=K[0]).push(2,0,G),G=0):Z===" "||Z==="\t"||Z===`
`||Z==="\r"?(V(),G=2):q+=Z),G===3&&q==="!--"&&(G=4,K=K[0])}return V(),K}(_)),$),arguments,[])).length>1?$:$[0]}var q2,I1,yZ,CD,c$,DZ,wZ,IZ,D3,_2,n5,xZ,E3,W3,H3,CZ,Z2,X2,PD,Q2,h$,w1,z3,HZ,Z5=0,uZ,g1,OZ,LZ,JZ,EZ,AZ,MZ,kZ,cZ=function(_,$,j,Z){var X;$[0]=0;for(var G=1;G<$.length;G++){var q=$[G++],Q=$[G]?($[0]|=q?1:2,j[$[G++]]):$[++G];q===3?Z[0]=Q:q===4?Z[1]=Object.assign(Z[1]||{},Q):q===5?(Z[1]=Z[1]||{})[$[++G]]=Q:q===6?Z[1][$[++G]]+=Q+"":q?(X=_.apply(Q,cZ(_,Q,j,["",null])),Z.push(X),Q[0]?$[0]|=2:($[G-2]=0,$[G]=X)):Z.push(Q)}return Z},TZ,U;var M0=J1(()=>{Z2={},X2=[],PD=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,Q2=Array.isArray;q2=X2.slice,I1={__e:function(_,$,j,Z){for(var X,G,q;$=$.__;)if((X=$.__c)&&!X.__)try{if((G=X.constructor)&&G.getDerivedStateFromError!=null&&(X.setState(G.getDerivedStateFromError(_)),q=X.__d),X.componentDidCatch!=null&&(X.componentDidCatch(_,Z||{}),q=X.__d),q)return X.__E=X}catch(Q){_=Q}throw _}},yZ=0,CD=function(_){return _!=null&&_.constructor===void 0},d5.prototype.setState=function(_,$){var j;j=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=F$({},this.state),typeof _=="function"&&(_=_(F$({},j),this.props)),_&&F$(j,_),_!=null&&this.__v&&($&&this._sb.push($),O3(this))},d5.prototype.forceUpdate=function(_){this.__v&&(this.__e=!0,_&&this.__h.push(_),O3(this))},d5.prototype.render=V2,c$=[],wZ=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,IZ=function(_,$){return _.__v.__b-$.__v.__b},G2.__r=0,D3=Math.random().toString(8),_2="__d"+D3,n5="__a"+D3,xZ=/(PointerCapture)$|Capture$/i,E3=0,W3=WZ(!1),H3=WZ(!0),CZ=0;uZ=[],g1=I1,OZ=g1.__b,LZ=g1.__r,JZ=g1.diffed,EZ=g1.__c,AZ=g1.unmount,MZ=g1.__;g1.__b=function(_){w1=null,OZ&&OZ(_)},g1.__=function(_,$){_&&$.__k&&$.__k.__m&&(_.__m=$.__k.__m),MZ&&MZ(_,$)},g1.__r=function(_){LZ&&LZ(_),h$=0;var $=(w1=_.__c).__H;$&&(z3===w1?($.__h=[],w1.__h=[],$.__.some(function(j){j.__N&&(j.__=j.__N),j.u=j.__N=void 0})):($.__h.some(j2),$.__h.some(J3),$.__h=[],h$=0)),z3=w1},g1.diffed=function(_){JZ&&JZ(_);var $=_.__c;$&&$.__H&&($.__H.__h.length&&(uZ.push($)!==1&&HZ===g1.requestAnimationFrame||((HZ=g1.requestAnimationFrame)||pD)(lD)),$.__H.__.some(function(j){j.u&&(j.__H=j.u),j.u=void 0})),z3=w1=null},g1.__c=function(_,$){$.some(function(j){try{j.__h.some(j2),j.__h=j.__h.filter(function(Z){return!Z.__||J3(Z)})}catch(Z){$.some(function(X){X.__h&&(X.__h=[])}),$=[],g1.__e(Z,j.__v)}}),EZ&&EZ(_,$)},g1.unmount=function(_){AZ&&AZ(_);var $,j=_.__c;j&&j.__H&&(j.__H.__.some(function(Z){try{j2(Z)}catch(X){$=X}}),j.__H=void 0,$&&g1.__e($,j.__v))};kZ=typeof requestAnimationFrame=="function";TZ=new Map;U=rD.bind(M3)});function J_(_){if(typeof window>"u"||!window.localStorage)return null;try{return window.localStorage.getItem(_)}catch{return null}}function K1(_,$){if(typeof window>"u"||!window.localStorage)return;try{window.localStorage.setItem(_,$)}catch{return}}function W$(_,$=!1){let j=J_(_);if(j===null)return $;return j==="true"}function J4(_,$=null){let j=J_(_);if(j===null)return $;let Z=parseInt(j,10);return Number.isFinite(Z)?Z:$}function M2(_){let $=J_(_);if(!$)return null;try{return JSON.parse($)}catch{return null}}function z7(_){let $=String(_||"").trim().toLowerCase();if(!$)return"default";if($==="solarized-dark"||$==="solarized-light")return"solarized";if($==="github-dark"||$==="github-light")return"github";if($==="tokyo-night")return"tokyo";return $}function vG(_){if(!_)return null;let $=String(_).trim();if(!$)return null;let j=$.startsWith("#")?$.slice(1):$;if(!/^[0-9a-fA-F]{3}$/.test(j)&&!/^[0-9a-fA-F]{6}$/.test(j))return null;let Z=j.length===3?j.split("").map((G)=>G+G).join(""):j,X=parseInt(Z,16);return{r:X>>16&255,g:X>>8&255,b:X&255,hex:`#${Z.toLowerCase()}`}}function JO(_,$){try{if(document.body){_.style.display="none",document.body.appendChild(_);let j=getComputedStyle(_).color||_.style.color;return document.body.removeChild(_),j}}catch{return $}return $}function EO(_){if(!_||typeof document>"u")return null;let $=String(_).trim();if(!$)return null;let j=document.createElement("div");if(j.style.color="",j.style.color=$,!j.style.color)return null;let X=JO(j,j.style.color).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!X)return null;let G=parseInt(X[1],10),q=parseInt(X[2],10),Q=parseInt(X[3],10);if(![G,q,Q].every((V)=>Number.isFinite(V)))return null;let K=`#${[G,q,Q].map((V)=>V.toString(16).padStart(2,"0")).join("")}`;return{r:G,g:q,b:Q,hex:K}}function E4(_){return vG(_)||EO(_)}function W7(_,$,j){let Z=Math.round(_.r+($.r-_.r)*j),X=Math.round(_.g+($.g-_.g)*j),G=Math.round(_.b+($.b-_.b)*j);return`rgb(${Z} ${X} ${G})`}function k2(_,$){return`rgba(${_.r}, ${_.g}, ${_.b}, ${$})`}function AO(_){let $=_.r/255,j=_.g/255,Z=_.b/255,X=$<=0.03928?$/12.92:Math.pow(($+0.055)/1.055,2.4),G=j<=0.03928?j/12.92:Math.pow((j+0.055)/1.055,2.4),q=Z<=0.03928?Z/12.92:Math.pow((Z+0.055)/1.055,2.4);return 0.2126*X+0.7152*G+0.0722*q}function MO(_){return AO(_)>0.4?"#000000":"#ffffff"}function mG(){if(typeof window>"u")return"light";try{return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch{return"light"}}function H7(_){return bG[_]||bG.default}function kO(_){return _.mode==="auto"?mG():_.mode}function cG(_,$){let j=H7(_);if($==="dark"&&j.dark)return j.dark;if($==="light"&&j.light)return j.light;return j.dark||j.light||O$}function H$(_,$,j){let Z=E4(_);if(!Z)return _;return W7(Z,$,j)}function hG(_,$,j){let Z=E4($);if(!Z)return _;let G=vG(j==="dark"?"#ffffff":"#000000");return{..._,bgPrimary:H$(_.bgPrimary,Z,0.08),bgSecondary:H$(_.bgSecondary,Z,0.12),bgHover:H$(_.bgHover,Z,0.16),textPrimary:H$(_.textPrimary,Z,j==="dark"?0.08:0.06),textSecondary:H$(_.textSecondary,Z,j==="dark"?0.12:0.1),borderColor:H$(_.borderColor,Z,0.1),accent:Z.hex,accentHover:G?W7(Z,G,0.18):Z.hex,warning:H$(_.warning||O$.warning,Z,0.14),danger:H$(_.danger,Z,0.16),success:H$(_.success,Z,0.16)}}function TO(_,$){let j=E4(_?.warning);if(j)return j.hex;let Z=E4($==="dark"?w2.warning:O$.warning)||E4(O$.warning),X=E4(_?.accent);if(Z&&X)return W7(Z,X,$==="dark"?0.18:0.14);return $==="dark"?w2.warning:O$.warning}function yO(_,$){if(typeof document>"u")return;let j=document.documentElement,Z=_.accent,X=E4(Z),G=X?k2(X,$==="dark"?0.35:0.2):_.searchHighlight||_.searchHighlightColor,q=X?k2(X,$==="dark"?0.16:0.12):"rgba(29, 155, 240, 0.12)",Q=X?k2(X,$==="dark"?0.28:0.2):"rgba(29, 155, 240, 0.2)",K=X?MO(X):$==="dark"?"#000000":"#ffffff",V=X?k2(X,$==="dark"?0.35:0.25):"rgba(29, 155, 240, 0.25)",Y=TO(_,$),N={"--bg-primary":_.bgPrimary,"--bg-secondary":_.bgSecondary,"--bg-hover":_.bgHover,"--text-primary":_.textPrimary,"--text-secondary":_.textSecondary,"--border-color":_.borderColor,"--accent-color":Z,"--accent-hover":_.accentHover||Z,"--accent-color-alpha":V,"--accent-soft":q,"--accent-soft-strong":Q,"--accent-contrast-text":K,"--warning-color":Y,"--danger-color":_.danger||O$.danger,"--success-color":_.success||O$.success,"--search-highlight-color":G||"rgba(29, 155, 240, 0.2)"};Object.entries(N).forEach(([F,B])=>{if(B)j.style.setProperty(F,B)})}function wO(){if(typeof document>"u")return;let _=document.documentElement;LO.forEach(($)=>_.style.removeProperty($))}function D5(_,$={}){if(typeof document>"u")return null;let j=typeof $.id==="string"&&$.id.trim()?$.id.trim():null,Z=j?document.getElementById(j):document.querySelector(`meta[name="${_}"]`);if(!Z)Z=document.createElement("meta"),document.head.appendChild(Z);if(Z.setAttribute("name",_),j)Z.setAttribute("id",j);return Z}function gG(_){let $=z7(A4?.theme||"default"),j=A4?.tint?String(A4.tint).trim():null,Z=cG($,_);if($==="default"&&j)Z=hG(Z,j,_);if(Z?.bgPrimary)return Z.bgPrimary;return _==="dark"?w2.bgPrimary:O$.bgPrimary}function IO(_,$){if(typeof document>"u")return;let j=D5("theme-color",{id:"dynamic-theme-color"});if(j&&_)j.removeAttribute("media"),j.setAttribute("content",_);let Z=D5("theme-color",{id:"theme-color-light"});if(Z)Z.setAttribute("media","(prefers-color-scheme: light)"),Z.setAttribute("content",gG("light"));let X=D5("theme-color",{id:"theme-color-dark"});if(X)X.setAttribute("media","(prefers-color-scheme: dark)"),X.setAttribute("content",gG("dark"));let G=D5("msapplication-TileColor");if(G&&_)G.setAttribute("content",_);let q=D5("msapplication-navbutton-color");if(q&&_)q.setAttribute("content",_);let Q=D5("apple-mobile-web-app-status-bar-style");if(Q)Q.setAttribute("content",$==="dark"?"black-translucent":"default")}function xO(){if(typeof window>"u")return;let _={...A4,mode:uG};window.dispatchEvent(new CustomEvent("piclaw-theme-change",{detail:_}))}function CO(){if(typeof window>"u")return"web:default";try{let $=new URL(window.location.href).searchParams.get("chat_jid");return $&&$.trim()?$.trim():"web:default"}catch{return"web:default"}}function PO(_){if(typeof document>"u"||!_)return;let $=document.documentElement;if($?.style)$.style.background=_;if(document.body?.style)document.body.style.background=_}function O7(_,$={}){if(typeof window>"u"||typeof document>"u")return;let j=z7(_?.theme||"default"),Z=_?.tint?String(_.tint).trim():null,X=H7(j),G=kO(X),q=cG(j,G);A4={theme:j,tint:Z},uG=G;let Q=document.documentElement;Q.dataset.theme=G,Q.dataset.colorTheme=j,Q.dataset.tint=Z?String(Z):"",Q.style.colorScheme=G;let K=q;if(j==="default"&&Z)K=hG(q,Z,G);if(j==="default"&&!Z)wO();else yO(K,G);if(PO(K.bgPrimary),IO(K.bgPrimary,G),xO(),$.persist!==!1)if(K1(D7,j),Z)K1(y2,Z);else K1(y2,"")}function T2(){if(H7(A4.theme).mode!=="auto")return;O7(A4,{persist:!1})}function L7(){if(typeof window>"u")return;let _=z7(J_(D7)||"default"),$=(()=>{let j=J_(y2);return j?j.trim():null})();O7({theme:_,tint:$},{persist:!1})}function lG(){if(typeof window>"u")return()=>{};if(L7(),window.matchMedia&&!U7){let _=window.matchMedia("(prefers-color-scheme: dark)");if(_.addEventListener)_.addEventListener("change",T2);else if(_.addListener)_.addListener(T2);return U7=!0,()=>{if(_.removeEventListener)_.removeEventListener("change",T2);else if(_.removeListener)_.removeListener(T2);U7=!1}}return()=>{}}function z5(_){if(!_||typeof _!=="object")return;let $=CO(),j=_.chat_jid||_.chatJid||null,Z=_.theme??_.name??_.colorTheme,X=_.tint??null;if(!j||j===$)O7({theme:Z||"default",tint:X},{persist:!1});K1(D7,Z||"default"),K1(y2,X||"")}function pG(){if(typeof document>"u")return"light";let _=document.documentElement?.dataset?.theme;if(_==="dark"||_==="light")return _;return mG()}var D7="piclaw_theme",y2="piclaw_tint",O$,w2,bG,LO,A4,uG="light",U7=!1;var X6=J1(()=>{O$={bgPrimary:"#ffffff",bgSecondary:"#f7f9fa",bgHover:"#e8ebed",textPrimary:"#0f1419",textSecondary:"#536471",borderColor:"#eff3f4",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},w2={bgPrimary:"#000000",bgSecondary:"#16181c",bgHover:"#1d1f23",textPrimary:"#e7e9ea",textSecondary:"#71767b",borderColor:"#2f3336",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},bG={default:{label:"Default",mode:"auto",light:O$,dark:w2},tango:{label:"Tango",mode:"light",light:{bgPrimary:"#f6f5f4",bgSecondary:"#efedeb",bgHover:"#e5e3e1",textPrimary:"#2e3436",textSecondary:"#5c6466",borderColor:"#d3d7cf",accent:"#3465a4",accentHover:"#2c5890",danger:"#cc0000",success:"#4e9a06"}},xterm:{label:"XTerm",mode:"dark",dark:{bgPrimary:"#000000",bgSecondary:"#0a0a0a",bgHover:"#121212",textPrimary:"#d0d0d0",textSecondary:"#8a8a8a",borderColor:"#1f1f1f",accent:"#00a2ff",accentHover:"#0086d1",danger:"#ff5f5f",success:"#5fff87"}},monokai:{label:"Monokai",mode:"dark",dark:{bgPrimary:"#272822",bgSecondary:"#2f2f2f",bgHover:"#3a3a3a",textPrimary:"#f8f8f2",textSecondary:"#cfcfc2",borderColor:"#3e3d32",accent:"#f92672",accentHover:"#e81560",danger:"#f92672",success:"#a6e22e"}},"monokai-pro":{label:"Monokai Pro",mode:"dark",dark:{bgPrimary:"#2d2a2e",bgSecondary:"#363237",bgHover:"#403a40",textPrimary:"#fcfcfa",textSecondary:"#c1c0c0",borderColor:"#444046",accent:"#ff6188",accentHover:"#f74f7e",danger:"#ff4f5e",success:"#a9dc76"}},ristretto:{label:"Ristretto",mode:"dark",dark:{bgPrimary:"#2c2525",bgSecondary:"#362d2d",bgHover:"#403535",textPrimary:"#f4f1ef",textSecondary:"#cbbdb8",borderColor:"#4a3c3c",accent:"#ff9f43",accentHover:"#f28a2e",danger:"#ff5f56",success:"#a9dc76"}},dracula:{label:"Dracula",mode:"dark",dark:{bgPrimary:"#282a36",bgSecondary:"#303445",bgHover:"#3a3f52",textPrimary:"#f8f8f2",textSecondary:"#c5c8d6",borderColor:"#44475a",accent:"#bd93f9",accentHover:"#a87ded",danger:"#ff5555",success:"#50fa7b"}},catppuccin:{label:"Catppuccin",mode:"dark",dark:{bgPrimary:"#1e1e2e",bgSecondary:"#24273a",bgHover:"#2c2f41",textPrimary:"#cdd6f4",textSecondary:"#a6adc8",borderColor:"#313244",accent:"#89b4fa",accentHover:"#74a0f5",danger:"#f38ba8",success:"#a6e3a1"}},nord:{label:"Nord",mode:"dark",dark:{bgPrimary:"#2e3440",bgSecondary:"#3b4252",bgHover:"#434c5e",textPrimary:"#eceff4",textSecondary:"#d8dee9",borderColor:"#4c566a",accent:"#88c0d0",accentHover:"#78a9c0",danger:"#bf616a",success:"#a3be8c"}},gruvbox:{label:"Gruvbox",mode:"dark",dark:{bgPrimary:"#282828",bgSecondary:"#32302f",bgHover:"#3c3836",textPrimary:"#ebdbb2",textSecondary:"#bdae93",borderColor:"#3c3836",accent:"#d79921",accentHover:"#c28515",danger:"#fb4934",success:"#b8bb26"}},solarized:{label:"Solarized",mode:"auto",light:{bgPrimary:"#fdf6e3",bgSecondary:"#f5efdc",bgHover:"#eee8d5",textPrimary:"#586e75",textSecondary:"#657b83",borderColor:"#e0d8c6",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"},dark:{bgPrimary:"#002b36",bgSecondary:"#073642",bgHover:"#0b3c4a",textPrimary:"#eee8d5",textSecondary:"#93a1a1",borderColor:"#18424a",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"}},tokyo:{label:"Tokyo",mode:"dark",dark:{bgPrimary:"#1a1b26",bgSecondary:"#24283b",bgHover:"#2f3549",textPrimary:"#c0caf5",textSecondary:"#9aa5ce",borderColor:"#414868",accent:"#7aa2f7",accentHover:"#6b92e6",danger:"#f7768e",success:"#9ece6a"}},miasma:{label:"Miasma",mode:"dark",dark:{bgPrimary:"#1f1f23",bgSecondary:"#29292f",bgHover:"#33333a",textPrimary:"#e5e5e5",textSecondary:"#b4b4b4",borderColor:"#3d3d45",accent:"#c9739c",accentHover:"#b8618c",danger:"#e06c75",success:"#98c379"}},github:{label:"GitHub",mode:"auto",light:{bgPrimary:"#ffffff",bgSecondary:"#f6f8fa",bgHover:"#eaeef2",textPrimary:"#24292f",textSecondary:"#57606a",borderColor:"#d0d7de",accent:"#0969da",accentHover:"#0550ae",danger:"#cf222e",success:"#1a7f37"},dark:{bgPrimary:"#0d1117",bgSecondary:"#161b22",bgHover:"#21262d",textPrimary:"#c9d1d9",textSecondary:"#8b949e",borderColor:"#30363d",accent:"#2f81f7",accentHover:"#1f6feb",danger:"#f85149",success:"#3fb950"}},gotham:{label:"Gotham",mode:"dark",dark:{bgPrimary:"#0b0f14",bgSecondary:"#111720",bgHover:"#18212b",textPrimary:"#cbd6e2",textSecondary:"#9bb0c3",borderColor:"#1f2a37",accent:"#5ccfe6",accentHover:"#48b8ce",danger:"#d26937",success:"#2aa889"}}},LO=["--bg-primary","--bg-secondary","--bg-hover","--text-primary","--text-secondary","--border-color","--accent-color","--accent-hover","--accent-color-alpha","--accent-contrast-text","--accent-soft","--accent-soft-strong","--warning-color","--danger-color","--success-color","--search-highlight-color"],A4={theme:"default",tint:null}});function eG(_=typeof window<"u"?window:null){return _||null}function x2(){if(typeof performance<"u"&&typeof performance.now==="function")return performance.now();return Date.now()}function K6(_,$){return`${_}:${$}`}function _q(_){return`${_}-${Math.random().toString(36).slice(2,10)}-${Date.now().toString(36)}`}function $q(_,$){if(_.length<=$)return;_.splice(0,_.length-$)}function k4(_){if(!_||typeof _!=="object")return null;return{..._}}function w4(_){if(!_)return null;return T4.find(($)=>$.id===_)||null}function E7(_,$){if(typeof performance>"u"||typeof performance.mark!=="function")return;try{performance.mark(`piclaw:${_}:${$}`)}catch(j){console.debug("[app-perf] Ignoring performance.mark failure.",j,{traceId:_,phase:$})}}function jq(_){if(typeof performance>"u"||typeof performance.clearMarks!=="function")return;try{performance.clearMarks(`piclaw:${_}:start`);let $=w4(_);if(!$)return;for(let j of $.phases)performance.clearMarks(`piclaw:${_}:${j.phase}`)}catch($){console.debug("[app-perf] Ignoring performance.clearMarks failure.",$,{traceId:_})}}function tG(_,$,j){let Z=y4.get(K6(_,$));if(Z&&w4(Z)?.status==="active")V6(Z,"cancelled","superseded",{replacementType:_,replacementChatJid:$});let X=_q(_),G={id:X,type:_,chatJid:$,startedAt:x2(),detail:k4(j),phases:[],status:"active"};return T4.push(G),$q(T4,100),y4.set(K6(_,$),X),E7(X,"start"),X}function V6(_,$,j,Z,X){let G=w4(_);if(!G||G.status!=="active")return;if(j)G.phases.push({phase:j,at:x2(),detail:k4(Z)}),E7(G.id,j);if(G.status=$,G.completedAt=x2(),G.durationMs=G.completedAt-G.startedAt,X!==void 0)G.error=X instanceof Error?X.message:String(X);let q=K6(G.type,G.chatJid);if(y4.get(q)===G.id)y4.delete(q);jq(G.id)}function eO(_=eG()){let $=_?.__PICLAW_PERF__;if($)return $;if(_)_.__PICLAW_PERF__=C2;return C2}function W5(_=eG()){return eO(_)}function Zq(_,$,j){return W5().ensureTrace(_,$,j)}function P2(_,$){return W5().getActiveTraceId(_,$)}function Q_(_,$,j){W5().markTrace(_,$,j)}function f2(_,$,j="settled",Z){let X=w4(_);if(!X||X.status!=="active")return!1;let G=new Set(X.phases.map((q)=>q.phase));if(!$.every((q)=>G.has(q)))return!1;return V6(_,"completed",j,Z),!0}function Xq(_,$,j="failed",Z){W5().failTrace(_,$,j,Z)}function Gq(_,$="cancelled",j){W5().cancelTrace(_,$,j)}function A7(_){return W5().recordRequest(_)}var T4,Q6,y4,C2;var Y6=J1(()=>{T4=[],Q6=[],y4=new Map;C2={startTrace(_,$,j){return tG(_,$,j)},ensureTrace(_,$,j){let Z=y4.get(K6(_,$));if(Z&&w4(Z)?.status==="active")return Z;return tG(_,$,j)},getActiveTraceId(_,$){let j=y4.get(K6(_,$));return j&&w4(j)?.status==="active"?j:null},markTrace(_,$,j){let Z=w4(_);if(!Z||Z.status!=="active")return;Z.phases.push({phase:$,at:x2(),detail:k4(j)}),E7(Z.id,$)},completeTrace(_,$="settled",j){V6(_,"completed",$,j)},failTrace(_,$,j="failed",Z){V6(_,"failed",j,Z,$)},cancelTrace(_,$="cancelled",j){V6(_,"cancelled",$,j)},recordRequest(_){let $=_q("req");return Q6.push({..._,id:$,detail:k4(_.detail)}),$q(Q6,300),$},getTraces(){return T4.map((_)=>({..._,detail:k4(_.detail),phases:_.phases.map(($)=>({...$,detail:k4($.detail)}))}))},getRequests(){return Q6.map((_)=>({..._,detail:k4(_.detail)}))},clear(){T4.forEach((_)=>jq(_.id)),T4.splice(0,T4.length),Q6.splice(0,Q6.length),y4.clear()},printSummary(){let _={traces:C2.getTraces(),requests:C2.getRequests()};return console.table(_.traces.map(($)=>({id:$.id,type:$.type,chatJid:$.chatJid,status:$.status,durationMs:Number($.durationMs||0).toFixed(1),lastPhase:$.phases[$.phases.length-1]?.phase||"start"}))),_}}});function H5(_){let $=Number(_||0);return Number.isFinite($)&&$>0?$:null}function _L(_){try{return Boolean(_?.matchMedia?.("(pointer: coarse)")?.matches)}catch{return!1}}function $L(_){let $=String(_?.navigator?.userAgent||"");return/Android|webOS|iPhone|iPod|Mobile|Windows Phone/i.test($)}function qq(_){let $=String(_?.navigator?.userAgent||"");return/iPad|Tablet|PlayBook|Silk/i.test($)}function Qq(_=typeof window<"u"?window:null){let $=H5(_?.innerWidth)??H5(_?.screen?.availWidth)??H5(_?.screen?.width)??0,j=H5(_?.innerHeight)??H5(_?.screen?.availHeight)??H5(_?.screen?.height)??0,Z=$&&j?Math.min($,j):$||j,X=$&&j?Math.max($,j):$||j,G=_L(_),q=Number(_?.navigator?.maxTouchPoints||0),Q=G||q>1;if(Z>0&&Z<=640)return"mobile";if($L(_)&&!qq(_))return"mobile";if(qq(_))return"tablet";if(Q&&Z>0&&Z<=1100)return"tablet";if(X>0&&X<=1180&&Z>0&&Z<=900)return"tablet";return"desktop"}var W6={};$_(W6,{uploadWorkspaceFile:()=>g2,uploadMedia:()=>l7,updateWorkspaceFile:()=>fL,updateScheduledTask:()=>w7,submitAdaptiveCardAction:()=>p7,streamSidePrompt:()=>IL,stopSessionRecording:()=>C7,stopAutoresearch:()=>EL,steerAgentQueueItem:()=>TL,startSessionRecording:()=>x7,setWorkspaceVisibility:()=>D6,setAgentThoughtVisibility:()=>CL,sessionRecordingPlaybackUrl:()=>f7,sessionRecordingExportUrl:()=>N6,sendPeerAgentMessage:()=>WL,sendAgentMessage:()=>E_,searchPosts:()=>ZL,saveWorkspaceSettings:()=>g7,saveWebPushSubscription:()=>c7,saveUiState:()=>S7,saveQuickActionsSettings:()=>b7,saveEnvironmentOverride:()=>S2,restoreChatBranch:()=>zL,respondToAgentRequest:()=>O5,reorderAgentQueueItem:()=>yL,renameWorkspaceFile:()=>_9,renameChatJid:()=>DL,renameChatBranch:()=>NL,removeAgentQueueItem:()=>kL,reindexWorkspace:()=>s7,purgeChatBranch:()=>UL,pruneChatBranch:()=>FL,previewSessionRecordingRedaction:()=>R7,moveWorkspaceEntry:()=>$9,mergeChatBranchIntoParent:()=>BL,getWorkspaceTree:()=>U6,getWorkspaceRawUrl:()=>z6,getWorkspaceIndexStatus:()=>i7,getWorkspaceFileStat:()=>t7,getWorkspaceFileDownloadUrl:()=>u2,getWorkspaceFile:()=>a7,getWorkspaceDownloadUrl:()=>v2,getWorkspaceBranch:()=>o7,getWebPushPublicKey:()=>m7,getTimeline:()=>n$,getThumbnailUrl:()=>n7,getThread:()=>XL,getSystemMetrics:()=>T7,getSessionRecordings:()=>I7,getSessionRecording:()=>R2,getScheduledTasks:()=>y7,getQuickActionsSettings:()=>F6,getPostsByHashtag:()=>k7,getMediaUrl:()=>v_,getMediaText:()=>PL,getMediaInfo:()=>b2,getMediaBlob:()=>d7,getEnvironmentSettings:()=>u7,getChatBranches:()=>KL,getAutoresearchStatus:()=>JL,getAgents:()=>HL,getAgentThought:()=>xL,getAgentStatus:()=>OL,getAgentQueueState:()=>ML,getAgentModels:()=>I4,getAgentContext:()=>LL,getAgentCommands:()=>B6,getActiveChatAgents:()=>VL,forkChatBranch:()=>YL,dismissAutoresearch:()=>AL,deleteWorkspaceFile:()=>j9,deleteWebPushSubscription:()=>h7,deleteSessionRecording:()=>P7,deletePost:()=>QL,createWorkspaceFile:()=>e7,createRootChatSession:()=>v7,createReply:()=>qL,createPost:()=>GL,completeInstanceOobe:()=>wL,attachWorkspaceFile:()=>RL,addToWhitelist:()=>r7,SSEClient:()=>m2});async function u0(_,$={}){let j=typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now(),Z;try{Z=await fetch(l1+_,{...$,headers:{"Content-Type":"application/json",...$.headers}})}catch(G){throw A7({method:String($.method||"GET").toUpperCase(),url:_,startedAt:j,durationMs:(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-j,ok:!1,detail:{failedBeforeResponse:!0}}),G}let X=(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-j;if(A7({method:String($.method||"GET").toUpperCase(),url:_,startedAt:j,durationMs:X,status:Z.status,ok:Z.ok,requestId:Z.headers?.get?.("x-request-id")||null,serverTiming:Z.headers?.get?.("Server-Timing")||null}),!Z.ok){let G=await Z.json().catch(()=>({error:"Unknown error"}));throw Error(G.error||`HTTP ${Z.status}`)}return Z.json()}function Vq(_){let $=String(_||"").split(`
`),j="message",Z=[];for(let G of $)if(G.startsWith("event:"))j=G.slice(6).trim()||"message";else if(G.startsWith("data:"))Z.push(G.slice(5).trim());let X=Z.join(`
`);if(!X)return null;try{return{event:j,data:JSON.parse(X)}}catch{return{event:j,data:X}}}async function jL(_,$){if(!_.body)throw Error("Missing event stream body");let j=_.body.getReader(),Z=new TextDecoder,X="";while(!0){let{value:q,done:Q}=await j.read();if(Q)break;X+=Z.decode(q,{stream:!0});let K=X.split(`

`);X=K.pop()||"";for(let V of K){let Y=Vq(V);if(Y)$(Y.event,Y.data)}}X+=Z.decode();let G=Vq(X);if(G)$(G.event,G.data)}async function n$(_=10,$=null,j=null){let Z=`/timeline?limit=${_}`;if($)Z+=`&before=${$}`;if(j)Z+=`&chat_jid=${encodeURIComponent(j)}`;return u0(Z)}async function k7(_,$=50,j=0,Z=null){let X=Z?`&chat_jid=${encodeURIComponent(Z)}`:"";return u0(`/hashtag/${encodeURIComponent(_)}?limit=${$}&offset=${j}${X}`)}async function ZL(_,$=50,j=0,Z=null,X="current",G=null,q=null){let Q=Z?`&chat_jid=${encodeURIComponent(Z)}`:"",K=X?`&scope=${encodeURIComponent(X)}`:"",V=G?`&root_chat_jid=${encodeURIComponent(G)}`:"",Y=q?.images?"&images=1":"",N=q?.attachments?"&attachments=1":"";return u0(`/search?q=${encodeURIComponent(_)}&limit=${$}&offset=${j}${Q}${K}${V}${Y}${N}`)}async function XL(_,$=null){let j=$?`?chat_jid=${encodeURIComponent($)}`:"";return u0(`/thread/${_}${j}`)}async function T7(){return u0("/agent/system-metrics")}async function y7(_={}){let $=new URLSearchParams;if(_?.id)$.set("id",String(_.id));if(_?.chatJid)$.set("chat_jid",String(_.chatJid));if(_?.status&&_.status!=="all")$.set("status",String(_.status));if(_?.limit)$.set("limit",String(_.limit));if(_?.includeRunLogs)$.set("include_run_logs","1");if(_?.runLogLimit)$.set("run_log_limit",String(_.runLogLimit));let j=$.toString()?`?${$.toString()}`:"";return u0(`/agent/scheduled-tasks${j}`)}async function w7(_,$,j={}){return u0("/agent/scheduled-tasks/action",{method:"POST",body:JSON.stringify({action:_,id:$,allow_internal:j?.allowInternal===!0})})}async function I7(){return u0("/agent/recordings")}async function R2(_){return u0(`/agent/recordings/${encodeURIComponent(_)}`)}async function x7(_={}){return u0("/agent/recordings/start",{method:"POST",body:JSON.stringify(_||{})})}async function C7(_={}){return u0("/agent/recordings/stop",{method:"POST",body:JSON.stringify(_||{})})}async function P7(_){return u0(`/agent/recordings/${encodeURIComponent(_)}`,{method:"DELETE"})}function N6(_,$="json"){return`/agent/recordings/${encodeURIComponent(_)}/export?format=${encodeURIComponent($)}`}function f7(_){return`/recordings/playback?id=${encodeURIComponent(_)}`}async function R7(_,$={}){return u0("/agent/recordings/redact-preview",{method:"POST",body:JSON.stringify({payload:_,...$})})}async function S7(_){return u0("/agent/ui-state",{method:"POST",body:JSON.stringify(_||{})})}async function GL(_,$=[],j=null){let Z=j?`?chat_jid=${encodeURIComponent(j)}`:"";return u0(`/post${Z}`,{method:"POST",body:JSON.stringify({content:_,media_ids:$})})}async function qL(_,$,j=[],Z=null){let X=Z?`?chat_jid=${encodeURIComponent(Z)}`:"";return u0(`/post/reply${X}`,{method:"POST",body:JSON.stringify({thread_id:_,content:$,media_ids:j})})}async function QL(_,$=!1,j=null){let Z=j?`&chat_jid=${encodeURIComponent(j)}`:"",X=`/post/${_}?cascade=${$?"true":"false"}${Z}`;return u0(X,{method:"DELETE"})}async function E_(_,$,j=null,Z=[],X=null,G=null){let q=G?`?chat_jid=${encodeURIComponent(G)}`:"",Q={content:$,thread_id:j,media_ids:Z,client_context:{screen_hint:Qq()}};if(X==="auto"||X==="queue"||X==="steer")Q.mode=X;return u0(`/agent/${_}/message${q}`,{method:"POST",body:JSON.stringify(Q)})}async function B6(_="web:default"){let $=typeof _==="string"&&_.trim()?_.trim():"web:default";return u0(`/agent/commands?chat_jid=${encodeURIComponent($)}`)}async function F6(){return u0("/agent/settings/quick-actions")}async function b7(_){return u0("/agent/settings/quick-actions",{method:"POST",body:JSON.stringify(_||{})})}async function g7(_){return u0("/agent/settings/workspace",{method:"POST",body:JSON.stringify(_||{})})}async function u7(){return u0("/agent/settings/environment")}async function S2(_){return u0("/agent/settings/environment",{method:"POST",body:JSON.stringify(_||{})})}async function VL(){return u0("/agent/active-chats")}async function KL(_=null,$={}){let j=new URLSearchParams;if(_)j.set("root_chat_jid",String(_));if($?.includeArchived)j.set("include_archived","1");let Z=j.toString()?`?${j.toString()}`:"";return u0(`/agent/branches${Z}`)}async function YL(_,$={}){return u0("/agent/branch-fork",{method:"POST",body:JSON.stringify({source_chat_jid:_,...$?.agentName?{agent_name:$.agentName}:{}})})}async function v7(_){return u0("/agent/root-session",{method:"POST",body:JSON.stringify({agent_name:_})})}async function NL(_,$={}){return u0("/agent/branch-rename",{method:"POST",body:JSON.stringify({chat_jid:_,...$&&Object.prototype.hasOwnProperty.call($,"agentName")?{agent_name:$.agentName}:{}})})}async function BL(_){return u0("/agent/branch-merge-parent",{method:"POST",body:JSON.stringify({chat_jid:_})})}async function FL(_){return u0("/agent/branch-prune",{method:"POST",body:JSON.stringify({chat_jid:_})})}async function UL(_){return u0("/agent/branch-purge",{method:"POST",body:JSON.stringify({chat_jid:_})})}async function DL(_,$){return u0("/agent/rename-jid",{method:"POST",body:JSON.stringify({old_jid:_,new_jid:$})})}async function zL(_,$={}){return u0("/agent/branch-restore",{method:"POST",body:JSON.stringify({chat_jid:_,...$&&Object.prototype.hasOwnProperty.call($,"agentName")?{agent_name:$.agentName}:{}})})}async function WL(_,$,j,Z="auto",X={}){let G={source_chat_jid:_,content:j,mode:Z,...X?.sourceAgentName?{source_agent_name:X.sourceAgentName}:{},...X?.targetBy==="agent_name"?{target_agent_name:$}:{target_chat_jid:$}};return u0("/agent/peer-message",{method:"POST",body:JSON.stringify(G)})}async function m7(){return u0("/agent/push/vapid-public-key")}async function c7(_,$={}){let j={subscription:_,...$?.deviceId?{device_id:$.deviceId}:{}};return u0("/agent/push/subscription",{method:"POST",body:JSON.stringify(j)})}async function h7(_,$={}){let j={subscription:_,...$?.deviceId?{device_id:$.deviceId}:{}};return u0("/agent/push/subscription",{method:"DELETE",body:JSON.stringify(j)})}async function HL(){return u0("/agent/roster")}async function OL(_=null){let $=_?`?chat_jid=${encodeURIComponent(_)}`:"";return u0(`/agent/status${$}`)}async function LL(_=null){let $=_?`?chat_jid=${encodeURIComponent(_)}`:"";return u0(`/agent/context${$}`)}async function JL(_=null){let $=_?`?chat_jid=${encodeURIComponent(_)}`:"";return u0(`/agent/autoresearch/status${$}`)}async function EL(_=null,$={}){return u0("/agent/autoresearch/stop",{method:"POST",body:JSON.stringify({chat_jid:_||void 0,generate_report:$?.generateReport!==!1})})}async function AL(_=null){return u0("/agent/autoresearch/dismiss",{method:"POST",body:JSON.stringify({chat_jid:_||void 0})})}async function ML(_=null){let $=_?`?chat_jid=${encodeURIComponent(_)}`:"";return u0(`/agent/queue-state${$}`)}async function kL(_,$=null){let j=await fetch(l1+"/agent/queue-remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:_,chat_jid:$||void 0})});if(!j.ok){let Z=await j.json().catch(()=>({error:"Failed to remove queued item"}));throw Error(Z.error||`HTTP ${j.status}`)}return j.json()}async function TL(_,$=null){let j=await fetch(l1+"/agent/queue-steer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:_,chat_jid:$||void 0})});if(!j.ok){let Z=await j.json().catch(()=>({error:"Failed to steer queued item"}));throw Error(Z.error||`HTTP ${j.status}`)}return j.json()}async function yL(_,$,j=null){let Z=await fetch(l1+"/agent/queue-reorder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from_index:_,to_index:$,chat_jid:j||void 0})});if(!Z.ok){let X=await Z.json().catch(()=>({error:"Failed to reorder queued item"}));throw Error(X.error||`HTTP ${Z.status}`)}return Z.json()}async function I4(_=null){let $=_?`?chat_jid=${encodeURIComponent(_)}`:"";return u0(`/agent/models${$}`)}async function wL(_="provider-ready"){return u0("/agent/oobe/complete",{method:"POST",body:JSON.stringify({kind:_})})}async function l7(_){let $=new FormData;$.append("file",_);let j=await fetch(l1+"/media/upload",{method:"POST",body:$});if(!j.ok){let Z=await j.json().catch(()=>({error:"Upload failed"}));throw Error(Z.error||`HTTP ${j.status}`)}return j.json()}async function O5(_,$,j=null){let Z=await fetch(l1+"/agent/respond",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request_id:_,outcome:$,chat_jid:j||void 0})});if(!Z.ok){let X=await Z.json().catch(()=>({error:"Failed to respond"}));throw Error(X.error||`HTTP ${Z.status}`)}return Z.json()}async function p7(_){let $=await fetch(l1+"/agent/card-action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(_)});if(!$.ok){let j=await $.json().catch(()=>({error:"Adaptive Card action failed"}));throw Error(j.error||`HTTP ${$.status}`)}return $.json()}async function IL(_,$={}){let j=await fetch(l1+"/agent/side-prompt/stream",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:_,system_prompt:$.systemPrompt||void 0,chat_jid:$.chatJid||void 0}),signal:$.signal});if(!j.ok){let G=await j.json().catch(()=>({error:"Side prompt failed"}));throw Error(G.error||`HTTP ${j.status}`)}let Z=null,X=null;if(await jL(j,(G,q)=>{if($.onEvent?.(G,q),G==="side_prompt_thinking_delta")$.onThinkingDelta?.(q?.delta||"");else if(G==="side_prompt_text_delta")$.onTextDelta?.(q?.delta||"");else if(G==="side_prompt_done")Z=q;else if(G==="side_prompt_error")X=q}),X){let G=Error(X?.error||"Side prompt failed");throw G.payload=X,G}return Z}async function r7(_,$){let j=await fetch(l1+"/agent/whitelist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pattern:_,description:$})});if(!j.ok){let Z=await j.json().catch(()=>({error:"Failed to add to whitelist"}));throw Error(Z.error||`HTTP ${j.status}`)}return j.json()}async function xL(_,$="thought"){let j=`/agent/thought?turn_id=${encodeURIComponent(_)}&panel=${encodeURIComponent($)}`;return u0(j)}async function CL(_,$,j){return u0("/agent/thought/visibility",{method:"POST",body:JSON.stringify({turn_id:_,panel:$,expanded:Boolean(j)})})}function v_(_){return`${l1}/media/${_}`}function n7(_){return`${l1}/media/${_}/thumbnail`}async function b2(_){let $=await fetch(`${l1}/media/${_}/info`);if(!$.ok)throw Error("Failed to get media info");return $.json()}async function PL(_){let $=await fetch(`${l1}/media/${_}`);if(!$.ok)throw Error("Failed to load media text");return $.text()}async function d7(_){let $=await fetch(`${l1}/media/${_}`);if(!$.ok)throw Error("Failed to load media blob");return $.blob()}async function U6(_="",$=2,j=!1){let Z=`/workspace/tree?path=${encodeURIComponent(_)}&depth=${$}&show_hidden=${j?"1":"0"}`;return u0(Z)}async function o7(_=""){let $=`/workspace/branch?path=${encodeURIComponent(_||"")}`;return u0($)}async function i7(_="all"){let $=`/workspace/index-status?scope=${encodeURIComponent(_||"all")}`;return u0($)}async function s7(_="all"){return u0("/workspace/reindex",{method:"POST",body:JSON.stringify({scope:_})})}async function a7(_,$=20000,j=null){let Z=j?`&mode=${encodeURIComponent(j)}`:"",X=`/workspace/file?path=${encodeURIComponent(_)}&max=${$}${Z}`;return u0(X)}async function t7(_){return u0(`/workspace/stat?path=${encodeURIComponent(_)}`)}async function fL(_,$){return u0("/workspace/file",{method:"PUT",body:JSON.stringify({path:_,content:$})})}async function RL(_){return u0("/workspace/attach",{method:"POST",body:JSON.stringify({path:_})})}function bL(_,$="",j={}){let Z=new URLSearchParams;if($)Z.set("path",$);if(j.overwrite)Z.set("overwrite","1");let X=Z.toString();return X?`${_}?${X}`:_}function gL(){if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();return`upload-${Date.now()}-${Math.random().toString(36).slice(2)}`}function uL(_,$,j,Z){return new Promise((X,G)=>{let q=new XMLHttpRequest;q.open("POST",l1+$);for(let[Q,K]of Object.entries(j||{}))if(K!==void 0&&K!==null)q.setRequestHeader(Q,String(K));q.upload.onprogress=(Q)=>{if(typeof Z==="function")Z({loaded:Q.lengthComputable?Q.loaded:0,total:Q.lengthComputable?Q.total:_.size,lengthComputable:Q.lengthComputable})},q.onload=()=>{try{let Q=q.responseText?JSON.parse(q.responseText):{};if(q.status>=200&&q.status<300)X(Q);else{let K=Error(Q.error||`HTTP ${q.status}`);K.status=q.status,K.code=Q.code,G(K)}}catch{let Q=Error(`HTTP ${q.status}`);Q.status=q.status,G(Q)}},q.onerror=()=>G(Error("Upload failed (network error)")),q.ontimeout=()=>G(Error("Upload timed out")),q.send(_)})}async function vL(_,$="",j={}){let Z=gL(),X=bL("/workspace/upload-chunk",$,j),G=Math.max(1,Math.min(M7,Number(j.chunkSize)||SL)),q=Math.max(0,Number(_?.size)||0),Q=Math.max(1,Math.ceil(q/G)),K=0,V=null;for(let Y=0;Y<Q;Y+=1){let N=Y*G,F=Math.min(q,N+G),B=_.slice(N,F),D=B.size;if(V=await uL(B,X,{"X-Upload-Id":Z,"X-Chunk-Index":Y,"X-Chunk-Total":Q,"X-File-Name":_?.name||"upload.bin","X-File-Size":q},(W)=>{if(typeof j.onProgress!=="function")return;let H=Math.min(q,K+(W?.loaded||0)),z=q||1;j.onProgress({loaded:H,total:z,percent:Math.round(H/z*100),chunkIndex:Y,chunkTotal:Q})}),K+=D,typeof j.onProgress==="function"){let W=q||1,H=q?K:W;j.onProgress({loaded:H,total:W,percent:Math.round(H/W*100),chunkIndex:Y+1,chunkTotal:Q})}}return V}async function g2(_,$="",j={}){if(_?.size>M7){let Z=(_.size/1048576).toFixed(0),X=(M7/1048576).toFixed(0),G=Error(`File too large (${Z} MB). Maximum upload size is ${X} MB.`);throw G.code="file_too_large",G}return await vL(_,$,j)}async function e7(_,$,j=""){let Z=await fetch(l1+"/workspace/file",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:_,name:$,content:j})});if(!Z.ok){let X=await Z.json().catch(()=>({error:"Create failed"})),G=Error(X.error||`HTTP ${Z.status}`);throw G.status=Z.status,G.code=X.code,G}return Z.json()}async function _9(_,$){let j=await fetch(l1+"/workspace/rename",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:_,name:$})});if(!j.ok){let Z=await j.json().catch(()=>({error:"Rename failed"})),X=Error(Z.error||`HTTP ${j.status}`);throw X.status=j.status,X.code=Z.code,X}return j.json()}async function $9(_,$){let j=await fetch(l1+"/workspace/move",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:_,target:$})});if(!j.ok){let Z=await j.json().catch(()=>({error:"Move failed"})),X=Error(Z.error||`HTTP ${j.status}`);throw X.status=j.status,X.code=Z.code,X}return j.json()}async function j9(_){let $=`/workspace/file?path=${encodeURIComponent(_||"")}`;return u0($,{method:"DELETE"})}async function D6(_,$=!1){return u0("/workspace/visibility",{method:"POST",body:JSON.stringify({visible:Boolean(_),show_hidden:Boolean($)})})}function z6(_,$={}){let j=new URLSearchParams({path:String(_||"")});if($.download)j.set("download","1");return`${l1}/workspace/raw?${j.toString()}`}function u2(_){return z6(_,{download:!0})}function v2(_,$=!1){let j=`path=${encodeURIComponent(_||"")}&show_hidden=${$?"1":"0"}`;return`${l1}/workspace/download?${j}`}class m2{onEvent;onStatusChange;chatJid;eventSource;reconnectTimeout;reconnectDelay;status;reconnectAttempts;cooldownUntil;connecting;lastActivityAt;staleCheckTimer;staleThresholdMs;constructor(_,$,j={}){this.onEvent=_,this.onStatusChange=$,this.chatJid=typeof j?.chatJid==="string"&&j.chatJid.trim()?j.chatJid.trim():null,this.eventSource=null,this.reconnectTimeout=null,this.reconnectDelay=1000,this.status="disconnected",this.reconnectAttempts=0,this.cooldownUntil=0,this.connecting=!1,this.lastActivityAt=0,this.staleCheckTimer=null,this.staleThresholdMs=70000}markActivity(){this.lastActivityAt=Date.now()}clearStaleMonitor(){if(this.staleCheckTimer)clearInterval(this.staleCheckTimer),this.staleCheckTimer=null}startStaleMonitor(){this.clearStaleMonitor(),this.staleCheckTimer=setInterval(()=>{if(this.status!=="connected")return;if(!this.lastActivityAt)return;if(Date.now()-this.lastActivityAt<=this.staleThresholdMs)return;console.warn("SSE connection went stale; forcing reconnect"),this.forceReconnect()},15000)}forceReconnect(){if(this.connecting=!1,this.eventSource)this.eventSource.close(),this.eventSource=null;this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()}connect(){if(this.connecting)return;if(this.eventSource&&this.status==="connected")return;if(this.connecting=!0,this.eventSource)this.eventSource.close();this.clearStaleMonitor();let _=this.chatJid?`?chat_jid=${encodeURIComponent(this.chatJid)}`:"";this.eventSource=new EventSource(l1+"/sse/stream"+_);let $=(j)=>{this.eventSource.addEventListener(j,(Z)=>{this.markActivity(),this.onEvent(j,JSON.parse(Z.data))})};this.eventSource.onopen=()=>{this.connecting=!1,this.reconnectDelay=1000,this.reconnectAttempts=0,this.cooldownUntil=0,this.status="connected",this.markActivity(),this.startStaleMonitor(),this.onStatusChange("connected")},this.eventSource.onerror=()=>{this.connecting=!1,this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()},this.eventSource.addEventListener("connected",()=>{this.markActivity(),console.log("SSE connected"),this.onEvent("connected",{})}),this.eventSource.addEventListener("heartbeat",()=>{this.markActivity()}),$("new_post"),$("new_reply"),$("agent_response"),$("interaction_updated"),$("interaction_deleted"),$("agent_status"),$("agent_steer_queued"),$("agent_followup_queued"),$("agent_followup_consumed"),$("agent_followup_removed"),$("workspace_update"),$("agent_draft"),$("agent_draft_delta"),$("agent_thought"),$("agent_thought_delta"),$("model_changed"),$("ui_theme"),$("ui_meters"),["extension_ui_request","extension_ui_timeout","extension_ui_notify","extension_ui_status","extension_ui_working","extension_ui_working_indicator","extension_ui_working_visible","extension_ui_widget","extension_ui_title","extension_ui_editor_text","extension_ui_error"].forEach($)}scheduleReconnect(){if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout);let _=10,$=60000,j=Date.now();if(this.reconnectAttempts>=_)this.cooldownUntil=Math.max(this.cooldownUntil,j+$),this.reconnectAttempts=0;let Z=Math.max(this.cooldownUntil-j,0),X=Math.max(this.reconnectDelay,Z);this.reconnectTimeout=setTimeout(()=>{console.log("Reconnecting SSE..."),this.connect()},X),this.reconnectDelay=Math.min(this.reconnectDelay*2,30000)}reconnectIfNeeded(){let _=Date.now();if(this.status==="connected"){if(this.lastActivityAt&&_-this.lastActivityAt>this.staleThresholdMs)this.forceReconnect();return}if(this.cooldownUntil&&_<this.cooldownUntil)return;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null;this.connect()}disconnect(){if(this.connecting=!1,this.clearStaleMonitor(),this.eventSource)this.eventSource.close(),this.eventSource=null;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null}}var l1="",M7=1073741824,SL=8388608;var T1=J1(()=>{Y6()});function J5(_){let $=typeof _==="string"?_.trim():"";return $?$:null}function a_(_={}){if(typeof window>"u")return;let $=J5(_.section);try{if(window.__piclawSettingsOpenRequested=!0,$)window.__piclawSettingsRequestedSection=$;else delete window.__piclawSettingsRequestedSection}catch(j){console.debug("[settings-dialog-events] failed to record open request flags",j)}window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:$?{section:$}:void 0}))}function F9(){if(typeof window>"u")return null;return J5(window.__piclawSettingsRequestedSection)}function r2(){if(typeof window>"u")return{open:!1,section:null};let _=Boolean(window.__piclawSettingsOpenRequested),$=F9();try{window.__piclawSettingsOpenRequested=!1,delete window.__piclawSettingsRequestedSection}catch(j){console.debug("[settings-dialog-events] failed to clear open request flags",j)}return{open:_,section:$}}function i$({children:_,className:$=""}){let[j,Z]=C(null);return b(()=>{if(typeof document>"u")return;let X=document.createElement("div");return X.className=$||"",document.body.appendChild(X),Z(X),()=>{try{U$(null,X)}finally{X.remove()}}},[]),b(()=>{if(!j)return;j.className=$||"";return},[$,j]),G5(()=>{if(!j)return;U$(_,j);return},[_,j]),null}var n2=J1(()=>{M0()});function U9(_,$){let j=String(_.label||"").localeCompare(String($.label||""),void 0,{sensitivity:"base"});if(j!==0)return j;return String(_.id||"").localeCompare(String($.id||""),void 0,{sensitivity:"base"})}function s$(_){let $=P4.findIndex((j)=>j.id===_.id);if($>=0)P4[$]=_;else P4.push(_);P4.sort(U9)}function sq(_){let $=P4.findIndex((j)=>j.id===_);if($>=0)P4.splice($,1)}function aq(){return[...P4]}function D9(){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent("piclaw:settings-panes-changed"))}var P4;var E5=J1(()=>{P4=[]});function YJ(_){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(f4,{detail:{enabled:Boolean(_)}}))}function _Q(_){if(typeof fetch!=="function")return;S7({ui_meters:_}).catch(($)=>{console.debug("[meters] Failed to persist meters UI state.",$)})}function NJ(_){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(o2,{detail:{collapsed:Boolean(_)}}))}function M6(_=!1){return W$(tq,_)}function $Q(_=!1){return W$(eq,_)}function d2(_,$={}){let j=$.persist!==!1,Z=$.persistServer!==!1,X=Boolean(_);if(j)K1(tq,X?"true":"false");if(Z)_Q({enabled:X});return YJ(X),X}function z9(_,$={}){let j=$.persist!==!1,Z=$.persistServer!==!1,X=Boolean(_);if(j)K1(eq,X?"true":"false");if(Z)_Q({collapsed:X});return NJ(X),X}function W9(_){let $=typeof _?.mode==="string"?_.mode.trim().toLowerCase():"";if(typeof _?.enabled==="boolean")d2(Boolean(_.enabled),{persistServer:!1});else if($==="toggle"){let j=!M6(!1);d2(j,{persistServer:!1})}if(typeof _?.collapsed==="boolean")z9(Boolean(_.collapsed),{persistServer:!1})}var tq="piclaw_system_meters_enabled",eq="piclaw_system_meters_collapsed",f4="piclaw-meters-change",o2="piclaw-meters-collapsed-change";var i2=J1(()=>{T1()});function jQ(_,$){if(_===""||_===null||_===void 0)return $;let j=Number(_);return Number.isFinite(j)?j:$}function ZQ(_,{min:$=-1/0,max:j=1/0}={}){let Z=Number.isFinite(Number($))?Number($):-1/0,X=Number.isFinite(Number(j))?Number(j):1/0;return Math.min(X,Math.max(Z,Number(_)))}function A$(_,{fallback:$=0,min:j=-1/0,max:Z=1/0}={}){let X=jQ(_,$);return ZQ(X,{min:j,max:Z})}function BJ(_,{direction:$=1,step:j=1,fallback:Z=0,min:X=-1/0,max:G=1/0}={}){let q=A$(_,{fallback:Z,min:X,max:G}),Q=Math.abs(jQ(j,1))||1,K=Number($)<0?-1:1;return ZQ(q+K*Q,{min:X,max:G})}function m1({value:_,min:$,max:j,step:Z=1,fallback:X,width:G="80px",disabled:q=!1,label:Q,onChange:K}){let V=Number.isFinite(Number(X))?Number(X):A$(_,{fallback:0,min:$,max:j}),[Y,N]=C(String(_??V)),F=g(!1);b(()=>{if(!F.current)N(String(_??V))},[_,V]);let B=R((W)=>{F.current=!1;let H=A$(W,{fallback:V,min:$,max:j});N(String(H)),K?.(H)},[V,$,j,K]),D=R((W)=>{F.current=!1;let H=BJ(_,{direction:W,step:Z,fallback:V,min:$,max:j});N(String(H)),K?.(H)},[V,j,$,K,Z,_]);return U`
        <span class="settings-number-stepper">
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Decrease ${Q||"value"}`}
                title=${`Decrease ${Q||"value"}`}
                disabled=${q}
                onClick=${()=>D(-1)}
            >−</button>
            <input
                class="settings-number-input"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                value=${Y}
                disabled=${q}
                style=${`width:${G}`}
                onInput=${(W)=>{F.current=!0,N(W.target.value)}}
                onBlur=${(W)=>B(W.target.value)}
                onKeyDown=${(W)=>{if(W.key==="Enter")W.preventDefault(),B(W.target.value),W.target.blur()}}
            />
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Increase ${Q||"value"}`}
                title=${`Increase ${Q||"value"}`}
                disabled=${q}
                onClick=${()=>D(1)}
            >+</button>
        </span>
    `}var R4=J1(()=>{M0()});function XQ(_){let $=String(_||"").trim();if(!$)return"";if($.startsWith("http://")||$.startsWith("https://")||$.startsWith("data:")||$.startsWith("blob:"))return $;if($.startsWith("/workspace/"))return`/workspace/file?path=${encodeURIComponent($.slice(11))}`;if($.startsWith("/"))return"";if(/^[a-zA-Z]:[\\/]/.test($))return"";if($.startsWith("\\\\"))return"";if($.includes("\\"))return"";return`/workspace/file?path=${encodeURIComponent($.replace(/^\.\//,""))}`}function GQ({value:_,onChange:$}){let j=g(null),[Z,X]=C(XQ(_));b(()=>{X(XQ(_))},[_]);let G=R((q)=>{let Q=q.target.files?.[0];if(!Q)return;let K=new FileReader;K.onload=()=>{let V=K.result;X(V),$?.(V)},K.readAsDataURL(Q)},[$]);return U`
        <div class="settings-avatar-inline" onClick=${()=>j.current?.click()} title="Click to upload">
            ${Z?U`<img src=${Z} alt="avatar" />`:U`<span class="settings-avatar-placeholder">+</span>`}
            <input type="file" accept="image/*" ref=${j} style="display:none" onChange=${G} />
        </div>
    `}function qQ(_={}){return{userName:_.userName||"",userAvatar:_.userAvatar||"",assistantName:_.assistantName||"",assistantAvatar:_.assistantAvatar||"",composeUploadLimitMb:_.composeUploadLimitMb??32,workspaceUploadLimitMb:_.workspaceUploadLimitMb??256}}async function FJ(_,$={}){let j=typeof _==="string"?_:"";if(!j)return!1;let Z=$.navigator??(typeof navigator<"u"?navigator:null),X=$.document??(typeof document<"u"?document:null);if(Z?.clipboard?.writeText)try{return await Z.clipboard.writeText(j),!0}catch(G){}try{if(!X?.body||typeof X.createElement!=="function"||typeof X.execCommand!=="function")return!1;let G=X.createElement("textarea");G.value=j,G.setAttribute?.("readonly",""),G.style.position="fixed",G.style.left="-9999px",G.style.top="0",G.style.opacity="0",X.body.appendChild(G),G.focus?.(),G.select?.();let q=Boolean(X.execCommand("copy"));return X.body.removeChild(G),q}catch(G){return!1}}function H9({settingsData:_,setStatus:$,mergeSettingsData:j}){let[Z,X]=C(""),[G,q]=C(""),[Q,K]=C(""),[V,Y]=C(""),[N,F]=C(32),[B,D]=C(256),[W,H]=C(""),[z,k]=C(!1),[J,L]=C(!1),[x,I]=C(!1),[E,M]=C(()=>M6(!1)),[O,T]=C(!1),y=g(""),A=g(null),P=g(!0);b(()=>{return P.current=!0,()=>{P.current=!1}},[]);let f=R((X0)=>{let j0=qQ(X0);X(j0.userName),q(j0.userAvatar),K(j0.assistantName),Y(j0.assistantAvatar),F(j0.composeUploadLimitMb),D(j0.workspaceUploadLimitMb),H(X0?.widgetToken||""),y.current=JSON.stringify(j0)},[]);b(()=>{f(_||{})},[_,f]),b(()=>{let X0=(j0)=>{M(Boolean(j0?.detail?.enabled))};return window.addEventListener(f4,X0),()=>window.removeEventListener(f4,X0)},[]);let u=q0(()=>JSON.stringify(qQ({userName:Z,userAvatar:G,assistantName:Q,assistantAvatar:V,composeUploadLimitMb:N,workspaceUploadLimitMb:B})),[Z,G,Q,V,N,B]);b(()=>{if(u===y.current)return;if(A.current)clearTimeout(A.current);return A.current=setTimeout(async()=>{if(!P.current)return;let X0=document.activeElement;if(X0&&X0.closest?.(".settings-number-stepper"))return;try{let j0=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:u}),Q0=await j0.json().catch(()=>({}));if(!P.current)return;if(!j0.ok||!Q0?.ok||!Q0?.settings)return;y.current=u,j?.(Q0.settings),T(!0),setTimeout(()=>{if(P.current)T(!1)},4000)}catch(j0){console.warn("[settings/general] Failed to persist general settings snapshot.",j0)}},800),()=>{if(A.current)clearTimeout(A.current)}},[u,j]);let c=_?.instanceTotp||{configured:!1,issuer:Q||"Piclaw",label:Z?`${Q||"Piclaw"}:${Z}`:Q||"Piclaw",secret:"",otpauth:"",qrSvg:""},r=R(async()=>{if(!W)return;if(await FJ(W))L(!0),setTimeout(()=>{if(P.current)L(!1)},3000);else $?.("Could not copy widget token. Select the token field and copy manually."),console.warn("[settings/general] Failed to copy widget token. Clipboard APIs unavailable or blocked.")},[W,$]),e=R(async()=>{if(x)return;if(!confirm("Regenerate the widget token? Existing macOS widgets using the old token will stop updating."))return;I(!0);try{let X0=await fetch("/agent/settings/widget-token/regenerate",{method:"POST"}),j0=await X0.json().catch(()=>({}));if(!X0.ok||!j0?.ok||!j0?.settings)throw Error(j0?.error||"Failed to regenerate widget token.");H(j0.settings.widgetToken||""),j?.(j0.settings),T(!0),setTimeout(()=>{if(P.current)T(!1)},4000)}catch(X0){console.warn("[settings/general] Failed to regenerate widget token.",X0)}finally{if(P.current)I(!1)}},[x,j]),m=typeof window<"u"&&window.isSecureContext,_0=W?"•".repeat(Math.min(Math.max(W.length,16),48)):"—",H0=z?W||"—":_0;return U`
        <div class="settings-section">
            ${O&&U`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Identity</h3>
            <div class="settings-row">
                <label>User</label>
                <${GQ} value=${G} onChange=${q} />
                <input type="text" value=${Z} onInput=${(X0)=>X(X0.target.value)} placeholder="Your name" />
            </div>
            <div class="settings-row">
                <label>Agent</label>
                <${GQ} value=${V} onChange=${Y} />
                <input type="text" value=${Q} onInput=${(X0)=>K(X0.target.value)} placeholder="Agent name" />
            </div>

            <h3 style="margin-top:20px">Notifications</h3>
            ${m?U`
                <div class="settings-row">
                    <label>Browser notifications</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="settings-hint" style="margin:0">
                            Use the 🔔 bell button in the compose bar to enable/disable notifications.
                            Web Push requires HTTPS or localhost.
                        </span>
                    </div>
                </div>
            `:U`
                <div class="settings-row">
                    <label>Browser notifications</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="settings-hint" style="margin:0; color: var(--error-color, #e55)">
                            ⚠ Not available — requires a secure context (HTTPS or localhost).
                            Access via SSH tunnel or reverse proxy with TLS to enable.
                        </span>
                    </div>
                </div>
            `}

            <h3 style="margin-top:20px">Display</h3>
            <div class="settings-row">
                <label>System meters</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${E}
                        onChange=${()=>{let X0=d2(!E);M(X0)}} />
                    <span class="settings-hint" style="margin:0">CPU/memory/network meters in the status bar. This browser only.</span>
                </div>
            </div>

            <h3 style="margin-top:20px">Instance Configuration</h3>
            <div class="settings-row">
                <label>Compose upload (MB)</label>
                <${m1}
                    label="compose upload limit"
                    value=${N}
                    min=${1}
                    max=${512}
                    fallback=${32}
                    width="80px"
                    onChange=${F}
                />
                <span class="settings-hint" style="margin:0">chat/media attachments</span>
            </div>
            <div class="settings-row">
                <label>Workspace upload (MB)</label>
                <${m1}
                    label="workspace upload limit"
                    value=${B}
                    min=${1}
                    max=${1024}
                    fallback=${256}
                    width="80px"
                    onChange=${D}
                />
                <span class="settings-hint" style="margin:0">defaults to 256 MB; chunked uploads allow up to 1 GB</span>
            </div>

            <h3 style="margin-top:20px">Authentication</h3>
            <div class="settings-row settings-row-vertical settings-widget-token-row">
                <label>Widget bearer token</label>
                <div class="settings-keychain-reveal-panel settings-widget-token-panel">
                    <div class="settings-keychain-reveal-field settings-widget-token-field">
                        <span class="settings-keychain-reveal-label">Token</span>
                        <code class="settings-keychain-reveal-value settings-widget-token-value">${H0}</code>
                        <button class=${`settings-keychain-reveal-btn${z?" active":""}`}
                            type="button"
                            onClick=${()=>k((X0)=>!X0)}
                            disabled=${!W}
                            title=${z?"Hide token":"Reveal token"}>
                            ${z?U`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:U`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                        </button>
                        <button class="settings-keychain-copy-btn" type="button" onClick=${r} disabled=${!W} title="Copy token">
                            ${J?U`<span class="settings-widget-token-copied">Copied</span>`:U`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`}
                        </button>
                        <button class="settings-keychain-prompt-submit settings-widget-token-regenerate" type="button" onClick=${e} disabled=${x}>${x?"Regenerating…":"Regenerate"}</button>
                    </div>
                </div>
                <span class="settings-hint" style="margin:6px 0 0 0;">
                    Read-only token for <code>GET /api/state</code> and <code>GET /api/state/events</code>. Use as <code>Authorization: Bearer …</code>.
                </span>
            </div>
            <div class="settings-totp-panel">
                <div class="settings-totp-header">
                    <div>
                        <strong>TOTP setup QR</strong>
                        <div class="settings-hint" style="margin:6px 0 0 0;">
                            ${c.configured?"Current web-login authenticator secret. Scan this QR to add another authenticator device.":"TOTP is not configured for this instance yet, so no setup QR is available."}
                        </div>
                    </div>
                </div>
                ${c.configured?U`
                    <div class="settings-totp-grid">
                        <div class="settings-totp-qr" dangerouslySetInnerHTML=${{__html:c.qrSvg}}></div>
                        <div class="settings-totp-meta">
                            <div class="settings-row settings-row-vertical">
                                <label>Issuer</label>
                                <input type="text" readonly value=${c.issuer||""} />
                            </div>
                            <div class="settings-row settings-row-vertical">
                                <label>Label</label>
                                <input type="text" readonly value=${c.label||""} />
                            </div>
                            <div class="settings-row settings-row-vertical">
                                <label>Secret</label>
                                <input type="text" readonly value=${c.secret||""} />
                            </div>
                        </div>
                    </div>
                `:null}
            </div>
        </div>
    `}var QQ=J1(()=>{M0();i2();R4()});var KQ={};$_(KQ,{SessionsSection:()=>UJ});function VQ(_={}){return{sessionAutoRotate:_.sessionAutoRotate!==!1,sessionMaxSizeMb:_.sessionMaxSizeMb??16,sessionMaxLines:_.sessionMaxLines??4000,sessionMaxCompactions:_.sessionMaxCompactions??3,sessionIsolation:_.sessionIsolation||"none",toolUseBudget:_.toolUseBudget??64}}function UJ({settingsData:_,setStatus:$,mergeSettingsData:j}){let[Z,X]=C(!0),[G,q]=C(16),[Q,K]=C(4000),[V,Y]=C(3),[N,F]=C(64),[B,D]=C("none"),[W,H]=C(!1),z=g(""),k=g(null),J=g(!0);b(()=>{return J.current=!0,()=>{J.current=!1}},[]);let L=R((I)=>{let E=VQ(I);X(E.sessionAutoRotate),q(E.sessionMaxSizeMb),K(E.sessionMaxLines),Y(E.sessionMaxCompactions),F(E.toolUseBudget),D(E.sessionIsolation),z.current=JSON.stringify(E)},[]);b(()=>{L(_||{})},[_,L]);let x=q0(()=>JSON.stringify(VQ({sessionAutoRotate:Z,sessionMaxSizeMb:G,sessionMaxLines:Q,sessionMaxCompactions:V,toolUseBudget:N,sessionIsolation:B})),[Z,G,Q,V,N,B]);return b(()=>{if(x===z.current)return;if(k.current)clearTimeout(k.current);return k.current=setTimeout(async()=>{if(!J.current)return;let I=document.activeElement;if(I&&I.closest?.(".settings-number-stepper"))return;try{let E=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:x}),M=await E.json().catch(()=>({}));if(!J.current)return;if(!E.ok||!M?.ok||!M?.settings)return;z.current=x,j?.(M.settings),H(!0),setTimeout(()=>{if(J.current)H(!1)},4000)}catch(E){console.warn("[settings/sessions] Failed to persist session settings.",E)}},800),()=>{if(k.current)clearTimeout(k.current)}},[x,j]),U`
        <div class="settings-section">
            ${W&&U`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Session Lifecycle</h3>
            <div class="settings-row">
                <label>Auto-rotate sessions</label>
                <input type="checkbox" checked=${Z} onChange=${(I)=>X(I.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Max session size (MB)</label>
                <${m1}
                    label="max session size"
                    value=${G}
                    min=${1}
                    max=${256}
                    fallback=${32}
                    width="80px"
                    onChange=${q}
                />
            </div>

            <h3 style="margin-top:20px">Agent Behaviour</h3>
            <div class="settings-row">
                <label>Tool use budget</label>
                <${m1}
                    label="tool use budget"
                    value=${N}
                    min=${8}
                    max=${512}
                    fallback=${64}
                    width="80px"
                    onChange=${F}
                />
                <span class="settings-hint" style="margin:0">max tool-call messages per turn</span>
            </div>
            <div class="settings-row">
                <label>Session isolation</label>
                <select value=${B} onChange=${(I)=>D(I.target.value)}>
                    <option value="none">None — full cross-session visibility</option>
                    <option value="summary">Summary — tools visible, no arguments</option>
                    <option value="full">Full — sessions cannot see each other</option>
                </select>
            </div>
        </div>
    `}var YQ=J1(()=>{M0();R4()});var NQ={};$_(NQ,{__recordingsSettingsTest:()=>HJ,RecordingsSection:()=>WJ});function a2(_){if(!_)return"—";let $=new Date(_);if(Number.isNaN($.getTime()))return _;return $.toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function O9(_){if(_==="full")return"full / trusted";if(_==="metadata")return"metadata only";return"redacted"}function s2({children:_,type:$="neutral"}){return U`<span class=${`settings-task-pill settings-task-pill-${$}`}>${_}</span>`}function DJ(){if(typeof window>"u")return"web:default";return String(window.__piclawCurrentChatJid||"web:default")}function k6(_){return String(_||"").split(`
`).map(($)=>$.trim()).filter(Boolean)}function zJ({recording:_,details:$,onDelete:j,onRefresh:Z}){if(!_)return U`<div class="settings-task-detail-empty">Select a recording to inspect, replay, export, or delete it.</div>`;let X=$?.meta||_,G=Array.isArray($?.events)?$.events:[],q=G.reduce((K,V)=>K+(Array.isArray(V.redactions)?V.redactions.length:0),0),Q=G.reduce((K,V)=>{let Y=V.kind||"event";return K[Y]=(K[Y]||0)+1,K},{});return U`
        <div class="settings-task-detail settings-recording-detail">
            <div class="settings-task-detail-header">
                <div>
                    <h4>${X.title||X.id}</h4>
                    <code>${X.id}</code>
                </div>
                <div class="settings-task-detail-actions">
                    <button onClick=${()=>window.open(f7(X.id),"_blank","noopener,noreferrer")}>Playback</button>
                    <button onClick=${Z}>Refresh</button>
                    <button class="danger" onClick=${()=>j(X)}>Delete</button>
                </div>
            </div>
            <div class="settings-task-detail-grid">
                <span>Status</span><strong>${X.status||"—"}</strong>
                <span>Mode</span><strong>${O9(X.mode)}</strong>
                <span>Chat</span><code>${X.chatJid||"—"}</code>
                <span>Started</span><strong>${a2(X.startedAt)}</strong>
                <span>Ended</span><strong>${a2(X.endedAt)}</strong>
                <span>Events</span><strong>${X.eventCount??G.length}</strong>
                <span>Redactions</span><strong>${q}</strong>
            </div>
            <div class="settings-recording-export-row">
                <a href=${N6(X.id,"json")}>Export JSON</a>
                <a href=${N6(X.id,"jsonl")}>Export JSONL</a>
                <a href=${N6(X.id,"html")}>Export standalone HTML</a>
            </div>
            <h4>Event summary</h4>
            ${G.length===0&&U`<p class="settings-hint">Open or refresh details to inspect trace events.</p>`}
            ${G.length>0&&U`
                <div class="settings-recording-event-summary">
                    ${Object.entries(Q).map(([K,V])=>U`<${s2}>${K}: ${V}<//>`)}
                </div>
                <div class="settings-task-command-block">
                    <strong>First events</strong>
                    <pre>${JSON.stringify(G.slice(0,5),null,2)}</pre>
                </div>
            `}
        </div>
    `}function WJ({filter:_="",setStatus:$}){let[j,Z]=C([]),[X,G]=C([]),[q,Q]=C(!0),[K,V]=C(null),[Y,N]=C(null),[F,B]=C(null),[D,W]=C(!1),[H,z]=C(DJ),[k,J]=C(""),[L,x]=C("redacted"),[I,E]=C(!0),[M,O]=C(""),[T,y]=C(""),[A,P]=C('{"Authorization":"Bearer abc1234567890","content":"hello"}'),[f,u]=C(null);b(()=>{let h=($0)=>{let K0=String($0?.detail?.chatJid||"").trim();if(K0)z(K0)};return window.addEventListener("piclaw:current-chat-changed",h),()=>window.removeEventListener("piclaw:current-chat-changed",h)},[]);let c=R(async(h=Y)=>{Q(!0),V(null);try{let $0=await I7(),K0=$0.recordings||[];Z(K0),G($0.active||[]);let L0=K0.find((a)=>a.id===h)||K0[0]||null;if(N(L0?.id||null),L0?.id)B(await R2(L0.id));else B(null)}catch($0){V($0?.message||"Failed to load recordings.")}finally{Q(!1)}},[Y]);b(()=>{c()},[c]);let r=q0(()=>j.find((h)=>h.id===Y)||null,[j,Y]),e=q0(()=>X.find((h)=>h.chatJid===H)||null,[X,H]),m=String(_||"").trim().toLowerCase(),_0=q0(()=>{if(!m)return j;return j.filter((h)=>[h.id,h.title,h.chatJid,h.status,h.mode].some(($0)=>String($0||"").toLowerCase().includes(m)))},[j,m]),H0=R(async(h)=>{if(N(h?.id||null),B(null),!h?.id)return;try{B(await R2(h.id))}catch($0){$?.($0?.message||"Failed to load recording.","error")}},[$]),X0=R(async()=>{if(D)return;W(!0);try{let h={keys:k6(M),patterns:k6(T)},$0=await x7({chat_jid:H,title:k||void 0,mode:L,include_timeline_snapshot:I,timeline_snapshot_limit:80,redaction:h});$?.(`Recording started for ${H}.`,"success"),await c($0?.recording?.id)}catch(h){$?.(h?.message||"Failed to start recording.","error")}finally{W(!1)}},[D,H,M,T,I,c,L,$,k]),j0=R(async(h=e)=>{if(!h||D)return;W(!0);try{let $0=await C7({id:h.id});$?.(`Recording stopped for ${h.chatJid}.`,"success"),await c($0?.recording?.id)}catch($0){$?.($0?.message||"Failed to stop recording.","error")}finally{W(!1)}},[D,e,c,$]),Q0=R(async(h)=>{if(!h||D)return;if(!window.confirm(`Delete recording ${h.id}?

${h.title||""}`))return;W(!0);try{await P7(h.id),$?.("Recording deleted.","success"),await c(null)}catch($0){$?.($0?.message||"Failed to delete recording.","error")}finally{W(!1)}},[D,c,$]),F0=R(async()=>{try{let h=JSON.parse(A||"null"),$0=await R7(h,{mode:L,redaction:{keys:k6(M),patterns:k6(T)}});u($0.preview)}catch(h){u({error:h?.message||"Preview failed."})}},[M,T,L,A]);return U`
        <div class="settings-section settings-recordings-section">
            <div class="settings-recording-start-card">
                <h3>Session Recording</h3>
                <p class="settings-hint">Opt-in trace capture for deterministic playback and screen-recording exports. Playback never calls live agent or tool endpoints.</p>
                <div class="settings-recording-form-grid">
                    <label>Chat JID<input value=${H} onInput=${(h)=>z(h.target.value)} /></label>
                    <label>Title<input placeholder="Demo recording" value=${k} onInput=${(h)=>J(h.target.value)} /></label>
                    <label>Mode<select value=${L} onChange=${(h)=>x(h.target.value)}><option value="redacted">Redacted</option><option value="metadata">Metadata only</option><option value="full">Full / trusted local</option></select></label>
                    <label class="settings-recording-checkbox"><input type="checkbox" checked=${I} onChange=${(h)=>E(h.target.checked)} /> Include timeline snapshot</label>
                </div>
                <div class="settings-recording-form-grid settings-recording-redaction-grid">
                    <label>Extra redacted keys<textarea rows="2" placeholder="customer_id\ninternal_code" value=${M} onInput=${(h)=>O(h.target.value)} /></label>
                    <label>Extra regex patterns<textarea rows="2" placeholder="ACME-[0-9]+" value=${T} onInput=${(h)=>y(h.target.value)} /></label>
                </div>
                <div class="settings-task-detail-actions">
                    ${e?U`<button onClick=${()=>j0(e)} disabled=${D}>Stop current chat recording</button>`:U`<button onClick=${X0} disabled=${D}>Start recording</button>`}
                    <button onClick=${()=>c()} disabled=${q}>Refresh</button>
                </div>
                ${X.length>0&&U`<div class="settings-recording-active-row">${X.map((h)=>U`<${s2} type="active">REC ${h.chatJid}<//>`)}</div>`}
            </div>

            <details class="settings-recording-preview">
                <summary>Redaction preview</summary>
                <textarea rows="4" value=${A} onInput=${(h)=>P(h.target.value)} />
                <div class="settings-task-detail-actions"><button onClick=${F0}>Preview redaction</button></div>
                ${f&&U`<pre>${JSON.stringify(f,null,2)}</pre>`}
            </details>

            ${q&&U`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>Loading recordings…</span></div>`}
            ${K&&U`<div class="settings-error-state">${K}</div>`}
            ${!q&&!K&&j.length===0&&U`<div class="settings-empty-state"><strong>No recordings yet.</strong><p>Start a recording above, then use playback/export for deterministic screen capture.</p></div>`}
            ${!q&&!K&&j.length>0&&U`
                <div class="settings-task-layout">
                    <div class="settings-task-list" role="listbox" aria-label="Session recordings">
                        ${_0.map((h)=>U`
                            <button class=${`settings-task-row ${h.id===Y?"active":""}`} onClick=${()=>H0(h)}>
                                <span class="settings-task-row-main"><strong>${h.title||h.id}</strong><span>${h.chatJid} · ${a2(h.startedAt)}</span></span>
                                <span class="settings-task-row-meta"><${s2} type=${h.status==="recording"?"active":"completed"}>${h.status}<//><${s2}>${O9(h.mode)}<//></span>
                                <span class="settings-task-row-times">${h.eventCount||0} events</span>
                            </button>
                        `)}
                        ${_0.length===0&&U`<p class="settings-hint">No recordings match “${_}”.</p>`}
                    </div>
                    <${zJ} recording=${r} details=${F} onDelete=${Q0} onRefresh=${()=>r&&H0(r)} />
                </div>
            `}
        </div>
    `}var HJ;var BQ=J1(()=>{M0();T1();HJ={formatDateTime:a2,modeLabel:O9,parseList:k6}});var FQ={};$_(FQ,{CompactionSection:()=>LJ});function OJ(_={}){return{compactionTimeoutSec:_.compactionTimeoutSec??180,compactionBackoffBaseMin:_.compactionBackoffBaseMin??15,compactionBackoffMaxMin:_.compactionBackoffMaxMin??360,compactionThresholdPercent:_.compactionThresholdPercent??75,compactionBackoffDecayFactor:_.compactionBackoffDecayFactor??0.5,progressWatchdogEnabled:Boolean(_.progressWatchdogEnabled??!1),progressWatchdogTimeoutSec:_.progressWatchdogTimeoutSec??120,compactionBackoffs:Array.isArray(_.compactionBackoffs)?_.compactionBackoffs:[],progressWatchdogPhases:Array.isArray(_.progressWatchdogPhases)?_.progressWatchdogPhases:[]}}function L9(_){let $=String(_||"").trim();if(!$)return"—";let j=new Date($);if(Number.isNaN(j.getTime()))return $;return j.toLocaleString()}function LJ({settingsData:_,setStatus:$,mergeSettingsData:j}){let[Z,X]=C(180),[G,q]=C(15),[Q,K]=C(360),[V,Y]=C(75),[N,F]=C(0.5),[B,D]=C(!1),[W,H]=C(120),[z,k]=C([]),[J,L]=C([]),[x,I]=C(!1),E=g(""),M=g(null),O=g(!0);b(()=>{return O.current=!0,()=>{O.current=!1}},[]);let T=R((P)=>{let f=OJ(P);X(f.compactionTimeoutSec),q(f.compactionBackoffBaseMin),K(f.compactionBackoffMaxMin),Y(f.compactionThresholdPercent),F(f.compactionBackoffDecayFactor),D(f.progressWatchdogEnabled),H(f.progressWatchdogTimeoutSec),k(f.compactionBackoffs),L(f.progressWatchdogPhases),E.current=JSON.stringify({compactionTimeoutSec:f.compactionTimeoutSec,compactionBackoffBaseMin:f.compactionBackoffBaseMin,compactionBackoffMaxMin:f.compactionBackoffMaxMin,compactionThresholdPercent:f.compactionThresholdPercent,compactionBackoffDecayFactor:f.compactionBackoffDecayFactor,progressWatchdogEnabled:f.progressWatchdogEnabled,progressWatchdogTimeoutSec:f.progressWatchdogTimeoutSec})},[]);b(()=>{T(_||{})},[_,T]);let y=q0(()=>JSON.stringify({compactionTimeoutSec:Z,compactionBackoffBaseMin:G,compactionBackoffMaxMin:Q,compactionThresholdPercent:V,compactionBackoffDecayFactor:N,progressWatchdogEnabled:B,progressWatchdogTimeoutSec:W}),[Z,G,Q,V,N,B,W]);b(()=>{if(y===E.current)return;if(M.current)clearTimeout(M.current);return M.current=setTimeout(async()=>{if(!O.current)return;let P=document.activeElement;if(P&&P.closest?.(".settings-number-stepper"))return;try{$?.("Saving compaction settings…","info");let f=await fetch("/agent/settings/compaction",{method:"POST",headers:{"Content-Type":"application/json"},body:y}),u=await f.json().catch(()=>({}));if(!O.current)return;if(!f.ok||!u?.ok||!u?.settings){$?.(u?.error||"Failed to save compaction settings.","error");return}E.current=y,j?.(u.settings),T({..._||{},...u.settings||{}}),$?.("Compaction settings saved.","success"),I(!0),setTimeout(()=>{if(O.current)I(!1),$?.(null)},4000)}catch(f){if(console.warn("[settings/compaction] Failed to persist compaction settings.",f),O.current)$?.("Failed to save compaction settings.","error")}},800),()=>{if(M.current)clearTimeout(M.current)}},[y,j,$,T,_]);let A=R(async(P)=>{try{$?.(`Clearing compaction suppression for ${P}…`,"info");let f=await fetch("/agent/settings/compaction/reset-backoff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatJid:P})}),u=await f.json().catch(()=>({}));if(!f.ok||!u?.ok||!u?.settings){$?.(u?.error||"Failed to clear compaction suppression.","error");return}j?.(u.settings),T({..._||{},...u.settings||{}}),$?.(`Cleared compaction suppression for ${P}.`,"success")}catch(f){console.warn("[settings/compaction] Failed to clear compaction suppression.",f),$?.("Failed to clear compaction suppression.","error")}},[T,j,$,_]);return U`
        <div class="settings-section">
            ${x&&U`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Compaction settings applied. Existing turns keep their current timers; new turns use the updated values.
                </div>
            `}

            <h3>Automatic compaction</h3>
            <div class="settings-row">
                <label>Compaction threshold (%)</label>
                <${m1}
                    label="compaction threshold"
                    value=${V}
                    min=${10}
                    max=${95}
                    fallback=${75}
                    width="80px"
                    onChange=${Y}
                />
                <span class="settings-hint" style="margin:0">auto-compact when context exceeds this % of window</span>
            </div>
            <div class="settings-row">
                <label>Compaction timeout (sec)</label>
                <${m1}
                    label="compaction timeout"
                    value=${Z}
                    min=${1}
                    max=${3600}
                    fallback=${180}
                    width="90px"
                    onChange=${X}
                />
                <span class="settings-hint" style="margin:0">Abort a stuck pre-prompt/manual compaction instead of hanging forever.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff base (min)</label>
                <${m1}
                    label="compaction backoff base"
                    value=${G}
                    min=${1}
                    max=${1440}
                    fallback=${15}
                    width="90px"
                    onChange=${q}
                />
                <span class="settings-hint" style="margin:0">First suppression window after a compaction failure.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff max (min)</label>
                <${m1}
                    label="compaction backoff max"
                    value=${Q}
                    min=${1}
                    max=${10080}
                    fallback=${360}
                    width="90px"
                    onChange=${K}
                />
                <span class="settings-hint" style="margin:0">Upper bound for exponential suppression after repeated failures.</span>
            </div>

            <div class="settings-row">
                <label>Backoff decay factor</label>
                <${m1}
                    label="backoff decay factor"
                    value=${Math.round(N*100)}
                    min=${10}
                    max=${100}
                    fallback=${50}
                    width="80px"
                    onChange=${(P)=>F(P/100)}
                />
                <span class="settings-hint" style="margin:0">% — halves backoff after each successful compaction</span>
            </div>

            <h3 style="margin-top:20px">Stall watchdog</h3>
            <div class="settings-row">
                <label>Enable watchdog</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${B} onChange=${(P)=>D(Boolean(P.target.checked))} />
                    <span class="settings-hint" style="margin:0">Disabled by default. When enabled, a helper process terminates the runtime if an active phase stops heartbeating.</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Watchdog timeout (sec)</label>
                <${m1}
                    label="watchdog timeout"
                    value=${W}
                    min=${0}
                    max=${3600}
                    fallback=${120}
                    width="90px"
                    disabled=${!B}
                    onChange=${H}
                />
                <span class="settings-hint" style="margin:0">How long an active phase can go without a heartbeat before the watchdog kills the runtime.</span>
            </div>

            <h3 style="margin-top:20px">Active compaction suppressions</h3>
            ${z.length===0?U`
                <p class="settings-hint">No chats are currently under compaction backoff.</p>
            `:U`
                <div class="settings-table-wrapper">
                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th>Chat</th>
                                <th>Failures</th>
                                <th>Suppressed until</th>
                                <th>Last error</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${z.map((P)=>U`
                                <tr>
                                    <td><code>${P.chatJid}</code></td>
                                    <td>${P.failureCount}</td>
                                    <td>${L9(P.backoffUntil)}</td>
                                    <td title=${P.lastErrorMessage||""}>${P.lastErrorMessage||"—"}</td>
                                    <td>
                                        <button class="settings-secondary-btn" onClick=${()=>A(P.chatJid)}>
                                            Clear
                                        </button>
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            `}

            <h3 style="margin-top:20px">Live watchdog phases</h3>
            ${J.length===0?U`
                <p class="settings-hint">No active tracked phases right now.</p>
            `:U`
                <div class="settings-table-wrapper">
                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th>Chat</th>
                                <th>Phase</th>
                                <th>Started</th>
                                <th>Last heartbeat</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${J.map((P)=>U`
                                <tr>
                                    <td><code>${P.chatJid}</code></td>
                                    <td>${P.phase}</td>
                                    <td>${L9(P.startedAt)}</td>
                                    <td>${L9(P.lastProgressAt)}</td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `}var UQ=J1(()=>{M0();R4()});function zQ(_){let $=String(_||"").trim().toLowerCase();if(!$)return null;let j=AJ[$]||$;if(/^f(?:[1-9]|1[0-2])$/.test(j))return j;if(MJ.has(j))return j;if(j.length===1)return j;if(/^[a-z0-9]+$/.test(j))return j;return null}function A5(_){let $=String(_||"").trim();if(!$)return null;let j=$.split("+").map((G)=>G.trim()).filter(Boolean);if(!j.length)return null;let Z={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let G of j){let q=G.toLowerCase(),Q=EJ[q];if(Q){Z[Q]=!0;continue}if(Z.key)return null;let K=zQ(G);if(!K||K==="escape")return null;Z.key=K}if(!Z.key)return null;let X=[];if(Z.ctrl)X.push("ctrl");if(Z.meta)X.push("meta");if(Z.alt)X.push("alt");if(Z.shift)X.push("shift");return X.push(Z.key),X.join("+")}function WQ(_){return String(_||"").split(/[\n,]/).map(($)=>A5($)).filter(($)=>Boolean($))}function t$(_){return _.join(", ")}function E9(){let _=M2(DQ);if(!_||typeof _!=="object")return{};let $={};for(let j of a$){let Z=_[j.id];if(!Array.isArray(Z))continue;let X=Z.map((G)=>A5(String(G||""))).filter((G)=>Boolean(G));$[j.id]=[...new Set(X)]}return $}function J9(_){if(K1(DQ,JSON.stringify(_)),typeof window<"u")window.dispatchEvent(new CustomEvent("piclaw:keyboard-shortcuts-changed",{detail:{config:_}}))}function HQ(_){return JJ.get(_)}function T6(_){let $=E9()[_];if(Array.isArray($))return $;return[...HQ(_).defaultBindings]}function OQ(_,$){let j=E9(),Z=HQ(_).defaultBindings,X=[...new Set($.map((G)=>A5(G)).filter((G)=>Boolean(G)))];if(X.length===Z.length&&X.every((G,q)=>G===Z[q]))delete j[_];else j[_]=X;J9(j)}function A9(_){if(!_){J9({});return}let $=E9();delete $[_],J9($)}function t2(){let _={};for(let $ of a$)_[$.id]=T6($.id);return _}function kJ(_){let $=typeof _==="string"?_:"";if(!$)return"";if($.length===1)return $.toLowerCase();return zQ($)||$.toLowerCase()}function TJ(_){let $=A5(_);if(!$)return null;let j={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let Z of $.split("+")){if(Z==="ctrl"||Z==="meta"||Z==="alt"||Z==="shift"){j[Z]=!0;continue}j.key=Z}return j.key?j:null}function yJ(_,$){let j=TJ($);if(!j)return!1;if(kJ(_?.key)!==j.key)return!1;let X=!j.shift&&j.key.length===1&&/[^a-z0-9]/i.test(j.key);return Boolean(_?.ctrlKey)===j.ctrl&&Boolean(_?.metaKey)===j.meta&&Boolean(_?.altKey)===j.alt&&(X||Boolean(_?.shiftKey)===j.shift)}function M$(_,$){return T6($).some((j)=>yJ(_,j))}var DQ="piclaw_keyboard_shortcuts_v1",a$,JJ,EJ,AJ,MJ;var e2=J1(()=>{a$=[{id:"openHelp",label:"Open keyboard help",description:"Open Settings → Keyboard. Default: question mark and quote when focus is outside compose and other editable fields.",defaultBindings:["?",'"']},{id:"openSettings",label:"Open settings",description:"Open the settings dialog.",defaultBindings:["ctrl+,","meta+,","alt+,"]},{id:"previousChat",label:"Previous session",description:"Switch to the previous visible chat/session.",defaultBindings:["["]},{id:"nextChat",label:"Next session",description:"Switch to the next visible chat/session.",defaultBindings:["]"]},{id:"toggleDock",label:"Toggle dock",description:"Show or hide the bottom dock panes.",defaultBindings:["ctrl+`"]},{id:"toggleZenMode",label:"Toggle zen mode",description:"Collapse surrounding chrome for a focused chat view.",defaultBindings:["ctrl+shift+z","meta+shift+z"]}],JJ=new Map(a$.map((_)=>[_.id,_])),EJ={cmd:"meta",command:"meta",meta:"meta",super:"meta",ctrl:"ctrl",control:"ctrl",alt:"alt",option:"alt",shift:"shift"},AJ={esc:"escape",return:"enter",spacebar:"space"},MJ=new Set(["tab","enter","space","backspace","delete","insert","clear","home","end","pageup","pagedown","up","down","left","right"])});var LQ={};$_(LQ,{KeyboardSection:()=>IJ});function wJ(_,$,j){let Z=String(_||"").trim().toLowerCase();if(!Z)return!0;return[$.label,$.description,j,...$.defaultBindings||[]].some((X)=>String(X||"").toLowerCase().includes(Z))}function IJ({filter:_="",setStatus:$}){let[j,Z]=C(()=>{let K=t2();return Object.fromEntries(Object.entries(K).map(([V,Y])=>[V,t$(Y)]))});b(()=>{let K=()=>{let V=t2();Z(Object.fromEntries(Object.entries(V).map(([Y,N])=>[Y,t$(N)])))};return window.addEventListener("piclaw:keyboard-shortcuts-changed",K),()=>window.removeEventListener("piclaw:keyboard-shortcuts-changed",K)},[]);let X=q0(()=>a$.filter((K)=>{let V=String(j[K.id]||"");return wJ(_,K,V)}),[j,_]),G=(K)=>{let V=String(j[K]||"").trim(),N=(V?V.split(/[\n,]/).map((B)=>B.trim()).filter(Boolean):[]).filter((B)=>!A5(B));if(N.length>0){$?.(`Invalid shortcut: ${N[0]}. Escape is reserved and cannot be rebound.`,"error");return}let F=WQ(V);OQ(K,F),Z((B)=>({...B,[K]:t$(T6(K))})),$?.("Keyboard shortcuts saved.","success")},q=(K)=>{A9(K),Z((V)=>({...V,[K]:t$(T6(K))})),$?.("Keyboard shortcut reset to default.","success")};return U`
        <div class="settings-section">
            <h3>Keyboard</h3>
            <p class="settings-hint">
                Customize app-wide shortcuts as comma-separated bindings. Changes apply immediately.
                <code>Escape</code> is reserved for dismiss/abort and cannot be rebound.
            </p>
            <p class="settings-hint">
                <code>/help</code> and typing <code>"</code> outside the compose box open this pane.
            </p>

            <div class="settings-row" style="align-items:center; gap:10px; margin-bottom:18px; justify-content:flex-end;">
                <button class="settings-addon-btn" style="min-width:180px; height:40px; font-size:14px;" onClick=${()=>{A9();let K=t2();Z(Object.fromEntries(Object.entries(K).map(([V,Y])=>[V,t$(Y)]))),$?.("Keyboard shortcuts reset to defaults.","success")}}>Reset all to defaults</button>
            </div>

            <div class="settings-shortcut-list" style="display:grid; gap:16px;">
                ${X.map((K)=>U`
                    <div class="settings-shortcut-card" key=${K.id} style="display:grid; grid-template-columns:minmax(240px, 1.25fr) minmax(320px, 1fr); gap:18px; align-items:start; padding:18px 20px; border:1px solid var(--border-color, rgba(120,120,120,.22)); border-radius:16px; background:var(--panel-bg, rgba(255,255,255,.04));">
                        <div class="settings-shortcut-copy" style="min-width:0;">
                            <div class="settings-shortcut-title" style="font-size:17px; font-weight:700; line-height:1.3;">${K.label}</div>
                            <div class="settings-hint" style="margin:6px 0 0 0; font-size:14px; line-height:1.5;">${K.description}</div>
                            <div class="settings-shortcut-default" style="margin-top:10px; font-size:13px; color:var(--text-secondary);">Default: <code style="font-size:13px;">${t$(K.defaultBindings)}</code></div>
                        </div>
                        <div class="settings-shortcut-controls" style="display:grid; gap:10px; min-width:0;">
                            <input
                                type="text"
                                value=${j[K.id]||""}
                                placeholder=${t$(K.defaultBindings)}
                                onInput=${(V)=>Z((Y)=>({...Y,[K.id]:V.target.value}))}
                                style="width:100%; min-height:46px; padding:10px 14px; font-size:16px; line-height:1.35; font-family:var(--font-mono, ui-monospace, monospace); border-radius:12px;"
                            />
                            <div class="settings-shortcut-actions" style="display:flex; justify-content:flex-end; align-items:center; gap:10px; flex-wrap:wrap;">
                                <button class="settings-addon-btn settings-addon-btn-install" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>G(K.id)}>Save</button>
                                <button class="settings-addon-btn" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>q(K.id)}>Default</button>
                            </div>
                        </div>
                    </div>
                `)}
                ${X.length===0&&U`<div class="settings-hint">No shortcuts match this filter.</div>`}
            </div>
        </div>
    `}var JQ=J1(()=>{M0();e2()});function EQ(_,$=M9){let j=Number(_);if(!Number.isFinite(j))return $;return Math.min(300,Math.max(15,Math.round(j)))}function AQ(_,$=k9){let j=Number(_);if(!Number.isFinite(j))return $;return Math.min(8,Math.max(0,Math.round(j)))}function M5(){return{refreshIntervalSec:EQ(J4($8,M9),M9),folderPreviewDepth:AQ(J4(j8,k9),k9)}}function MQ(_={}){let $=M5(),j={refreshIntervalSec:EQ(Object.prototype.hasOwnProperty.call(_,"refreshIntervalSec")?_.refreshIntervalSec:$.refreshIntervalSec,$.refreshIntervalSec),folderPreviewDepth:AQ(Object.prototype.hasOwnProperty.call(_,"folderPreviewDepth")?_.folderPreviewDepth:$.folderPreviewDepth,$.folderPreviewDepth)};if(K1($8,String(j.refreshIntervalSec)),K1(j8,String(j.folderPreviewDepth)),typeof window<"u")window.dispatchEvent(new CustomEvent(_8,{detail:{settings:j}}));return j}var _8="piclaw:workspace-client-settings-updated",$8="workspaceRefreshIntervalSec",j8="workspaceFolderPreviewDepth",M9=60,k9=3;var T9=()=>{};var TQ={};$_(TQ,{WorkspaceSection:()=>xJ});function kQ(_={}){let $=_.workspaceSettings||{};return{webTerminalEnabled:$.webTerminalEnabled!==!1,vncAllowDirect:$.vncAllowDirect!==!1,treeMaxDepth:$.treeMaxDepth??4,treeMaxEntries:$.treeMaxEntries??5000}}function xJ({settingsData:_,setStatus:$,mergeSettingsData:j}){let[Z,X]=C(!0),[G,q]=C(!0),[Q,K]=C(4),[V,Y]=C(5000),[N,F]=C(60),[B,D]=C(3),[W,H]=C(!1),[z,k]=C(!1),J=g(""),L=g(null),x=g(null),I=g(null),E=g(!0);b(()=>{return E.current=!0,()=>{if(E.current=!1,L.current)clearTimeout(L.current);if(x.current)clearTimeout(x.current);if(I.current)clearTimeout(I.current)}},[]);let M=R((y)=>{let A=kQ(y),P=M5();X(A.webTerminalEnabled),q(A.vncAllowDirect),K(A.treeMaxDepth),Y(A.treeMaxEntries),F(P.refreshIntervalSec),D(P.folderPreviewDepth),J.current=JSON.stringify(A)},[]);b(()=>{M(_||{})},[_,M]);let O=q0(()=>JSON.stringify(kQ({workspaceSettings:{webTerminalEnabled:Z,vncAllowDirect:G,treeMaxDepth:Q,treeMaxEntries:V}})),[Z,G,Q,V]);b(()=>{if(O===J.current)return;if(L.current)clearTimeout(L.current);return L.current=setTimeout(async()=>{if(!E.current)return;let y=document.activeElement;if(y&&y.closest?.(".settings-number-stepper"))return;try{let A=await g7(JSON.parse(O));if(!E.current||!A?.ok||!A?.settings)return;if(J.current=O,j?.({workspaceSettings:A.settings}),$?.(null),H(!0),x.current)clearTimeout(x.current);x.current=setTimeout(()=>{if(E.current)H(!1)},4000)}catch(A){$?.(String(A?.message||A),"error")}},800),()=>{if(L.current)clearTimeout(L.current)}},[O,j,$]);let T=R((y)=>{let A=MQ(y);if(F(A.refreshIntervalSec),D(A.folderPreviewDepth),k(!0),I.current)clearTimeout(I.current);I.current=setTimeout(()=>{if(E.current)k(!1)},3000)},[]);return U`
        <div class="settings-section">
            ${W&&U`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Workspace settings applied. Server-side limits affect new workspace requests immediately.
                </div>
            `}
            ${z&&U`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Browser workspace settings applied immediately in this tab.
                </div>
            `}

            <h3>Access</h3>
            <div class="settings-row">
                <label>Enable web terminal</label>
                <input type="checkbox" checked=${Z} onChange=${(y)=>X(y.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Allow direct VNC targets</label>
                <input type="checkbox" checked=${G} onChange=${(y)=>q(y.target.checked)} />
            </div>
            <p class="settings-hint">Terminal access updates immediately. Direct VNC target policy applies to new VNC requests.</p>

            <h3 style="margin-top:20px">Server scan guardrails</h3>
            <div class="settings-row">
                <label>Max tree depth</label>
                <${m1}
                    label="workspace tree max depth"
                    value=${Q}
                    min=${1}
                    max=${8}
                    fallback=${4}
                    width="80px"
                    onChange=${K}
                />
                <span class="settings-hint" style="margin:0">caps all <code>/workspace/tree</code> requests</span>
            </div>
            <div class="settings-row">
                <label>Max entries per scan</label>
                <${m1}
                    label="workspace tree max entries"
                    value=${V}
                    min=${250}
                    max=${5000}
                    step=${250}
                    fallback=${5000}
                    width="92px"
                    onChange=${Y}
                />
                <span class="settings-hint" style="margin:0">truncate oversized tree walks earlier</span>
            </div>

            <h3 style="margin-top:20px">This browser</h3>
            <div class="settings-row">
                <label>Refresh interval (seconds)</label>
                <${m1}
                    label="workspace refresh interval"
                    value=${N}
                    min=${15}
                    max=${300}
                    step=${15}
                    fallback=${60}
                    width="92px"
                    onChange=${(y)=>T({refreshIntervalSec:y})}
                />
            </div>
            <div class="settings-row">
                <label>Folder preview scan depth</label>
                <${m1}
                    label="folder preview scan depth"
                    value=${B}
                    min=${0}
                    max=${8}
                    fallback=${3}
                    width="80px"
                    onChange=${(y)=>T({folderPreviewDepth:y})}
                />
                <span class="settings-hint" style="margin:0">set to <code>0</code> to disable folder size preview scans</span>
            </div>
            <p class="settings-hint">Root and folder-expansion tree loads remain shallow; the folder size preview is the deepest workspace scan in the UI.</p>
        </div>
    `}var yQ=J1(()=>{M0();T1();T9();R4()});var wQ={};$_(wQ,{EnvironmentSection:()=>CJ});function y9(_={}){let $=_.environmentSettings||_.settings||_.environment||{};return{variables:Array.isArray($.variables)?$.variables:[],overrides:$.overrides&&typeof $.overrides==="object"?$.overrides:{},count:Number($.count||0),overrideCount:Number($.overrideCount||0),keychainEnvNames:Array.isArray($.keychainEnvNames)?$.keychainEnvNames:[]}}function CJ({settingsData:_,filter:$="",setStatus:j,mergeSettingsData:Z}){let[X,G]=C(()=>y9(_||{})),[q,Q]=C({}),[K,V]=C(""),[Y,N]=C(""),[F,B]=C(null);b(()=>{G(y9(_||{})),Q({})},[_]);let D=R((L)=>{let x=y9({environmentSettings:L?.settings||L});return G(x),Z?.({environmentSettings:x}),Q({}),x},[Z]),W=R(async()=>{try{let L=await u7();if(L?.ok)D(L.settings);j?.("Environment refreshed.","info")}catch(L){j?.(String(L?.message||L),"error")}},[D,j]),H=R(async(L,x)=>{let I=String(L||"").trim();if(!I)return;B(I);try{let E=await S2({action:"set",name:I,value:String(x??"")});if(E?.ok)D(E.settings);if(j?.(`Saved environment override for ${I}.`,"info"),I===K.trim())V(""),N("")}catch(E){j?.(String(E?.message||E),"error")}finally{B(null)}},[D,K,j]),z=R(async(L)=>{let x=String(L||"").trim();if(!x)return;B(x);try{let I=await S2({action:"clear",name:x});if(I?.ok)D(I.settings);j?.(`Cleared environment override for ${x}.`,"info")}catch(I){j?.(String(I?.message||I),"error")}finally{B(null)}},[D,j]),k=q0(()=>{let L=String($||"").trim().toLowerCase(),x=Array.isArray(X.variables)?X.variables:[];if(!L)return x;return x.filter((I)=>{return`${I?.name||""} ${I?.value||""} ${I?.source||""}`.toLowerCase().includes(L)})},[X.variables,$]),J=R((L,x)=>{Q((I)=>({...I||{},[L]:x}))},[]);return U`
        <div class="settings-section">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:12px;">
                <div>
                    <h3 style="margin-top:0">Environment</h3>
                    <p class="settings-hint" style="margin-top:4px">
                        Showing non-keychain environment variables only. Overrides are stored in extension KV and applied to <code>process.env</code>, so subsequent tool calls inherit them.
                    </p>
                </div>
                <button type="button" class="settings-secondary-btn" onClick=${W}>Refresh</button>
            </div>

            <div class="settings-row" style="align-items:flex-start; gap:10px;">
                <label>Add override</label>
                <div style="display:grid; grid-template-columns:minmax(180px, 0.7fr) minmax(240px, 1fr) auto; gap:8px; flex:1;">
                    <input
                        type="text"
                        value=${K}
                        placeholder="VARIABLE_NAME"
                        spellcheck="false"
                        onInput=${(L)=>V(L.target.value)}
                    />
                    <input
                        type="text"
                        value=${Y}
                        placeholder="value"
                        spellcheck="false"
                        onInput=${(L)=>N(L.target.value)}
                    />
                    <button
                        type="button"
                        disabled=${!K.trim()||F===K.trim()}
                        onClick=${()=>H(K,Y)}
                    >Save</button>
                </div>
            </div>

            <p class="settings-hint">
                ${X.count} variables visible • ${X.overrideCount} overrides active • ${X.keychainEnvNames.length} keychain-injected variables hidden
            </p>

            <div class="settings-tool-list" style="max-height:58vh; overflow:auto;">
                ${k.map((L)=>{let x=String(L?.name||""),I=Object.prototype.hasOwnProperty.call(q,x)?q[x]:L.value,E=I!==L.value,M=F===x;return U`
                        <div class="settings-tool-row" key=${x} style="grid-template-columns:minmax(180px,0.45fr) minmax(240px,1fr) auto auto; align-items:center;">
                            <span class="settings-tool-name" title=${x}>${x}</span>
                            <input
                                type="text"
                                value=${I}
                                spellcheck="false"
                                onInput=${(O)=>J(x,O.target.value)}
                                style="min-width:0; width:100%; font-family:var(--font-mono, monospace);"
                            />
                            <span class="settings-tool-kind" title=${L.overridden?"Overridden in KV":"Inherited from process environment"}>
                                ${L.overridden?"override":"process"}
                            </span>
                            <span style="display:flex; gap:6px; justify-content:flex-end;">
                                <button type="button" disabled=${M||!E} onClick=${()=>H(x,I)}>Save</button>
                                <button type="button" disabled=${M||!L.overridden} onClick=${()=>z(x)}>Clear</button>
                            </span>
                        </div>
                    `})}
                ${k.length===0&&U`<p class="settings-hint">No environment variables match "${$}".</p>`}
            </div>
        </div>
    `}var IQ=J1(()=>{M0();T1()});var xQ={};$_(xQ,{ProvidersSection:()=>fJ});function PJ(_){switch(_){case"oauth":return"OAuth";case"api_key":return"API key";case"custom":return"Configured";default:return"Configured"}}function fJ({providers:_,setStatus:$}){let[j,Z]=C(null),[X,G]=C(null),[q,Q]=C({}),K=R((H,z)=>{Q((k)=>({...k,[H]:z}))},[]),V=R(async(H)=>{let z=(q.apiKey||"").trim();if(!z){$?.("API key cannot be empty.","error");return}Z(H),$?.(`Configuring ${H}…`,"info");try{let k=JSON.stringify({provider:H,method:"api_key",api_key:z}),J=await E_("default",`/login __step2 ${k}`,null,[]);if(J?.command?.status==="error"){$?.(J.command.message,"error");return}$?.(J?.command?.message||`${H} configured.`,"success"),G(null),Q({})}catch(k){$?.(String(k.message||k),"error")}finally{Z(null)}},[q,$]),Y=R(async(H,z)=>{Z(H),$?.(`Configuring ${H}…`,"info");try{let k={provider:H,method:"custom"};for(let x of z.customFields||[])k[x.key]=(q[x.key]||"").trim();let J=JSON.stringify(k),L=await E_("default",`/login __step2 ${J}`,null,[]);if(L?.command?.status==="error"){$?.(L.command.message,"error");return}$?.(L?.command?.message||`${H} configured.`,"success"),G(null),Q({})}catch(k){$?.(String(k.message||k),"error")}finally{Z(null)}},[q,$]),N=R(async(H)=>{Z(H),$?.(`Starting OAuth for ${H}…`,"info");try{let z=JSON.stringify({provider:H}),J=(await E_("default",`/login __step1 ${z}`,null,[]))?.command?.message||"";if(J.includes("http")){let L=J.match(/(https?:\/\/[^\s)]+)/);if(L)window.open(L[1],"_blank","noopener"),$?.("OAuth window opened. Complete the sign-in flow, then close this message.","success");else $?.(J,"success")}else $?.(J||`OAuth flow started for ${H}. Check the chat.`,"success")}catch(z){$?.(String(z.message||z),"error")}finally{Z(null)}},[$]),F=R(async(H)=>{if(j)return;Z(H),$?.(`Logging out ${H}…`,"info");try{await E_("default",`/logout ${H}`,null,[]),$?.(`Logged out ${H}. Restart may be needed.`,"success")}catch(z){$?.(String(z.message||z),"error")}finally{Z(null)}},[j,$]),B=_||[],D=(H)=>X===H,W=(H)=>{G((z)=>z===H?null:H),Q({})};return U`
        <div class="settings-section">
            <h3>Providers</h3>
            <div class="settings-provider-list">
                ${B.map((H)=>U`
                    <div class=${`settings-provider-card${H.configured?" configured":""}`}>
                        <div class="settings-provider-card-header" onClick=${()=>!H.configured&&W(H.id)}>
                            <div class="settings-provider-card-title">
                                <strong>${H.name}</strong>
                                <span class="settings-provider-id">${H.id}</span>
                                ${H.configured&&U`<span class="settings-tag settings-tag-skill">${PJ(H.authType)}</span>`}
                            </div>
                            <div class="settings-provider-card-meta">
                                ${H.hasOAuth&&U`<span class="settings-tag">OAuth</span>`}
                                ${H.hasApiKey&&U`<span class="settings-tag">API Key</span>`}
                                ${H.isCustom&&U`<span class="settings-tag">Custom</span>`}
                            </div>
                            <div class="settings-provider-card-actions">
                                ${H.configured?U`
                                    <button class="settings-addon-btn settings-addon-btn-remove"
                                        disabled=${j===H.id} onClick=${(z)=>{z.stopPropagation(),F(H.id)}}
                                    >${j===H.id?"…":"Logout"}</button>
                                    <button class="settings-addon-btn"
                                        disabled=${j===H.id} onClick=${(z)=>{z.stopPropagation(),W(H.id)}}
                                    >Reconfigure</button>
                                `:U`
                                    <button class="settings-addon-btn settings-addon-btn-install"
                                        disabled=${j===H.id} onClick=${(z)=>{z.stopPropagation(),W(H.id)}}
                                    >Set up</button>
                                `}
                            </div>
                        </div>

                        ${D(H.id)&&U`
                            <div class="settings-provider-setup">
                                <p class="settings-hint settings-provider-setup-hint">Sign-in flows open in the browser. In narrow panes the setup form stacks vertically to avoid clipping.</p>
                                ${H.hasOAuth&&U`
                                    <div class="settings-provider-method">
                                        <button class="settings-addon-btn settings-addon-btn-install"
                                            disabled=${j===H.id}
                                            onClick=${()=>N(H.id)}>
                                            ${j===H.id?"Starting…":"Sign in with OAuth"}
                                        </button>
                                    </div>
                                `}
                                ${H.hasApiKey&&U`
                                    <div class="settings-provider-method">
                                        <div class="settings-provider-field-row">
                                            <label>API Key</label>
                                            <input type="password" value=${q.apiKey||""}
                                                onInput=${(z)=>K("apiKey",z.target.value)}
                                                placeholder=${H.apiKeyHint||"Enter API key"} />
                                            <button class="settings-addon-btn settings-addon-btn-install"
                                                disabled=${j===H.id||!(q.apiKey||"").trim()}
                                                onClick=${()=>V(H.id)}>
                                                ${j===H.id?"…":"Save"}
                                            </button>
                                        </div>
                                    </div>
                                `}
                                ${H.isCustom&&U`
                                    <div class="settings-provider-method">
                                        ${(H.customFields||[]).map((z)=>U`
                                            <div class="settings-provider-field-row">
                                                <label>${z.label}${z.required?" *":""}</label>
                                                <input type="text" value=${q[z.key]||""}
                                                    onInput=${(k)=>K(z.key,k.target.value)}
                                                    placeholder=${z.placeholder||""} />
                                            </div>
                                        `)}
                                        <div class="settings-provider-form-actions">
                                            <button class="settings-addon-btn settings-addon-btn-install"
                                                disabled=${j===H.id}
                                                onClick=${()=>Y(H.id,H)}>
                                                ${j===H.id?"Configuring…":"Save configuration"}
                                            </button>
                                        </div>
                                    </div>
                                `}
                            </div>
                        `}
                    </div>
                `)}
            </div>
        </div>
    `}var CQ=J1(()=>{M0();T1()});var PQ={};$_(PQ,{ModelsSection:()=>uJ});function bJ(_){return typeof _==="string"&&_.toLowerCase()==="anthropic"}function gJ({thinkingLevel:_,supportsThinking:$,provider:j,availableLevels:Z,onSetLevel:X,disabled:G}){let q=bJ(j)?RJ:SJ,Q=Z&&Z.length>1?Z:["off","minimal","low","medium","high"],K=Math.max(0,Q.indexOf(_??"off"));if(!$)return U`<div class="settings-thinking-slider"><label>Thinking level</label><p class="settings-hint" style="margin:4px 0 0">Current model does not support thinking.</p></div>`;return U`
        <div class="settings-thinking-slider">
            <label>Thinking level: <strong>${q[Q[K]]||Q[K]}</strong></label>
            <div class="settings-slider-track">
                <input type="range" min="0" max=${Q.length-1} step="1" value=${K} disabled=${G}
                    onInput=${(V)=>X(Q[parseInt(V.target.value,10)])} />
                <div class="settings-slider-labels">
                    ${Q.map((V,Y)=>U`<span class=${Y===K?"active":""} onClick=${()=>!G&&X(V)}>${q[V]||V}</span>`)}
                </div>
            </div>
        </div>
    `}function uJ({filter:_=""}){let[$,j]=C(null),[Z,X]=C(!1),[G,q]=C("off"),[Q,K]=C(!1),[V,Y]=C(["off"]),[N,F]=C(!1),B=R(async()=>{let I=await I4();if(j(I),I.thinking_level)q(I.thinking_level);if(K(Boolean(I.supports_thinking)),Array.isArray(I.available_thinking_levels)&&I.available_thinking_levels.length>0)Y(I.available_thinking_levels);return I},[]);b(()=>{B().catch(()=>j({models:[],model_options:[]}))},[]);let D=R(async(I)=>{if(Z)return;X(!0);try{await E_("default",`/model ${I}`,null,[]),await B()}catch(E){console.error("Failed to switch model:",E)}finally{X(!1)}},[Z,B]),W=R(async(I)=>{if(N)return;F(!0),q(I);try{let E=await E_("default",`/thinking ${I}`,null,[]);if(E?.command?.thinking_level)q(E.command.thinking_level);K(E?.command?.supports_thinking!==!1),await B()}catch(E){console.error("Failed to set thinking:",E),await B().catch((M)=>{})}finally{F(!1)}},[N,B]);if(!$)return U`<div class="settings-loading">Loading models\u2026</div>`;let H=$.model_options||[],z=$.current,J=H.find((I)=>I.label===z)?.provider||"",L=_.toLowerCase(),x=L?H.filter((I)=>I.label.toLowerCase().includes(L)||(I.provider||"").toLowerCase().includes(L)):H;return U`
        <div class="settings-models-split">
            <div class="settings-models-summary settings-hint">Model and provider names may wrap in narrow panes to avoid clipping.</div>
            <div class="settings-models-list">
                <table class="settings-table settings-borderless settings-models-table">
                    <thead><tr><th style="width:32px"></th><th>Model</th><th>Provider</th><th>Context</th><th style="text-align:center">Reasoning</th></tr></thead>
                    <tbody>
                        ${x.map((I)=>U`
                            <tr class=${I.label===z?"settings-row-active":""}>
                                <td><input type="radio" name="settings-model" checked=${I.label===z} disabled=${Z} onChange=${()=>D(I.label)} /></td>
                                <td>${I.name||I.label}</td><td>${I.provider}</td>
                                <td>${I.context_window?(I.context_window/1000).toFixed(0)+"K":"—"}</td>
                                <td style="text-align:center">${I.reasoning?"\uD83E\uDDE0":"—"}</td>
                            </tr>
                        `)}
                        ${x.length===0&&U`<tr><td colspan="5" class="settings-empty">No models match "${_}"</td></tr>`}
                    </tbody>
                </table>
            </div>
            <div class="settings-models-footer">
                <${gJ}
                    thinkingLevel=${G}
                    supportsThinking=${Q}
                    provider=${J}
                    availableLevels=${V}
                    onSetLevel=${W}
                    disabled=${N||Z} />
            </div>
        </div>
    `}var RJ,SJ;var fQ=J1(()=>{M0();T1();RJ={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"max"},SJ={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"xhigh"}});var SQ={};$_(SQ,{ThemeSection:()=>vJ});function RQ(_={}){return{uiTheme:typeof _.uiTheme==="string"&&_.uiTheme.trim()?_.uiTheme.trim():"default",uiTint:typeof _.uiTint==="string"&&_.uiTint.trim()?_.uiTint.trim():""}}function vJ({themes:_,colorKeys:$,settingsData:j,setStatus:Z,mergeSettingsData:X}){let[G,q]=C("default"),[Q,K]=C(""),[V,Y]=C(!1),N=g(""),F=g(null),B=g(!0);b(()=>{return B.current=!0,()=>{B.current=!1}},[]);let D=R((J)=>{let L=RQ(J);q(L.uiTheme),K(L.uiTint),N.current=JSON.stringify(L)},[]);b(()=>{if(j){D(j);return}D({uiTheme:document.documentElement.dataset.colorTheme||"default",uiTint:document.documentElement.dataset.tint||""})},[j,D]);let W=R((J,L)=>{z5({theme:J,tint:L||null}),q(J||"default"),K(L||"")},[]),H=q0(()=>JSON.stringify(RQ({uiTheme:G,uiTint:Q})),[G,Q]);b(()=>{if(H===N.current)return;if(F.current)clearTimeout(F.current);return F.current=setTimeout(async()=>{if(!B.current)return;Y(!0);try{let J=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:H}),L=await J.json().catch(()=>({}));if(!B.current)return;if(!J.ok||!L?.ok||!L?.settings){Z?.(L?.error||"Failed to save appearance settings.","error");return}N.current=H,X?.(L.settings),Z?.("Appearance synced across clients.","success")}catch(J){if(!B.current)return;console.warn("[settings/appearance] Failed to persist appearance settings.",J),Z?.("Failed to save appearance settings.","error")}finally{if(B.current)Y(!1)}},250),()=>{if(F.current)clearTimeout(F.current)}},[H,X,Z]);let z=$||[],k=_||[];return U`
        <div class="settings-section">
            ${V&&U`<div class="settings-hint" style="margin:0 0 12px 0;">Syncing appearance…</div>`}
            <div class="settings-tint-row">
                <label class="settings-tint-label">
                    <input type="radio" name="settings-theme"
                        checked=${G==="default"}
                        onChange=${()=>W("default",Q)} />
                    <strong>Default</strong>
                    <span class="settings-hint" style="margin:0 0 0 6px">auto (light/dark)</span>
                </label>
                <div class="settings-tint-picker">
                    <label class="settings-hint" style="margin:0">Tint:</label>
                    <input type="color"
                        value=${Q||"#1d9bf0"}
                        onInput=${(J)=>{let L=J.target.value;if(K(L),G==="default")z5({theme:"default",tint:L})}} />
                    ${Q&&U`
                        <button class="settings-tint-clear" onClick=${()=>W("default","")}
                            title="Clear tint">\u2715</button>
                    `}
                    <span class="settings-tint-hex">${Q||"none"}</span>
                </div>
            </div>

            <table class="settings-table settings-borderless settings-theme-table">
                <thead>
                    <tr>
                        <th></th><th>Theme</th><th>Mode</th>
                        ${z.map((J)=>U`<th class="settings-swatch-header">${J.replace(/([A-Z])/g," $1").trim()}</th>`)}
                    </tr>
                </thead>
                <tbody>
                    ${k.filter((J)=>J.name!=="default").map((J)=>U`
                        <tr class=${J.name===G?"settings-row-active":""}
                            style="cursor:pointer" onClick=${()=>W(J.name,"")}>
                            <td><input type="radio" name="settings-theme" checked=${J.name===G} onChange=${()=>W(J.name,"")} /></td>
                            <td><strong>${J.label}</strong></td>
                            <td>${J.mode}</td>
                            ${z.map((L)=>{let x=J.colors?.[L];return U`<td class="settings-swatch-cell">
                                    ${x?U`<span class="settings-color-swatch" style=${"background:"+x} title=${x}></span>`:"—"}
                                </td>`})}
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    `}var bQ=J1(()=>{M0();X6()});var uQ={};$_(uQ,{__scheduledTasksSettingsTest:()=>rJ,ScheduledTasksSection:()=>pJ});function S4(_){if(!_)return"—";let $=new Date(_);if(Number.isNaN($.getTime()))return _;return $.toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function gQ(_){let $=Number(_);if(!Number.isFinite($))return"—";if($<1000)return`${Math.round($)}ms`;return`${($/1000).toFixed($<1e4?1:0)}s`}function w9(_){if(!_)return"—";if(_.schedule_type==="once")return`once · ${S4(_.schedule_value)}`;if(_.schedule_type==="interval")return`interval · ${_.schedule_value}`;if(_.schedule_type==="cron")return`cron · ${_.schedule_value}`;return`${_.schedule_type||"schedule"} · ${_.schedule_value||"—"}`}function I9(_){let $=_?.task_kind||"agent";return $==="internal"?"internal/protected":$}function x9(_){return(_?.task_kind||"agent")==="internal"}function cJ(_){if(!_)return"";let $=String(_).replace(/\s+/g," ").trim();return $.length>180?`${$.slice(0,179)}…`:$}function k5({children:_,type:$="neutral"}){return U`<span class=${`settings-task-pill settings-task-pill-${$}`}>${_}</span>`}function hJ({task:_}){let $=Array.isArray(_?.recent_run_logs)?_.recent_run_logs:[];if(!$.length)return U`<p class="settings-hint">No run logs recorded yet.</p>`;return U`
        <div class="settings-task-run-list">
            ${$.map((j)=>U`
                <div class=${`settings-task-run-row settings-task-run-${j.status||"unknown"}`}>
                    <div class="settings-task-run-meta">
                        <${k5} type=${j.status==="error"?"error":"success"}>${j.status||"unknown"}<//>
                        <span>${S4(j.run_at)}</span>
                        <span>${gQ(j.duration_ms)}</span>
                    </div>
                    <div class="settings-task-run-summary">
                        ${j.error_summary||cJ(j.error)||j.result_summary||j.result||"No summary"}
                    </div>
                </div>
            `)}
        </div>
    `}function lJ({task:_,onAction:$}){if(!_)return U`<div class="settings-task-detail-empty">Select a task to inspect schedule, status, and run history.</div>`;let j=x9(_);return U`
        <div class="settings-task-detail">
            <div class="settings-task-detail-header">
                <div>
                    <h4>${_.summary||_.id}</h4>
                    <code>${_.id}</code>
                </div>
                <div class="settings-task-detail-actions">
                    ${_.status==="active"&&U`<button onClick=${()=>$("pause",_)}>Pause</button>`}
                    ${_.status==="paused"&&U`<button onClick=${()=>$("resume",_)}>Resume</button>`}
                    <button class="danger" onClick=${()=>$("delete",_)}>Delete</button>
                </div>
            </div>
            <div class="settings-task-detail-grid">
                <span>Status</span><strong>${_.status||"—"}</strong>
                <span>Kind</span><strong>${I9(_)}</strong>
                <span>Schedule</span><strong>${w9(_)}</strong>
                <span>Next run</span><strong>${S4(_.next_run)}</strong>
                <span>Last run</span><strong>${S4(_.last_run)}</strong>
                <span>Last result</span><strong>${_.latest_run_log?.status||_.last_result||"—"}</strong>
                <span>Chat</span><code>${_.chat_jid||"—"}</code>
                <span>Model</span><code>${_.model||"default"}</code>
                ${_.cwd&&U`<span>CWD</span><code>${_.cwd}</code>`}
                ${_.timeout_sec&&U`<span>Timeout</span><strong>${_.timeout_sec}s</strong>`}
                ${j&&U`<span>Protection</span><strong>Internal task actions require explicit confirmation.</strong>`}
            </div>
            <div class="settings-task-command-block">
                <strong>${_.task_kind==="shell"?"Command":"Prompt"}</strong>
                <pre>${_.command||_.prompt||_.command_summary||_.prompt_summary||_.summary||"—"}</pre>
            </div>
            <h4>Recent runs</h4>
            <${hJ} task=${_} />
        </div>
    `}function pJ({filter:_="",setStatus:$}){let[j,Z]=C([]),[X,G]=C({active:0,paused:0,completed:0}),[q,Q]=C("all"),[K,V]=C(""),[Y,N]=C(!0),[F,B]=C(null),[D,W]=C(null),[H,z]=C(null),[k,J]=C(!1),L=R(async(O={})=>{N(!0),B(null);try{let T=await y7({status:q,chatJid:K.trim()||void 0,limit:50,includeRunLogs:!0,runLogLimit:5});Z(T.tasks||[]),G(T.counts||{active:0,paused:0,completed:0});let y=O.selectedId||D,A=(T.tasks||[]).find((P)=>P.id===y)||(T.tasks||[])[0]||null;W(A?.id||null),z(A)}catch(T){B(T?.message||"Failed to load scheduled tasks.")}finally{N(!1)}},[q,K,D]);b(()=>{L()},[L]);let x=String(_||"").trim().toLowerCase(),I=q0(()=>{if(!x)return j;return j.filter((O)=>[O.id,O.chat_jid,O.status,O.task_kind,O.schedule_type,O.schedule_value,O.summary,O.prompt_summary,O.command_summary,O.latest_run_log?.error_summary].some((T)=>String(T||"").toLowerCase().includes(x)))},[j,x]),E=R((O)=>{W(O?.id||null),z(O||null)},[]),M=R(async(O,T)=>{if(!T||k)return;let y=x9(T),A=T.summary||T.command_summary||T.prompt_summary||T.id,P=O==="delete"?`Delete scheduled task ${T.id}?

${A}`:`${O==="pause"?"Pause":"Resume"} scheduled task ${T.id}?

${A}`;if(!window.confirm(P))return;if(y&&!window.confirm(`Task ${T.id} is internal/protected. Continue with ${O}?`))return;J(!0),$?.(`${O==="delete"?"Deleting":O==="pause"?"Pausing":"Resuming"} ${T.id}…`,"info");try{await w7(O,T.id,{allowInternal:y}),$?.(`Scheduled task ${T.id} ${O==="delete"?"deleted":O==="pause"?"paused":"resumed"}.`,"success"),await L({selectedId:O==="delete"?null:T.id})}catch(f){$?.(f?.message||`Failed to ${O} task.`,"error")}finally{J(!1)}},[k,L,$]);return U`
        <div class="settings-section settings-scheduled-tasks-section">
            <div class="settings-task-toolbar">
                <div class="settings-task-counts">
                    <${k5} type="active">Active ${X.active||0}<//>
                    <${k5} type="paused">Paused ${X.paused||0}<//>
                    <${k5} type="completed">Completed ${X.completed||0}<//>
                </div>
                <div class="settings-task-filters">
                    <select value=${q} onChange=${(O)=>Q(O.target.value)}>
                        ${mJ.map((O)=>U`<option value=${O}>${O==="all"?"All statuses":O}</option>`)}
                    </select>
                    <input type="text" placeholder="Filter chat JID…" value=${K} onInput=${(O)=>V(O.target.value)} />
                    <button onClick=${()=>L()} disabled=${Y}>Refresh</button>
                </div>
            </div>

            ${Y&&U`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>Loading scheduled tasks…</span></div>`}
            ${F&&U`<div class="settings-error-state">${F}</div>`}
            ${!Y&&!F&&j.length===0&&U`
                <div class="settings-empty-state">
                    <strong>No scheduled tasks found.</strong>
                    <p>Tasks created with reminders, `/j`, or the scheduler tool will appear here.</p>
                </div>
            `}
            ${!Y&&!F&&j.length>0&&U`
                <div class="settings-task-layout">
                    <div class="settings-task-list" role="listbox" aria-label="Scheduled tasks">
                        ${I.map((O)=>U`
                            <button class=${`settings-task-row ${O.id===D?"active":""}`} onClick=${()=>E(O)}>
                                <span class="settings-task-row-main">
                                    <strong>${O.summary||O.id}</strong>
                                    <span>${w9(O)}</span>
                                </span>
                                <span class="settings-task-row-meta">
                                    <${k5} type=${O.status||"neutral"}>${O.status}<//>
                                    <${k5}>${I9(O)}<//>
                                </span>
                                <span class="settings-task-row-times">Next ${S4(O.next_run)} · Last ${S4(O.last_run)}${O.latest_run_log?.status?` · ${O.latest_run_log.status}`:""}</span>
                            </button>
                        `)}
                        ${I.length===0&&U`<p class="settings-hint">No tasks match “${_}”.</p>`}
                    </div>
                    <${lJ} task=${H&&I.some((O)=>O.id===H.id)?H:I[0]} onAction=${M} />
                </div>
            `}
        </div>
    `}var mJ,rJ;var vQ=J1(()=>{M0();T1();mJ=["all","active","paused","completed"];rJ={formatDateTime:S4,formatDuration:gQ,labelForSchedule:w9,kindLabel:I9,isProtectedTask:x9}});function mQ(_){return String(_||"").toLowerCase().replace(/^[@/]+/,"").replace(/\s+/g," ").trim()}function T5(_){return typeof _==="string"&&_.trim().length>0}function C9(_,...$){let j=mQ(_);if(!j)return!0;let Z=$.map((X)=>mQ(X)).filter(Boolean);for(let X of Z)if(X.startsWith(j)||X.includes(j))return!0;return!1}function cQ(_){if(!Array.isArray(_))return null;let $=[],j=new Set;for(let Z of _){let X=String(Z||"").trim();if(!X)continue;let G=X.toLowerCase();if(j.has(G))continue;j.add(G),$.push(X)}return $}function _4(_){let $=_&&typeof _==="object"?_:{};return{workspaceCommands:cQ($.workspaceCommands),slashCommands:cQ($.slashCommands)}}function hQ(_,$){if(!Array.isArray(_))return!0;return _.some((j)=>j.toLowerCase()===$.toLowerCase())}function nJ(_){let $=Array.isArray(_?.commands)?_.commands:[],j=_4(_?.settings),Z=String(_?.query||"");return $.filter((X)=>hQ(j.workspaceCommands,X.id)).filter((X)=>C9(Z,X.label,X.description,...X.keywords||[])).map((X)=>({key:`workspace:${X.id}`,kind:"workspace",title:X.label,subtitle:X.description,searchText:`${X.label} ${X.description} ${(X.keywords||[]).join(" ")}`.trim(),visualHint:X.label.slice(0,1).toUpperCase()||"W",categoryLabel:"Workspace",actionHint:"Run",commandId:X.id}))}function dJ(_){let $=Array.isArray(_?.agents)?_.agents:[],j=String(_?.query||""),Z=new Set;return $.filter((X)=>{let G=T5(X?.chat_jid)?X.chat_jid.trim():"";if(!G||Z.has(G))return!1;if(X?.archived_at)return!1;return Z.add(G),!0}).filter((X)=>C9(j,`@${String(X?.agent_name||"").trim()}`,X?.session_name,X?.chat_jid)).map((X)=>{let G=T5(X?.agent_name)?X.agent_name.trim():String(X?.chat_jid||"").replace(/^[^:]+:/,""),q=T5(X?.session_name)?X.session_name.trim():"",Q=String(X?.chat_jid||"").trim();return{key:`agent:${Q}`,kind:"agent",title:`@${G}`,subtitle:q||Q,searchText:`@${G} ${q} ${Q}`.trim(),visualHint:G.slice(0,1).toUpperCase()||"@",categoryLabel:"Agent",actionHint:"Open",chatJid:Q}})}function oJ(_){let $=Array.isArray(_?.slashCommands)?_.slashCommands:[],j=_4(_?.settings),Z=String(_?.query||""),X=new Set;return $.filter((G)=>{let q=T5(G?.name)?G.name.trim():"";if(!q||X.has(q.toLowerCase()))return!1;return X.add(q.toLowerCase()),hQ(j.slashCommands,q)}).filter((G)=>C9(Z,G?.name,G?.description,G?.source)).map((G)=>{let q=String(G?.name||"").trim(),Q=T5(G?.description)?G.description.trim():"slash command",K=T5(G?.source)?G.source.trim():"";return{key:`slash:${q}`,kind:"slash",title:q,subtitle:Q,searchText:`${q} ${Q} ${String(G?.source||"")}`.trim(),visualHint:"/",categoryLabel:K||"Slash",actionHint:"Insert",commandName:q}})}function lQ(_){return[...dJ({agents:_?.agents,query:_?.query}),...nJ({commands:_?.workspaceCommands,settings:_?.settings,query:_?.query}),...oJ({slashCommands:_?.slashCommands,settings:_?.settings,query:_?.query})]}var e$;var P9=J1(()=>{e$=[{id:"toggle-workspace",label:"Toggle workspace",description:"Show or hide the workspace sidebar.",keywords:["workspace","sidebar","explorer"]},{id:"open-explorer",label:"Open explorer",description:"Open the workspace explorer sidebar.",keywords:["workspace","explorer","sidebar"]},{id:"toggle-chat-only",label:"Chat-only mode",description:"Toggle chat-only mode.",keywords:["chat","mode","layout"]},{id:"open-terminal-tab",label:"Open terminal in tab",description:"Open the terminal pane in a workspace tab.",keywords:["terminal","shell","tab"]},{id:"open-vnc-tab",label:"Open VNC in tab",description:"Open the VNC viewer in a workspace tab.",keywords:["vnc","remote","desktop","tab"]},{id:"toggle-terminal-dock",label:"Toggle terminal dock",description:"Show or hide the terminal dock.",keywords:["terminal","dock","shell"]},{id:"open-settings",label:"Settings",description:"Open the settings dialog.",keywords:["settings","preferences","config"]}]});var nQ={};$_(nQ,{QuickActionsSection:()=>iJ});function pQ(_,...$){let j=String(_||"").trim().toLowerCase();if(!j)return!0;return $.some((Z)=>String(Z||"").toLowerCase().includes(j))}function rQ(_){if(!Array.isArray(_))return null;return new Set(_.map(($)=>String($||"").trim().toLowerCase()).filter(Boolean))}function iJ({filter:_="",setStatus:$,mergeSettingsData:j}){let[Z,X]=C(()=>e$.map((I)=>I.id)),[G,q]=C([]),[Q,K]=C([]),[V,Y]=C(!0),[N,F]=C(!1),B=R(async()=>{Y(!0);try{let[I,E]=await Promise.all([F6(),B6("web:default").catch(()=>({commands:[]}))]),M=_4(I?.settings),O=Array.isArray(E?.commands)?E.commands:[];K(O),X(Array.isArray(M.workspaceCommands)?M.workspaceCommands:e$.map((T)=>T.id)),q(Array.isArray(M.slashCommands)?M.slashCommands:O.map((T)=>String(T?.name||"").trim()).filter(Boolean))}catch(I){$?.(String(I?.message||I),"error")}finally{Y(!1)}},[$]);b(()=>{B()},[B]);let D=q0(()=>rQ(Z),[Z]),W=q0(()=>rQ(G),[G]),H=q0(()=>e$.filter((I)=>pQ(_,I.label,I.description,...I.keywords||[])),[_]),z=q0(()=>Q.filter((I)=>pQ(_,I?.name,I?.description,I?.source)),[Q,_]),k=R((I)=>{X((E)=>{let M=new Set((Array.isArray(E)?E:[]).map((O)=>String(O||"").trim()).filter(Boolean));if(M.has(I))M.delete(I);else M.add(I);return e$.map((O)=>O.id).filter((O)=>M.has(O))})},[]),J=R((I)=>{q((E)=>{let M=new Set((Array.isArray(E)?E:[]).map((O)=>String(O||"").trim()).filter(Boolean));if(M.has(I))M.delete(I);else M.add(I);return Q.map((O)=>String(O?.name||"").trim()).filter((O)=>O&&M.has(O))})},[Q]),L=R(()=>{X(e$.map((I)=>I.id)),q(Q.map((I)=>String(I?.name||"").trim()).filter(Boolean))},[Q]),x=R(async()=>{if(N)return;F(!0),$?.("Saving quick actions…","info");try{let I=await b7({workspaceCommands:Z,slashCommands:G}),E=_4(I?.settings);j?.({quickActions:E}),window.dispatchEvent(new CustomEvent("piclaw:quick-actions-settings-updated",{detail:{settings:E}})),$?.("Quick Actions saved.","success")}catch(I){$?.(String(I?.message||I),"error")}finally{F(!1)}},[j,N,$,G,Z]);if(V)return U`<div class="settings-loading">Loading…</div>`;return U`
        <div class="settings-section">
            <h3>Timeline Quick Actions</h3>
            <p class="settings-hint">
                Choose which actions appear in the timeline typeahead. Agents are always pinned first, then workspace commands, then slash commands.
            </p>

            <div class="settings-row" style="align-items:center; gap:10px; margin-bottom:12px;">
                <button class="settings-addon-btn" onClick=${L} disabled=${N}>Enable all</button>
                <button class="settings-addon-btn settings-addon-btn-install" onClick=${x} disabled=${N}>
                    ${N?"Saving…":"Save & apply"}
                </button>
            </div>

            <h3 style="margin-top:8px;">Workspace commands</h3>
            <div class="settings-subsection-list">
                ${H.map((I)=>{let E=D?D.has(I.id.toLowerCase()):!0;return U`
                        <label class="settings-checkbox-row" key=${I.id}>
                            <input type="checkbox" checked=${E} onChange=${()=>k(I.id)} />
                            <div>
                                <div>${I.label}</div>
                                <div class="settings-hint" style="margin:2px 0 0 0;">${I.description}</div>
                            </div>
                        </label>
                    `})}
                ${H.length===0&&U`<div class="settings-hint">No workspace commands match this filter.</div>`}
            </div>

            <h3 style="margin-top:20px;">Slash commands</h3>
            <div class="settings-subsection-list">
                ${z.map((I)=>{let E=String(I?.name||"").trim(),M=W?W.has(E.toLowerCase()):!0;return U`
                        <label class="settings-checkbox-row" key=${E}>
                            <input type="checkbox" checked=${M} onChange=${()=>J(E)} />
                            <div>
                                <div><code>${E}</code></div>
                                <div class="settings-hint" style="margin:2px 0 0 0;">${I?.description||"slash command"}</div>
                            </div>
                        </label>
                    `})}
                ${z.length===0&&U`<div class="settings-hint">No slash commands match this filter.</div>`}
            </div>
        </div>
    `}var dQ=J1(()=>{M0();T1();P9()});var oQ={};$_(oQ,{KeychainSection:()=>tJ});function sJ(_){if(!_)return"—";try{return new Date(_).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"})}catch{return _}}function tJ({filter:_=""}){let[$,j]=C([]),[Z,X]=C(!0),[G,q]=C(null),[Q,K]=C(!1),[V,Y]=C(""),[N,F]=C(""),[B,D]=C(""),[W,H]=C(""),[z,k]=C(""),[J,L]=C("secret"),[x,I]=C(!1),[E,M]=C({}),[O,T]=C(null),[y,A]=C(null),[P,f]=C(null),u=g(null),c=g(null),r=g(null),e=R(async()=>{X(!0),q(null);try{let G0=await(await fetch("/agent/keychain")).json();if(G0?.ok)j(G0.entries||[]);else q(G0?.error||"Failed to load keychain.")}catch(a){q("Failed to load keychain.")}finally{X(!1)}},[]);b(()=>{e()},[e]);let m=R(async()=>{let a=V.trim(),G0=N;if(!a||!G0)return;I(!0);try{let P0=await(await fetch("/agent/keychain",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:a,secret:G0,type:J,username:B.trim()||void 0,userNote:W,agentNote:z})})).json();if(P0?.ok)Y(""),F(""),D(""),H(""),k(""),L("secret"),K(!1),await e();else q(P0?.error||"Failed to add entry.")}catch{q("Failed to add entry.")}finally{I(!1)}},[V,N,B,W,z,J,e]),_0=R(async(a)=>{try{let O0=await(await fetch("/agent/keychain",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:a})})).json();if(O0?.ok)A(null),f((P0)=>P0?.name===a?null:P0),await e();else q(O0?.error||"Failed to delete entry.")}catch{q("Failed to delete entry.")}},[e]),H0=R(async(a)=>{let G0=a?.name;if(!G0)return;let O0=E[G0]||{},P0=Object.prototype.hasOwnProperty.call(O0,"userNote")?O0.userNote:a.userNote||"",p0=Object.prototype.hasOwnProperty.call(O0,"agentNote")?O0.agentNote:a.agentNote||"";T(G0);try{let X1=await(await fetch("/agent/keychain/notes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:G0,userNote:P0,agentNote:p0})})).json();if(X1?.ok)M((l0)=>{let a0={...l0||{}};return delete a0[G0],a0}),await e();else q(X1?.error||"Failed to save notes.")}catch{q("Failed to save notes.")}finally{T(null)}},[E,e]),X0=R((a,G0,O0)=>{M((P0)=>({...P0||{},[a]:{...(P0||{})[a]||{},[G0]:O0}}))},[]),j0=R(async(a,G0,O0)=>{try{let p0=await(await fetch("/agent/keychain/reveal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:a,master_password:G0||void 0,totp_code:O0||void 0})})).json();if(p0?.ok)f({name:a,phase:"revealed",secret:p0.secret,username:p0.username,masterPassword:G0});else if(p0?.needs_master_password)f((g0)=>({name:a,phase:"password",masterPassword:"",error:g0?.name===a&&g0?.masterPassword?p0.error:null})),requestAnimationFrame(()=>c.current?.focus());else if(p0?.needs_totp)f((g0)=>({name:a,phase:"totp",masterPassword:G0,totpCode:"",error:g0?.name===a&&g0?.phase==="totp"&&g0?.totpCode?p0.error:null})),requestAnimationFrame(()=>r.current?.focus());else f({name:a,phase:"error",error:p0?.error||"Failed to reveal."})}catch{f({name:a,phase:"error",error:"Failed to reveal."})}},[]),Q0=R((a)=>{if(P?.name===a&&P?.phase==="revealed"){f(null);return}j0(a,null,null)},[P,j0]),F0=R((a)=>{let G0=P?.masterPassword||"";if(!G0)return;j0(a,G0,null)},[P,j0]),h=R((a)=>{let G0=P?.totpCode||"";if(G0.length<6)return;j0(a,P?.masterPassword,G0)},[P,j0]),$0=R(async(a)=>{try{await navigator.clipboard.writeText(a)}catch{let G0=document.createElement("textarea");G0.value=a,G0.style.position="fixed",G0.style.opacity="0",document.body.appendChild(G0),G0.select(),document.execCommand("copy"),document.body.removeChild(G0)}},[]);b(()=>{if(Q)requestAnimationFrame(()=>u.current?.focus())},[Q]);let K0=_.toLowerCase(),L0=q0(()=>{if(!K0)return $;return $.filter((a)=>a.name.toLowerCase().includes(K0)||(a.type||"").toLowerCase().includes(K0)||(a.envVar||"").toLowerCase().includes(K0)||(a.userNote||"").toLowerCase().includes(K0)||(a.agentNote||"").toLowerCase().includes(K0))},[$,K0]);if(Z)return U`<div class="settings-section"><div class="settings-loading">Loading keychain…</div></div>`;return U`
        <div class="settings-section">
            ${G&&U`
                <div class="settings-keychain-error" role="alert">
                    ${G}
                    <button class="settings-keychain-dismiss" onClick=${()=>q(null)}>✕</button>
                </div>
            `}
            <div class="settings-keychain-toolbar" style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <span class="settings-hint" style="margin:0; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span>${L0.length} entr${L0.length===1?"y":"ies"}${K0?` matching "${_}"`:""}, encrypted at rest.</span>
                    <span style="display:inline-flex; align-items:center; gap:6px;">
                        <span>Click</span>
                        <span aria-hidden="true" style="display:inline-flex; width:18px; height:18px; align-items:center; justify-content:center; border-radius:999px; border:1px solid var(--border-color, rgba(120,120,120,.22)); background:var(--panel-bg, rgba(255,255,255,.04));">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </span>
                        <span>to reveal.</span>
                    </span>
                </span>
                <button class="settings-keychain-add-btn" onClick=${()=>K(!Q)}>
                    ${Q?"Cancel":"+ Add entry"}
                </button>
            </div>

            ${Q&&U`
                <div class="settings-keychain-add-form">
                    <div class="settings-keychain-add-row">
                        <input ref=${u} type="text" placeholder="Entry name (e.g. github/my-token)"
                            value=${V} onInput=${(a)=>Y(a.target.value)}
                            class="settings-keychain-input" />
                        <select value=${J} onChange=${(a)=>L(a.target.value)}
                            class="settings-keychain-select">
                            ${aJ.map((a)=>U`<option value=${a}>${a}</option>`)}
                        </select>
                    </div>
                    <div class="settings-keychain-add-row">
                        <input type="password" placeholder="Secret value"
                            value=${N} onInput=${(a)=>F(a.target.value)}
                            class="settings-keychain-input settings-keychain-secret" />
                        <input type="text" placeholder="Username (optional)"
                            value=${B} onInput=${(a)=>D(a.target.value)}
                            class="settings-keychain-input" style="max-width:200px" />
                        <button class="settings-keychain-save-btn" onClick=${m}
                            disabled=${x||!V.trim()||!N}>
                            ${x?"Saving…":"Save"}
                        </button>
                    </div>
                    <div class="settings-keychain-add-row" style="align-items:stretch">
                        <textarea placeholder="User note (visible in this UI only)"
                            value=${W} onInput=${(a)=>H(a.target.value)}
                            class="settings-keychain-input" rows="2" style="resize:vertical; min-height:56px"></textarea>
                        <textarea placeholder="Agent note (safe to expose to agents)"
                            value=${z} onInput=${(a)=>k(a.target.value)}
                            class="settings-keychain-input" rows="2" style="resize:vertical; min-height:56px"></textarea>
                    </div>
                </div>
            `}

            <div class="settings-keychain-table-wrap">
                <table class="settings-table settings-keychain-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Env var</th>
                            <th>Updated</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${L0.length===0&&U`
                            <tr><td colspan="5" class="settings-keychain-empty">
                                ${K0?"No entries match the filter.":"No keychain entries."}
                            </td></tr>
                        `}
                        ${L0.map((a)=>{let G0=P?.name===a.name?P:null,O0=G0?.phase==="revealed",P0=G0?.phase==="password",p0=G0?.phase==="totp",g0=G0?.phase==="error",X1=E[a.name]||{},l0=Object.prototype.hasOwnProperty.call(X1,"userNote")?X1.userNote:a.userNote||"",a0=Object.prototype.hasOwnProperty.call(X1,"agentNote")?X1.agentNote:a.agentNote||"",f0=l0!==(a.userNote||"")||a0!==(a.agentNote||""),i0=O===a.name;return U`
                            <tr class="settings-keychain-row" key=${a.name}>
                                <td class="settings-keychain-name">${a.name}</td>
                                <td><span class="settings-keychain-type-badge">${a.type}</span></td>
                                <td class="settings-keychain-env">${a.envVar?U`<code>$${a.envVar}</code>`:"—"}</td>
                                <td class="settings-keychain-date">${sJ(a.updatedAt)}</td>
                                <td class="settings-keychain-actions">
                                    <button class=${`settings-keychain-reveal-btn${O0?" active":""}`}
                                        onClick=${()=>Q0(a.name)}
                                        title=${O0?"Hide secret":"Reveal secret"}>
                                        ${O0?U`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:U`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                                    </button>
                                    ${y===a.name?U`
                                            <span class="settings-keychain-confirm">Delete?
                                                <button class="settings-keychain-confirm-yes" onClick=${()=>_0(a.name)}>Yes</button>
                                                <button class="settings-keychain-confirm-no" onClick=${()=>A(null)}>No</button>
                                            </span>
                                        `:U`<button class="settings-keychain-delete-btn" onClick=${()=>A(a.name)} title="Delete">🗑</button>`}
                                </td>
                            </tr>
                            <tr class="settings-keychain-notes-row" key=${a.name+"-notes"}>
                                <td colspan="5">
                                    <div style="display:grid; grid-template-columns:1fr 1fr auto; gap:8px; align-items:start; padding:8px 0 10px 0;">
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">User note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Human/UI note only"
                                                value=${l0}
                                                onInput=${(m0)=>X0(a.name,"userNote",m0.target.value)}></textarea>
                                        </label>
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">Agent-readable note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Safe guidance for agents"
                                                value=${a0}
                                                onInput=${(m0)=>X0(a.name,"agentNote",m0.target.value)}></textarea>
                                        </label>
                                        <button class="settings-keychain-save-btn" style="margin-top:20px" disabled=${!f0||i0} onClick=${()=>H0(a)}>
                                            ${i0?"Saving…":"Save notes"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ${P0&&U`
                                <tr class="settings-keychain-prompt-row" key=${a.name+"-pw"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">Master password:</span>
                                            <input ref=${c} type="password" autocomplete="off"
                                                placeholder="Enter keychain master password"
                                                class="settings-keychain-prompt-input"
                                                value=${G0?.masterPassword||""}
                                                onInput=${(m0)=>f((e0)=>({...e0,masterPassword:m0.target.value}))}
                                                onKeyDown=${(m0)=>{if(m0.key==="Enter")F0(a.name);if(m0.key==="Escape")f(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>F0(a.name)}
                                                disabled=${!G0?.masterPassword}>Unlock</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>f(null)}>Cancel</button>
                                            ${G0?.error&&U`<span class="settings-keychain-prompt-error">${G0.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${p0&&U`
                                <tr class="settings-keychain-prompt-row" key=${a.name+"-totp"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">TOTP code:</span>
                                            <input ref=${r} type="text" inputmode="numeric" autocomplete="one-time-code"
                                                maxlength="6" placeholder="000000"
                                                class="settings-keychain-prompt-input" style="width:90px;text-align:center;letter-spacing:0.15em"
                                                value=${G0?.totpCode||""}
                                                onInput=${(m0)=>f((e0)=>({...e0,totpCode:m0.target.value.replace(/\\D/g,"").slice(0,6)}))}
                                                onKeyDown=${(m0)=>{if(m0.key==="Enter")h(a.name);if(m0.key==="Escape")f(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>h(a.name)}
                                                disabled=${(G0?.totpCode||"").length<6}>Verify</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>f(null)}>Cancel</button>
                                            ${G0?.error&&U`<span class="settings-keychain-prompt-error">${G0.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${O0&&U`
                                <tr class="settings-keychain-reveal-row" key=${a.name+"-reveal"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel">
                                            ${G0.username&&U`
                                                <div class="settings-keychain-reveal-field">
                                                    <span class="settings-keychain-reveal-label">Username</span>
                                                    <code class="settings-keychain-reveal-value">${G0.username}</code>
                                                    <button class="settings-keychain-copy-btn" onClick=${()=>$0(G0.username)} title="Copy username">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                    </button>
                                                </div>
                                            `}
                                            <div class="settings-keychain-reveal-field">
                                                <span class="settings-keychain-reveal-label">Secret</span>
                                                <code class="settings-keychain-reveal-value">${G0.secret}</code>
                                                <button class="settings-keychain-copy-btn" onClick=${()=>$0(G0.secret)} title="Copy secret">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${g0&&U`
                                <tr class="settings-keychain-reveal-row" key=${a.name+"-error"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel" style="color: var(--error-color, #e55)">${G0.error}</div>
                                    </td>
                                </tr>
                            `}
                        `})}
                    </tbody>
                </table>
            </div>
        </div>
    `}var aJ;var iQ=J1(()=>{M0();aJ=["secret","token","password","basic"]});var sQ={};$_(sQ,{ToolsSection:()=>ZE});function ZE({toolsets:_,filter:$="",settingsData:j,mergeSettingsData:Z}){let X=_||[],[G,q]=C(()=>{let F={};for(let B of X)F[B.name]=!0;return F}),Q=R((F)=>{q((B)=>({...B,[F]:!B[F]}))},[]),K=j?.searchMatchMode||"or",V=R(async()=>{let F=K==="or"?"and":"or";try{let D=await(await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({searchMatchMode:F})})).json().catch(()=>({}));if(D?.ok&&D?.settings)Z?.(D.settings)}catch(B){console.warn("[settings/tools] Failed to save search match mode.",B)}},[K,Z]),Y=$.toLowerCase(),N=q0(()=>{if(!Y)return X;return X.map((F)=>{let B=F.tools.filter((D)=>D.name.toLowerCase().includes(Y)||F.name.toLowerCase().includes(Y)||(D.summary||"").toLowerCase().includes(Y));return B.length>0?{...F,tools:B}:null}).filter(Boolean)},[X,Y]);if(X.length===0)return U`<div class="settings-section"><p class="settings-hint">Tool data not available.</p></div>`;return U`
        <div class="settings-section">
            <div class="settings-search-options">
                <h4 style="margin:0 0 8px 0">Search</h4>
                <div class="settings-row">
                    <label>Match mode</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" checked=${K==="and"} onChange=${V} />
                        <span class="settings-hint" style="margin:0">
                            ${K==="or"?"Any keyword (OR) — results match at least one search term":"All keywords (AND) — results must match every search term"}
                        </span>
                    </div>
                </div>
            </div>
            ${N.map((F)=>{let B=G[F.name]!==!1;return U`
                <div class="settings-toolset">
                    <div class="settings-toolset-header">
                        <label class="settings-toolset-toggle">
                            <input type="checkbox" checked=${B} onChange=${()=>Q(F.name)} />
                            <span class="settings-toolset-icon">${eJ[F.name]||jE}</span>
                            <strong>${F.name}</strong>
                        </label>
                        <span class="settings-hint" style="margin:0">${F.description}</span>
                    </div>
                    ${B&&U`<div class="settings-tool-list">${F.tools.map((D)=>U`
                        <div class="settings-tool-row">
                            <input type="checkbox" checked disabled />
                            <span class="settings-tool-name">${D.name}</span>
                            <span class="settings-tool-kind" title=${D.kind}>${$E[D.kind]||"?"}</span>
                            ${D.summary&&U`<span class="settings-tool-summary">${D.summary}</span>`}
                            <span class="settings-tool-source">${_E[D.name]||F.name}</span>
                        </div>
                    `)}</div>`}
                </div>
            `})}
            ${N.length===0&&U`<p class="settings-hint">No tools match "${$}"</p>`}
            <p class="settings-hint">Tool activation is managed by the agent runtime. Group checkboxes collapse/expand; individual tools use <code>activate_tools</code>.</p>
        </div>
    `}var eJ,_E,$E,jE;var aQ=J1(()=>{M0();eJ={core:U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M7.5 10l2.5 2-2.5 2"/><path d="M12.5 15H16"/></svg>`,discovery:U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,attachments:U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,"model-control":U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><path d="M9 15c.83.67 2 1 3 1s2.17-.33 3-1"/></svg>`,data:U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,workspace:U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,automation:U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,remote:U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,browser:U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,ui:U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,experiments:U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v7l4.6 7.7A1 1 0 0 1 18.7 19H5.3a1 1 0 0 1-.9-1.3L9 10z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>`,lifecycle:U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`},_E={read:"pi-core",write:"pi-core",edit:"pi-core",bash:"pi-core",powershell:"pi-core",find:"pi-core",grep:"pi-core",ls:"pi-core",list_tools:"internal-tools",activate_tools:"tool-activation",reset_active_tools:"tool-activation",list_scripts:"runtime-scripts",attach_file:"file-attachments",read_attachment:"file-attachments",export_attachment:"file-attachments",get_model_state:"model-control",list_models:"model-control",switch_model:"model-control",switch_thinking:"model-control",messages:"messages-crud",introspect_sql:"sql-introspect",keychain:"keychain-tools",search_workspace:"workspace-search",refresh_workspace_index:"workspace-search",open_office_viewer:"office-viewer",office_read:"office-viewer",office_write:"office-viewer",open_workspace_file:"open-workspace-file",image_process:"image-processing",schedule_task:"scheduled-tasks",scheduled_tasks:"scheduled-tasks",bun_run:"bun-runner",exec_batch:"exec-batch",search_tool_output:"search-tool-output",ssh:"ssh",proxmox:"proxmox",portainer:"portainer",mcp:"mcp",cdp_browser:"cdp-browser",send_adaptive_card:"send-adaptive-card",send_dashboard_widget:"send-dashboard-widget",start_autoresearch:"autoresearch",stop_autoresearch:"autoresearch",autoresearch_status:"autoresearch",exit_process:"exit-process",env:"env-tools"},$E={"read-only":"\uD83D\uDD0D",mutating:"✏️",mixed:"\uD83D\uDD04"},jE=U`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`});var tQ={};$_(tQ,{AddonsSection:()=>XE});function XE({setStatus:_,filter:$=""}){let[j,Z]=C(null),[X,G]=C(!0),[q,Q]=C(null),[K,V]=C(!1),[Y,N]=C({runtime:"",windowsNative:!1}),[F,B]=C([]),[D,W]=C([]);function H(){let O=new URLSearchParams;try{let y=(localStorage.getItem("piclaw_addons_catalog_url")||"").trim(),A=(localStorage.getItem("piclaw_addons_catalog_urls")||"").split(/\r?\n/).map((f)=>f.trim()).filter(Boolean),P=localStorage.getItem("piclaw_addons_repo_url");if(y)O.append("catalog_url",y);for(let f of A)O.append("catalog_url",f);if(P)O.set("repo_url",P)}catch(y){}let T=O.toString();return T?`?${T}`:""}let z=R(async()=>{try{let[O,T]=await Promise.all([fetch(`/agent/addons${H()}`),fetch("/agent/settings-data")]),y=await O.json();if(y.error)throw Error(y.error);Z(y.addons||[]),B(y.sources||[]),W(y.failed_sources||[]);let A=await T.json().catch(()=>({})),P=typeof A?.runtimePlatform==="string"?A.runtimePlatform:"";N({runtime:P,windowsNative:P==="win32"})}catch(O){Z(null),_?.(String(O.message||O),"error")}finally{G(!1)}},[_]);b(()=>{z()},[]);let k=R(async(O)=>{if(q)return;Q({slug:O,action:"install"}),_?.(`Installing ${O}…`,"info");try{let y=await(await fetch(`/agent/addons/install${H()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:O})})).json();if(y.error){_?.(y.error,"error");return}V(!0);let A=[y.message,y.warning].filter(Boolean).join(" ");_?.(A||"Add-on installed.","success"),await z()}catch(T){_?.(String(T.message||T),"error")}finally{Q(null)}},[q,z,_]),J=R(async(O)=>{if(q)return;Q({slug:O,action:"remove"}),_?.(`Removing ${O}…`,"info");try{let y=await(await fetch(`/agent/addons/uninstall${H()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:O})})).json();if(y.error){_?.(y.error,"error");return}V(!0);let A=[y.message,y.warning].filter(Boolean).join(" ");_?.(A||"Add-on removed.","success"),await z()}catch(T){_?.(String(T.message||T),"error")}finally{Q(null)}},[q,z,_]),L=R(async()=>{if(q)return;Q({slug:null,action:"restart"}),_?.("Restarting piclaw…","info");try{let T=await(await fetch("/agent/addons/restart",{method:"POST"})).json();if(T.error){_?.(T.error,"error"),Q(null);return}_?.(T.message||"Restarting piclaw…","success"),V(!1),(async(A=30,P=2000)=>{for(let f=0;f<A;f++){await new Promise((u)=>setTimeout(u,P));try{if((await fetch("/agent/addons",{signal:AbortSignal.timeout(3000)})).ok){await z(),Q(null),_?.("Restart complete — add-ons refreshed.","success");return}}catch(u){}}Q(null),_?.("Backend did not return in time. Reload the page manually.","warning")})()}catch(O){_?.(String(O.message||O),"error"),Q(null)}},[q,_,z]);if(X)return U`<div class="settings-loading">Fetching add-ons\u2026</div>`;if(!j)return U`<div class="settings-section"><p class="settings-hint">Could not load add-ons.</p></div>`;let x=$.toLowerCase(),I=x?j.filter((O)=>O.slug.toLowerCase().includes(x)||(O.description||"").toLowerCase().includes(x)||(O.tags||[]).some((T)=>T.toLowerCase().includes(x))):j,E=q?.slug||null,M=q?q.action==="remove"?`Removing ${q.slug}…`:q.action==="restart"?"Restarting piclaw…":`Installing ${q.slug}…`:"";return U`
        <div class=${`settings-section settings-addon-panel${q?" busy":""}`} aria-busy=${q?"true":"false"}>
            <div class="settings-addon-toolbar">
                <div>
                    <p class="settings-hint">
                        ${F.length<=1?U`Catalog from <a href="https://github.com/rcarmo/piclaw-addons" target="_blank">rcarmo/piclaw-addons</a>.`:U`${F.length} catalog sources merged.`}
                        ${" "}Package-first install via Bun; restart required after install/uninstall.
                    </p>
                    ${D.length>0&&U`
                        <div class="settings-addon-error" role="alert">
                            Failed to fetch ${D.length} catalog source${D.length>1?"s":""}:
                            ${D.map((O)=>U` <code style="font-size:0.82em;word-break:break-all">${O}</code>`)}
                        </div>
                    `}
                    ${F.length>1&&U`
                        <details class="settings-hint" style="margin-top:4px">
                            <summary style="cursor:pointer">Active catalog sources (${F.length})</summary>
                            <ul style="margin:4px 0 0 16px;font-size:0.82em">
                                ${F.map((O)=>U`<li style="word-break:break-all"><code>${O}</code></li>`)}
                            </ul>
                        </details>
                    `}
                    ${Y.windowsNative&&U`
                        <div class="settings-addon-error" role="alert">
                            Native Windows add-on installs are higher risk: Bun package installs, symlink cleanup, locked files, and restart timing can all be less predictable than in Linux/WSL. Prefer WSL or a container when possible.
                        </div>
                    `}
                </div>
            </div>
            <div class="settings-addon-list">
                ${q&&U`
                    <div class="settings-addon-panel-overlay" role="status" aria-live="polite" aria-label=${M}>
                        <div class="settings-addon-panel-overlay-card">
                            <div class="settings-spinner"></div>
                            <span>${M}</span>
                        </div>
                    </div>
                `}
                ${I.map((O)=>{let T=(O.skills||[]).length>0,y=O.type==="extension",A=T&&y?"extension + skill":T?"skill":"extension",P=T&&!y?"settings-tag-skill":"",f=typeof O.homepage==="string"&&O.homepage.trim()?O.homepage.trim():"";return U`
                    <div class=${`settings-addon-card${O.installed?" installed":""}`}>
                        <div class="settings-addon-card-header">
                            ${f?U`<a class="settings-addon-name-link" href=${f} target="_blank" rel="noopener noreferrer">${O.slug}</a>`:U`<strong>${O.slug}</strong>`}
                            <span class=${`settings-tag settings-tag-type ${P}`}>${A}</span>
                            <span class="settings-addon-version">${O.installed?O.installedVersion||"?":O.version||""}</span>
                            ${O.installKind&&U`<span class="settings-tag">${O.installKind}</span>`}
                            ${O.hasUpdate&&U`<span class="settings-tag settings-tag-skill">\u2191 ${O.version}</span>`}
                            <div class="settings-addon-actions">
                                ${O.installed?U`
                                    ${O.hasUpdate&&U`<button class="settings-addon-btn settings-addon-btn-upgrade" disabled=${Boolean(q)} onClick=${()=>k(O.slug)}>${E===O.slug?"…":"Update"}</button>`}
                                    <button class="settings-addon-btn settings-addon-btn-remove" disabled=${Boolean(q)} onClick=${()=>J(O.slug)}>${E===O.slug?"…":"Remove"}</button>
                                `:U`
                                    <button class="settings-addon-btn settings-addon-btn-install" disabled=${Boolean(q)} onClick=${()=>k(O.slug)}>${E===O.slug?"…":"Install"}</button>
                                `}
                            </div>
                        </div>
                        <div class="settings-addon-card-body">${O.description}</div>
                        <div class="settings-addon-card-footer">
                            <div class="settings-addon-tags">${(O.tags||[]).map((u)=>U`<span class="settings-tag">${u}</span>`)}${(O.skills||[]).map((u)=>U`<span class="settings-tag settings-tag-skill">\ud83d\udcdd ${u}</span>`)}</div>
                        </div>
                    </div>
                `})}
                ${I.length===0&&U`<p class="settings-hint">No add-ons match "${$}"</p>`}
            </div>
            ${K&&U`
                <div class="settings-addon-restart-notice" role="status" aria-live="polite">
                    <span>Extension changes are installed but inactive until piclaw restarts.</span>
                    <button class="settings-addon-btn settings-addon-btn-restart-now" type="button" disabled=${Boolean(q)} onClick=${L}>Restart Now</button>
                </div>
            `}
        </div>
    `}var eQ=J1(()=>{M0()});var NE={};function f9(_,$){try{let j=localStorage.getItem(_);return j===null?$:j==="true"}catch{return $}}function Z8(_,$){try{localStorage.setItem(_,String($))}catch(j){}}function GE(_,$){try{return localStorage.getItem(_)||$}catch{return $}}function qE(_,$){try{localStorage.setItem(_,$)}catch(j){}}function QE(_,$,j,Z){try{return A$(localStorage.getItem(_),{fallback:$,min:j,max:Z})}catch{return A$($,{fallback:$,min:j,max:Z})}}function VE(_,$){try{localStorage.setItem(_,String($))}catch(j){}}function KE(){let[_,$]=C(()=>f9("piclaw_vim_mode",!1)),[j,Z]=C(()=>f9("piclaw_show_whitespace",!0)),[X,G]=C(()=>f9("piclaw_md_live_preview",!0)),[q,Q]=C(()=>QE("piclaw_editor_font_size",13,10,24)),[K,V]=C(()=>GE("piclaw_editor_font_family","")),Y=R((N,F,B)=>{let D=!F;B(D),Z8(N,D)},[]);return U`
        <div class="settings-section">
            <h3>Editor</h3>
            <div class="settings-row">
                <label>Vim mode</label>
                <input type="checkbox" checked=${_}
                    onChange=${()=>{let N=!_;$(N),Z8("piclaw_vim_mode",N)}} />
            </div>
            <div class="settings-row">
                <label>Show whitespace</label>
                <input type="checkbox" checked=${j}
                    onChange=${()=>{let N=!j;Z(N),Z8("piclaw_show_whitespace",N)}} />
            </div>
            <div class="settings-row">
                <label>Markdown live preview</label>
                <input type="checkbox" checked=${X}
                    onChange=${()=>{let N=!X;G(N),Z8("piclaw_md_live_preview",N)}} />
            </div>
            <div class="settings-row">
                <label>Font size (px)</label>
                <${m1}
                    label="editor font size"
                    value=${q}
                    min=${10}
                    max=${24}
                    fallback=${13}
                    width="70px"
                    onChange=${(N)=>{Q(N),VE("piclaw_editor_font_size",N)}}
                />
            </div>
            <div class="settings-row">
                <label>Font family</label>
                <input type="text" value=${K}
                    onInput=${(N)=>{let F=N.target.value;V(F),qE("piclaw_editor_font_family",F)}}
                    placeholder="monospace (default)" />
            </div>
            <p class="settings-hint settings-local-only-hint">This browser only. Editor changes are stored in local browser storage and take effect when you next open or reload a file tab.</p>
        </div>
    `}var YE;var _V=J1(()=>{M0();E5();R4();YE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;s$({id:"editor",label:"Editor",icon:YE,component:KE,order:150})});var zE={};function $V(_,$){try{let j=localStorage.getItem(_);return j===null?$:j==="true"}catch{return $}}function jV(_,$){try{localStorage.setItem(_,String($))}catch(j){}}function BE(_,$,j,Z){try{return A$(localStorage.getItem(_),{fallback:$,min:j,max:Z})}catch{return A$($,{fallback:$,min:j,max:Z})}}function FE(_,$){try{localStorage.setItem(_,String($))}catch(j){}}function UE(){let[_,$]=C(()=>$V("piclaw_mindmap_auto_expand",!0)),[j,Z]=C(()=>BE("piclaw_mindmap_node_spacing",40,20,100)),[X,G]=C(()=>$V("piclaw_mindmap_animate",!0));return U`
        <div class="settings-section">
            <h3>Mind Map</h3>
            <div class="settings-row">
                <label>Auto-expand nodes</label>
                <input type="checkbox" checked=${_}
                    onChange=${()=>{let q=!_;$(q),jV("piclaw_mindmap_auto_expand",q)}} />
            </div>
            <div class="settings-row">
                <label>Node spacing (px)</label>
                <${m1}
                    label="node spacing"
                    value=${j}
                    min=${20}
                    max=${100}
                    fallback=${40}
                    width="70px"
                    onChange=${(q)=>{Z(q),FE("piclaw_mindmap_node_spacing",q)}}
                />
            </div>
            <div class="settings-row">
                <label>Animate transitions</label>
                <input type="checkbox" checked=${X}
                    onChange=${()=>{let q=!X;G(q),jV("piclaw_mindmap_animate",q)}} />
            </div>
            <p class="settings-hint settings-local-only-hint">This browser only. Opens <code>.mindmap.yaml</code> files. Changes take effect on the next map open.</p>
        </div>
    `}var DE;var ZV=J1(()=>{M0();E5();R4();DE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="9.5" y1="9.5" x2="6.5" y2="6.5"/><line x1="14.5" y1="9.5" x2="17.5" y2="6.5"/><line x1="9.5" y1="14.5" x2="6.5" y2="17.5"/><line x1="14.5" y1="14.5" x2="17.5" y2="17.5"/></svg>`;s$({id:"mindmap",label:"Mind Map",icon:DE,component:UE,order:170})});var OE={};function R9(_,$){try{let j=localStorage.getItem(_);return j===null?$:j==="true"}catch{return $}}function S9(_,$){try{localStorage.setItem(_,String($))}catch(j){}}function b9(_,$){try{return localStorage.getItem(_)||$}catch{return $}}function g9(_,$){try{localStorage.setItem(_,$)}catch(j){}}function WE(){let[_,$]=C(()=>R9("piclaw_dev_mode",!1)),[j,Z]=C(()=>b9("piclaw_addons_catalog_url","")),[X,G]=C(()=>b9("piclaw_addons_catalog_urls","")),[q,Q]=C(()=>b9("piclaw_addons_repo_url","")),[K,V]=C(()=>R9("piclaw_debug_sse",!1)),[Y,N]=C(()=>R9("piclaw_debug_tool_calls",!1)),F=R(()=>{let B=!_;$(B),S9("piclaw_dev_mode",B)},[_]);return U`
        <div class="settings-section">
            <h3>Developer</h3>
            <div class="settings-row">
                <label>Developer mode</label>
                <input type="checkbox" checked=${_} onChange=${F} />
            </div>

            <p class="settings-hint settings-local-only-hint">This browser only. Developer-mode toggles and add-on catalog overrides are stored in local browser storage.</p>

            ${_&&U`
                <h3 style="margin-top:16px">Add-on Sources</h3>
                <div class="settings-row">
                    <label>Catalog URL</label>
                    <input type="text" value=${j}
                        onInput=${(B)=>{let D=B.target.value;Z(D),g9("piclaw_addons_catalog_url",D)}}
                        placeholder="https://raw.githubusercontent.com/.../catalog.json" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Primary add-on catalog URL. Leave empty to use the default (<code>rcarmo/piclaw-addons</code>).</p>
                <div class="settings-row" style="align-items:flex-start;">
                    <label>Additional catalog URLs</label>
                    <textarea
                        value=${X}
                        onInput=${(B)=>{let D=B.target.value;G(D),g9("piclaw_addons_catalog_urls",D)}}
                        placeholder="One URL per line\nhttps://example.com/catalog.json"
                        style="max-width:400px; min-height:86px; resize:vertical;"
                    ></textarea>
                </div>
                <p class="settings-hint" style="margin-top:0">Fetched in addition to the primary/default catalog. One URL per line.</p>
                <div class="settings-row">
                    <label>Repo URL</label>
                    <input type="text" value=${q}
                        onInput=${(B)=>{let D=B.target.value;Q(D),g9("piclaw_addons_repo_url",D)}}
                        placeholder="https://github.com/.../piclaw-addons.git" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Override the git repo used for <code>bun add</code> installs. Leave empty for default.</p>

                <h3 style="margin-top:16px">Debug</h3>
                <div class="settings-row">
                    <label>Log SSE events</label>
                    <input type="checkbox" checked=${K}
                        onChange=${()=>{let B=!K;V(B),S9("piclaw_debug_sse",B)}} />
                </div>
                <div class="settings-row">
                    <label>Log tool calls</label>
                    <input type="checkbox" checked=${Y}
                        onChange=${()=>{let B=!Y;N(B),S9("piclaw_debug_tool_calls",B)}} />
                </div>
                <p class="settings-hint">Debug flags take effect on next page reload.</p>
            `}
        </div>
    `}var HE;var XV=J1(()=>{M0();E5();HE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;s$({id:"developer",label:"Developer",icon:HE,component:WE,order:900})});var KV={};$_(KV,{openSettingsDialog:()=>mE,SettingsDialogContent:()=>VV,SettingsDialog:()=>vE});function w6(_){y6.push({ts:performance.now(),label:_})}function LE(){if(!y6.length)return;let _=y6[0].ts,$=y6.map((j)=>`+${(j.ts-_).toFixed(1)}ms ${j.label}`);console.info(`[settings-dialog perf]
`+$.join(`
`));try{window.__piclawSettingsPerfLog=$}catch(j){}try{fetch("/agent/client-perf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({label:"settings-dialog",lines:$})}).catch((j)=>{})}catch(j){}y6.length=0}function AE(_){let $=q8.get(_);if($)return Promise.resolve($);let j=X8.get(_);if(j)return j;let Z=JE[_]().then((X)=>{return q8.set(_,X),X8.delete(_),X}).catch((X)=>{throw X8.delete(_),X});return X8.set(_,Z),Z}function G8(_="Loading…"){return U`
        <div class="settings-loading settings-loading-pane" role="status" aria-live="polite">
            <span class="settings-spinner"></span>
            <span>${_}</span>
        </div>
    `}function VV({onClose:_}){w6("SettingsDialogContent-render-start");let[$,j]=C(()=>F9()||"general"),[Z,X]=C(GV),[G,q]=C(null),[Q,K]=C(""),[,V]=C(0),[Y,N]=C(()=>Object.fromEntries(q8.entries())),[F,B]=C(null),[D,W]=C({compact:!1,narrow:!1}),H=g(null),z=g(null);b(()=>{w6("SettingsDialogContent-mounted"),LE()},[]),b(()=>{let A=(P)=>{if(P.key==="Escape")_()};return window.addEventListener("keydown",A),()=>window.removeEventListener("keydown",A)},[_]),b(()=>{let A=(P)=>{let f=typeof P?.detail?.section==="string"?P.detail.section.trim():"";if(f)j(f),K("")};return window.addEventListener("piclaw:open-settings",A),()=>window.removeEventListener("piclaw:open-settings",A)},[]),b(()=>{let A=()=>V((P)=>P+1);return window.addEventListener("piclaw:settings-panes-changed",A),()=>window.removeEventListener("piclaw:settings-panes-changed",A)},[]),b(()=>{fetch("/agent/settings-data").then((A)=>A.json()).then((A)=>{GV=A,X(A)}).catch(()=>X({}))},[]),b(()=>{let A=z.current;if(!A)return;let P=()=>{let f=A.clientWidth||0;W((u)=>{let c={compact:f>0&&f<=860,narrow:f>0&&f<=720};return u.compact===c.compact&&u.narrow===c.narrow?u:c})};if(P(),typeof ResizeObserver==="function"){let f=new ResizeObserver(()=>P());return f.observe(A),()=>f.disconnect()}return window.addEventListener("resize",P),()=>window.removeEventListener("resize",P)},[]);let k=[...QV].sort((A,P)=>(A.order??500)-(P.order??500)),L=aq().map((A)=>({id:A.id,label:A.label,icon:A.icon,searchable:A.searchable||!1,placeholder:A.searchPlaceholder,order:A.order??500,isExtension:!0,component:A.component})).sort(U9),x=[...k,...L],I=x.find((A)=>A.id===$)||QV.find((A)=>A.id===$);b(()=>{if(I?.searchable)requestAnimationFrame(()=>H.current?.focus())},[$]),b(()=>{if(I?.isExtension){B(null);return}let A=!1;if(Y[$]){B(null);return}return B($),AE($).then((P)=>{if(A)return;N((f)=>f?.[$]?f:{...f||{},[$]:P})}).catch((P)=>{if(A)return;console.error(`[settings-dialog] Failed to lazy-load section "${$}".`,P)}).finally(()=>{if(!A)B((P)=>P===$?null:P)}),()=>{A=!0}},[$,I?.isExtension,Y]);let E=R((A,P="info")=>{q(A?{text:A,type:P}:null)},[]),M=R((A)=>{j(A),K("");let P=EE[A];if(P&&!qV.has(A))qV.add(A),P().then(()=>V((f)=>f+1)).catch((f)=>{})},[]),O=R((A)=>{X((P)=>({...P||{},...A||{}}))},[]),T=()=>{if(I?.isExtension){if(!I.component)return G8("Loading pane…");let P=I.component;return U`<${P} filter=${Q} />`}let A=Y[$];if(!A||F===$)return G8(`Loading ${I?.label||"settings"}…`);switch($){case"general":return U`<${A} settingsData=${Z} setStatus=${E} mergeSettingsData=${O} />`;case"sessions":return U`<${A} settingsData=${Z} setStatus=${E} mergeSettingsData=${O} />`;case"compaction":return U`<${A} settingsData=${Z} setStatus=${E} mergeSettingsData=${O} />`;case"keyboard":return U`<${A} filter=${Q} setStatus=${E} />`;case"workspace":return U`<${A} settingsData=${Z} setStatus=${E} mergeSettingsData=${O} />`;case"environment":return U`<${A} settingsData=${Z} filter=${Q} setStatus=${E} mergeSettingsData=${O} />`;case"providers":return U`<${A} providers=${Z?.providers} setStatus=${E} />`;case"models":return U`<${A} filter=${Q} />`;case"theme":return U`<${A} themes=${Z?.themes} colorKeys=${Z?.colorKeys} settingsData=${Z} setStatus=${E} mergeSettingsData=${O} />`;case"scheduled-tasks":return U`<${A} filter=${Q} setStatus=${E} />`;case"quick-actions":return U`<${A} filter=${Q} setStatus=${E} mergeSettingsData=${O} />`;case"keychain":return U`<${A} filter=${Q} />`;case"tools":return U`<${A} toolsets=${Z?.toolsets} filter=${Q} settingsData=${Z} mergeSettingsData=${O} />`;case"addons":return U`<${A} setStatus=${E} filter=${Q} />`;default:return G8("Loading settings…")}},y=!I;return w6("SettingsDialogContent-render-end"),U`
        <div class="settings-dialog-backdrop" onClick=${(A)=>{if(A.target===A.currentTarget)_()}}>
            <div ref=${z} data-testid="settings-dialog" class=${`settings-dialog${D.compact?" settings-dialog-compact":""}${D.narrow?" settings-dialog-narrow":""}`}>
                <div class="settings-dialog-header">
                    <span class="settings-dialog-title">Settings</span>
                    ${I?.searchable&&U`
                        <input ref=${H} type="text" class="settings-header-filter"
                            placeholder=${I.placeholder||"Filter…"}
                            value=${Q} onInput=${(A)=>K(A.target.value)} />
                    `}
                    <button class="settings-dialog-close" onClick=${_} title="Close (Esc)">✕</button>
                </div>
                <div class="settings-dialog-body">
                    <nav class="settings-nav">
                        ${x.map((A,P)=>{let f=P>0&&!x[P-1].isExtension,u=A.isExtension&&f;return U`
                                ${u&&U`<div class="settings-nav-separator"></div>`}
                                <button class=${`settings-nav-item ${A.id===$?"active":""}`} onClick=${()=>M(A.id)}>
                                    <span class="settings-nav-icon">${A.icon}</span>
                                    <span class="settings-nav-label">${A.label}</span>
                                </button>
                            `})}
                    </nav>
                    <main class="settings-content">
                        ${y?G8("Loading settings…"):T()}
                    </main>
                </div>
                ${G&&U`
                    <div class=${`settings-status-bar settings-status-bar-${G.type}`}>
                        ${G.type==="info"&&U`<span class="settings-spinner"></span>`}
                        <span>${G.text}</span>
                        ${G.type!=="info"&&U`<button class="settings-status-dismiss" onClick=${()=>q(null)}>✕</button>`}
                    </div>
                `}
            </div>
        </div>
    `}function vE(){let[_,$]=C(!1);if(b(()=>{let j=(X)=>{let G=J5(X?.detail?.section);if(G)try{window.__piclawSettingsRequestedSection=G}catch(q){}$(!0)};window.addEventListener("piclaw:open-settings",j);let Z=r2();if(Z.open){if(Z.section)try{window.__piclawSettingsRequestedSection=Z.section}catch(X){}$(!0)}return()=>window.removeEventListener("piclaw:open-settings",j)},[]),!_)return null;return U`<${i$} className="settings-portal"><${VV} onClose=${()=>$(!1)} /><//>`}function mE(_={}){a_(_)}var y6,GV=null,q8,X8,JE,EE,qV,ME,kE,TE,yE,wE,IE,xE,CE,PE,fE,RE,SE,bE,gE,uE,QV;var YV=J1(()=>{M0();n2();E5();QQ();y6=[];w6("module-eval-start");w6("imports-done");q8=new Map,X8=new Map;q8.set("general",H9);JE={general:()=>Promise.resolve(H9),sessions:()=>Promise.resolve().then(() => (YQ(),KQ)).then((_)=>_.SessionsSection),recordings:()=>Promise.resolve().then(() => (BQ(),NQ)).then((_)=>_.RecordingsSection),compaction:()=>Promise.resolve().then(() => (UQ(),FQ)).then((_)=>_.CompactionSection),keyboard:()=>Promise.resolve().then(() => (JQ(),LQ)).then((_)=>_.KeyboardSection),workspace:()=>Promise.resolve().then(() => (yQ(),TQ)).then((_)=>_.WorkspaceSection),environment:()=>Promise.resolve().then(() => (IQ(),wQ)).then((_)=>_.EnvironmentSection),providers:()=>Promise.resolve().then(() => (CQ(),xQ)).then((_)=>_.ProvidersSection),models:()=>Promise.resolve().then(() => (fQ(),PQ)).then((_)=>_.ModelsSection),theme:()=>Promise.resolve().then(() => (bQ(),SQ)).then((_)=>_.ThemeSection),"scheduled-tasks":()=>Promise.resolve().then(() => (vQ(),uQ)).then((_)=>_.ScheduledTasksSection),"quick-actions":()=>Promise.resolve().then(() => (dQ(),nQ)).then((_)=>_.QuickActionsSection),keychain:()=>Promise.resolve().then(() => (iQ(),oQ)).then((_)=>_.KeychainSection),tools:()=>Promise.resolve().then(() => (aQ(),sQ)).then((_)=>_.ToolsSection),addons:()=>Promise.resolve().then(() => (eQ(),tQ)).then((_)=>_.AddonsSection)},EE={"editor-settings":()=>Promise.resolve().then(() => (_V(),NE)).then(()=>{}),"mindmap-settings":()=>Promise.resolve().then(() => (ZV(),zE)).then(()=>{}),developer:()=>Promise.resolve().then(() => (XV(),OE)).then(()=>{})},qV=new Set;ME=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M8.5 5.9L9.6 2.3h4.8l1.1 3.6 3.7-.8 2.4 4.1-2.6 2.8 2.6 2.8-2.4 4.1-3.7-.8-1.1 3.6H9.6l-1.1-3.6-3.7.8-2.4-4.1L5 12 2.4 9.2l2.4-4.1z"/></svg>`,kE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,TE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.2"/><path d="m13 10 4-2.5v9L13 14z"/></svg>`,yE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 10 9 10"/><path d="M12 7v5l3 3"/></svg>`,wE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,IE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/><path d="M8 7v10"/><path d="M16 7v10"/></svg>`,xE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01"/><path d="M10 9h.01"/><path d="M14 9h.01"/><path d="M18 9h.01"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M7 17h10"/></svg>`,CE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,PE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="14" height="10" rx="2"/><circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none"/><line x1="12" y1="9" x2="12" y2="5"/><circle cx="12" cy="4" r="1.5"/></svg>`,fE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.53-.21-1.01-.55-1.36-.34-.36-.55-.84-.55-1.37 0-1.1.9-2 2-2h2.36c3.08 0 5.64-2.56 5.64-5.64C22.9 5.85 18.05 2 12 2z"/><circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none"/></svg>`,RE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M7 3.5 4 6"/><path d="m17 3.5 3 2.5"/></svg>`,SE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,bE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,gE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="14" r="3"/><path d="M11 14h9"/><path d="M16 14v-2"/><path d="M19 14v2"/></svg>`,uE=U`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,QV=[{id:"general",label:"General",icon:ME,searchable:!1,order:10},{id:"sessions",label:"Sessions",icon:kE,searchable:!1,order:12},{id:"recordings",label:"Recordings",icon:TE,searchable:!0,placeholder:"Filter recordings…",order:12.5},{id:"compaction",label:"Compaction",icon:yE,searchable:!1,order:13},{id:"keyboard",label:"Keyboard",icon:xE,searchable:!0,placeholder:"Filter shortcuts…",order:14},{id:"workspace",label:"Workspace",icon:wE,searchable:!1,order:15},{id:"environment",label:"Environment",icon:IE,searchable:!0,placeholder:"Filter environment…",order:16},{id:"providers",label:"Providers",icon:CE,searchable:!1,order:20},{id:"models",label:"Models",icon:PE,searchable:!0,placeholder:"Filter models…",order:30},{id:"theme",label:"Appearance",icon:fE,searchable:!1,order:40},{id:"scheduled-tasks",label:"Scheduled Tasks",icon:RE,searchable:!0,placeholder:"Filter scheduled tasks…",order:65},{id:"quick-actions",label:"Quick Actions",icon:bE,searchable:!0,placeholder:"Filter quick actions…",order:70},{id:"keychain",label:"Keychain",icon:gE,searchable:!0,placeholder:"Filter entries…",order:75},{id:"tools",label:"Tools",icon:SE,searchable:!0,placeholder:"Filter tools…",order:80},{id:"addons",label:"Add-ons",icon:uE,searchable:!0,placeholder:"Filter add-ons…",order:90}]});M0();class lZ{extensions=new Map;register(_){this.extensions.set(_.id,_)}unregister(_){this.extensions.delete(_)}resolve(_){let $,j=-1/0;for(let Z of this.extensions.values()){if(Z.placement!=="tabs")continue;if(!Z.canHandle)continue;try{let X=Z.canHandle(_);if(X===!1||X===0)continue;let G=X===!0?0:typeof X==="number"?X:0;if(G>j)j=G,$=Z}catch(X){console.warn(`[PaneRegistry] canHandle() error for "${Z.id}":`,X)}}return $}list(){return Array.from(this.extensions.values())}getDockPanes(){return Array.from(this.extensions.values()).filter((_)=>_.placement==="dock")}getTabPanes(){return Array.from(this.extensions.values()).filter((_)=>_.placement==="tabs")}get(_){return this.extensions.get(_)}get size(){return this.extensions.size}}var Q1=new lZ;var K2=null,w3=null;function nD(){try{return`/static/dist/editor.bundle.js${new URL(import.meta.url).search||""}`}catch{return"/static/dist/editor.bundle.js"}}function pZ(){if(w3)return Promise.resolve(w3);if(!K2)K2=import(nD()).then((_)=>{return w3=_,_}).catch((_)=>{throw K2=null,_});return K2}class rZ{container;context;real=null;disposed=!1;loadingEl;queuedDirtyCb=null;queuedSaveCb=null;queuedCloseCb=null;queuedViewStateCb=null;queuedContentChangeCb=null;queuedContentChangeUnsubscribe=null;queuedViewState=null;queuedDiffMode=void 0;constructor(_,$){this.container=_,this.context=$,this.loadingEl=document.createElement("div"),this.loadingEl.className="editor-pane",this.loadingEl.innerHTML=`
            <div class="editor-body">
                <div class="editor-status" style="padding: 2em; text-align: center; color: var(--text-secondary);">Loading editor…</div>
            </div>
        `,_.appendChild(this.loadingEl),this.load()}escapeHtml(_){let $=document.createElement("div");return $.textContent=_,$.innerHTML}async load(){try{let _=await pZ();if(this.disposed)return;if(this.loadingEl.parentNode)this.loadingEl.remove();if(this.real=new _.StandaloneEditorInstance(this.container,this.context),this.queuedDirtyCb&&this.real.onDirtyChange)this.real.onDirtyChange(this.queuedDirtyCb);if(this.queuedSaveCb&&this.real.onSaveRequest)this.real.onSaveRequest(this.queuedSaveCb);if(this.queuedCloseCb&&this.real.onClose)this.real.onClose(this.queuedCloseCb);if(this.queuedViewStateCb&&typeof this.real.onViewStateChange==="function")this.real.onViewStateChange(this.queuedViewStateCb);if(this.queuedContentChangeCb&&typeof this.real.onContentChange==="function")this.queuedContentChangeUnsubscribe=this.real.onContentChange(this.queuedContentChangeCb)||null;if(this.queuedViewState&&typeof this.real.restoreViewState==="function")requestAnimationFrame(()=>this.real?.restoreViewState?.(this.queuedViewState));if(this.queuedDiffMode!==void 0&&typeof this.real.setDiffMode==="function")this.real.setDiffMode(this.queuedDiffMode)}catch(_){if(this.disposed)return;console.error("[editor-loader] Failed to load editor bundle:",_),this.loadingEl.querySelector(".editor-status").textContent="Failed to load editor. Check console for details."}}getContent(){return this.real?.getContent()}isDirty(){return this.real?.isDirty()||!1}setContent(_,$){if(this.real?.setContent)this.real.setContent(_,$)}focus(){this.real?.focus()}resize(){this.real?.resize?.()}dispose(){if(this.disposed)return;if(this.disposed=!0,this.real)this.real.dispose(),this.real=null;this.container.innerHTML="",this.queuedDirtyCb=null,this.queuedSaveCb=null,this.queuedCloseCb=null,this.queuedViewStateCb=null,this.queuedContentChangeCb=null,this.queuedContentChangeUnsubscribe?.(),this.queuedContentChangeUnsubscribe=null}onDirtyChange(_){if(this.queuedDirtyCb=_,this.real?.onDirtyChange)this.real.onDirtyChange(_)}onSaveRequest(_){if(this.queuedSaveCb=_,this.real?.onSaveRequest)this.real.onSaveRequest(_)}onClose(_){if(this.queuedCloseCb=_,this.real?.onClose)this.real.onClose(_)}beforeDetachFromHost(_){return this.real?.beforeDetachFromHost?.(_)}afterAttachToHost(_){return this.real?.afterAttachToHost?.(_)}moveHost(_,$){return this.real?.moveHost?.(_,$)??!1}exportHostTransferState(){return this.real?.exportHostTransferState?.()??null}onViewStateChange(_){this.queuedViewStateCb=_,this.real?.onViewStateChange?.(_)}onContentChange(_){return this.queuedContentChangeUnsubscribe?.(),this.queuedContentChangeCb=_,this.queuedContentChangeUnsubscribe=this.real?.onContentChange?.(_)||null,()=>{if(this.queuedContentChangeCb===_)this.queuedContentChangeCb=null;this.queuedContentChangeUnsubscribe?.(),this.queuedContentChangeUnsubscribe=null}}restoreViewState(_){this.queuedViewState=_,this.real?.restoreViewState?.(_)}getPath(){return this.real?.getPath?.()??this.context.path??""}setPath(_){this.real?.setPath?.(_)}setDiffMode(_){this.queuedDiffMode=_,this.real?.setDiffMode?.(_)}}var I3={id:"editor",label:"Editor",icon:"edit",capabilities:["edit"],placement:"tabs",canHandle(_){if(!_.path)return!1;if(_.mode!=="edit")return!1;return 1},mount(_,$){return new rZ(_,$)}};function x3(){pZ().catch((_)=>{console.warn("[editor-loader] Background preload failed; the editor will retry on demand.",_)})}function nZ(_){try{return typeof _?.crypto?.randomUUID==="function"?_.crypto.randomUUID():null}catch($){return null}}function Y2(_,$){try{return _?.removeItem?.($),!0}catch(j){return!1}}var dZ="piclaw:editor-popout:",dD=300000;function oZ(_){try{return _?.localStorage??null}catch{return null}}function oD(_=Date.now()){return`editor-popout-${_.toString(36)}-${Math.random().toString(36).slice(2,10)}`}function iZ(_){return typeof _==="string"?_.trim():""}function sZ(_){return(typeof _==="string"?_.trim():"")||null}function aZ(_){return typeof _==="string"?_:void 0}function tZ(_){if(_===void 0)return;if(typeof _!=="string")return null;return _.trim()||null}function eZ(_){if(!_||typeof _!=="object")return null;let $=_,j={};if(typeof $.cursorLine==="number"&&Number.isFinite($.cursorLine))j.cursorLine=$.cursorLine;if(typeof $.cursorCol==="number"&&Number.isFinite($.cursorCol))j.cursorCol=$.cursorCol;if(typeof $.scrollTop==="number"&&Number.isFinite($.scrollTop))j.scrollTop=$.scrollTop;return Object.keys(j).length>0?j:null}function q5(_,$=globalThis){let j=$?.window??$;if(!j?.location?.href)return null;try{let Z=new URL(j.location.href),X=Z.searchParams.get(_)?.trim()||"";if(!X)return null;return Z.searchParams.delete(_),j.history?.replaceState?.(j.history.state,j.document?.title||"",Z.toString()),X}catch{return null}}function iD(_,$=globalThis,j=Date.now()){let Z=oZ($),X=iZ(_?.path);if(!Z||!X)return null;let G={path:X,content:aZ(_?.content),mtime:tZ(_?.mtime),paneOverrideId:sZ(_?.paneOverrideId),viewState:eZ(_?.viewState),capturedAt:j};if(!Boolean(G.content!==void 0||G.paneOverrideId||G.viewState||G.mtime))return null;let Q=oD(j);try{return Z.setItem(`${dZ}${Q}`,JSON.stringify(G)),Q}catch{return null}}function C3(_,$=globalThis,j=Date.now()){let Z=typeof _==="string"?_.trim():"",X=oZ($);if(!Z||!X)return null;let G=`${dZ}${Z}`,q="";try{q=X.getItem(G)||""}catch{return null}if(!q)return null;Y2(X,G);try{let Q=JSON.parse(q),K=typeof Q?.capturedAt==="number"&&Number.isFinite(Q.capturedAt)?Q.capturedAt:j;if(K+dD<j)return null;let V=iZ(Q?.path);if(!V)return null;return{path:V,content:aZ(Q?.content),mtime:tZ(Q?.mtime),paneOverrideId:sZ(Q?.paneOverrideId),viewState:eZ(Q?.viewState),capturedAt:K}}catch{return null}}function N2(_,$=globalThis,j=Date.now()){let Z=iD(_,$,j);return Z?{editor_popout:Z}:null}function S_(_){try{return _(),!0}catch($){return!1}}function _X(_){let{ownerWindow:$,themeChangeListener:j,mediaQuery:Z,mediaQueryListener:X,dockResizeListener:G,windowResizeListener:q,themeObserver:Q,resizeObserver:K}=_;S_(()=>{if(j)$?.removeEventListener?.("piclaw-theme-change",j)}),S_(()=>{if(Z&&X){if(Z.removeEventListener)Z.removeEventListener("change",X);else if(Z.removeListener)Z.removeListener(X)}}),S_(()=>{if(G)$?.removeEventListener?.("dock-resize",G);if(q)$?.removeEventListener?.("resize",q)}),S_(()=>{Q?.disconnect?.()}),S_(()=>{K?.disconnect?.()})}function $X(_){_.syncHostLayout(),S_(()=>{_.terminal?.renderer?.remeasureFont?.()}),S_(()=>{_.fitAddon?.fit?.()}),_.sendResize()}function jX(_){let{resizeFrame:$=0,cancelAnimationFrameFn:j=cancelAnimationFrame,socket:Z,fitAddon:X,terminal:G,termEl:q}=_;if($)S_(()=>{j($)});return S_(()=>{Z?.close?.()}),S_(()=>{X?.dispose?.()}),S_(()=>{G?.dispose?.()}),q?.remove?.(),0}function r_(_){try{return _(),!0}catch($){return!1}}function ZX(_){let{termEl:$,bodyEl:j,terminal:Z,theme:X,themeChanged:G=!1,socket:q,resize:Q}=_;if(r_(()=>{if($?.style)$.style.backgroundColor=X.background,$.style.color=X.foreground;if(j?.style)j.style.backgroundColor=X.background,j.style.color=X.foreground;let K=j?.querySelector?.(".terminal-live-host");if(K&&typeof K==="object"&&"style"in K)K.style.backgroundColor=X.background,K.style.color=X.foreground;let V=j?.querySelector?.("canvas");if(V&&typeof V==="object"&&"style"in V)V.style.backgroundColor=X.background,V.style.color=X.foreground}),r_(()=>{if(Z?.options)Z.options.theme=X}),G)r_(()=>{Z?.reset?.()});r_(()=>{Z?.renderer?.setTheme?.(X),Z?.renderer?.clear?.()}),r_(()=>{Z?.loadFonts?.()}),r_(()=>{Z?.renderer?.remeasureFont?.()}),r_(()=>{if(Z?.wasmTerm&&Z?.renderer?.render)Z.renderer.render(Z.wasmTerm,!0,Z.viewportY||0,Z),Z.renderer.render(Z.wasmTerm,!1,Z.viewportY||0,Z)}),r_(()=>{Q?.()}),r_(()=>{if(G&&q?.readyState===1)q.send?.(JSON.stringify({type:"input",data:"\f"}))}),r_(()=>{Z?.refresh?.()})}var sD="/static/js/vendor/ghostty-web.js",aD="/static/js/vendor/ghostty-vt.wasm",V5="piclaw://terminal",tD='FiraCode Nerd Font Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',eD='400 13px "FiraCode Nerd Font Mono"',_z='700 13px "FiraCode Nerd Font Mono"',KX="x-piclaw-terminal-client",XX="piclaw_terminal_client",$z={yellow:"#9a6700",magenta:"#8250df",cyan:"#1b7c83",brightBlack:"#57606a",brightRed:"#cf222e",brightGreen:"#1a7f37",brightYellow:"#bf8700",brightBlue:"#0550ae",brightMagenta:"#6f42c1",brightCyan:"#0a7b83"},jz={yellow:"#d29922",magenta:"#bc8cff",cyan:"#39c5cf",brightBlack:"#8b949e",brightRed:"#ff7b72",brightGreen:"#7ee787",brightYellow:"#e3b341",brightBlue:"#79c0ff",brightMagenta:"#d2a8ff",brightCyan:"#56d4dd"},B2=null,P3=null;function f3(_){if(!_)return"";let $=String(_.code||"").trim().toLowerCase();if($)return $;let j=String(_.key||"").trim().toLowerCase();if(!j)return"";if(j.length===1&&/[a-z]/.test(j))return`key${j}`;if(j==="insert")return"insert";return j}function Zz(_){if(!_)return!1;if(!_.shiftKey||_.altKey)return!1;if(!(_.ctrlKey||_.metaKey))return!1;return f3(_)==="keyc"}function Xz(_){if(!_)return!1;if(_.shiftKey&&!_.ctrlKey&&!_.metaKey&&!_.altKey&&f3(_)==="insert")return!0;if(!_.shiftKey||_.altKey)return!1;if(!(_.ctrlKey||_.metaKey))return!1;return f3(_)==="keyv"}async function Gz(_=typeof navigator<"u"?navigator:null){let $=_?.clipboard?.readText;if(typeof $!=="function")return null;try{let j=await $.call(_.clipboard);return typeof j==="string"?j:null}catch(j){return console.debug("[terminal-pane] Clipboard read failed.",j),null}}function qz(_){if(!_)return!1;return _.startsWith("data:application/wasm")||/(^|\/)ghostty-vt\.wasm(?:[?#].*)?$/.test(_)}async function Qz(_){let $=globalThis.fetch?.bind(globalThis);if(!$)return await _();let j=new URL(aD,window.location.origin).href,Z=(X,G)=>{let q=X instanceof Request?X.url:X instanceof URL?X.href:String(X);if(!qz(q))return $(X,G);if(X instanceof Request)return $(new Request(j,X));return $(j,G)};globalThis.fetch=Z;try{return await _()}finally{globalThis.fetch=$}}async function Vz(){let $=await import(new URL(sD,window.location.origin).href);if(!B2)B2=Qz(()=>Promise.resolve($.init?.())).catch((j)=>{throw B2=null,j});return await B2,$}async function Kz(){if(typeof document>"u"||!("fonts"in document)||!document.fonts)return;if(!P3)P3=Promise.allSettled([document.fonts.load(eD),document.fonts.load(_z),document.fonts.ready]).then(()=>{return}).catch(()=>{return});await P3}function GX(_=typeof window<"u"?window:null){try{if(typeof _?.crypto?.randomUUID==="function")return _.crypto.randomUUID()}catch($){console.debug("[terminal-pane] Failed to generate crypto-backed terminal client token; falling back.",$)}return`terminal-client-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`}function S3(_=typeof window<"u"?window:null){if(!_)return null;try{let $=_.localStorage,j=typeof $?.getItem==="function"?String($.getItem(XX)||"").trim():"";if(j)return j;let Z=GX(_);return $?.setItem?.(XX,Z),Z}catch($){return GX(_)}}async function Yz(_=S3()){let $=await fetch("/terminal/session",{method:"GET",credentials:"same-origin",headers:_?{[KX]:_}:void 0}),j=await $.json().catch(()=>({}));if(!$.ok)throw Error(j?.error||`HTTP ${$.status}`);return j}async function Nz(_=S3()){let $=await fetch("/terminal/handoff",{method:"POST",credentials:"same-origin",headers:_?{[KX]:_}:void 0}),j=await $.json().catch(()=>({}));if(!$.ok)throw Error(j?.error||`HTTP ${$.status}`);return typeof j?.handoff?.token==="string"&&j.handoff.token.trim()?j.handoff.token.trim():null}function Bz(_,$=null,j=S3()){let Z=window.location.protocol==="https:"?"wss:":"ws:",X=new URL(`${Z}//${window.location.host}${_}`);if($)X.searchParams.set("handoff",String($));if(j)X.searchParams.set("client",String(j));return X.toString()}function Fz(_=typeof window<"u"?window:null,$=typeof document<"u"?document:null){if(!_||!$)return!1;let{documentElement:j,body:Z}=$,X=j?.getAttribute?.("data-theme")?.toLowerCase?.()||"";if(X==="dark")return!0;if(X==="light")return!1;if(j?.classList?.contains("dark")||Z?.classList?.contains("dark"))return!0;if(j?.classList?.contains("light")||Z?.classList?.contains("light"))return!1;return Boolean(_.matchMedia?.("(prefers-color-scheme: dark)")?.matches)}function W4(_,$="",j=typeof document<"u"?document:null){if(!j)return $;return getComputedStyle(j.documentElement).getPropertyValue(_)?.trim()||$}function Q5(_){let $=String(_||"").trim();if(!$)return null;let j=$.startsWith("#")?$.slice(1):$;if(/^[0-9a-fA-F]{3}$/.test(j)||/^[0-9a-fA-F]{6}$/.test(j)){let X=j.length===3?j.split("").map((q)=>q+q).join(""):j,G=parseInt(X,16);return{r:G>>16&255,g:G>>8&255,b:G&255}}let Z=$.match(/rgba?\(\s*(\d+)[,\s]\s*(\d+)[,\s]\s*(\d+)/i);if(Z)return{r:parseInt(Z[1],10),g:parseInt(Z[2],10),b:parseInt(Z[3],10)};return null}function qX(_){let $=(j)=>{let Z=j/255;return Z<=0.03928?Z/12.92:Math.pow((Z+0.055)/1.055,2.4)};return 0.2126*$(_.r)+0.7152*$(_.g)+0.0722*$(_.b)}function o5(_,$){let j=qX(_),Z=qX($),X=Math.max(j,Z),G=Math.min(j,Z);return(X+0.05)/(G+0.05)}function YX(_){let $=Q5(_);if(!$)return"#ffffff";let j={r:255,g:255,b:255},Z={r:0,g:0,b:0};return o5($,j)>=o5($,Z)?"#ffffff":"#000000"}function F2(_){let $=(j)=>Math.max(0,Math.min(255,Math.round(j||0)));return`#${[_.r,_.g,_.b].map((j)=>$(j).toString(16).padStart(2,"0")).join("")}`}function QX(_,$,j){let Z=Math.max(0,Math.min(1,Number.isFinite(j)?j:0));return{r:_.r+($.r-_.r)*Z,g:_.g+($.g-_.g)*Z,b:_.b+($.b-_.b)*Z}}function X_(_,$,j=4.5){let Z=Q5(_),X=Q5($);if(!Z||!X)return $;if(o5(Z,X)>=j)return F2(X);let G=Q5(YX(_));if(!G)return F2(X);let q=G,Q=1,K=0,V=1;for(let F=0;F<14;F+=1){let B=(K+V)/2,D=QX(X,G,B);if(o5(Z,D)>=j)q=D,Q=B,V=B;else K=B}let Y=F2(q),N=Q5(Y);while(N&&o5(Z,N)<j&&Q<1)Q=Math.min(1,Q+0.01),Y=F2(QX(X,G,Q)),N=Q5(Y);return Y}function Uz(_,$){if(!_||!_.startsWith("#"))return _;let j=_.slice(1);if(j.length===3)return`#${j[0]}${j[0]}${j[1]}${j[1]}${j[2]}${j[2]}${$}`;if(j.length===6)return`#${j}${$}`;return _}function VX(_=typeof window<"u"?window:null,$=typeof document<"u"?document:null){let j=Fz(_,$),Z=j?jz:$z,X=W4("--bg-primary",j?"#000000":"#ffffff",$),G=W4("--text-primary",j?"#e7e9ea":"#0f1419",$),q=X_(X,G||YX(X),7),Q=W4("--accent-color","#1d9bf0",$),K=W4("--danger-color",j?"#ff7b72":"#cf222e",$),V=W4("--success-color",j?"#7ee787":"#1a7f37",$),Y=W4("--bg-hover",j?"#1d1f23":"#e8ebed",$),N=W4("--accent-soft-strong",Uz(Q,j?"47":"33"),$);return{background:X,foreground:q,cursor:X_(X,Q,3),cursorAccent:X,selectionBackground:N,selectionForeground:q,black:X_(X,Y,3),red:X_(X,K,4.5),green:X_(X,V,4.5),yellow:X_(X,Z.yellow,4.5),blue:X_(X,Q,4.5),magenta:X_(X,Z.magenta,4.5),cyan:X_(X,Z.cyan,4.5),white:q,brightBlack:X_(X,Z.brightBlack,3),brightRed:X_(X,Z.brightRed,4.5),brightGreen:X_(X,Z.brightGreen,4.5),brightYellow:X_(X,Z.brightYellow,4.5),brightBlue:X_(X,Z.brightBlue,4.5),brightMagenta:X_(X,Z.brightMagenta,4.5),brightCyan:X_(X,Z.brightCyan,4.5),brightWhite:q}}function NX(_){let $=_?.activeElement;if(!$||$===_?.body||$===_?.documentElement)return!1;if(typeof $.blur!=="function")return!1;return $.blur(),!0}function R3(_,$){let j=[_?.inputElement,_?.textarea,_?.container,$,$?.querySelector?.("textarea")].filter((Z,X,G)=>Boolean(Z)&&G.indexOf(Z)===X);for(let Z of j)try{let X=Z.ownerDocument?.defaultView||window,G=typeof X.CompositionEvent==="function"?new X.CompositionEvent("compositionend",{data:""}):new X.Event("compositionend");Z.dispatchEvent?.(G)}catch(X){console.debug("[terminal-pane] Failed to dispatch best-effort IME composition reset.",X)}if(_&&typeof _==="object")_.isComposing=!1,_.pendingKeyAfterComposition=null,_.compositionJustEnded=!1}function Dz(_){if(NX(_.ownerDocument),R3(_.terminal,_.terminalHost||null),typeof _.terminal?.focus==="function")_.terminal.focus();else _.termEl?.focus?.();R3(_.terminal,_.terminalHost||null)}class b3{container;ownerDocument;ownerWindow;disposed=!1;termEl;bodyEl;statusEl;terminal=null;fitAddon=null;socket=null;themeObserver=null;themeChangeListener=null;mediaQuery=null;mediaQueryListener=null;resizeObserver=null;dockResizeListener=null;windowResizeListener=null;resizeFrame=0;resizeRetryTimers=new Set;lastAppliedThemeSignature=null;lastResizeSignature=null;pendingHandoffToken=null;standbyHandoffToken=null;standbyHandoffRequest=null;constructor(_,$){this.container=_,this.ownerDocument=_.ownerDocument||document,this.ownerWindow=this.ownerDocument.defaultView||window;let j=typeof $?.transferState?.handoffToken==="string"&&$.transferState.handoffToken.trim()?$.transferState.handoffToken.trim():null,Z=q5("terminal_handoff");this.pendingHandoffToken=j||Z||null,this.termEl=this.ownerDocument.createElement("div"),this.termEl.className="terminal-pane-content",this.termEl.setAttribute("tabindex","0"),this.termEl.setAttribute("inputmode","none"),this.statusEl=this.ownerDocument.createElement("span"),this.statusEl.className="terminal-pane-status",this.statusEl.textContent="Loading terminal…",this.bodyEl=this.ownerDocument.createElement("div"),this.bodyEl.className="terminal-pane-body",this.bodyEl.style.display="flex",this.bodyEl.style.flex="1 1 auto",this.bodyEl.style.minHeight="0",this.bodyEl.innerHTML='<div class="terminal-placeholder">Bootstrapping ghostty-web…</div>',this.termEl.append(this.bodyEl),_.appendChild(this.termEl),this.bootstrapGhostty()}setStatus(_){this.statusEl.textContent=_,this.termEl.dataset.connectionStatus=_,this.termEl.setAttribute("aria-label",`Terminal ${_}`)}getResizeSignature(){try{let _=this.container?.getBoundingClientRect?.(),$=this.bodyEl?.getBoundingClientRect?.(),j=Number.isFinite(_?.width)?_.width:0,Z=Number.isFinite(_?.height)?_.height:0,X=Number.isFinite($?.width)?$.width:0,G=Number.isFinite($?.height)?$.height:0;return`${Math.round(j)}x${Math.round(Z)}:${Math.round(X)}x${Math.round(G)}`}catch{return"0x0:0x0"}}syncHostLayout(){let _=this.bodyEl.querySelector(".terminal-live-host");if(!(_ instanceof HTMLElement))return;_.style.display="flex",_.style.flex="1 1 auto",_.style.width="100%",_.style.height="100%",_.style.minWidth="0",_.style.minHeight="0",_.style.overflow="hidden";let $=_.querySelector("canvas");if($ instanceof HTMLElement)$.style.display="block"}queueResizeRetries(_=[32,96,180,320,520,900]){if(this.disposed||!this.ownerWindow)return;this.clearResizeRetries();for(let $ of _){let j=this.ownerWindow.setTimeout(()=>{if(this.resizeRetryTimers.delete(j),this.disposed)return;this.scheduleResize(!0)},$);this.resizeRetryTimers.add(j)}}clearResizeRetries(){if(!this.ownerWindow||this.resizeRetryTimers.size===0)return;for(let _ of Array.from(this.resizeRetryTimers))try{this.ownerWindow.clearTimeout(_)}catch($){console.debug("[terminal-pane] Ignoring timeout clear failure during resize retry drain.",$,{timer:_})}this.resizeRetryTimers.clear()}scheduleResize(_=!1){if(this.disposed)return;let $=this.getResizeSignature();if(!_&&this.lastResizeSignature===$)return;if(this.resizeFrame)cancelAnimationFrame(this.resizeFrame);this.resizeFrame=requestAnimationFrame(()=>{this.resizeFrame=0,this.lastResizeSignature=this.getResizeSignature(),this.resize()})}async bootstrapGhostty(){try{let _=await Vz();if(await Kz(),this.disposed)return;this.bodyEl.innerHTML="";let $=this.ownerDocument.createElement("div");$.className="terminal-live-host",$.style.display="flex",$.style.flex="1 1 auto",$.style.width="100%",$.style.height="100%",$.style.minWidth="0",$.style.minHeight="0",$.setAttribute("inputmode","none"),this.bodyEl.appendChild($);let j=new _.Terminal({cols:120,rows:30,cursorBlink:!0,fontFamily:tD,fontSize:13,theme:VX(this.ownerWindow,this.ownerDocument)}),Z=null;if(typeof _.FitAddon==="function")Z=new _.FitAddon,j.loadAddon?.(Z);NX(this.ownerDocument),await j.open($),$.__terminal=j,R3(j,$),this.syncHostLayout(),j.loadFonts?.(),Z?.observeResize?.(),this.terminal=j,this.fitAddon=Z,this.installClipboardShortcutBridge(),this.installThemeSync(),this.installResizeSync(),this.scheduleResize(!0),this.queueResizeRetries([32,96,180,320]),await this.connectBackend()}catch(_){if(console.error("[terminal-pane] Failed to bootstrap ghostty-web:",_),this.disposed)return;this.bodyEl.innerHTML='<div class="terminal-placeholder">Terminal failed to load. Check vendored assets and backend wiring.</div>',this.setStatus("Load failed")}}installClipboardShortcutBridge(){let _=this.terminal;if(!_||typeof _.attachCustomKeyEventHandler!=="function")return;_.attachCustomKeyEventHandler(($)=>{if(Zz($)){try{if(!_.copySelection?.()){let Z=typeof _.getSelection==="function"?String(_.getSelection()||""):"";if(Z)this.ownerWindow?.navigator?.clipboard?.writeText?.(Z).catch((X)=>{console.debug("[terminal-pane] Clipboard write fallback failed.",X)})}}catch(j){console.debug("[terminal-pane] Clipboard copy shortcut failed.",j)}return!0}if(Xz($)){if(typeof this.ownerWindow?.navigator?.clipboard?.readText!=="function")return;return Gz(this.ownerWindow?.navigator).then((j)=>{if(typeof j!=="string"||!j.length||this.disposed)return;_.paste?.(j)}),!0}return})}applyTheme(){if(!this.terminal)return;let _=VX(this.ownerWindow,this.ownerDocument),$=JSON.stringify(_),j=this.lastAppliedThemeSignature!==null&&this.lastAppliedThemeSignature!==$;ZX({termEl:this.termEl,bodyEl:this.bodyEl,terminal:this.terminal,theme:_,themeChanged:j,socket:this.socket,resize:()=>this.resize()}),this.lastAppliedThemeSignature=$}installThemeSync(){if(!this.ownerWindow||!this.ownerDocument)return;let _=()=>requestAnimationFrame(()=>this.applyTheme());_();let $=()=>_();this.ownerWindow.addEventListener("piclaw-theme-change",$),this.themeChangeListener=$;let j=this.ownerWindow.matchMedia?.("(prefers-color-scheme: dark)"),Z=()=>_();if(j?.addEventListener)j.addEventListener("change",Z);else if(j?.addListener)j.addListener(Z);this.mediaQuery=j,this.mediaQueryListener=Z;let X=typeof MutationObserver<"u"?new MutationObserver(()=>_()):null;if(X?.observe(this.ownerDocument.documentElement,{attributes:!0,attributeFilter:["class","data-theme","style"]}),this.ownerDocument.body)X?.observe(this.ownerDocument.body,{attributes:!0,attributeFilter:["class","data-theme"]});this.themeObserver=X}installResizeSync(){if(!this.ownerWindow)return;let _=()=>this.scheduleResize(),$=()=>this.scheduleResize();if(this.ownerWindow.addEventListener("dock-resize",_),this.ownerWindow.addEventListener("resize",$),this.dockResizeListener=_,this.windowResizeListener=$,typeof ResizeObserver<"u"){let j=new ResizeObserver(()=>{if(this.disposed)return;this.scheduleResize()});j.observe(this.container),j.observe(this.termEl),j.observe(this.bodyEl),this.resizeObserver=j}}consumeStandbyHandoffToken(){let _=this.standbyHandoffToken||null;return this.standbyHandoffToken=null,_}async ensureStandbyHandoffToken(_=!1){if(this.disposed)return null;if(!_&&this.standbyHandoffToken)return this.standbyHandoffToken;if(this.standbyHandoffRequest)return await this.standbyHandoffRequest;return this.standbyHandoffRequest=Nz().then(($)=>{if(!$||this.disposed)return null;return this.standbyHandoffToken=$,$}).catch(($)=>{return console.warn("[terminal-pane] Failed to prepare standby handoff token:",$),null}).finally(()=>{this.standbyHandoffRequest=null}),await this.standbyHandoffRequest}async connectBackend(){let _=this.terminal;if(!_)return;try{let $=await Yz();if(this.disposed)return;if(!$?.enabled){_.write?.(`Terminal backend unavailable: ${$?.error||"disabled"}\r
`),this.setStatus("Unavailable");return}let j=this.pendingHandoffToken||null,Z=new WebSocket(Bz($.ws_path||"/terminal/ws",j));this.socket=Z,this.setStatus(j?"Transferring…":"Connecting…"),_.onData?.((X)=>{if(Z.readyState===WebSocket.OPEN)Z.send(JSON.stringify({type:"input",data:X}))}),_.onResize?.(({cols:X,rows:G})=>{if(Z.readyState===WebSocket.OPEN)Z.send(JSON.stringify({type:"resize",cols:X,rows:G}))}),Z.addEventListener("open",()=>{if(this.disposed)return;if(j&&this.pendingHandoffToken===j)this.pendingHandoffToken=null;this.ensureStandbyHandoffToken(!1),this.setStatus("Connected"),this.scheduleResize(!0),this.queueResizeRetries([24,72,160,320])}),Z.addEventListener("message",(X)=>{if(this.disposed)return;let G=null;try{G=JSON.parse(String(X.data))}catch{G={type:"output",data:String(X.data)}}if(G?.type==="session"){let q=typeof G.session_id==="string"?G.session_id:null;if(_.__piclawSessionMeta={sessionId:q,createdAt:typeof G.created_at==="string"?G.created_at:null,processPid:typeof G.process_pid==="number"?G.process_pid:null},!this.standbyHandoffToken)this.ensureStandbyHandoffToken(!1);return}if(G?.type==="output"&&typeof G.data==="string"){_.write?.(G.data);return}if(G?.type==="exit")_.write?.(`\r
[terminal exited]\r
`),this.setStatus("Exited")}),Z.addEventListener("close",()=>{if(this.disposed)return;this.setStatus("Disconnected")}),Z.addEventListener("error",()=>{if(this.disposed)return;this.setStatus("Connection error")})}catch($){_.write?.(`Terminal backend unavailable: ${$ instanceof Error?$.message:String($)}\r
`),this.setStatus("Unavailable")}}sendResize(){if(!this.socket||this.socket.readyState!==WebSocket.OPEN||!this.fitAddon?.proposeDimensions)return;let _=this.fitAddon.proposeDimensions();if(!_)return;this.socket.send(JSON.stringify({type:"resize",cols:_.cols,rows:_.rows}))}detachHostListeners(){_X({ownerWindow:this.ownerWindow,themeChangeListener:this.themeChangeListener,mediaQuery:this.mediaQuery,mediaQueryListener:this.mediaQueryListener,dockResizeListener:this.dockResizeListener,windowResizeListener:this.windowResizeListener,themeObserver:this.themeObserver,resizeObserver:this.resizeObserver}),this.themeChangeListener=null,this.mediaQuery=null,this.mediaQueryListener=null,this.themeObserver=null,this.resizeObserver=null,this.dockResizeListener=null,this.windowResizeListener=null}beforeDetachFromHost(){this.setStatus("Moving terminal…")}afterAttachToHost(_){let $=typeof _?.transferState?.handoffToken==="string"&&_.transferState.handoffToken.trim()?_.transferState.handoffToken.trim():null;if($)this.pendingHandoffToken=$;if(this.installThemeSync(),this.installResizeSync(),this.socket?.readyState===WebSocket.OPEN)this.setStatus("Connected");else if(this.pendingHandoffToken)this.setStatus("Transferring…");else if(this.socket?.readyState===WebSocket.CONNECTING)this.setStatus("Connecting…");this.scheduleResize(!0),this.queueResizeRetries([32,96,180,320]),requestAnimationFrame(()=>this.focus())}moveHost(_){return!1}exportHostTransferState(){let _=this.standbyHandoffToken||this.pendingHandoffToken||null;return _?{kind:"terminal",live:!1,handoffToken:_}:null}async preparePopoutTransfer(){let _=this.consumeStandbyHandoffToken();if(!_)await this.ensureStandbyHandoffToken(!0),_=this.consumeStandbyHandoffToken();if(!_)return null;return this.pendingHandoffToken=_,{terminal_handoff:_}}getContent(){return}isDirty(){return!1}focus(){let _=this.bodyEl.querySelector(".terminal-live-host");Dz({terminal:this.terminal,terminalHost:_,termEl:this.termEl,ownerDocument:this.ownerDocument})}resize(){$X({syncHostLayout:()=>this.syncHostLayout(),terminal:this.terminal,fitAddon:this.fitAddon,sendResize:()=>this.sendResize()})}dispose(){if(this.disposed)return;this.disposed=!0,this.standbyHandoffToken=null,this.standbyHandoffRequest=null,this.clearResizeRetries(),this.detachHostListeners(),this.resizeFrame=jX({resizeFrame:this.resizeFrame,socket:this.socket,fitAddon:this.fitAddon,terminal:this.terminal,termEl:this.termEl})}}var g3={id:"terminal",label:"Terminal",icon:"terminal",capabilities:["terminal"],placement:"dock",mount(_,$){return new b3(_,$)}},u3={id:"terminal-tab",label:"Terminal",icon:"terminal",capabilities:["terminal"],placement:"tabs",canHandle(_){return _?.path===V5?1e4:!1},mount(_,$){return new b3(_,$)}};function b_(_={}){let $=_.window??(typeof window<"u"?window:null),j=_.navigator??(typeof navigator<"u"?navigator:null);if(j&&j.standalone===!0)return!0;if(!$||typeof $.matchMedia!=="function")return!1;return["(display-mode: standalone)","(display-mode: minimal-ui)","(display-mode: fullscreen)"].some((X)=>{try{return Boolean($.matchMedia(X)?.matches)}catch{return!1}})}function U2(_={}){let $=_.window??(typeof window<"u"?window:null),j=_.navigator??(typeof navigator<"u"?navigator:null);if(!$&&!j)return!1;let Z=String(j?.userAgent||""),X=Number(j?.maxTouchPoints||0),G=/Android|webOS|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(Z),q=(()=>{if(!$||typeof $.matchMedia!=="function")return!1;try{return Boolean($.matchMedia("(pointer: coarse)")?.matches||$.matchMedia("(any-pointer: coarse)")?.matches)}catch{return!1}})();return Boolean(G||X>1||q)}function BX(_,$={}){if(b_($))return null;if(U2($))return{target:"_blank",features:void 0,mode:"tab"};return{target:zz(_),features:"popup=yes,width=900,height=960,resizable=yes,scrollbars=yes",mode:"popup"}}function v3(_,$={}){let j=$.window??(typeof window<"u"?window:null);if(!j||!_)return null;try{return _.features?j.open("about:blank",_.target,_.features):j.open("about:blank",_.target)}catch{return null}}function m3(_,$={}){if(!_||!_.document)return;try{let j=String($.title||"Opening branch…"),Z=String($.message||"Preparing a new branch window…");_.document.title=j;let X=_.document.body;if(!X)return;if(typeof _.document.createElement!=="function"){X.textContent=`${j}
${Z}`;return}let G=_.document.createElement("div");G.setAttribute("style","font-family: system-ui, sans-serif; padding: 24px; color: #222;");let q=_.document.createElement("h1");q.setAttribute("style","font-size: 18px; margin: 0 0 12px;"),q.textContent=j;let Q=_.document.createElement("p");if(Q.setAttribute("style","margin: 0; line-height: 1.5;"),Q.textContent=Z,G.appendChild(q),G.appendChild(Q),typeof X.replaceChildren==="function")X.replaceChildren(G);else X.innerHTML="",X.appendChild(G)}catch{return}}function c3(_,$){if(!_||!$)return;try{if(_.location&&typeof _.location.replace==="function"){_.location.replace(String($));return}_.location=String($)}catch{return}}function h3(_){if(!_||typeof _.close!=="function")return;try{_.close()}catch{return}}function I_(_,$,j={}){let Z=new URL(String(_||"http://localhost/")),X=String($||"").trim()||"web:default";if(Z.searchParams.set("chat_jid",X),Z.searchParams.delete("branch_loader"),Z.searchParams.delete("branch_source_chat_jid"),Z.searchParams.delete("pane_popout"),Z.searchParams.delete("pane_path"),Z.searchParams.delete("pane_label"),j.chatOnly!==!1)Z.searchParams.set("chat_only","1");return Z.toString()}function l3(_,$,j={}){let Z=new URL(String(_||"http://localhost/")),X=String($||"").trim()||"web:default";if(Z.searchParams.set("branch_loader","1"),Z.searchParams.set("branch_source_chat_jid",X),Z.searchParams.delete("chat_jid"),Z.searchParams.delete("pane_popout"),Z.searchParams.delete("pane_path"),Z.searchParams.delete("pane_label"),j.chatOnly!==!1)Z.searchParams.set("chat_only","1");return Z.toString()}function FX(_,$,j={}){let Z=new URL(String(_||"http://localhost/")),X=String($||"").trim();if(!X)return Z.toString();if(Z.searchParams.set("pane_popout","1"),Z.searchParams.set("pane_path",X),j?.label)Z.searchParams.set("pane_label",String(j.label));else Z.searchParams.delete("pane_label");if(j?.chatJid)Z.searchParams.set("chat_jid",String(j.chatJid));let G=j?.params&&typeof j.params==="object"?j.params:null;if(G)for(let[q,Q]of Object.entries(G)){let K=String(q||"").trim();if(!K)continue;if(Q===null||Q===void 0||Q==="")Z.searchParams.delete(K);else Z.searchParams.set(K,String(Q))}return Z.searchParams.delete("chat_only"),Z.searchParams.delete("branch_loader"),Z.searchParams.delete("branch_source_chat_jid"),Z.toString()}function zz(_){return`piclaw-chat-${String(_||"web:default").trim().toLowerCase().replace(/[^a-z0-9_-]+/g,"-")||"default"}`}function Wz(_){return`piclaw-pane-${String(_||"pane").trim().toLowerCase().replace(/[^a-z0-9_-]+/g,"-")||"default"}`}function UX(_,$={}){if(b_($))return null;if(U2($))return{target:"_blank",features:void 0,mode:"tab"};return{target:Wz(_),features:"popup=yes,width=1200,height=960,resizable=yes,scrollbars=yes",mode:"popup"}}function H4(_){let $=_ instanceof Error?_.message:String(_||"").trim(),j=String($||"").trim();if(!j)return"PiClaw could not open a new branch window.";let Z=j.toLowerCase();if(Z.includes("no stable turn boundary"))return"This chat is still in flight and does not yet have a stable turn boundary to fork from.";if(Z.includes("cannot fork a branch while the source chat is still active"))return"This chat is still active. Please wait for the current turn to settle, then try again.";if(Z.includes("cancelled"))return"Branch creation was cancelled before a new chat window could be opened.";if(Z.includes("did not return a chat id"))return"PiClaw created no usable branch id for the new window. Please try again.";if(Z.includes("failed to fork branch")||Z.includes("failed to fork chat branch"))return"PiClaw could not create the new branch. Please try again.";return j}function Hz(_){try{return JSON.parse(_)}catch{return null}}function Oz(_){if(typeof _==="string")return new TextEncoder().encode(_).byteLength;if(_ instanceof ArrayBuffer)return _.byteLength;if(ArrayBuffer.isView(_))return _.byteLength;if(_ instanceof Blob)return _.size;return 0}function Lz(_){if(typeof _==="string")return _.length;if(_ instanceof ArrayBuffer)return _.byteLength;if(_ instanceof Blob)return _.size;return Number(_?.size||0)}function DX(_){try{return _?.close?.(),!0}catch($){return!1}}class p3{socket=null;disposed=!1;options;bytesIn=0;bytesOut=0;pendingOutbound=[];constructor(_){this.options=_}connect(){if(this.disposed)return;DX(this.socket);let _=new WebSocket(this.options.url);_.binaryType=this.options.binaryType||"arraybuffer",_.addEventListener("open",()=>{if(this.disposed||this.socket!==_)return;this.flushPendingOutbound(_),this.options.onOpen?.()}),_.addEventListener("message",($)=>{if(this.disposed||this.socket!==_)return;let j=Lz($.data);if(this.bytesIn+=j,this.emitMetrics(),typeof $.data==="string"){let Z=this.options.parseControlMessage||Hz;this.options.onMessage?.({kind:"control",raw:$.data,payload:Z($.data)});return}this.options.onMessage?.({kind:"binary",data:$.data,size:j})}),_.addEventListener("close",()=>{if(this.socket===_)this.socket=null;if(this.disposed)return;this.options.onClose?.()}),_.addEventListener("error",()=>{if(this.disposed||this.socket!==_)return;this.options.onError?.()}),this.socket=_}send(_){if(this.disposed)return;let $=this.socket;if(!$||$.readyState!==WebSocket.OPEN){this.pendingOutbound.push(_);return}this.sendNow($,_)}sendControl(_){this.send(JSON.stringify(_??{}))}getMetrics(){return{bytesIn:this.bytesIn,bytesOut:this.bytesOut}}dispose(){if(this.disposed)return;this.disposed=!0,DX(this.socket),this.socket=null}emitMetrics(){this.options.onMetrics?.(this.getMetrics())}sendNow(_,$){let j=Oz($);this.bytesOut+=j,this.emitMetrics(),_.send($)}flushPendingOutbound(_){if(this.pendingOutbound.length===0)return;let $=this.pendingOutbound.splice(0);for(let j=0;j<$.length;j+=1){if(this.disposed||this.socket!==_||_.readyState!==WebSocket.OPEN){this.pendingOutbound.unshift(...$.slice(j));return}this.sendNow(_,$[j])}}}var i5=()=>{throw Error("Operation requires compiling with --exportRuntime")},Jz=typeof BigUint64Array<"u",s5=Symbol();var Ez=new TextDecoder("utf-16le",{fatal:!0});Object.hasOwn=Object.hasOwn||function(_,$){return Object.prototype.hasOwnProperty.call(_,$)};function zX(_,$){let j=new Uint32Array(_)[$+-4>>>2]>>>1,Z=new Uint16Array(_,$,j);if(j<=192)return String.fromCharCode(...Z);try{return Ez.decode(Z)}catch{let X="",G=0;while(j-G>1024)X+=String.fromCharCode(...Z.subarray(G,G+=1024));return X+String.fromCharCode(...Z.subarray(G))}}function WX(_){let $={};function j(X,G){if(!X)return"<yet unknown>";return zX(X.buffer,G)}let Z=_.env=_.env||{};return Z.abort=Z.abort||function(G,q,Q,K){let V=$.memory||Z.memory;throw Error(`abort: ${j(V,G)} at ${j(V,q)}:${Q}:${K}`)},Z.trace=Z.trace||function(G,q,...Q){let K=$.memory||Z.memory;console.log(`trace: ${j(K,G)}${q?" ":""}${Q.slice(0,q).join(", ")}`)},Z.seed=Z.seed||Date.now,_.Math=_.Math||Math,_.Date=_.Date||Date,$}function HX(_,$){let j=$.exports,Z=j.memory,X=j.table,G=j.__new||i5,q=j.__pin||i5,Q=j.__unpin||i5,K=j.__collect||i5,V=j.__rtti_base,Y=V?(T)=>T[V>>>2]:i5;_.__new=G,_.__pin=q,_.__unpin=Q,_.__collect=K;function N(T){let y=new Uint32Array(Z.buffer);if((T>>>=0)>=Y(y))throw Error(`invalid id: ${T}`);return y[(V+4>>>2)+T]}function F(T){let y=N(T);if(!(y&7))throw Error(`not an array: ${T}, flags=${y}`);return y}function B(T){return 31-Math.clz32(T>>>6&31)}function D(T){if(T==null)return 0;let y=T.length,A=G(y<<1,2),P=new Uint16Array(Z.buffer);for(let f=0,u=A>>>1;f<y;++f)P[u+f]=T.charCodeAt(f);return A}_.__newString=D;function W(T){if(T==null)return 0;let y=new Uint8Array(T),A=G(y.length,1);return new Uint8Array(Z.buffer).set(y,A),A}_.__newArrayBuffer=W;function H(T){if(!T)return null;let y=Z.buffer;if(new Uint32Array(y)[T+-8>>>2]!==2)throw Error(`not a string: ${T}`);return zX(y,T)}_.__getString=H;function z(T,y,A){let P=Z.buffer;if(A)switch(T){case 2:return new Float32Array(P);case 3:return new Float64Array(P)}else switch(T){case 0:return new(y?Int8Array:Uint8Array)(P);case 1:return new(y?Int16Array:Uint16Array)(P);case 2:return new(y?Int32Array:Uint32Array)(P);case 3:return new(y?BigInt64Array:BigUint64Array)(P)}throw Error(`unsupported align: ${T}`)}function k(T,y=0){let A=y,P=F(T),f=B(P),u=typeof A!=="number",c=u?A.length:A,r=G(c<<f,P&4?T:1),e;if(P&4)e=r;else{q(r);let m=G(P&2?16:12,T);Q(r);let _0=new Uint32Array(Z.buffer);if(_0[m+0>>>2]=r,_0[m+4>>>2]=r,_0[m+8>>>2]=c<<f,P&2)_0[m+12>>>2]=c;e=m}if(u){let m=z(f,P&2048,P&4096),_0=r>>>f;if(P&16384)for(let H0=0;H0<c;++H0)m[_0+H0]=A[H0];else m.set(A,_0)}return e}_.__newArray=k;function J(T){let y=new Uint32Array(Z.buffer),A=y[T+-8>>>2],P=F(A),f=B(P),u=P&4?T:y[T+4>>>2],c=P&2?y[T+12>>>2]:y[u+-4>>>2]>>>f;return z(f,P&2048,P&4096).subarray(u>>>=f,u+c)}_.__getArrayView=J;function L(T){let y=J(T),A=y.length,P=Array(A);for(let f=0;f<A;f++)P[f]=y[f];return P}_.__getArray=L;function x(T){let y=Z.buffer,A=new Uint32Array(y)[T+-4>>>2];return y.slice(T,T+A)}_.__getArrayBuffer=x;function I(T){if(!X)throw Error("Operation requires compiling with --exportTable");let y=new Uint32Array(Z.buffer)[T>>>2];return X.get(y)}_.__getFunction=I;function E(T,y,A){return new T(M(T,y,A))}function M(T,y,A){let P=Z.buffer,f=new Uint32Array(P);return new T(P,f[A+4>>>2],f[A+8>>>2]>>>y)}function O(T,y,A){_[`__get${y}`]=E.bind(null,T,A),_[`__get${y}View`]=M.bind(null,T,A)}if([Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array].forEach((T)=>{O(T,T.name,31-Math.clz32(T.BYTES_PER_ELEMENT))}),Jz)[BigUint64Array,BigInt64Array].forEach((T)=>{O(T,T.name.slice(3),3)});return _.memory=_.memory||Z,_.table=_.table||X,Mz(j,_)}function OX(_){return typeof Response<"u"&&_ instanceof Response}function Az(_){return _ instanceof WebAssembly.Module}async function r3(_,$={}){if(OX(_=await _))return D2(_,$);let j=Az(_)?_:await WebAssembly.compile(_),Z=WX($),X=await WebAssembly.instantiate(j,$),G=HX(Z,X);return{module:j,instance:X,exports:G}}async function D2(_,$={}){if(!WebAssembly.instantiateStreaming)return r3(OX(_=await _)?_.arrayBuffer():_,$);let j=WX($),Z=await WebAssembly.instantiateStreaming(_,$),X=HX(j,Z.instance);return{...Z,exports:X}}function Mz(_,$={}){let j=_.__argumentsLength?(Z)=>{_.__argumentsLength.value=Z}:_.__setArgumentsLength||_.__setargc||(()=>{});for(let Z of Object.keys(_)){let X=_[Z],G=Z.split("."),q=$;while(G.length>1){let V=G.shift();if(!Object.hasOwn(q,V))q[V]={};q=q[V]}let Q=G[0],K=Q.indexOf("#");if(K>=0){let V=Q.substring(0,K),Y=q[V];if(typeof Y>"u"||!Y.prototype){let N=function(...F){return N.wrap(N.prototype.constructor(0,...F))};if(N.prototype={valueOf(){return this[s5]}},N.wrap=function(F){return Object.create(N.prototype,{[s5]:{value:F,writable:!1}})},Y)Object.getOwnPropertyNames(Y).forEach((F)=>Object.defineProperty(N,F,Object.getOwnPropertyDescriptor(Y,F)));q[V]=N}if(Q=Q.substring(K+1),q=q[V].prototype,/^(get|set):/.test(Q)){if(!Object.hasOwn(q,Q=Q.substring(4))){let N=_[Z.replace("set:","get:")],F=_[Z.replace("get:","set:")];Object.defineProperty(q,Q,{get(){return N(this[s5])},set(B){F(this[s5],B)},enumerable:!0})}}else if(Q==="constructor")(q[Q]=function(...N){return j(N.length),X(...N)}).original=X;else(q[Q]=function(...N){return j(N.length),X(this[s5],...N)}).original=X}else if(/^(get|set):/.test(Q)){if(!Object.hasOwn(q,Q=Q.substring(4)))Object.defineProperty(q,Q,{get:_[Z.replace("set:","get:")],set:_[Z.replace("get:","set:")],enumerable:!0})}else if(typeof X==="function"&&X!==j)(q[Q]=(...V)=>{return j(V.length),X(...V)}).original=X;else q[Q]=X}return $}function n3(_){try{return _?.__collect?.(),!0}catch($){return!1}}var Tz="/static/js/vendor/remote-display-decoder.wasm",z2=null;function LX(_){if(_ instanceof ArrayBuffer)return _;if(_.byteOffset===0&&_.byteLength===_.buffer.byteLength)return _.buffer;return _.slice().buffer}async function JX(){if(z2)return z2;return z2=(async()=>{try{let Z=function(X,G,q,Q,K,V,Y){let N=LX(G),F=j.__pin(j.__newArrayBuffer(N));try{return j[X](F,q,Q,K,V,Y.bitsPerPixel,Y.bigEndian?1:0,Y.trueColor?1:0,Y.redMax,Y.greenMax,Y.blueMax,Y.redShift,Y.greenShift,Y.blueShift)}finally{j.__unpin(F),n3(j)}},_=await fetch(Tz,{credentials:"same-origin"});if(!_.ok)throw Error(`HTTP ${_.status}`);let j=(typeof D2==="function"?await D2(_,{}):await r3(await _.arrayBuffer(),{})).exports;for(let X of["initFramebuffer","getFramebufferPtr","getFramebufferLen","getFramebufferWidth","getFramebufferHeight","processRawRect","processCopyRect","processRreRect","processHextileRect","processZrleTileData","decodeRawRectToRgba"])if(typeof j[X]!=="function")throw Error(`${X} export is missing.`);return{initFramebuffer(X,G){j.initFramebuffer(X,G)},getFramebuffer(){let X=j.getFramebufferPtr(),G=j.getFramebufferLen();return new Uint8ClampedArray(new Uint8Array(j.memory.buffer,X,G).slice().buffer)},getFramebufferWidth(){return j.getFramebufferWidth()},getFramebufferHeight(){return j.getFramebufferHeight()},processRawRect(X,G,q,Q,K,V){return Z("processRawRect",X,G,q,Q,K,V)},processCopyRect(X,G,q,Q,K,V){return j.processCopyRect(X,G,q,Q,K,V)},processRreRect(X,G,q,Q,K,V){return Z("processRreRect",X,G,q,Q,K,V)},processHextileRect(X,G,q,Q,K,V){return Z("processHextileRect",X,G,q,Q,K,V)},processZrleTileData(X,G,q,Q,K,V){return Z("processZrleTileData",X,G,q,Q,K,V)},decodeRawRectToRgba(X,G,q,Q){let K=LX(X),V=j.__pin(j.__newArrayBuffer(K));try{let Y=j.__pin(j.decodeRawRectToRgba(V,G,q,Q.bitsPerPixel,Q.bigEndian?1:0,Q.trueColor?1:0,Q.redMax,Q.greenMax,Q.blueMax,Q.redShift,Q.greenShift,Q.blueShift));try{return new Uint8ClampedArray(j.__getArrayBuffer(Y))}finally{j.__unpin(Y)}}finally{j.__unpin(V),n3(j)}}}}catch(_){return console.warn("[remote-display] Failed to load WASM pipeline, using JS fallback.",_),null}})(),z2}function K5(_,$,j){return Math.max($,Math.min(j,_))}function W2(_,$,j){let Z=new Uint8Array(6),X=K5(Math.floor(Number($||0)),0,65535),G=K5(Math.floor(Number(j||0)),0,65535);return Z[0]=5,Z[1]=K5(Math.floor(Number(_||0)),0,255),Z[2]=X>>8&255,Z[3]=X&255,Z[4]=G>>8&255,Z[5]=G&255,Z}function l$(_){switch(Number(_)){case 0:return 1;case 1:return 2;case 2:return 4;default:return 0}}function o3(_){let $=l$(_?.button);if($)return $;let j=String(_?.pointerType||"").toLowerCase();if(j==="touch"||j==="pen")return l$(0);let Z=Number(_?.buttons||0);if(Z&1)return l$(0);if(Z&4)return l$(1);if(Z&2)return l$(2);return 0}function O4(_){let $=String(_?.type||"").toLowerCase();if($==="pointerup"||$==="pointercancel"||$==="lostpointercapture")return!0;let j=Number(_?.buttons);if(Number.isFinite(j)&&j===0&&$!=="pointerdown")return!0;let Z=String(_?.pointerType||"").toLowerCase(),X=Number(_?.pressure);if(Z==="touch"||Z==="pen"){if($==="pointerleave"||$==="pointerout")return!0;if(Number.isFinite(X)&&X<=0&&$!=="pointerdown")return!0}return!1}function EX(_){let $=String(_?.type||"").toLowerCase();if($==="touchend"||$==="touchcancel")return!0;if($==="touchmove")return Number(_?.touches?.length||0)<=0;return!1}function n_(_){return String(_||"").toLowerCase()==="touch"}function yz(_,$,j,Z){let X=Number(j||0)-Number(_||0),G=Number(Z||0)-Number($||0);return Math.hypot(X,G)}function i3(_){let $=Number.isFinite(_?.maxDistancePx)?Number(_.maxDistancePx):14;return yz(_?.startX,_?.startY,_?.clientX,_?.clientY)>$}function AX(_){let $=Number.isFinite(_?.maxElapsedMs)?Number(_.maxElapsedMs):300;if(Number(_?.elapsedMs||0)>$)return!1;return!i3(_)}function MX(_){return String(_||"").toLowerCase()!=="mouse"}function s3(_,$,j,Z,X){let G=Math.max(1,Math.floor(Number(Z||0))),q=Math.max(1,Math.floor(Number(X||0))),Q=Math.max(1,Number(j?.width||0)),K=Math.max(1,Number(j?.height||0)),V=(Number(_||0)-Number(j?.left||0))/Q,Y=(Number($||0)-Number(j?.top||0))/K;return{x:K5(Math.floor(V*G),0,Math.max(0,G-1)),y:K5(Math.floor(Y*q),0,Math.max(0,q-1))}}function kX(_,$,j,Z=0){let X=Number(_)<0?8:16,G=K5(Number(Z||0)|X,0,255);return[W2(G,$,j),W2(Number(Z||0),$,j)]}function TX(_,$){let j=new Uint8Array(8),Z=Math.max(0,Math.min(4294967295,Number($||0)>>>0));return j[0]=4,j[1]=_?1:0,j[4]=Z>>>24&255,j[5]=Z>>>16&255,j[6]=Z>>>8&255,j[7]=Z&255,j}function yX(_,$,j=!1){if(_==null||$==null)return!1;return Boolean(j)||Number(_)===Number($)}function L4(_){if(typeof _!=="string")return null;return _.length>0?_:null}function wX(_,$,j,Z){let X=Math.max(1,Math.floor(Number(_||0))),G=Math.max(1,Math.floor(Number($||0))),q=Math.max(1,Math.floor(Number(j||0))),Q=Math.max(1,Math.floor(Number(Z||0))),K=Math.min(X/q,G/Q);if(!Number.isFinite(K)||K<=0)return 1;return Math.max(0.01,K)}var d3={Backspace:65288,Tab:65289,Enter:65293,Escape:65307,Insert:65379,Delete:65535,Home:65360,End:65367,PageUp:65365,PageDown:65366,ArrowLeft:65361,ArrowUp:65362,ArrowRight:65363,ArrowDown:65364,Shift:65505,ShiftLeft:65505,ShiftRight:65506,Control:65507,ControlLeft:65507,ControlRight:65508,Alt:65513,AltLeft:65513,AltRight:65514,Meta:65515,MetaLeft:65515,MetaRight:65516,Super:65515,Super_L:65515,Super_R:65516,CapsLock:65509,NumLock:65407,ScrollLock:65300,Pause:65299,PrintScreen:65377,ContextMenu:65383,Menu:65383," ":32};for(let _=1;_<=12;_+=1)d3[`F${_}`]=65470+(_-1);function a3(_){let $=[_?.key,_?.code];for(let G of $)if(G&&Object.prototype.hasOwnProperty.call(d3,G))return d3[G];let j=String(_?.key||""),Z=j?j.codePointAt(0):null,X=Z==null?0:Z>65535?2:1;if(Z!=null&&j.length===X){if(Z<=255)return Z;return(16777216|Z)>>>0}return null}var i1=Uint8Array,L_=Uint16Array,q7=Int32Array,H2=new i1([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),O2=new i1([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),j7=new i1([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),PX=function(_,$){var j=new L_(31);for(var Z=0;Z<31;++Z)j[Z]=$+=1<<_[Z-1];var X=new q7(j[30]);for(var Z=1;Z<30;++Z)for(var G=j[Z];G<j[Z+1];++G)X[G]=G-j[Z]<<5|Z;return{b:j,r:X}},fX=PX(H2,2),RX=fX.b,Z7=fX.r;RX[28]=258,Z7[258]=28;var SX=PX(O2,0),wz=SX.b,IX=SX.r,X7=new L_(32768);for(N1=0;N1<32768;++N1)d_=(N1&43690)>>1|(N1&21845)<<1,d_=(d_&52428)>>2|(d_&13107)<<2,d_=(d_&61680)>>4|(d_&3855)<<4,X7[N1]=((d_&65280)>>8|(d_&255)<<8)>>1;var d_,N1,o_=function(_,$,j){var Z=_.length,X=0,G=new L_($);for(;X<Z;++X)if(_[X])++G[_[X]-1];var q=new L_($);for(X=1;X<$;++X)q[X]=q[X-1]+G[X-1]<<1;var Q;if(j){Q=new L_(1<<$);var K=15-$;for(X=0;X<Z;++X)if(_[X]){var V=X<<4|_[X],Y=$-_[X],N=q[_[X]-1]++<<Y;for(var F=N|(1<<Y)-1;N<=F;++N)Q[X7[N]>>K]=V}}else{Q=new L_(Z);for(X=0;X<Z;++X)if(_[X])Q[X]=X7[q[_[X]-1]++]>>15-_[X]}return Q},p$=new i1(288);for(N1=0;N1<144;++N1)p$[N1]=8;var N1;for(N1=144;N1<256;++N1)p$[N1]=9;var N1;for(N1=256;N1<280;++N1)p$[N1]=7;var N1;for(N1=280;N1<288;++N1)p$[N1]=8;var N1,_6=new i1(32);for(N1=0;N1<32;++N1)_6[N1]=5;var N1,Iz=o_(p$,9,0),xz=o_(p$,9,1),Cz=o_(_6,5,0),Pz=o_(_6,5,1),t3=function(_){var $=_[0];for(var j=1;j<_.length;++j)if(_[j]>$)$=_[j];return $},g_=function(_,$,j){var Z=$/8|0;return(_[Z]|_[Z+1]<<8)>>($&7)&j},e3=function(_,$){var j=$/8|0;return(_[j]|_[j+1]<<8|_[j+2]<<16)>>($&7)},Q7=function(_){return(_+7)/8|0},e5=function(_,$,j){if($==null||$<0)$=0;if(j==null||j>_.length)j=_.length;return new i1(_.subarray($,j))};var fz=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],U_=function(_,$,j){var Z=Error($||fz[_]);if(Z.code=_,Error.captureStackTrace)Error.captureStackTrace(Z,U_);if(!j)throw Z;return Z},Rz=function(_,$,j,Z){var X=_.length,G=Z?Z.length:0;if(!X||$.f&&!$.l)return j||new i1(0);var q=!j,Q=q||$.i!=2,K=$.i;if(q)j=new i1(X*3);var V=function(G0){var O0=j.length;if(G0>O0){var P0=new i1(Math.max(O0*2,G0));P0.set(j),j=P0}},Y=$.f||0,N=$.p||0,F=$.b||0,B=$.l,D=$.d,W=$.m,H=$.n,z=X*8;do{if(!B){Y=g_(_,N,1);var k=g_(_,N+1,3);if(N+=3,!k){var J=Q7(N)+4,L=_[J-4]|_[J-3]<<8,x=J+L;if(x>X){if(K)U_(0);break}if(Q)V(F+L);j.set(_.subarray(J,x),F),$.b=F+=L,$.p=N=x*8,$.f=Y;continue}else if(k==1)B=xz,D=Pz,W=9,H=5;else if(k==2){var I=g_(_,N,31)+257,E=g_(_,N+10,15)+4,M=I+g_(_,N+5,31)+1;N+=14;var O=new i1(M),T=new i1(19);for(var y=0;y<E;++y)T[j7[y]]=g_(_,N+y*3,7);N+=E*3;var A=t3(T),P=(1<<A)-1,f=o_(T,A,1);for(var y=0;y<M;){var u=f[g_(_,N,P)];N+=u&15;var J=u>>4;if(J<16)O[y++]=J;else{var c=0,r=0;if(J==16)r=3+g_(_,N,3),N+=2,c=O[y-1];else if(J==17)r=3+g_(_,N,7),N+=3;else if(J==18)r=11+g_(_,N,127),N+=7;while(r--)O[y++]=c}}var e=O.subarray(0,I),m=O.subarray(I);W=t3(e),H=t3(m),B=o_(e,W,1),D=o_(m,H,1)}else U_(1);if(N>z){if(K)U_(0);break}}if(Q)V(F+131072);var _0=(1<<W)-1,H0=(1<<H)-1,X0=N;for(;;X0=N){var c=B[e3(_,N)&_0],j0=c>>4;if(N+=c&15,N>z){if(K)U_(0);break}if(!c)U_(2);if(j0<256)j[F++]=j0;else if(j0==256){X0=N,B=null;break}else{var Q0=j0-254;if(j0>264){var y=j0-257,F0=H2[y];Q0=g_(_,N,(1<<F0)-1)+RX[y],N+=F0}var h=D[e3(_,N)&H0],$0=h>>4;if(!h)U_(3);N+=h&15;var m=wz[$0];if($0>3){var F0=O2[$0];m+=e3(_,N)&(1<<F0)-1,N+=F0}if(N>z){if(K)U_(0);break}if(Q)V(F+131072);var K0=F+Q0;if(F<m){var L0=G-m,a=Math.min(m,K0);if(L0+F<0)U_(3);for(;F<a;++F)j[F]=Z[L0+F]}for(;F<K0;++F)j[F]=j[F-m]}}if($.l=B,$.p=X0,$.b=F,$.f=Y,B)Y=1,$.m=W,$.d=D,$.n=H}while(!Y);return F!=j.length&&q?e5(j,0,F):j.subarray(0,F)},D$=function(_,$,j){j<<=$&7;var Z=$/8|0;_[Z]|=j,_[Z+1]|=j>>8},a5=function(_,$,j){j<<=$&7;var Z=$/8|0;_[Z]|=j,_[Z+1]|=j>>8,_[Z+2]|=j>>16},_7=function(_,$){var j=[];for(var Z=0;Z<_.length;++Z)if(_[Z])j.push({s:Z,f:_[Z]});var X=j.length,G=j.slice();if(!X)return{t:gX,l:0};if(X==1){var q=new i1(j[0].s+1);return q[j[0].s]=1,{t:q,l:1}}j.sort(function(x,I){return x.f-I.f}),j.push({s:-1,f:25001});var Q=j[0],K=j[1],V=0,Y=1,N=2;j[0]={s:-1,f:Q.f+K.f,l:Q,r:K};while(Y!=X-1)Q=j[j[V].f<j[N].f?V++:N++],K=j[V!=Y&&j[V].f<j[N].f?V++:N++],j[Y++]={s:-1,f:Q.f+K.f,l:Q,r:K};var F=G[0].s;for(var Z=1;Z<X;++Z)if(G[Z].s>F)F=G[Z].s;var B=new L_(F+1),D=G7(j[Y-1],B,0);if(D>$){var Z=0,W=0,H=D-$,z=1<<H;G.sort(function(I,E){return B[E.s]-B[I.s]||I.f-E.f});for(;Z<X;++Z){var k=G[Z].s;if(B[k]>$)W+=z-(1<<D-B[k]),B[k]=$;else break}W>>=H;while(W>0){var J=G[Z].s;if(B[J]<$)W-=1<<$-B[J]++-1;else++Z}for(;Z>=0&&W;--Z){var L=G[Z].s;if(B[L]==$)--B[L],++W}D=$}return{t:new i1(B),l:D}},G7=function(_,$,j){return _.s==-1?Math.max(G7(_.l,$,j+1),G7(_.r,$,j+1)):$[_.s]=j},xX=function(_){var $=_.length;while($&&!_[--$]);var j=new L_(++$),Z=0,X=_[0],G=1,q=function(K){j[Z++]=K};for(var Q=1;Q<=$;++Q)if(_[Q]==X&&Q!=$)++G;else{if(!X&&G>2){for(;G>138;G-=138)q(32754);if(G>2)q(G>10?G-11<<5|28690:G-3<<5|12305),G=0}else if(G>3){q(X),--G;for(;G>6;G-=6)q(8304);if(G>2)q(G-3<<5|8208),G=0}while(G--)q(X);G=1,X=_[Q]}return{c:j.subarray(0,Z),n:$}},t5=function(_,$){var j=0;for(var Z=0;Z<$.length;++Z)j+=_[Z]*$[Z];return j},bX=function(_,$,j){var Z=j.length,X=Q7($+2);_[X]=Z&255,_[X+1]=Z>>8,_[X+2]=_[X]^255,_[X+3]=_[X+1]^255;for(var G=0;G<Z;++G)_[X+G+4]=j[G];return(X+4+Z)*8},CX=function(_,$,j,Z,X,G,q,Q,K,V,Y){D$($,Y++,j),++X[256];var N=_7(X,15),F=N.t,B=N.l,D=_7(G,15),W=D.t,H=D.l,z=xX(F),k=z.c,J=z.n,L=xX(W),x=L.c,I=L.n,E=new L_(19);for(var M=0;M<k.length;++M)++E[k[M]&31];for(var M=0;M<x.length;++M)++E[x[M]&31];var O=_7(E,7),T=O.t,y=O.l,A=19;for(;A>4&&!T[j7[A-1]];--A);var P=V+5<<3,f=t5(X,p$)+t5(G,_6)+q,u=t5(X,F)+t5(G,W)+q+14+3*A+t5(E,T)+2*E[16]+3*E[17]+7*E[18];if(K>=0&&P<=f&&P<=u)return bX($,Y,_.subarray(K,K+V));var c,r,e,m;if(D$($,Y,1+(u<f)),Y+=2,u<f){c=o_(F,B,0),r=F,e=o_(W,H,0),m=W;var _0=o_(T,y,0);D$($,Y,J-257),D$($,Y+5,I-1),D$($,Y+10,A-4),Y+=14;for(var M=0;M<A;++M)D$($,Y+3*M,T[j7[M]]);Y+=3*A;var H0=[k,x];for(var X0=0;X0<2;++X0){var j0=H0[X0];for(var M=0;M<j0.length;++M){var Q0=j0[M]&31;if(D$($,Y,_0[Q0]),Y+=T[Q0],Q0>15)D$($,Y,j0[M]>>5&127),Y+=j0[M]>>12}}}else c=Iz,r=p$,e=Cz,m=_6;for(var M=0;M<Q;++M){var F0=Z[M];if(F0>255){var Q0=F0>>18&31;if(a5($,Y,c[Q0+257]),Y+=r[Q0+257],Q0>7)D$($,Y,F0>>23&31),Y+=H2[Q0];var h=F0&31;if(a5($,Y,e[h]),Y+=m[h],h>3)a5($,Y,F0>>5&8191),Y+=O2[h]}else a5($,Y,c[F0]),Y+=r[F0]}return a5($,Y,c[256]),Y+r[256]},Sz=new q7([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),gX=new i1(0),bz=function(_,$,j,Z,X,G){var q=G.z||_.length,Q=new i1(Z+q+5*(1+Math.ceil(q/7000))+X),K=Q.subarray(Z,Q.length-X),V=G.l,Y=(G.r||0)&7;if($){if(Y)K[0]=G.r>>3;var N=Sz[$-1],F=N>>13,B=N&8191,D=(1<<j)-1,W=G.p||new L_(32768),H=G.h||new L_(D+1),z=Math.ceil(j/3),k=2*z,J=function(p0){return(_[p0]^_[p0+1]<<z^_[p0+2]<<k)&D},L=new q7(25000),x=new L_(288),I=new L_(32),E=0,M=0,O=G.i||0,T=0,y=G.w||0,A=0;for(;O+2<q;++O){var P=J(O),f=O&32767,u=H[P];if(W[f]=u,H[P]=f,y<=O){var c=q-O;if((E>7000||T>24576)&&(c>423||!V)){Y=CX(_,K,0,L,x,I,M,T,A,O-A,Y),T=E=M=0,A=O;for(var r=0;r<286;++r)x[r]=0;for(var r=0;r<30;++r)I[r]=0}var e=2,m=0,_0=B,H0=f-u&32767;if(c>2&&P==J(O-H0)){var X0=Math.min(F,c)-1,j0=Math.min(32767,O),Q0=Math.min(258,c);while(H0<=j0&&--_0&&f!=u){if(_[O+e]==_[O+e-H0]){var F0=0;for(;F0<Q0&&_[O+F0]==_[O+F0-H0];++F0);if(F0>e){if(e=F0,m=H0,F0>X0)break;var h=Math.min(H0,F0-2),$0=0;for(var r=0;r<h;++r){var K0=O-H0+r&32767,L0=W[K0],a=K0-L0&32767;if(a>$0)$0=a,u=K0}}}f=u,u=W[f],H0+=f-u&32767}}if(m){L[T++]=268435456|Z7[e]<<18|IX[m];var G0=Z7[e]&31,O0=IX[m]&31;M+=H2[G0]+O2[O0],++x[257+G0],++I[O0],y=O+e,++E}else L[T++]=_[O],++x[_[O]]}}for(O=Math.max(O,y);O<q;++O)L[T++]=_[O],++x[_[O]];if(Y=CX(_,K,V,L,x,I,M,T,A,O-A,Y),!V)G.r=Y&7|K[Y/8|0]<<3,Y-=7,G.h=H,G.p=W,G.i=O,G.w=y}else{for(var O=G.w||0;O<q+V;O+=65535){var P0=O+65535;if(P0>=q)K[Y/8|0]=V,P0=q;Y=bX(K,Y+1,_.subarray(O,P0))}G.i=q}return e5(Q,0,Z+Q7(Y)+X)};var uX=function(){var _=1,$=0;return{p:function(j){var Z=_,X=$,G=j.length|0;for(var q=0;q!=G;){var Q=Math.min(q+2655,G);for(;q<Q;++q)X+=Z+=j[q];Z=(Z&65535)+15*(Z>>16),X=(X&65535)+15*(X>>16)}_=Z,$=X},d:function(){return _%=65521,$%=65521,(_&255)<<24|(_&65280)<<8|($&255)<<8|$>>8}}},gz=function(_,$,j,Z,X){if(!X){if(X={l:1},$.dictionary){var G=$.dictionary.subarray(-32768),q=new i1(G.length+_.length);q.set(G),q.set(_,G.length),_=q,X.w=G.length}}return bz(_,$.level==null?6:$.level,$.mem==null?X.l?Math.ceil(Math.max(8,Math.min(13,Math.log(_.length)))*1.5):20:12+$.mem,j,Z,X)};var vX=function(_,$,j){for(;j;++$)_[$]=j,j>>>=8};var uz=function(_,$){var j=$.level,Z=j==0?0:j<6?1:j==9?3:2;if(_[0]=120,_[1]=Z<<6|($.dictionary&&32),_[1]|=31-(_[0]<<8|_[1])%31,$.dictionary){var X=uX();X.p($.dictionary),vX(_,2,X.d())}},vz=function(_,$){if((_[0]&15)!=8||_[0]>>4>7||(_[0]<<8|_[1])%31)U_(6,"invalid zlib data");if((_[1]>>5&1)==+!$)U_(6,"invalid zlib data: "+(_[1]&32?"need":"unexpected")+" dictionary");return(_[1]>>3&4)+2};var $7=function(){function _($,j){if(typeof $=="function")j=$,$={};this.ondata=j;var Z=$&&$.dictionary&&$.dictionary.subarray(-32768);if(this.s={i:0,b:Z?Z.length:0},this.o=new i1(32768),this.p=new i1(0),Z)this.o.set(Z)}return _.prototype.e=function($){if(!this.ondata)U_(5);if(this.d)U_(4);if(!this.p.length)this.p=$;else if($.length){var j=new i1(this.p.length+$.length);j.set(this.p),j.set($,this.p.length),this.p=j}},_.prototype.c=function($){this.s.i=+(this.d=$||!1);var j=this.s.b,Z=Rz(this.p,this.s,this.o);this.ondata(e5(Z,j,this.s.b),this.d),this.o=e5(Z,this.s.b-32768),this.s.b=this.o.length,this.p=e5(this.p,this.s.p/8|0),this.s.p&=7},_.prototype.push=function($,j){this.e($),this.c(j)},_}();function mX(_,$){if(!$)$={};var j=uX();j.p(_);var Z=gz(_,$,$.dictionary?6:2,4);return uz(Z,$),vX(Z,Z.length-4,j.d()),Z}var cX=function(){function _($,j){$7.call(this,$,j),this.v=$&&$.dictionary?2:1}return _.prototype.push=function($,j){if($7.prototype.e.call(this,$),this.v){if(this.p.length<6&&!j)return;this.p=this.p.subarray(vz(this.p,this.v-1)),this.v=0}if(j){if(this.p.length<4)U_(6,"invalid zlib data");this.p=this.p.subarray(0,-4)}$7.prototype.c.call(this,j)},_}();var mz=typeof TextDecoder<"u"&&new TextDecoder,cz=0;try{mz.decode(gX,{stream:!0}),cz=1}catch(_){}var hz=[58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7],lz=[40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25],pz=[32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1],rz=[16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25],nz=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],dz=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],oz=[1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],iz=[[[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]],[[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],[3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],[0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],[13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]],[[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],[13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],[13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],[1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]],[[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],[13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],[10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],[3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]],[[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],[14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],[4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],[11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]],[[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],[10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],[9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],[4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]],[[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],[13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],[1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],[6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]],[[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],[1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],[7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],[2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]]],pX=new Uint8Array(256);for(let _=0;_<256;_+=1){let $=0;for(let j=0;j<8;j+=1)$=$<<1|_>>j&1;pX[_]=$}function rX(_){if(_ instanceof Uint8Array)return _;if(_ instanceof ArrayBuffer)return new Uint8Array(_);if(ArrayBuffer.isView(_))return new Uint8Array(_.buffer,_.byteOffset,_.byteLength);return new Uint8Array(0)}function nX(_){let $=0n,j=rX(_);for(let Z of j)$=$<<8n|BigInt(Z);return $}function sz(_,$){let j=new Uint8Array($),Z=BigInt(_);for(let X=$-1;X>=0;X-=1)j[X]=Number(Z&0xffn),Z>>=8n;return j}function Y5(_,$,j){let Z=0n;for(let X of $){let G=BigInt(_)>>BigInt(j-X)&1n;Z=Z<<1n|G}return Z}function hX(_,$){let j=28n,Z=(1n<<j)-1n,X=BigInt($%28);return(_<<X|_>>j-X)&Z}function az(_){let $=Y5(nX(_),nz,64),j=$>>28n&0x0fffffffn,Z=$&0x0fffffffn,X=[];for(let G of oz){j=hX(j,G),Z=hX(Z,G);let q=j<<28n|Z;X.push(Y5(q,dz,56))}return X}function tz(_){let $=0n;for(let j=0;j<8;j+=1){let Z=BigInt((7-j)*6),X=Number(_>>Z&0x3fn),G=(X&32)>>4|X&1,q=X>>1&15;$=$<<4n|BigInt(iz[j][G][q])}return $}function ez(_,$){let j=Y5(_,pz,32)^BigInt($),Z=tz(j);return Y5(Z,rz,32)}function lX(_,$){let j=az($),Z=Y5(nX(_),hz,64),X=Z>>32n&0xffffffffn,G=Z&0xffffffffn;for(let Q of j){let K=G,V=(X^ez(G,Q))&0xffffffffn;X=K,G=V}let q=G<<32n|X;return sz(Y5(q,lz,64),8)}function _W(_){let $=String(_??""),j=new Uint8Array(8);for(let Z=0;Z<8;Z+=1){let X=Z<$.length?$.charCodeAt(Z)&255:0;j[Z]=pX[X]}return j}function dX(_,$){let j=rX($);if(j.byteLength!==16)throw Error(`Invalid VNC auth challenge length ${j.byteLength}; expected 16 bytes.`);let Z=_W(_),X=new Uint8Array(16);return X.set(lX(j.slice(0,8),Z),0),X.set(lX(j.slice(8,16),Z),8),X}var u_="vnc";function $W(_){return Number(_)}function jW(_){let $=Array.isArray(_)?_:typeof _==="string"?_.split(",").map((X)=>X.trim()).filter((X)=>X.length>0):[],j=[],Z=new Set;for(let X of $){let G=$W(X);if(!Number.isFinite(G))continue;let q=Number(G);if(!Z.has(q))j.push(q),Z.add(q)}if(j.length>0)return j;return[5,2,1,0,-223]}function F5(_){if(_ instanceof Uint8Array)return _;if(_ instanceof ArrayBuffer)return new Uint8Array(_);if(ArrayBuffer.isView(_))return new Uint8Array(_.buffer,_.byteOffset,_.byteLength);return new Uint8Array(0)}function ZW(_,$){let j=F5(_),Z=F5($);if(!j.byteLength)return new Uint8Array(Z);if(!Z.byteLength)return new Uint8Array(j);let X=new Uint8Array(j.byteLength+Z.byteLength);return X.set(j,0),X.set(Z,j.byteLength),X}function XW(_){let $=0;for(let X of _||[])$+=X?.byteLength||0;let j=new Uint8Array($),Z=0;for(let X of _||[]){let G=F5(X);j.set(G,Z),Z+=G.byteLength}return j}function GW(){return(_)=>{let $=F5(_);try{let j=[],Z=new cX((X)=>{j.push(new Uint8Array(X))});if(Z.push($,!0),Z.err)throw Error(Z.msg||"zlib decompression error");return XW(j)}catch(j){try{let Z=mX($);return Z instanceof Uint8Array?Z:new Uint8Array(Z)}catch(Z){let X=Z instanceof Error?Z.message:"unexpected EOF";throw Error(`unexpected EOF: ${X}`)}}}}function qW(_){return new TextEncoder().encode(String(_||""))}function N5(_){return new TextDecoder().decode(F5(_))}function QW(_){let $=/^RFB (\d{3})\.(\d{3})\n$/.exec(String(_||""));if(!$)return null;return{major:parseInt($[1],10),minor:parseInt($[2],10),text:$[0]}}function VW(_){if(!_)return`RFB 003.008
`;if(_.major>3||_.minor>=8)return`RFB 003.008
`;if(_.minor>=7)return`RFB 003.007
`;return`RFB 003.003
`}function oX(_,$=0){return{bitsPerPixel:_.getUint8($),depth:_.getUint8($+1),bigEndian:_.getUint8($+2)===1,trueColor:_.getUint8($+3)===1,redMax:_.getUint16($+4,!1),greenMax:_.getUint16($+6,!1),blueMax:_.getUint16($+8,!1),redShift:_.getUint8($+10),greenShift:_.getUint8($+11),blueShift:_.getUint8($+12)}}function KW(_){let $=new ArrayBuffer(20),j=new DataView($);return j.setUint8(0,0),j.setUint8(1,0),j.setUint8(2,0),j.setUint8(3,0),j.setUint8(4,_.bitsPerPixel),j.setUint8(5,_.depth),j.setUint8(6,_.bigEndian?1:0),j.setUint8(7,_.trueColor?1:0),j.setUint16(8,_.redMax,!1),j.setUint16(10,_.greenMax,!1),j.setUint16(12,_.blueMax,!1),j.setUint8(14,_.redShift),j.setUint8(15,_.greenShift),j.setUint8(16,_.blueShift),new Uint8Array($)}function YW(_){let $=Array.isArray(_)?_:[],j=new ArrayBuffer(4+$.length*4),Z=new DataView(j);Z.setUint8(0,2),Z.setUint8(1,0),Z.setUint16(2,$.length,!1);let X=4;for(let G of $)Z.setInt32(X,Number(G||0),!1),X+=4;return new Uint8Array(j)}function iX(_,$,j,Z=0,X=0){let G=new ArrayBuffer(10),q=new DataView(G);return q.setUint8(0,3),q.setUint8(1,_?1:0),q.setUint16(2,Z,!1),q.setUint16(4,X,!1),q.setUint16(6,Math.max(0,$||0),!1),q.setUint16(8,Math.max(0,j||0),!1),new Uint8Array(G)}function B5(_,$){let j=Number($||0);if(j<=0)return 0;if(j===255)return _&255;return Math.max(0,Math.min(255,Math.round((_||0)*255/j)))}function aX(_,$,j,Z){if(j===1)return _[$];if(j===2)return Z?(_[$]<<8|_[$+1])>>>0:(_[$]|_[$+1]<<8)>>>0;if(j===3)return Z?(_[$]<<16|_[$+1]<<8|_[$+2])>>>0:(_[$]|_[$+1]<<8|_[$+2]<<16)>>>0;if(j===4)return Z?(_[$]<<24>>>0|_[$+1]<<16|_[$+2]<<8|_[$+3])>>>0:(_[$]|_[$+1]<<8|_[$+2]<<16|_[$+3]<<24>>>0)>>>0;return 0}function NW(_,$,j,Z){let X=Z||U5,G=F5(_),q=Math.max(1,Math.floor(Number(X.bitsPerPixel||0)/8)),Q=Math.max(0,$||0)*Math.max(0,j||0)*q;if(G.byteLength<Q)throw Error(`Incomplete raw rectangle payload: expected ${Q} byte(s), got ${G.byteLength}`);if(!X.trueColor)throw Error("Indexed-colour VNC framebuffers are not supported yet.");let K=new Uint8ClampedArray(Math.max(0,$||0)*Math.max(0,j||0)*4),V=0,Y=0;for(let N=0;N<Math.max(0,$||0)*Math.max(0,j||0);N+=1){let F=aX(G,V,q,X.bigEndian),B=B5(F>>>X.redShift&X.redMax,X.redMax),D=B5(F>>>X.greenShift&X.greenMax,X.greenMax),W=B5(F>>>X.blueShift&X.blueMax,X.blueMax);K[Y]=B,K[Y+1]=D,K[Y+2]=W,K[Y+3]=255,V+=q,Y+=4}return K}function z$(_,$,j){let Z=j||U5,X=Math.max(1,Math.floor(Number(Z.bitsPerPixel||0)/8));if(_.byteLength<$+X)return null;let G=aX(_,$,X,Z.bigEndian);return{rgba:[B5(G>>>Z.redShift&Z.redMax,Z.redMax),B5(G>>>Z.greenShift&Z.greenMax,Z.greenMax),B5(G>>>Z.blueShift&Z.blueMax,Z.blueMax),255],bytesPerPixel:X}}function r$(_,$,j,Z,X,G,q){if(!q)return;for(let Q=0;Q<G;Q+=1)for(let K=0;K<X;K+=1){let V=((Z+Q)*$+(j+K))*4;_[V]=q[0],_[V+1]=q[1],_[V+2]=q[2],_[V+3]=q[3]}}function tX(_,$,j,Z,X,G,q){for(let Q=0;Q<G;Q+=1){let K=Q*X*4,V=((Z+Q)*$+j)*4;_.set(q.subarray(K,K+X*4),V)}}function sX(_,$){let j=$,Z=1;while(!0){if(_.byteLength<j+1)return null;let X=_[j++];if(Z+=X,X!==255)break}return{consumed:j-$,runLength:Z}}function BW(_,$,j,Z,X,G,q){let Q=X||U5,K=Math.max(1,Math.floor(Number(Q.bitsPerPixel||0)/8));if(_.byteLength<$+4)return null;let V=new DataView(_.buffer,_.byteOffset+$,4).getUint32(0,!1);if(_.byteLength<$+4+V)return null;let Y=_.slice($+4,$+4+V),N;try{N=q(Y)}catch{return{consumed:4+V,skipped:!0}}let F=0,B=new Uint8ClampedArray(Math.max(0,j||0)*Math.max(0,Z||0)*4);for(let D=0;D<Z;D+=64){let W=Math.min(64,Z-D);for(let H=0;H<j;H+=64){let z=Math.min(64,j-H);if(N.byteLength<F+1)return null;let k=N[F++],J=k&127,L=(k&128)!==0;if(!L&&J===0){let x=z*W*K;if(N.byteLength<F+x)return null;let I=G(N.slice(F,F+x),z,W,Q);F+=x,tX(B,j,H,D,z,W,I);continue}if(!L&&J===1){let x=z$(N,F,Q);if(!x)return null;F+=x.bytesPerPixel,r$(B,j,H,D,z,W,x.rgba);continue}if(!L&&J>1&&J<=16){let x=[];for(let O=0;O<J;O+=1){let T=z$(N,F,Q);if(!T)return null;F+=T.bytesPerPixel,x.push(T.rgba)}let I=J<=2?1:J<=4?2:4,E=Math.ceil(z*I/8),M=E*W;if(N.byteLength<F+M)return null;for(let O=0;O<W;O+=1){let T=F+O*E;for(let y=0;y<z;y+=1){let A=y*I,P=T+(A>>3),f=8-I-(A&7),u=N[P]>>f&(1<<I)-1;r$(B,j,H+y,D+O,1,1,x[u])}}F+=M;continue}if(L&&J===0){let x=0,I=0;while(I<W){let E=z$(N,F,Q);if(!E)return null;F+=E.bytesPerPixel;let M=sX(N,F);if(!M)return null;F+=M.consumed;for(let O=0;O<M.runLength;O+=1)if(r$(B,j,H+x,D+I,1,1,E.rgba),x+=1,x>=z){if(x=0,I+=1,I>=W)break}}continue}if(L&&J>0){let x=[];for(let M=0;M<J;M+=1){let O=z$(N,F,Q);if(!O)return null;F+=O.bytesPerPixel,x.push(O.rgba)}let I=0,E=0;while(E<W){if(N.byteLength<F+1)return null;let M=N[F++],O=M,T=1;if(M&128){O=M&127;let A=sX(N,F);if(!A)return null;F+=A.consumed,T=A.runLength}let y=x[O];if(!y)return null;for(let A=0;A<T;A+=1)if(r$(B,j,H+I,D+E,1,1,y),I+=1,I>=z){if(I=0,E+=1,E>=W)break}}continue}return{consumed:4+V,skipped:!0}}}return{consumed:4+V,rgba:B,decompressed:N}}function FW(_,$,j,Z,X){let G=X||U5,q=Math.max(1,Math.floor(Number(G.bitsPerPixel||0)/8));if(_.byteLength<$+4+q)return null;let K=new DataView(_.buffer,_.byteOffset+$,_.byteLength-$).getUint32(0,!1),V=4+q+K*(q+8);if(_.byteLength<$+V)return null;let Y=$+4,N=z$(_,Y,G);if(!N)return null;Y+=N.bytesPerPixel;let F=new Uint8ClampedArray(Math.max(0,j||0)*Math.max(0,Z||0)*4);r$(F,j,0,0,j,Z,N.rgba);for(let B=0;B<K;B+=1){let D=z$(_,Y,G);if(!D)return null;if(Y+=D.bytesPerPixel,_.byteLength<Y+8)return null;let W=new DataView(_.buffer,_.byteOffset+Y,8),H=W.getUint16(0,!1),z=W.getUint16(2,!1),k=W.getUint16(4,!1),J=W.getUint16(6,!1);Y+=8,r$(F,j,H,z,k,J,D.rgba)}return{consumed:Y-$,rgba:F}}function UW(_,$,j,Z,X,G){let q=X||U5,Q=Math.max(1,Math.floor(Number(q.bitsPerPixel||0)/8)),K=new Uint8ClampedArray(Math.max(0,j||0)*Math.max(0,Z||0)*4),V=$,Y=[0,0,0,255],N=[255,255,255,255];for(let F=0;F<Z;F+=16){let B=Math.min(16,Z-F);for(let D=0;D<j;D+=16){let W=Math.min(16,j-D);if(_.byteLength<V+1)return null;let H=_[V++];if(H&1){let z=W*B*Q;if(_.byteLength<V+z)return null;let k=G(_.slice(V,V+z),W,B,q);V+=z,tX(K,j,D,F,W,B,k);continue}if(H&2){let z=z$(_,V,q);if(!z)return null;Y=z.rgba,V+=z.bytesPerPixel}if(r$(K,j,D,F,W,B,Y),H&4){let z=z$(_,V,q);if(!z)return null;N=z.rgba,V+=z.bytesPerPixel}if(H&8){if(_.byteLength<V+1)return null;let z=_[V++];for(let k=0;k<z;k+=1){let J=N;if(H&16){let T=z$(_,V,q);if(!T)return null;J=T.rgba,V+=T.bytesPerPixel}if(_.byteLength<V+2)return null;let L=_[V++],x=_[V++],I=L>>4,E=L&15,M=(x>>4)+1,O=(x&15)+1;r$(K,j,D+I,F+E,M,O,J)}}}}return{consumed:V-$,rgba:K}}var U5={bitsPerPixel:32,depth:24,bigEndian:!1,trueColor:!0,redMax:255,greenMax:255,blueMax:255,redShift:16,greenShift:8,blueShift:0};class L2{protocol=u_;state;framebufferWidth;framebufferHeight;serverName;constructor(_={}){this.shared=_.shared!==!1,this.decodeRawRect=typeof _.decodeRawRect==="function"?_.decodeRawRect:NW,this.pipeline=_.pipeline||null,this.encodings=jW(_.encodings||null),this.state="version",this.buffer=new Uint8Array(0),this.serverVersion=null,this.clientVersionText=null,this.framebufferWidth=0,this.framebufferHeight=0,this.serverName="",this.serverPixelFormat=null,this.clientPixelFormat={...U5},this.password=typeof _.password==="string"&&_.password.length>0?_.password:null,this.inflateZrle=typeof _.inflateZrle==="function"?_.inflateZrle:GW()}receive(_){if(_)this.buffer=ZW(this.buffer,_);let $=[],j=[],Z=!0;while(Z){if(Z=!1,this.state==="version"){if(this.buffer.byteLength<12)break;let X=this.consume(12),G=N5(X),q=QW(G);if(!q)throw Error(`Unsupported RFB version banner: ${G||"<empty>"}`);this.serverVersion=q,this.clientVersionText=VW(q),j.push(qW(this.clientVersionText)),$.push({type:"protocol-version",protocol:u_,server:q.text.trim(),client:this.clientVersionText.trim()}),this.state=q.minor>=7?"security-types":"security-type-33",Z=!0;continue}if(this.state==="security-types"){if(this.buffer.byteLength<1)break;let X=this.buffer[0];if(X===0){if(this.buffer.byteLength<5)break;let K=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(1,!1);if(this.buffer.byteLength<5+K)break;this.consume(1);let V=N5(this.consume(4+K).slice(4));throw Error(V||"VNC server rejected the connection.")}if(this.buffer.byteLength<1+X)break;this.consume(1);let G=Array.from(this.consume(X));$.push({type:"security-types",protocol:u_,types:G});let q=null;if(G.includes(2)&&this.password!==null)q=2;else if(G.includes(1))q=1;else if(G.includes(2))throw Error("VNC password authentication is required. Enter a password and reconnect.");else throw Error(`Unsupported VNC security types: ${G.join(", ")||"none"}. This viewer currently supports only "None" and password-based VNC auth.`);j.push(Uint8Array.of(q)),$.push({type:"security-selected",protocol:u_,securityType:q,label:q===2?"VNC Authentication":"None"}),this.state=q===2?"security-challenge":"security-result",Z=!0;continue}if(this.state==="security-type-33"){if(this.buffer.byteLength<4)break;let G=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(0,!1);if(this.consume(4),G===0){if(this.buffer.byteLength<4)break;let Q=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(0,!1);if(this.buffer.byteLength<4+Q)break;let K=N5(this.consume(4+Q).slice(4));throw Error(K||"VNC server rejected the connection.")}if(G===2){if(this.password===null)throw Error("VNC password authentication is required. Enter a password and reconnect.");$.push({type:"security-selected",protocol:u_,securityType:2,label:"VNC Authentication"}),this.state="security-challenge",Z=!0;continue}if(G!==1)throw Error(`Unsupported VNC security type ${G}. This viewer currently supports only "None" and password-based VNC auth.`);$.push({type:"security-selected",protocol:u_,securityType:1,label:"None"}),j.push(Uint8Array.of(this.shared?1:0)),this.state="server-init",Z=!0;continue}if(this.state==="security-challenge"){if(this.buffer.byteLength<16)break;if(this.password===null)throw Error("VNC password authentication is required. Enter a password and reconnect.");let X=this.consume(16);j.push(dX(this.password,X)),this.state="security-result",Z=!0;continue}if(this.state==="security-result"){if(this.buffer.byteLength<4)break;let G=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(0,!1);if(this.consume(4),G!==0){if(this.buffer.byteLength>=4){let q=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(0,!1);if(this.buffer.byteLength>=4+q){let Q=N5(this.consume(4+q).slice(4));throw Error(Q||"VNC authentication failed.")}}throw Error("VNC authentication failed.")}$.push({type:"security-result",protocol:u_,ok:!0}),j.push(Uint8Array.of(this.shared?1:0)),this.state="server-init",Z=!0;continue}if(this.state==="server-init"){if(this.buffer.byteLength<24)break;let X=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength),G=X.getUint16(0,!1),q=X.getUint16(2,!1),Q=oX(X,4),K=X.getUint32(20,!1);if(this.buffer.byteLength<24+K)break;let V=this.consume(24),Y=new DataView(V.buffer,V.byteOffset,V.byteLength);if(this.framebufferWidth=Y.getUint16(0,!1),this.framebufferHeight=Y.getUint16(2,!1),this.serverPixelFormat=oX(Y,4),this.serverName=N5(this.consume(K)),this.state="connected",this.pipeline)this.pipeline.initFramebuffer(this.framebufferWidth,this.framebufferHeight);j.push(KW(this.clientPixelFormat)),j.push(YW(this.encodings)),j.push(iX(!1,this.framebufferWidth,this.framebufferHeight)),$.push({type:"display-init",protocol:u_,width:G,height:q,name:this.serverName,pixelFormat:Q}),Z=!0;continue}if(this.state==="connected"){if(this.buffer.byteLength<1)break;let X=this.buffer[0];if(X===0){if(this.buffer.byteLength<4)break;let q=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint16(2,!1),Q=4,K=[],V=!1,Y=!!this.pipeline;for(let F=0;F<q;F+=1){if(this.buffer.byteLength<Q+12){V=!0;break}let B=new DataView(this.buffer.buffer,this.buffer.byteOffset+Q,12),D=B.getUint16(0,!1),W=B.getUint16(2,!1),H=B.getUint16(4,!1),z=B.getUint16(6,!1),k=B.getInt32(8,!1);if(Q+=12,k===0){let J=Math.max(1,Math.floor(Number(this.clientPixelFormat.bitsPerPixel||0)/8)),L=H*z*J;if(this.buffer.byteLength<Q+L){V=!0;break}let x=this.buffer.slice(Q,Q+L);if(Q+=L,Y)this.pipeline.processRawRect(x,D,W,H,z,this.clientPixelFormat),K.push({kind:"pipeline",x:D,y:W,width:H,height:z});else K.push({kind:"rgba",x:D,y:W,width:H,height:z,rgba:this.decodeRawRect(x,H,z,this.clientPixelFormat)});continue}if(k===2){let J=FW(this.buffer,Q,H,z,this.clientPixelFormat);if(!J){V=!0;break}if(Y){let L=this.buffer.slice(Q,Q+J.consumed);this.pipeline.processRreRect(L,D,W,H,z,this.clientPixelFormat),K.push({kind:"pipeline",x:D,y:W,width:H,height:z})}else K.push({kind:"rgba",x:D,y:W,width:H,height:z,rgba:J.rgba});Q+=J.consumed;continue}if(k===1){if(this.buffer.byteLength<Q+4){V=!0;break}let J=new DataView(this.buffer.buffer,this.buffer.byteOffset+Q,4),L=J.getUint16(0,!1),x=J.getUint16(2,!1);if(Q+=4,Y)this.pipeline.processCopyRect(D,W,H,z,L,x),K.push({kind:"pipeline",x:D,y:W,width:H,height:z});else K.push({kind:"copy",x:D,y:W,width:H,height:z,srcX:L,srcY:x});continue}if(k===16){let J=BW(this.buffer,Q,H,z,this.clientPixelFormat,this.decodeRawRect,this.inflateZrle);if(!J){V=!0;break}if(Q+=J.consumed,J.skipped)continue;if(Y&&J.decompressed)this.pipeline.processZrleTileData(J.decompressed,D,W,H,z,this.clientPixelFormat),K.push({kind:"pipeline",x:D,y:W,width:H,height:z});else K.push({kind:"rgba",x:D,y:W,width:H,height:z,rgba:J.rgba});continue}if(k===5){let J=UW(this.buffer,Q,H,z,this.clientPixelFormat,this.decodeRawRect);if(!J){V=!0;break}if(Y){let L=this.buffer.slice(Q,Q+J.consumed);this.pipeline.processHextileRect(L,D,W,H,z,this.clientPixelFormat),K.push({kind:"pipeline",x:D,y:W,width:H,height:z})}else K.push({kind:"rgba",x:D,y:W,width:H,height:z,rgba:J.rgba});Q+=J.consumed;continue}if(k===-223){if(this.framebufferWidth=H,this.framebufferHeight=z,Y)this.pipeline.initFramebuffer(H,z);K.push({kind:"resize",x:D,y:W,width:H,height:z});continue}throw Error(`Unsupported VNC rectangle encoding ${k}. This viewer currently supports ZRLE, Hextile, RRE, CopyRect, raw rectangles, and DesktopSize only.`)}if(V)break;this.consume(Q);let N={type:"framebuffer-update",protocol:u_,width:this.framebufferWidth,height:this.framebufferHeight,rects:K};if(Y)N.framebuffer=this.pipeline.getFramebuffer();$.push(N),j.push(iX(!0,this.framebufferWidth,this.framebufferHeight)),Z=!0;continue}if(X===2){this.consume(1),$.push({type:"bell",protocol:u_}),Z=!0;continue}if(X===3){if(this.buffer.byteLength<8)break;let q=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(4,!1);if(this.buffer.byteLength<8+q)break;this.consume(8);let Q=N5(this.consume(q));$.push({type:"clipboard",protocol:u_,text:Q}),Z=!0;continue}throw Error(`Unsupported VNC server message type ${X}.`)}}return{events:$,outgoing:j}}consume(_){let $=this.buffer.slice(0,_);return this.buffer=this.buffer.slice(_),$}}var s_="piclaw://vnc";function $G(_){let $=String(_||"").trim();return $?`${s_}/${encodeURIComponent($)}`:s_}var V7="piclaw:vnc-popout:",DW=60000;function jG(_=globalThis){try{return _?.localStorage??null}catch{return null}}function zW(_=globalThis){let $=nZ(_);if($)return $;return`vnc-popout-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`}function ZG(_,$=Date.now()){if(!_||typeof _.key!=="function"||!Number.isFinite(_.length))return;let j=[];for(let Z=0;Z<Number(_.length||0);Z+=1){let X=_.key(Z);if(X&&X.startsWith(V7))j.push(X)}for(let Z of j)try{let X=_.getItem(Z);if(!X){_.removeItem(Z);continue}let G=JSON.parse(X),q=Number(G?.expiresAt||0);if(!Number.isFinite(q)||q<=$)_.removeItem(Z)}catch{Y2(_,Z)}}function WW(_,$=globalThis,j=Date.now()){let Z=L4(_);if(Z===null)return null;let X=jG($);if(!X)return null;ZG(X,j);let G=zW($);try{return X.setItem(`${V7}${G}`,JSON.stringify({password:Z,expiresAt:j+DW})),G}catch{return null}}function HW(_,$=globalThis,j=Date.now()){let Z=String(_||"").trim();if(!Z)return null;let X=jG($);if(!X)return null;ZG(X,j);let G=`${V7}${Z}`;try{let q=X.getItem(G);if(X.removeItem(G),!q)return null;let Q=JSON.parse(q),K=Number(Q?.expiresAt||0);if(!Number.isFinite(K)||K<=j)return null;return L4(Q?.password)}catch{try{X.removeItem(G)}catch{}return null}}function OW(_,$,j=globalThis){let Z=String(_||"").trim();if(!Z)return null;let X={pane_path:$G(Z)},G=WW($,j);if(G)X.vnc_secret=G;return X}function LW(_){let $=String(_||"");if($===s_)return null;if(!$.startsWith(`${s_}/`))return null;let j=$.slice(`${s_}/`.length).trim();if(!j)return null;try{return decodeURIComponent(j)}catch{return j}}function i_(_){return String(_||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function JW(_=null){let $=_?`/vnc/session?target=${encodeURIComponent(_)}`:"/vnc/session",j=await fetch($,{credentials:"same-origin"}),Z=await j.json().catch(()=>({}));if(!j.ok)throw Error(Z?.error||`HTTP ${j.status}`);return Z}function EW(){if(typeof window>"u")return!1;try{let _=new URLSearchParams(window.location.search).get("pane_popout"),$=String(_||"").trim().toLowerCase();return $==="1"||$==="true"||$==="yes"}catch{return!1}}function AW(_,$=null){let j=window.location.protocol==="https:"?"wss:":"ws:",Z=new URL(`${j}//${window.location.host}/vnc/ws`);if(Z.searchParams.set("target",String(_||"")),$)Z.searchParams.set("handoff",String($));return Z.toString()}function MW(_){return String(_||"").trim()||"localhost"}function kW(_,$){let j=MW(_),Z=Math.floor(Number($||0));if(!Number.isFinite(Z)||Z<=0||Z>65535)return null;return`${j.includes(":")&&!j.startsWith("[")?`[${j}]`:j}:${Z}`}function TW(_={}){let $=Boolean(_?.enabled),j=Boolean(_?.directConnectEnabled);if((Array.isArray(_?.targets)?_.targets.length:Number(_?.targetCount||0))>0)return{title:"",body:""};if(j)return{title:"No saved VNC targets yet.",body:"Connect directly above."};if(!$)return{title:"VNC is not configured yet.",body:"No saved targets are available and direct connect is disabled on this host."};return{title:"No saved VNC targets yet.",body:"This host has no configured VNC targets, and direct connect is disabled."}}function eX(_){if(typeof window>"u")return null;try{let $=new URL(window.location.href),j=$.searchParams.get(_)?.trim()||"";if(!j)return null;return $.searchParams.delete(_),window.history?.replaceState?.(window.history.state,document.title,$.toString()),j}catch{return null}}function _G(_){if(!String(_?.handoffToken||"").trim())return!1;return Number(_?.bytesIn||0)<=0&&!Boolean(_?.hasRenderedFrame)&&Number(_?.reconnectAttempts||0)<=0}function yW(_,$){if(!_||!$||typeof $.appendChild!=="function")return!1;try{$.innerHTML=""}catch{}return $.appendChild(_),!0}class XG{container;root;statusEl;bodyEl;metricsEl;targetSubtitleEl;socketBoundary=null;protocol=null;disposed=!1;targetId=null;targetLabel=null;bytesIn=0;bytesOut=0;canvas=null;canvasCtx=null;displayPlaceholderEl=null;displayInfoEl=null;displayMetaEl=null;displayStageEl=null;chromeEl=null;sessionShellEl=null;resizeObserver=null;displayScale=null;readOnly=!1;pointerButtonMask=0;pointerInputAbortController=null;pressedKeysyms=new Map;passwordInputEl=null;authPassword=null;directHostInputEl=null;directPortInputEl=null;directPasswordInputEl=null;hasRenderedFrame=!1;frameTimeoutId=null;reconnectTimerId=null;reconnectAttempts=0;rawFallbackAttempted=!1;protocolRecovering=!1;pendingHandoffToken=null;constructor(_,$){this.container=_,this.targetId=LW($?.path),this.targetLabel=this.targetId||null,this.pendingHandoffToken=eX("vnc_handoff");let j=eX("vnc_secret"),Z=HW(j);if(Z!==null)this.authPassword=Z;this.root=document.createElement("div"),this.root.className="vnc-pane-shell",this.root.style.cssText="display:flex;flex-direction:column;width:100%;height:100%;background:var(--bg-primary);color:var(--text-primary);",this.targetSubtitleEl=null,this.statusEl=document.createElement("div"),this.statusEl.style.cssText="display:none;",this.statusEl.textContent="",this.bodyEl=document.createElement("div"),this.bodyEl.style.cssText="flex:1;min-height:0;display:flex;align-items:stretch;justify-content:stretch;padding:12px;",this.metricsEl=document.createElement("div"),this.metricsEl.style.cssText="display:none;",this.updateMetrics(),this.root.append(this.statusEl,this.bodyEl),this.container.appendChild(this.root),this.load()}setStatus(_){this.statusEl.textContent=String(_||"")}setSessionChromeVisible(_){if(this.chromeEl)this.chromeEl.style.display=_?"grid":"none";if(this.sessionShellEl?.style)this.sessionShellEl.style.gridTemplateRows=_?"auto minmax(0,1fr)":"1fr";if(this.displayStageEl?.style)this.displayStageEl.style.padding=_?"12px":"0",this.displayStageEl.style.border=_?"1px solid var(--border-color)":"none",this.displayStageEl.style.borderRadius=_?"16px":"0",this.displayStageEl.style.background=_?"#0a0a0a":"#000";if(this.displayPlaceholderEl?.style)this.displayPlaceholderEl.style.display=_&&!this.hasRenderedFrame?"block":"none"}clearReconnectTimer(){if(this.reconnectTimerId)clearTimeout(this.reconnectTimerId),this.reconnectTimerId=null}scheduleReconnect(_=null){if(this.disposed||!this.targetId)return;this.clearReconnectTimer();let $=Math.min(8000,1500+this.reconnectAttempts*1000),j=Number.isFinite(_)?Math.max(0,Number(_)):$;this.reconnectAttempts+=1,this.reconnectTimerId=setTimeout(()=>{if(this.reconnectTimerId=null,this.disposed||!this.targetId)return;this.connectSocket()},j)}updateMetrics(){this.metricsEl.textContent=`Transport bytes — in: ${this.bytesIn} / out: ${this.bytesOut}`}applyMetrics(_){this.bytesIn=Number(_?.bytesIn||0),this.bytesOut=Number(_?.bytesOut||0),this.updateMetrics()}openTargetTab(_,$){if(this.targetId=String(_||"").trim()||null,this.targetLabel=String($||_||"").trim()||this.targetId||"VNC",this.targetId)this.renderTargetSession({direct_connect_enabled:!0,target:{id:this.targetId,label:this.targetLabel,read_only:!1,direct_connect:!0}}),this.setStatus("Connecting…"),this.updateDisplayInfo("Connecting…"),this.updateDisplayMeta("connecting");this.load()}requestPanePopout(_,$){this.container.dispatchEvent(new CustomEvent("pane:popout",{bubbles:!0,detail:{path:_,label:$}}))}resetLiveSession(){this.clearReconnectTimer(),this.reconnectAttempts=0,this.protocol=null;try{this.socketBoundary?.dispose?.()}catch{}this.socketBoundary=null;try{this.resizeObserver?.disconnect?.()}catch{}this.resizeObserver=null;try{this.pointerInputAbortController?.abort?.()}catch{}if(this.pointerInputAbortController=null,this.canvas=null,this.canvasCtx=null,this.displayPlaceholderEl=null,this.displayInfoEl=null,this.displayMetaEl=null,this.displayStageEl=null,this.displayScale=null,this.passwordInputEl=null,this.directHostInputEl=null,this.directPortInputEl=null,this.directPasswordInputEl=null,this.hasRenderedFrame=!1,this.rawFallbackAttempted=!1,this.protocolRecovering=!1,this.frameTimeoutId)clearTimeout(this.frameTimeoutId),this.frameTimeoutId=null;this.pressedKeysyms.clear()}renderTargets(_){this.resetLiveSession();let $=Array.isArray(_?.targets)?_.targets:[],j=Boolean(_?.direct_connect_enabled),Z=TW({enabled:_?.enabled,directConnectEnabled:j,targets:$});this.bodyEl.innerHTML=`
            <div style="width:100%;height:100%;min-height:0;display:grid;align-content:start;justify-items:center;gap:16px;overflow:auto;padding:24px;box-sizing:border-box;">
                ${j?`
                    <div style="width:min(540px,100%);padding:16px 16px 18px;border:1px solid var(--border-color);border-radius:10px;background:transparent;display:grid;gap:12px;box-shadow:none;">
                        <div style="display:grid;gap:6px;">
                            <div style="font-size:18px;font-weight:700;">Connect to VNC</div>
                            <div style="font-size:12px;color:var(--text-secondary);">Enter a server target to start a direct session.</div>
                        </div>
                        <div style="display:grid;gap:10px;align-items:end;">
                            <label style="display:grid;gap:6px;min-width:0;">
                                <span style="font-size:12px;color:var(--text-secondary);">Server</span>
                                <input type="text" data-vnc-direct-host value="localhost" placeholder="localhost" spellcheck="false" style="width:100%;padding:10px 12px;border:1px solid var(--border-color);border-radius:8px;background:transparent;color:inherit;" />
                            </label>
                            <label style="display:grid;gap:6px;min-width:0;">
                                <span style="font-size:12px;color:var(--text-secondary);">Port</span>
                                <input type="number" data-vnc-direct-port min="1" max="65535" step="1" placeholder="5900" style="width:100%;padding:10px 12px;border:1px solid var(--border-color);border-radius:8px;background:transparent;color:inherit;" />
                            </label>
                            <label style="display:grid;gap:6px;min-width:0;">
                                <span style="font-size:12px;color:var(--text-secondary);">Password</span>
                                <input type="password" data-vnc-direct-password placeholder="Optional" autocomplete="current-password" style="width:100%;padding:10px 12px;border:1px solid var(--border-color);border-radius:8px;background:transparent;color:inherit;" />
                            </label>
                            <button type="button" data-direct-open-tab="1" style="padding:10px 12px;border:1px solid var(--border-color);border-radius:8px;background:transparent;cursor:pointer;color:inherit;min-height:40px;font-weight:500;">Connect</button>
                        </div>
                    </div>
                `:""}
                ${$.length?`
                    <div style="width:min(100%,900px);min-height:0;display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));align-content:start;">
                        ${$.map((G)=>`
                            <div style="text-align:left;padding:14px;border:1px solid var(--border-color);border-radius:10px;background:transparent;color:inherit;display:flex;flex-direction:column;gap:10px;">
                                <div>
                                    <div style="font-weight:600;margin-bottom:6px;">${i_(G.label||G.id)}</div>
                                    <div style="font:12px var(--font-family-mono, monospace);color:var(--text-secondary);">${i_(G.id)}</div>
                                    <div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">${G.readOnly?"Read-only target":"Interactive target"}</div>
                                </div>
                                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                                    <button type="button" data-target-open-tab="${i_(G.id)}" data-target-label="${i_(G.label||G.id)}" style="padding:8px 12px;border:1px solid var(--border-color);border-radius:8px;background:transparent;cursor:pointer;color:inherit;">Connect</button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `:`
                    <div style="min-height:0;display:grid;place-items:center;justify-items:center;">
                        <div style="width:min(100%,540px);text-align:center;padding:24px 20px;border:1px dashed var(--border-color);border-radius:10px;background:transparent;font-size:13px;color:var(--text-secondary);line-height:1.5;display:grid;gap:6px;">
                            <div style="font-weight:600;color:var(--text-primary);">${i_(Z.title)}</div>
                            <div>${i_(Z.body)}</div>
                        </div>
                    </div>
                `}
            </div>
        `,this.directHostInputEl=this.bodyEl.querySelector("[data-vnc-direct-host]"),this.directPortInputEl=this.bodyEl.querySelector("[data-vnc-direct-port]"),this.directPasswordInputEl=this.bodyEl.querySelector("[data-vnc-direct-password]");let X=()=>{let G=kW(this.directHostInputEl?.value,this.directPortInputEl?.value);if(!G)return;this.authPassword=L4(this.directPasswordInputEl?this.directPasswordInputEl.value:this.authPassword),this.openTargetTab(G,G)};this.directHostInputEl?.addEventListener("keydown",(G)=>{if(G.key!=="Enter")return;G.preventDefault(),X()}),this.directPortInputEl?.addEventListener("keydown",(G)=>{if(G.key!=="Enter")return;G.preventDefault(),X()}),this.directPasswordInputEl?.addEventListener("keydown",(G)=>{if(G.key!=="Enter")return;G.preventDefault(),X()}),this.bodyEl.querySelector("[data-direct-open-tab]")?.addEventListener("click",()=>X());for(let G of Array.from(this.bodyEl.querySelectorAll("[data-target-open-tab]")))G.addEventListener("click",()=>{let q=G.getAttribute("data-target-open-tab"),Q=G.getAttribute("data-target-label")||q||"VNC";if(!q)return;this.openTargetTab(q,Q)})}renderTargetSession(_){this.resetLiveSession();let $=_?.target||{},j=$?.label||this.targetId||"VNC target",Z=EW();if(this.targetLabel=j,this.readOnly=Boolean($.read_only),this.pointerButtonMask=0,this.hasRenderedFrame=!1,this.pressedKeysyms.clear(),this.bodyEl.innerHTML=Z?`
                <div data-vnc-session-shell style="width:100%;height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:6px;">
                    <div data-vnc-session-chrome style="padding:6px 8px;border:1px solid var(--border-color);border-radius:8px;background:transparent;display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
                        <div data-display-info style="min-width:0;flex:1 1 240px;font-size:12px;color:var(--text-secondary);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Negotiating remote display…</div>
                        <input type="password" data-vnc-password placeholder="Password" autocomplete="current-password" style="width:150px;max-width:100%;padding:6px 8px;border:1px solid var(--border-color);border-radius:6px;background:transparent;color:inherit;" />
                        <button type="button" data-vnc-reconnect="1" style="padding:6px 10px;border:1px solid var(--border-color);border-radius:6px;background:transparent;cursor:pointer;color:inherit;">Reconnect</button>
                    </div>
                    <div data-display-stage style="min-height:0;height:100%;border:1px solid var(--border-color);border-radius:8px;background:#0a0a0a;display:flex;align-items:center;justify-content:center;padding:4px;position:relative;overflow:hidden;">
                        <canvas data-display-canvas tabindex="0" style="display:none;max-width:100%;max-height:100%;width:auto;height:auto;image-rendering:auto;box-shadow:none;border-radius:2px;background:#000;"></canvas>
                        <div data-display-placeholder style="max-width:520px;text-align:center;color:#d7d7d7;line-height:1.5;">
                            <div style="font-weight:600;font-size:14px;margin-bottom:6px;">${i_(j)}</div>
                            <div style="font-size:12px;color:#b7b7b7;">Waiting for the VNC/RFB handshake and first framebuffer update…</div>
                        </div>
                    </div>
                </div>
            `:`
                <div data-vnc-session-shell style="width:100%;height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:12px;">
                    <div data-vnc-session-chrome style="padding:10px 12px;border:1px solid var(--border-color);border-radius:10px;background:transparent;display:grid;gap:10px;">
                        <div style="display:grid;gap:4px;min-width:0;">
                            <div style="font:12px var(--font-family-mono, monospace);color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${i_($.id||this.targetId||"")} · ${$.read_only?"read-only":"interactive"} · websocket → TCP proxy</div>
                            <div data-display-info style="font-size:13px;color:var(--text-primary);line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Negotiating remote display…</div>
                            <div data-display-meta style="font:11px var(--font-family-mono, monospace);color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:end;">
                            <label style="display:grid;gap:4px;min-width:160px;flex:1 1 180px;">
                                <span style="font-size:11px;color:var(--text-secondary);">VNC password</span>
                                <input type="password" data-vnc-password placeholder="Optional" autocomplete="current-password" style="width:100%;padding:8px 10px;border:1px solid var(--border-color);border-radius:8px;background:transparent;color:inherit;" />
                            </label>
                            <button type="button" data-vnc-reconnect="1" style="padding:8px 12px;border:1px solid var(--border-color);border-radius:8px;background:transparent;cursor:pointer;color:inherit;">Reconnect</button>
                            <button type="button" data-open-target-picker="1" style="padding:8px 12px;border:1px solid var(--border-color);border-radius:8px;background:transparent;cursor:pointer;color:inherit;">Target</button>
                        </div>
                    </div>
                    <div data-display-stage style="min-height:0;height:100%;border:1px solid var(--border-color);border-radius:10px;background:#0a0a0a;display:flex;align-items:center;justify-content:center;padding:8px;position:relative;overflow:hidden;">
                        <canvas data-display-canvas tabindex="0" style="display:none;max-width:100%;max-height:100%;width:auto;height:auto;image-rendering:auto;box-shadow:none;border-radius:4px;background:#000;"></canvas>
                        <div data-display-placeholder style="max-width:520px;text-align:center;color:#d7d7d7;line-height:1.6;">
                            <div style="font-weight:700;font-size:18px;margin-bottom:8px;">${i_(j)}</div>
                            <div style="font-size:13px;color:#b7b7b7;">Waiting for the VNC/RFB handshake and first framebuffer update…</div>
                        </div>
                    </div>
                </div>
            `,this.sessionShellEl=this.bodyEl.querySelector("[data-vnc-session-shell]"),this.chromeEl=this.bodyEl.querySelector("[data-vnc-session-chrome]"),this.displayStageEl=this.bodyEl.querySelector("[data-display-stage]"),this.canvas=this.bodyEl.querySelector("[data-display-canvas]"),this.displayPlaceholderEl=this.bodyEl.querySelector("[data-display-placeholder]"),this.displayInfoEl=this.bodyEl.querySelector("[data-display-info]"),this.displayMetaEl=this.bodyEl.querySelector("[data-display-meta]"),this.canvasCtx=this.canvas?.getContext?.("2d",{alpha:!1})||null,this.canvasCtx)this.canvasCtx.imageSmoothingEnabled=!0,this.canvasCtx.imageSmoothingQuality="high";if(this.updateDisplayInfo("Waiting for VNC protocol negotiation…"),this.updateDisplayMeta(),this.setSessionChromeVisible(!0),this.attachDisplayResizeObserver(),this.attachCanvasPointerHandlers(),this.attachCanvasKeyboardHandlers(),this.passwordInputEl=this.bodyEl.querySelector("[data-vnc-password]"),this.passwordInputEl&&this.authPassword!==null)this.passwordInputEl.value=this.authPassword;this.passwordInputEl?.addEventListener("input",()=>{this.authPassword=L4(this.passwordInputEl.value)}),this.passwordInputEl?.addEventListener("keydown",(q)=>{if(q.key!=="Enter")return;q.preventDefault(),this.connectSocket()}),this.bodyEl.querySelector("[data-vnc-reconnect]")?.addEventListener("click",()=>{this.authPassword=L4(this.passwordInputEl?this.passwordInputEl.value:this.authPassword),this.connectSocket()}),this.bodyEl.querySelector("[data-open-target-picker]")?.addEventListener("click",()=>{this.openTargetTab("","VNC")})}updateDisplayInfo(_){if(this.displayInfoEl)this.displayInfoEl.textContent=String(_||"")}updateDisplayMeta(_=""){if(!this.displayMetaEl)return;let $=this.protocol?.state?`state=${this.protocol.state}`:"state=idle",j=this.protocol?.framebufferWidth&&this.protocol?.framebufferHeight?`${this.protocol.framebufferWidth}×${this.protocol.framebufferHeight}`:"pending",Z=this.protocol?.serverName?` · name=${this.protocol.serverName}`:"",X=this.displayScale?` · scale=${Math.round(this.displayScale*100)}%`:"",G=_?` · ${_}`:"";this.displayMetaEl.textContent=`${$} · framebuffer=${j}${Z}${X}${G}`}ensureCanvasSize(_,$,j={}){if(!this.canvas||!this.canvasCtx||!_||!$)return;if(this.canvas.width!==_||this.canvas.height!==$)this.canvas.width=_,this.canvas.height=$;let Z=j?.reveal===!0;if(this.canvas.style.display=Z||this.hasRenderedFrame?"block":"none",this.canvas.style.aspectRatio=`${_} / ${$}`,this.displayPlaceholderEl)this.displayPlaceholderEl.style.display=Z||this.hasRenderedFrame?"none":"";this.updateCanvasScale()}attachDisplayResizeObserver(){if(!this.displayStageEl||typeof ResizeObserver>"u")return;try{this.resizeObserver?.disconnect?.()}catch{}this.resizeObserver=new ResizeObserver(()=>{this.updateCanvasScale()}),this.resizeObserver.observe(this.displayStageEl)}updateCanvasScale(){if(!this.canvas||!this.displayStageEl||!this.canvas.width||!this.canvas.height)return;requestAnimationFrame(()=>{if(!this.canvas||!this.displayStageEl)return;let _=this.displayStageEl.getBoundingClientRect?.(),$=Math.max(1,Math.floor(_?.width||this.displayStageEl.clientWidth||0)-32),j=Math.max(1,Math.floor(_?.height||this.displayStageEl.clientHeight||0)-32);if(!$||!j)return;let Z=wX($,j,this.canvas.width,this.canvas.height);this.displayScale=Z,this.canvas.style.width=`${Math.max(1,Math.round(this.canvas.width*Z))}px`,this.canvas.style.height=`${Math.max(1,Math.round(this.canvas.height*Z))}px`,this.updateDisplayMeta()})}getFramebufferPointFromEvent(_){if(!this.canvas||!this.protocol?.framebufferWidth||!this.protocol?.framebufferHeight)return null;let $=this.canvas.getBoundingClientRect?.();if(!$||!$.width||!$.height)return null;return s3(_.clientX,_.clientY,$,this.protocol.framebufferWidth,this.protocol.framebufferHeight)}sendPointerEvent(_,$,j){if(!this.socketBoundary||!this.protocol||this.protocol.state!=="connected")return;this.socketBoundary.send(W2(_,$,j))}attachCanvasPointerHandlers(){if(!this.canvas||this.readOnly)return;this.canvas.style.cursor="crosshair",this.canvas.style.touchAction="none";try{this.pointerInputAbortController?.abort?.()}catch{}let _=new AbortController;this.pointerInputAbortController=_;let $=_.signal,j=this.canvas.ownerDocument||document,Z=j.defaultView||window,X=new Map,G=new Map,q=new Map,Q=new Map,K=new Set,V=!1,Y=(E)=>this.getFramebufferPointFromEvent(E)||G.get(E?.pointerId)||{x:0,y:0},N=(E)=>{if(!E||!this.canvas||!this.protocol?.framebufferWidth||!this.protocol?.framebufferHeight)return null;let M=this.canvas.getBoundingClientRect?.();if(!M||!M.width||!M.height)return null;return s3(E.clientX,E.clientY,M,this.protocol.framebufferWidth,this.protocol.framebufferHeight)},F=(E)=>{let M=q.get(E);if(M)Z.clearTimeout(M),q.delete(E)},B=(E)=>{let M=Q.get(E);if(M?.holdTimer)Z.clearTimeout(M.holdTimer);Q.delete(E)},D=()=>{for(let E of Q.keys())B(E)},W=()=>{if(!K.size)V=!1},H=(E,M=80)=>{let O=String(E?.pointerType||"").toLowerCase();if(!MX(O))return;let T=Number(E?.pointerId);if(!Number.isFinite(T))return;F(T);let y=Z.setTimeout(()=>{if(q.delete(T),!X.has(T)&&!this.pointerButtonMask)return;k({pointerId:T,pointerType:O,type:"pointercancel",clientX:E?.clientX,clientY:E?.clientY},{resetAll:!0})},M);q.set(T,y)},z=(E=null)=>{if(!X.size&&!this.pointerButtonMask&&!Q.size)return;for(let O of q.keys())F(O);D(),K.clear(),V=!1;let M=E||G.values().next().value||{x:0,y:0};X.clear(),G.clear(),this.pointerButtonMask=0,this.sendPointerEvent(0,M.x,M.y)},k=(E,M={})=>{if(M.resetAll){let P=Number(E?.pointerId);F(P),z(Y(E));try{this.canvas?.releasePointerCapture?.(P)}catch{}return}let O=Y(E),T=Number(E?.pointerId);F(T),B(T),K.delete(T),W();let y=X.has(T),A=X.get(T)??o3(E);if(!y&&!A&&!this.pointerButtonMask)return;if(X.delete(T),G.delete(T),A)this.pointerButtonMask&=~A;else if(!X.size)this.pointerButtonMask=0;this.sendPointerEvent(this.pointerButtonMask,O.x,O.y);try{this.canvas?.releasePointerCapture?.(T)}catch{}},J=(E)=>{if(V)return;let M=Q.get(E);if(!M||M.dragActivated)return;M.dragActivated=!0,M.holdTimer=null;let O=l$(0);if(!O)return;X.set(E,(X.get(E)??0)|O),this.pointerButtonMask|=O,H({pointerId:E,pointerType:"touch",clientX:M.lastClientX,clientY:M.lastClientY}),this.sendPointerEvent(this.pointerButtonMask,M.lastPoint.x,M.lastPoint.y)},L=(E,M,O={})=>{let T=Q.get(E);if(!T)return!1;let y=M||T.lastPoint||{x:0,y:0},A=Number.isFinite(O.clientX)?Number(O.clientX):T.lastClientX,P=Number.isFinite(O.clientY)?Number(O.clientY):T.lastClientY;if(K.delete(E),O.cancelled||V){if(B(E),W(),X.has(E)||this.pointerButtonMask)z(y);return!0}if(T.dragActivated||X.has(E))return k({pointerId:E,pointerType:"touch",type:"pointerup",clientX:A,clientY:P}),W(),!0;let f=Date.now()-T.startedAt,u=AX({startX:T.startClientX,startY:T.startClientY,clientX:A,clientY:P,elapsedMs:f});if(F(E),B(E),G.delete(E),W(),u){let c=l$(0);this.sendPointerEvent(c,y.x,y.y),this.sendPointerEvent(0,y.x,y.y)}else this.sendPointerEvent(this.pointerButtonMask,y.x,y.y);return!0};this.canvas.addEventListener("contextmenu",(E)=>{E.preventDefault()},{signal:$}),this.canvas.addEventListener("pointermove",(E)=>{let M=this.getFramebufferPointFromEvent(E);if(!M)return;let O=String(E?.pointerType||"").toLowerCase(),T=n_(O);if(G.set(E.pointerId,M),T){let y=Q.get(E.pointerId);if(y){if(y.lastClientX=Number(E?.clientX||0),y.lastClientY=Number(E?.clientY||0),y.lastPoint=M,!y.dragActivated&&i3({startX:y.startClientX,startY:y.startClientY,clientX:y.lastClientX,clientY:y.lastClientY}))B(E.pointerId),Q.set(E.pointerId,{...y,holdTimer:null,dragActivated:!1});if(!y.dragActivated){this.sendPointerEvent(this.pointerButtonMask,M.x,M.y);return}}if(V)return}if(X.has(E.pointerId)&&O4(E)){k(E,{resetAll:!0});return}if(this.pointerButtonMask&&!X.has(E.pointerId)&&O4(E)){z(M);return}if(X.has(E.pointerId))H(E);this.sendPointerEvent(this.pointerButtonMask,M.x,M.y)},{signal:$}),this.canvas.addEventListener("pointerdown",(E)=>{let M=this.getFramebufferPointFromEvent(E);if(!M)return;let O=String(E?.pointerType||"").toLowerCase(),T=n_(O);if(E.preventDefault(),this.canvas?.focus?.(),G.set(E.pointerId,M),T){if(K.add(E.pointerId),K.size>1){let P=[...K];V=!0,z(M);for(let f of P)K.add(f);V=!0;return}B(E.pointerId);let A={startClientX:Number(E?.clientX||0),startClientY:Number(E?.clientY||0),lastClientX:Number(E?.clientX||0),lastClientY:Number(E?.clientY||0),startedAt:Date.now(),lastPoint:M,holdTimer:null,dragActivated:!1};A.holdTimer=Z.setTimeout(()=>{J(E.pointerId)},260),Q.set(E.pointerId,A),this.sendPointerEvent(this.pointerButtonMask,M.x,M.y);return}if(O==="mouse")try{this.canvas?.setPointerCapture?.(E.pointerId)}catch{}let y=o3(E);if(!y)return;X.set(E.pointerId,(X.get(E.pointerId)??0)|y),this.pointerButtonMask|=y,H(E),this.sendPointerEvent(this.pointerButtonMask,M.x,M.y)},{signal:$,passive:!1}),this.canvas.addEventListener("pointerup",(E)=>{if(E.preventDefault(),n_(E?.pointerType)){let M=Y(E);if(L(E.pointerId,M,{clientX:E?.clientX,clientY:E?.clientY}))return}k(E)},{signal:$,passive:!1}),this.canvas.addEventListener("pointercancel",(E)=>{if(E.preventDefault(),n_(E?.pointerType)){let M=Y(E);if(L(E.pointerId,M,{clientX:E?.clientX,clientY:E?.clientY,cancelled:!0}))return}k(E,{resetAll:!0})},{signal:$,passive:!1}),this.canvas.addEventListener("pointerleave",(E)=>{if(Q.has(E.pointerId)&&n_(E?.pointerType)){L(E.pointerId,Y(E),{clientX:E?.clientX,clientY:E?.clientY,cancelled:!0});return}if(!X.has(E.pointerId))return;if(!O4(E))return;k(E,{resetAll:!0})},{signal:$}),this.canvas.addEventListener("pointerout",(E)=>{if(Q.has(E.pointerId)&&n_(E?.pointerType)){L(E.pointerId,Y(E),{clientX:E?.clientX,clientY:E?.clientY,cancelled:!0});return}if(!X.has(E.pointerId))return;if(!O4(E))return;k(E,{resetAll:!0})},{signal:$}),this.canvas.addEventListener("lostpointercapture",(E)=>{k(E,{resetAll:!0})},{signal:$}),Z.addEventListener("pointermove",(E)=>{if(!X.size&&!this.pointerButtonMask||!O4(E))return;if(!X.has(E.pointerId)&&!this.pointerButtonMask)return;k(E,{resetAll:!0})},{signal:$}),Z.addEventListener("pointerup",(E)=>{if(!X.has(E.pointerId)&&!this.pointerButtonMask&&!Q.has(E.pointerId))return;if(E.preventDefault?.(),n_(E?.pointerType)){let M=Y(E);if(L(E.pointerId,M,{clientX:E?.clientX,clientY:E?.clientY}))return}k(E,{resetAll:!X.has(E.pointerId)})},{signal:$,passive:!1}),Z.addEventListener("pointercancel",(E)=>{if(!X.has(E.pointerId)&&!this.pointerButtonMask&&!Q.has(E.pointerId))return;if(E.preventDefault?.(),n_(E?.pointerType)){let M=Y(E);if(L(E.pointerId,M,{clientX:E?.clientX,clientY:E?.clientY,cancelled:!0}))return}k(E,{resetAll:!0})},{signal:$,passive:!1});let x=(E)=>{if(!X.size&&!this.pointerButtonMask&&!Q.size)return;if(!EX(E))return;let M=E?.changedTouches?.[0]||E?.touches?.[0]||null,O=N(M)||G.values().next().value||Q.values().next().value?.lastPoint||{x:0,y:0};if(!X.size&&!this.pointerButtonMask&&Q.size===1){let[T]=Q.entries().next().value||[];if(Number.isFinite(T)){L(T,O,{clientX:M?.clientX,clientY:M?.clientY,cancelled:E?.type==="touchcancel"});return}}z(O)},I=(E,M={})=>{if(!X.size&&!this.pointerButtonMask&&!Q.has(E?.pointerId))return;if(!O4(E))return;if(E?.preventDefault?.(),n_(E?.pointerType)){let O=Y(E);if(L(E.pointerId,O,{clientX:E?.clientX,clientY:E?.clientY,cancelled:M.resetAll===!0}))return}k(E,{resetAll:M.resetAll===!0||!X.has(E?.pointerId)})};this.canvas.addEventListener("touchend",x,{signal:$,passive:!0,capture:!0}),this.canvas.addEventListener("touchcancel",x,{signal:$,passive:!0,capture:!0}),j.addEventListener("touchend",x,{signal:$,passive:!0,capture:!0}),j.addEventListener("touchcancel",x,{signal:$,passive:!0,capture:!0}),Z.addEventListener("touchend",x,{signal:$,passive:!0,capture:!0}),Z.addEventListener("touchcancel",x,{signal:$,passive:!0,capture:!0}),j.addEventListener("pointerup",(E)=>{I(E)},{signal:$,passive:!1,capture:!0}),j.addEventListener("pointercancel",(E)=>{I(E,{resetAll:!0})},{signal:$,passive:!1,capture:!0}),Z.addEventListener("mouseup",()=>{if(!X.size&&!this.pointerButtonMask&&!Q.size)return;z()},{signal:$}),Z.addEventListener("blur",()=>{if(!X.size&&!this.pointerButtonMask&&!Q.size)return;z()},{signal:$}),j.addEventListener("visibilitychange",()=>{if(j.visibilityState==="hidden")z()},{signal:$}),this.canvas.addEventListener("wheel",(E)=>{let M=this.getFramebufferPointFromEvent(E);if(!M)return;E.preventDefault();for(let O of kX(E.deltaY,M.x,M.y,this.pointerButtonMask))this.socketBoundary?.send?.(O)},{signal:$,passive:!1})}sendKeyEvent(_,$){if(!this.socketBoundary||!this.protocol||this.protocol.state!=="connected")return;this.socketBoundary.send(TX(_,$))}releasePressedKeys(){for(let _ of this.pressedKeysyms.values())this.sendKeyEvent(!1,_);this.pressedKeysyms.clear()}attachCanvasKeyboardHandlers(){if(!this.canvas||this.readOnly)return;this.canvas.addEventListener("keydown",(_)=>{let $=a3(_);if($==null)return;let j=_.code||_.key,Z=this.pressedKeysyms.get(j);if(yX(Z,$,_.repeat)){_.preventDefault();return}_.preventDefault(),this.pressedKeysyms.set(j,$),this.sendKeyEvent(!0,$)}),this.canvas.addEventListener("keyup",(_)=>{let $=_.code||_.key,j=this.pressedKeysyms.get($)??a3(_);if(j==null)return;_.preventDefault(),this.pressedKeysyms.delete($),this.sendKeyEvent(!1,j)}),this.canvas.addEventListener("blur",()=>{this.releasePressedKeys()})}drawRgbaRect(_){if(!this.canvasCtx||!this.canvas)return;this.ensureCanvasSize(this.canvas.width||_.width,this.canvas.height||_.height,{reveal:!0});let $=new ImageData(_.rgba,_.width,_.height);this.canvasCtx.putImageData($,_.x,_.y),this.hasRenderedFrame=!0}copyCanvasRect(_){if(!this.canvasCtx||!this.canvas)return;this.ensureCanvasSize(this.canvas.width||_.width,this.canvas.height||_.height,{reveal:!0});let $=this.canvasCtx.getImageData(_.srcX,_.srcY,_.width,_.height);this.canvasCtx.putImageData($,_.x,_.y),this.hasRenderedFrame=!0}scheduleRawFallbackTimeout(){if(this.frameTimeoutId)clearTimeout(this.frameTimeoutId),this.frameTimeoutId=null;if(this.rawFallbackAttempted||this.protocolRecovering)return;this.frameTimeoutId=setTimeout(()=>{if(this.hasRenderedFrame||this.rawFallbackAttempted||this.protocolRecovering)return;if(this.protocol&&this.socketBoundary)this.rawFallbackAttempted=!0,this.protocolRecovering=!0,this.setStatus("No framebuffer update yet; retrying with RAW encoding."),this.updateDisplayInfo("No framebuffer update yet. Retrying with RAW encoding."),this.updateDisplayMeta("reconnect-encoding-fallback"),this.connectWithEncodings("0")},2200)}applyRemoteDisplayEvent(_){if(!_)return;switch(_.type){case"protocol-version":this.setStatus(`Negotiated ${_.protocol.toUpperCase()} ${_.server} → ${_.client}.`),this.updateDisplayInfo(`Negotiated ${_.server} → ${_.client}.`),this.updateDisplayMeta();return;case"security-types":this.setStatus(`Server offered security types: ${_.types.join(", ")||"none"}.`),this.updateDisplayInfo(`Security types: ${_.types.join(", ")||"none"}.`),this.updateDisplayMeta();return;case"security-selected":this.setStatus(`Using ${_.protocol.toUpperCase()} security type ${_.label}.`),this.updateDisplayInfo(`Security: ${_.label}.`),this.updateDisplayMeta();return;case"security-result":this.setStatus("Security negotiation complete. Waiting for server init…"),this.updateDisplayInfo("Security negotiation complete. Waiting for server init…"),this.updateDisplayMeta();return;case"display-init":this.ensureCanvasSize(_.width,_.height),this.setSessionChromeVisible(!1),this.setStatus(`Connected to ${this.targetLabel||this.targetId||"target"} — waiting for first framebuffer update (${_.width}×${_.height}).`),this.updateDisplayInfo(`Connected to ${_.name||this.targetLabel||this.targetId||"remote display"}. Waiting for first framebuffer update…`),this.updateDisplayMeta("awaiting-frame"),this.scheduleRawFallbackTimeout();return;case"framebuffer-update":if(this.frameTimeoutId)clearTimeout(this.frameTimeoutId),this.frameTimeoutId=null;let $=!1,j=(_.rects||[]).some((Z)=>Z.kind==="pipeline");if(_.framebuffer&&_.framebuffer.length>0&&_.width>0&&_.height>0&&j){this.ensureCanvasSize(_.width,_.height,{reveal:!0});for(let X of _.rects||[])if(X.kind==="resize")this.ensureCanvasSize(X.width,X.height);let Z=this.canvas?.getContext("2d",{alpha:!1});if(Z){let X=new ImageData(new Uint8ClampedArray(_.framebuffer),_.width,_.height);Z.putImageData(X,0,0),$=!0}}else for(let Z of _.rects||[]){if(Z.kind==="resize"){this.ensureCanvasSize(Z.width,Z.height);continue}if(Z.kind==="copy"){this.ensureCanvasSize(_.width,_.height,{reveal:!0}),this.copyCanvasRect(Z),$=!0;continue}if(Z.kind==="rgba")this.ensureCanvasSize(_.width,_.height,{reveal:!0}),this.drawRgbaRect(Z),$=!0}if($||this.hasRenderedFrame)this.protocolRecovering=!1,this.setStatus(`Rendering live framebuffer — ${_.width}×${_.height}.`),this.updateDisplayInfo(`Framebuffer update applied (${(_.rects||[]).length} rect${(_.rects||[]).length===1?"":"s"}).`),this.updateDisplayMeta();else this.setStatus(`Connected to ${this.targetLabel||this.targetId||"target"} — waiting for painted framebuffer data.`),this.updateDisplayInfo(`Framebuffer update received, but no paintable rects yet (${(_.rects||[]).length} rect${(_.rects||[]).length===1?"":"s"}).`),this.updateDisplayMeta("awaiting-frame"),this.scheduleRawFallbackTimeout();return;case"clipboard":this.setStatus("Remote clipboard updated."),this.updateDisplayInfo(`Clipboard text received (${_.text.length} chars).`),this.updateDisplayMeta();return;case"bell":this.setStatus("Remote display bell received."),this.updateDisplayInfo("Remote display bell received."),this.updateDisplayMeta();return}}async handleSocketMessage(_){if(_?.kind==="control"){let j=_.payload;if(j?.type==="vnc.error"){this.setStatus(`Proxy error: ${j.error||"Unknown error"}`),this.updateDisplayInfo(`Proxy error: ${j.error||"Unknown error"}`),this.updateDisplayMeta("proxy-error");return}if(j?.type==="vnc.connected"){let Z=j?.target?.label||this.targetLabel||this.targetId;this.setStatus(`Connected to ${Z}. Waiting for VNC/RFB data…`),this.updateDisplayInfo(`Connected to ${Z}. Waiting for VNC handshake…`),this.updateDisplayMeta();return}if(j?.type==="pong")return;return}let $=this.protocol||(this.protocol=new L2);try{let j=_.data instanceof Blob?await _.data.arrayBuffer():_.data,Z=$.receive(j);for(let X of Z.outgoing||[])this.socketBoundary?.send?.(X);for(let X of Z.events||[])this.applyRemoteDisplayEvent(X)}catch(j){let Z=j?.message||"Unknown error";if(this.setSessionChromeVisible(!0),this.setStatus(`Display protocol error: ${Z}`),this.updateDisplayInfo(`Display protocol error: ${Z}`),this.updateDisplayMeta("protocol-error"),this.frameTimeoutId)clearTimeout(this.frameTimeoutId),this.frameTimeoutId=null;if(!this.rawFallbackAttempted&&!this.protocolRecovering&&/unexpected eof|zlib|decompress|protocol|buffer|undefined|not an object|reading '0'/i.test(Z))this.rawFallbackAttempted=!0,this.protocolRecovering=!0,this.connectWithEncodings("0")}}async connectSocket(_=null){if(!this.targetId||this.disposed)return;if(this.clearReconnectTimer(),this.protocolRecovering&&_==null)this.protocolRecovering=!1;try{this.socketBoundary?.dispose?.()}catch{}if(_==null)this.rawFallbackAttempted=!1,this.protocolRecovering=!1;let $=this.pendingHandoffToken||null,j=_==null?null:String(_).trim(),Z=await JX(),X={};if(Z)X.pipeline=Z,X.decodeRawRect=(Q,K,V,Y)=>Z.decodeRawRectToRgba(Q,K,V,Y);let G=L4(this.authPassword);if(G!==null)X.password=G;if(j)X.encodings=j;let q=Boolean(this.canvas&&this.hasRenderedFrame);if(this.protocol=new L2(X),this.hasRenderedFrame=q,this.frameTimeoutId=null,this.canvas)this.canvas.style.display=q?"block":"none";if(this.displayPlaceholderEl)this.displayPlaceholderEl.style.display=q?"none":"";this.socketBoundary=new p3({url:AW(this.targetId,$),binaryType:"arraybuffer",onOpen:()=>{if($&&this.pendingHandoffToken===$)this.pendingHandoffToken=null;this.reconnectAttempts=0,this.setStatus(`Connected to proxy for ${this.targetId}. Waiting for VNC/RFB data…`),this.updateDisplayInfo("WebSocket proxy connected. Waiting for handshake…"),this.updateDisplayMeta(),this.socketBoundary?.sendControl?.({type:"ping"})},onMetrics:(Q)=>{this.applyMetrics(Q)},onMessage:(Q)=>{this.handleSocketMessage(Q)},onClose:()=>{if(this.setSessionChromeVisible(!0),this.frameTimeoutId)clearTimeout(this.frameTimeoutId),this.frameTimeoutId=null;if(this.disposed)return;if(_G({handoffToken:$,bytesIn:this.bytesIn,hasRenderedFrame:this.hasRenderedFrame,reconnectAttempts:this.reconnectAttempts})){this.pendingHandoffToken=null,this.setStatus("Transferred VNC session was not ready yet. Retrying…"),this.updateDisplayInfo("Transferred VNC session was not ready yet. Retrying without handoff…"),this.updateDisplayMeta("handoff-retrying"),this.scheduleReconnect(150);return}if(this.bytesIn>0||this.hasRenderedFrame||this.reconnectAttempts>0){this.setStatus("Remote display connection lost. Reconnecting…"),this.updateDisplayInfo("Remote display transport closed. Attempting to reconnect…"),this.updateDisplayMeta("reconnecting"),this.scheduleReconnect();return}this.setStatus(this.bytesIn>0?`Proxy closed after receiving ${this.bytesIn} byte(s).`:"Proxy closed."),this.updateDisplayInfo(this.bytesIn>0?"Remote display transport closed after receiving data.":"Remote display transport closed."),this.updateDisplayMeta("closed")},onError:()=>{if(this.setSessionChromeVisible(!0),_G({handoffToken:$,bytesIn:this.bytesIn,hasRenderedFrame:this.hasRenderedFrame,reconnectAttempts:this.reconnectAttempts})){this.pendingHandoffToken=null,this.setStatus("Transferred VNC session was not ready yet. Retrying…"),this.updateDisplayInfo("Transferred VNC session was not ready yet. Retrying without handoff…"),this.updateDisplayMeta("handoff-retrying"),this.scheduleReconnect(150);return}if(this.bytesIn>0||this.hasRenderedFrame||this.reconnectAttempts>0){this.setStatus("WebSocket proxy connection failed. Reconnecting…"),this.updateDisplayInfo("WebSocket proxy connection failed. Attempting to reconnect…"),this.updateDisplayMeta("socket-reconnecting"),this.scheduleReconnect();return}this.setStatus("WebSocket proxy connection failed."),this.updateDisplayInfo("WebSocket proxy connection failed."),this.updateDisplayMeta("socket-error")}}),this.socketBoundary.connect()}connectWithEncodings(_){return this.connectSocket(_)}async load(){this.setStatus("");try{let _=await JW(this.targetId);if(!_?.enabled){this.renderTargets(_),this.setStatus("");return}if(!this.targetId){this.renderTargets(_),this.setStatus("");return}this.renderTargetSession(_),await this.connectSocket()}catch(_){this.resetLiveSession(),this.bodyEl.innerHTML=`
                <div style="max-width:620px;text-align:center;padding:28px;border:1px dashed var(--border-color);border-radius:14px;background:var(--bg-secondary);">
                    <div style="font-size:32px;margin-bottom:10px;">⚠️</div>
                    <div style="font-weight:600;margin-bottom:6px;">Failed to load VNC session</div>
                    <div style="color:var(--text-secondary);font-size:13px;line-height:1.5;">${i_(_?.message||"Unknown error")}</div>
                </div>
            `,this.setStatus(`Session load failed: ${_?.message||"Unknown error"}`)}}beforeDetachFromHost(){this.releasePressedKeys(),this.setStatus("Moving VNC session…"),this.updateDisplayInfo("Moving VNC session to a new window…"),this.updateDisplayMeta("moving")}afterAttachToHost(){this.attachDisplayResizeObserver(),this.updateCanvasScale(),requestAnimationFrame(()=>this.focus())}moveHost(_){if(this.disposed||!this.root)return!1;if(this.releasePressedKeys(),this.container=_,!yW(this.root,_))return!1;return this.afterAttachToHost(),!0}async preparePopoutTransfer(){return OW(this.targetId,this.authPassword)}getContent(){return}isDirty(){return!1}focus(){this.canvas?.focus?.(),this.root?.focus?.()}resize(){this.updateCanvasScale()}dispose(){if(this.disposed)return;this.disposed=!0,this.resetLiveSession(),this.root?.remove?.()}}var K7={id:"vnc-viewer",label:"VNC",icon:"display",capabilities:["preview"],placement:"tabs",canHandle(_){let $=String(_?.path||"");return $===s_||$.startsWith(`${s_}/`)?9000:!1},mount(_,$){return new XG(_,$)}};import{classHighlighter as PG,highlightTree as fG,StreamLanguage as v0,cssLanguage as wW,cppLanguage as IW,goLanguage as xW,htmlLanguage as CW,javascriptLanguage as PW,jsxLanguage as fW,tsxLanguage as RW,typescriptLanguage as SW,jsonLanguage as bW,markdownLanguage as gW,pythonLanguage as uW,rustLanguage as vW,StandardSQL as mW,xmlLanguage as cW,yamlLanguage as hW,dockerFile as lW,powerShell as pW,ruby as rW,shell as nW,swift as dW,toml as oW,clojure as iW,cmake as sW,coffeeScript as aW,crystal as tW,cypher as eW,d as _H,diff as $H,eiffel as jH,elm as ZH,erlang as XH,factor as GH,forth as qH,fortran as QH,gas as VH,gherkin as KH,groovy as YH,haskell as NH,haxe as BH,http as FH,jinja2 as UH,julia as DH,liveScript as zH,lua as WH,mathematica as HH,fSharp as OH,nginx as LH,octave as JH,oz as EH,pascal as AH,perl as MH,properties as kH,protobuf as TH,pug as yH,puppet as wH,r as IH,sas as xH,sass as CH,scheme as PH,smalltalk as fH,solr as RH,sparql as SH,stex as bH,stylus as gH,tcl as uH,textile as vH,turtle as mH,vb as cH,verilog as hH,vhdl as lH,wast as pH,webIDL as rH,xQuery as nH}from"#editor-vendor/codemirror";var RG=98304;function G_(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}var dH={js:"JavaScript",javascript:"JavaScript",ts:"TypeScript",typescript:"TypeScript",jsx:"JSX",tsx:"TSX",py:"Python",python:"Python",sh:"Shell",shell:"Shell",bash:"Bash",zsh:"Zsh",ps1:"PowerShell",powershell:"PowerShell",md:"Markdown",markdown:"Markdown",yml:"YAML",yaml:"YAML",json:"JSON",html:"HTML",css:"CSS",sql:"SQL",go:"Go",c:"C",cc:"C++",cpp:"C++","c++":"C++",cxx:"C++",h:"C/C++",hh:"C++",hpp:"C++",hxx:"C++",rust:"Rust",rs:"Rust",ruby:"Ruby",swift:"Swift",toml:"TOML",dockerfile:"Dockerfile",asm:"Gas",clj:"Clojure",clojure:"Clojure",cmake:"CMake",coffee:"CoffeeScript",coffeescript:"CoffeeScript",conf:"nginx",cr:"Crystal",crystal:"Crystal",cypher:"Cypher",d:"D",diff:"Diff",eiffel:"Eiffel",elm:"Elm",erl:"Erlang",erlang:"Erlang",f90:"Fortran",f95:"Fortran",factor:"Factor",feature:"Gherkin",forth:"Forth",fortran:"Fortran",fsharp:"ML",gas:"Gas",gherkin:"Gherkin",groovy:"Groovy",haskell:"Haskell",haxe:"Haxe",hs:"Haskell",http:"HTTP",hx:"Haxe",ini:"Properties",jade:"Pug",jinja:"Jinja2",jinja2:"Jinja2",jl:"Julia",julia:"Julia",latex:"LaTeX",livescript:"LiveScript",ls:"LiveScript",lua:"Lua",mathematica:"Mathematica",matlab:"Octave",ml:"ML",nginx:"nginx",ocaml:"ML",octave:"Octave",oz:"Oz",pas:"Pascal",pascal:"Pascal",patch:"Diff",perl:"Perl",pl:"Perl",pm:"Perl",pp:"Puppet",properties:"Properties",proto:"Protobuf",protobuf:"Protobuf",pug:"Pug",puppet:"Puppet",r:"R",rq:"SPARQL",s:"Gas",sas:"SAS",sass:"Sass",scheme:"Scheme",scm:"Scheme",scss:"Sass",smalltalk:"Smalltalk",sml:"ML",sparql:"SPARQL",st:"Smalltalk",styl:"Stylus",stylus:"Stylus",sv:"Verilog",tcl:"Tcl",tex:"LaTeX",textile:"Textile",ttl:"Turtle",turtle:"Turtle",vb:"VB",verilog:"Verilog",vhdl:"VHDL",wasm:"WebAssembly",wast:"WebAssembly",webidl:"WebIDL",wl:"Mathematica",xq:"XQuery",xquery:"XQuery"},oH=v0.define(nW).parser,iH=v0.define(pW).parser,sH=v0.define(lW).parser,aH=v0.define(rW).parser,tH=v0.define(dW).parser,eH=v0.define(oW).parser,GG=v0.define(iW).parser,_O=v0.define(sW).parser,qG=v0.define(aW).parser,QG=v0.define(tW).parser,$O=v0.define(eW).parser,jO=v0.define(_H).parser,VG=v0.define($H).parser,ZO=v0.define(jH).parser,XO=v0.define(ZH).parser,KG=v0.define(XH).parser,GO=v0.define(GH).parser,qO=v0.define(qH).parser,Y7=v0.define(QH).parser,N7=v0.define(VH).parser,YG=v0.define(KH).parser,QO=v0.define(YH).parser,NG=v0.define(NH).parser,BG=v0.define(BH).parser,VO=v0.define(FH).parser,FG=v0.define(UH).parser,UG=v0.define(DH).parser,DG=v0.define(zH).parser,KO=v0.define(WH).parser,zG=v0.define(HH).parser,$6=v0.define(OH).parser,YO=v0.define(LH).parser,WG=v0.define(JH).parser,NO=v0.define(EH).parser,HG=v0.define(AH).parser,B7=v0.define(MH).parser,OG=v0.define(kH).parser,LG=v0.define(TH).parser,JG=v0.define(yH).parser,EG=v0.define(wH).parser,BO=v0.define(IH).parser,FO=v0.define(xH).parser,AG=v0.define(CH).parser,MG=v0.define(PH).parser,kG=v0.define(fH).parser,UO=v0.define(RH).parser,TG=v0.define(SH).parser,F7=v0.define(bH).parser,yG=v0.define(gH).parser,DO=v0.define(uH).parser,zO=v0.define(vH).parser,wG=v0.define(mH).parser,WO=v0.define(cH).parser,IG=v0.define(hH).parser,HO=v0.define(lH).parser,xG=v0.define(pH).parser,OO=v0.define(rH).parser,CG=v0.define(nH).parser;function J2(_){let $=String(_||"").trim().toLowerCase();if(!$)return"text";return dH[$]||String(_||"").trim()}function E2(_){switch(String(_||"").trim().toLowerCase()){case"js":case"javascript":return PW.parser;case"ts":case"typescript":return SW.parser;case"jsx":return fW.parser;case"tsx":return RW.parser;case"py":case"python":return uW.parser;case"json":return bW.parser;case"css":return wW.parser;case"html":return CW.parser;case"xml":return cW.parser;case"yaml":case"yml":return hW.parser;case"md":case"markdown":return gW.parser;case"sql":return mW.language.parser;case"go":return xW.parser;case"c":case"cc":case"cpp":case"cxx":case"c++":case"h":case"hh":case"hpp":case"hxx":return IW.parser;case"sh":case"bash":case"shell":case"zsh":return oH;case"ps1":case"powershell":return iH;case"dockerfile":return sH;case"rb":case"ruby":return aH;case"rs":case"rust":return vW.parser;case"swift":return tH;case"toml":return eH;case"asm":return N7;case"clj":return GG;case"clojure":return GG;case"cmake":return _O;case"coffee":return qG;case"coffeescript":return qG;case"cr":return QG;case"crystal":return QG;case"cypher":return $O;case"d":return jO;case"diff":return VG;case"eiffel":return ZO;case"elm":return XO;case"erl":return KG;case"erlang":return KG;case"f90":return Y7;case"f95":return Y7;case"factor":return GO;case"feature":return YG;case"forth":return qO;case"fortran":return Y7;case"fsharp":return $6;case"gas":return N7;case"gherkin":return YG;case"groovy":return QO;case"haskell":return NG;case"haxe":return BG;case"hs":return NG;case"http":return VO;case"hx":return BG;case"ini":return OG;case"jade":return JG;case"jinja":return FG;case"jinja2":return FG;case"jl":return UG;case"julia":return UG;case"latex":return F7;case"livescript":return DG;case"ls":return DG;case"lua":return KO;case"mathematica":return zG;case"matlab":return WG;case"ml":return $6;case"mllike":return $6;case"nginx":return YO;case"ocaml":return $6;case"octave":return WG;case"oz":return NO;case"pas":return HG;case"pascal":return HG;case"patch":return VG;case"perl":return B7;case"pl":return B7;case"pm":return B7;case"pp":return EG;case"properties":return OG;case"proto":return LG;case"protobuf":return LG;case"pug":return JG;case"puppet":return EG;case"r":return BO;case"rq":return TG;case"s":return N7;case"sas":return FO;case"sass":return AG;case"scheme":return MG;case"scm":return MG;case"scss":return AG;case"smalltalk":return kG;case"sml":return $6;case"solr":return UO;case"sparql":return TG;case"st":return kG;case"stex":return F7;case"styl":return yG;case"stylus":return yG;case"sv":return IG;case"tcl":return DO;case"tex":return F7;case"textile":return zO;case"ttl":return wG;case"turtle":return wG;case"vb":return WO;case"verilog":return IG;case"vhdl":return HO;case"wasm":return xG;case"wast":return xG;case"webidl":return OO;case"wl":return zG;case"xq":return CG;case"xquery":return CG;default:return null}}function A2(_,$){if(String(_||"").length>RG)return G_(_);let j=E2($);if(!j)return G_(_);let Z=[];try{let q=j.parse(_);fG(q,PG,(Q,K,V)=>{if(!V||Q>=K)return;Z.push({from:Q,to:K,cls:V})})}catch{return G_(_)}if(!Z.length)return G_(_);Z.sort((q,Q)=>q.from-Q.from||q.to-Q.to);let X=0,G="";for(let q of Z){if(q.from>X)G+=G_(_.slice(X,q.from));G+=`<span class="${G_(q.cls)}">${G_(_.slice(q.from,q.to))}</span>`,X=Math.max(X,q.to)}if(X<_.length)G+=G_(_.slice(X));return G}function SG(_,$){let j=String(_||"").split(`
`);if(!_)return j;if(String(_||"").length>RG)return j.map((V)=>G_(V)||"&nbsp;");let Z=E2($);if(!Z)return j.map((V)=>G_(V));let X=[];try{let V=Z.parse(_);fG(V,PG,(Y,N,F)=>{if(!F||Y>=N)return;X.push({from:Y,to:N,cls:F})})}catch{return j.map((V)=>G_(V))}if(!X.length)return j.map((V)=>G_(V));X.sort((V,Y)=>V.from-Y.from||V.to-Y.to);let G=[],q=0;for(let V of j)G.push(q),q+=V.length+1;let Q=[],K=0;for(let V=0;V<j.length;V+=1){let Y=G[V],N=Y+j[V].length,F="",B=Y;while(K<X.length&&X[K].to<=Y)K+=1;for(let D=K;D<X.length;D+=1){let W=X[D];if(W.from>=N)break;let H=Math.max(Y,W.from),z=Math.min(N,W.to);if(H>B)F+=G_(_.slice(B,H));if(z>H)F+=`<span class="${G_(W.cls)}">${G_(_.slice(H,z))}</span>`;B=Math.max(B,z)}if(B<N)F+=G_(_.slice(B,N));Q.push(F||"&nbsp;")}return Q}function j6(_){let $=(_.match(/\.([^.]+)$/)||[])[1]?.toLowerCase()||"",j={ts:"typescript",tsx:"tsx",js:"javascript",jsx:"jsx",mjs:"javascript",cjs:"javascript",py:"python",rb:"ruby",rs:"rust",go:"go",java:"java",c:"c",h:"c",cc:"cpp",cpp:"cpp",cxx:"cpp",hpp:"cpp",hxx:"cpp",cs:"csharp",swift:"swift",kt:"kotlin",sh:"shell",bash:"bash",zsh:"zsh",fish:"shell",ps1:"powershell",psm1:"powershell",json:"json",yaml:"yaml",yml:"yaml",toml:"toml",xml:"xml",html:"html",htm:"html",css:"css",scss:"sass",sass:"sass",sql:"sql",graphql:"graphql",gql:"graphql",dockerfile:"dockerfile",makefile:"makefile",lua:"lua",perl:"perl",pl:"perl",pm:"perl",r:"r",jl:"julia",hs:"haskell",erl:"erlang",clj:"clojure",scm:"scheme",elm:"elm",ex:"elixir",exs:"elixir",proto:"protobuf",tf:"hcl",diff:"diff",patch:"diff",ini:"properties",conf:"nginx",cfg:"properties",v:"verilog",sv:"verilog",vhd:"vhdl",vhdl:"vhdl",pas:"pascal",f90:"fortran",f95:"fortran",cmake:"cmake",groovy:"groovy",gradle:"groovy",tex:"stex",latex:"stex",bib:"stex",d:"d",nim:"nim",zig:"zig",pug:"pug",jade:"pug",styl:"stylus",coffee:"coffeescript",tcl:"tcl",ml:"mllike",sml:"mllike",fs:"mllike",wasm:"wast",wat:"wast",pp:"puppet",feature:"gherkin",ttl:"turtle",rq:"sparql",xq:"xquery"},Z=_.split("/").pop()?.toLowerCase()||"";if(Z==="dockerfile"||Z.startsWith("dockerfile."))return"dockerfile";if(Z==="makefile"||Z==="gnumakefile")return"cmake";if(Z===".env"||Z.endsWith(".env"))return"properties";if(Z==="cmakelists.txt")return"cmake";if(Z==="vagrantfile"||Z==="rakefile"||Z==="gemfile")return"ruby";return j[$]||""}X6();var I2=/#(\w+)/g,fO=new Set(["strong","em","b","i","u","s","del","ins","sub","sup","mark","small","br","p","ul","ol","li","blockquote","ruby","rt","rp","span","input"]),RO=new Set(["a","abbr","blockquote","br","code","del","div","em","hr","h1","h2","h3","h4","h5","h6","i","img","input","ins","kbd","li","mark","ol","p","pre","ruby","rt","rp","s","small","span","strong","sub","sup","table","tbody","td","th","thead","tr","u","ul","math","semantics","mrow","mi","mn","mo","mtext","mspace","msup","msub","msubsup","mfrac","msqrt","mroot","mtable","mtr","mtd","annotation"]),SO=new Set(["class","title","role","aria-hidden","aria-label","aria-expanded","aria-live","data-mermaid","data-hashtag"]),rG={a:new Set(["href","target","rel"]),img:new Set(["src","alt","title"]),input:new Set(["type","checked","disabled"])},bO=new Set(["http:","https:","mailto:",""]);function gO(_,$){let j=String(_||"").toLowerCase(),Z=String($||"").toLowerCase();if(!Z||Z.startsWith("on"))return!1;if(Z.startsWith("data-")||Z.startsWith("aria-"))return!0;return(rG[j]||new Set).has(Z)||SO.has(Z)}function J7(_){return String(_||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#39;")}function M4(_,$={}){if(!_)return null;let j=String(_).trim();if(!j)return null;if(j.startsWith("#")||j.startsWith("/"))return j;if(j.startsWith("data:")){if($.allowDataImage&&/^data:image\//i.test(j))return j;return null}if(j.startsWith("blob:"))return j;try{let Z=new URL(j,typeof window<"u"?window.location.origin:"http://localhost");if(!bO.has(Z.protocol))return null;return Z.href}catch{return null}}function nG(_,$={}){if(!_)return"";if($?.sanitize===!1)return _;let j=new DOMParser().parseFromString(_,"text/html"),Z=[],X=j.createTreeWalker(j.body,NodeFilter.SHOW_ELEMENT),G;while(G=X.nextNode())Z.push(G);for(let q of Z){let Q=q.tagName.toLowerCase();if(!RO.has(Q)){let V=q.parentNode;if(!V)continue;while(q.firstChild)V.insertBefore(q.firstChild,q);V.removeChild(q);continue}let K=rG[Q]||new Set;for(let V of Array.from(q.attributes)){let Y=V.name.toLowerCase(),N=V.value;if(Y.startsWith("on")){q.removeAttribute(V.name);continue}if(gO(Q,Y)){if(Y==="href"){let F=M4(N);if(!F)q.removeAttribute(V.name);else if(q.setAttribute(V.name,F),Q==="a"){if(!q.getAttribute("rel"))q.setAttribute("rel","noopener noreferrer");if(/^https?:\/\//i.test(F))q.setAttribute("target","_blank")}}else if(Y==="src"){let F=Q==="img"&&typeof $.rewriteImageSrc==="function"?$.rewriteImageSrc(N):N,B=M4(F,{allowDataImage:Q==="img"});if(!B)q.removeAttribute(V.name);else q.setAttribute(V.name,B)}continue}q.removeAttribute(V.name)}}return j.body.innerHTML}function dG(_){if(!_)return _;let $=_.replace(/</g,"&lt;").replace(/>/g,"&gt;");return new DOMParser().parseFromString($,"text/html").documentElement.textContent}function G6(_,$=2){if(!_)return _;let j=_;for(let Z=0;Z<$;Z+=1){let X=dG(j);if(X===j)break;j=X}return j}function uO(_){if(!_)return{text:"",frontmatter:null};let $=_.replace(/^\uFEFF/,"").replace(/\r\n/g,`
`).replace(/\r/g,`
`);if(!$.startsWith(`---
`))return{text:$,frontmatter:null};let j=$.split(`
`),Z=-1;for(let q=1;q<j.length;q+=1)if(/^(---|\.\.\.)\s*$/.test(j[q])){Z=q;break}if(Z<=0)return{text:$,frontmatter:null};let X=j.slice(1,Z).join(`
`);return{text:j.slice(Z+1).join(`
`).replace(/^\n+/,""),frontmatter:X}}function vO(_){let{text:$,frontmatter:j}=uO(_);if(j===null)return $;return["<!--frontmatter-block-start-->","```yaml",j,"```","<!--frontmatter-block-end-->",$].filter(Boolean).join(`

`)}function mO(_){if(!_)return{text:"",blocks:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),Z=[],X=[],G=!1,q=[];for(let Q of j){if(!G&&Q.trim().match(/^```mermaid\s*$/i)){G=!0,q=[];continue}if(G&&Q.trim().match(/^```\s*$/)){let K=Z.length;Z.push(q.join(`
`)),X.push(`@@MERMAID_BLOCK_${K}@@`),G=!1,q=[];continue}if(G)q.push(Q);else X.push(Q)}if(G)X.push("```mermaid"),X.push(...q);return{text:X.join(`
`),blocks:Z}}function cO(_){if(!_)return _;return G6(_,5)}function hO(_){let $=new TextEncoder().encode(String(_||"")),j="";for(let Z of $)j+=String.fromCharCode(Z);return btoa(j)}function lO(_){let $=atob(String(_||"")),j=new Uint8Array($.length);for(let Z=0;Z<$.length;Z+=1)j[Z]=$.charCodeAt(Z);return new TextDecoder().decode(j)}function pO(_,$){if(!_||!$||$.length===0)return _;return _.replace(/@@MERMAID_BLOCK_(\d+)@@/g,(j,Z)=>{let X=Number(Z),G=$[X]??"",q=cO(G);return`<div class="mermaid-container" data-mermaid="${hO(q)}"><div class="mermaid-loading">Loading diagram...</div></div>`})}function oG(_){if(!_)return _;return _.replace(/<code>([\s\S]*?)<\/code>/gi,($,j)=>{if(j.includes(`
`))return`
\`\`\`
${j}
\`\`\`
`;return`\`${j}\``})}function rO(_){if(!_)return _;return _.replace(/<pre><code(?:\s+class="language-([A-Za-z0-9_+-]+)")?>([\s\S]*?)<\/code><\/pre>/g,(j,Z,X)=>{let G=String(Z||"").trim().toLowerCase(),q=G6(X,2),Q=G||"plaintext",K=A2(q,G);return`<pre><code class="hljs language-${J7(Q)}">${K}</code></pre>`}).replace(/<!--frontmatter-block-start-->\s*<pre>/g,'<pre class="frontmatter-block">').replace(/<\/pre>\s*<!--frontmatter-block-end-->/g,"</pre>")}var nO={span:new Set(["title","class","lang","dir"]),input:new Set(["type","checked","disabled"])};function dO(_,$){let j=nO[_];if(!j||!$)return"";let Z=[],X=/([a-zA-Z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/g,G;while(G=X.exec($)){let q=(G[1]||"").toLowerCase();if(!q||q.startsWith("on")||!j.has(q))continue;let Q=G[2]??G[3]??G[4]??"";Z.push(` ${q}="${J7(Q)}"`)}return Z.join("")}function iG(_){if(!_)return _;return _.replace(/&lt;((?:[^"'<>]|"[^"]*"|'[^']*')*?)(?:&gt;|>)/g,($,j)=>{let Z=j.trim(),X=Z.startsWith("/"),G=X?Z.slice(1).trim():Z,Q=G.endsWith("/")?G.slice(0,-1).trim():G,[K=""]=Q.split(/\s+/,1),V=K.toLowerCase();if(!V||!fO.has(V))return $;if(V==="br")return X?"":"<br>";if(X)return`</${V}>`;let Y=Q.slice(K.length).trim(),N=dO(V,Y);return`<${V}${N}>`})}function sG(_){if(!_)return _;let $=(j)=>j.replace(/&amp;lt;/g,"&lt;").replace(/&amp;gt;/g,"&gt;").replace(/&amp;quot;/g,"&quot;").replace(/&amp;#39;/g,"&#39;").replace(/&amp;amp;/g,"&amp;");return _.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,(j,Z)=>`<pre><code>${$(Z)}</code></pre>`).replace(/<code>([\s\S]*?)<\/code>/g,(j,Z)=>`<code>${$(Z)}</code>`)}function aG(_){if(!_)return _;let $=new DOMParser().parseFromString(_,"text/html"),j=$.createTreeWalker($.body,NodeFilter.SHOW_TEXT),Z=(G)=>G.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&"),X;while(X=j.nextNode()){if(!X.nodeValue)continue;let G=Z(X.nodeValue);if(G!==X.nodeValue)X.nodeValue=G}return $.body.innerHTML}function oO(_){if(!window.katex)return _;let $=(q)=>dG(q).replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&").replace(/<br\s*\/?\s*>/gi,`
`),j=(q)=>{let Q=[],K=q.replace(/<pre\b[^>]*>\s*<code\b[^>]*>[\s\S]*?<\/code>\s*<\/pre>/gi,(V)=>{let Y=Q.length;return Q.push(V),`@@CODE_BLOCK_${Y}@@`});return K=K.replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi,(V)=>{let Y=Q.length;return Q.push(V),`@@CODE_INLINE_${Y}@@`}),{html:K,blocks:Q}},Z=(q,Q)=>{if(!Q.length)return q;return q.replace(/@@CODE_(?:BLOCK|INLINE)_(\d+)@@/g,(K,V)=>{let Y=Number(V);return Q[Y]??""})},X=j(_),G=X.html;return G=G.replace(/(^|\n|<br\s*\/?\s*>|<p>|<\/p>)\s*\$\$([\s\S]+?)\$\$\s*(?=\n|<br\s*\/?\s*>|<\/p>|$)/gi,(q,Q,K)=>{try{let V=katex.renderToString($(K.trim()),{displayMode:!0,throwOnError:!1});return`${Q}${V}`}catch(V){let Y=V instanceof Error?V.message:String(V);return`<span class="math-error" title="${J7(Y)}">${q}</span>`}}),Z(G,X.blocks)}function iO(_){if(!_)return _;let $=new DOMParser().parseFromString(_,"text/html"),j=$.createTreeWalker($.body,NodeFilter.SHOW_TEXT),Z=[],X;while(X=j.nextNode())Z.push(X);for(let G of Z){let q=G.nodeValue;if(!q)continue;if(I2.lastIndex=0,!I2.test(q))continue;I2.lastIndex=0;let Q=G.parentElement;if(Q&&(Q.closest("a")||Q.closest("code")||Q.closest("pre")))continue;let K=q.split(I2);if(K.length<=1)continue;let V=$.createDocumentFragment();K.forEach((Y,N)=>{if(N%2===1){let F=$.createElement("a");F.setAttribute("href","#"),F.className="hashtag",F.setAttribute("data-hashtag",Y),F.textContent=`#${Y}`,V.appendChild(F)}else V.appendChild($.createTextNode(Y))}),G.parentNode?.replaceChild(V,G)}return $.body.innerHTML}function sO(_){if(!_)return _;let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),Z=[],X=!1;for(let G of j){if(!X&&G.trim().match(/^```(?:math|katex|latex)\s*$/i)){X=!0,Z.push("$$");continue}if(X&&G.trim().match(/^```\s*$/)){X=!1,Z.push("$$");continue}Z.push(G)}return Z.join(`
`)}function aO(_){let $=vO(_||""),j=sO($),{text:Z,blocks:X}=mO(j),G=G6(Z,2),Q=oG(G).replace(/</g,"&lt;");return{safeHtml:iG(Q),mermaidBlocks:X}}function q_(_,$,j={}){if(!_)return"";let{safeHtml:Z,mermaidBlocks:X}=aO(_),G=window.marked?marked.parse(Z,{headerIds:!1,mangle:!1}):Z.replace(/\n/g,"<br>");return G=sG(G),G=aG(G),G=rO(G),G=oO(G),G=iO(G),G=pO(G,X),G=nG(G,j),G}function q6(_){if(!_)return"";let $=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`),j=G6($,2),X=oG(j).replace(/</g,"&lt;").replace(/>/g,"&gt;"),G=iG(X),q=window.marked?marked.parse(G):G.replace(/\n/g,"<br>");return q=sG(q),q=aG(q),q=nG(q),q}function tO(_,$=6){return _.replace(/<polyline\b([^>]*)\bpoints="([^"]+)"([^>]*)\/?\s*>/g,(j,Z,X,G)=>{let q=X.trim().split(/\s+/).map((K)=>{let[V,Y]=K.split(",").map(Number);return{x:V,y:Y}});if(q.length<3)return`<polyline${Z}points="${X}"${G}/>`;let Q=[`M ${q[0].x},${q[0].y}`];for(let K=1;K<q.length-1;K++){let V=q[K-1],Y=q[K],N=q[K+1],F=Y.x-V.x,B=Y.y-V.y,D=N.x-Y.x,W=N.y-Y.y,H=Math.sqrt(F*F+B*B),z=Math.sqrt(D*D+W*W),k=Math.min($,H/2,z/2);if(k<0.5){Q.push(`L ${Y.x},${Y.y}`);continue}let J=Y.x-F/H*k,L=Y.y-B/H*k,x=Y.x+D/z*k,I=Y.y+W/z*k,M=F*W-B*D>0?1:0;Q.push(`L ${J},${L}`),Q.push(`A ${k},${k} 0 0 ${M} ${x},${I}`)}return Q.push(`L ${q[q.length-1].x},${q[q.length-1].y}`),`<path${Z}d="${Q.join(" ")}"${G}/>`})}async function L$(_){if(!window.beautifulMermaid)return;let{renderMermaid:$,THEMES:j}=window.beautifulMermaid,X=pG()==="dark"?j["tokyo-night"]:j["github-light"],G=_.querySelectorAll(".mermaid-container[data-mermaid]");for(let q of G)try{let Q=q.dataset.mermaid,K=lO(Q||""),V=G6(K,2),Y=await $(V,{...X,transparent:!0});Y=tO(Y),q.innerHTML=Y,q.removeAttribute("data-mermaid")}catch(Q){console.error("Mermaid render error:",Q);let K=document.createElement("pre");K.className="mermaid-error",K.textContent=`Diagram error: ${Q.message}`,q.innerHTML="",q.appendChild(K),q.removeAttribute("data-mermaid")}}T1();function Kq(_){let $=new Date(_);if(Number.isNaN($.getTime()))return _;let Z=new Date().getTime()-$.getTime(),X=Z/1000,G=86400000;if(Z<G){if(X<60)return"just now";if(X<3600)return`${Math.floor(X/60)}m`;return`${Math.floor(X/3600)}h`}if(Z<5*G){let K=$.toLocaleDateString(void 0,{weekday:"short"}),V=$.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});return`${K} ${V}`}let q=$.toLocaleDateString(void 0,{month:"short",day:"numeric"}),Q=$.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});return`${q} ${Q}`}function H6(_){if(!Number.isFinite(_))return"0";return Math.round(_).toLocaleString()}function t1(_){if(_<1024)return _+" B";if(_<1048576)return(_/1024).toFixed(1)+" KB";return(_/1048576).toFixed(1)+" MB"}function x4(_){let $=new Date(_);if(Number.isNaN($.getTime()))return _;return $.toLocaleString()}function d$(_){return String(_||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function mL(_,$){let j=String(_||"").trim();if(!j)return j;if(/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(j)||j.startsWith("#")||j.startsWith("data:")||j.startsWith("blob:"))return j;let Z=j.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/),X=Z?.[1]||j,G=Z?.[2]||"",q=Z?.[3]||"",Q=String($||"").split("/").slice(0,-1).join("/"),V=X.startsWith("/")?X:`${Q?`${Q}/`:""}${X}`,Y=[];for(let F of V.split("/")){if(!F||F===".")continue;if(F===".."){if(Y.length>0)Y.pop();continue}Y.push(F)}let N=Y.join("/");return`${z6(N)}${G}${q}`}function O6(_){return _?.preview||null}function cL(_){let $=String(_||""),j=Math.max($.lastIndexOf("/"),$.lastIndexOf("\\")),Z=j>=0?$.slice(j+1):$,X=Z.lastIndexOf(".");if(X<=0||X===Z.length-1)return"none";return Z.slice(X+1)}function hL(_){if(!_)return"unknown";if(_.kind==="image")return"image";if(_.kind==="text")return _.content_type==="text/markdown"?"markdown":"text";if(_.kind==="binary")return"binary";return String(_.kind||"unknown")}function lL(_,$){let j=$?.path||_?.path||"",Z=[];if($?.content_type)Z.push(`<span><strong>type:</strong> ${d$($.content_type)}</span>`);if(typeof $?.size==="number")Z.push(`<span><strong>size:</strong> ${d$(t1($.size))}</span>`);if($?.mtime)Z.push(`<span><strong>modified:</strong> ${d$(x4($.mtime))}</span>`);if(Z.push(`<span><strong>kind:</strong> ${d$(hL($))}</span>`),Z.push(`<span><strong>extension:</strong> ${d$(cL(j))}</span>`),j)Z.push(`<span><strong>path:</strong> ${d$(j)}</span>`);if($?.truncated)Z.push("<span><strong>content:</strong> truncated</span>");return`<div class="workspace-preview-meta workspace-preview-meta-inline">${Z.join("")}</div>`}function pL(_){let $=O6(_);if(!$)return'<div class="workspace-preview-text">No preview available.</div>';let j=lL(_,$);if($.kind==="image"){let Z=$.url||($.path?z6($.path):"");return`${j}
            <div class="workspace-preview-image">
                <img src="${d$(Z)}" alt="preview" />
            </div>
        `}if($.kind==="text"){if($.content_type==="text/markdown"){let Z=q_($.text||"",null,{rewriteImageSrc:(X)=>mL(X,$.path||_?.path)});return`${j}<div class="workspace-preview-text">${Z}</div>`}return`${j}<pre class="workspace-preview-text"><code>${d$($.text||"")}</code></pre>`}if($.kind==="binary")return`${j}<div class="workspace-preview-text">Binary file — download to view.</div>`;return`${j}<div class="workspace-preview-text">No preview available.</div>`}class Z9{container;context;disposed=!1;host;constructor(_,$){this.container=_,this.context=$,this.host=document.createElement("div"),this.host.className="workspace-preview-render-host",this.host.tabIndex=0,this.container.appendChild(this.host),this.render()}render(){if(this.disposed)return;this.host.innerHTML=pL(this.context)}getContent(){let _=O6(this.context);return typeof _?.text==="string"?_.text:void 0}isDirty(){return!1}setContent(_,$){let j=O6(this.context);if(j&&j.kind==="text"){if(j.text=_,$!==void 0)j.mtime=$}if(this.context.content=_,$!==void 0)this.context.mtime=$;this.render()}focus(){this.host?.focus?.()}dispose(){if(this.disposed)return;this.disposed=!0,this.host?.remove(),this.container.innerHTML=""}}var X9={id:"workspace-markdown-preview",label:"Workspace Markdown Preview",icon:"preview",capabilities:["preview","readonly"],placement:"tabs",canHandle(_){let $=O6(_);if(_?.mode!=="view")return!1;if(!$||$.kind!=="text")return!1;return $.content_type==="text/markdown"?20:!1},mount(_,$){return new Z9(_,$)}},G9={id:"workspace-preview-default",label:"Workspace Preview",icon:"preview",capabilities:["preview","readonly"],placement:"tabs",canHandle(_){if(_?.mode!=="view")return!1;return O6(_)||_?.path?1:!1},mount(_,$){return new Z9(_,$)}};var rL=new Set([".docx",".doc",".odt",".rtf",".xlsx",".xls",".ods",".csv",".pptx",".ppt",".odp"]),nL={".docx":"Word Document",".doc":"Word (Legacy)",".odt":"OpenDocument Text",".rtf":"Rich Text",".xlsx":"Excel Spreadsheet",".xls":"Excel (Legacy)",".ods":"OpenDocument Spreadsheet",".csv":"CSV Data",".pptx":"PowerPoint",".ppt":"PowerPoint (Legacy)",".odp":"OpenDocument Presentation"},dL={".docx":"\uD83D\uDCDD",".doc":"\uD83D\uDCDD",".odt":"\uD83D\uDCDD",".rtf":"\uD83D\uDCDD",".xlsx":"\uD83D\uDCCA",".xls":"\uD83D\uDCCA",".ods":"\uD83D\uDCCA",".csv":"\uD83D\uDCCA",".pptx":"\uD83D\uDCFD️",".ppt":"\uD83D\uDCFD️",".odp":"\uD83D\uDCFD️"};function Nq(_){if(!_)return"";let $=_.lastIndexOf(".");if($<0)return"";return _.slice($).toLowerCase()}function Yq(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}class Bq{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=j.split("/").pop()||"document",X=Nq(j),G=dL[X]||"\uD83D\uDCC4",q=nL[X]||"Office Document",Q=document.createElement("div");Q.style.cssText="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary,#1a1a1a);",Q.innerHTML=`
            <div style="text-align:center;max-width:360px;padding:24px;">
                <div style="font-size:56px;margin-bottom:12px;">${G}</div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary,#e0e0e0);margin-bottom:4px;word-break:break-word;">${Yq(Z)}</div>
                <div style="font-size:11px;color:var(--text-secondary,#888);margin-bottom:20px;">${Yq(q)}</div>
                <button id="ov-open-tab" style="padding:8px 20px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">
                    Open in Tab
                </button>
            </div>
        `,_.appendChild(Q);let K=Q.querySelector("#ov-open-tab");if(K)K.addEventListener("click",()=>{let V=new CustomEvent("office-viewer:open-tab",{bubbles:!0,detail:{path:j}});_.dispatchEvent(V)})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class Fq{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=j.split("/").pop()||"document",X=`/workspace/raw?path=${encodeURIComponent(j)}`,G=`/office-viewer/?url=${encodeURIComponent(X)}&name=${encodeURIComponent(Z)}`;this.iframe=document.createElement("iframe"),this.iframe.src=G,this.iframe.style.cssText="width:100%;height:100%;border:none;background:#1e1e1e;",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}var q9={id:"office-viewer",label:"Office Viewer",icon:"file-text",capabilities:["readonly","preview"],placement:"tabs",canHandle(_){let $=Nq(_?.path);if(!$||!rL.has($))return!1;return 50},mount(_,$){if($?.mode==="view")return new Bq(_,$);return new Fq(_,$)}};var oL=/\.(csv|tsv)$/i;function Uq(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}class Dq{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=j.split("/").pop()||"table.csv",X=j.toLowerCase().endsWith(".tsv")?"TSV Table":"CSV Table",G=document.createElement("div");G.style.cssText="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary,#1a1a1a);",G.innerHTML=`
            <div style="text-align:center;max-width:360px;padding:24px;">
                <div style="font-size:56px;margin-bottom:12px;">\uD83D\uDCCA</div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary,#e0e0e0);margin-bottom:4px;word-break:break-word;">${Uq(Z)}</div>
                <div style="font-size:11px;color:var(--text-secondary,#888);margin-bottom:20px;">${Uq(X)}</div>
                <button id="csv-open-tab" style="padding:8px 20px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">
                    Open in Tab
                </button>
            </div>
        `,_.appendChild(G);let q=G.querySelector("#csv-open-tab");if(q)q.addEventListener("click",()=>{let Q=new CustomEvent("data-viewer:open-tab",{bubbles:!0,detail:{path:j}});_.dispatchEvent(Q)})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class zq{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=`/data-viewer/?path=${encodeURIComponent(j)}`;this.iframe=document.createElement("iframe"),this.iframe.src=Z,this.iframe.style.cssText="width:100%;height:100%;border:none;background:var(--bg-primary,#000);",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}var Q9={id:"data-viewer",label:"Data Viewer",icon:"table",capabilities:["readonly","preview"],placement:"tabs",canHandle(_){let $=_?.path||"";if(!oL.test($))return!1;return 55},mount(_,$){if($?.mode==="view")return new Dq(_,$);return new zq(_,$)}};var iL=/\.(html|htm)$/i,sL=/\.(png|jpe?g|gif|webp|bmp|ico|svg)$/i,aL=/\.(mp4|m4v|mov|webm|ogv)$/i,tL=/\.pdf$/i;function Wq(_){if(iL.test(_))return"html";if(sL.test(_))return"image";if(aL.test(_))return"video";if(tL.test(_))return"pdf";return null}function C4(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}class Hq{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=j.split("/").pop()||"index.html",X=document.createElement("div");X.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;background:var(--bg-primary,#1a1a1a);",X.innerHTML=`
            <div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:24px;">
                <div style="text-align:center;">
                    <div style="font-size:48px;margin-bottom:12px;">\uD83C\uDF10</div>
                    <div style="font-size:14px;color:var(--text-primary,#e2e8f0);font-weight:500;margin-bottom:4px;">${C4(Z)}</div>
                    <div style="font-size:12px;color:var(--text-secondary,#94a3b8);">HTML document</div>
                </div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-top:1px solid var(--border-color,#333);flex-shrink:0;">
                <div style="font-size:12px;color:var(--text-secondary,#888);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;">${C4(j)}</div>
                <div style="display:flex;gap:8px;flex-shrink:0;">
                    <button id="html-edit-btn" style="padding:5px 14px;background:var(--surface-color,rgba(148,163,184,.12));color:var(--text-primary,#e2e8f0);
                        border:none;border-radius:4px;font-size:12px;font-weight:500;cursor:pointer;
                        transition:background 0.15s;">
                        Edit Source
                    </button>
                    <button id="html-open-tab" style="padding:5px 14px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                        border:none;border-radius:4px;font-size:12px;font-weight:500;cursor:pointer;
                        transition:background 0.15s;"
                        onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                        onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">
                        Preview in Tab
                    </button>
                </div>
            </div>
        `,_.appendChild(X);let G=X.querySelector("#html-open-tab");if(G)G.addEventListener("click",()=>{_.dispatchEvent(new CustomEvent("html-viewer:open-tab",{bubbles:!0,detail:{path:j}}))});let q=X.querySelector("#html-edit-btn");if(q)q.addEventListener("click",()=>{_.dispatchEvent(new CustomEvent("html-viewer:edit-source",{bubbles:!0,detail:{path:j}}))})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class Oq{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=`/html-viewer/?path=${encodeURIComponent(j)}`;this.iframe=document.createElement("iframe"),this.iframe.src=Z,this.iframe.style.cssText="width:100%;height:100%;border:none;background:#fff;",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}class Lq{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=j.split("/").pop()||"image",X=`/workspace/raw?path=${encodeURIComponent(j)}`,G=document.createElement("div");G.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;background:var(--bg-primary,#1a1a1a);",G.innerHTML=`
            <div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:16px;">
                <img src="${C4(X)}" alt="${C4(Z)}" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:4px;" />
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-top:1px solid var(--border-color,#333);flex-shrink:0;">
                <div style="font-size:12px;color:var(--text-secondary,#888);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;">${C4(Z)}</div>
                <button id="img-open-tab" style="padding:5px 14px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:4px;font-size:12px;font-weight:500;cursor:pointer;flex-shrink:0;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">
                    Open in Tab
                </button>
            </div>
        `,_.appendChild(G);let q=G.querySelector("#img-open-tab");if(q)q.addEventListener("click",()=>{let Q=new CustomEvent("image-viewer:open-tab",{bubbles:!0,detail:{path:j}});_.dispatchEvent(Q)})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class Jq{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=`/image-viewer/?path=${encodeURIComponent(j)}`;this.iframe=document.createElement("iframe"),this.iframe.src=Z,this.iframe.style.cssText="width:100%;height:100%;border:none;background:var(--bg-primary,#000);",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}class Eq{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=j.split("/").pop()||"video.mp4",X=document.createElement("div");X.style.cssText="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary,#1a1a1a);",X.innerHTML=`
            <div style="text-align:center;max-width:360px;padding:24px;">
                <div style="font-size:56px;margin-bottom:12px;">\uD83C\uDFAC</div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary,#e0e0e0);margin-bottom:4px;word-break:break-word;">${C4(Z)}</div>
                <div style="font-size:11px;color:var(--text-secondary,#888);margin-bottom:20px;">Video File</div>
                <button id="video-open-tab" style="padding:8px 20px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">
                    Open in Tab
                </button>
            </div>
        `,_.appendChild(X);let G=X.querySelector("#video-open-tab");if(G)G.addEventListener("click",()=>{let q=new CustomEvent("video-viewer:open-tab",{bubbles:!0,detail:{path:j}});_.dispatchEvent(q)})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class Aq{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=`/video-viewer/?path=${encodeURIComponent(j)}`;this.iframe=document.createElement("iframe"),this.iframe.src=Z,this.iframe.style.cssText="width:100%;height:100%;border:none;background:#111;",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}class Mq{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=j.split("/").pop()||"document.pdf",X=document.createElement("div");X.style.cssText="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary,#1a1a1a);",X.innerHTML=`
            <div style="text-align:center;max-width:360px;padding:24px;">
                <div style="font-size:56px;margin-bottom:12px;">\uD83D\uDCC4</div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary,#e0e0e0);margin-bottom:4px;word-break:break-word;">${C4(Z)}</div>
                <div style="font-size:11px;color:var(--text-secondary,#888);margin-bottom:20px;">PDF Document</div>
                <button id="pdf-open-tab" style="padding:8px 20px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">
                    Open in Tab
                </button>
            </div>
        `,_.appendChild(X);let G=X.querySelector("#pdf-open-tab");if(G)G.addEventListener("click",()=>{let q=new CustomEvent("pdf-viewer:open-tab",{bubbles:!0,detail:{path:j}});_.dispatchEvent(q)})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class kq{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",Z=`/pdf-viewer/?path=${encodeURIComponent(j)}`;this.iframe=document.createElement("iframe"),this.iframe.src=Z,this.iframe.style.cssText="width:100%;height:100%;border:none;background:#1e1e1e;",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}var eL={html:30,image:48,pdf:52,video:54},V9={id:"web-viewer",label:"Web Viewer",icon:"eye",capabilities:["preview"],placement:"tabs",canHandle(_){let $=_?.path||"",j=Wq($);if(!j)return!1;return eL[j]??30},mount(_,$){let j=$?.path||"",Z=Wq(j),X=$?.mode==="view";switch(Z){case"html":return X?new Hq(_,$):new Oq(_,$);case"image":return X?new Lq(_,$):new Jq(_,$);case"video":return X?new Eq(_,$):new Aq(_,$);case"pdf":return X?new Mq(_,$):new kq(_,$);default:return _.textContent="Unsupported file type.",{dispose(){},resize(){},focus(){},setContent(){},getContent(){return null},isDirty(){return!1}}}}};var _J=/\.(md|mdx|markdown)$/i,$J=98304,c2=2500;function jJ(_,$){let j=1;for(let Z=0;Z<_.length;Z++)if(_.charCodeAt(Z)===10){if(j+=1,j>$)return j}return j}class Tq{container;content="";lang="";disposed=!1;constructor(_,$){this.container=_;let j=$?.path||"";this.lang=j6(j);let Z=$?.preview;if(Z?.content)this.content=Z.content,this.render();else this.loadContent(j)}async loadContent(_){if(this.disposed)return;try{let $=await fetch(`/workspace/raw?path=${encodeURIComponent(_)}`);if(!$.ok){this.container.textContent=`Failed to load: ${$.status}`;return}if(this.content=await $.text(),!this.disposed)this.render()}catch($){if(!this.disposed)this.container.textContent="Error loading file."}}render(){let _=this.lang?J2(this.lang):"Plain text",$=jJ(this.content,c2);if(this.content.length>$J||$>c2){this.container.innerHTML=`
                <div class="highlight-preview" style="height:100%;display:flex;flex-direction:column;overflow:hidden;background:var(--bg-primary,#1e1e1e);">
                    <div class="hl-toolbar" style="flex:0 0 auto;padding:4px 12px;background:var(--bg-secondary,#252526);border-bottom:1px solid var(--border-color,#333);font-size:11px;color:var(--text-secondary,#888);display:flex;justify-content:space-between;">
                        <span>${this.escapeHtml(_)} · large file mode</span>
                        <span>${$>c2?`${c2}+`:$} lines</span>
                    </div>
                    <div class="hl-code-container" style="flex:1;overflow:auto;font-family:var(--code-font,'JetBrains Mono',monospace);font-size:13px;line-height:1.5;">
                        <pre class="hl-code" style="padding:8px 12px;margin:0;white-space:pre;overflow-x:auto;">${this.escapeHtml(this.content)}</pre>
                    </div>
                </div>
            `;return}let X=(this.lang?!!E2(this.lang):!1)?SG(this.content,this.lang):this.content.split(`
`).map((Q)=>this.escapeHtml(Q)||"&nbsp;"),G=X.map((Q,K)=>`<span class="hl-line-number">${K+1}</span>`).join(`
`),q=X.join(`
`);this.container.innerHTML=`
            <div class="highlight-preview" style="height:100%;display:flex;flex-direction:column;overflow:hidden;background:var(--bg-primary,#1e1e1e);">
                <div class="hl-toolbar" style="flex:0 0 auto;padding:4px 12px;background:var(--bg-secondary,#252526);border-bottom:1px solid var(--border-color,#333);font-size:11px;color:var(--text-secondary,#888);display:flex;justify-content:space-between;">
                    <span>${this.escapeHtml(_)}</span>
                    <span>${X.length} lines</span>
                </div>
                <div class="hl-code-container" style="flex:1;overflow:auto;font-family:var(--code-font,'JetBrains Mono',monospace);font-size:13px;line-height:1.5;">
                    <div style="display:flex;min-height:100%;">
                        <pre class="hl-line-numbers" style="flex:0 0 auto;padding:8px 8px 8px 12px;text-align:right;color:var(--text-tertiary,#555);user-select:none;border-right:1px solid var(--border-color,#333);">${G}</pre>
                        <pre class="hl-code" style="flex:1;padding:8px 12px;margin:0;white-space:pre;overflow-x:auto;">${q}</pre>
                    </div>
                </div>
            </div>
        `}escapeHtml(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}dispose(){this.disposed=!0,this.container.innerHTML=""}resize(){}focus(){}setContent(_){this.content=_,this.render()}getContent(){return this.content}isDirty(){return!1}}var K9={id:"highlight-previewer",label:"Source Preview",icon:"code",capabilities:["preview"],placement:"tabs",canHandle(_){if(_?.mode!=="view")return!1;let $=_?.path||"";if(_J.test($))return!1;if(j6($))return 10;let Z=_?.preview;if(Z?.kind==="text"&&Z?.content_type!=="text/markdown")return 5;return!1},mount(_,$){return new Tq(_,$)}};T1();function ZJ(_){let $=_.includes(".")?_.slice(_.lastIndexOf(".")):"",j=_.includes(".")?_.slice(0,_.lastIndexOf(".")):_,Z=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);return`${j}.${Z}${$}`}function yq(_){let{path:$,getCurrentMtime:j,anchorParent:Z,anchorBefore:X,onReload:G,onSaveCopy:q,onOverwrite:Q,pollMs:K=3000,ownerDocument:V=document}=_,Y=null,N=null,F=!1,B=!1,D=!1;async function W(){if(B||D||F)return;let L=j();if(!L)return;try{let x=await t7($);if(B||D||!x?.mtime)return;if(x.mtime!==L)F=!0,z(),k()}catch(x){if(typeof console<"u")console.debug("[file-conflict-monitor] mtime poll skipped:",x)}}function H(){if(z(),B)return;Y=setInterval(W,K)}function z(){if(Y)clearInterval(Y),Y=null}function k(){if(N||B)return;let L=V.createElement("div");L.className="editor-conflict-bar",L.innerHTML=`
      <span class="editor-conflict-text">File changed on disk</span>
      <div class="editor-conflict-actions">
        <button class="editor-conflict-btn" data-action="reload" title="Discard and reload from disk">Reload</button>
        <button class="editor-conflict-btn" data-action="save-copy" title="Save current content with a new name">Save copy</button>
        <button class="editor-conflict-btn" data-action="overwrite" title="Overwrite the disk version">Overwrite</button>
        <button class="editor-conflict-btn editor-conflict-dismiss" data-action="dismiss" title="Dismiss">×</button>
      </div>
    `,L.addEventListener("click",(x)=>{let I=x.target.closest("[data-action]");if(!I)return;let E=I.getAttribute("data-action");if(E==="reload")J(),G();else if(E==="save-copy"){let M=ZJ($);q(M)}else if(E==="overwrite")J(),Q();else if(E==="dismiss")J()}),N=L,Z.insertBefore(L,X)}function J(){if(N)N.remove(),N=null;F=!1,H()}return{start(){H()},stop(){z()},onSaved(L){F=!1,D=!1,H()},dispose(){if(B=!0,z(),N)N.remove(),N=null}}}var XJ=/\.mindmap\.ya?ml$/i,h2=String(Date.now());function GJ(_){return String(_||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function wq(){let _=document.documentElement?.dataset?.theme;if(_==="dark")return!0;if(_==="light")return!1;try{return!!window.matchMedia?.("(prefers-color-scheme: dark)")?.matches}catch{return!1}}function Y9(_){let $=_.split("?")[0];if(document.querySelector(`script[data-src="${$}"]`))return Promise.resolve();let Z=document.querySelector(`script[src="${$}"]`);if(Z)Z.remove();return new Promise((X,G)=>{let q=document.createElement("script");q.src=_,q.dataset.src=$,q.onload=()=>X(),q.onerror=()=>G(Error(`Failed to load ${_}`)),document.head.appendChild(q)})}function qJ(_){let $=_.split("?")[0],j=document.querySelector(`link[data-href="${$}"]`);if(j&&j.href.endsWith(_))return;document.querySelectorAll(`link[data-href="${$}"], link[href="${$}"]`).forEach((X)=>X.remove());let Z=document.createElement("link");Z.rel="stylesheet",Z.href=_,Z.dataset.href=$,document.head.appendChild(Z)}function QJ(_){let $=document.createElementNS("http://www.w3.org/2000/svg","svg");$.id="mindmap-svg",$.setAttribute("width","100%"),$.setAttribute("height","100%"),$.style.cssText="display:block;position:absolute;inset:0;",_.appendChild($);let j=document.createElement("div");j.id="toolbar",j.className="mindmap-toolbar",j.innerHTML=`
        <select id="layout-select">
            <option value="horizontal-tree">Horizontal Tree</option>
            <option value="vertical-tree">Vertical Tree</option>
            <option value="radial">Radial</option>
            <option value="force-directed">Force Directed</option>
        </select>
        <button type="button" id="zoom-fit" title="Fit to view">⊞</button>
        <button type="button" id="zoom-in"  title="Zoom in">+</button>
        <button type="button" id="zoom-out" title="Zoom out">−</button>
        <button type="button" id="mindmap-undo" title="Undo (Ctrl+Z)" disabled>Undo</button>
        <button type="button" id="mindmap-redo" title="Redo (Ctrl+Shift+Z)" disabled>Redo</button>
        <button type="button" id="reset-layout" title="Reset layout">↻</button>
    `,_.appendChild(j);let Z=document.createElement("div");Z.id="context-menu",Z.className="context-menu hidden",Z.innerHTML=`
        <button data-action="cut">Cut</button>
        <button data-action="copy">Copy</button>
        <button data-action="paste">Paste</button>
        <hr/>
        <button data-action="add-child">Add child</button>
        <button data-action="add-sibling">Add sibling</button>
        <hr/>
        <button data-action="delete">Delete</button>
    `,_.appendChild(Z)}class Iq{container;constructor(_,$){this.container=_;let j=$.path||"",Z=j.split("/").pop()||"mindmap",X=document.createElement("div");X.style.cssText="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary,#1a1a1a);",X.innerHTML=`
            <div style="text-align:center;max-width:360px;padding:24px;">
                <div style="font-size:56px;margin-bottom:12px;">\uD83E\uDDE0</div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary,#e0e0e0);margin-bottom:4px;word-break:break-word;">${GJ(Z)}</div>
                <div style="font-size:11px;color:var(--text-secondary,#888);margin-bottom:20px;">Mindmap Editor</div>
                <button id="mm-open-tab" style="padding:8px 20px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">Edit in Tab</button>
            </div>`,_.appendChild(X),X.querySelector("#mm-open-tab")?.addEventListener("click",()=>{_.dispatchEvent(new CustomEvent("mindmap:open-tab",{bubbles:!0,detail:{path:j}}))})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){this.container.innerHTML=""}}class xq{container;filePath;dirty=!1;dirtyCallback=null;disposed=!1;mindmapEl=null;pendingContent=null;lastContent="";currentMtime=null;conflictMonitor=null;themeListener=()=>{window.__mindmapEditor?.setTheme?.(wq())};constructor(_,$){this.container=_,this.filePath=$.path||"",this.init($.content)}async resolveInitialContent(_){if(_!==void 0)return _;if(!this.filePath)return"";try{let j=await(await fetch(`/workspace/file?path=${encodeURIComponent(this.filePath)}&max=1000000&mode=edit`)).json();if(j?.mtime)this.currentMtime=j.mtime;return j?.text||""}catch{return""}}async init(_){let $=await this.resolveInitialContent(_);if(this.disposed)return;if(this.lastContent=$,qJ("/static/css/mindmap.css?v="+h2),await Promise.all([Y9("/static/js/vendor/d3-mindmap.min.js?v="+h2),Y9("/static/js/vendor/js-yaml.min.js?v="+h2)]),this.disposed)return;this.mindmapEl=document.createElement("div"),this.mindmapEl.id="mindmap-container",this.mindmapEl.tabIndex=-1,this.mindmapEl.style.cssText="width:100%;height:100%;overflow:hidden;position:relative;outline:none;",this.container.appendChild(this.mindmapEl),QJ(this.mindmapEl);let j=wq(),Z=this.filePath.replace(/\/[^/]+$/,"")||"/";try{if(await Y9("/static/js/vendor/mindmap-editor.js?v="+h2),this.disposed)return;let X=window.__mindmapEditor;if(!X)throw Error("__mindmapEditor not found");if(X.mount({content:$,isDark:j,onEdit:(G)=>{this.lastContent=G,this.dirty=!0,this.dirtyCallback?.(!0),this.saveToWorkspace(G)},resolveImagePath:(G)=>{if(G.startsWith("data:")||G.startsWith("http"))return G;return`/workspace/raw?path=${encodeURIComponent(Z+"/"+G)}`}}),this.pendingContent!==null)X.update(this.pendingContent),this.lastContent=this.pendingContent,this.pendingContent=null;window.addEventListener("piclaw-theme-change",this.themeListener),this.initConflictMonitor()}catch(X){if(console.error("[mindmap] Failed to load mindmap renderer:",X),this.mindmapEl)this.mindmapEl.innerHTML='<div style="padding:24px;color:var(--text-secondary);">Failed to load mindmap editor.</div>'}}async saveToWorkspace(_){if(!this.filePath)return;try{let $=await fetch("/workspace/file",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:this.filePath,content:_})});if(!$.ok)throw Error(`HTTP ${$.status}`);let j=await $.json().catch(()=>({}));this.currentMtime=j?.mtime||this.currentMtime,this.conflictMonitor?.onSaved(this.currentMtime),this.dirty=!1,this.dirtyCallback?.(!1)}catch($){console.error("[mindmap] Save failed:",$)}}initConflictMonitor(){if(this.conflictMonitor?.dispose(),!this.filePath)return;this.conflictMonitor=yq({path:this.filePath,getCurrentMtime:()=>this.currentMtime,anchorParent:this.container,anchorBefore:this.mindmapEl||this.container.firstElementChild,onReload:async()=>{try{let $=await(await fetch(`/workspace/file?path=${encodeURIComponent(this.filePath)}&max=1000000&mode=edit`)).json();if(this.disposed)return;this.currentMtime=$?.mtime||null;let j=$?.text||"";this.lastContent=j;let Z=window.__mindmapEditor;if(Z?.update)Z.update(j);this.dirty=!1,this.dirtyCallback?.(!1),this.conflictMonitor?.onSaved(this.currentMtime)}catch(_){console.error("[mindmap] Reload failed:",_)}},onSaveCopy:async(_)=>{try{await fetch("/workspace/file",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:_,content:this.lastContent})})}catch($){console.error("[mindmap] Save copy failed:",$)}},onOverwrite:()=>this.saveToWorkspace(this.lastContent)}),this.conflictMonitor.start()}getContent(){return}isDirty(){return this.dirty}setContent(_,$){if(_===this.lastContent)return;let j=window.__mindmapEditor;if(j?.update)j.update(_);else this.pendingContent=_;this.lastContent=_,this.dirty=!1,this.dirtyCallback?.(!1)}focus(){this.mindmapEl?.focus()}resize(){window.dispatchEvent(new Event("resize"))}onDirtyChange(_){this.dirtyCallback=_}dispose(){if(this.disposed)return;this.disposed=!0,this.conflictMonitor?.dispose(),window.removeEventListener("piclaw-theme-change",this.themeListener),window.__mindmapEditor?.destroy(),this.pendingContent=null,this.container.innerHTML=""}}var N9={id:"mindmap-editor",label:"Mindmap Editor",icon:"mindmap",capabilities:["edit","preview"],placement:"tabs",canHandle(_){let $=_?.path||"";if(!XJ.test($))return!1;return 50},mount(_,$){if($?.mode==="view")return new Iq(_,$);return new xq(_,$)}};class Cq{tabs=new Map;activeId=null;mruOrder=[];listeners=new Set;onChange(_){return this.listeners.add(_),()=>this.listeners.delete(_)}notify(){let _=this.getTabs(),$=this.activeId;for(let j of this.listeners)try{j(_,$)}catch(Z){console.warn("[tab-store] Change listener failed:",Z)}}open(_,$){let j=this.tabs.get(_);if(!j)j={id:_,label:$||_.split("/").pop()||_,path:_,dirty:!1,pinned:!1},this.tabs.set(_,j);return this.activate(_),j}activate(_){if(!this.tabs.has(_))return;this.activeId=_,this.mruOrder=[_,...this.mruOrder.filter(($)=>$!==_)],this.notify()}close(_){if(!this.tabs.get(_))return!1;if(this.tabs.delete(_),this.mruOrder=this.mruOrder.filter((j)=>j!==_),this.activeId===_)this.activeId=this.mruOrder[0]||null;return this.notify(),!0}closeOthers(_){for(let[$,j]of this.tabs)if($!==_&&!j.pinned)this.tabs.delete($),this.mruOrder=this.mruOrder.filter((Z)=>Z!==$);if(this.activeId&&!this.tabs.has(this.activeId))this.activeId=_;this.notify()}closeAll(){for(let[_,$]of this.tabs)if(!$.pinned)this.tabs.delete(_),this.mruOrder=this.mruOrder.filter((j)=>j!==_);if(this.activeId&&!this.tabs.has(this.activeId))this.activeId=this.mruOrder[0]||null;this.notify()}setDirty(_,$){let j=this.tabs.get(_);if(!j||j.dirty===$)return;j.dirty=$,this.notify()}togglePin(_){let $=this.tabs.get(_);if(!$)return;$.pinned=!$.pinned,this.notify()}saveViewState(_,$){let j=this.tabs.get(_);if(j)j.viewState=$}getViewState(_){return this.tabs.get(_)?.viewState}rename(_,$,j){let Z=this.tabs.get(_);if(!Z)return;if(this.tabs.delete(_),Z.id=$,Z.path=$,Z.label=j||$.split("/").pop()||$,this.tabs.set($,Z),this.mruOrder=this.mruOrder.map((X)=>X===_?$:X),this.activeId===_)this.activeId=$;this.notify()}getTabs(){return Array.from(this.tabs.values())}getActiveId(){return this.activeId}getActive(){return this.activeId?this.tabs.get(this.activeId)||null:null}get(_){return this.tabs.get(_)}get size(){return this.tabs.size}hasUnsaved(){for(let _ of this.tabs.values())if(_.dirty)return!0;return!1}getDirtyTabs(){return Array.from(this.tabs.values()).filter((_)=>_.dirty)}nextTab(){let _=this.getTabs();if(_.length<=1)return;let $=_.findIndex((Z)=>Z.id===this.activeId),j=_[($+1)%_.length];this.activate(j.id)}prevTab(){let _=this.getTabs();if(_.length<=1)return;let $=_.findIndex((Z)=>Z.id===this.activeId),j=_[($-1+_.length)%_.length];this.activate(j.id)}mruSwitch(){if(this.mruOrder.length>1)this.activate(this.mruOrder[1])}}var j1=new Cq;var L5=(_)=>{let $=new Set;return(_||[]).filter((j)=>{if(!j||$.has(j.id))return!1;return $.add(j.id),!0})};M0();function Pq(){let[_,$]=C(null),[j,Z]=C({text:"",totalLines:0}),[X,G]=C(""),[q,Q]=C({text:"",totalLines:0}),[K,V]=C(null),[Y,N]=C(null),[F,B]=C(null),D=g(null),W=g(0),H=g(!1),z=g(""),k=g(""),J=g(!1),L=g(0),x=g(null),I=g(null),E=g(null),M=g(null),O=g(!1),T=g(!1);return{agentStatus:_,setAgentStatus:$,agentDraft:j,setAgentDraft:Z,agentPlan:X,setAgentPlan:G,agentThought:q,setAgentThought:Q,pendingRequest:K,setPendingRequest:V,currentTurnId:Y,setCurrentTurnId:N,steerQueuedTurnId:F,setSteerQueuedTurnId:B,lastAgentEventRef:D,lastSilenceNoticeRef:W,isAgentRunningRef:H,draftBufferRef:z,thoughtBufferRef:k,previewResyncPendingRef:J,previewResyncGenerationRef:L,pendingRequestRef:x,stalledPostIdRef:I,currentTurnIdRef:E,steerQueuedTurnIdRef:M,thoughtExpandedRef:O,draftExpandedRef:T}}M0();var VJ=0.1,gq=4,uq=4,fq=160,Rq=1600,Sq=200,bq=1600;function J$(){if(typeof window>"u")return 0;return Number(window.innerWidth)||0}function vq(_=J$()){return _>0?Math.floor(_*VJ):0}function L6(_,$=J$(),j=0){let Z=vq($)+gq+(j>0?uq+Math.max(0,j):0),X=$>0?Math.floor($-Z):Rq;return Math.min(Math.max(Number(_)||0,fq),Math.max(fq,Math.min(Rq,X)))}function J6(_,$=J$(),j=0){let Z=vq($)+uq+(j>0?gq+Math.max(0,j):0),X=$>0?Math.floor($-Z):bq;return Math.min(Math.max(Number(_)||0,Sq),Math.max(Sq,Math.min(bq,X)))}function mq({appShellRef:_,sidebarWidthRef:$,editorWidthRef:j,dockHeightRef:Z}){let X=g((Y)=>{Y.preventDefault();let N=_.current;if(!N)return;let F=Y.clientX,B=$.current||280,D=Y.currentTarget;D.classList.add("dragging"),N.classList.add("sidebar-resizing"),document.body.style.cursor="col-resize",document.body.style.userSelect="none";let W=F,H=(k)=>{W=k.clientX;let J=L6(B+(k.clientX-F),J$(),j?.current||0);N.style.setProperty("--sidebar-width",`${J}px`),$.current=J},z=()=>{let k=L6(B+(W-F),J$(),j?.current||0);$.current=k,D.classList.remove("dragging"),N.classList.remove("sidebar-resizing"),document.body.style.cursor="",document.body.style.userSelect="",K1("sidebarWidth",String(Math.round(k))),document.removeEventListener("mousemove",H),document.removeEventListener("mouseup",z)};document.addEventListener("mousemove",H),document.addEventListener("mouseup",z)}).current,G=g((Y)=>{Y.preventDefault();let N=_.current;if(!N)return;let F=Y.touches[0];if(!F)return;let B=F.clientX,D=$.current||280,W=Y.currentTarget;W.classList.add("dragging"),N.classList.add("sidebar-resizing"),document.body.style.userSelect="none";let H=(k)=>{let J=k.touches[0];if(!J)return;k.preventDefault();let L=L6(D+(J.clientX-B),J$(),j?.current||0);N.style.setProperty("--sidebar-width",`${L}px`),$.current=L},z=()=>{W.classList.remove("dragging"),N.classList.remove("sidebar-resizing"),document.body.style.userSelect="",K1("sidebarWidth",String(Math.round($.current||D))),document.removeEventListener("touchmove",H),document.removeEventListener("touchend",z),document.removeEventListener("touchcancel",z)};document.addEventListener("touchmove",H,{passive:!1}),document.addEventListener("touchend",z),document.addEventListener("touchcancel",z)}).current,q=g((Y)=>{Y.preventDefault();let N=_.current;if(!N)return;let F=Y.clientX,B=j.current||$.current||280,D=Y.currentTarget;D.classList.add("dragging"),document.body.style.cursor="col-resize",document.body.style.userSelect="none";let W=F,H=(k)=>{W=k.clientX;let J=J6(B+(k.clientX-F),J$(),$?.current||0);N.style.setProperty("--editor-width",`${J}px`),j.current=J},z=()=>{let k=J6(B+(W-F),J$(),$?.current||0);j.current=k,D.classList.remove("dragging"),document.body.style.cursor="",document.body.style.userSelect="",K1("editorWidth",String(Math.round(k))),document.removeEventListener("mousemove",H),document.removeEventListener("mouseup",z)};document.addEventListener("mousemove",H),document.addEventListener("mouseup",z)}).current,Q=g((Y)=>{Y.preventDefault();let N=_.current;if(!N)return;let F=Y.touches[0];if(!F)return;let B=F.clientX,D=j.current||$.current||280,W=Y.currentTarget;W.classList.add("dragging"),document.body.style.userSelect="none";let H=(k)=>{let J=k.touches[0];if(!J)return;k.preventDefault();let L=J6(D+(J.clientX-B),J$(),$?.current||0);N.style.setProperty("--editor-width",`${L}px`),j.current=L},z=()=>{W.classList.remove("dragging"),document.body.style.userSelect="",K1("editorWidth",String(Math.round(j.current||D))),document.removeEventListener("touchmove",H),document.removeEventListener("touchend",z),document.removeEventListener("touchcancel",z)};document.addEventListener("touchmove",H,{passive:!1}),document.addEventListener("touchend",z),document.addEventListener("touchcancel",z)}).current,K=g((Y)=>{Y.preventDefault();let N=_.current;if(!N)return;let F=Y.clientY,B=Z?.current||200,D=Y.currentTarget;D.classList.add("dragging"),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let W=F,H=(k)=>{W=k.clientY;let J=Math.min(Math.max(B-(k.clientY-F),100),window.innerHeight*0.5);if(N.style.setProperty("--dock-height",`${J}px`),Z)Z.current=J;window.dispatchEvent(new CustomEvent("dock-resize"))},z=()=>{let k=Math.min(Math.max(B-(W-F),100),window.innerHeight*0.5);if(Z)Z.current=k;D.classList.remove("dragging"),document.body.style.cursor="",document.body.style.userSelect="",K1("dockHeight",String(Math.round(k))),window.dispatchEvent(new CustomEvent("dock-resize")),document.removeEventListener("mousemove",H),document.removeEventListener("mouseup",z)};document.addEventListener("mousemove",H),document.addEventListener("mouseup",z)}).current,V=g((Y)=>{Y.preventDefault();let N=_.current;if(!N)return;let F=Y.touches[0];if(!F)return;let B=F.clientY,D=Z?.current||200,W=Y.currentTarget;W.classList.add("dragging"),document.body.style.userSelect="none";let H=(k)=>{let J=k.touches[0];if(!J)return;k.preventDefault();let L=Math.min(Math.max(D-(J.clientY-B),100),window.innerHeight*0.5);if(N.style.setProperty("--dock-height",`${L}px`),Z)Z.current=L;window.dispatchEvent(new CustomEvent("dock-resize"))},z=()=>{W.classList.remove("dragging"),document.body.style.userSelect="",K1("dockHeight",String(Math.round(Z?.current||D))),window.dispatchEvent(new CustomEvent("dock-resize")),document.removeEventListener("touchmove",H),document.removeEventListener("touchend",z),document.removeEventListener("touchcancel",z)};document.addEventListener("touchmove",H,{passive:!1}),document.addEventListener("touchend",z),document.addEventListener("touchcancel",z)}).current;return{handleSplitterMouseDown:X,handleSplitterTouchStart:G,handleEditorSplitterMouseDown:q,handleEditorSplitterTouchStart:Q,handleDockSplitterMouseDown:K,handleDockSplitterTouchStart:V}}M0();function B9(_,$){try{if(typeof window>"u")return $;let j=window.__PICLAW_SILENCE||{},Z=`__PICLAW_SILENCE_${_.toUpperCase()}_MS`,X=j[_]??window[Z],G=Number(X);return Number.isFinite(G)?G:$}catch{return $}}var cq=B9("warning",30000),hq=B9("finalize",120000),lq=B9("refresh",30000),pq=30000;function rq(_){let $={};return(_?.agents||[]).forEach((j)=>{$[j.id]=j}),$}function E6(){if(/iPad|iPhone/.test(navigator.userAgent))return!0;return navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1}function nq(_=30000){let[,$]=C(0);b(()=>{let j=setInterval(()=>$((Z)=>Z+1),_);return()=>clearInterval(j)},[_])}function dq(_,$=160){let j=String(_||"").replace(/\r\n/g,`
`);if(!j)return 0;return j.split(`
`).reduce((Z,X)=>Z+Math.max(1,Math.ceil(X.length/$)),0)}function l2(_){if(!_||typeof _!=="object")return null;let $=_.started_at??_.startedAt;if(typeof $!=="string"||!$)return null;let j=Date.parse($);return Number.isFinite(j)?j:null}function KJ(_){if(!_||typeof _!=="object")return null;let $=_.retry_at??_.retryAt;if(typeof $!=="string"||!$)return null;let j=Date.parse($);return Number.isFinite(j)?j:null}function o$(_){if(!_||typeof _!=="object")return null;let $=_.last_event_at??_.lastEventAt??_.started_at??_.startedAt;if(typeof $!=="string"||!$)return null;let j=Date.parse($);return Number.isFinite(j)?j:null}function E$(_){if(!_||typeof _!=="object")return!1;let $=_.intent_key??_.intentKey;return _.type==="intent"&&$==="compaction"}function p2(_){if(!_||typeof _!=="object")return"";let $=_.title;if(typeof $==="string"&&$.trim())return $.trim();let j=_.tool_name??_.toolName;if(typeof j==="string"&&j.trim())return j.trim();let Z=_.status;if(typeof Z==="string"&&Z.trim())return Z.trim();return E$(_)?"Compacting context":"Working..."}function oq(_){let $=Math.max(0,Math.floor(_/1000)),j=$%60,Z=Math.floor($/60)%60,X=Math.floor($/3600);if(X>0)return`${X}:${String(Z).padStart(2,"0")}:${String(j).padStart(2,"0")}`;return`${Z}:${String(j).padStart(2,"0")}`}function A6(_,$=Date.now()){let j=l2(_);if(j===null)return null;return oq(Math.max(0,$-j))}function iq(_,$=Date.now()){let j=KJ(_);if(j===null)return null;let Z=j-$;if(Z<=0)return"retrying now";return`retry in ${oq(Z)}`}M0();function NV(_={}){a_(_)}function BV(){let[_,$]=C(!1);if(b(()=>{let X=(q)=>{let Q=J5(q?.detail?.section);if(Q)try{window.__piclawSettingsRequestedSection=Q}catch(K){}$(!0)};window.addEventListener("piclaw:open-settings",X);let G=r2();if(G.open){if(G.section)try{window.__piclawSettingsRequestedSection=G.section}catch(q){}$(!0)}return()=>window.removeEventListener("piclaw:open-settings",X)},[]),!_)return null;let[j,Z]=C(null);if(b(()=>{Promise.resolve().then(() => (YV(),KV)).then((X)=>{Z(()=>X.SettingsDialogContent)})},[]),!j)return U`
            <div class="settings-dialog-backdrop" onClick=${()=>$(!1)}>
                <div class="settings-dialog settings-dialog-loading-shell" data-testid="settings-dialog">
                    <div class="settings-loading-shell-body">
                        <span class="settings-spinner"></span>
                        <span>Loading settings…</span>
                    </div>
                </div>
            </div>
        `;return U`
        <div class="settings-dialog-backdrop" onClick=${(X)=>{if(X.target===X.currentTarget)$(!1)}}>
            <${j} onClose=${()=>$(!1)} />
        </div>
    `}M0();function cE(_,$){return new URL(String(_||""),$).toString()}function FV(){let[_,$]=C(()=>typeof window>"u"?"http://localhost/":window.location.href);b(()=>{if(typeof window>"u")return;let X=()=>$(window.location.href);return window.addEventListener("popstate",X),()=>window.removeEventListener("popstate",X)},[]);let j=R((X,G={})=>{if(typeof window>"u")return;let{replace:q=!1}=G||{},Q=cE(X,window.location.href);if(q)window.history.replaceState(null,"",Q);else window.history.pushState(null,"",Q);$(window.location.href)},[]);return{locationParams:q0(()=>new URL(_).searchParams,[_]),navigate:j}}M0();M0();function UV(_,$,j,Z){try{let X=_?.getItem?.($),G=X?Number(X):Number.NaN;return Number.isFinite(G)&&G>=j?G:Z}catch(X){return Z}}function u9(_,$,j){try{return _?.setItem?.($,String(Math.round(j))),!0}catch(Z){return!1}}var hE=120,lE=100,pE=98304,v9=60,rE=220,m9="mdPreviewHeight";function nE(){return UV(localStorage,m9,v9,rE)}function Q8({getContent:_,subscribeContentChange:$,path:j,onClose:Z}){let[X,G]=C(""),[q,Q]=C(nE),K=g(null),V=g(null),Y=g(null),N=g(null),F=g(null),B=g(_),D=g($);return B.current=_,D.current=$,b(()=>{let z=!1,k=()=>{if(N.current!==null)clearTimeout(N.current),N.current=null},J=()=>{if(F.current!==null)clearTimeout(F.current),F.current=null},L=(M)=>{if(z)return;if(M===Y.current)return;if(Y.current=M,String(M||"").length>pE){G('<p style="color:var(--text-secondary)">Preview disabled for large documents to keep the editor responsive.</p>');return}try{let O=q_(M,null);G(O)}catch{G('<p style="color:var(--text-secondary)">Preview unavailable</p>')}},x=(M)=>{k(),N.current=setTimeout(()=>{N.current=null,L(M||"")},hE)},I=null,E=()=>{if(z||I)return;let M=typeof D.current==="function"?D.current((O)=>x(O||"")):null;if(typeof M==="function"){I=M;return}F.current=setTimeout(E,lE)};return L(B.current?.()||""),E(),()=>{if(z=!0,k(),J(),typeof I==="function")I()}},[j]),b(()=>{if(K.current&&X)L$(K.current).catch((z)=>{console.debug("[markdown-preview] Mermaid rendering failed for the live preview.",z,{path:j})})},[X]),U`
        <div
            class="md-preview-splitter"
            onMouseDown=${(z)=>{z.preventDefault();let k=z.clientY,J=V.current?.offsetHeight||q,L=V.current?.parentElement,x=L?L.offsetHeight*0.7:500,I=z.currentTarget;I.classList.add("dragging"),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let E=(O)=>{let T=Math.min(Math.max(J-(O.clientY-k),v9),x);Q(T)},M=()=>{I.classList.remove("dragging"),document.body.style.cursor="",document.body.style.userSelect="",u9(localStorage,m9,V.current?.offsetHeight||q),document.removeEventListener("mousemove",E),document.removeEventListener("mouseup",M)};document.addEventListener("mousemove",E),document.addEventListener("mouseup",M)}}
            onTouchStart=${(z)=>{z.preventDefault();let k=z.touches[0];if(!k)return;let J=k.clientY,L=V.current?.offsetHeight||q,x=V.current?.parentElement,I=x?x.offsetHeight*0.7:500,E=z.currentTarget;E.classList.add("dragging"),document.body.style.userSelect="none";let M=(T)=>{let y=T.touches[0];if(!y)return;T.preventDefault();let A=Math.min(Math.max(L-(y.clientY-J),v9),I);Q(A)},O=()=>{E.classList.remove("dragging"),document.body.style.userSelect="",u9(localStorage,m9,V.current?.offsetHeight||q),document.removeEventListener("touchmove",M),document.removeEventListener("touchend",O),document.removeEventListener("touchcancel",O)};document.addEventListener("touchmove",M,{passive:!1}),document.addEventListener("touchend",O),document.addEventListener("touchcancel",O)}}
        ></div>
        <div class="md-preview-panel" ref=${V} style=${{height:q+"px"}}>
            <div class="md-preview-header">
                <span class="md-preview-title">Preview</span>
                <button class="md-preview-close" onClick=${Z} title="Close preview" aria-label="Close preview">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                        <line x1="4" y1="4" x2="12" y2="12"/>
                        <line x1="12" y1="4" x2="4" y2="12"/>
                    </svg>
                </button>
            </div>
            <div
                class="md-preview-body post-content"
                ref=${K}
                dangerouslySetInnerHTML=${{__html:X}}
            />
        </div>
    `}function DV(_){if(_.branchLoaderMode)return"branch-loader";if(_.panePopoutMode)return"pane-popout";return"main"}function dE(_){return _==="error"?"Could not open branch window":"Opening branch…"}function zV(_){return U`
    <div class="app-shell chat-only">
      <div class="container" style=${{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"24px"}}>
        <div class="card" style=${{width:"min(560px, 100%)",padding:"24px"}}>
          <h1 style=${{margin:"0 0 12px",fontSize:"1.1rem"}}>
            ${dE(_.status)}
          </h1>
          <p style=${{margin:0,lineHeight:1.6}}>${_.message}</p>
        </div>
      </div>
    </div>
  `}function WV(_){let{appShellRef:$,editorOpen:j,hidePanePopoutControls:Z,panePopoutHasMenuActions:X,panePopoutTitle:G,tabStripTabs:q,tabStripActiveId:Q,handleTabActivate:K,previewTabs:V,diffTabs:Y,handleTabTogglePreview:N,handleTabToggleDiff:F,editorContainerRef:B,getPaneContent:D,subscribePaneContentChange:W,panePopoutPath:H}=_,z=j&&!Z&&X,k=G?`Pane window controls for ${G}`:"Pane window controls";return U`
    <div class=${`app-shell pane-popout${j?" editor-open":""}`} ref=${$}>
      <div class="editor-pane-container pane-popout-container">
        ${z&&U`
          <div class="pane-popout-hover-zone" aria-hidden="true"></div>
          <div class="pane-popout-controls" role="toolbar" aria-label=${k}>
            <details class="pane-popout-controls-menu">
              <summary
                class="pane-popout-controls-trigger pane-popout-controls-icon-button"
                aria-label=${k}
                title=${k}
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 4.75h10" />
                  <path d="M5 8h8" />
                  <path d="M7 11.25h6" />
                </svg>
              </summary>
              <div class="pane-popout-controls-panel">
                ${q.length>1&&U`
                  <div class="pane-popout-controls-section">
                    <div class="pane-popout-controls-section-title">Open panes</div>
                    <div class="pane-popout-controls-list">
                      ${q.map((J)=>U`
                        <button
                          type="button"
                          class=${`pane-popout-controls-item${J.id===Q?" active":""}`}
                          onClick=${(L)=>{K(J.id),L.currentTarget.closest("details")?.removeAttribute("open")}}
                        >
                          ${J.label}
                        </button>
                      `)}
                    </div>
                  </div>
                `}
                ${Q&&Y.has(Q)&&U`
                  <button
                    type="button"
                    class="pane-popout-controls-action"
                    onClick=${(J)=>{F(Q),J.currentTarget.closest("details")?.removeAttribute("open")}}
                  >
                    Hide diff
                  </button>
                `}
                ${Q&&V.has(Q)&&U`
                  <button
                    type="button"
                    class="pane-popout-controls-action"
                    onClick=${(J)=>{N(Q),J.currentTarget.closest("details")?.removeAttribute("open")}}
                  >
                    Hide preview
                  </button>
                `}
              </div>
            </details>
          </div>
        `}
        ${j?U`<div class="editor-pane-host" ref=${B}></div>`:U`
            <div class="card" style=${{margin:"24px",padding:"24px",maxWidth:"640px"}}>
              <h1 style=${{margin:"0 0 12px",fontSize:"1.1rem"}}>Opening pane…</h1>
              <p style=${{margin:0,lineHeight:1.6}}>${H||"No pane path provided."}</p>
            </div>
          `}
        ${j&&Q&&V.has(Q)&&U`
          <${Q8}
            getContent=${D}
            subscribeContentChange=${W}
            path=${Q}
            onClose=${()=>N(Q)}
          />
        `}
      </div>
    </div>
  `}M0();M0();function V8(_){return String(_||"").toLowerCase().replace(/^@/,"").replace(/\s+/g," ").trim()}function oE(_,$){let j=V8(_),Z=V8($);if(!Z)return!1;return j.startsWith(Z)||j.includes(Z)}function I6(_){if(!_)return!1;if(_.isComposing)return!1;if(_.ctrlKey||_.metaKey||_.altKey)return!1;return typeof _.key==="string"&&_.key.length===1&&/\S/.test(_.key)}function c9(_,$,j=Date.now(),Z=700){let X=_&&typeof _==="object"?_:{value:"",updatedAt:0},G=String($||"").trim().toLowerCase();if(!G)return{value:"",updatedAt:j};return{value:!X.value||!Number.isFinite(X.updatedAt)||j-X.updatedAt>Z?G:`${X.value}${G}`,updatedAt:j}}function iE(_,$){let j=Math.max(0,Number(_)||0);if(j<=0)return[];let X=((Number.isInteger($)?$:0)%j+j)%j,G=[];for(let q=0;q<j;q+=1)G.push((X+q)%j);return G}function sE(_,$,j=0,Z=(X)=>X){let X=V8($);if(!X)return-1;let G=Array.isArray(_)?_:[],q=iE(G.length,j),Q=G.map((K)=>V8(Z(K)));for(let K of q)if(Q[K].startsWith(X))return K;for(let K of q)if(Q[K].includes(X))return K;return-1}function h9(_,$,j=-1,Z=(X)=>X){let X=Array.isArray(_)?_:[];if(j>=0&&j<X.length){let G=Z(X[j]);if(oE(G,$))return j}return sE(X,$,0,Z)}T1();function K8(_){return String(_||"").trim().toLowerCase()}function l9(_){let $=String(_||"").match(/^@([a-zA-Z0-9_-]*)$/);if(!$)return null;return K8($[1]||"")}function aE(_){let $=new Set,j=[];for(let Z of Array.isArray(_)?_:[]){let X=K8(Z?.agent_name);if(!X||$.has(X))continue;$.add(X),j.push(Z)}return j}function HV(_,$,j={}){let Z=l9($);if(Z==null)return[];let X=typeof j?.currentChatJid==="string"?j.currentChatJid:null;return aE(_).filter((G)=>{if(X&&G?.chat_jid===X)return!1;return K8(G?.agent_name).startsWith(Z)})}function p9(_){let $=K8(_);return $?`@${$} `:""}function OV(_={}){if(_.searchMode)return!1;return Boolean(_.showSessionSwitcherButton)}function LV(_,$,j={}){if(!_||_.isComposing)return!1;if(!OV(j))return!1;if(_.ctrlKey||_.metaKey||_.altKey)return!1;if(_.key!=="@")return!1;return String($||"")===""}function r9(_,$={}){if(!OV($))return!1;return String(_||"")==="@"}function n9(_){let $=d9(_);return $?`@${$}`:""}function d9(_){return String(_||"").trim().toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").replace(/-{2,}/g,"-")}function Y8(_,$=""){let j=String(_||""),Z=d9(j),X=d9($);if(!j.trim())return{normalized:Z,handle:"",canSubmit:!1,kind:"error",message:"Enter a branch handle."};if(!Z)return{normalized:Z,handle:"",canSubmit:!1,kind:"error",message:"Handle must contain at least one letter or number."};let G=`@${Z}`;if(Z===X)return{normalized:Z,handle:G,canSubmit:!1,kind:"info",message:`Already using ${G}.`};if(Z!==j.trim())return{normalized:Z,handle:G,canSubmit:!0,kind:"info",message:`Will save as ${G}. Letters, numbers, - and _ are allowed; leading @ is optional.`};return{normalized:Z,handle:G,canSubmit:!0,kind:"success",message:`Saving as ${G}.`}}function tE(_,$={}){let j=[],Z=typeof $.currentChatJid==="string"?$.currentChatJid.trim():"",X=typeof _?.chat_jid==="string"?_.chat_jid.trim():"";if(Z&&X===Z)j.push("current");if(_?.archived_at)j.push("archived");else if(_?.is_active)j.push("active");return j}function N8(_,$={}){let j=n9(_?.agent_name)||String(_?.chat_jid||"").trim(),Z=typeof _?.chat_jid==="string"&&_.chat_jid.trim()?_.chat_jid.trim():"unknown-chat",X=tE(_,$);return X.length>0?`${j} — ${Z} • ${X.join(" • ")}`:`${j} — ${Z}`}function JV(_,$,j){let Z=n9(_),X=n9($),G=String(j||"").trim();if(Z&&X&&Z!==X)return`Restored archived ${Z} as ${X} because ${Z} is already in use.`;if(X)return`Restored ${X}.`;if(Z)return`Restored ${Z}.`;return`Restored ${G||"branch"}.`}function B8({steerQueued:_=!1,pulsing:$=!1}={}){let j=["turn-dot"];if(_)j.push("turn-dot-queued");if($)j.push("turn-dot-pulsing");return j.join(" ")}function o9({pulsing:_=!1}={}){let $=["compose-inline-status-dot"];if(_)$.push("compose-inline-status-dot-pulsing");return $.join(" ")}function x6(_,{isLastActivity:$=!1,pendingRequest:j=!1}={}){if(j)return"dot";if($)return"none";if(_?.type==="error")return"none";let Z=typeof _?.type==="string"?_.type:"";if(Boolean(typeof _?.tool_name==="string"&&_.tool_name.trim()||_?.tool_args))return"spinner";if(_?.type==="intent")return"dot";if(Z==="tool_call"||Z==="tool_status"||Z==="thinking"||Z==="waiting")return"spinner";return"dot"}function EV(_,$={}){return x6(_,$)==="dot"}M0();var AV=350;function eE(_){return String(_||"Connecting").replace(/[-_]+/g," ").replace(/^./,($)=>$.toUpperCase())}function _A(_,$={}){let j=typeof _==="string"&&_.trim()?_.trim():"connecting";if(j==="connected")return{show:!1,statusClass:"connected",label:"Connected",title:"Connection: Connected"};if(j!=="disconnected"){let Q=eE(j);return{show:!0,statusClass:j,label:Q,title:`Connection: ${Q}`}}let Z=Number.isFinite(Number($?.delayMs))?Math.max(0,Number($.delayMs)):AV,X=Number.isFinite(Number($?.nowMs))?Number($.nowMs):Date.now(),G=Number.isFinite(Number($?.disconnectedAtMs))?Number($.disconnectedAtMs):X;return X-G>=Z?{show:!0,statusClass:"disconnected",label:"Reconnecting",title:"Reconnecting"}:{show:!1,statusClass:"connecting",label:"Connecting",title:"Connecting"}}function i9(_,$={}){let j=Number.isFinite(Number($?.delayMs))?Math.max(0,Number($.delayMs)):AV,[Z,X]=C(null),[G,q]=C(()=>Date.now());return b(()=>{if(_==="disconnected"){let Q=Date.now();X((K)=>K??Q),q(Q);return}X(null),q(Date.now())},[_]),b(()=>{if(_!=="disconnected"||Z===null)return;let Q=j-(Date.now()-Z);if(Q<=0)return;let K=0,V=0,Y=setTimeout(()=>{if(typeof requestAnimationFrame!=="function"){q(Date.now());return}K=requestAnimationFrame(()=>{V=requestAnimationFrame(()=>{q(Date.now())})})},Q);return()=>{if(clearTimeout(Y),K)cancelAnimationFrame(K);if(V)cancelAnimationFrame(V)}},[_,Z,j]),q0(()=>_A(_,{delayMs:j,disconnectedAtMs:Z,nowMs:G}),[_,j,Z,G])}M0();function K_({prefix:_="file",label:$,title:j,onRemove:Z,onClick:X,removeTitle:G="Remove",icon:q="file"}){let Q=`${_}-file-pill`,K=`${_}-file-name`,V=`${_}-file-remove`,Y=q==="message"?U`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>`:q==="folder"?U`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>`:U`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>`;return U`
    <span class=${Q} title=${j||$} onClick=${X}>
      ${Y}
      <span class=${K}>${$}</span>
      ${Z&&U`
        <button
          class=${V}
          onClick=${(N)=>{N.preventDefault(),N.stopPropagation(),Z()}}
          title=${G}
          type="button"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      `}
    </span>
  `}async function s9(_,$,j){if(typeof _!=="function")return!1;try{let Z=await _($);if(!Z)return!1;return j(Z),!0}catch(Z){return!1}}function $A(_={}){let $=_.navigator??(typeof navigator<"u"?navigator:null);if(!$)return!1;let j=String($.userAgent||"");if(/iPad|iPhone/.test(j))return!0;return $.platform==="MacIntel"&&Number($.maxTouchPoints||0)>1}function jA(_={}){let $=_.window??(typeof window<"u"?window:null);if(!$)return null;return $.SpeechRecognition||$.webkitSpeechRecognition||null}function a9(_={}){let $=_.window??(typeof window<"u"?window:null),j=typeof _.secureContext==="boolean"?_.secureContext:Boolean($?.isSecureContext),Z=b_(_),X=$A(_),G=jA(_);if(!j)return{mode:"unavailable",showButton:!1,canStart:!1,reason:"secure-context-required",title:"Voice input requires HTTPS",detail:"Native browser speech input needs a secure context (HTTPS or localhost).",recognitionCtor:null,ios:X,standalone:Z,secureContext:j};if(X&&Z)return{mode:"fallback",showButton:!0,canStart:!1,reason:"ios-standalone-fallback",title:"Use keyboard dictation",detail:"Speech input is intentionally downgraded in iPhone/iPad standalone web apps because browser-native recognition is not reliable there. Focus the compose box and use the keyboard dictation mic instead.",recognitionCtor:G,ios:X,standalone:Z,secureContext:j};if(!G){if(X)return{mode:"fallback",showButton:!0,canStart:!1,reason:"ios-keyboard-dictation",title:"Use keyboard dictation",detail:"This browser does not expose native in-page speech recognition here. Focus the compose box and use the keyboard dictation mic instead.",recognitionCtor:null,ios:X,standalone:Z,secureContext:j};return{mode:"unavailable",showButton:!1,canStart:!1,reason:"unsupported",title:"Voice input unavailable",detail:"This browser does not expose native speech recognition in this context.",recognitionCtor:null,ios:X,standalone:Z,secureContext:j}}return{mode:"native",showButton:!0,canStart:!0,reason:"supported",title:"Start voice input",detail:X?"Browser-native speech input is available here, but Safari/WebKit reliability may still vary.":"Browser-native speech input is available.",recognitionCtor:G,ios:X,standalone:Z,secureContext:j}}function MV(_,$="",j=""){let Z=String(_||""),X=String($||"").trim(),G=String(j||"").trim(),q=[X,G].filter(Boolean).join(" ").trim();if(!q)return Z;if(!Z)return q;let Q=/[\s\n]$/.test(Z)?"":" ";return`${Z}${Q}${q}`}function kV(_,$=0){let j="",Z="",X=_&&typeof _.length==="number"?_:[];for(let G=Math.max(0,$);G<X.length;G+=1){let q=X[G];if(!q||!q[0])continue;let Q=String(q[0].transcript||"").trim();if(!Q)continue;if(q.isFinal)j=`${j} ${Q}`.trim();else Z=`${Z} ${Q}`.trim()}return{finalText:j,interimText:Z}}function t9(_,$=null){let j=String(_||"").trim().toLowerCase();switch(j){case"not-allowed":case"service-not-allowed":return $?.ios?"Microphone or speech-recognition permission was denied. On iPhone/iPad, using keyboard dictation may be more reliable.":"Microphone or speech-recognition permission was denied by the browser.";case"no-speech":return"No speech was detected. Try again and speak after the listening indicator appears.";case"audio-capture":return"The browser could not access a microphone for speech recognition.";case"network":return"The browser speech-recognition service reported a network or service failure.";case"aborted":return"Voice input was stopped.";default:return j?`Voice input failed (${j}).`:"Voice input failed."}}var ZA=[{name:"/model",description:"Select model or list available models"},{name:"/cycle-model",description:"Cycle to the next available model"},{name:"/thinking",description:"Show or set thinking/effort level"},{name:"/effort",description:"Show or set thinking/effort level (alias for /thinking)"},{name:"/cycle-thinking",description:"Cycle thinking level"},{name:"/theme",description:"Set UI theme (no name to show available themes)"},{name:"/meters",description:"Toggle the top-right CPU/RAM HUD (/meters on|off|toggle)"},{name:"/tint",description:"Tint default light/dark UI (usage: /tint #hex or /tint off)"},{name:"/btw",description:"Open a side conversation panel without interrupting the main chat"},{name:"/state",description:"Show current session state"},{name:"/stats",description:"Show session token and cost stats"},{name:"/context",description:"Show context window usage"},{name:"/last",description:"Show last assistant response"},{name:"/compact",description:"Manually compact the session"},{name:"/auto-compact",description:"Toggle auto-compaction"},{name:"/auto-retry",description:"Toggle auto-retry"},{name:"/abort",description:"Abort the current response"},{name:"/abort-retry",description:"Abort retry backoff"},{name:"/abort-bash",description:"Abort running bash command"},{name:"/shell",description:"Run a shell command and return output"},{name:"/bash",description:"Run a shell command and add output to context"},{name:"/queue",description:"Queue a follow-up message (one-at-a-time)"},{name:"/queue-all",description:"Queue a follow-up message (batch all)"},{name:"/steer",description:"Steer the current response"},{name:"/steering-mode",description:"Set steering mode (all|one)"},{name:"/followup-mode",description:"Set follow-up mode (all|one)"},{name:"/session-name",description:"Set or show the session name"},{name:"/new-session",description:"Start a new session"},{name:"/switch-session",description:"Switch to a session file"},{name:"/session-rotate",description:"Rotate the current persisted session into an archived file"},{name:"/rollup",description:"Merge the current branch chat back into its parent chat"},{name:"/clone",description:"Duplicate the current active branch into a new session"},{name:"/fork",description:"Fork from a previous message"},{name:"/forks",description:"List forkable messages"},{name:"/tree",description:"List the session tree"},{name:"/label",description:"Set or clear a label on a tree entry"},{name:"/labels",description:"List labeled entries"},{name:"/agent-name",description:"Set or show the agent display name"},{name:"/agent-avatar",description:"Set or show the agent avatar URL"},{name:"/user-name",description:"Set or show your display name"},{name:"/user-avatar",description:"Set or show your avatar URL"},{name:"/user-github",description:"Set name/avatar from GitHub profile"},{name:"/export-html",description:"Export session to HTML"},{name:"/passkey",description:"Manage passkeys (enrol/list/delete)"},{name:"/totp",description:"Show a TOTP enrolment QR code"},{name:"/qr",description:"Generate a QR code for text or URL"},{name:"/search",description:"Search notes and skills in the workspace"},{name:"/dream",description:"Run Dream memory maintenance over recent days (default 7)"},{name:"/tasks",description:"List scheduled tasks"},{name:"/scheduled",description:"List scheduled tasks"},{name:"/pair",description:"Manage remote peer connections (/pair request <url> | /pair list)"},{name:"/ask",description:"Send a prompt to a paired remote instance (/ask <instance_id|fingerprint> <prompt>)"},{name:"/restart",description:"Restart the agent and stop subprocesses"},{name:"/exit",description:"Exit the current piclaw process immediately (Supervisor will restart it)"},{name:"/login",description:"Login to an AI model provider (OAuth or API key)"},{name:"/logout",description:"Logout from an AI model provider"},{name:"/settings",description:"Open the settings pane"},{name:"/help",description:"Open keyboard shortcuts help"},{name:"/commands",description:"List available commands"},{name:"/skill:",description:"Run a workspace skill (e.g. /skill:visual-artifact-generator, /skill:web-search)"}],TV="piclaw_compose_history";function XA(_,$,j=!1){if(j)return{shouldApply:!1,nextToken:$,text:""};if(!_||typeof _!=="object")return{shouldApply:!1,nextToken:$,text:""};let Z=typeof _.token==="string"?_.token:"",X=typeof _.text==="string"?_.text:"";if(!Z||Z===$||!X.trim())return{shouldApply:!1,nextToken:$,text:""};return{shouldApply:!0,nextToken:Z,text:X}}function GA(_="web:default"){let $=typeof _==="string"&&_.trim()?_.trim():"web:default";if($==="web:default")return TV;return`${TV}:${encodeURIComponent($)}`}function qA(_,$=null){let j=new Set,Z=[];for(let X of Array.isArray(_)?_:[]){let G=typeof X?.chat_jid==="string"?X.chat_jid.trim():"";if(!G||j.has(G))continue;if(!(typeof X?.agent_name==="string"?X.agent_name.trim():""))continue;j.add(G),Z.push(X)}return Z.sort((X,G)=>{let q=Boolean(X?.archived_at),Q=Boolean(G?.archived_at);if(q!==Q)return q?1:-1;let K=String(X?.agent_name||"").trim(),V=String(G?.agent_name||"").trim(),Y=K.localeCompare(V,void 0,{sensitivity:"base"});if(Y!==0)return Y;let N=String(X?.chat_jid||"").trim(),F=String(G?.chat_jid||"").trim();return N.localeCompare(F,void 0,{sensitivity:"base"})}),Z}function QA(_){return Boolean(_?.is_active&&!_?.archived_at)}function VA(_,$=null){let j=Array.isArray(_)?_:[],Z=typeof $==="string"?$.trim():"";if(Z){let G=j.findIndex((q)=>{if(q?.disabled)return!1;if(q?.type!=="session")return!1;return(typeof q?.chat?.chat_jid==="string"?q.chat.chat_jid.trim():"")===Z});if(G>=0)return G}let X=j.findIndex((G)=>!G?.disabled);return X>=0?X:0}function yV(_,$){let j=typeof $?.command?.message==="string"?$.command.message.trim():"";if(!$?.ui_only||!j)return null;let Z=typeof _==="string"?_.trim():"";if(!Z.startsWith("/"))return null;let X=Z.split(/\s+/).filter(Boolean),G=X[0]?.toLowerCase()||"";if(!(X.length>1)&&(G==="/model"||G==="/thinking"||G==="/effort"))return j;return null}function KA(_,$,j=!1){if(_)return{mode:"queue",className:"icon-btn send-btn queue-mode",title:"Queue follow-up (Enter)",ariaLabel:"Queue follow-up message",disabled:!$};return{mode:"send",className:"icon-btn send-btn",title:"Send (Enter)",ariaLabel:"Send message",disabled:!$}}function wV(_,$,j={}){if(!_||j.searchMode)return!1;if(!(_.key===" "||_.key==="Spacebar"||_.code==="Space"))return!1;if(_.ctrlKey||_.metaKey||_.altKey||_.repeat)return!1;if(!j.speechButtonVisible||j.speechButtonActive)return!1;if(!j.canStartSpeech)return!1;return String($||"").trim().length===0}function YA(_,$){if(!$||!_)return!1;return _.key===" "||_.key==="Spacebar"||_.code==="Space"}function NA(_,$=!1){if(!_)return null;if($)return{mode:"compacting",className:"icon-btn send-btn abort-mode compacting-mode",title:"Compacting context — Stop response",ariaLabel:"Compacting context — Stop response",disabled:!1};return{mode:"abort",className:"icon-btn send-btn abort-mode",title:"Stop response",ariaLabel:"Stop response",disabled:!1}}function BA(_){return _==="abort"||_==="compacting"}function FA(_,$=0){if(_?.visible===!1)return{visible:!1,title:"",indicatorText:null,animateDot:!1,animateSpinner:!1};let j=typeof _?.message==="string"&&_.message.trim()?_.message.trim():null,Z=_?.indicator&&typeof _.indicator==="object"?_.indicator:null;if(!j&&!Z)return{visible:!1,title:"",indicatorText:null,animateDot:!1,animateSpinner:!1};if(Z?.mode==="hidden")return{visible:Boolean(j),title:j||"Working…",indicatorText:null,animateDot:!1,animateSpinner:!1};if(Z?.mode==="custom"&&Array.isArray(Z.frames)&&Z.frames.length>0){let X=Z.frames,G=Number.isFinite($)&&$>=0?Math.floor($)%X.length:0;return{visible:!0,title:j||"Working…",indicatorText:X[G],animateDot:!1,animateSpinner:!1}}return{visible:!0,title:j||"Working…",indicatorText:null,animateDot:!1,animateSpinner:!0}}function UA({usage:_,onCompact:$,compactionLabel:j="",compactionTitle:Z=""}){let X=Math.min(100,Math.max(0,_.percent||0)),G=_.tokens,q=_.contextWindow,Q="Compact context",K=G!=null?`Context: ${C6(G)} / ${C6(q)} tokens (${X.toFixed(0)}%)`:`Context: ${X.toFixed(0)}%`,V=typeof j==="string"?j.trim():"",Y=typeof Z==="string"?Z.trim():"",N=V?`${K} — ${Y||"Smart compaction"} · ${V}`:`${K} — ${"Compact context"}`,F=9,B=2*Math.PI*9,D=X/100*B,W=X>90?"var(--context-red, #ef4444)":X>75?"var(--context-amber, #f59e0b)":"var(--context-green, #22c55e)";return U`
        <button
            class=${`compose-context-pie icon-btn${V?" is-compacting":""}`}
            type="button"
            title=${N}
            aria-label=${V?`Smart compaction ${V}`:"Compact context"}
            onClick=${(H)=>{H.preventDefault(),H.stopPropagation(),$?.()}}
        >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r=${9}
                    fill="none"
                    stroke="var(--context-track, rgba(128,128,128,0.2))"
                    stroke-width="2.5" />
                <circle cx="12" cy="12" r=${9}
                    fill="none"
                    stroke=${W}
                    stroke-width="2.5"
                    stroke-dasharray=${`${D} ${B}`}
                    stroke-linecap="round"
                    transform="rotate(-90 12 12)" />
            </svg>
            ${V&&U`<span class="compose-context-pie-timer">${V}</span>`}
        </button>
    `}function C6(_){if(_==null)return"?";if(_>=1e6)return(_/1e6).toFixed(1)+"M";if(_>=1000)return(_/1000).toFixed(0)+"K";return String(_)}function DA(_){let $=Number(_?.tokens);return Number.isFinite($)&&$>0?$:null}function IV(_,$){let j=Number(_?.contextWindow??_?.context_window),Z=DA($);if(!Number.isFinite(j)||j<=0||!Number.isFinite(Z)||Z<=0)return{blocked:!1,note:"",title:"",tokens:Z??null,contextWindow:Number.isFinite(j)&&j>0?j:null};if(Z<=j)return{blocked:!1,note:"",title:"",tokens:Z,contextWindow:j};return{blocked:!0,note:"Current context won’t fit — compact first",title:`Current context uses ${C6(Z)} tokens, but this model only fits ${C6(j)}. Compact first.`,tokens:Z,contextWindow:j}}function e9(_){let $=Number(_);if(!Number.isFinite($)||$<=0)return"";return`${C6($)} ctx`}function zA(_,$){let j=typeof _==="string"?_.trim():"",Z=e9($);if(!j)return Z;if(!Z)return j;return`${j} • ${Z}`}function WA(_,$="",j=""){let Z=typeof _==="string"?_.trim():"";if(Z)return Z;let X=typeof $==="string"?$.trim():"",G=typeof j==="string"?j.trim():"";if(X&&G)return`${X}/${G}`;return G||X||""}function PV(_){let $=Array.isArray(_?.model_options)?_.model_options:null,j=Array.isArray(_?.models)?_.models:[],Z=$&&$.length>0?$:j,X=[];for(let G of Z){if(typeof G==="string"){let N=G.trim();if(!N)continue;let F=N.indexOf("/"),B=F>0?N.slice(0,F).trim():"",D=F>0?N.slice(F+1).trim():N;X.push({label:N,provider:B,id:D,name:null,contextWindow:null,reasoning:!1});continue}if(!G||typeof G!=="object")continue;let q=typeof G.provider==="string"?G.provider.trim():"",Q=typeof G.id==="string"?G.id.trim():"",K=WA(G.label,q,Q);if(!K)continue;let V=typeof G.name==="string"&&G.name.trim()?G.name.trim():null,Y=Number(G.context_window??G.contextWindow);X.push({label:K,provider:q,id:Q,name:V,contextWindow:Number.isFinite(Y)&&Y>0?Y:null,reasoning:Boolean(G.reasoning)})}return X.sort((G,q)=>G.label.localeCompare(q.label,void 0,{sensitivity:"base"})),X}function HA(_){if(!_||typeof _!=="object")return"";return[_.label,_.provider,_.id,_.name,e9(_.contextWindow)].filter(Boolean).join(" ")}function OA(_,$){let j=typeof _==="string"?_.trim():"";if(j)return{showPicker:!0,label:j,hasAvailableModels:!0};let Z=PV($).length>0;return{showPicker:Z,label:Z?"Select model":"",hasAvailableModels:Z}}function F8(_){return(typeof _==="string"?_.trim():"")||null}function xV(_){return F8(_)?.toLowerCase()??null}function CV(_,$){let j=xV(_),Z=xV($);if(!j||!Z)return!1;return j===Z||j.endsWith(`/${Z}`)||Z.endsWith(`/${j}`)}function LA(_,$){let j=$&&typeof $==="object"?$:{},Z=F8(j.latest_response_model??j.response_model??j.responseModel??j.routed_model??j.routedModel);if(!Z)return null;let X=F8(j.latest_requested_model??j.requested_model??j.requestedModel??j.current??j.model??_);if(X&&CV(Z,X))return null;let G=F8(_??j.current??j.model);if(G&&X&&!CV(G,X))return null;return{label:`Routed: ${Z}`,title:X?`Requested model: ${X} • Routed model: ${Z}`:`Routed model: ${Z}`,requestedModel:X,responseModel:Z}}function JA(_){if(!_)return _;let $=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`);if(!$.includes(" @ ")||!$.includes(`:
`))return _;let j=$.split(`
`),Z=[],X=0,G=!1;while(X<j.length){let Q=j[X].trim();if(!Q){X+=1;continue}if(Q==="Messages:"||Q.startsWith("Channel:")||Q.startsWith("Chat:")){G=!0,X+=1;continue}if(/^[^\n]+\s@\s[^\n]+:$/.test(Q)){G=!0,X+=1;let K=[];while(X<j.length){let V=j[X],Y=V.trim();if(/^[^\n]+\s@\s[^\n]+:$/.test(Y))break;if(Y.startsWith("Channel:")||Y.startsWith("Chat:")||Y==="Messages:")break;K.push(V.startsWith("  ")?V.slice(2):V),X+=1}if(K.length>0)Z.push(K.join(`
`).trim());continue}return _}return G&&Z.length>0?Z.filter(Boolean).join(`

`):_}function fV(_){let $=String(_||"").trim(),j=$.match(/^`([^`]+)`$/);return(j?j[1]:$).trim()}function EA(_){if(!_)return{content:_,fileRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),Z=-1;for(let V=0;V<j.length;V+=1)if(j[V].trim()==="Files:"&&j[V+1]&&/^\s*-\s+/.test(j[V+1])){Z=V;break}if(Z===-1)return{content:_,fileRefs:[]};let X=[],G=Z+1;for(;G<j.length;G+=1){let V=j[G];if(/^\s*-\s+/.test(V)){let Y=fV(V.replace(/^\s*-\s+/,"").trim());if(Y)X.push(Y)}else if(!V.trim())break;else break}if(X.length===0)return{content:_,fileRefs:[]};let q=j.slice(0,Z),Q=j.slice(G);return{content:[...q,...Q].join(`
`).replace(/\n{3,}/g,`

`).trim(),fileRefs:X}}function AA(_){if(!_)return{content:_,folderRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),Z=-1;for(let V=0;V<j.length;V+=1)if(j[V].trim()==="Folders:"&&j[V+1]&&/^\s*-\s+/.test(j[V+1])){Z=V;break}if(Z===-1)return{content:_,folderRefs:[]};let X=[],G=Z+1;for(;G<j.length;G+=1){let V=j[G];if(/^\s*-\s+/.test(V)){let Y=fV(V.replace(/^\s*-\s+/,"").trim());if(Y)X.push(Y)}else if(!V.trim())break;else break}if(X.length===0)return{content:_,folderRefs:[]};let q=j.slice(0,Z),Q=j.slice(G);return{content:[...q,...Q].join(`
`).replace(/\n{3,}/g,`

`).trim(),folderRefs:X}}function MA(_){if(!_)return{content:_,messageRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),Z=-1;for(let V=0;V<j.length;V+=1)if(j[V].trim()==="Referenced messages:"&&j[V+1]&&/^\s*-\s+/.test(j[V+1])){Z=V;break}if(Z===-1)return{content:_,messageRefs:[]};let X=[],G=Z+1;for(;G<j.length;G+=1){let V=j[G];if(/^\s*-\s+/.test(V)){let Y=V.replace(/^\s*-\s+/,"").trim().match(/^message:(\S+)$/i);if(Y)X.push(Y[1])}else if(!V.trim())break;else break}if(X.length===0)return{content:_,messageRefs:[]};let q=j.slice(0,Z),Q=j.slice(G);return{content:[...q,...Q].join(`
`).replace(/\n{3,}/g,`

`).trim(),messageRefs:X}}function kA(_){if(!_)return{content:_,attachmentRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),Z=-1;for(let V=0;V<j.length;V+=1)if(j[V].trim()==="Attachments:"&&j[V+1]&&/^\s*-\s+/.test(j[V+1])){Z=V;break}if(Z===-1)return{content:_,attachmentRefs:[]};let X=[],G=Z+1;for(;G<j.length;G+=1){let V=j[G];if(/^\s*-\s+/.test(V)){let Y=V.replace(/^\s*-\s+/,"").trim(),N=Y.match(/^attachment:(\d+)(?:\s*\((.+)\))?$/i);if(N)X.push({id:N[1],label:(N[2]||"").trim()||`attachment:${N[1]}`,raw:Y})}else if(!V.trim())break;else break}if(X.length===0)return{content:_,attachmentRefs:[]};let q=j.slice(0,Z),Q=j.slice(G);return{content:[...q,...Q].join(`
`).replace(/\n{3,}/g,`

`).trim(),attachmentRefs:X}}function RV(_){let $=JA(_||""),j=EA($||""),Z=AA(j.content||""),X=MA(Z.content||""),G=kA(X.content||"");return{text:G.content||"",fileRefs:j.fileRefs,folderRefs:Z.folderRefs,messageRefs:X.messageRefs,attachmentRefs:G.attachmentRefs}}function TA(_){let $=RV(_),j=$.attachmentRefs.length>0?`Attachments:
${$.attachmentRefs.map((X)=>`- ${X.raw}`).join(`
`)}`:"";return{content:[String($.text||"").trim(),j].filter(Boolean).join(`

`).trim(),fileRefs:[...$.fileRefs],folderRefs:[...$.folderRefs],messageRefs:[...$.messageRefs],attachmentRefs:[...$.attachmentRefs]}}function yA(_){let{queuedItem:$,buildDraft:j=TA,onRemoveQueuedFollowup:Z,setSubmitError:X,setSubmitNotice:G,setMediaFiles:q,onSetFileRefs:Q,onSetFolderRefs:K,onSetMessageRefs:V,setContent:Y,textareaRef:N,resizeTextarea:F=()=>{},scheduleTimeout:B=(k,J=0)=>setTimeout(k,J),scheduleRaf:D=(k)=>requestAnimationFrame(k),logger:W=console}=_||{};if(!$)return!1;let H=j($?.content||""),z=H.content;return W?.info?.("[compose-box] Returning queued item to editor",{text:z?.slice(0,80),fileRefs:H.fileRefs?.length,folderRefs:H.folderRefs?.length,messageRefs:H.messageRefs?.length}),X?.(null),G?.(null),q?.([]),Q?.(H.fileRefs),K?.(H.folderRefs),V?.(H.messageRefs),Y?.(z),D(()=>{let k=N?.current;if(!k)return;if(k.value=z,typeof k.dispatchEvent==="function")k.dispatchEvent(new Event("input",{bubbles:!0}));F();let J=z.length;k.selectionStart=J,k.selectionEnd=J,k.focus()}),B(()=>{try{Z?.($)}catch(k){W?.warn?.("[compose-box] Failed to remove returned queued follow-up.",k)}},0),!0}function wA({items:_=[],onInjectQueuedFollowup:$,onRemoveQueuedFollowup:j,onMoveQueuedFollowup:Z,onReturnQueuedFollowup:X,onOpenFilePill:G}){if(!Array.isArray(_)||_.length===0)return null;return U`
        <div class="compose-queue-stack">
            ${_.map((q,Q)=>{let K=typeof q?.content==="string"?q.content:"",V=RV(K);if(!V.text.trim()&&V.fileRefs.length===0&&V.folderRefs.length===0&&V.messageRefs.length===0&&V.attachmentRefs.length===0)return null;let Y=Q>0,N=Q<_.length-1,F=!0;return U`
                    <div class="compose-queue-stack-item" data-testid="queue-item" role="listitem">
                        <div class="compose-queue-stack-content" title=${K}>
                            ${V.text.trim()&&U`<div class="compose-queue-stack-text">${V.text}</div>`}
                            ${(V.messageRefs.length>0||V.fileRefs.length>0||V.folderRefs.length>0||V.attachmentRefs.length>0)&&U`
                                <div class="compose-queue-stack-refs">
                                    ${V.messageRefs.map((B)=>U`
                                        <${K_}
                                            key=${"queue-msg-"+B}
                                            prefix="compose"
                                            label=${"msg:"+B}
                                            title=${"Message reference: "+B}
                                            icon="message"
                                        />
                                    `)}
                                    ${V.fileRefs.map((B)=>{let D=B.split("/").pop()||B;return U`
                                            <${K_}
                                                key=${"queue-file-"+B}
                                                prefix="compose"
                                                label=${D}
                                                title=${B}
                                                onClick=${()=>G?.(B)}
                                            />
                                        `})}
                                    ${V.folderRefs.map((B)=>{let D=B.split("/").pop()||B;return U`
                                            <${K_}
                                                key=${"queue-folder-"+B}
                                                prefix="compose"
                                                label=${D}
                                                title=${B}
                                                icon="folder"
                                                onClick=${()=>G?.(B)}
                                            />
                                        `})}
                                    ${V.attachmentRefs.map((B)=>U`
                                        <${K_}
                                            key=${"queue-attachment-"+B.id}
                                            prefix="compose"
                                            label=${B.label}
                                            title=${B.raw}
                                        />
                                    `)}
                                </div>
                            `}
                        </div>
                        <div class="compose-queue-stack-actions" role="group" aria-label="Queued follow-up controls">
                            ${_.length>1&&U`
                                <button
                                    class="compose-queue-stack-move-btn"
                                    data-action="move-up"
                                    type="button"
                                    title="Move up"
                                    aria-label="Move up in queue"
                                    disabled=${!Y}
                                    onClick=${()=>Y&&Z?.(Q,Q-1)}
                                >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </button>
                                <button
                                    class="compose-queue-stack-move-btn"
                                    data-action="move-down"
                                    type="button"
                                    title="Move down"
                                    aria-label="Move down in queue"
                                    disabled=${!N}
                                    onClick=${()=>N&&Z?.(Q,Q+1)}
                                >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                            `}
                            ${F&&U`
                                <button
                                    class="compose-queue-stack-move-btn queue-edit"
                                    data-action="edit"
                                    type="button"
                                    title="Edit in compose"
                                    aria-label="Return queued message to editor"
                                    onClick=${(B)=>{B.stopPropagation(),X?.(q)}}
                                >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </button>
                            `}
                            <button
                                class="compose-queue-stack-steer-btn"
                                type="button"
                                title="Inject queued follow-up as steer"
                                aria-label="Inject queued follow-up as steer"
                                onClick=${()=>$?.(q)}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 20h12a2 2 0 0 0 2-2V8" />
                                    <polyline points="14 12 18 8 22 12" />
                                </svg>
                                <span>Steer</span>
                            </button>
                            <button
                                class="compose-queue-stack-close-btn queue-remove"
                                data-action="remove"
                                type="button"
                                title="Cancel queued message"
                                aria-label="Cancel queued message"
                                onClick=${()=>j?.(q)}
                            >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                `})}
        </div>
    `}function SV({onPost:_,onFocus:$,searchMode:j,searchScope:Z="current",onSearch:X,onSearchScopeChange:G,onEnterSearch:q,onExitSearch:Q,fileRefs:K=[],onRemoveFileRef:V,onClearFileRefs:Y,folderRefs:N=[],onRemoveFolderRef:F,onClearFolderRefs:B,messageRefs:D=[],onRemoveMessageRef:W,onClearMessageRefs:H,activeModel:z=null,agentModelsPayload:k=null,modelUsage:J=null,thinkingLevel:L=null,supportsThinking:x=!1,contextUsage:I=null,onContextCompact:E,notificationsEnabled:M=!1,notificationPermission:O="default",onToggleNotifications:T,onModelChange:y,onModelStateChange:A,activeEditorPath:P=null,onAttachEditorFile:f,onOpenFilePill:u,followupQueueItems:c=[],onInjectQueuedFollowup:r,onRemoveQueuedFollowup:e,onMoveQueuedFollowup:m,onSubmitIntercept:_0,onMessageResponse:H0,isAgentActive:X0=!1,activeChatAgents:j0=[],currentChatJid:Q0="web:default",connectionStatus:F0="connected",stateAccessFailed:h=!1,onSetFileRefs:$0,onSetFolderRefs:K0,onSetMessageRefs:L0,onSubmitError:a,onSwitchChat:G0,onRenameSession:O0,isRenameSessionInProgress:P0=!1,onCreateSession:p0,onCreateRootSession:g0,onDeleteSession:X1,onPurgeArchivedSession:l0,onRestoreSession:a0,showQueueStack:f0=!0,statusNotice:i0=null,extensionWorkingState:m0=null,prefillRequest:e0=null}){let[s0,D1]=C(""),[G1,c0]=C(""),[J0,V1]=C(!1),[o0,H1]=C(!1),[z0,b0]=C("or"),[x0,n0]=C([]),[E1,Y1]=C(!1),[z1,U1]=C([]),[A1,x1]=C(0),[f1,O1]=C(!1),s1=g(null),[R1,V0]=C([]),[v,n]=C(0),[s,Z0]=C(!1),[U0,T0]=C(!1),[A0,k0]=C(!1),[y0,h0]=C(!1),[S0,d0]=C([]),[_1,I0]=C(0),[w0,W1]=C(0),[$1,d]=C(!1),[B0,r0]=C(!1),[Z1,S1]=C(0),[z_,u1]=C(null),[A_,C1]=C(null),[M1,M_]=C(()=>a9()),[L1,k1]=C({kind:"idle",title:"",detail:""}),[k_,p1]=C(()=>Date.now()),[a1,e1]=C(0),F1=g(null),x_=g(null),W_=g(null),m_=g(null),T_=g(null),j$=g(null),p4=g(null),T$=g(null),__=g({value:"",updatedAt:0}),c1=g(null),y_=g(""),H_=g(""),j_=g(""),y$=g(""),w$=g(!1),Z$=g(!1),y1=g(!1),Y_=g(0),I$=g(!1),r4=200,X$=GA(Q0),n4=(w)=>{let l=new Set,i=[];for(let N0 of w||[]){if(typeof N0!=="string")continue;let R0=N0.trim();if(!R0||l.has(R0))continue;l.add(R0),i.push(R0)}return i},d4=(w=X$)=>{let l=J_(w);if(!l)return[];try{let i=JSON.parse(l);if(!Array.isArray(i))return[];return n4(i)}catch{return[]}},x$=(w,l=X$)=>{K1(l,JSON.stringify(w))},C$=g(d4(X$)),c_=g(-1),h_=g(""),o4=g("");b(()=>{C$.current=d4(X$),c_.current=-1,h_.current=""},[X$]),b(()=>{if(!j)return;fetch("/agent/settings-data").then((w)=>w.json()).then((w)=>{if(w?.searchMatchMode)b0(w.searchMatchMode)}).catch(()=>{})},[j]),b(()=>{let w=!1;return fetch(`/agent/commands?chat_jid=${encodeURIComponent(Q0||"web:default")}`).then((i)=>i.ok?i.json():null).then((i)=>{if(w||!i?.commands)return;s1.current=i.commands.map((N0)=>({name:N0.name,description:N0.description||""}))}).catch((i)=>{console.debug("[compose] failed to fetch dynamic commands",i)}),()=>{w=!0}},[Q0]),b(()=>{let w=XA(e0,o4.current,j);if(!w.shouldApply)return;o4.current=w.nextToken,u1(null),D1(w.text),W0(w.text),r1(w.text),requestAnimationFrame(()=>{C0();let l=F1.current;if(!l)return;try{l.focus({preventScroll:!0})}catch{l.focus()}let i=w.text.length;l.setSelectionRange?.(i,i)})},[e0,j]),b(()=>{M_(a9())},[]);let N_=s0.trim()||x0.length>0||K.length>0||N.length>0||D.length>0,b1=L1.kind!=="idle",i4=L1.kind==="requesting_permission"||L1.kind==="listening",C_=!j&&Boolean(M1?.showButton),P$=L1.kind==="requesting_permission"||L1.kind==="listening",s4=P$?"Stop voice input":M1?.title||"Voice input",v5=typeof window<"u"&&typeof navigator<"u"&&Boolean(navigator.geolocation)&&Boolean(window.isSecureContext),m5=typeof window<"u"&&typeof Notification<"u",V4=typeof window<"u"?Boolean(window.isSecureContext):!1,a4=m5&&V4&&O!=="denied",t4=O==="granted"&&M,B_=E$(i0),R$=p2(i0),K4=typeof i0?.detail==="string"&&i0.detail.trim()?i0.detail.trim():"",Y4=B_?A6(i0,k_):null,P_=FA(m0,a1),O_=m0?.indicator&&typeof m0.indicator==="object"?m0.indicator:null,c5=t4?"Disable notifications":"Enable notifications",N4=x0.length>0||K.length>0||N.length>0||D.length>0,G$=i9(h?F0:"connected"),n1=G$.label,S$=G$.title,e4=KA(X0,N_,B_),q$=NA(X0,B_),r6=(Array.isArray(j0)?j0:[]).filter((w)=>!w?.archived_at),v1=(()=>{for(let w of Array.isArray(j0)?j0:[]){let l=typeof w?.chat_jid==="string"?w.chat_jid.trim():"";if(l&&l===Q0)return w}return null})(),G3=Boolean(v1&&v1.chat_jid===(v1.root_chat_jid||v1.chat_jid)),q3=Boolean(G3&&(v1?.chat_jid||Q0)==="web:default"),f_=(()=>{let w=typeof v1?.parent_branch_id==="string"?v1.parent_branch_id.trim():"",l=typeof v1?.branch_id==="string"?v1.branch_id.trim():"";if(!v1||!w||!l||v1.archived_at)return null;if((Array.isArray(j0)?j0:[]).filter((R0)=>{let B1=typeof R0?.parent_branch_id==="string"?R0.parent_branch_id.trim():"";return B1&&B1===l}).length>0)return null;return(Array.isArray(j0)?j0:[]).find((R0)=>{let B1=typeof R0?.branch_id==="string"?R0.branch_id.trim():"";return B1&&B1===w&&!R0?.archived_at})||null})(),B4=q0(()=>qA(j0,Q0),[j0,Q0]),b$=B4.length>0,g$=b$&&typeof G0==="function",u$=b$&&typeof a0==="function",_5=Boolean(P0||I$.current),Q$=!j&&typeof O0==="function"&&!_5,V$=!j&&typeof p0==="function",F4=!j&&typeof g0==="function",U4=!j&&!X0&&!B0&&Boolean(f_?.chat_jid),K$=!j&&typeof X1==="function"&&!q3,n6=!j&&typeof l0==="function",Y$=!j&&(g$||u$||Q$||V$||F4||U4||K$||n6),d6=OA(z,k),h5=d6.showPicker,l5=d6.label,p5=x&&L?` (${L})`:"",Q3=p5.trim()?`${L}`:"",S=LA(z,k),p=typeof J?.hint_short==="string"?J.hint_short.trim():"",o=[Q3||null,S?.label||null,p||null].filter(Boolean).join(" • "),t=[z?`Current model: ${l5}${p5}`:null,S?.title||null,J?.plan?`Plan: ${J.plan}`:null,p||null,J?.primary?.reset_description||null,J?.secondary?.reset_description||null].filter(Boolean),D0=U0?"Switching model…":t.join(" • ")||(h5?"Select a model (tap to open model picker)":`Current model: ${l5}${p5} (tap to open model picker)`),Y0=!j&&(h5||I&&I.percent!=null),E0=(w)=>{if(!w||typeof w!=="object")return;let l=w.model??w.current;if(typeof A==="function")A({...w,model:l??null,thinking_level:w.thinking_level??null,thinking_level_label:w.thinking_level_label??null,supports_thinking:w.supports_thinking,provider_usage:w.provider_usage??null});if(l&&typeof y==="function")y(l)},C0=(w)=>{let l=w||F1.current;if(!l)return;l.style.height="auto",l.style.height=`${l.scrollHeight}px`,l.style.overflowY="hidden"},W0=(w)=>{if(!w.startsWith("/")||w.includes(`
`)){O1(!1),U1([]);return}let l=w.toLowerCase().split(" ")[0];if(l.length<1){O1(!1),U1([]);return}let N0=(s1.current||ZA).filter((R0)=>R0.name.startsWith(l)||R0.name.replace(/-/g,"").startsWith(l.replace(/-/g,"")));if(N0.length>0&&!(N0.length===1&&N0[0].name===l))Z0(!1),V0([]),U1(N0),x1(0),O1(!0);else O1(!1),U1([])},t0=(w)=>{let l=s0,i=l.indexOf(" "),N0=i>=0?l.slice(i):"",R0=w.name+N0;D1(R0),O1(!1),U1([]),requestAnimationFrame(()=>{let B1=F1.current;if(!B1)return;let o1=R0.length;B1.selectionStart=o1,B1.selectionEnd=o1,B1.focus()})},r1=(w)=>{if(r9(w,{searchMode:j,showSessionSwitcherButton:Y$})){Z0(!1),V0([]);return}if(l9(w)==null){Z0(!1),V0([]);return}let l=HV(r6,w,{currentChatJid:Q0});if(l.length>0&&!(l.length===1&&p9(l[0].agent_name).trim().toLowerCase()===String(w||"").trim().toLowerCase()))O1(!1),U1([]),V0(l),n(0),Z0(!0);else Z0(!1),V0([])},Z_=(w)=>{let l=p9(w?.agent_name);if(!l)return;D1(l),Z0(!1),V0([]),requestAnimationFrame(()=>{let i=F1.current;if(!i)return;let N0=l.length;i.selectionStart=N0,i.selectionEnd=N0,i.focus()})},N$=()=>{if(j||!g$&&!u$&&!Q$&&!V$&&!K$)return!1;return __.current={value:"",updatedAt:0},k0(!1),O1(!1),U1([]),Z0(!1),V0([]),h0(!0),!0},XZ=(w)=>{if(w?.preventDefault?.(),w?.stopPropagation?.(),j||!g$&&!u$&&!Q$&&!V$&&!K$)return;if(y0){__.current={value:"",updatedAt:0},h0(!1);return}N$()},GZ=(w)=>{let l=typeof w==="string"?w.trim():"";if(h0(!1),!l||l===Q0){requestAnimationFrame(()=>F1.current?.focus());return}G0?.(l)},qZ=async(w)=>{let l=typeof w==="string"?w.trim():"";if(h0(!1),!l||typeof a0!=="function"){requestAnimationFrame(()=>F1.current?.focus());return}try{await a0(l)}catch(i){console.warn("Failed to restore session:",i),requestAnimationFrame(()=>F1.current?.focus())}},d1=q0(()=>{let w=[];for(let l of B4){let i=Boolean(l?.archived_at),N0=typeof l?.agent_name==="string"?l.agent_name.trim():"",R0=typeof l?.chat_jid==="string"?l.chat_jid.trim():"";if(!N0||!R0)continue;w.push({type:"session",key:`session:${R0}`,label:`@${N0} — ${R0}${l?.is_active?" active":""}${i?" archived":""}`,chat:l,disabled:i?!u$:!g$})}if(V$)w.push({type:"action",key:"action:new",label:"New branch",action:"new",disabled:!1});if(F4)w.push({type:"action",key:"action:new-root",label:"New root session…",action:"new-root",disabled:!1});if(f_?.chat_jid)w.push({type:"action",key:"action:rollup",label:"Merge current w/ parent",action:"rollup",disabled:!U4});if(Q$)w.push({type:"action",key:"action:rename",label:"Rename current session",action:"rename",disabled:_5});if(K$)w.push({type:"action",key:"action:delete",label:"Delete current session",action:"delete",disabled:!1});return w},[B4,u$,g$,V$,F4,f_,U4,Q$,K$,_5]),QZ=async(w)=>{if(w?.preventDefault)w.preventDefault();if(w?.stopPropagation)w.stopPropagation();if(typeof O0!=="function"||P0||I$.current)return;I$.current=!0,h0(!1);try{await O0()}catch(l){console.warn("Failed to rename session:",l)}finally{I$.current=!1}requestAnimationFrame(()=>F1.current?.focus())},VZ=async()=>{if(typeof p0!=="function")return;h0(!1);try{await p0()}catch(w){console.warn("Failed to create session:",w)}requestAnimationFrame(()=>F1.current?.focus())},KZ=async()=>{if(typeof g0!=="function")return;h0(!1);let w=typeof window<"u"?window.prompt("New root session handle (for example: ops)"):"",l=String(w||"").trim();if(!l){requestAnimationFrame(()=>F1.current?.focus());return}try{await g0(l)}catch(i){console.warn("Failed to create root session:",i)}requestAnimationFrame(()=>F1.current?.focus())},YZ=async()=>{let w=typeof f_?.chat_jid==="string"?f_.chat_jid.trim():"";if(!w||B0||X0)return;h0(!1),u1(null),C1(null),r0(!0);try{let l=await E_("default","/rollup",null,[],null,Q0);H0?.(l),_?.(l);let i=l?.command;if(i?.status==="error"){let R0=i?.message||"Failed to merge current session with parent.";u1(R0),a?.(R0);return}let N0=typeof i?.rolled_up_to==="string"&&i.rolled_up_to.trim()?i.rolled_up_to.trim():w;G0?.(N0)}catch(l){let i=l?.message||"Failed to merge current session with parent.";u1(i),a?.(i),console.warn("Failed to merge session with parent:",l)}finally{r0(!1)}requestAnimationFrame(()=>F1.current?.focus())},NZ=async()=>{if(typeof X1!=="function")return;h0(!1);try{await X1(Q0)}catch(w){console.warn("Failed to delete session:",w)}requestAnimationFrame(()=>F1.current?.focus())},v$=(w)=>{if(j)c0(w);else D1(w),W0(w),r1(w);requestAnimationFrame(()=>C0())},eU=(w)=>{let l=j?G1:s0,i=l&&!l.endsWith(`
`)?`
`:"",N0=`${l}${i}${w}`.trimStart();v$(N0)},V3=R(()=>{requestAnimationFrame(()=>{let w=F1.current;if(!w)return;try{w.focus({preventScroll:!0})}catch{w.focus()}})},[]),l_=R(()=>{k1({kind:"idle",title:"",detail:""})},[]),K3=R((w=H_.current,l=j_.current)=>{if(j)return;v$(MV(y_.current,w,l))},[j]),p_=R(()=>{w$.current=!0;let w=c1.current;if(!w){l_();return}try{w.stop()}catch{c1.current=null,l_()}},[l_]),Y3=R(()=>{if(u1(null),C1(null),c1.current){p_();return}if(!M1?.showButton)return;if(M1.mode==="fallback"){V3(),k1({kind:"guidance",title:M1.title||"Use keyboard dictation",detail:M1.detail||"Use your keyboard dictation mic for voice input here."});return}if(!M1?.canStart||!M1?.recognitionCtor){k1({kind:"error",title:M1?.title||"Voice input unavailable",detail:M1?.detail||"This browser does not expose native speech recognition in this context."});return}try{let w=new M1.recognitionCtor;if(c1.current=w,y_.current=String(s0||""),H_.current="",j_.current="",y$.current="",w$.current=!1,w.lang=typeof navigator<"u"&&navigator.language?navigator.language:"en-US",w.interimResults=!0,w.continuous=!1,"maxAlternatives"in w)w.maxAlternatives=1;w.onstart=()=>{k1({kind:"listening",title:"Listening…",detail:"Speak now. Tap the mic again to stop."})},w.onresult=(l)=>{let{finalText:i,interimText:N0}=kV(l?.results,l?.resultIndex||0);if(i)H_.current=`${H_.current} ${i}`.trim();j_.current=N0,K3(),k1({kind:"listening",title:"Listening…",detail:N0?`Heard: ${N0}`:"Speak now. Tap the mic again to stop."})},w.onerror=(l)=>{let i=String(l?.error||"").trim();if(y$.current=i,c1.current=null,j_.current="",i==="aborted"){l_();return}k1({kind:"error",title:"Voice input failed",detail:t9(i,M1)})},w.onend=()=>{let l=y$.current,i=w$.current,N0=Boolean(H_.current.trim()||j_.current.trim());if(c1.current=null,w$.current=!1,y$.current="",j_.current.trim())H_.current=`${H_.current} ${j_.current}`.trim(),j_.current="";if(N0)K3(H_.current,"");if(l&&l!=="aborted")return;if(!N0&&!i){k1({kind:"error",title:"No speech detected",detail:t9("no-speech",M1)});return}l_()},k1({kind:"requesting_permission",title:"Starting voice input…",detail:"Allow microphone access if the browser asks."}),V3(),w.start()}catch(w){c1.current=null,k1({kind:"error",title:"Voice input failed",detail:w?.message||"Could not start native browser speech recognition."})}},[K3,l_,s0,V3,M1,p_]),_D=(w)=>{let l=w?.command?.model_label;if(l)return l;let i=w?.command?.message;if(typeof i==="string"){let N0=i.match(/•\s+([^\n]+?)\s+\(current\)/);if(N0?.[1])return N0[1].trim()}return null},BZ=async(w)=>{if(j||U0)return;u1(null),C1(null),T0(!0);try{let l=await E_("default",w,null,[],null,Q0),i=_D(l);return E0({model:i??z??null,thinking_level:l?.command?.thinking_level,thinking_level_label:l?.command?.thinking_level_label,supports_thinking:l?.command?.supports_thinking}),await s9(I4,Q0,E0),C1(yV(w,l)),_?.(l),!0}catch(l){return console.error("Failed to switch model:",l),alert("Failed to switch model: "+l.message),!1}finally{T0(!1)}},$D=(w)=>{if(w.pointerType==="mouse")return;let l=F1.current?.value??(j?G1:s0);if(!wV(w,l,{searchMode:j,speechButtonVisible:C_,speechButtonActive:P$,canStartSpeech:Boolean(M1?.canStart&&M1?.recognitionCtor)}))return;w.preventDefault(),Z$.current=!0,y1.current=!0,Y3()},N3=(w)=>{if(!Z$.current)return;if(w?.preventDefault?.(),Z$.current=!1,c1.current)p_()},jD=(w)=>{if(y1.current){y1.current=!1,w.preventDefault();return}Y3()},ZD=async()=>{await BZ("/cycle-model")},B3=async(w)=>{let l=typeof w==="string"?w:typeof w?.label==="string"?w.label:"";if(!l||U0)return;let i=IV(w,I);if(i.blocked){u1(null),C1(i.note);return}if(await BZ(`/model ${l}`))k0(!1)},XD=(w)=>{if(!w||w.disabled)return;if(w.type==="session"){let l=w.chat;if(l?.archived_at)qZ(l.chat_jid);else GZ(l.chat_jid);return}if(w.type==="action"){if(w.action==="new"){VZ();return}if(w.action==="new-root"){KZ();return}if(w.action==="rollup"){YZ();return}if(w.action==="rename"){QZ();return}if(w.action==="delete")NZ()}},GD=(w)=>{w.preventDefault(),w.stopPropagation(),__.current={value:"",updatedAt:0},h0(!1),k0((l)=>!l)},qD=async()=>{if(j)return;E?.(),await $5("/compact",null,{includeMedia:!1,includeFileRefs:!1,includeFolderRefs:!1,includeMessageRefs:!1,clearAfterSubmit:!1,recordHistory:!1})},QD=(w)=>{if(w==="queue"||w==="steer"||w==="auto")return w;return X0?"queue":void 0},$5=async(w,l,i={})=>{let N0=typeof w==="string"?w:s0;if(/^\/settings\s*$/i.test(N0.trim())){D1(""),requestAnimationFrame(()=>C0()),a_();return}if(/^\/help\s*$/i.test(N0.trim())){D1(""),requestAnimationFrame(()=>C0()),a_({section:"keyboard"});return}let{includeMedia:R0=!0,includeFileRefs:B1=!0,includeFolderRefs:o1=!0,includeMessageRefs:h1=!0,clearAfterSubmit:R_=!0,recordHistory:w_=!0}=i||{},FZ=typeof w==="string"?w:w&&typeof w?.target?.value==="string"?w.target.value:s0,UZ=typeof FZ==="string"?FZ:"";if(!UZ.trim()&&(R0?x0.length===0:!0)&&(B1?K.length===0:!0)&&(o1?N.length===0:!0)&&(h1?D.length===0:!0))return;if(c1.current)p_();l_(),O1(!1),U1([]),Z0(!1),V0([]),h0(!1),u1(null),C1(null);let o6=R0?[...x0]:[],i6=B1?[...K]:[],s6=o1?[...N]:[],a6=h1?[...D]:[],D4=UZ.trim();if(w_&&D4){let z4=C$.current,F_=n4(z4.filter((U3)=>U3!==D4));if(F_.push(D4),F_.length>200)F_.splice(0,F_.length-200);C$.current=F_,x$(F_),c_.current=-1,h_.current=""}let ED=()=>{if(R0)n0([...o6]);if(B1)$0?.(i6);if(o1)K0?.(s6);if(h1)L0?.(a6);D1(D4),requestAnimationFrame(()=>C0())};if(R_)D1(""),n0([]),Y?.(),B?.(),H?.();(async()=>{try{let z4=await _0?.({content:D4,submitMode:l,fileRefs:i6,folderRefs:s6,messageRefs:a6,mediaFiles:o6});if(z4){_?.(z4);return}let F_=[];for(let B$ of o6){let t6=await l7(B$);F_.push(t6.id)}let U3=i6.length?`Files:
${i6.map((B$)=>`- ${B$}`).join(`
`)}`:"",AD=s6.length?`Folders:
${s6.map((B$)=>`- ${B$}`).join(`
`)}`:"",MD=a6.length?`Referenced messages:
${a6.map((B$)=>`- message:${B$}`).join(`
`)}`:"",kD=F_.length?`Attachments:
${F_.map((B$,t6)=>{let yD=o6[t6]?.name||`attachment-${t6+1}`;return`- attachment:${B$} (${yD})`}).join(`
`)}`:"",TD=[D4,U3,AD,MD,kD].filter(Boolean).join(`

`),m$=await E_("default",TD,null,F_,QD(l),Q0);if(H0?.(m$),m$?.command)E0({model:m$.command.model_label??z??null,thinking_level:m$.command.thinking_level,thinking_level_label:m$.command.thinking_level_label,supports_thinking:m$.command.supports_thinking}),await s9(I4,Q0,E0);C1(yV(D4,m$)),_?.(m$)}catch(z4){if(R_)ED();let F_=z4?.message||"Failed to send message.";u1(F_),a?.(F_),console.error("Failed to post:",z4)}})()},VD=(w)=>{r?.(w)},KD=R((w)=>{yA({queuedItem:w,onRemoveQueuedFollowup:e,setSubmitError:u1,setSubmitNotice:C1,setMediaFiles:n0,onSetFileRefs:$0,onSetFolderRefs:K0,onSetMessageRefs:L0,setContent:D1,textareaRef:F1,resizeTextarea:C0})},[e,$0,K0,L0,C0]),r5=R((w)=>{if(j||!A0&&!y0||w?.isComposing)return!1;let l=()=>{w.preventDefault?.(),w.stopPropagation?.()},i=()=>{__.current={value:"",updatedAt:0}};if(w.key==="Escape"){if(l(),i(),A0)k0(!1);if(y0)h0(!1);return!0}if(A0){if(w.key==="ArrowDown"){if(l(),i(),S0.length>0)I0((N0)=>(N0+1)%S0.length);return!0}if(w.key==="ArrowUp"){if(l(),i(),S0.length>0)I0((N0)=>(N0-1+S0.length)%S0.length);return!0}if((w.key==="Enter"||w.key==="Tab")&&S0.length>0)return l(),i(),B3(S0[Math.max(0,Math.min(_1,S0.length-1))]),!0;if(I6(w)&&S0.length>0){l();let N0=c9(__.current,w.key);__.current=N0;let R0=h9(S0,N0.value,_1,(B1)=>HA(B1));if(R0>=0)I0(R0);return!0}}if(y0){if(w.key==="ArrowDown"){if(l(),i(),d1.length>0)W1((N0)=>(N0+1)%d1.length);return!0}if(w.key==="ArrowUp"){if(l(),i(),d1.length>0)W1((N0)=>(N0-1+d1.length)%d1.length);return!0}if((w.key==="Enter"||w.key==="Tab")&&d1.length>0)return l(),i(),XD(d1[Math.max(0,Math.min(w0,d1.length-1))]),!0;if(I6(w)&&d1.length>0){l();let N0=c9(__.current,w.key);__.current=N0;let R0=h9(d1,N0.value,w0,(B1)=>B1.label);if(R0>=0)W1(R0);return!0}}return!1},[j,A0,y0,S0,_1,d1,w0,B3]),YD=(w)=>{if(w.isComposing)return;if(j&&w.key==="Escape"){w.preventDefault(),c0(""),Q?.();return}if(r5(w))return;let l=F1.current?.value??(j?G1:s0);if(wV(w,l,{searchMode:j,speechButtonVisible:C_,speechButtonActive:P$,canStartSpeech:Boolean(M1?.canStart&&M1?.recognitionCtor)})){w.preventDefault(),Z$.current=!0,Y3();return}if(LV(w,l,{searchMode:j,showSessionSwitcherButton:Y$})){w.preventDefault(),N$();return}if(s&&R1.length>0){let i=F1.current?.value??(j?G1:s0);if(!String(i||"").match(/^@([a-zA-Z0-9_-]*)$/))Z0(!1),V0([]);else{if(w.key==="ArrowDown"){w.preventDefault(),n((N0)=>(N0+1)%R1.length);return}if(w.key==="ArrowUp"){w.preventDefault(),n((N0)=>(N0-1+R1.length)%R1.length);return}if(w.key==="Tab"||w.key==="Enter"){w.preventDefault(),Z_(R1[v]);return}if(w.key==="Escape"){w.preventDefault(),Z0(!1),V0([]);return}}}if(f1&&z1.length>0){let i=F1.current?.value??(j?G1:s0);if(!String(i||"").startsWith("/"))O1(!1),U1([]);else{if(w.key==="ArrowDown"){w.preventDefault(),x1((N0)=>(N0+1)%z1.length);return}if(w.key==="ArrowUp"){w.preventDefault(),x1((N0)=>(N0-1+z1.length)%z1.length);return}if(w.key==="Tab"){w.preventDefault(),t0(z1[A1]);return}if(w.key==="Enter"&&!w.shiftKey){if(!l.includes(" ")){w.preventDefault();let R0=z1[A1];O1(!1),U1([]),$5(R0.name);return}}if(w.key==="Escape"){w.preventDefault(),O1(!1),U1([]);return}}}if(!j&&(w.key==="ArrowUp"||w.key==="ArrowDown")&&!w.metaKey&&!w.ctrlKey&&!w.altKey&&!w.shiftKey){let i=F1.current;if(!i)return;let N0=i.value||"",R0=i.selectionStart===0&&i.selectionEnd===0,B1=i.selectionStart===N0.length&&i.selectionEnd===N0.length;if(w.key==="ArrowUp"&&R0||w.key==="ArrowDown"&&B1){let o1=C$.current;if(!o1.length)return;w.preventDefault();let h1=c_.current;if(w.key==="ArrowUp"){if(h1===-1)h_.current=N0,h1=o1.length-1;else if(h1>0)h1-=1;c_.current=h1,v$(o1[h1]||"")}else{if(h1===-1)return;if(h1<o1.length-1)h1+=1,c_.current=h1,v$(o1[h1]||"");else c_.current=-1,v$(h_.current||""),h_.current=""}requestAnimationFrame(()=>{let R_=F1.current;if(!R_)return;let w_=R_.value.length;R_.selectionStart=w_,R_.selectionEnd=w_});return}}if(w.key==="Enter"&&!w.shiftKey&&(w.ctrlKey||w.metaKey)){if(w.preventDefault(),j){if(l.trim())X?.(l.trim(),Z,{images:J0,attachments:o0})}else $5(l,"steer");return}if(w.key==="Enter"&&!w.shiftKey){if(w.preventDefault(),j){if(l.trim())X?.(l.trim(),Z,{images:J0,attachments:o0})}else $5(l);return}if(w.key==="Escape"){if(A0||y0||f1||s)return;w.preventDefault(),F1.current?.blur()}},ND=(w)=>{if(YA(w,Z$.current)){if(w.preventDefault(),Z$.current=!1,c1.current)p_()}},F3=(w)=>{let l=Array.from(w||[]).filter((i)=>i instanceof File&&!String(i.name||"").startsWith(".DS_Store"));if(!l.length)return;n0((i)=>[...i,...l]),u1(null)},BD=(w)=>{F3(w.target.files),w.target.value=""},FD=(w)=>{if(j)return;w.preventDefault(),w.stopPropagation(),Y_.current+=1,Y1(!0)},UD=(w)=>{if(j)return;if(w.preventDefault(),w.stopPropagation(),Y_.current=Math.max(0,Y_.current-1),Y_.current===0)Y1(!1)},DD=(w)=>{if(j)return;if(w.preventDefault(),w.stopPropagation(),w.dataTransfer)w.dataTransfer.dropEffect="copy";Y1(!0)},zD=(w)=>{if(j)return;w.preventDefault(),w.stopPropagation(),Y_.current=0,Y1(!1),F3(w.dataTransfer?.files||[])},WD=(w)=>{if(j)return;let l=w.clipboardData?.items;if(!l||!l.length)return;let i=[];for(let N0 of l){if(N0.kind!=="file")continue;let R0=N0.getAsFile?.();if(R0)i.push(R0)}if(i.length>0)w.preventDefault(),F3(i)},HD=(w)=>{n0((l)=>l.filter((i,N0)=>N0!==w))},OD=()=>{u1(null),n0([]),Y?.(),B?.(),H?.()},LD=()=>{if(!navigator.geolocation){alert("Geolocation is not available in this browser.");return}navigator.geolocation.getCurrentPosition((w)=>{let{latitude:l,longitude:i,accuracy:N0}=w.coords,R0=`${l.toFixed(5)}, ${i.toFixed(5)}`,B1=Number.isFinite(N0)?` ±${Math.round(N0)}m`:"",o1=`https://maps.google.com/?q=${l},${i}`,h1=`Location: ${R0}${B1} ${o1}`;eU(h1)},(w)=>{let l=w?.message||"Unable to retrieve location.";alert(`Location error: ${l}`)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})};b(()=>{if(!A0)return;__.current={value:"",updatedAt:0},d(!0),I4(Q0).then((w)=>{d0(PV(w)),E0(w)}).catch((w)=>{console.warn("Failed to load model list:",w),d0([])}).finally(()=>{d(!1)})},[A0,z]),b(()=>{if(j)k0(!1),h0(!1),O1(!1),U1([]),Z0(!1),V0([])},[j]),b(()=>{if(y0&&!Y$)h0(!1)},[y0,Y$]),b(()=>{if(!A0)return;let w=S0.findIndex((l)=>l?.label===z);I0(w>=0?w:0)},[A0,S0,z]),b(()=>{if(!y0)return;W1(VA(d1,Q0)),__.current={value:"",updatedAt:0}},[y0,Q0,d1]),b(()=>{if(!A0)return;let w=(l)=>{let i=m_.current,N0=T_.current,R0=l.target;if(i&&i.contains(R0))return;if(N0&&N0.contains(R0))return;k0(!1)};return document.addEventListener("pointerdown",w),()=>document.removeEventListener("pointerdown",w)},[A0]),b(()=>{if(!y0)return;let w=(l)=>{let i=j$.current,N0=p4.current,R0=l.target;if(i&&i.contains(R0))return;if(N0&&N0.contains(R0))return;h0(!1)};return document.addEventListener("pointerdown",w),()=>document.removeEventListener("pointerdown",w)},[y0]),b(()=>{if(j||!A0&&!y0)return;let w=(l)=>{r5(l)};return document.addEventListener("keydown",w,!0),()=>document.removeEventListener("keydown",w,!0)},[j,A0,y0,r5]),b(()=>{if(!A0)return;let w=m_.current;w?.focus?.(),w?.querySelector?.(".compose-model-popup-item.active")?.scrollIntoView?.({block:"nearest"})},[A0,_1,S0]),b(()=>{if(!y0)return;let w=j$.current;w?.focus?.(),w?.querySelector?.(".compose-model-popup-item.active")?.scrollIntoView?.({block:"nearest"})},[y0,w0,d1.length]),b(()=>{if(!s||!W_.current)return;W_.current.querySelector?.(".slash-item.active")?.scrollIntoView?.({block:"nearest"})},[s,v,R1.length]),b(()=>{if(!f1||!x_.current)return;x_.current.querySelector?.(".slash-item.active")?.scrollIntoView?.({block:"nearest"})},[f1,A1,z1.length]),b(()=>{let w=(i)=>{if(!i||typeof i!=="object")return!1;if(i.isContentEditable)return!0;if(typeof i.closest!=="function")return!1;return Boolean(i.closest('input, textarea, select, [contenteditable="true"], .compose-box, .compose-model-popup, .compose-session-popup, .settings-dialog, .workspace-sidebar, .editor-pane-container, .dock-panel, .timeline-menu-dropdown, .rename-branch-overlay, .agent-request-modal, .attachment-preview-modal, .vnc-pane-shell, .kanban-plugin, .mindmap-editor, .timeline-quick-actions'))},l=(i)=>{if(i.ctrlKey||i.metaKey||i.altKey)return;let N0=F1.current;if(!N0)return;let R0=document.activeElement===N0;if(i.key==="Escape"&&!R0&&!w(i.target)){i.preventDefault(),N0.focus();return}if(i.key==="/"&&!R0&&!w(i.target))i.preventDefault(),v$("/"),requestAnimationFrame(()=>{N0.focus(),N0.selectionStart=1,N0.selectionEnd=1,W0("/")})};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)},[]),b(()=>{let w=()=>{let B1=T$.current?.clientWidth||0;S1((o1)=>o1===B1?o1:B1)};w();let l=T$.current,i=0,N0=()=>{if(i)cancelAnimationFrame(i);i=requestAnimationFrame(()=>{i=0,w()})},R0=null;if(l&&typeof ResizeObserver<"u")R0=new ResizeObserver(()=>N0()),R0.observe(l);if(typeof window<"u")window.addEventListener("resize",N0);return()=>{if(i)cancelAnimationFrame(i);if(R0?.disconnect?.(),typeof window<"u")window.removeEventListener("resize",N0)}},[j,z,v1?.agent_name,Y$,I?.percent]);let JD=(w)=>{let l=w.target.value;if(c1.current&&w?.isTrusted)p_();if(u1(null),C1(null),L1.kind==="guidance"||L1.kind==="error")l_();if(y0)h0(!1);if(C0(w.target),r9(l,{searchMode:j,showSessionSwitcherButton:Y$})){v$(""),requestAnimationFrame(()=>{let i=F1.current;if(!i)return;i.value="",i.selectionStart=0,i.selectionEnd=0,i.focus()}),N$();return}v$(l)};return b(()=>{requestAnimationFrame(()=>C0())},[s0,G1,j]),b(()=>{if(!j)return;if(c1.current)p_();return},[j,p_]),b(()=>{if(c1.current)p_();l_()},[Q0,l_,p_]),b(()=>{return()=>{if(!c1.current)return;try{c1.current.stop()}catch(w){console.debug("[compose] failed to stop speech recognition during cleanup",w)}c1.current=null}},[]),b(()=>{if(!B_)return;p1(Date.now());let w=setInterval(()=>p1(Date.now()),1000);return()=>clearInterval(w)},[B_,i0?.started_at,i0?.startedAt]),b(()=>{if(e1(0),O_?.mode!=="custom"||!Array.isArray(O_.frames)||O_.frames.length<=1)return;let w=typeof O_.intervalMs==="number"&&Number.isFinite(O_.intervalMs)&&O_.intervalMs>0?O_.intervalMs:120,l=setInterval(()=>{e1((i)=>(i+1)%O_.frames.length)},w);return()=>clearInterval(l)},[O_]),b(()=>{if(j)return;r1(s0)},[r6,Q0,s0,j]),U`
        <div class="compose-box" data-testid="compose-box">
            ${b1&&U`
                <div class=${`compose-inline-status compose-speech-status compose-speech-status-${L1.kind}`} role="status" aria-live="polite">
                    <div class="compose-inline-status-row">
                        <span class=${o9({pulsing:i4})} aria-hidden="true"></span>
                        <span class="compose-inline-status-title">${L1.title}</span>
                    </div>
                    ${L1.detail&&U`<div class="compose-inline-status-detail">${L1.detail}</div>`}
                </div>
            `}
            ${f0&&!j&&U`
                <${wA}
                    items=${c}
                    onInjectQueuedFollowup=${VD}
                    onRemoveQueuedFollowup=${e}
                    onMoveQueuedFollowup=${m}
                    onReturnQueuedFollowup=${KD}
                    onOpenFilePill=${u}
                />
            `}
            ${P_.visible&&U`
                <div class="compose-inline-status extension-working" role="status" aria-live="polite">
                    <div class="compose-inline-status-row">
                        ${P_.indicatorText?U`<span class="compose-inline-status-glyph" aria-hidden="true">${P_.indicatorText}</span>`:P_.animateSpinner?U`<div class="compose-inline-status-spinner" aria-hidden="true"></div>`:P_.animateDot?U`<span class=${o9({pulsing:!0})} aria-hidden="true"></span>`:null}
                        <span class="compose-inline-status-title">${P_.title}</span>
                    </div>
                </div>
            `}
            ${i0&&!B_&&U`
                <div
                    class="compose-inline-status"
                    role="status"
                    aria-live="polite"
                    title=${K4||""}
                >
                    <div class="compose-inline-status-row">
                        <div class="compose-inline-status-spinner" aria-hidden="true"></div>
                        <span class="compose-inline-status-title">${R$}</span>
                        ${Y4&&U`<span class="compose-inline-status-elapsed">${Y4}</span>`}
                    </div>
                    ${K4&&U`<div class="compose-inline-status-detail">${K4}</div>`}
                </div>
            `}
            ${A_&&U`
                <div class="compose-inline-status compose-command-notice" role="status" aria-live="polite">
                    <div class="compose-inline-status-detail compose-command-notice-text" dangerouslySetInnerHTML=${{__html:q_(A_)}}></div>
                </div>
            `}
            <div
                class=${`compose-input-wrapper${E1?" drag-active":""}`}
                onDragEnter=${FD}
                onDragOver=${DD}
                onDragLeave=${UD}
                onDrop=${zD}
            >
                ${Y$&&U`
                    <div
                        ref=${p4}
                        class="compose-session-trigger-group compose-session-trigger-top"
                    >
                        <button
                            type="button"
                            class=${`compose-session-trigger compose-session-trigger-pill${y0?" active":""}`}
                            data-testid="session-switcher"
                            onClick=${XZ}
                            title=${v1?.chat_jid||Q0}
                            aria-label=${v1?.agent_name?`Manage sessions for @${v1.agent_name}`:"Manage Sessions/Agents"}
                            aria-expanded=${y0?"true":"false"}
                        >
                            <span class="compose-current-agent-label active">${v1?.agent_name?`@${v1.agent_name}`:"Sessions"}</span>
                        </button>
                    </div>
                `}
                <div class="compose-input-main">
                    ${N4&&U`
                        <div class="compose-file-refs">
                            ${D.map((w)=>{return U`
                                    <${K_}
                                        key=${"msg-"+w}
                                        prefix="compose"
                                        label=${"msg:"+w}
                                        title=${"Message reference: "+w}
                                        removeTitle="Remove reference"
                                        icon="message"
                                        onRemove=${()=>W?.(w)}
                                    />
                                `})}
                            ${K.map((w)=>{let l=w.split("/").pop()||w;return U`
                                    <${K_}
                                        prefix="compose"
                                        label=${l}
                                        title=${w}
                                        onClick=${()=>u?.(w)}
                                        removeTitle="Remove file"
                                        onRemove=${()=>V?.(w)}
                                    />
                                `})}
                            ${N.map((w)=>{let l=w.split("/").pop()||w;return U`
                                    <${K_}
                                        prefix="compose"
                                        label=${l}
                                        title=${w}
                                        icon="folder"
                                        onClick=${()=>u?.(w)}
                                        removeTitle="Remove folder hint"
                                        onRemove=${()=>F?.(w)}
                                    />
                                `})}
                            ${x0.map((w,l)=>{let i=w?.name||`attachment-${l+1}`;return U`
                                    <${K_}
                                        key=${i+l}
                                        prefix="compose"
                                        label=${i}
                                        title=${i}
                                        removeTitle="Remove attachment"
                                        onRemove=${()=>HD(l)}
                                    />
                                `})}
                            <button
                                type="button"
                                class="compose-clear-attachments-btn"
                                onClick=${OD}
                                title="Clear all attachments and references"
                                aria-label="Clear all attachments and references"
                            >
                                Clear all
                            </button>
                        </div>
                    `}
                    <textarea
                        ref=${F1}
                        data-testid="compose-input"
                        placeholder=${j?"Search (Enter to run)...":"Message (Enter to send, Shift+Enter for newline)..."}
                        value=${j?G1:s0}
                        onInput=${JD}
                        onKeyDown=${YD}
                        onKeyUp=${ND}
                        onPaste=${WD}
                        onFocus=${$}
                        onClick=${$}
                        rows="1"
                    />
                    ${s&&R1.length>0&&U`
                        <div class="slash-autocomplete" ref=${W_}>
                            ${R1.map((w,l)=>U`
                                <div
                                    key=${w.chat_jid||w.agent_name}
                                    class=${`slash-item${l===v?" active":""}`}
                                    onMouseDown=${(i)=>{i.preventDefault(),Z_(w)}}
                                    onMouseEnter=${()=>n(l)}
                                >
                                    <span class="slash-name">@${w.agent_name}</span>
                                    <span class="slash-desc">${w.chat_jid||"Active agent"}</span>
                                </div>
                            `)}
                        </div>
                    `}
                    ${f1&&z1.length>0&&U`
                        <div class="slash-autocomplete" ref=${x_}>
                            ${z1.map((w,l)=>U`
                                <div
                                    key=${w.name}
                                    class=${`slash-item${l===A1?" active":""}`}
                                    onMouseDown=${(i)=>{i.preventDefault(),t0(w)}}
                                    onMouseEnter=${()=>x1(l)}
                                >
                                    <span class="slash-name">${w.name}</span>
                                    <span class="slash-desc">${w.description}</span>
                                </div>
                            `)}
                        </div>
                    `}
                    ${A0&&!j&&U`
                        <div class="compose-model-popup" ref=${m_} tabIndex="-1" onKeyDown=${r5}>
                            <div class="compose-model-popup-title">Select model</div>
                            <div class="compose-model-popup-menu" role="menu" aria-label="Model picker">
                                ${$1&&U`
                                    <div class="compose-model-popup-empty">Loading models…</div>
                                `}
                                ${!$1&&S0.length===0&&U`
                                    <div class="compose-model-popup-empty">No models available.</div>
                                `}
                                ${!$1&&S0.map((w,l)=>{let i=typeof w?.label==="string"?w.label:"",N0=e9(w?.contextWindow),R0=w?.name||null,B1=IV(w,I);return U`
                                        <button
                                            key=${i}
                                            type="button"
                                            role="menuitem"
                                            class=${`compose-model-popup-item compose-model-popup-model-item${_1===l?" active":""}${z===i?" current-model":""}${B1.blocked?" context-blocked":""}`}
                                            onClick=${()=>{B3(w)}}
                                            disabled=${U0||B1.blocked}
                                            title=${[i,R0,N0,B1.title].filter(Boolean).join(" • ")}
                                        >
                                            <span class="compose-model-popup-model-stack">
                                                <span class="compose-model-popup-model-label">${zA(i,w?.contextWindow)}${R0?U` <span class="compose-model-popup-model-subtitle">${R0}</span>`:""}</span>
                                                ${B1.blocked&&U`<span class="compose-model-popup-model-note">${B1.note}</span>`}
                                            </span>
                                        </button>
                                    `})}
                            </div>
                            <div class="compose-model-popup-actions">
                                <button
                                    type="button"
                                    class="compose-model-popup-btn"
                                    onClick=${()=>{ZD()}}
                                    disabled=${U0}
                                >
                                    Next model
                                </button>
                            </div>
                        </div>
                    `}
                    ${y0&&!j&&U`
                        <div class="compose-model-popup" data-testid="session-popup" ref=${j$} tabIndex="-1" onKeyDown=${r5}>
                            <div class="compose-model-popup-title">Manage sessions & agents</div>
                            <div class="compose-model-popup-menu" role="menu" aria-label="Sessions and agents">
                                ${!b$&&U`
                                    <div class="compose-model-popup-empty">No other sessions yet.</div>
                                `}
                                ${b$&&B4.map((w,l)=>{let i=Boolean(w.archived_at),N0=w.chat_jid===(w.root_chat_jid||w.chat_jid),R0=!N0&&!w.is_active&&!i&&typeof X1==="function",B1=i&&n6,o1=N8(w,{currentChatJid:Q0});return U`
                                        <div key=${w.chat_jid} class=${`compose-model-popup-item-row${i?" archived":""}`}>
                                            <button
                                                type="button"
                                                role="menuitem"
                                                class=${`compose-model-popup-item session-item${i?" archived":""}${w0===l?" active":""}`}
                                                data-testid="session-item"
                                                onClick=${()=>{if(i){qZ(w.chat_jid);return}GZ(w.chat_jid)}}
                                                disabled=${i?!u$:!g$}
                                                title=${i?`Restore archived ${`@${w.agent_name}`}`:`Switch to ${`@${w.agent_name}`}`}
                                            >
                                                <span style=${QA(w)?"font-weight:700":""}>${o1}</span>
                                            </button>
                                            <button
                                                type="button"
                                                class="compose-model-popup-item-popout"
                                                title=${`Open @${w.agent_name} in new window`}
                                                aria-label=${`Open @${w.agent_name} in new window`}
                                                onClick=${(h1)=>{h1.stopPropagation(),h0(!1);let R_=new URL(window.location.href);R_.searchParams.set("chat_jid",w.chat_jid),R_.searchParams.set("chat_only","1");let w_=document.createElement("a");w_.href=R_.toString(),w_.target="_blank",w_.rel="noopener",w_.style.display="none",document.body.appendChild(w_),w_.click(),w_.remove()}}
                                            >
                                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M6 2h8v8"/>
                                                    <path d="M14 2 7 9"/>
                                                    <path d="M12 9v5H2V4h5"/>
                                                </svg>
                                            </button>
                                            ${(R0||B1)&&U`
                                                <button
                                                    type="button"
                                                    class="compose-model-popup-item-delete"
                                                    title=${B1?N0?"Permanently delete this archived session":"Permanently delete this archived branch":"Delete this branch"}
                                                    aria-label=${B1?N0?`Permanently delete archived session @${w.agent_name}`:`Permanently delete archived branch @${w.agent_name}`:`Delete @${w.agent_name}`}
                                                    onClick=${(h1)=>{if(h1.stopPropagation(),h0(!1),B1){l0?.(w.chat_jid);return}X1(w.chat_jid)}}
                                                >
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                </button>
                                            `}
                                        </div>
                                    `})}
                            </div>
                            ${(V$||F4||Q$||K$)&&U`
                                <div class="compose-model-popup-actions">
                                    ${V$&&U`
                                        <button
                                            type="button"
                                            class=${`compose-model-popup-btn primary${d1.findIndex((w)=>w.key==="action:new")===w0?" active":""}`}
                                            onClick=${()=>{VZ()}}
                                            title="Create a new branch from this chat"
                                        >
                                            New branch
                                        </button>
                                    `}
                                    ${F4&&U`
                                        <button
                                            type="button"
                                            class=${`compose-model-popup-btn${d1.findIndex((w)=>w.key==="action:new-root")===w0?" active":""}`}
                                            onClick=${()=>{KZ()}}
                                            title="Create a clean root session such as web:ops"
                                        >
                                            New root…
                                        </button>
                                    `}
                                    ${f_?.chat_jid&&U`
                                        <button
                                            type="button"
                                            class=${`compose-model-popup-btn${d1.findIndex((w)=>w.key==="action:rollup")===w0?" active":""}`}
                                            onClick=${()=>{YZ()}}
                                            title=${U4?`Merge this branch into ${f_.agent_name?`@${f_.agent_name}`:f_.chat_jid}`:"This branch cannot be merged while active or while it has children"}
                                            disabled=${!U4}
                                        >
                                            Merge current w/ parent
                                        </button>
                                    `}
                                    ${Q$&&U`
                                        <button
                                            type="button"
                                            class=${`compose-model-popup-btn${d1.findIndex((w)=>w.key==="action:rename")===w0?" active":""}`}
                                            onClick=${(w)=>{QZ(w)}}
                                            title="Rename the current session"
                                            disabled=${_5}
                                        >
                                            Rename current…
                                        </button>
                                    `}
                                    ${K$&&U`
                                        <button
                                            type="button"
                                            class=${`compose-model-popup-btn danger${d1.findIndex((w)=>w.key==="action:delete")===w0?" active":""}`}
                                            onClick=${()=>{NZ()}}
                                            title="Delete (prune) current agent/session branch"
                                        >
                                            Delete current…
                                        </button>
                                    `}
                                </div>
                            `}
                        </div>
                    `}
                </div>
                <div class="compose-footer" ref=${T$}>
                    ${G$.show&&U`
                        <span class="compose-connection-status connection-status ${G$.statusClass}" title=${S$}>
                            ${n1}
                        </span>
                    `}
                    ${Y0&&U`
                    <div class="compose-meta-row">
                        ${h5&&U`
                            <div class="compose-model-meta">
                                <button
                                    ref=${T_}
                                    type="button"
                                    class="compose-model-hint compose-model-hint-btn"
                                    title=${D0}
                                    aria-label="Open model picker"
                                    onClick=${GD}
                                    disabled=${U0}
                                >
                                    ${U0?"Switching…":l5}
                                </button>
                                <div class="compose-model-meta-subline">
                                    ${!U0&&o&&U`
                                        <span class="compose-model-usage-hint" title=${D0}>
                                            ${o}
                                        </span>
                                    `}
                                </div>
                            </div>
                        `}
                        ${!j&&I&&I.percent!=null&&U`
                            <${UA}
                                usage=${I}
                                onCompact=${qD}
                                compactionLabel=${B_?Y4||"0:00":""}
                                compactionTitle=${B_?R$||"Smart compaction":""}
                            />
                        `}
                    </div>
                    `}
                    <div class="compose-actions ${j?"search-mode":""}">
                    ${j&&U`
                        <label class="compose-search-scope-wrap" title="Search scope">
                            <span class="compose-search-scope-label">Scope</span>
                            <select
                                class="compose-search-scope-select"
                                value=${Z}
                                onChange=${(w)=>G?.(w.currentTarget.value)}
                            >
                                <option value="current">Current</option>
                                <option value="root">Branch family</option>
                                <option value="all">All chats</option>
                            </select>
                        </label>
                        <label class="compose-search-filter-wrap" title="Only show messages with images">
                            <input type="checkbox" checked=${J0} onChange=${()=>V1((w)=>!w)} />
                            <span class="compose-search-filter-label">Images</span>
                        </label>
                        <label class="compose-search-filter-wrap" title="Only show messages with attachments">
                            <input type="checkbox" checked=${o0} onChange=${()=>H1((w)=>!w)} />
                            <span class="compose-search-filter-label">Attachments</span>
                        </label>
                        <button
                            class=${`compose-search-match-toggle ${z0==="and"?"active":""}`}
                            onClick=${()=>{let w=z0==="or"?"and":"or";b0(w),fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({searchMatchMode:w})}).catch((l)=>{})}}
                            title=${z0==="or"?"Any keyword (OR) — click for all keywords (AND)":"All keywords (AND) — click for any keyword (OR)"}
                            type="button"
                        >
                            ${z0==="or"?"OR":"AND"}
                        </button>
                    `}
                    <button
                        class="icon-btn search-toggle"
                        onClick=${j?Q:q}
                        title=${j?"Close search":"Search"}
                    >
                        ${j?U`
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        `:U`
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="M21 21l-4.35-4.35"/>
                            </svg>
                        `}
                    </button>
                    ${v5&&!j&&U`
                        <button
                            class="icon-btn location-btn"
                            onClick=${LD}
                            title="Share location"
                            type="button"
                            disabled=${!1}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 2a14 14 0 0 1 0 20a14 14 0 0 1 0-20" />
                                <path d="M2 12h20" />
                            </svg>
                        </button>
                    `}
                    ${C_&&U`
                        <button
                            class=${`icon-btn voice-input-btn${P$?" active":""}${M1.mode==="fallback"?" fallback":""}`}
                            onClick=${jD}
                            onPointerDown=${$D}
                            onPointerUp=${N3}
                            onPointerCancel=${N3}
                            onPointerLeave=${N3}
                            title=${s4}
                            aria-label=${s4}
                            type="button"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <path d="M12 19v3" />
                            </svg>
                        </button>
                    `}
                    ${a4&&!j&&U`
                        <button
                            class=${`icon-btn notification-btn${t4?" active":""}`}
                            onClick=${T}
                            title=${c5}
                            type="button"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>
                    `}
                    ${!j&&U`
                        ${P&&f&&U`
                            <button
                                class="icon-btn attach-editor-btn"
                                onClick=${f}
                                title=${`Attach open file: ${P}`}
                                type="button"
                                disabled=${K.includes(P)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                            </button>
                        `}
                        <label class="icon-btn" title="Attach file">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <input type="file" multiple hidden onChange=${BD} />
                        </label>
                    `}
                    ${!j&&U`
                        <div class="compose-send-stack">
                                <button 
                                    class=${e4.className}
                                    data-testid="send-button"
                                    type="button"
                                    onClick=${()=>{$5()}}
                                    disabled=${e4.disabled}
                                    title=${e4.title}
                                    aria-label=${e4.ariaLabel}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                                </button>
                                ${q$&&U`
                                    <button 
                                        class=${q$.className}
                                        data-testid="stop-button"
                                        type="button"
                                        onClick=${()=>{if(BA(q$.mode))$5("/abort","steer",{clearAfterSubmit:!1,includeMedia:!1,includeFileRefs:!1,includeFolderRefs:!1,includeMessageRefs:!1,recordHistory:!1})}}
                                        disabled=${q$.disabled}
                                        title=${q$.title}
                                        aria-label=${q$.ariaLabel}
                                    >
                                        ${q$.mode==="compacting"?U`
                                                <span class="compose-submit-spinner" aria-hidden="true">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <circle class="compose-submit-spinner-ring" cx="12" cy="12" r="10.5" stroke-width="2.25" stroke-linecap="round"></circle>
                                                        <rect class="compose-submit-spinner-stop" x="6" y="6" width="12" height="12" rx="0" fill="currentColor"></rect>
                                                    </svg>
                                                </span>
                                            `:U`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2.5"/></svg>`}
                                    </button>
                                `}
                        </div>
                    `}
                </div>
            </div>
        </div>
        </div>
    `}M0();function bV({kind:_="hidden",onSetupProvider:$,onDismiss:j}){if(_==="hidden")return null;let Z=_==="provider-missing",X=Z?"Instance needs setup":"Instance is configured",G=Z?"This instance is not yet configured. Open Settings and set up AI providers/models to start sending requests.":"This instance looks configured. Review or update provider and model settings in Settings.";return U`
    <section class=${`oobe-panel oobe-panel-${_}`} aria-label="Getting started">
      <div class="oobe-panel-copy">
        <div class="oobe-panel-eyebrow">Getting started</div>
        <h2 class="oobe-panel-title">${X}</h2>
        <p class="oobe-panel-body">${G}</p>
      </div>
      <div class="oobe-panel-actions">
        <button type="button" class="oobe-panel-btn oobe-panel-btn-primary" onClick=${()=>$?.()}>
          Open Settings
        </button>
        <button type="button" class="oobe-panel-btn" onClick=${()=>j?.()}>
          ${Z?"Dismiss":"Done"}
        </button>
      </div>
    </section>
  `}M0();function gV(_){let $=String(_||"").trim();if(!$.startsWith("/btw"))return null;let j=$.slice(4).trim();if(!j)return{type:"help"};if(j==="clear"||j==="close")return{type:"clear"};return{type:"ask",question:j}}function uV(_){return String(_||"").trim()||"web:default"}function vV(_){if(!_)return!1;let $=String(_.answer||"").trim();return _.status!=="running"&&Boolean($)}function mV(_){if(!_)return!1;return _.status!=="running"}function cV(_){let $=String(_?.question||"").trim(),j=String(_?.answer||"").trim();if(!$&&!j)return"";return["BTW side conversation",$?`Question: ${$}`:null,j?`Answer:
${j}`:null].filter(Boolean).join(`

`)}function hV({session:_,onClose:$,onInject:j,onRetry:Z}){let X=g(null),G=g(null),q=_?.thinking?q6(_.thinking):"",Q=_?.answer?q_(_.answer,null):"";if(b(()=>{if(X.current&&q)L$(X.current).catch((W)=>{console.debug("[btw-panel] Mermaid rendering failed for BTW thinking content.",W)})},[q]),b(()=>{if(G.current&&Q)L$(G.current).catch((W)=>{console.debug("[btw-panel] Mermaid rendering failed for BTW answer content.",W)})},[Q]),!_)return null;let K=_.status==="running",V=Boolean(String(_.answer||"").trim()),Y=Boolean(String(_.thinking||"").trim()),N=vV(_),F=mV(_),B=!K&&V,D=K?"Thinking…":_.status==="error"?"Error":"Done";return U`
        <section class="btw-panel" aria-label="BTW side conversation">
            <div class="btw-panel-header">
                <div class="btw-panel-title-wrap">
                    <span class="btw-panel-title">Question</span>
                    <span class=${`btw-panel-status btw-panel-status-${_.status||"idle"}`}>${D}</span>
                </div>
                <button class="btw-panel-close" onClick=${()=>$?.()} title="Close BTW" aria-label="Close BTW">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                        <line x1="4" y1="4" x2="12" y2="12"/>
                        <line x1="12" y1="4" x2="4" y2="12"/>
                    </svg>
                </button>
            </div>

            ${_.question&&U`<div class="btw-block btw-question">${_.question}</div>`}
            ${_.error&&U`<div class="btw-block btw-error">${_.error}</div>`}
            ${Y&&U`
                <details class="btw-block btw-thinking" open=${K?!0:void 0}>
                    <summary>Thinking</summary>
                    <div
                        class="btw-thinking-body post-content"
                        ref=${X}
                        dangerouslySetInnerHTML=${{__html:q}}
                    ></div>
                </details>
            `}
            ${N&&U`
                <div class="btw-block btw-answer">
                    <div class="btw-answer-label">Answer</div>
                    <div
                        class="btw-answer-body post-content"
                        ref=${G}
                        dangerouslySetInnerHTML=${{__html:Q}}
                    ></div>
                </div>
            `}

            ${F&&U`
                <div class="btw-panel-footer">
                    <div class="btw-panel-footer-left">
                        ${_.question&&U`
                            <button class="btw-btn btw-btn-secondary" onClick=${()=>Z?.()}>
                                Retry
                            </button>
                        `}
                    </div>
                    <div class="btw-panel-footer-right">
                        <button class="btw-btn btw-btn-primary" onClick=${()=>j?.()} disabled=${!B}>
                            Inject into chat
                        </button>
                    </div>
                </div>
            `}
        </section>
    `}M0();function _j(_,$){try{if(_)_.name=$;return!0}catch(j){return!1}}function $j(_,$){try{return _?.contentWindow?.postMessage?.($,"*"),!0}catch(j){return!1}}function IA(_){let $=_?.artifact||{},j=$.kind||_?.kind||null;if(j!=="html"&&j!=="svg"&&j!=="session_tree")return null;if(j==="html"){let X=typeof $.html==="string"?$.html:typeof _?.html==="string"?_.html:"";return X?{kind:j,html:X}:null}if(j==="svg"){let X=typeof $.svg==="string"?$.svg:typeof _?.svg==="string"?_.svg:"";return X?{kind:j,svg:X}:null}let Z=$.tree&&typeof $.tree==="object"?$.tree:_?.tree&&typeof _.tree==="object"?_.tree:null;return{kind:j,tree:Z}}function xA(_){let $=_?.artifact&&typeof _.artifact==="object"?_.artifact:{},j=typeof $.svg==="string"?$.svg:typeof _?.svg==="string"?_.svg:"",Z=typeof $.html==="string"?$.html:typeof _?.html==="string"?_.html:typeof _?.w==="string"?_.w:typeof _?.content==="string"?_.content:"",X=$.tree&&typeof $.tree==="object"?$.tree:_?.tree&&typeof _.tree==="object"?_.tree:null,G=$.kind||_?.kind||null,q=G==="session_tree"?"session_tree":G==="svg"||j?"svg":"html";if(q==="session_tree")return{kind:q,tree:X};if(q==="svg")return j?{kind:q,svg:j}:{kind:q};return Z?{kind:q,html:Z}:{kind:q}}function $4(_){return typeof _==="number"&&Number.isFinite(_)?_:null}function q1(_){return typeof _==="string"&&_.trim()?_.trim():null}function pV(_,$=!1){let Z=(Array.isArray(_)?_:$?["interactive"]:[]).filter((X)=>typeof X==="string").map((X)=>X.trim().toLowerCase()).filter(Boolean);return Array.from(new Set(Z))}var rV="__PICLAW_WIDGET_HOST__:";function lV(_){return JSON.stringify(_).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function jj(_,$){if(!_||_.type!=="generated_widget")return null;let j=IA(_);if(!j)return null;return{title:_.title||_.name||"Generated widget",subtitle:typeof _.subtitle==="string"?_.subtitle:"",description:_.description||_.subtitle||"",originPostId:Number.isFinite($?.id)?$.id:null,originChatJid:typeof $?.chat_jid==="string"?$.chat_jid:null,widgetId:_.widget_id||_.id||null,artifact:j,capabilities:pV(_.capabilities,_.interactive===!0),source:"timeline",status:"final"}}function nV(_){if(!_||typeof _!=="object")return null;let $=xA(_),j=q1(_?.widget_id)||q1(_?.widgetId)||q1(_?.tool_call_id)||q1(_?.toolCallId),Z=q1(_?.tool_call_id)||q1(_?.toolCallId),X=q1(_?.turn_id)||q1(_?.turnId),G=q1(_?.title)||q1(_?.name)||"Generated widget",q=q1(_?.subtitle)||"",Q=q1(_?.description)||q,K=q1(_?.status),V=K==="loading"||K==="streaming"||K==="final"||K==="error"?K:"streaming";return{title:G,subtitle:q,description:Q,originPostId:$4(_?.origin_post_id)??$4(_?.originPostId),originChatJid:q1(_?.origin_chat_jid)||q1(_?.originChatJid)||q1(_?.chat_jid)||null,widgetId:j,artifact:$,capabilities:pV(_?.capabilities,!0),source:"live",status:V,turnId:X,toolCallId:Z,width:$4(_?.width),height:$4(_?.height),error:q1(_?.error)}}function dV(_){return jj(_,null)!==null}function D_(_){let $=q1(_?.toolCallId)||q1(_?.tool_call_id);if($)return $;let j=q1(_?.widgetId)||q1(_?.widget_id);if(j)return j;let Z=$4(_?.originPostId)??$4(_?.origin_post_id);if(Z!==null)return`post:${Z}`;return null}function oV(_){let j=(_?.artifact||{}).kind||_?.kind||null,X=(Array.isArray(_?.capabilities)?_.capabilities:[]).some((G)=>typeof G==="string"&&G.trim().toLowerCase()==="interactive");return j==="html"&&(_?.source==="live"||X)}function iV(_){return oV(_)?"allow-downloads allow-scripts allow-same-origin allow-forms":"allow-downloads"}function U8(_){return{title:q1(_?.title)||"Generated widget",widgetId:q1(_?.widgetId)||q1(_?.widget_id),toolCallId:q1(_?.toolCallId)||q1(_?.tool_call_id),turnId:q1(_?.turnId)||q1(_?.turn_id),capabilities:Array.isArray(_?.capabilities)?_.capabilities:[],source:_?.source==="live"?"live":"timeline",status:q1(_?.status)||"final"}}function D8(_){return{...U8(_),subtitle:q1(_?.subtitle)||"",description:q1(_?.description)||"",error:q1(_?.error)||null,width:$4(_?.width),height:$4(_?.height),runtimeState:_?.runtimeState&&typeof _.runtimeState==="object"?_.runtimeState:null}}function z8(_){return`${rV}${JSON.stringify(D8(_))}`}function sV(_){if(typeof _==="string"&&_.trim())return _.trim();if(!_||typeof _!=="object")return null;let $=q1(_.text)||q1(_.content)||q1(_.message)||q1(_.prompt)||q1(_.value);if($)return $;let j=_.data;if(typeof j==="string"&&j.trim())return j.trim();if(j&&typeof j==="object"){let Z=q1(j.text)||q1(j.content)||q1(j.message)||q1(j.prompt)||q1(j.value);if(Z)return Z}return null}function aV(_){if(!_||typeof _!=="object")return!1;return _.close===!0||_.dismiss===!0||_.closeAfterSubmit===!0}function tV(_){let $=q1(_?.status);if($==="loading"||$==="streaming")return"Widget is loading…";if($==="error")return q1(_?.error)||"Widget failed to load.";if((_?.artifact?.kind||_?.kind)==="session_tree")return"Session tree widget is unavailable.";return"Widget artifact is missing or unsupported."}function CA(_){let $=U8(_);return`<script>
(function () {
  const meta = ${lV($)};
  function post(kind, payload) {
    try {
      window.parent.postMessage({
        __piclawGeneratedWidget: true,
        kind,
        widgetId: meta.widgetId || null,
        toolCallId: meta.toolCallId || null,
        turnId: meta.turnId || null,
        payload: payload || {}
      }, '*');
    } catch {
      /* expected: parent bridge may be unavailable while the iframe is unloading. */
    }
  }

  const windowNamePrefix = ${lV(rV)};
  let lastWindowName = null;
  let pendingHostEnvelope = null;
  let pendingHostEnvelopeFrame = 0;
  let lastDispatchedEnvelopeKey = null;

  function getEnvelopeKey(data) {
    try {
      return JSON.stringify([
        data?.type || null,
        data?.widgetId || null,
        data?.toolCallId || null,
        data?.turnId || null,
        data?.payload || null,
      ]);
    } catch {
      return null;
    }
  }

  function flushHostEnvelope() {
    pendingHostEnvelopeFrame = 0;
    const data = pendingHostEnvelope;
    pendingHostEnvelope = null;
    if (!data) return;

    window.piclawWidget.lastHostMessage = data;
    const nextPayload = data.payload || null;
    if (data.type === 'widget.init') {
      const previous = window.piclawWidget.hostState && typeof window.piclawWidget.hostState === 'object'
        ? window.piclawWidget.hostState
        : null;
      if (nextPayload && typeof nextPayload === 'object') {
        window.piclawWidget.hostState = {
          ...(previous || {}),
          ...nextPayload,
          ...(Object.prototype.hasOwnProperty.call(nextPayload, 'runtimeState')
            ? {}
            : { runtimeState: previous?.runtimeState ?? null }),
        };
      } else {
        window.piclawWidget.hostState = previous || null;
      }
    } else if (data.type === 'widget.update' || data.type === 'widget.complete' || data.type === 'widget.error') {
      window.piclawWidget.hostState = nextPayload;
    }

    const effectivePayload = window.piclawWidget.hostState ?? nextPayload ?? null;
    const detail = (effectivePayload === data.payload)
      ? data
      : { ...data, payload: effectivePayload };
    const envelopeKey = getEnvelopeKey(detail);
    if (envelopeKey && envelopeKey === lastDispatchedEnvelopeKey) return;
    lastDispatchedEnvelopeKey = envelopeKey;
    window.dispatchEvent(new CustomEvent('piclaw:widget-message', { detail }));
  }

  function scheduleHostEnvelope(data) {
    if (!data) return;
    pendingHostEnvelope = data;
    if (pendingHostEnvelopeFrame) return;
    const schedule = typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (cb) => setTimeout(cb, 0);
    pendingHostEnvelopeFrame = schedule(flushHostEnvelope);
  }

  function readWindowNameState() {
    try {
      const raw = window.name || '';
      if (!raw || raw === lastWindowName || !raw.startsWith(windowNamePrefix)) return;
      lastWindowName = raw;
      const payload = JSON.parse(raw.slice(windowNamePrefix.length));
      scheduleHostEnvelope({
        __piclawGeneratedWidgetHost: true,
        type: 'widget.update',
        widgetId: meta.widgetId || null,
        toolCallId: meta.toolCallId || null,
        turnId: meta.turnId || null,
        payload,
      });
    } catch {
      /* expected: host window.name payload can be absent or mid-update while polling. */
    }
  }

  window.piclawWidget = {
    meta,
    lastHostMessage: null,
    hostState: null,
    ready(payload) { post('widget.ready', payload); },
    close(payload) { post('widget.close', payload); },
    requestRefresh(payload) { post('widget.request_refresh', payload); },
    submit(payload) { post('widget.submit', payload); },
  };

  window.addEventListener('message', function (event) {
    const data = event && event.data;
    if (!data || data.__piclawGeneratedWidgetHost !== true) return;
    if ((data.widgetId || null) !== (meta.widgetId || null)) return;
    scheduleHostEnvelope(data);
  });

  function announceReady() {
    readWindowNameState();
    post('widget.ready', { title: document.title || meta.title || 'Generated widget' });
  }

  setInterval(readWindowNameState, 250);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', announceReady, { once: true });
  } else {
    announceReady();
  }
})();
</script>`}function eV(_){let $=_?.artifact||{},j=$.kind||_?.kind||null,Z=typeof $.html==="string"?$.html:typeof _?.html==="string"?_.html:"",X=typeof $.svg==="string"?$.svg:typeof _?.svg==="string"?_.svg:"",G=typeof _?.title==="string"&&_.title.trim()?_.title.trim():"Generated widget",q=j==="svg"?X:Z;if(!q)return"";let Q=oV(_),K=["default-src 'none'","img-src data: blob: https: http:","style-src 'unsafe-inline'","font-src 'self' data: https: http:","media-src data: blob: https: http:","connect-src 'none'","frame-src 'none'",Q?"script-src 'unsafe-inline' 'self'":"script-src 'none'","object-src 'none'","base-uri 'none'","form-action 'none'"].join("; "),V=j==="svg"?`<div class="widget-svg-shell">${q}</div>`:q,Y=Q?CA(_):"";return`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="Content-Security-Policy" content="${K}" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${G.replace(/[<&>]/g,"")}</title>
<style>
:root { color-scheme: dark light; }
html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background: #0f1117;
  color: #f5f7fb;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
body {
  box-sizing: border-box;
}
.widget-svg-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}
.widget-svg-shell svg {
  max-width: 100%;
  height: auto;
}
</style>
${Y}
</head>
<body>${V}</body>
</html>`}M0();function PA(_){let $=new Map,j=[];for(let q of _||[])$.set(q.id,{...q,children:[],depth:0});for(let q of _||[]){let Q=$.get(q.id);if(!Q)continue;let K=q.parentId?$.get(q.parentId):null;if(K)K.children.push(Q);else j.push(Q)}let Z=new Set;for(let[,q]of $){if(q.role!=="assistant"||!q.toolName)continue;if(q.children.length!==1)continue;let Q=q.children[0];if(Q.role!=="toolResult")continue;q.resultDetail=Q.detail||null,q.resultLength=Q.contentLength||0,q.resultId=Q.id,q.merged=!0,q.children=Q.children;for(let K of q.children)K.parentId=q.id;Z.add(Q.id)}let X=j.filter((q)=>!Z.has(q.id)),G=[];for(let q=X.length-1;q>=0;q--)X[q].depth=0,G.push(X[q]);while(G.length>0){let q=G.pop(),Q=q.children.length>1;for(let K=q.children.length-1;K>=0;K--)q.children[K].depth=Q?q.depth+1:q.depth,G.push(q.children[K])}return X}function fA(_){let $=[],j=[];for(let Z=_.length-1;Z>=0;Z--)j.push(_[Z]);while(j.length>0){let Z=j.pop();$.push(Z);for(let X=Z.children.length-1;X>=0;X--)j.push(Z.children[X])}return $}function _K(_){if(!_||_<=0)return"";if(_<1000)return`${_}`;if(_<1e6)return`${(_/1000).toFixed(1)}k`;return`${(_/1e6).toFixed(1)}M`}function y5(_){if(!_||_<=0)return"";if(_<1000)return`${_} chars`;if(_<1e6)return`${(_/1000).toFixed(1)}k chars`;return`${(_/1e6).toFixed(1)}M chars`}function RA(_){let $=_.type;if($==="model_change")return{tag:"model",tagClass:"system",text:`${_.preview?.replace("[model ","").replace("]","")||""}`};if($==="thinking_level_change")return{tag:"thinking",tagClass:"system",text:_.preview?.replace("[thinking ","").replace("]","")||""};if($==="compaction")return{tag:"compaction",tagClass:"system",text:_.preview?.replace("[compaction: ","").replace("]","")||""};if($==="label")return{tag:"label",tagClass:"system",text:_.preview?.replace("[label ","").replace("]","")||""};if($==="session_info")return{tag:"session",tagClass:"system",text:_.preview?.replace("[session name ","").replace("]","")||""};if($==="branch_summary")return{tag:"summary",tagClass:"system",text:_.preview||""};if($!=="message")return{tag:$||"?",tagClass:"system",text:_.preview||""};let j=_.role||"message";if(_.merged&&_.toolName){let X=(_.toolInput||"").split(`
`)[0],G=X.length>120?X.slice(0,119)+"…":X;return{tag:_.toolName,tagClass:"tool",text:G||""}}if(j==="assistant"&&_.toolName){let X=(_.toolInput||"").split(`
`)[0],G=X.length>120?X.slice(0,119)+"…":X;return{tag:_.toolName,tagClass:"tool",text:G||"…"}}if(j==="toolResult"){let X=(_.detail||"").split(`
`)[0],G=X.length>120?X.slice(0,119)+"…":X;return{tag:`→ ${_.toolName||"result"}`,tagClass:"result",text:G}}if(j==="user"){let G=(_.previewText||_.detail||_.preview||"").replace(/^user:\s*"?/,"").replace(/"?\s*$/,"").split(`
`)[0];return{tag:"user",tagClass:"user",text:G.length>120?G.slice(0,119)+"…":G}}if(j==="assistant"){let G=(_.detail||_.preview||"").replace(/^assistant:\s*"?/,"").replace(/"?\s*$/,"").split(`
`)[0];return{tag:"assistant",tagClass:"assistant",text:G.length>120?G.slice(0,119)+"…":G}}return{tag:j,tagClass:"other",text:_.preview||""}}function SA(_,$=!1){let j=typeof _==="string"?_.trim():"";if(!j)return null;return{text:$?`/tree ${j} --summarize`:`/tree ${j}`,navigateTargetId:j,summarize:Boolean($)}}function $K(_){let $=typeof _==="string"?_.trim():"";if(!$.startsWith("/tree"))return null;let j=$.split(/\s+/).filter(Boolean);if(j[0]!=="/tree")return null;let Z=null,X=!1;for(let G=1;G<j.length;G++){let q=j[G];if(q==="--summarize"){X=!0;continue}if(!Z&&!q.startsWith("--"))Z=q}return Z?{targetId:Z,summarize:X}:null}function bA(_,$,j,Z){let X=Array.isArray(_)?_:[];if(X.length===0)return null;let G=(Q)=>typeof Q==="string"&&X.some((K)=>K?.id===Q);if(G($))return $;if(G(j))return j;if(G(Z))return Z;let q=X.find((Q)=>Q?.active);if(q?.id)return q.id;return X[0]?.id||null}function gA(_){if(!_||typeof _!=="object")return null;let $=typeof _.type==="string"?_.type:"",j=typeof _.preview==="string"?_.preview.trim():"",Z=typeof _.error==="string"?_.error.trim():"",X=$K(j),G=j||"tree command";if($==="submit_pending")return{tone:"pending",text:X?`Sending ${G}`:"Sending tree command…",refreshDelays:[]};if($==="submit_sent")return{tone:"info",text:X?`Running ${G}`:"Tree command sent.",refreshDelays:X?[500,1500,3500,8000]:[]};if($==="submit_queued")return{tone:"info",text:X?`Queued ${G}`:"Tree command queued.",refreshDelays:X?[1200,3200,7000,12000]:[]};if($==="submit_failed")return{tone:"error",text:Z?`Tree command failed: ${Z}`:"Tree command failed.",refreshDelays:[]};if($==="refresh_building")return{tone:"pending",text:"Refreshing widget…",refreshDelays:[]};if($==="refresh_failed")return{tone:"error",text:Z?`Refresh failed: ${Z}`:"Refresh failed.",refreshDelays:[]};if($==="refresh_dashboard"||$==="refresh_ack")return{tone:"success",text:"Widget refreshed.",refreshDelays:[]};return null}function jK({widget:_,onWidgetEvent:$}){let j=_?.artifact?.tree&&typeof _.artifact.tree==="object"?_.artifact.tree:null,Z=typeof _?.originChatJid==="string"&&_.originChatJid.trim()?_.originChatJid.trim():null,X=_?.runtimeState&&typeof _.runtimeState==="object"?_.runtimeState:null,G=X?.lastHostUpdate&&typeof X.lastHostUpdate==="object"?X.lastHostUpdate:null,[q,Q]=C(()=>({loading:!j,error:null,data:j})),[K,V]=C(()=>j?.leafId||null),[Y,N]=C(""),F=g(null),B=g(null),D=g(j?.leafId||null),W=g(null),H=g(""),z=async()=>{Q((M)=>({...M,loading:!0,error:null}));try{let M=Z?`?chat_jid=${encodeURIComponent(Z)}`:"",O=await fetch(`/agent/session-tree${M}`,{method:"GET",credentials:"same-origin",headers:{Accept:"application/json"}}),T=await O.json().catch(()=>({}));if(!O.ok)throw Error(T?.error||`HTTP ${O.status}`);Q({loading:!1,error:null,data:T})}catch(M){Q((O)=>({loading:!1,error:M?.message||"Failed to load tree.",data:O?.data||j||null}))}};W.current=z,b(()=>{z()},[Z]);let k=q0(()=>{let M=q.data;if(!M||!Array.isArray(M.nodes)||M.nodes.length===0)return[];return fA(M.flat?PA(M.nodes):M.nodes)},[q.data]);b(()=>{let M=bA(k,K,D.current,q.data?.leafId||null);if(M!==K)V(M);if(D.current&&q.data?.leafId===D.current)D.current=null},[k,K,q.data?.leafId]);let J=q0(()=>{let M=(Y||"").trim().toLowerCase();if(!M)return k;return k.filter((O)=>{return[O.preview,O.toolInput,O.toolInputFull,O.detail,O.toolName,O.role,O.id,O.resultDetail,O.type,O.label].some((y)=>typeof y==="string"&&y.toLowerCase().includes(M))})},[k,Y]),L=q0(()=>J.find((M)=>M.id===K)||null,[J,K]),x=q0(()=>gA(G),[G?.type,G?.preview,G?.error,G?.submittedAt]);b(()=>{if(B.current)B.current.scrollIntoView({block:"center",behavior:"auto"})},[K,q.data?.leafId,J.length]),b(()=>{let M=$K(G?.preview);if(M?.targetId)D.current=M.targetId;let O=x?.refreshDelays||[];if(!O.length)return;let T=[Z||"",G?.type||"",G?.submittedAt||"",G?.preview||""].join("|");if(H.current===T)return;H.current=T;let y=O.map((A)=>setTimeout(()=>W.current?.(),A));return()=>y.forEach((A)=>clearTimeout(A))},[Z,G?.type,G?.submittedAt,G?.preview,x?.refreshDelays]);let I=(M=!1)=>{let O=L?.id,T=SA(O,M);if(!T)return;D.current=T.navigateTargetId,$?.({kind:"widget.submit",payload:T},_)},E=x?.tone||"info";return U`
        <div class="session-tree-widget">
            <div class="session-tree-toolbar">
                <div class="session-tree-toolbar-left">
                    <button class="session-tree-btn" type="button" onClick=${()=>z()} disabled=${q.loading}>${q.loading?"Loading…":"Refresh"}</button>
                    <input ref=${F}
                        class="st-search-input" type="text" placeholder="Filter\u2026"
                        value=${Y}
                        onInput=${(M)=>N(M.currentTarget.value)}
                        onKeyDown=${(M)=>{if(M.key==="Escape")N(""),M.currentTarget.blur()}}
                    />
                    ${Y&&U`<span class="session-tree-meta">${J.length} match${J.length!==1?"es":""}</span>`}
                    ${q.error&&U`<span class="session-tree-error-inline">${q.error}</span>`}
                </div>
                <div class="session-tree-toolbar-right">
                    ${x?.text&&U`<span class=${`session-tree-host-update ${E}`}>${x.text}</span>`}
                    ${q.data?.capped&&U`<span class="session-tree-meta">Showing ${q.data?.nodes?.length||0} of ${q.data?.total||0}</span>`}
                    ${Z&&U`<span class="session-tree-meta">${Z}</span>`}
                </div>
            </div>

            <div class="session-tree-content">
                <div class="session-tree-list" role="tree" aria-label="Session tree">
                    ${q.loading&&J.length===0&&!Y&&U`<div class="session-tree-empty">Loading session tree\u2026</div>`}
                    ${!q.loading&&J.length===0&&!Y&&U`<div class="session-tree-empty">Session tree is empty.</div>`}
                    ${!q.loading&&J.length===0&&Y&&U`<div class="session-tree-empty">No entries match \u201c${Y}\u201d</div>`}
                    ${J.map((M)=>{let O=K===M.id,T=`st-row${M.active?" active":""}${O?" selected":""}`,y=(M.children||[]).length>1,A=RA(M);return U`
                            <button key=${M.id} ref=${M.active||O?B:null}
                                class=${T} type="button" role="treeitem" aria-selected=${O}
                                onClick=${()=>V(M.id)}>
                                <span class="st-indent" style=${`width:${(M.depth||0)*16+6}px`}></span>
                                <span class=${`st-dot${M.active?" active":y?" branch":""}`}></span>
                                <span class=${`st-tag ${A.tagClass}`}>${A.tag}</span>
                                <span class="st-text">${A.text}</span>
                                ${M.merged&&M.resultLength>0&&U`<span class="st-size">${_K(M.resultLength)}</span>`}
                                ${!M.merged&&M.contentLength>3000&&U`<span class="st-size">${_K(M.contentLength)}</span>`}
                                ${M.hasThinking&&U`<span class="st-badge thinking">\u{1F4AD}</span>`}
                                ${M.label&&U`<span class="st-label">${M.label}</span>`}
                                ${M.active&&U`<span class="st-active">\u25C0</span>`}
                            </button>
                        `})}
                </div>

                <aside class="session-tree-sidebar">
                    ${L?U`
                        <div class="st-side-section">
                            <div class="st-side-label">Entry</div>
                            <div class="st-side-mono">${L.id}${L.resultId?` → ${L.resultId}`:""}</div>
                        </div>
                        <div class="st-side-section">
                            <div class="st-side-label">Type</div>
                            <div class="st-side-value">${L.role||L.type||"entry"}${L.toolName?` → ${L.toolName}`:""}${L.merged?" (merged)":""}</div>
                        </div>
                        ${L.toolInputFull&&U`
                            <div class="st-side-section">
                                <div class="st-side-label">${L.toolName==="bash"?"Command":"Input"}</div>
                                <pre class="st-side-code">${L.toolInputFull}</pre>
                            </div>
                        `}
                        ${L.resultDetail&&U`
                            <div class="st-side-section">
                                <div class="st-side-label">Result${L.resultLength?` (${y5(L.resultLength)})`:""}</div>
                                <pre class="st-side-code">${L.resultDetail}</pre>
                            </div>
                        `}
                        ${L.detail&&!L.toolInput&&U`
                            <div class="st-side-section">
                                <div class="st-side-label">${L.role==="toolResult"?"Output":"Content"}${L.contentLength?` (${y5(L.contentLength)})`:""}</div>
                                <pre class="st-side-code">${L.detail}</pre>
                            </div>
                        `}
                        ${L.rawDetail&&U`
                            <div class="st-side-section">
                                <div class="st-side-label">Raw prompt${L.rawContentLength?` (${y5(L.rawContentLength)})`:""}</div>
                                <pre class="st-side-code">${L.rawDetail}</pre>
                            </div>
                        `}
                        ${L.timestamp&&U`
                            <div class="st-side-section">
                                <div class="st-side-label">Time</div>
                                <div class="st-side-value">${new Date(L.timestamp).toLocaleString()}</div>
                            </div>
                        `}
                        ${(L.contentLength>0||L.hasThinking)&&U`
                            <div class="st-side-section">
                                <div class="st-side-label">Size</div>
                                <div class="st-side-badges">
                                    ${L.contentLength>0&&U`<span class="st-pill">${y5(L.contentLength)} content</span>`}
                                    ${L.hasThinking&&U`<span class="st-pill thinking">${y5(L.thinkingLength)} thinking</span>`}
                                    ${L.merged&&L.resultLength>0&&U`<span class="st-pill">${y5(L.resultLength)} result</span>`}
                                </div>
                            </div>
                        `}
                        <div class="st-side-actions">
                            <button class="session-tree-btn primary" type="button" onClick=${()=>I(!1)}>Navigate here</button>
                            <button class="session-tree-btn" type="button" onClick=${()=>I(!0)}>Navigate + summarize</button>
                        </div>
                    `:U`<div class="session-tree-empty side">Select an entry to inspect.</div>`}
                </aside>
            </div>
        </div>
    `}function uA(_=!1){return`floating-widget-backdrop${_?" maximized":""}`}function vA(_=!1){return`floating-widget-pane${_?" maximized":""}`}function ZK({widget:_,onClose:$,onWidgetEvent:j}){let Z=g(null),X=g(!1),[G,q]=C(!1),Q=D_(_),K=q0(()=>eV(_),[_?.artifact?.kind,_?.artifact?.html,_?.artifact?.svg,_?.widgetId,_?.toolCallId,_?.turnId,_?.title]);if(b(()=>{q(!1)},[Q]),b(()=>{if(!_)return;let L=(x)=>{if(x.key!=="Escape")return;if(G){q(!1);return}$?.()};return document.addEventListener("keydown",L),()=>document.removeEventListener("keydown",L)},[G,_,$]),b(()=>{X.current=!1},[K]),b(()=>{if(!_)return;let L=Z.current;if(!L)return;let x=(T)=>{let y=z8(_),A=T==="widget.init"?U8(_):D8(_);_j(L,y),$j(L,{__piclawGeneratedWidgetHost:!0,type:T,widgetId:_?.widgetId||null,toolCallId:_?.toolCallId||null,turnId:_?.turnId||null,payload:A})},I=()=>{x("widget.init"),x("widget.update")},E=()=>{X.current=!0,I()};L.addEventListener("load",E);let O=[0,40,120,300,800].map((T)=>setTimeout(I,T));return()=>{L.removeEventListener("load",E),O.forEach((T)=>clearTimeout(T))}},[K,_?.widgetId,_?.toolCallId,_?.turnId]),b(()=>{if(!_)return;let L=Z.current;if(!L?.contentWindow)return;let x=z8(_),I=D8(_);_j(L,x),$j(L,{__piclawGeneratedWidgetHost:!0,type:"widget.update",widgetId:_?.widgetId||null,toolCallId:_?.toolCallId||null,turnId:_?.turnId||null,payload:I});return},[_?.widgetId,_?.toolCallId,_?.turnId,_?.status,_?.subtitle,_?.description,_?.error,_?.width,_?.height,_?.runtimeState]),b(()=>{if(!_)return;let L=(x)=>{let I=x?.data;if(!I||I.__piclawGeneratedWidget!==!0)return;let E=Z.current,M=D_(_),O=D_({widgetId:I.widgetId,toolCallId:I.toolCallId});if(O&&M&&O!==M)return;if(!O&&E?.contentWindow&&x.source!==E.contentWindow)return;j?.(I,_)};return window.addEventListener("message",L),()=>window.removeEventListener("message",L)},[_,j]),!_)return null;let Y=(_?.artifact||{}).kind||_?.kind||"html",N=typeof _?.title==="string"&&_.title.trim()?_.title.trim():"Generated widget",F=typeof _?.subtitle==="string"&&_.subtitle.trim()?_.subtitle.trim():"",B=_?.source==="live"?"live":"timeline",D=typeof _?.status==="string"&&_.status.trim()?_.status.trim():"final",W=B==="live"?`Live widget • ${D.toUpperCase()}`:_?.originPostId?`Message #${_.originPostId}`:"Timeline launch",H=typeof _?.description==="string"&&_.description.trim()?_.description.trim():"",z=!K,k=tV(_),J=iV(_);return U`
        <div class=${uA(G)} onClick=${()=>$?.()}>
            <section
                class=${vA(G)}
                aria-label=${N}
                onClick=${(L)=>L.stopPropagation()}
            >
                <div class="floating-widget-header">
                    <div class="floating-widget-heading">
                        <div class="floating-widget-eyebrow">${W} • ${Y.toUpperCase()}</div>
                        <div class="floating-widget-title">${N}</div>
                        ${(F||H)&&U`
                            <div class="floating-widget-subtitle">${F||H}</div>
                        `}
                    </div>
                    <div class="floating-widget-header-actions">
                        <button
                            class="floating-widget-action floating-widget-maximize"
                            type="button"
                            onClick=${()=>q((L)=>!L)}
                            title=${G?"Exit zen mode":"Enter zen mode"}
                            aria-label=${G?"Exit zen mode":"Enter zen mode"}
                            aria-pressed=${G?"true":"false"}
                        >
                            ${G?"Restore":"Maximize"}
                        </button>
                        <button
                            class="floating-widget-close"
                            type="button"
                            onClick=${()=>$?.()}
                            title="Close widget"
                            aria-label="Close widget"
                        >
                            Close
                        </button>
                    </div>
                </div>
                <div class="floating-widget-body">
                    ${Y==="session_tree"?U`<${jK} widget=${_} onWidgetEvent=${j} />`:z?U`<div class="floating-widget-empty">${k}</div>`:U`
                                <iframe
                                    ref=${Z}
                                    class="floating-widget-frame"
                                    title=${N}
                                    name=${z8(_)}
                                    sandbox=${J}
                                    allow="microphone; clipboard-read; clipboard-write"
                                    referrerpolicy="no-referrer"
                                    srcdoc=${K}
                                ></iframe>
                            `}
                </div>
            </section>
        </div>
    `}M0();n2();T1();E5();var mA=new Set,XK=new Set,Zj=new Set,b4=new Map,GK=!1,W8=null;function cA(_=typeof window<"u"?window:null){let $=typeof _?.__piclawCurrentChatJid==="string"?_.__piclawCurrentChatJid.trim():"";if($)return $;try{let j=_?.location?.href||"http://localhost/",Z=new URL(j).searchParams.get("chat_jid")?.trim()||"";if(Z)return Z}catch(j){}return"web:default"}function hA(_,$){let j=typeof _==="string"?_.trim():"";if(!j)return null;try{return new URL(j,$).href}catch{return null}}function qK(_){if(!_||typeof _.id!=="string"||!_.id.trim())return!1;return Q1.register(_),mA.add(_.id),!0}function lA(_){return qK(_)}function pA(_){if(!_||typeof _.id!=="string"||!_.id.trim())return()=>{};return s$(_),XK.add(_.id),D9(),()=>{sq(_.id),XK.delete(_.id),D9()}}function rA(_){if(typeof _!=="function")return()=>{};return Zj.add(_),()=>{Zj.delete(_)}}function QK(_,$={}){let j=typeof _==="string"?_.trim():"";if(!j)return null;for(let Z of[...Zj].reverse())try{let X=Z(j,$);if(typeof X==="string"&&X.trim())return X.trim()}catch(X){console.warn("[addon-web] standalone tab URL resolver failed:",X)}return null}function nA(_){if(!_||typeof _.id!=="string"||!_.id.trim()||typeof _.match!=="function"||typeof _.buildFrameUrl!=="function")return()=>{};return b4.set(_.id,_),()=>{if(b4.get(_.id)===_)b4.delete(_.id)}}function H8(_,$){for(let j of Array.from(b4.values()).reverse())try{if(j.match(_,$))return j}catch(Z){console.warn("[addon-web] attachment preview matcher failed:",Z)}return null}function VK(_){let $=typeof _==="string"?_.trim():"";if(!$)return null;return b4.get($)?.label||null}function KK(_){let $=typeof _==="string"?_.trim():"";if(!$)return null;return b4.get($)?.note||null}function YK(_,$,j){let Z=typeof _==="string"?_.trim():"";if(!Z)return null;let X=b4.get(Z);if(!X)return null;try{return X.buildFrameUrl($,j)||null}catch(G){return console.warn("[addon-web] attachment preview URL builder failed:",G),null}}function dA(_=typeof window<"u"?window:null){return{registerPane:lA,registerWorkspacePane:qK,registerSettingsPane:pA,registerStandaloneTabUrlResolver:rA,registerAttachmentPreview:nA,getCurrentChatJid:()=>cA(_)}}function Xj(_=typeof window<"u"?window:null){let $=dA(_);if(!_||GK)return $;return _.__piclaw_web=$,_.__piclaw_registerPane=$.registerPane,_.__piclaw_registerWorkspacePane=$.registerWorkspacePane,_.__piclaw_registerSettingsPane=$.registerSettingsPane,_.__piclaw_registerStandaloneTabUrlResolver=$.registerStandaloneTabUrlResolver,_.__piclaw_registerAttachmentPreview=$.registerAttachmentPreview,_.__piclawSettingsPaneRegistry={registerSettingsPane:$.registerSettingsPane,notifySettingsPanesChanged:()=>_?.dispatchEvent?.(new CustomEvent("piclaw:settings-panes-changed"))},GK=!0,$}async function NK(_=typeof window<"u"?window:null){if(!_)return;if(W8)return W8;return W8=(async()=>{Xj(_);try{let $=await fetch("/agent/addons/web-entries",{credentials:"same-origin"});if(!$.ok)return;let j=await $.json().catch(()=>null),Z=Array.isArray(j?.entries)?j.entries:[],X=_.location?.origin||"http://localhost";for(let G of Z){let q=hA(G?.url,X);if(!q)continue;try{await import(q)}catch(Q){console.warn("[addon-web] Failed to load installed addon web entry:",q,Q)}}}catch($){console.warn("[addon-web] Failed to fetch installed addon web entries:",$)}})(),W8}var oA=["\t",",",";","|"];function BK(_){return typeof _==="string"?_.trim().toLowerCase():""}function FK(_){return typeof _==="string"?_.split(";")[0]?.trim().toLowerCase()||"":""}function UK(_,$){let j=FK(_),Z=BK($);return j==="text/csv"||j==="application/csv"||j==="text/tab-separated-values"||j==="text/tsv"||Z.endsWith(".csv")||Z.endsWith(".tsv")||Z.endsWith(".tab")}function DK(_,$){let j=FK(_),Z=BK($);if(j==="text/tab-separated-values"||j==="text/tsv"||Z.endsWith(".tsv")||Z.endsWith(".tab"))return"\t";if(j==="text/csv"||j==="application/csv"||Z.endsWith(".csv"))return",";return null}function iA(_,$){let j=0,Z=!1;for(let X=0;X<_.length;X+=1){let G=_[X];if(G==='"')if(Z&&_[X+1]==='"')X+=1;else Z=!Z;else if(!Z&&G===$)j+=1}return j}function sA(_){let $=_.split(/\r?\n/).map((Z)=>Z.trimEnd()).filter((Z)=>Z.trim().length>0).slice(0,10),j={delimiter:"\t",score:-1};for(let Z of oA){let X=$.map((K)=>iA(K,Z)).filter((K)=>K>0);if(!X.length)continue;let G=X.reduce((K,V)=>K+V,0)/X.length,q=X.filter((K)=>Math.abs(K-G)<1).length/X.length,Q=G*q*X.length;if(Q>j.score)j={delimiter:Z,score:Q}}return j.delimiter}function aA(_,$,j){let Z=[],X=[],G="",q=!1,Q=!1,K=()=>{X.push(G),G=""},V=()=>{if(K(),!(X.length===1&&X[0]===""&&Z.length>0))Z.push(X);if(X=[],Z.length>=j)Q=!0};for(let Y=0;Y<_.length;Y+=1){if(Q)break;let N=_[Y];if(N==='"')if(q&&_[Y+1]==='"')G+='"',Y+=1;else q=!q;else if(!q&&N===$)K();else if(!q&&(N===`
`||N==="\r")){if(N==="\r"&&_[Y+1]===`
`)Y+=1;V()}else G+=N}if(!Q&&(G.length>0||X.length>0))V();return{rows:Z,truncatedRows:Q}}function tA(_,$){return _.map((j)=>{let Z=j.slice(0,$);while(Z.length<$)Z.push("");return Z})}function zK(_,$={}){let j=Math.max(1,$.maxRows??500),Z=Math.max(1,$.maxColumns??80),X=$.delimiter||sA(_),G=aA(_,X,j+1),q=G.rows.slice(0,j),Q=q.reduce((H,z)=>Math.max(H,z.length),0),K=Math.min(Math.max(1,Q),Z),V=Q>Z,Y=tA(q,K),N=Y[0]||[],F=Y.slice(1),B=N.some((H)=>H.trim().length>0)&&F.length>0,D=B?N.map((H,z)=>H.trim()||`Column ${z+1}`):Array.from({length:K},(H,z)=>`Column ${z+1}`),W=B?F:Y;return{delimiter:X,headers:D,rows:W,columnCount:K,rowCount:W.length,truncatedRows:G.truncatedRows||G.rows.length>j,truncatedColumns:V}}var eA=new Set(["application/json","application/xml","text/csv","text/html","text/markdown","text/plain","text/x-yaml","text/xml","text/yaml"]),_M=new Set(["text/markdown"]),$M=new Set(["application/msword","application/rtf","application/vnd.ms-excel","application/vnd.ms-powerpoint","application/vnd.oasis.opendocument.presentation","application/vnd.oasis.opendocument.spreadsheet","application/vnd.oasis.opendocument.text","application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.openxmlformats-officedocument.wordprocessingml.document"]),jM=new Set(["application/eml","message/rfc822"]);function j4(_){return typeof _==="string"?_.trim().toLowerCase():""}function ZM(_){let $=j4(_);return!!$&&$.endsWith(".eml")}function XM(_){let $=j4(_);return!!$&&$.endsWith(".pdf")}function GM(_){let $=j4(_);return!!$&&($.endsWith(".docx")||$.endsWith(".doc")||$.endsWith(".odt")||$.endsWith(".rtf")||$.endsWith(".xlsx")||$.endsWith(".xls")||$.endsWith(".ods")||$.endsWith(".pptx")||$.endsWith(".ppt")||$.endsWith(".odp"))}var qM=new Set(["application/zip","application/x-zip-compressed"]);function QM(_){let $=j4(_);return!!$&&$.endsWith(".zip")}function VM(_){let $=j4(_);return!!$&&($.endsWith(".html")||$.endsWith(".htm"))}function KM(_){let $=j4(_);if(!$)return!1;return $.endsWith(".sh")||$.endsWith(".bash")||$.endsWith(".zsh")||$.endsWith(".sb")||$.endsWith(".yaml")||$.endsWith(".yml")}function P6(_,$){let j=H8(_,$);if(j?.id)return j.id;let Z=j4(_);if(XM($)||Z==="application/pdf")return"pdf";if(GM($)||$M.has(Z))return"office";if(ZM($)||jM.has(Z))return"eml";if(QM($)||qM.has(Z))return"archive";if(VM($)||Z==="text/html")return"html";if(UK(Z,$))return"delimited";if(KM($))return"text";if(!Z)return"unsupported";if(Z.startsWith("video/"))return"video";if(Z.startsWith("image/"))return"image";if(eA.has(Z)||Z.startsWith("text/"))return"text";return"unsupported"}function WK(_){let $=j4(_);return _M.has($)}function O8(_){switch(_){case"image":return"Image preview";case"video":return"Video player";case"pdf":return"PDF preview";case"office":return"Office viewer";case"eml":return"Email preview";case"html":return"HTML preview";case"text":return"Text preview";case"delimited":return"Table preview";case"archive":return"ZIP archive preview";default:return VK(_)||"Preview unavailable"}}var YM=new TextDecoder("utf-8",{fatal:!1});function w5(_,$){return _[$]|_[$+1]<<8}function g4(_,$){return(_[$]|_[$+1]<<8|_[$+2]<<16|_[$+3]<<24)>>>0}function HK(_,$,j){return YM.decode(_.subarray($,$+j))}function NM(_){let $=Math.max(0,_.length-65557);for(let j=_.length-22;j>=$;j-=1)if(g4(_,j)===101010256)return j;return-1}function BM(_,$){let j=Math.max(0,$-20);for(let Z=j;Z<=$-4;Z+=1)if(g4(_,Z)===117853008)return!0;return!1}function FM(_){let $=new Set;for(let j of _){let Z=j.path.replace(/\/+/g,"/");if(!Z)continue;if(j.isDirectory){$.add(Z.endsWith("/")?Z.slice(0,-1):Z);continue}let X=Z.split("/").filter(Boolean);if(X.length<=1)continue;let G="";for(let q=0;q<X.length-1;q+=1)G=G?`${G}/${X[q]}`:X[q],$.add(G)}return $}function UM(_){return String(_||"").replace(/\\/g,"/").trim()}function OK(_){switch(Number(_)){case 0:return"Stored";case 8:return"Deflate";case 9:return"Deflate64";case 12:return"BZIP2";case 14:return"LZMA";case 93:return"Zstandard";default:return`Method ${_}`}}function LK(_){let $=_ instanceof Uint8Array?_:_ instanceof ArrayBuffer?new Uint8Array(_):new Uint8Array(_.buffer,_.byteOffset,_.byteLength);if($.length<22)throw Error("ZIP archive is too small to contain a valid directory.");let j=NM($);if(j<0)throw Error("ZIP archive directory could not be found.");if(BM($,j))throw Error("ZIP64 archives are not previewable yet.");let Z=w5($,j+10),X=g4($,j+12),G=g4($,j+16);if(G+X>$.length)throw Error("ZIP archive directory is truncated.");let q=[],Q=G,K=G+X;while(Q<K){if(Q+46>$.length)throw Error("ZIP archive directory entry is truncated.");if(g4($,Q)!==33639248)throw Error("ZIP archive directory contains an unexpected record.");let N=w5($,Q+8),F=w5($,Q+10),B=g4($,Q+20),D=g4($,Q+24),W=w5($,Q+28),H=w5($,Q+30),z=w5($,Q+32),k=Q+46,J=k+W+H,L=J+z;if(L>$.length)throw Error("ZIP archive directory entry metadata is truncated.");let x=(N&2048)===2048,I=UM(HK($,k,W)),E=HK($,J,z),M=I.endsWith("/");if(I)q.push({path:I,isDirectory:M,compressedSize:B,uncompressedSize:D,compressionMethod:F,comment:x?E:E});Q=L}q.sort((N,F)=>{if(N.isDirectory!==F.isDirectory)return N.isDirectory?-1:1;return N.path.localeCompare(F.path)});let V=q.filter((N)=>!N.isDirectory),Y=FM(q);return{entries:q,summary:{fileCount:V.length,directoryCount:Y.size,totalEntries:q.length,compressedBytes:V.reduce((N,F)=>N+F.compressedSize,0),uncompressedBytes:V.reduce((N,F)=>N+F.uncompressedSize,0)}}}function JK(_){if(!_)return null;if(_.uncompressedBytes<=0)return null;let $=1-_.compressedBytes/_.uncompressedBytes;if(!Number.isFinite($))return null;return`${Math.round($*100)}% smaller`}var DM="allow-scripts";function zM(_=!1){return`image-modal attachment-preview-modal${_?" maximized":""}`}function WM(_){if(!(_ instanceof Uint8Array)||_.length===0)return!0;let $=0,j=_.subarray(0,Math.min(_.length,4096));for(let Z of j){if(Z===0)return!1;if(Z<32&&Z!==9&&Z!==10&&Z!==13&&Z!==12)$+=1}return $/j.length<0.02}function HM(_,$){let j=String(_?.content_type||"").trim().toLowerCase(),Z=String($||"").trim().toLowerCase();if(j.startsWith("text/")||j==="application/json"||j==="application/xml")return!1;return j==="application/octet-stream"||Z.endsWith(".sb")||Z.endsWith(".sh")}function OM(_){try{return new TextDecoder("utf-8",{fatal:!1}).decode(_)}catch{return new TextDecoder().decode(_)}}function LM(_){if(_==="\t")return"Tab";if(_===",")return"Comma";if(_===";")return"Semicolon";if(_==="|")return"Pipe";return null}function JM(_,$=null,j=null,Z=null){let X=_?.metadata?.size,G=_?.content_type||"application/octet-stream",q=j?.summary||null;return[{label:"Type",value:G},{label:"Syntax",value:$},{label:"Delimiter",value:Z?LM(Z.delimiter):null},{label:"Rows",value:Z?`${Z.rowCount}${Z.truncatedRows?"+":""}`:null},{label:"Columns",value:Z?`${Z.columnCount}${Z.truncatedColumns?"+":""}`:null},{label:"Entries",value:q?String(q.totalEntries):null},{label:"Files",value:q?String(q.fileCount):null},{label:"Folders",value:q?String(q.directoryCount):null},{label:"Compressed",value:q?t1(q.compressedBytes):null},{label:"Uncompressed",value:q?t1(q.uncompressedBytes):null},{label:"Savings",value:JK(q)},{label:"Size",value:typeof X==="number"?t1(X):null},{label:"Added",value:_?.created_at?x4(_.created_at):null}].filter((Q)=>Q.value)}function EM(_,$){let j=String($||"").trim();if(j){let X=j6(j);if(X)return X}let Z=String(_?.content_type||"").trim().toLowerCase();if(Z==="application/json")return"json";if(Z==="text/yaml"||Z==="application/yaml"||Z==="text/x-yaml")return"yaml";if(Z==="application/xml"||Z==="text/xml")return"xml";if(Z==="text/html")return"html";if(Z==="text/css")return"css";if(Z==="text/javascript"||Z==="application/javascript")return"javascript";if(Z==="text/x-python"||Z==="application/x-python-code")return"python";return null}function AM(_,$,j){let Z=encodeURIComponent($||`attachment-${_}`),X=encodeURIComponent(String(_));if(j==="pdf")return`/pdf-viewer/?media=${X}&name=${Z}#media=${X}&name=${Z}`;if(j==="office"){let G=v_(_);return`/office-viewer/?url=${encodeURIComponent(G)}&name=${Z}`}if(j==="eml")return`/eml-viewer/?media=${X}&name=${Z}`;return null}function EK({mediaId:_,info:$,onClose:j}){let Z=$?.filename||`attachment-${_}`,X=q0(()=>H8($?.content_type,Z),[$?.content_type,Z]),G=q0(()=>P6($?.content_type,Z),[$?.content_type,Z]),q=X?.label||O8(G),Q=q0(()=>WK($?.content_type),[$?.content_type]),[K,V]=C(G==="text"||G==="html"||G==="archive"||G==="delimited"),[Y,N]=C(""),[F,B]=C(null),[D,W]=C(null),[H,z]=C(null),[k,J]=C(!1),L=g(null),x=q0(()=>EM($,Z),[$,Z]),I=q0(()=>x?J2(x):null,[x]),E=q0(()=>JM($,!Q?I:null,F,D),[$,Q,I,F,D]),M=q0(()=>X?YK(X.id,_,Z):AM(_,Z,G),[X,_,Z,G]),O=q0(()=>KK(X?.id||G),[X?.id,G]),T=q0(()=>{if(!Q||!Y)return"";return q_(Y)},[Q,Y]),y=q0(()=>{if(Q||!Y||!x)return"";return A2(Y,x)},[Q,Y,x]);return b(()=>{let A=(P)=>{if(P.key!=="Escape")return;if(k){J(!1);return}j()};return document.addEventListener("keydown",A),()=>document.removeEventListener("keydown",A)},[k,j]),b(()=>{if(!L.current||!T)return;L$(L.current);return},[T]),b(()=>{let A=!1;async function P(){if(G!=="text"&&G!=="html"&&G!=="archive"&&G!=="delimited"){V(!1),z(null),N(""),B(null),W(null);return}V(!0),z(null),N(""),B(null),W(null);try{let f=await d7(_),u=new Uint8Array(await f.arrayBuffer());if(G==="text"||G==="html"||G==="delimited"){if(G==="text"&&HM($,Z)&&!WM(u))throw Error("Attachment does not appear to contain text content.");let r=OM(u);if(!A){if(N(r),G==="delimited")W(zK(r,{delimiter:DK($?.content_type,Z)}))}return}let c=LK(u);if(!A)B(c)}catch(f){if(!A){let u=f instanceof Error?f.message:String(f||"Unknown error");z(G==="archive"?`Failed to load ZIP preview. ${u}`:G==="delimited"?`Failed to load table preview. ${u}`:`Failed to load text preview. ${u}`)}}finally{if(!A)V(!1)}}return P(),()=>{A=!0}},[_,G,$?.content_type,Z]),U`
        <${i$} className="attachment-preview-portal-root">
            <div class=${zM(k)} onClick=${j}>
                <div class="attachment-preview-shell" onClick=${(A)=>{A.stopPropagation()}}>
                    <div class="attachment-preview-header">
                        <div class="attachment-preview-heading">
                            <div class="attachment-preview-title">${Z}</div>
                            <div class="attachment-preview-subtitle">${q}</div>
                        </div>
                        <div class="attachment-preview-header-actions">
                            <button
                                class="attachment-preview-zen"
                                type="button"
                                onClick=${()=>J((A)=>!A)}
                                title=${k?"Exit zen mode":"Enter zen mode"}
                                aria-label=${k?"Exit zen mode":"Enter zen mode"}
                                aria-pressed=${k?"true":"false"}
                            >
                                ${k?"Restore":"Maximize"}
                            </button>
                            ${M&&U`
                                <a
                                    href=${M}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="attachment-preview-download"
                                    onClick=${(A)=>A.stopPropagation()}
                                >
                                    Open in Tab
                                </a>
                            `}
                            <a
                                href=${v_(_)}
                                download=${Z}
                                class="attachment-preview-download"
                                onClick=${(A)=>A.stopPropagation()}
                            >
                                Download
                            </a>
                            <button class="attachment-preview-close" type="button" onClick=${j}>Close</button>
                        </div>
                    </div>
                    <div class="attachment-preview-body">
                        ${K&&U`<div class="attachment-preview-state">Loading preview…</div>`}
                        ${!K&&H&&U`<div class="attachment-preview-state">${H}</div>`}
                        ${!K&&!H&&G==="image"&&U`
                            <img class="attachment-preview-image" src=${v_(_)} alt=${Z} />
                        `}
                        ${!K&&!H&&G==="video"&&U`
                            <video class="attachment-preview-video" src=${v_(_)} controls autoplay style="max-width:100%;max-height:100%;" />
                        `}
                        ${!K&&!H&&G==="html"&&U`
                            <iframe class="attachment-preview-frame" srcdoc=${Y||""} sandbox=${DM} title=${Z}></iframe>
                        `}
                        ${!K&&!H&&(G==="pdf"||G==="office"||G==="eml"||Boolean(X))&&M&&U`
                            <iframe class="attachment-preview-frame" src=${M} title=${Z}></iframe>
                        `}
                        ${!K&&!H&&O&&U`
                            <div class="attachment-preview-readonly-note">${O}</div>
                        `}
                        ${!K&&!H&&G==="delimited"&&D&&U`
                            <div class="attachment-preview-delimited">
                                ${(D.truncatedRows||D.truncatedColumns)&&U`
                                    <div class="attachment-preview-delimited-note">
                                        Showing first ${D.rowCount} rows and ${D.columnCount} columns.
                                        Download the file for the complete dataset.
                                    </div>
                                `}
                                <div class="attachment-preview-delimited-table-wrap">
                                    <table class="attachment-preview-delimited-table">
                                        <thead>
                                            <tr>
                                                ${D.headers.map((A,P)=>U`
                                                    <th key=${`h-${P}`}>${A}</th>
                                                `)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${D.rows.map((A,P)=>U`
                                                <tr key=${`r-${P}`}>
                                                    ${A.map((f,u)=>U`
                                                        <td key=${`c-${P}-${u}`}>${f}</td>
                                                    `)}
                                                </tr>
                                            `)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `}
                        ${!K&&!H&&G==="archive"&&F&&U`
                            <div class="attachment-preview-archive">
                                <div class="attachment-preview-archive-summary">
                                    <div class="attachment-preview-archive-card">
                                        <span class="attachment-preview-archive-card-label">Files</span>
                                        <strong class="attachment-preview-archive-card-value">${F.summary.fileCount}</strong>
                                    </div>
                                    <div class="attachment-preview-archive-card">
                                        <span class="attachment-preview-archive-card-label">Folders</span>
                                        <strong class="attachment-preview-archive-card-value">${F.summary.directoryCount}</strong>
                                    </div>
                                    <div class="attachment-preview-archive-card">
                                        <span class="attachment-preview-archive-card-label">Compressed</span>
                                        <strong class="attachment-preview-archive-card-value">${t1(F.summary.compressedBytes)}</strong>
                                    </div>
                                    <div class="attachment-preview-archive-card">
                                        <span class="attachment-preview-archive-card-label">Uncompressed</span>
                                        <strong class="attachment-preview-archive-card-value">${t1(F.summary.uncompressedBytes)}</strong>
                                    </div>
                                </div>
                                <div class="attachment-preview-archive-table-wrap">
                                    <table class="attachment-preview-archive-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Method</th>
                                                <th>Compressed</th>
                                                <th>Size</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${F.entries.map((A)=>U`
                                                <tr key=${A.path}>
                                                    <td class="attachment-preview-archive-name">${A.path}</td>
                                                    <td>${A.isDirectory?"Folder":"File"}</td>
                                                    <td>${A.isDirectory?"—":OK(A.compressionMethod)}</td>
                                                    <td>${A.isDirectory?"—":t1(A.compressedSize)}</td>
                                                    <td>${A.isDirectory?"—":t1(A.uncompressedSize)}</td>
                                                </tr>
                                            `)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `}
                        ${!K&&!H&&G==="text"&&Q&&U`
                            <div
                                ref=${L}
                                class="attachment-preview-markdown post-content"
                                dangerouslySetInnerHTML=${{__html:T}}
                            />
                        `}
                        ${!K&&!H&&G==="text"&&!Q&&y&&U`
                            <pre class="attachment-preview-text attachment-preview-code"><code dangerouslySetInnerHTML=${{__html:y}} /></pre>
                        `}
                        ${!K&&!H&&G==="text"&&!Q&&!y&&U`
                            <pre class="attachment-preview-text">${Y}</pre>
                        `}
                        ${!K&&!H&&G==="unsupported"&&U`
                            <div class="attachment-preview-state">
                                Preview is not available for this file type yet. You can still download it directly.
                            </div>
                        `}
                    </div>
                    <div class="attachment-preview-meta">
                        ${E.map((A)=>U`
                            <div class="attachment-preview-meta-item" key=${A.label}>
                                <span class="attachment-preview-meta-label">${A.label}</span>
                                <span class="attachment-preview-meta-value">${A.value}</span>
                            </div>
                        `)}
                    </div>
                </div>
            </div>
        </${i$}>
    `}M0();T1();e2();P9();function MM(_){if(!_||typeof _!=="object")return!1;if(_.isContentEditable)return!0;if(typeof _.closest!=="function")return!1;return Boolean(_.closest(["input","textarea","select",'[contenteditable="true"]',".compose-box",".compose-model-popup",".compose-session-popup",".settings-dialog",".workspace-sidebar",".workspace-explorer",".editor-pane-container",".dock-panel",".timeline-menu-dropdown",".rename-branch-overlay",".agent-request-modal",".attachment-preview-modal",".vnc-pane-shell",".kanban-plugin",".mindmap-editor"].join(", ")))}function kM(_){if(!_||typeof _!=="object")return!0;if(MM(_))return!1;let $=String(_.tagName||"").toUpperCase();if($==="BODY"||$==="HTML")return!0;if(typeof _.closest!=="function")return!0;return Boolean(_.closest(".container, .timeline, .post, .post-body, .post-content, .agent-status-panel"))}function TM(_){if(!I6(_))return!1;if(!kM(_?.target))return!1;return!a$.some((j)=>M$(_,j.id))}function AK(_){let $=new URL(window.location.href);if(_)$.searchParams.delete("chat_only");else $.searchParams.set("chat_only","1");window.location.href=$.toString()}function yM(_){let $=[],j=new Map(e$.map((X)=>[X.id,X])),Z=(X,G={})=>{let q=j.get(X);if(!q)return;$.push({...q,...G})};if(Z("toggle-workspace",{label:_.workspaceOpen?"Hide workspace":"Show workspace",description:_.workspaceOpen?"Hide the workspace sidebar.":"Show the workspace sidebar."}),!_.workspaceOpen&&!_.chatOnlyMode)Z("open-explorer");if(Z("toggle-chat-only",{label:_.chatOnlyMode?"Exit chat-only mode":"Chat-only mode",description:_.chatOnlyMode?"Return to the split workspace layout.":"Switch to the chat-only layout."}),typeof _.onOpenTerminalTab==="function")Z("open-terminal-tab");if(typeof _.onOpenVncTab==="function")Z("open-vnc-tab");if(typeof _.onToggleTerminalDock==="function")Z("toggle-terminal-dock",{label:_.terminalVisible?"Hide terminal dock":"Show terminal dock",description:_.terminalVisible?"Hide the terminal dock.":"Show the terminal dock."});return Z("open-settings"),$}function MK(_){if(_==="agent")return"Agents";if(_==="workspace")return"Workspace";return"Slash commands"}function wM(_){if(_?.imageUrl)return U`<img class="timeline-quick-actions-item-avatar" src=${_.imageUrl} alt="" aria-hidden="true" />`;return U`<span class="timeline-quick-actions-item-placeholder" aria-hidden="true">${_?.visualHint||""}</span>`}function L8(_,$){return U`
        <span class="timeline-quick-actions-keyhint">
            <kbd>${$}</kbd>
            <span>${_}</span>
        </span>
    `}function IM(_){let $=new URL(window.location.href);$.searchParams.set("chat_jid",_),$.searchParams.set("chat_only","1");let j=document.createElement("a");j.href=$.toString(),j.target="_blank",j.rel="noopener",j.style.display="none",document.body.appendChild(j),j.click(),j.remove()}function kK({activeChatAgents:_=[],currentChatJid:$="web:default",workspaceOpen:j=!1,chatOnlyMode:Z=!1,terminalVisible:X=!1,onSwitchChat:G,onToggleWorkspace:q,onOpenTerminalTab:Q,onOpenVncTab:K,onToggleTerminalDock:V,onPrefillCompose:Y}){let[N,F]=C(!1),[B,D]=C(""),[W,H]=C(0),[z,k]=C([]),[J,L]=C({workspaceCommands:null,slashCommands:null}),x=g(null),I=g(null),E=R(async()=>{try{let y=await F6();L(_4(y?.settings))}catch{L({workspaceCommands:null,slashCommands:null})}},[]);b(()=>{E()},[E]),b(()=>{let y=!1;return B6($).then((A)=>{if(y)return;k(Array.isArray(A?.commands)?A.commands:[])}).catch(()=>{if(y)return;k([])}),()=>{y=!0}},[$]);let M=q0(()=>yM({workspaceOpen:j,chatOnlyMode:Z,terminalVisible:X,onOpenTerminalTab:Q,onOpenVncTab:K,onToggleTerminalDock:V}),[Z,Q,K,V,X,j]),O=q0(()=>lQ({agents:_,workspaceCommands:M,slashCommands:z,settings:J,query:B}),[_,B,J,z,M]);if(b(()=>{if(O.length===0){H(-1);return}if(!B.trim()){H(0);return}let y=B.toLowerCase().replace(/^[@/]+/,"").trim();if(!y){H(0);return}let A=0,P=0;for(let f=0;f<O.length;f++){let u=O[f],c=(u.title||"").toLowerCase().replace(/^[@/]+/,"");if(c===y){A=f;break}let r=0;if(c.startsWith(y))r=3;else if(c.includes(y))r=2;else if((u.subtitle||"").toLowerCase().includes(y))r=1;if(r>P)P=r,A=f}H(A)},[O,B]),b(()=>{if(!N)return;requestAnimationFrame(()=>I.current?.focus?.())},[N]),b(()=>{let y=(P)=>{if(!N){if(!TM(P))return;P.preventDefault(),D(String(P.key||"")),H(0),F(!0);return}if(P.key==="Escape"){P.preventDefault(),F(!1),D("");return}if(P.key==="ArrowDown"){P.preventDefault(),H((f)=>O.length>0?(f+1+O.length)%O.length:0);return}if(P.key==="ArrowUp"){P.preventDefault(),H((f)=>O.length>0?(f-1+O.length)%O.length:0);return}if(P.key==="Enter"&&O[W]){P.preventDefault();let f=O[W],u=P.altKey;if(f){if(f.kind==="agent"&&f.chatJid)if(u)IM(f.chatJid);else G?.(f.chatJid);else if(f.kind==="workspace"&&f.commandId){if(f.commandId==="toggle-workspace"||f.commandId==="open-explorer")q?.();if(f.commandId==="toggle-chat-only")AK(Z);if(f.commandId==="open-terminal-tab")Q?.();if(f.commandId==="open-vnc-tab")K?.();if(f.commandId==="toggle-terminal-dock")V?.();if(f.commandId==="open-settings")window.dispatchEvent(new CustomEvent("piclaw:open-settings"))}else if(f.kind==="slash"&&f.commandName)Y?.(f.commandName)}F(!1),D("")}},A=(P)=>{if(!N)return;if(x.current?.contains(P.target))return;F(!1),D("")};return window.addEventListener("keydown",y,!0),document.addEventListener("pointerdown",A,!0),()=>{window.removeEventListener("keydown",y,!0),document.removeEventListener("pointerdown",A,!0)}},[Z,W,O,Q,K,Y,G,V,q,N]),b(()=>{let y=(A)=>{let P=_4(A?.detail?.settings);if(A?.detail?.settings){L(P);return}E()};return window.addEventListener("focus",y),window.addEventListener("piclaw:quick-actions-settings-updated",y),()=>{window.removeEventListener("focus",y),window.removeEventListener("piclaw:quick-actions-settings-updated",y)}},[E]),!N)return null;let T=null;return U`
        <div class="timeline-quick-actions-portal">
            <div class="timeline-quick-actions-overlay">
                <div class="timeline-quick-actions" ref=${x}>
                    <div class="timeline-quick-actions-header">
                        <div class="timeline-quick-actions-search-row">
                            <input
                                ref=${I}
                                class="timeline-quick-actions-input"
                                type="text"
                                value=${B}
                                placeholder="Type to jump to an agent, workspace action, or slash command…"
                                onInput=${(y)=>{D(y.currentTarget?.value||""),H(0)}}
                            />
                            <div class="timeline-quick-actions-hints" aria-hidden="true">
                                ${L8("Move","↑↓")}
                                ${L8("Select","↵")}
                                ${L8("Pop out","Alt+↵")}
                                ${L8("Close","Esc")}
                            </div>
                        </div>
                    </div>
                    <div class="timeline-quick-actions-list">
                        ${O.length===0&&U`<div class="timeline-quick-actions-empty">No quick actions match.</div>`}
                        ${O.map((y,A)=>{let P=y.kind!==T;return T=y.kind,U`
                                ${P&&U`<div class="timeline-quick-actions-section">${MK(y.kind)}</div>`}
                                <button
                                    key=${y.key}
                                    type="button"
                                    class=${`timeline-quick-actions-item timeline-quick-actions-item-${y.kind}${A===W?" active":""}`}
                                    onMouseEnter=${null}
                                    onClick=${()=>{if(y.kind==="agent"&&y.chatJid)G?.(y.chatJid);if(y.kind==="workspace"&&y.commandId==="toggle-workspace")q?.();if(y.kind==="workspace"&&y.commandId==="open-explorer")q?.();if(y.kind==="workspace"&&y.commandId==="toggle-chat-only")AK(Z);if(y.kind==="workspace"&&y.commandId==="open-terminal-tab")Q?.();if(y.kind==="workspace"&&y.commandId==="open-vnc-tab")K?.();if(y.kind==="workspace"&&y.commandId==="toggle-terminal-dock")V?.();if(y.kind==="workspace"&&y.commandId==="open-settings")window.dispatchEvent(new CustomEvent("piclaw:open-settings"));if(y.kind==="slash"&&y.commandName)Y?.(y.commandName);F(!1),D("")}}
                                >
                                    <span class="timeline-quick-actions-item-media">
                                        ${wM(y)}
                                    </span>
                                    <span class="timeline-quick-actions-item-copy">
                                        <span class="timeline-quick-actions-item-title-row">
                                            <span class="timeline-quick-actions-item-title">${y.title}</span>
                                            ${y.actionHint?U`<span class="timeline-quick-actions-item-action-hint">${y.actionHint}</span>`:null}
                                        </span>
                                        <span class="timeline-quick-actions-item-subtitle">${y.subtitle}</span>
                                    </span>
                                    <span class="timeline-quick-actions-item-category">${y.categoryLabel||MK(y.kind)}</span>
                                </button>
                            `})}
                    </div>
                </div>
            </div>
        </div>
    `}M0();function TK({workspaceOpen:_,toggleWorkspace:$,chatOnlyMode:j,onOpenTerminalTab:Z,onOpenVncTab:X,onToggleTerminal:G,terminalVisible:q}){let[Q,K]=C(!1),[V,Y]=C({top:8,left:8}),N=g(null),F=g(null),B=g(null);b(()=>{if(typeof document>"u")return;let z=document.createElement("div");return z.className="timeline-menu-portal in-chat",document.body.appendChild(z),B.current=z,()=>{z.remove(),B.current=null}},[]),b(()=>{let z=()=>{if(_){let L=document.querySelector(".workspace-sidebar");if(L){let x=L.getBoundingClientRect();Y({top:x.top+8,left:x.left+8})}}else Y({top:8,left:8})};z();let k=new ResizeObserver(z),J=document.querySelector(".workspace-sidebar");if(J)k.observe(J);return window.addEventListener("resize",z),()=>{k.disconnect(),window.removeEventListener("resize",z)}},[_]),b(()=>{if(B.current)B.current.className=`timeline-menu-portal ${_?"in-workspace":"in-chat"}`},[_]),b(()=>{if(!B.current)return;let z=B.current.style;z.top=`${V.top}px`,z.left=`${V.left}px`,z.right="auto"},[V]),b(()=>{if(!Q)return;let z=(k)=>{if(N.current?.contains(k.target))return;if(F.current?.contains(k.target))return;K(!1)};return document.addEventListener("mousedown",z,!0),()=>document.removeEventListener("mousedown",z,!0)},[Q]),b(()=>{if(!Q)return;let z=(k)=>{if(k.key==="Escape")K(!1)};return document.addEventListener("keydown",z),()=>document.removeEventListener("keydown",z)},[Q]),b(()=>{K(!1)},[_]);let D=R((z)=>{K(!1),z?.()},[]),W=R(()=>{let z=new URL(window.location.href);if(j)z.searchParams.delete("chat_only");else z.searchParams.set("chat_only","1");window.location.href=z.toString()},[j]),H=U`
        <button ref=${F} class=${`timeline-menu-btn${Q?" active":""}`}
            onClick=${()=>K((z)=>!z)} title="Menu" aria-label="Menu"
            aria-haspopup="menu" aria-expanded=${Q?"true":"false"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
        </button>
        ${Q&&U`
            <div class="workspace-menu-dropdown timeline-menu-dropdown" ref=${N} role="menu">
                <button class="workspace-menu-item" role="menuitem" onClick=${()=>D($)}>
                    ${_?"Hide workspace":"Show workspace"}
                </button>
                ${!_&&!j&&U`
                    <button class="workspace-menu-item" role="menuitem" onClick=${()=>D(()=>{$()})}>
                        Open explorer
                    </button>
                `}
                <button class=${`workspace-menu-item${j?" active":""}`} role="menuitem" onClick=${()=>D(W)}>
                    ${j?"Exit chat-only mode":"Chat-only mode"}
                </button>

                ${(Z||X||G)&&U`<div class="workspace-menu-separator"></div>`}
                ${Z&&U`<button class="workspace-menu-item" role="menuitem" onClick=${()=>D(Z)}>Open terminal in tab</button>`}
                ${X&&U`<button class="workspace-menu-item" role="menuitem" onClick=${()=>D(X)}>Open VNC in tab</button>`}
                ${G&&U`<button class="workspace-menu-item" role="menuitem" onClick=${()=>D(G)}>${q?"Hide terminal dock":"Show terminal dock"}</button>`}

                <div class="workspace-menu-separator"></div>
                <button class="workspace-menu-item" role="menuitem" onClick=${()=>D(()=>window.dispatchEvent(new CustomEvent("piclaw:open-settings")))}>Settings</button>
            </div>
        `}
    `;return G5(()=>{if(B.current)U$(H,B.current)}),null}M0();T1();var yK="PiClaw";function Gj(_,$,j=!1){let Z=_||"PiClaw",X=Z.charAt(0).toUpperCase(),G=["#FF6B6B","#4ECDC4","#45B7D1","#FFA07A","#98D8C8","#F7DC6F","#BB8FCE","#85C1E2","#F8B195","#6C5CE7","#00B894","#FDCB6E","#E17055","#74B9FF","#A29BFE","#FD79A8","#00CEC9","#FFEAA7","#DFE6E9","#FF7675","#55EFC4","#81ECEC","#FAB1A0","#74B9FF","#A29BFE","#FD79A8"],q=X.charCodeAt(0)%G.length,Q=G[q],K=Z.trim().toLowerCase(),V=typeof $==="string"?$.trim():"",Y=V?V:null,N=j||K==="PiClaw".toLowerCase()||K==="pi";return{letter:X,color:Q,image:Y||(N?"/static/icon-192.png":null)}}function wK(_,$){if(!_)return"PiClaw";let j=$[_]?.name||_;return j?j.charAt(0).toUpperCase()+j.slice(1):"PiClaw"}function IK(_,$){if(!_)return null;let j=$[_]||{};return j.avatar_url||j.avatarUrl||j.avatar||null}function xK(_){if(!_)return null;if(typeof document<"u"){let G=document.documentElement,q=G?.dataset?.colorTheme||"",Q=G?.dataset?.tint||"",K=getComputedStyle(G).getPropertyValue("--accent-color")?.trim();if(K&&(Q||q&&q!=="default"))return K}let $=["#4ECDC4","#FF6B6B","#45B7D1","#BB8FCE","#FDCB6E","#00B894","#74B9FF","#FD79A8","#81ECEC","#FFA07A"],j=String(_),Z=0;for(let G=0;G<j.length;G+=1)Z=(Z*31+j.charCodeAt(G))%2147483647;let X=Math.abs(Z)%$.length;return $[X]}function qj(..._){for(let $ of _)if(typeof $==="string"&&$.trim())return $.trim();return null}function xM(_){if(_.startsWith('"')&&_.endsWith('"')||_.startsWith("'")&&_.endsWith("'"))return _.slice(1,-1);return _}function CK(_){if(typeof _!=="string"||!_.trim())return null;let $=_.match(/^\s*cd\s+(.+?)(?:\s*(?:&&|;|\n))/s);if(!$?.[1])return null;return xM($[1].trim())||null}function PK(_,$){let j=$&&typeof $==="object"?$:null;if(!j)return null;let Z=qj(j.cwd,j.working_directory,j.workingDirectory);if(Z)return Z;let X=qj(j.project_dir,j.projectDir,j.repo_path,j.repoPath);if(X)return X;let G=qj(j.command),q=CK(G);if(q)return q;if(Array.isArray(j.commands))for(let Q of j.commands){let K=CK(Q);if(K)return K}return null}M0();var fK={right:"3 2 8 5 3 8",down:"2 3 8 3 5 8",up:"2 7 8 7 5 2",left:"7 2 2 5 7 8"};function RK(_){return _==="down"||_==="up"||_==="left"?_:"right"}function SK(_,$=""){return["ui-disclosure-triangle",`ui-disclosure-triangle-${_}`,$.trim()].filter(Boolean).join(" ")}function t_(_="right",$=""){let j=RK(_);return U`
    <svg class=${SK(j,$)} viewBox="0 0 10 10" aria-hidden="true" focusable="false">
      <polygon points=${fK[j]}></polygon>
    </svg>
  `}function Qj(_="right",$=""){let j=RK(_);return`<svg class="${SK(j,$)}" viewBox="0 0 10 10" aria-hidden="true" focusable="false"><polygon points="${fK[j]}"></polygon></svg>`}var CM=U`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="9" y="9" width="10" height="10" rx="2"></rect>
        <path d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"></path>
    </svg>
`,PM=U`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M6 3v12"></path>
        <circle cx="18" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle>
        <path d="M18 9a9 9 0 0 1-9 9"></path>
    </svg>
`,fM=U`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M12 7v5l3 2"></path>
    </svg>
`,RM=1e4,bK=132;function SM(_,$=bK){let j=Number.isFinite($)&&$>0?Math.floor($):bK;return String(_||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`).map((Z)=>Z.length>j?`${Z.slice(0,j)}…`:Z).join(`
`)}function bM(_){return(Array.isArray(_)?_:_&&Array.isArray(_.status_hints)?_.status_hints:[]).filter((j)=>j&&typeof j==="object").map((j,Z)=>({key:typeof j.key==="string"&&j.key.trim()?j.key.trim():`hint-${Z}`,iconSvg:typeof j.icon_svg==="string"?j.icon_svg.trim():"",label:typeof j.label==="string"?j.label.trim():"",title:typeof j.title==="string"?j.title.trim():""})).filter((j)=>j.iconSvg&&j.label)}function gM(_){if(!(_ instanceof Set)||_.size===0)return null;let $=Array.from(_.values());for(let j=$.length-1;j>=0;j-=1){let Z=$[j];if(Z==="thought"||Z==="draft")return Z}return null}function uM(_){if(!Array.isArray(_)||_.length===0)return[];let $=new Map([["ssh",0]]);return _.map((j,Z)=>({hint:j,index:Z})).sort((j,Z)=>{let X=$.get(j.hint?.key)??100,G=$.get(Z.hint?.key)??100;if(X!==G)return X-G;return j.index-Z.index}).map((j)=>j.hint)}function vM(_,$){let j=typeof _==="string"?_.trim():"",Z=typeof $==="string"?$.trim():"";return[j?j.split(/[\\/]+/).filter(Boolean).pop()||j:"",Z].filter(Boolean).join(" • ")}function gK(_){if(!_||typeof _!=="object")return!1;let $=typeof _.type==="string"?_.type:"",j=Boolean(_.last_activity||_.lastActivity),Z=$==="tool_call"||$==="tool_status"||Boolean(_.tool_name||_.tool_args);if(!j&&!Z)return!1;return o$(_)!==null}function uK(_){if(!_||typeof _!=="object")return!1;return _.type==="intent"&&l2(_)!==null}function mM(_,$=Date.now()){if(!Number.isFinite(_))return!1;return $-_>=RM}function cM(_,$=Date.now()){if(!gK(_))return null;let j=o$(_);if(j===null||!mM(j,$))return null;let Z=nK(new Date(j).toISOString(),$);return Z?`${Z} ago`:null}function hM(_,$=Date.now()){if(!uK(_))return null;if(l2(_)===null)return null;return A6(_,$)}function vK(_){return typeof _==="string"&&/^streaming output\.{3}$/i.test(_.trim())}function lM(_){if(typeof _!=="string")return"";return _.replace(/[…]+/g,".").replace(/\s+/g," ").trim().replace(/[\s:;,.!?-]+$/g,"").toLowerCase()}function pM(_){if(!_||typeof _!=="object")return!1;let $=typeof _.type==="string"?_.type:"";return $==="tool_call"||$==="tool_status"||Boolean(_.tool_name||_.toolName||_.tool_args||_.toolArgs)}function mK(_){if(!pM(_))return"";let $=_?.status||_?.tool_status||_?.toolStatus;if(vK($))return"";return lM($)}function cK(_,$){let j=typeof _==="string"?_:"",Z=typeof $==="string"?$.trim():"";if(!j||!Z)return j;let X=Z.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return j.replace(new RegExp(`\\s*[:—-]\\s*${X}\\s*$`,"i"),"")}function J8(_){return _?U`<span class="agent-tool-status-pill">${_}</span>`:null}function hK(_){let $=typeof _?.title==="string"&&_.title.trim()?_.title.trim():"";if($)return $;let j=typeof(_?.tool_name||_?.toolName)==="string"?String(_.tool_name||_.toolName).trim():"";if(!j)return"";let[Z]=pK(_);return Z?`${j}: ${Z}`:j}function rM(_,$={}){let j=$?.isLastActivity??Boolean(_?.last_activity||_?.lastActivity),Z=hK(_),X=_?.status,G="";if(_?.type==="plan")G=Z?`Planning: ${Z}`:"Planning...";else if(_?.type==="tool_call")G=Z?`Running: ${Z}`:"Running tool...";else if(_?.type==="tool_status")G=Z&&vK(X)?Z:Z?`${Z}: ${X||"Working..."}`:X||"Working...";else if(_?.type==="error")G=Z||"Agent error";else G=Z||X||"Working...";if(!j)return G;if(G&&G!=="Working...")return`Recent activity: ${G}`;return"Last activity"}function nM(_){let $=_?.tool_name||_?.toolName||"";return typeof $==="string"?$.trim().toLowerCase():""}function dM(_){let $=typeof _==="string"?_.replace(/\s+/g," ").trim():"";if(!$)return"";let j=120;return $.length>j?`${$.slice(0,j)}…`:$}function lK(_){if(!_)return null;if(typeof _==="string")try{let $=JSON.parse(_);return lK($)}catch{return null}if(typeof _==="object"){let $=_,j=$.arguments||$.input||$.params||$.parameters||$.args||$.payload;return j&&typeof j==="object"?j:$}return null}function pK(_){let $=lK(_?.tool_args||_?.toolArgs);if(!$)return[];let j=[],Z=(X)=>{let G=dM(X);if(G&&!j.includes(G))j.push(G)};if(Z($.command),Array.isArray($.commands))Z($.commands.filter((X)=>typeof X==="string").join(" && "));if(Z($.path||$.filePath||$.target),Array.isArray($.paths))Z($.paths.filter((X)=>typeof X==="string").join(", "));return Z($.fileName||$.filename||$.file),Z($.url),Z($.query),j.sort((X,G)=>G.length-X.length)}function rK(_,$){let j=typeof _==="string"?_:"";if(!j)return null;let Z=pK($);for(let q of Z){let Q=j.indexOf(q);if(Q>=0)return{prefix:j.slice(0,Q),argument:q,suffix:j.slice(Q+q.length)}}let X=nM($);if(!X)return null;let G=j.match(/^([^:]+:\s*)(.+)$/is);if(!G||G[1].trim().replace(/:$/,"").toLowerCase()!==X)return null;return{prefix:G[1],argument:G[2],suffix:""}}function oM(_,$){let j=$?.status||$?.tool_status||$?.toolStatus,Z=mK($),X=Z?cK(_,j):typeof _==="string"?_:"",G=hK($),q=rK(G,$);if(!q?.argument)return Z?U`${X} ${J8(Z)}`:X;let Q=X.lastIndexOf(q.argument);if(Q<0)return Z?U`${X} ${J8(Z)}`:X;let K=Q+q.argument.length;return U`
        ${X.slice(0,Q)}<span class="agent-tool-argument">${q.argument}</span>${X.slice(K)}${Z?U` ${J8(Z)}`:""}
    `}function iM(_,$){let j=rK(_,$);if(!j?.argument)return _;let Z=$?.status||$?.tool_status||$?.toolStatus,X=mK($),G=X?cK(j.suffix||"",Z):j.suffix||"";return U`
        ${j.prefix}<span class="agent-tool-argument">${j.argument}</span>${G}${X?U` ${J8(X)}`:""}
    `}function nK(_,$=Date.now()){if(!_)return null;let j=$-new Date(_).getTime();if(!Number.isFinite(j)||j<0)return null;let Z=Math.floor(j/1000),X=Math.floor(Z/3600),G=Math.floor(Z%3600/60),q=Z%60;if(X>0)return`${X}h ${G}m`;if(G>0)return`${G}m ${q}s`;return`${q}s`}function Vj({status:_,draft:$,plan:j,thought:Z,pendingRequest:X,intent:G,extensionPanels:q=[],pendingPanelActions:Q=new Set,onExtensionPanelAction:K,turnId:V,steerQueued:Y,onPanelToggle:N,showCorePanels:F=!0,showExtensionPanels:B=!0}){let z=(v)=>{if(!v)return{text:"",totalLines:0,fullText:""};if(typeof v==="string"){let U0=v,T0=U0?U0.replace(/\r\n/g,`
`).split(`
`).length:0;return{text:U0,totalLines:T0,fullText:U0}}let n=v.text||"",s=v.fullText||v.full_text||n,Z0=Number.isFinite(v.totalLines)?v.totalLines:s?s.replace(/\r\n/g,`
`).split(`
`).length:0;return{text:n,totalLines:Z0,fullText:s}},k=160,J=(v)=>String(v||"").replace(/<\/?internal>/gi,""),L=(v)=>{if(!v)return 1;return Math.max(1,Math.ceil(v.length/160))},x=(v,n,s,Z0={})=>{let U0=(v||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`);if(!U0)return{text:"",omitted:0,totalLines:Number.isFinite(s)?s:0,visibleLines:0};let T0=U0.split(`
`),A0=Z0.direction==="tail",k0=T0.length>n?(A0?T0.slice(-n):T0.slice(0,n)).join(`
`):U0,y0=Number.isFinite(s)?s:T0.reduce((d0,_1)=>d0+L(_1),0),h0=k0?k0.split(`
`).reduce((d0,_1)=>d0+L(_1),0):0,S0=Math.max(y0-h0,0);return{text:k0,omitted:S0,totalLines:y0,visibleLines:h0}},I=z(j),E=z(Z),M=z($),O=z({text:_?.output_preview||_?.outputPreview||"",fullText:_?.output_preview||_?.outputPreview||"",totalLines:_?.output_total_lines||_?.outputTotalLines}),T=Boolean(I.text)||I.totalLines>0,y=Boolean(E.text)||E.totalLines>0,A=Boolean(M.fullText?.trim()||M.text?.trim()),P=Boolean(O.fullText?.trim()||O.text?.trim()),f=Boolean(_||A||T||y||P||X||G),u=Array.isArray(q)&&q.length>0,[c,r]=C(new Set),[e,m]=C(null),[_0,H0]=C({}),X0=g(new Map),[j0,Q0]=C(()=>Date.now()),F0=(v)=>r((n)=>{let s=new Set(n),Z0=!s.has(v);if(Z0)s.add(v);else s.delete(v);if(typeof N==="function")N(v,Z0);return s});b(()=>{r(new Set),m(null)},[V]),b(()=>{let v={},n=new Set(["thought","draft"]);for(let[s,Z0]of X0.current.entries()){if(!Z0||typeof Z0!=="object")continue;let U0=Number(Z0.scrollHeight),T0=Number(Z0.clientHeight);if(!Number.isFinite(U0)||!Number.isFinite(T0)||T0<=0)continue;if(U0>T0+1)v[s]=!0;if(n.has(s))Z0.scrollTop=Math.max(0,U0-T0)}H0((s)=>{let Z0=Object.keys(s||{}).filter((T0)=>s[T0]).sort(),U0=Object.keys(v).sort();if(Z0.length===U0.length&&Z0.every((T0,A0)=>T0===U0[A0]))return s;return v})},[M.fullText,M.text,E.fullText,E.text,O.fullText,O.text,c]),b(()=>{if(!(Array.isArray(q)&&q.some((s)=>s?.started_at||s?.last_activity_at)))return;let n=setInterval(()=>Q0(Date.now()),1000);return()=>clearInterval(n)},[q]);let h=q0(()=>gM(c),[c]);b(()=>{if(!h||typeof document>"u")return;let v=(n)=>{if(n?.defaultPrevented)return;if(n?.key!=="Escape")return;if(n?.altKey||n?.ctrlKey||n?.metaKey||n?.shiftKey)return;let s=n?.target;if(s instanceof Element){if(s.closest?.('input, textarea, select, [contenteditable="true"]'))return;if(s.isContentEditable)return}if(r((Z0)=>{if(!(Z0 instanceof Set)||!Z0.has(h))return Z0;let U0=new Set(Z0);return U0.delete(h),U0}),typeof N==="function")N(h,!1);n.preventDefault?.(),n.stopPropagation?.()};return document.addEventListener("keydown",v),()=>document.removeEventListener("keydown",v)},[h,N]);let $0=E$(_),K0=Boolean(_?.last_activity||_?.lastActivity),L0=q0(()=>gK(_),[_]),a=q0(()=>uK(_),[_]),G0=q0(()=>PK(_?.tool_name,_?.tool_args),[_?.tool_name,_?.tool_args]),[O0,P0]=C(null);b(()=>{if(!Boolean(a||_?.retry_at||_?.retryAt||L0))return;Q0(Date.now());let n=setInterval(()=>Q0(Date.now()),1000);return()=>clearInterval(n)},[L0,a,_?.retry_at,_?.retryAt,_?.last_event_at,_?.lastEventAt,_?.started_at,_?.startedAt,_?.type,_?.tool_name,_?.tool_args]),b(()=>{if(!(_?.type==="tool_call"||_?.type==="tool_status")||!G0){P0(null);return}let n=!0;return o7(G0).then((s)=>{if(!n)return;if(s?.branch)P0({branch:s.branch,repoPath:s.repo_path||null,path:G0});else P0(null)}).catch(()=>{if(n)P0(null)}),()=>{n=!1}},[_?.type,G0]);let p0=_?.turn_id||V,g0=xK(p0),X1=(v)=>v,l0=EV(_,{isLastActivity:K0}),a0=x6(_,{isLastActivity:K0}),f0=B8({steerQueued:Y,pulsing:l0&&a0==="dot"&&!K0}),i0=x6(null,{pendingRequest:!0}),m0=(v)=>v==="warning"?"#f59e0b":v==="error"?"var(--danger-color)":v==="success"?"var(--success-color)":g0,e0=G?.kind||"info",s0=m0(e0),D1=m0(_?.kind||($0?"warning":"info")),G1=rM(_,{isLastActivity:K0}),c0=cM(_,j0),J0=O0?.repoPath||"",V1=O0?.branch||"",o0=O0?vM(J0,V1):"",H1=bM(_?.status_hints||_?.statusHints),z0=q0(()=>uM(H1),[H1]),b0=q0(()=>z0.filter((v)=>v?.key==="ssh"),[z0]),x0=q0(()=>z0.filter((v)=>v?.key!=="ssh"),[z0]);if((!F||!f)&&(!B||!u))return null;let n0=({panelTitle:v,text:n,fullText:s,totalLines:Z0,maxLines:U0,titleClass:T0,panelKey:A0})=>{let k0=c.has(A0),y0=s||n||"",h0=A0==="thought"||A0==="draft"?J(y0):y0,S0=typeof U0==="number",d0=A0==="tool-output",_1=S0?x(h0,U0,Z0,{direction:d0?"tail":"head"}):{text:h0||"",omitted:0,totalLines:Number.isFinite(Z0)?Z0:0},I0=d0&&!k0?SM(_1.text):h0;if(!h0&&!(Number.isFinite(_1.totalLines)&&_1.totalLines>0))return null;let w0=`agent-thinking-body${S0?" agent-thinking-body-collapsible":""}`,W1=S0?`--agent-thinking-collapsed-lines: ${U0};`:"",$1=S0&&_1.omitted>0,d=Boolean(A0&&_0[A0]),B0=$1||d,Z1=(!k0&&B0||k0&&B0)&&U`
            <button
                class="agent-thinking-truncation"
                onClick=${()=>F0(A0)}
                title=${k0?`Show fewer ${v} lines`:`Show more ${v}`}
            >
                <span class="agent-thinking-truncation-arrow" aria-hidden="true">${t_(k0?"up":"down")}</span>
                <span>${k0?"less":"more…"}</span>
            </button>
        `;return U`
            <div
                class="agent-thinking"
                data-expanded=${k0?"true":"false"}
                data-collapsible=${S0?"true":"false"}
                data-panel-key=${A0||""}
                style=${g0?`--turn-color: ${g0};`:""}
            >
                <div class="agent-thinking-title ${T0||""}">
                    ${g0&&U`<span class=${f0} aria-hidden="true"></span>`}
                    ${v}
                    ${Z1}
                </div>
                <div
                    class=${w0}
                    style=${W1}
                    ref=${(S1)=>{if(!A0)return;if(S1)X0.current.set(A0,S1);else X0.current.delete(A0)}}
                    dangerouslySetInnerHTML=${{__html:q6(I0)}}
                />
            </div>
        `},E1=X?.tool_call?.title,Y1=E1?`Awaiting approval: ${E1}`:"Awaiting approval",z1=hM(_,j0),U1=(v,n,s=null)=>{let Z0=p2(v),U0=iq(v,j0),T0=[s,U0].filter(Boolean).join(" · "),A0=B8({steerQueued:Y,pulsing:E$(v)||Boolean(U0)}),k0=x6(v);return U`
            <div
                class="agent-thinking agent-thinking-intent"
                aria-live="polite"
                style=${n?`--turn-color: ${n};`:""}
                title=${v?.detail||""}
            >
                <div class="agent-thinking-title intent">
                    ${n&&k0==="dot"&&U`<span class=${A0} aria-hidden="true"></span>`}
                    ${k0==="spinner"&&U`<div class="agent-status-spinner" aria-hidden="true"></div>`}
                    <span class="agent-thinking-title-text">${iM(Z0,v)}</span>
                    ${T0&&U`<span class="agent-status-elapsed">${T0}</span>`}
                </div>
                ${v.detail&&U`<div class="agent-thinking-body">${v.detail}</div>`}
            </div>
        `},A1=(v,n,s,Z0,U0,T0,A0,k0=8,y0=8)=>{let h0=Math.max(U0-Z0,0.000000001),S0=Math.max(n-k0*2,1),d0=Math.max(s-y0*2,1),_1=Math.max(A0-T0,1),I0=A0===T0?n/2:k0+(v.run-T0)/_1*S0,w0=y0+(d0-(v.value-Z0)/h0*d0);return{x:I0,y:w0}},x1=(v,n,s,Z0,U0,T0,A0,k0=8,y0=8)=>{if(!Array.isArray(v)||v.length===0)return"";return v.map((h0,S0)=>{let{x:d0,y:_1}=A1(h0,n,s,Z0,U0,T0,A0,k0,y0);return`${S0===0?"M":"L"} ${d0.toFixed(2)} ${_1.toFixed(2)}`}).join(" ")},f1=(v,n="")=>{if(!Number.isFinite(v))return"—";return`${Math.abs(v)>=100?v.toFixed(0):v.toFixed(2).replace(/\.0+$/,"").replace(/(\.\d*[1-9])0+$/,"$1")}${n}`},O1=["var(--accent-color)","var(--success-color)","var(--warning-color, #f59e0b)","var(--danger-color)"],s1=(v,n)=>{let s=O1;if(!Array.isArray(s)||s.length===0)return"var(--accent-color)";if(s.length===1||!Number.isFinite(n)||n<=1)return s[0];let U0=Math.max(0,Math.min(Number.isFinite(v)?v:0,n-1))/Math.max(1,n-1)*(s.length-1),T0=Math.floor(U0),A0=Math.min(s.length-1,T0+1),k0=U0-T0,y0=s[T0],h0=s[A0];if(!h0||T0===A0||k0<=0.001)return y0;if(k0>=0.999)return h0;let S0=Math.round((1-k0)*1000)/10,d0=Math.round(k0*1000)/10;return`color-mix(in oklab, ${y0} ${S0}%, ${h0} ${d0}%)`},R1=(v,n="autoresearch")=>{let s=Array.isArray(v)?v.map((I0)=>({...I0,points:Array.isArray(I0?.points)?I0.points.filter((w0)=>Number.isFinite(w0?.value)&&Number.isFinite(w0?.run)):[]})).filter((I0)=>I0.points.length>0):[],Z0=s.map((I0,w0)=>({...I0,color:s1(w0,s.length)}));if(Z0.length===0)return null;let U0=320,T0=120,A0=Z0.flatMap((I0)=>I0.points),k0=A0.map((I0)=>I0.value),y0=A0.map((I0)=>I0.run),h0=Math.min(...k0),S0=Math.max(...k0),d0=Math.min(...y0),_1=Math.max(...y0);return U`
            <div class="agent-series-chart agent-series-chart-combined">
                <div class="agent-series-chart-header">
                    <span class="agent-series-chart-title">Tracked variables</span>
                    <span class="agent-series-chart-value">${Z0.length} series</span>
                </div>
                <div class="agent-series-chart-plot">
                    <svg class="agent-series-chart-svg" viewBox=${`0 0 ${U0} ${T0}`} preserveAspectRatio="none" aria-hidden="true">
                        ${Z0.map((I0)=>{let w0=I0?.key||I0?.label||"series",W1=e?.panelKey===n&&e?.seriesKey===w0;return U`
                                <g key=${w0}>
                                    <path
                                        class=${`agent-series-chart-line${W1?" is-hovered":""}`}
                                        d=${x1(I0.points,U0,T0,h0,S0,d0,_1)}
                                        style=${`--agent-series-color: ${I0.color};`}
                                        onMouseEnter=${()=>m({panelKey:n,seriesKey:w0})}
                                        onMouseLeave=${()=>m(($1)=>$1?.panelKey===n&&$1?.seriesKey===w0?null:$1)}
                                    ></path>
                                </g>
                            `})}
                    </svg>
                    <div class="agent-series-chart-points-layer">
                        ${Z0.flatMap((I0)=>{let w0=typeof I0?.unit==="string"?I0.unit:"",W1=I0?.key||I0?.label||"series";return I0.points.map(($1,d)=>{let B0=A1($1,U0,T0,h0,S0,d0,_1);return U`
                                    <button
                                        key=${`${W1}-point-${d}`}
                                        type="button"
                                        class="agent-series-chart-point-hit"
                                        style=${`--agent-series-color: ${I0.color}; left:${B0.x/U0*100}%; top:${B0.y/T0*100}%;`}
                                        onMouseEnter=${()=>m({panelKey:n,seriesKey:W1,run:$1.run,value:$1.value,unit:w0})}
                                        onMouseLeave=${()=>m((r0)=>r0?.panelKey===n?null:r0)}
                                        onFocus=${()=>m({panelKey:n,seriesKey:W1,run:$1.run,value:$1.value,unit:w0})}
                                        onBlur=${()=>m((r0)=>r0?.panelKey===n?null:r0)}
                                        aria-label=${`${I0?.label||"Series"} ${f1($1.value,w0)} at run ${$1.run}`}
                                    >
                                        <span class="agent-series-chart-point"></span>
                                    </button>
                                `})})}
                    </div>
                </div>
                <div class="agent-series-legend">
                    ${Z0.map((I0)=>{let w0=I0.points[I0.points.length-1]?.value,W1=typeof I0?.unit==="string"?I0.unit:"",$1=I0?.key||I0?.label||"series",d=e?.panelKey===n&&e?.seriesKey===$1?e:null,B0=d&&Number.isFinite(d.value)?d.value:w0,r0=d&&typeof d.unit==="string"?d.unit:W1,Z1=d&&Number.isFinite(d.run)?d.run:null;return U`
                            <div key=${`${$1}-legend`} class=${`agent-series-legend-item${d?" is-hovered":""}`} style=${`--agent-series-color: ${I0.color};`}>
                                <span class="agent-series-legend-swatch" style=${`--agent-series-color: ${I0.color};`}></span>
                                <span class="agent-series-legend-label">${I0?.label||"Series"}</span>
                                ${Z1!==null&&U`<span class="agent-series-legend-run">run ${Z1}</span>`}
                                <span class="agent-series-legend-value">${f1(B0,r0)}</span>
                            </div>
                        `})}
                </div>
            </div>
        `},V0=(v)=>{if(!v)return null;let n=typeof v?.key==="string"?v.key:`panel-${Math.random()}`,s=c.has(n),Z0=v?.title||"Extension status",U0=v?.collapsed_text||"",T0=String(v?.state||"").replace(/[-_]+/g," ").replace(/^./,(B0)=>B0.toUpperCase()),A0=m0(v?.state==="completed"?"success":v?.state==="failed"?"error":v?.state==="stopped"?"warning":"info"),k0=B8({steerQueued:Y,pulsing:v?.state==="running"}),y0=typeof v?.detail_markdown==="string"?v.detail_markdown.trim():"",h0=typeof v?.last_run_text==="string"?v.last_run_text.trim():"",S0=typeof v?.tmux_command==="string"?v.tmux_command.trim():"",d0=Array.isArray(v?.series)?v.series:[],_1=Array.isArray(v?.actions)?v.actions:[],I0=v?.started_at?A6(v,j0):null,w0=U0,W1=Boolean(y0||S0||I0),$1=Boolean(y0||d0.length>0||S0),d=[Z0,w0].filter(Boolean).join(" — ");return U`
            <div
                class="agent-thinking agent-thinking-intent agent-thinking-autoresearch"
                aria-live="polite"
                data-expanded=${s?"true":"false"}
                style=${A0?`--turn-color: ${A0};`:""}
                title=${!s?d||Z0:""}
            >
                <div class="agent-thinking-header agent-thinking-header-inline">
                    <button
                        class="agent-thinking-title intent agent-thinking-title-clickable"
                        type="button"
                        onClick=${()=>$1?F0(n):null}
                    >
                        ${A0&&U`<span class=${k0} aria-hidden="true"></span>`}
                        <span class="agent-thinking-title-text">${Z0}</span>
                        ${w0&&U`<span class="agent-thinking-title-meta">${w0}</span>`}
                        ${I0&&U`<span class="agent-status-elapsed">${I0}</span>`}
                    </button>
                    ${(_1.length>0||$1)&&U`
                        <div class="agent-thinking-tools-inline">
                            ${_1.length>0&&U`
                                <div class="agent-thinking-actions agent-thinking-actions-inline">
                                    ${_1.map((B0)=>{let r0=`${n}:${B0?.key||""}`,Z1=Q?.has?.(r0);return U`
                                            <button
                                                key=${r0}
                                                class=${`agent-thinking-action-btn${B0?.tone==="danger"?" danger":""}`}
                                                onClick=${()=>K?.(v,B0)}
                                                disabled=${Boolean(Z1)}
                                            >
                                                ${Z1?"Working…":B0?.label||"Run"}
                                            </button>
                                        `})}
                                </div>
                            `}
                            ${$1&&U`
                                <button
                                    class="agent-thinking-corner-toggle agent-thinking-corner-toggle-inline"
                                    type="button"
                                    aria-label=${`${s?"Collapse":"Expand"} ${Z0}`}
                                    title=${s?"Collapse details":"Expand details"}
                                    onClick=${()=>F0(n)}
                                >
                                    ${t_(s?"down":"up")}
                                </button>
                            `}
                        </div>
                    `}
                </div>
                ${s&&U`
                    <div class=${`agent-thinking-autoresearch-layout${W1?"":" chart-only"}`}>
                        ${W1&&U`
                            <div class="agent-thinking-autoresearch-meta-stack">
                                ${I0&&U`
                                    <div class="agent-thinking-autoresearch-elapsed">
                                        <span title="Experiment duration">⏱ ${I0}</span>
                                        ${v?.last_activity_at&&v?.state==="running"&&U`<span title="Since last activity">⟳ ${nK(v.last_activity_at)} ago</span>`}
                                    </div>
                                `}
                                ${y0&&U`
                                    <div
                                        class="agent-thinking-body agent-thinking-autoresearch-detail"
                                        dangerouslySetInnerHTML=${{__html:q6(y0)}}
                                    />
                                `}
                                ${S0&&U`
                                    <div class="agent-series-chart-command">
                                        <div class="agent-series-chart-command-header">
                                            <span>Attach to session</span>
                                        </div>
                                        <div class="agent-series-chart-command-shell">
                                            <pre class="agent-series-chart-command-code">${S0}</pre>
                                            <button
                                                type="button"
                                                class="agent-series-chart-command-copy"
                                                aria-label="Copy tmux command"
                                                title="Copy tmux command"
                                                onClick=${()=>K?.(v,{key:"copy_tmux",action_type:"autoresearch.copy_tmux",label:"Copy tmux"})}
                                            >
                                                ${CM}
                                            </button>
                                        </div>
                                    </div>
                                `}
                            </div>
                        `}
                        ${d0.length>0?U`
                                <div class="agent-series-chart-stack">
                                    ${R1(d0,n)}
                                    ${h0&&U`<div class="agent-series-chart-note">${h0}</div>`}
                                </div>
                            `:U`<div class="agent-thinking-body agent-thinking-autoresearch-summary">Variable history will appear after the first completed run.</div>`}
                    </div>
                `}
            </div>
        `};return U`
        <div class="agent-status-panel">
            ${F&&G&&U1(G,s0)}
            ${B&&Array.isArray(q)&&q.map((v)=>V0(v))}
            ${F&&_?.type==="intent"&&U1(_,D1,z1)}
            ${F&&X&&U`
                <div class="agent-status agent-status-request" aria-live="polite" style=${g0?`--turn-color: ${g0};`:""}>
                    ${i0==="dot"&&U`<span class=${f0} aria-hidden="true"></span>`}
                    ${i0==="spinner"&&U`<div class="agent-status-spinner"></div>`}
                    <span class="agent-status-text">${Y1}</span>
                </div>
            `}
            ${F&&T&&n0({panelTitle:X1("Planning"),text:I.text,fullText:I.fullText,totalLines:I.totalLines,panelKey:"plan"})}
            ${F&&A&&n0({panelTitle:X1("Draft"),text:M.text,fullText:M.fullText,totalLines:M.totalLines,maxLines:9,titleClass:"thought",panelKey:"draft"})}
            ${F&&y&&n0({panelTitle:X1("Thoughts"),text:E.text,fullText:E.fullText,totalLines:E.totalLines,maxLines:9,titleClass:"thought",panelKey:"thought"})}
            ${F&&P&&n0({panelTitle:X1("Output"),text:O.text,fullText:O.fullText,totalLines:O.totalLines,maxLines:6,titleClass:"tool-output",panelKey:"tool-output"})}
            ${F&&_&&_?.type!=="intent"&&U`
                <div class=${`agent-status${K0?" agent-status-last-activity":""}${_?.type==="error"?" agent-status-error":""}${o0||H1.length>0||c0?" agent-status-multiline":""}`} aria-live="polite" style=${g0?`--turn-color: ${g0};`:""}>
                    ${g0&&l0&&U`<span class=${f0} aria-hidden="true"></span>`}
                    ${_?.type==="error"?U`<span class="agent-status-error-icon" aria-hidden="true">⚠</span>`:a0==="spinner"&&U`<div class="agent-status-spinner"></div>`}
                    <div class="agent-status-copy">
                        <span class="agent-status-text">${oM(G1,_)}</span>
                        ${(o0||z0.length>0||c0)&&U`
                            <span class="agent-status-meta-row">
                                ${b0.map((v)=>U`
                                    <span key=${v.key} class="agent-status-hint-row" title=${v.title||v.label}>
                                        <span class="agent-status-hint-icon" dangerouslySetInnerHTML=${{__html:v.iconSvg}}></span>
                                        <span class="agent-status-hint-label">${v.label}</span>
                                    </span>
                                `)}
                                ${o0&&U`
                                    <span class="agent-status-git-row" title=${G0||o0}>
                                        <span class="agent-status-git-icon">${PM}</span>
                                        <span class="agent-status-git-label">
                                            ${J0&&U`<span class="agent-status-git-part">${J0}</span>`}
                                            ${J0&&V1&&U`<span class="agent-status-git-separator" aria-hidden="true">•</span>`}
                                            ${V1&&U`<span class="agent-status-git-part">${V1}</span>`}
                                        </span>
                                    </span>
                                `}
                                ${x0.map((v)=>U`
                                    <span key=${v.key} class="agent-status-hint-row" title=${v.title||v.label}>
                                        <span class="agent-status-hint-icon" dangerouslySetInnerHTML=${{__html:v.iconSvg}}></span>
                                        <span class="agent-status-hint-label">${v.label}</span>
                                    </span>
                                `)}
                                ${c0&&U`
                                    <span class="agent-status-hint-row agent-status-activity-row" title=${`${K0?"Recent activity":"Last event"} ${c0}`}>
                                        <span class="agent-status-hint-icon">${fM}</span>
                                        <span class="agent-status-hint-label">${c0}</span>
                                    </span>
                                `}
                            </span>
                        `}
                    </div>
                </div>
            `}
        </div>
    `}function dK({request:_,onRespond:$}){if(!_)return null;let{request_id:j,tool_call:Z,options:X,chat_jid:G}=_,q=Z?.title||"Agent Request",Q=Z?.kind||"other",K=Z?.rawInput||{},V=K.command||K.commands&&K.commands[0]||null,Y=K.diff||null,N=K.fileName||K.path||null,F=Z?.description||K.description||K.explanation||null,D=(Array.isArray(Z?.locations)?Z.locations:[]).map((J)=>J?.path).filter((J)=>Boolean(J)),W=Array.from(new Set([N,...D].filter(Boolean)));console.log("AgentRequestModal:",{request_id:j,tool_call:Z,options:X});let H=async(J)=>{try{await O5(j,J,G||null),$()}catch(L){console.error("Failed to respond to agent request:",L)}},z=async()=>{try{await r7(q,`Auto-approved: ${q}`),await O5(j,"approved",G||null),$()}catch(J){console.error("Failed to add to whitelist:",J)}},k=X&&X.length>0;return U`
        <div class="agent-request-modal">
            <div class="agent-request-content">
                <div class="agent-request-header">
                    <div class="agent-request-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <div class="agent-request-title">${q}</div>
                </div>
                ${(F||V||Y||W.length>0)&&U`
                    <div class="agent-request-body">
                        ${F&&U`
                            <div class="agent-request-description">${F}</div>
                        `}
                        ${W.length>0&&U`
                            <div class="agent-request-files">
                                <div class="agent-request-subtitle">Files</div>
                                <ul>
                                    ${W.map((J,L)=>U`<li key=${L}>${J}</li>`)}
                                </ul>
                            </div>
                        `}
                        ${V&&U`
                            <pre class="agent-request-command">${V}</pre>
                        `}
                        ${Y&&U`
                            <details class="agent-request-diff">
                                <summary>Proposed diff</summary>
                                <pre>${Y}</pre>
                            </details>
                        `}
                    </div>
                `}
                <div class="agent-request-actions">
                    ${k?X.map((J)=>U`
                            <button 
                                key=${J.optionId||J.id||String(J)}
                                class="agent-request-btn ${J.kind==="allow_once"||J.kind==="allow_always"?"primary":""}"
                                onClick=${()=>H(J.optionId||J.id||J)}
                            >
                                ${J.name||J.label||J.optionId||J.id||String(J)}
                            </button>
                        `):U`
                        <button class="agent-request-btn primary" onClick=${()=>H("approved")}>
                            Allow
                        </button>
                        <button class="agent-request-btn" onClick=${()=>H("denied")}>
                            Deny
                        </button>
                        <button class="agent-request-btn always-allow" onClick=${z}>
                            Always Allow This
                        </button>
                    `}
                </div>
            </div>
        </div>
    `}M0();M0();T1();function f6(_){if(_==null)return"";if(typeof _==="string")return _.trim();if(typeof _==="number")return String(_);if(typeof _==="boolean")return _?"yes":"no";if(Array.isArray(_))return _.map(($)=>f6($)).filter(Boolean).join(", ");if(typeof _==="object")return Object.entries(_).filter(([$])=>!$.startsWith("__")).map(([$,j])=>`${$}: ${f6(j)}`).filter(($)=>!$.endsWith(": ")).join(", ");return String(_).trim()}function oK(_){if(typeof _!=="object"||_==null||Array.isArray(_))return[];return Object.entries(_).filter(([$])=>!$.startsWith("__")).map(([$,j])=>({key:$,value:f6(j)})).filter(($)=>$.value)}function sM(_){if(!_||typeof _!=="object")return!1;let $=_;return $.type==="adaptive_card_submission"&&typeof $.card_id==="string"&&typeof $.source_post_id==="number"&&typeof $.submitted_at==="string"}function Kj(_){if(!Array.isArray(_))return[];return _.filter(sM)}function E8(_){let $=String(_.title||_.card_id||"card").trim()||"card",j=_.data;if(j==null)return`Card submission: ${$}`;if(typeof j==="string"||typeof j==="number"||typeof j==="boolean"){let Z=f6(j);return Z?`Card submission: ${$} — ${Z}`:`Card submission: ${$}`}if(typeof j==="object"){let X=oK(j).map(({key:G,value:q})=>`${G}: ${q}`);return X.length>0?`Card submission: ${$} — ${X.join(", ")}`:`Card submission: ${$}`}return`Card submission: ${$}`}function iK(_){let $=String(_.title||_.card_id||"Card submission").trim()||"Card submission",j=oK(_.data),Z=j.length>0?j.slice(0,2).map(({key:G,value:q})=>`${G}: ${q}`).join(", "):f6(_.data)||null,X=j.length;return{title:$,summary:Z,fields:j,fieldCount:X,submittedAt:_.submitted_at}}function P1(_){return typeof _==="string"?_.trim():""}function sK(_){return _.map(($)=>String($||"").trim()).filter(Boolean).join(`

`).replace(/\n{3,}/g,`

`).trim()}function aM(_,$){let j=[],Z=[],X=[];if(_.forEach((G,q)=>{if(!G||typeof G!=="object")return;let Q=P1(G.type);if(Q==="text"){let K=P1(G.text)||P1(G.content);if(K)j.push(K);return}if(Q==="resource_link"){let K=P1(G.uri),V=P1(G.title)||P1(G.name)||K;if(K&&V)j.push(V===K?K:`[${V}](${K})`);return}if(Q==="resource"){let K=P1(G.title)||P1(G.name)||P1(G.uri)||"Embedded resource",V=P1(G.text);if(V)j.push(`### ${K}

\`\`\`
${V}
\`\`\``);else j.push(`### ${K}`);return}if(Q==="generated_widget"){let K=P1(G.title)||P1(G.name)||"Generated widget",V=P1(G.description)||P1(G.subtitle);j.push(sK([`### ${K}`,V]));return}if(Q==="adaptive_card"&&P1(G.fallback_text)){j.push(P1(G.fallback_text));return}if(Q==="adaptive_card_submission"){let K=E8(G);if(P1(K))j.push(P1(K));return}if(Q==="file"){let K=P1(G.name)||P1(G.filename)||P1(G.title)||`attachment:${$[q]??q+1}`;Z.push(`- ${K}`);return}if(Q==="image"||!Q){let K=P1(G.name)||P1(G.filename)||P1(G.title)||`attachment:${$[q]??q+1}`;X.push(`- ${K}`)}}),X.length>0)j.push(`Images:
${X.join(`
`)}`);if(Z.length>0)j.push(`Attachments:
${Z.join(`
`)}`);return sK(j)}function A8(_){let $=_?.data||{},j=typeof $.content==="string"?$.content.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trimEnd():"";if(j.trim())return j;let Z=Array.isArray($.content_blocks)?$.content_blocks:[],X=Array.isArray($.media_ids)?$.media_ids:[];return aM(Z,X)}function aK(_,$,j){try{return _.setAttribute($,j),!0}catch(Z){return!1}}function tK(_,$){try{return _[$]=!0,!0}catch(j){return!1}}function eK(_){_.classList.add("adaptive-card-readonly");for(let $ of Array.from(_.querySelectorAll("input, textarea, select, button"))){let j=$;if(aK(j,"aria-disabled","true"),aK(j,"tabindex","-1"),"disabled"in j)tK(j,"disabled");if("readOnly"in j)tK(j,"readOnly")}}function tM(_){let j=String(_||"").trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(!j)return null;let Z=j[1].length===3?j[1].split("").map((X)=>`${X}${X}`).join(""):j[1];return{r:parseInt(Z.slice(0,2),16),g:parseInt(Z.slice(2,4),16),b:parseInt(Z.slice(4,6),16)}}function eM(_){let j=String(_||"").trim().match(/^rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);if(!j)return null;let Z=Number(j[1]),X=Number(j[2]),G=Number(j[3]);if(![Z,X,G].every((q)=>Number.isFinite(q)))return null;return{r:Z,g:X,b:G}}function _Y(_){return tM(_)||eM(_)}function M8(_){let $=(G)=>{let q=G/255;return q<=0.03928?q/12.92:((q+0.055)/1.055)**2.4},j=$(_.r),Z=$(_.g),X=$(_.b);return 0.2126*j+0.7152*Z+0.0722*X}function _k(_,$){let j=Math.max(M8(_),M8($)),Z=Math.min(M8(_),M8($));return(j+0.05)/(Z+0.05)}function $k(_,$,j="#ffffff"){let Z=_Y(_);if(!Z)return j;let X=j,G=-1;for(let q of $){let Q=_Y(q);if(!Q)continue;let K=_k(Z,Q);if(K>G)X=q,G=K}return X}function Yj(){let _=getComputedStyle(document.documentElement),$=(D,W)=>{for(let H of D){let z=_.getPropertyValue(H).trim();if(z)return z}return W},j=$(["--text-primary","--color-text"],"#0f1419"),Z=$(["--text-secondary","--color-text-muted"],"#536471"),X=$(["--bg-primary","--color-bg-primary"],"#ffffff"),G=$(["--bg-secondary","--color-bg-secondary"],"#f7f9fa"),q=$(["--bg-hover","--bg-tertiary","--color-bg-tertiary"],"#e8ebed"),Q=$(["--accent-color","--color-accent"],"#1d9bf0"),K=$(["--success-color","--color-success"],"#00ba7c"),V=$(["--warning-color","--color-warning","--accent-color"],"#f0b429"),Y=$(["--danger-color","--color-error"],"#f4212e"),N=$(["--border-color","--color-border"],"#eff3f4"),F=$(["--font-family"],"system-ui, sans-serif"),B=$k(Q,[j,X],j);return{fg:j,fgMuted:Z,bgPrimary:X,bg:G,bgEmphasis:q,accent:Q,good:K,warning:V,attention:Y,border:N,fontFamily:F,buttonTextColor:B}}function $Y(){let{fg:_,fgMuted:$,bg:j,bgEmphasis:Z,accent:X,good:G,warning:q,attention:Q,border:K,fontFamily:V}=Yj();return{fontFamily:V,containerStyles:{default:{backgroundColor:j,foregroundColors:{default:{default:_,subtle:$},accent:{default:X,subtle:X},good:{default:G,subtle:G},warning:{default:q,subtle:q},attention:{default:Q,subtle:Q}}},emphasis:{backgroundColor:Z,foregroundColors:{default:{default:_,subtle:$},accent:{default:X,subtle:X},good:{default:G,subtle:G},warning:{default:q,subtle:q},attention:{default:Q,subtle:Q}}}},actions:{actionsOrientation:"horizontal",actionAlignment:"left",buttonSpacing:8,maxActions:5,showCard:{actionMode:"inline"},spacing:"default"},adaptiveCard:{allowCustomStyle:!1},spacing:{small:4,default:8,medium:12,large:16,extraLarge:24,padding:12},separator:{lineThickness:1,lineColor:K},fontSizes:{small:12,default:14,medium:16,large:18,extraLarge:22},fontWeights:{lighter:300,default:400,bolder:600},imageSizes:{small:40,medium:80,large:120},textBlock:{headingLevel:2}}}var jk=new Set(["1.0","1.1","1.2","1.3","1.4","1.5","1.6"]),jY=!1,k8=null,ZY=!1;function Nj(_){_.querySelector(".adaptive-card-notice")?.remove()}function Zk(_,$,j="error"){Nj(_);let Z=document.createElement("div");Z.className=`adaptive-card-notice adaptive-card-notice-${j}`,Z.textContent=$,_.appendChild(Z)}function Xk(_,$=(j)=>q_(j,null)){let j=typeof _==="string"?_:String(_??"");if(!j.trim())return{outputHtml:"",didProcess:!1};return{outputHtml:$(j),didProcess:!0}}function Gk(_=($)=>q_($,null)){return($,j)=>{try{let Z=Xk($,_);j.outputHtml=Z.outputHtml,j.didProcess=Z.didProcess}catch(Z){console.error("[adaptive-card] Failed to process markdown:",Z),j.outputHtml=String($??""),j.didProcess=!1}}}function qk(_){if(ZY||!_?.AdaptiveCard)return;_.AdaptiveCard.onProcessMarkdown=Gk(),ZY=!0}async function Qk(){if(jY)return;if(k8)return k8;return k8=new Promise((_,$)=>{let j=document.createElement("script");j.src="/static/js/vendor/adaptivecards.min.js",j.onload=()=>{jY=!0,_()},j.onerror=()=>$(Error("Failed to load adaptivecards SDK")),document.head.appendChild(j)}),k8}function Vk(){return globalThis.AdaptiveCards}function Kk(_){if(!_||typeof _!=="object")return!1;let $=_;return $.type==="adaptive_card"&&typeof $.card_id==="string"&&typeof $.schema_version==="string"&&typeof $.payload==="object"&&$.payload!==null}function Yk(_){return jk.has(_)}function Fj(_){if(!Array.isArray(_))return[];return _.filter(Kk)}function Nk(_){let $=(typeof _?.getJsonTypeName==="function"?_.getJsonTypeName():"")||_?.constructor?.name||"Unknown",j=(typeof _?.title==="string"?_.title:"")||"",Z=(typeof _?.url==="string"?_.url:"")||void 0,X=_?.data??void 0;return{type:$,title:j,data:X,url:Z,raw:_}}function Bj(_){if(_==null)return"";if(typeof _==="string")return _.trim();if(typeof _==="number")return String(_);if(typeof _==="boolean")return _?"yes":"no";if(Array.isArray(_))return _.map(($)=>Bj($)).filter(Boolean).join(", ");if(typeof _==="object")return Object.entries(_).map(([j,Z])=>`${j}: ${Bj(Z)}`).filter((j)=>!j.endsWith(": ")).join(", ");return String(_).trim()}function Bk(_,$,j){if($==null)return $;if(_==="Input.Toggle"){if(typeof $==="boolean"){if($)return j?.valueOn??"true";return j?.valueOff??"false"}return typeof $==="string"?$:String($)}if(_==="Input.ChoiceSet"){if(Array.isArray($))return $.join(",");return typeof $==="string"?$:String($)}if(Array.isArray($))return $.join(", ");if(typeof $==="object")return Bj($);return typeof $==="string"?$:String($)}function Fk(_,$){if(!_||typeof _!=="object")return _;if(!$||typeof $!=="object"||Array.isArray($))return _;let j=$,Z=(X)=>{if(Array.isArray(X))return X.map((Q)=>Z(Q));if(!X||typeof X!=="object")return X;let q={...X};if(typeof q.id==="string"&&q.id in j&&String(q.type||"").startsWith("Input."))q.value=Bk(q.type,j[q.id],q);for(let[Q,K]of Object.entries(q))if(Array.isArray(K)||K&&typeof K==="object")q[Q]=Z(K);return q};return Z(_)}function Uk(_){if(typeof _!=="string"||!_.trim())return"";let $=new Date(_);if(Number.isNaN($.getTime()))return"";return new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format($)}function Dk(_){if(_.state==="active")return null;let $=_.state==="completed"?"Submitted":_.state==="cancelled"?"Cancelled":"Failed",j=_.last_submission&&typeof _.last_submission==="object"?_.last_submission:null,Z=j&&typeof j.title==="string"?j.title.trim():"",X=Uk(_.completed_at||j?.submitted_at),G=[Z||null,X||null].filter(Boolean).join(" · ")||null;return{label:$,detail:G}}async function XY(_,$,j){if(!Yk($.schema_version))return console.warn(`[adaptive-card] Unsupported schema version ${$.schema_version} for card ${$.card_id}`),!1;try{await Qk()}catch(Z){return console.error("[adaptive-card] Failed to load SDK:",Z),!1}try{let Z=Vk();qk(Z);let X=new Z.AdaptiveCard,G=Yj();X.hostConfig=new Z.HostConfig($Y());let q=$.last_submission&&typeof $.last_submission==="object"?$.last_submission.data:void 0,Q=$.state==="active"?$.payload:Fk($.payload,q);X.parse(Q),X.onExecuteAction=(Y)=>{let N=Nk(Y);if(j?.onAction)Nj(_),_.classList.add("adaptive-card-busy"),Promise.resolve(j.onAction(N)).catch((F)=>{console.error("[adaptive-card] Action failed:",F);let B=F instanceof Error?F.message:String(F||"Action failed.");Zk(_,B||"Action failed.","error")}).finally(()=>{_.classList.remove("adaptive-card-busy")});else console.log("[adaptive-card] Action executed (not wired yet):",N)};let K=X.render();if(!K)return console.warn(`[adaptive-card] Card ${$.card_id} rendered to null`),!1;_.classList.add("adaptive-card-container"),_.style.setProperty("--adaptive-card-button-text-color",G.buttonTextColor);let V=Dk($);if(V){_.classList.add("adaptive-card-finished");let Y=document.createElement("div");Y.className=`adaptive-card-status adaptive-card-status-${$.state}`;let N=document.createElement("span");if(N.className="adaptive-card-status-label",N.textContent=V.label,Y.appendChild(N),V.detail){let F=document.createElement("span");F.className="adaptive-card-status-detail",F.textContent=V.detail,Y.appendChild(F)}_.appendChild(Y)}if(Nj(_),_.appendChild(K),V)eK(K);return!0}catch(Z){return console.error(`[adaptive-card] Failed to render card ${$.card_id}:`,Z),!1}}M0();n2();function GY({src:_,onClose:$}){return b(()=>{let j=(Z)=>{if(Z.key==="Escape")$()};return document.addEventListener("keydown",j),()=>document.removeEventListener("keydown",j)},[$]),U`
        <${i$} className="image-modal-portal-root">
            <div class="image-modal" onClick=${$}>
                <img src=${_} alt="Full size" />
            </div>
        </${i$}>
    `}var T8=0,Uj=null,R6={activePostId:null,speaking:!1},Dj=new Set;function Wj(_={}){return _.window??(typeof window<"u"?window:null)}function qY(_={}){return Wj(_)?.speechSynthesis||null}function zj(){let _={...R6};for(let $ of Dj)try{$(_)}catch(j){console.warn("[post-speech] playback listener failed:",j)}}function Hj(){return{...R6}}function QY(_){if(typeof _!=="function")return()=>{};return Dj.add(_),_(Hj()),()=>Dj.delete(_)}function VY(_={}){let $=Wj(_);return Boolean($&&$.speechSynthesis&&typeof $.SpeechSynthesisUtterance==="function")}function KY(_){let $=A8(_);if(!$)return"";return String($).replace(/```[\s\S]*?```/g," Code block omitted. ").replace(/`([^`]+)`/g,"$1").replace(/!\[([^\]]*)\]\(([^)]+)\)/g,"$1").replace(/\[([^\]]+)\]\(([^)]+)\)/g,"$1").replace(/^#{1,6}\s+/gm,"").replace(/^>\s?/gm,"").replace(/^[-*+]\s+/gm,"• ").replace(/\n{3,}/g,`

`).replace(/\n\n+/g,". ").replace(/\s+/g," ").replace(/\s+([.,;:!?])/g,"$1").trim().slice(0,1600)}function YY(_={}){let $=qY(_);if(T8+=1,Uj=null,R6={activePostId:null,speaking:!1},$)try{$.cancel()}catch(j){console.warn("[post-speech] cancel failed:",j)}zj()}function NY(_,$,j={}){let Z=Wj(j),X=qY(j);if(!Z||!X||typeof Z.SpeechSynthesisUtterance!=="function")return!1;let G=String($||"").trim();if(!G)return!1;let q=T8+1;T8=q;try{X.cancel()}catch{}let Q=new Z.SpeechSynthesisUtterance(G);Uj=Q,R6={activePostId:_,speaking:!0},zj();let K=()=>{if(q!==T8)return;Uj=null,R6={activePostId:null,speaking:!1},zj()};Q.onend=K,Q.onerror=K;try{return X.speak(Q),!0}catch(V){return console.warn("[post-speech] speak failed:",V),K(),!1}}async function FY(_,$){try{return await _?.writeText?.($),!0}catch(j){return!1}}function Oj(_,$){let j=typeof $?.text==="string"?$.text:"",Z=typeof $?.html==="string"?$.html:"";if(!_||!j||typeof _.createElement!=="function"||typeof _.execCommand!=="function")return!1;let X=null,G=!1,q=(Q)=>{let K=Q?.clipboardData;if(!K||typeof K.setData!=="function")return;if(K.setData("text/plain",j),Z)K.setData("text/html",Z);if(typeof Q.preventDefault==="function")Q.preventDefault();G=!0};try{if(X=_.createElement("textarea"),X.value=j,typeof X.setAttribute==="function")X.setAttribute("readonly","");if(X.style)X.style.position="fixed",X.style.opacity="0",X.style.pointerEvents="none";if(_.body?.appendChild?.(X),typeof X.select==="function")X.select();if(typeof X.setSelectionRange==="function")X.setSelectionRange(0,X.value.length);_.addEventListener?.("copy",q,!0);let Q=_.execCommand("copy");return Boolean(G||Q)}catch{return!1}finally{if(_.removeEventListener?.("copy",q,!0),X)_.body?.removeChild?.(X)}}function BY(_){if(!_||typeof _!=="object")return null;let $=_;if(typeof $.nodeType==="number"&&$.nodeType===3)return $.parentNode||null;return $}function UY(_,$){let j=_?.clipboardData,Z=$?.root,X=$?.selection;if(!j||typeof j.setData!=="function"||!Z||!X)return!1;if(X.isCollapsed)return!1;let G=!1;if(Number(X.rangeCount||0)>0&&typeof X.getRangeAt==="function")try{let K=X.getRangeAt(0);if(K&&typeof K.intersectsNode==="function")G=Boolean(K.intersectsNode(Z))}catch{G=!1}if(!G&&typeof Z.contains==="function"){let K=BY(X.anchorNode),V=BY(X.focusNode);G=Boolean(K&&Z.contains(K)||V&&Z.contains(V))}if(!G)return!1;let Q=typeof X.toString==="function"?String(X.toString()||"").replace(/\u00a0/g," "):"";if(!Q)return!1;return j.setData("text/plain",Q),_?.preventDefault?.(),!0}function DY(_,$){try{return Boolean(_?.getItem?.($))}catch(j){return!1}}function zY(_,$,j){try{return _?.setItem?.($,j),!0}catch(Z){return!1}}function WY(_,$){let j=typeof _==="string"&&_.trim()?_.trim():null;if(j)return j;if(!$)return null;try{return new URL($).hostname}catch(Z){return $}}function zk({mediaId:_,onPreview:$}){let[j,Z]=C(null);if(b(()=>{b2(_).then(Z).catch((V)=>{console.warn("[post] Failed to load attachment metadata for file card:",_,V)})},[_]),!j)return null;let X=j.filename||"file",G=j.metadata?.size,q=G?t1(G):"",K=P6(j.content_type,j.filename)!=="unsupported";return U`
        <div class="file-attachment" onClick=${(V)=>V.stopPropagation()}>
            <a href=${v_(_)} download=${X} class="file-attachment-main">
                <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                </svg>
                <div class="file-info">
                    <span class="file-name">${X}</span>
                    <span class="file-meta-row">
                        ${q&&U`<span class="file-size">${q}</span>`}
                        ${j.content_type&&U`<span class="file-size">${j.content_type}</span>`}
                    </span>
                </div>
                <svg class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
            </a>
            ${K&&U`
                <button
                    class="file-attachment-preview"
                    type="button"
                    onClick=${(V)=>{V.preventDefault(),V.stopPropagation(),$?.({mediaId:_,info:j})}}
                >
                    Preview
                </button>
            `}
        </div>
    `}function Wk(_){if(!Array.isArray(_))return[];return _.filter(($)=>$&&typeof $==="object"&&$.type==="recovery_marker"&&$.recovered)}function Hk(_){if(!Array.isArray(_))return[];return _.filter(($)=>$&&typeof $==="object"&&$.type==="timeout_marker"&&($.timed_out??!0))}function Ok(_){if(!Array.isArray(_))return[];return _.filter(($)=>$&&typeof $==="object"&&$.type==="turn_outcome_marker")}function Lk(_){if(!Array.isArray(_))return[];return _.filter(($)=>$&&typeof $==="object"&&$.type==="peer_message")}function Jk(_){return String(_||"").split(/[:/]/).filter(Boolean).pop()||"agent"}function HY(_){let $=Lk(_)[0]||null;if(!$)return null;let j=typeof $.source_chat_jid==="string"?$.source_chat_jid.trim():"",Z=typeof $.source_agent_name==="string"&&$.source_agent_name.trim()?$.source_agent_name.trim():Jk(j),X=typeof $.target_chat_jid==="string"?$.target_chat_jid.trim():"",G=typeof $.target_agent_name==="string"?$.target_agent_name.trim():"",q=typeof $.body==="string"?$.body:"";return{block:$,sourceChatJid:j,sourceAgentName:Z,targetChatJid:X,targetAgentName:G,body:q}}function Ek(_,$){let j=HY($),Z=typeof _==="string"?_:"";if(!j)return Z;if(j.body&&j.body.trim())return j.body;let X=j.sourceAgentName?j.sourceAgentName.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"):"[^\\s>]+",G=j.sourceChatJid?j.sourceChatJid.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"):"[^>\\n]+";return Z.replace(new RegExp(`^from:\\s+@${X}\\s+<jid:${G}>\\s*\\n\\n`,"i"),"")||Z}var Ak={context_recover:"context limit exceeded",rate_limit:"rate limit hit",api_error:"API error",timeout:"request timeout",overloaded:"service overloaded",connection:"connection error"};function Mk(_){let $=Number(_?.attempts_used||0),j=String(_?.classifier||"").trim(),Z=Ak[j]||(j?j.replace(/_/g," "):""),X=["Recovered automatically"];if($>1)X[0]=`Recovered after ${$} attempts`;if(Z)X.push(Z);return X.join(" — ")}function kk(_){let $=typeof _?.tool_action_summary==="string"?_.tool_action_summary.trim():"",j=_?.draft_recovered?" Showing recovered draft.":"";return $?`Turn timed out — ${$}${j}`:`Turn timed out before the model finished responding${j}`}function Tk({marker:_}){let[$,j]=C(!1),Z=R((N)=>{N.stopPropagation(),j((F)=>!F)},[]),X=typeof _?.title==="string"?_.title.trim():"",G=typeof _?.detail==="string"?_.detail.trim():"",q=typeof _?.tool_action_summary==="string"?_.tool_action_summary.trim():"",Q=_?.draft_recovered,K=String(_?.severity||"warning"),V=q||X||String(_?.label||_?.kind||"issue"),Y=Boolean(G||X&&q);return U`
        <div class=${`post-outcome-pill post-outcome-pill-${K}`}>
            <div class="post-outcome-pill-header" onClick=${Y?Z:void 0}>
                ${Y&&U`
                    <span class="post-outcome-pill-toggle" aria-hidden="true">${t_($?"down":"right")}</span>
                `}
                <span class="post-outcome-pill-label">${V}</span>
                ${Q&&U`<span class="post-outcome-pill-badge">draft recovered</span>`}
            </div>
            ${$&&Y&&U`
                <div class="post-outcome-pill-detail">
                    ${X&&U`<div><strong>${X}</strong></div>`}
                    ${G&&G!==X&&U`<div>${G}</div>`}
                </div>
            `}
        </div>
    `}function yk({attachment:_,onPreview:$}){let j=Number(_?.id),[Z,X]=C(null);b(()=>{if(!Number.isFinite(j))return;b2(j).then(X).catch((Y)=>{console.warn("[post] Failed to load attachment metadata for attachment pill:",j,Y)});return},[j]);let G=Z?.filename||_.label||`attachment-${_.id}`,q=Number.isFinite(j)?v_(j):null,Q=P6(Z?.content_type,Z?.filename||_?.label),K=O8(Q),V=Q!=="unsupported";return U`
        <span class="attachment-pill" title=${G}>
            ${q?U`
                    <a href=${q} download=${G} class="attachment-pill-main" onClick=${(Y)=>Y.stopPropagation()}>
                        <${K_}
                            prefix="post"
                            label=${_.label}
                            title=${G}
                        />
                    </a>
                `:U`
                    <${K_}
                        prefix="post"
                        label=${_.label}
                        title=${G}
                    />
                `}
            ${Number.isFinite(j)&&Z&&V&&U`
                <button
                    class="attachment-pill-preview"
                    type="button"
                    title=${K}
                    onClick=${(Y)=>{Y.preventDefault(),Y.stopPropagation(),$?.({mediaId:j,info:Z})}}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </button>
            `}
        </span>
    `}function y8({annotations:_}){if(!_)return null;let{audience:$,priority:j,lastModified:Z}=_,X=Z?x4(Z):null;return U`
        <div class="content-annotations">
            ${$&&$.length>0&&U`
                <span class="content-annotation">Audience: ${$.join(", ")}</span>
            `}
            ${typeof j==="number"&&U`
                <span class="content-annotation">Priority: ${j}</span>
            `}
            ${X&&U`
                <span class="content-annotation">Updated: ${X}</span>
            `}
        </div>
    `}function wk({block:_}){let $=_.title||_.name||_.uri,j=_.description,Z=_.size?t1(_.size):"",X=_.mime_type||"",G=Ck(X),q=M4(_.uri);return U`
        <a
            href=${q||"#"}
            class="resource-link"
            target=${q?"_blank":void 0}
            rel=${q?"noopener noreferrer":void 0}
            onClick=${(Q)=>Q.stopPropagation()}>
            <div class="resource-link-main">
                <div class="resource-link-header">
                    <span class="resource-link-icon-inline">${G}</span>
                    <div class="resource-link-title">${$}</div>
                </div>
                ${j&&U`<div class="resource-link-description">${j}</div>`}
                <div class="resource-link-meta">
                    ${X&&U`<span>${X}</span>`}
                    ${Z&&U`<span>${Z}</span>`}
                </div>
            </div>
            <div class="resource-link-icon">↗</div>
        </a>
    `}function Ik({block:_}){let[$,j]=C(!1),Z=_.uri||"Embedded resource",X=_.text||"",G=Boolean(_.data),q=_.mime_type||"";return U`
        <div class="resource-embed">
            <button class="resource-embed-toggle" onClick=${(Q)=>{Q.preventDefault(),Q.stopPropagation(),j(!$)}}>
                ${t_($?"down":"right")} ${Z}
            </button>
            ${$&&U`
                ${X&&U`<pre class="resource-embed-content">${X}</pre>`}
                ${G&&U`
                    <div class="resource-embed-blob">
                        <span class="resource-embed-blob-label">Embedded blob</span>
                        ${q&&U`<span class="resource-embed-blob-meta">${q}</span>`}
                        <button class="resource-embed-blob-btn" onClick=${(Q)=>{Q.preventDefault(),Q.stopPropagation();let K=new Blob([Uint8Array.from(atob(_.data),(N)=>N.charCodeAt(0))],{type:q||"application/octet-stream"}),V=URL.createObjectURL(K),Y=document.createElement("a");Y.href=V,Y.download=Z.split("/").pop()||"resource",Y.click(),URL.revokeObjectURL(V)}}>Download</button>
                    </div>
                `}
            `}
        </div>
    `}function xk({block:_,post:$,onOpenWidget:j}){if(!_)return null;let Z=jj(_,$),X=dV(_),G=Z?.artifact?.kind||_?.artifact?.kind||_?.kind||null,q=Z?.title||_.title||_.name||"Generated widget",Q=Z?.description||_.description||_.subtitle||"",K=_.open_label||"Open widget",V=g(!1),Y=(N)=>{if(N)N.preventDefault(),N.stopPropagation();if(!Z)return;j?.(Z)};return b(()=>{if(!_?.auto_open||!Z||!X||V.current)return;let N=$?.timestamp?new Date($.timestamp).getTime():0;if(N&&Date.now()-N>1e4)return;let F=`widget_opened_${_.widget_id||$?.id||""}`;if(DY(sessionStorage,F))return;V.current=!0,zY(sessionStorage,F,"1"),j?.(Z)},[_?.auto_open,Z,X]),U`
        <div class="generated-widget-launch" onClick=${(N)=>N.stopPropagation()}>
            <div class="generated-widget-launch-header">
                <div class="generated-widget-launch-eyebrow">Generated widget${G?` • ${String(G).toUpperCase()}`:""}</div>
                <div class="generated-widget-launch-title">${q}</div>
            </div>
            ${Q&&U`<div class="generated-widget-launch-description">${Q}</div>`}
            <div class="generated-widget-launch-actions">
                <button
                    class="generated-widget-launch-btn"
                    type="button"
                    disabled=${!X}
                    onClick=${Y}
                    title=${X?"Open widget in a floating pane with a zen-mode toggle":"Unsupported widget artifact"}
                >
                    ${K}
                </button>
                <span class="generated-widget-launch-note">
                    ${X?"Opens in a dismissible floating pane with a zen-mode toggle.":"This widget artifact is missing or unsupported."}
                </span>
            </div>
        </div>
    `}function Ck(_){if(!_)return"\uD83D\uDCCE";if(_.startsWith("image/"))return"\uD83D\uDDBC️";if(_.startsWith("audio/"))return"\uD83C\uDFB5";if(_.startsWith("video/"))return"\uD83C\uDFAC";if(_.includes("pdf"))return"\uD83D\uDCC4";if(_.includes("zip")||_.includes("gzip"))return"\uD83D\uDDDC️";if(_.startsWith("text/"))return"\uD83D\uDCC4";return"\uD83D\uDCCE"}function Pk(_){let $=M4(_,{allowDataImage:!0});return $?{backgroundImage:`url("${$}")`}:void 0}function fk({preview:_}){let $=M4(_.url),j=Pk(_.image),Z=WY(_.site_name,$);return U`
        <a
            href=${$||"#"}
            class="link-preview ${j?"has-image":""}"
            target=${$?"_blank":void 0}
            rel=${$?"noopener noreferrer":void 0}
            onClick=${(X)=>X.stopPropagation()}
            style=${j}>
            <div class="link-preview-overlay">
                <div class="link-preview-site">${Z||""}</div>
                <div class="link-preview-title">${_.title}</div>
                ${_.description&&U`
                    <div class="link-preview-description">${_.description}</div>
                `}
            </div>
        </a>
    `}function Rk(_,$){return typeof _==="string"?_:""}var OY=1800,Sk=40,bk=24576,gk=16,uk=`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="9" y="9" width="10" height="10" rx="2"></rect>
        <path d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"></path>
    </svg>`,vk=`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20 6L9 17l-5-5"></path>
    </svg>`,mk=`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M9 9l6 6M15 9l-6 6"></path>
    </svg>`,ck=`
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #1a1a1a;
  }
  h1 { font-size: 1.6em; font-weight: 700; margin: 0.6em 0 0.4em; }
  h2 { font-size: 1.35em; font-weight: 700; margin: 0.6em 0 0.4em; }
  h3 { font-size: 1.15em; font-weight: 700; margin: 0.5em 0 0.3em; }
  h4, h5, h6 { font-size: 1em; font-weight: 700; margin: 0.5em 0 0.3em; }
  p { margin: 0.5em 0; }
  pre {
    background: #f6f8fa;
    border: 1px solid #d0d7de;
    border-radius: 6px;
    padding: 12px 16px;
    overflow-x: auto;
    margin: 0.5em 0;
  }
  code {
    font-family: "Fira Code", "Cascadia Code", Consolas, "Courier New", monospace;
    font-size: 0.9em;
  }
  pre code { background: none; padding: 0; border: none; }
  :not(pre) > code { background: #f0f2f5; padding: 2px 5px; border-radius: 3px; }
  blockquote { border-left: 3px solid #d0d7de; margin: 0.5em 0; padding-left: 12px; color: #57606a; }
  table { border-collapse: collapse; margin: 0.5em 0; }
  th, td { border: 1px solid #d0d7de; padding: 6px 12px; text-align: left; }
  th { background: #f6f8fa; font-weight: 600; }
  ul, ol { margin: 0.4em 0; padding-left: 1.8em; }
  li { margin: 0.15em 0; }
  a { color: #0969da; text-decoration: none; }
  hr { border: none; border-top: 1px solid #d0d7de; margin: 1em 0; }
  img { max-width: 100%; }
</style>`;function hk(_,$={}){let j=typeof _==="string"?_:"",Z=j?j.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`):[],X=new TextEncoder().encode(j).byteLength,G=Number.isFinite($.lineThreshold)?$.lineThreshold:Sk,q=Number.isFinite($.byteThreshold)?$.byteThreshold:bk,Q=Z.length>G||X>q,K=Math.min(Z.length,Number.isFinite($.previewLines)?$.previewLines:gk);return{shouldCollapse:Q,lineCount:Z.length,byteLength:X,visibleLines:K,omittedLines:Math.max(0,Z.length-K)}}async function LY(_){let $=typeof _==="string"?_:"";if(!$)return!1;if(Oj(document,{text:$}))return!0;if(await FY(navigator.clipboard,$))return!0;try{let j=document.createElement("textarea");j.value=$,j.setAttribute("readonly",""),j.style.position="fixed",j.style.opacity="0",j.style.pointerEvents="none",document.body.appendChild(j),j.select(),j.setSelectionRange(0,j.value.length);let Z=document.execCommand("copy");return document.body.removeChild(j),Z}catch{return!1}}async function lk(_){let $=typeof _==="string"?_:"";if(!$)return!1;let j=q_($,null),Z=`<html><head>${ck}</head><body>${j}</body></html>`;if(Oj(document,{text:$,html:Z}))return!0;if(navigator.clipboard?.write&&typeof ClipboardItem<"u")try{let X=new ClipboardItem({"text/plain":new Blob([$],{type:"text/plain"}),"text/html":new Blob([Z],{type:"text/html"})});return await navigator.clipboard.write([X]),!0}catch(X){console.warn("[post] Rich clipboard write failed, falling back to plain text copy.",X)}return LY($)}function pk(_){if(!_)return()=>{};let $=Array.from(_.querySelectorAll("pre")).filter((q)=>q.querySelector("code"));if($.length===0)return()=>{};let j=new Map,Z=[],X=(q)=>{let Q=window.getSelection?.();if(!Q||Q.isCollapsed)return;for(let K of $)if(UY(q,{root:K,selection:Q}))return};document.addEventListener("copy",X,!0),Z.push(()=>document.removeEventListener("copy",X,!0));let G=(q,Q)=>{let K=Q||"idle";if(q.dataset.copyState=K,K==="success")q.innerHTML=vk,q.setAttribute("aria-label","Copied"),q.setAttribute("title","Copied"),q.classList.add("is-success"),q.classList.remove("is-error");else if(K==="error")q.innerHTML=mk,q.setAttribute("aria-label","Copy failed"),q.setAttribute("title","Copy failed"),q.classList.add("is-error"),q.classList.remove("is-success");else q.innerHTML=uk,q.setAttribute("aria-label","Copy code"),q.setAttribute("title","Copy code"),q.classList.remove("is-success","is-error")};return $.forEach((q)=>{let Q=document.createElement("div");Q.className="post-code-block";let K=q.querySelector("code"),V=hk(K?.textContent||"");if(V.shouldCollapse){Q.classList.add("post-code-block-collapsed"),Q.style.setProperty("--post-code-preview-lines",String(V.visibleLines));let F=document.createElement("button");F.type="button",F.className="post-code-expand-btn";let B=()=>{let W=Q.classList.contains("post-code-block-expanded");F.innerHTML=W?`${Qj("up")} <span>Collapse output</span>`:`${Qj("right")} <span>Expand output · ${V.lineCount.toLocaleString()} lines · ${t1(V.byteLength)}${V.omittedLines?` · ${V.omittedLines.toLocaleString()} hidden`:""}</span>`,F.setAttribute("aria-expanded",W?"true":"false")},D=(W)=>{W.preventDefault(),W.stopPropagation(),Q.classList.toggle("post-code-block-expanded"),B()};F.addEventListener("click",D),B(),Q.appendChild(F),Z.push(()=>F.removeEventListener("click",D))}q.parentNode?.insertBefore(Q,q),Q.appendChild(q);let Y=document.createElement("button");Y.type="button",Y.className="post-code-copy-btn",G(Y,"idle"),Q.appendChild(Y);let N=async(F)=>{F.preventDefault(),F.stopPropagation();let D=q.querySelector("code")?.textContent||"",W=await LY(D);G(Y,W?"success":"error");let H=j.get(Y);if(H)clearTimeout(H);let z=setTimeout(()=>{G(Y,"idle"),j.delete(Y)},OY);j.set(Y,z)};Y.addEventListener("click",N),Z.push(()=>{Y.removeEventListener("click",N);let F=j.get(Y);if(F)clearTimeout(F);if(Q.parentNode)Q.parentNode.insertBefore(q,Q),Q.remove()})}),()=>{Z.forEach((q)=>q())}}function JY(_){let $=String(_||"").trim(),j=$.match(/^`([^`]+)`$/);return(j?j[1]:$).trim()}function rk(_){if(!_)return{content:_,fileRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),Z=-1;for(let V=0;V<j.length;V+=1)if(j[V].trim()==="Files:"&&j[V+1]&&/^\s*-\s+/.test(j[V+1])){Z=V;break}if(Z===-1)return{content:_,fileRefs:[]};let X=[],G=Z+1;for(;G<j.length;G+=1){let V=j[G];if(/^\s*-\s+/.test(V)){let Y=JY(V.replace(/^\s*-\s+/,"").trim());if(Y)X.push(Y)}else if(!V.trim())break;else break}if(X.length===0)return{content:_,fileRefs:[]};let q=j.slice(0,Z),Q=j.slice(G),K=[...q,...Q].join(`
`);return K=K.replace(/\n{3,}/g,`

`).trim(),{content:K,fileRefs:X}}function nk(_){if(!_)return{content:_,folderRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),Z=-1;for(let V=0;V<j.length;V+=1)if(j[V].trim()==="Folders:"&&j[V+1]&&/^\s*-\s+/.test(j[V+1])){Z=V;break}if(Z===-1)return{content:_,folderRefs:[]};let X=[],G=Z+1;for(;G<j.length;G+=1){let V=j[G];if(/^\s*-\s+/.test(V)){let Y=JY(V.replace(/^\s*-\s+/,"").trim());if(Y)X.push(Y)}else if(!V.trim())break;else break}if(X.length===0)return{content:_,folderRefs:[]};let q=j.slice(0,Z),Q=j.slice(G),K=[...q,...Q].join(`
`);return K=K.replace(/\n{3,}/g,`

`).trim(),{content:K,folderRefs:X}}function dk(_){if(!_)return{content:_,messageRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),Z=-1;for(let V=0;V<j.length;V+=1)if(j[V].trim()==="Referenced messages:"&&j[V+1]&&/^\s*-\s+/.test(j[V+1])){Z=V;break}if(Z===-1)return{content:_,messageRefs:[]};let X=[],G=Z+1;for(;G<j.length;G+=1){let V=j[G];if(/^\s*-\s+/.test(V)){let N=V.replace(/^\s*-\s+/,"").trim().match(/^message:(\S+)$/i);if(N)X.push(N[1])}else if(!V.trim())break;else break}if(X.length===0)return{content:_,messageRefs:[]};let q=j.slice(0,Z),Q=j.slice(G),K=[...q,...Q].join(`
`);return K=K.replace(/\n{3,}/g,`

`).trim(),{content:K,messageRefs:X}}function ok(_){if(!_)return{content:_,attachments:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),Z=-1;for(let V=0;V<j.length;V+=1){let Y=j[V].trim();if((Y==="Images:"||Y==="Attachments:")&&j[V+1]&&/^\s*-\s+/.test(j[V+1])){Z=V;break}}if(Z===-1)return{content:_,attachments:[]};let X=[],G=Z+1;for(;G<j.length;G+=1){let V=j[G];if(/^\s*-\s+/.test(V)){let Y=V.replace(/^\s*-\s+/,"").trim(),N=Y.match(/^attachment:([^\s)]+)\s*(?:\((.+)\))?$/i)||Y.match(/^attachment:([^\s]+)\s+(.+)$/i);if(N){let F=N[1],B=(N[2]||"").trim()||F;X.push({id:F,label:B,raw:Y})}else X.push({id:null,label:Y,raw:Y})}else if(!V.trim())break;else break}if(X.length===0)return{content:_,attachments:[]};let q=j.slice(0,Z),Q=j.slice(G),K=[...q,...Q].join(`
`);return K=K.replace(/\n{3,}/g,`

`).trim(),{content:K,attachments:X}}function ik(_){return _.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function sk(_,$){if(!_||!$)return _;let j=String($).trim().split(/\s+/).filter(Boolean);if(j.length===0)return _;let Z=j.map(ik).sort((Y,N)=>N.length-Y.length),X=new RegExp(`(${Z.join("|")})`,"gi"),G=new RegExp(`^(${Z.join("|")})$`,"i"),q=new DOMParser().parseFromString(_,"text/html"),Q=q.createTreeWalker(q.body,NodeFilter.SHOW_TEXT),K=[],V;while(V=Q.nextNode())K.push(V);for(let Y of K){let N=Y.nodeValue;if(!N||!X.test(N)){X.lastIndex=0;continue}X.lastIndex=0;let F=Y.parentElement;if(F&&F.closest("code, pre, script, style"))continue;let B=N.split(X).filter((W)=>W!=="");if(B.length===0)continue;let D=q.createDocumentFragment();for(let W of B)if(G.test(W)){let H=q.createElement("mark");H.className="search-highlight-term",H.textContent=W,D.appendChild(H)}else D.appendChild(q.createTextNode(W));Y.parentNode.replaceChild(D,Y)}return q.body.innerHTML}function EY({post:_,onClick:$,onHashtagClick:j,onMessageRef:Z,onScrollToMessage:X,agentName:G,agentAvatarUrl:q,userName:Q,userAvatarUrl:K,userAvatarBackground:V,onDelete:Y,isThreadReply:N,isThreadPrev:F,isThreadNext:B,isRemoving:D,highlightQuery:W,onFileRef:H,onOpenWidget:z,onOpenAttachmentPreview:k}){let[J,L]=C(null),[x,I]=C("idle"),[E,M]=C(()=>Hj()),O=g(null),T=g(null),y=_.data,A=y.type==="agent_response",P=Q||"You",f=A?G||yK:P,u=typeof _.chat_agent_name==="string"?_.chat_agent_name.trim():"",c=Boolean(A&&W&&u&&u!==f),r=A?Gj(G,q,!0):Gj(P,K),e=typeof V==="string"?V.trim().toLowerCase():"",m=!A&&r.image&&(e==="clear"||e==="transparent"),_0=A&&Boolean(r.image),H0=`background-color: ${m||_0?"transparent":r.color}`,X0=y.content_meta,j0=Boolean(X0?.truncated),Q0=Boolean(X0?.preview),F0=j0&&!Q0,h=j0?{originalLength:Number.isFinite(X0?.original_length)?X0.original_length:y.content?y.content.length:0,maxLength:Number.isFinite(X0?.max_length)?X0.max_length:0}:null,$0=y.content_blocks||[],K0=y.media_ids||[],L0=HY($0),a=Boolean(L0?.sourceAgentName),G0=Rk(y.content,y.link_previews);G0=Ek(G0,$0);let{content:O0,fileRefs:P0}=rk(G0),{content:p0,folderRefs:g0}=nk(O0),{content:X1,messageRefs:l0}=dk(p0),a0=(d)=>{d?.preventDefault?.(),d?.stopPropagation?.(),Z?.(_.id,_.chat_jid||null)},f0=(d)=>{if(d.key==="Enter"||d.key===" ")a0(d)},{content:i0,attachments:m0}=ok(X1);G0=i0;let e0=Fj($0),s0=Kj($0),G1=Wk($0)[0]||null,J0=Hk($0)[0]||null,o0=Ok($0)[0]||null,H1=e0.length===1&&typeof e0[0]?.fallback_text==="string"?e0[0].fallback_text.trim():"",z0=s0.length===1?E8(s0[0]).trim():"",b0=Boolean(H1)&&G0?.trim()===H1||Boolean(z0)&&G0?.trim()===z0,x0=Boolean(G0)&&!F0&&!b0,n0=typeof W==="string"?W.trim():"",E1=q0(()=>{if(!G0||b0)return"";let d=q_(G0,j);return n0?sk(d,n0):d},[G0,b0,n0]),Y1=q0(()=>A8(_),[_]),z1=q0(()=>VY(),[]),U1=q0(()=>KY(_),[_]),A1=Boolean(E.speaking&&E.activePostId===_.id),x1=(d,B0)=>{d.stopPropagation(),L(v_(B0))},f1=(d)=>{k?.(d)},O1=(d)=>{d.stopPropagation(),Y?.(_)},s1=async(d)=>{d.stopPropagation();let B0=await lk(Y1);if(I(B0?"success":"error"),T.current)clearTimeout(T.current);T.current=setTimeout(()=>{T.current=null,I("idle")},OY)},R1=(d)=>{if(d.stopPropagation(),A1){YY();return}NY(_.id,U1)},V0=(d,B0)=>{let r0=new Set;if(!d||B0.length===0)return{content:d,usedIds:r0};return{content:d.replace(/attachment:([^\s)"']+)/g,(S1,z_,u1,A_)=>{let C1=z_.replace(/^\/+/,""),M_=B0.find((k1)=>k1.name&&k1.name.toLowerCase()===C1.toLowerCase()&&!r0.has(k1.id))||B0.find((k1)=>!r0.has(k1.id));if(!M_)return S1;if(r0.add(M_.id),A_.slice(Math.max(0,u1-2),u1)==="](")return`/media/${M_.id}`;return M_.name||"attachment"}),usedIds:r0}},v=[],n=[],s=[],Z0=[],U0=[],T0=[],A0=[],k0=0;if($0.length>0)$0.forEach((d)=>{if(d?.type==="text"&&d.annotations)A0.push(d.annotations);if(d?.type==="generated_widget")T0.push(d);else if(d?.type==="resource_link")Z0.push(d);else if(d?.type==="resource")U0.push(d);else if(d?.type==="file"){let B0=K0[k0++];if(B0)n.push(B0),s.push({id:B0,name:d?.name||d?.filename||d?.title})}else if(d?.type==="image"||!d?.type){let B0=K0[k0++];if(B0){let r0=typeof d?.mime_type==="string"?d.mime_type:void 0;v.push({id:B0,annotations:d?.annotations,mimeType:r0}),s.push({id:B0,name:d?.name||d?.filename||d?.title})}}});else if(K0.length>0){let d=m0.length>0;K0.forEach((B0,r0)=>{let Z1=m0[r0]||null;if(s.push({id:B0,name:Z1?.label||null}),d)n.push(B0);else v.push({id:B0,annotations:null})})}if(m0.length>0)m0.forEach((d)=>{if(!d?.id)return;let B0=s.find((r0)=>String(r0.id)===String(d.id));if(B0&&!B0.name)B0.name=d.label});let{content:y0,usedIds:h0}=V0(G0,s);G0=y0;let S0=v.filter(({id:d})=>!h0.has(d)),d0=n.filter((d)=>!h0.has(d)),_1=m0.length>0?m0.map((d,B0)=>({id:d.id||`attachment-${B0+1}`,label:d.label||`attachment-${B0+1}`})):s.map((d,B0)=>({id:d.id,label:d.name||`attachment-${B0+1}`})),I0=q0(()=>Fj($0),[$0]),w0=q0(()=>Kj($0),[$0]),W1=q0(()=>{return I0.map((d)=>`${d.card_id}:${d.state}`).join("|")},[I0]);b(()=>{if(!O.current)return;return L$(O.current),pk(O.current)},[E1]),b(()=>{return QY((d)=>{M(d)})},[]),b(()=>()=>{if(T.current)clearTimeout(T.current)},[]);let $1=g(null);return b(()=>{if(!$1.current||I0.length===0)return;let d=$1.current;d.innerHTML="";for(let B0 of I0){let r0=document.createElement("div");d.appendChild(r0),XY(r0,B0,{onAction:async(Z1)=>{if(Z1.type==="Action.OpenUrl"){let S1=M4(Z1.url||"");if(!S1)throw Error("Invalid URL");window.open(S1,"_blank","noopener,noreferrer");return}if(Z1.type==="Action.Submit"){await p7({post_id:_.id,thread_id:y.thread_id||_.id,chat_jid:_.chat_jid||null,card_id:B0.card_id,action:{type:Z1.type,title:Z1.title||"",data:Z1.data}});return}console.warn("[post] unsupported adaptive card action:",Z1.type,Z1)}}).catch((Z1)=>{console.error("[post] adaptive card render error:",Z1),r0.textContent=B0.fallback_text||"Card failed to render."})}},[W1,_.id]),U`
        <div id=${`post-${_.id}`} class="post ${A?"agent-post":""} ${N?"thread-reply":""} ${F?"thread-prev":""} ${B?"thread-next":""} ${D?"removing":""}" onClick=${$}>
            <div class="post-avatar ${A?"agent-avatar":""} ${r.image?"has-image":""}" style=${H0}>
                ${r.image?U`<img src=${r.image} alt=${f} />`:r.letter}
            </div>
            <div class="post-body">
                <div class="post-actions">
                    ${A&&z1&&U1&&U`
                        <button
                            class=${`post-action-btn post-speak-btn${A1?" is-active":""}`}
                            type="button"
                            title=${A1?"Stop reading aloud":"Read aloud"}
                            aria-label=${A1?"Stop reading aloud":"Read aloud"}
                            onClick=${R1}
                        >
                            ${A1?U`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>`:U`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11 5 6 9H3v6h3l5 4z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M18 6a8.5 8.5 0 0 1 0 12"></path></svg>`}
                        </button>
                    `}
                    <button
                        class=${`post-action-btn post-copy-btn${x==="success"?" is-success":x==="error"?" is-error":""}`}
                        type="button"
                        title=${x==="success"?"Copied":x==="error"?"Copy failed":"Copy message"}
                        aria-label=${x==="success"?"Copied":x==="error"?"Copy failed":"Copy message"}
                        onClick=${s1}
                        disabled=${!Y1}
                    >
                        ${x==="success"?U`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 6L9 17l-5-5"></path></svg>`:x==="error"?U`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="M9 9l6 6M15 9l-6 6"></path></svg>`:U`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="9" y="9" width="10" height="10" rx="2"></rect><path d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"></path></svg>`}
                    </button>
                    <button
                        class="post-action-btn post-delete-btn"
                        type="button"
                        title="Delete message"
                        aria-label="Delete message"
                        onClick=${O1}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="post-meta">
                    <span class="post-author">${f}</span>
                    ${a&&U`
                        <span
                            class="post-chat-agent-tag"
                            title=${`From ${L0?.sourceChatJid||""}`.trim()}
                        >
                            @${L0?.sourceAgentName}
                        </span>
                    `}
                    ${c&&U`
                        <span
                            class="post-chat-agent-tag"
                            role="button"
                            tabIndex="0"
                            style="cursor:pointer"
                            title=${`Open ${u} and reference this message`}
                            onClick=${a0}
                            onKeyDown=${f0}
                        >
                            @${u}
                        </span>
                    `}
                    <a class="post-time" href=${`#msg-${_.id}`} onClick=${a0}>${Kq(_.timestamp)}</a>
                    ${G1&&U`
                        <span
                            class="post-recovery-chip"
                            title=${Mk(G1)}
                        >
                            recovered
                        </span>
                    `}
                    ${J0&&U`
                        <span
                            class="post-recovery-chip post-timeout-chip"
                            title=${kk(J0)}
                        >
                            timeout
                        </span>
                    `}
                    ${o0&&U`
                        <span
                            class=${`post-recovery-chip post-outcome-chip post-outcome-chip-${String(o0.severity||"warning")}${o0.kind==="tool_budget"?" post-outcome-chip-tool-budget":""}`}
                            title=${String(o0.label||o0.kind||"issue")}
                        >
                            ${String(o0.label||o0.kind||"issue")}
                        </span>
                    `}
                </div>
                ${o0&&U`
                    <${Tk} marker=${o0} />
                `}
                ${F0&&h&&U`
                    <div class="post-content truncated">
                        <div class="truncated-title">Message too large to display.</div>
                        <div class="truncated-meta">
                            Original length: ${H6(h.originalLength)} chars
                            ${h.maxLength?U` • Display limit: ${H6(h.maxLength)} chars`:""}
                        </div>
                    </div>
                `}
                ${Q0&&h&&U`
                    <div class="post-content preview">
                        <div class="truncated-title">Preview truncated.</div>
                        <div class="truncated-meta">
                            Showing first ${H6(h.maxLength)} of ${H6(h.originalLength)} chars. Download full text below.
                        </div>
                    </div>
                `}
                ${(P0.length>0||g0.length>0||l0.length>0||_1.length>0)&&U`
                    <div class="post-file-refs">
                        ${l0.map((d)=>{let B0=(r0)=>{if(r0.preventDefault(),r0.stopPropagation(),X)X(d,_.chat_jid||null);else{let Z1=document.getElementById("post-"+d);if(Z1)Z1.scrollIntoView({behavior:"smooth",block:"center"}),Z1.classList.add("post-highlight"),setTimeout(()=>Z1.classList.remove("post-highlight"),2000)}};return U`
                                <a href=${`#msg-${d}`} class="post-msg-pill-link" onClick=${B0}>
                                    <${K_}
                                        prefix="post"
                                        label=${"msg:"+d}
                                        title=${"Message "+d}
                                        icon="message"
                                        onClick=${B0}
                                    />
                                </a>
                            `})}
                        ${P0.map((d)=>{let B0=d.split("/").pop()||d;return U`
                                <${K_}
                                    prefix="post"
                                    label=${B0}
                                    title=${d}
                                    onClick=${()=>H?.(d)}
                                />
                            `})}
                        ${g0.map((d)=>{let B0=d.split("/").pop()||d;return U`
                                <${K_}
                                    prefix="post"
                                    label=${B0}
                                    title=${d}
                                    icon="folder"
                                />
                            `})}
                        ${_1.map((d)=>U`
                            <${yk}
                                key=${d.id}
                                attachment=${d}
                                onPreview=${f1}
                            />
                        `)}
                    </div>
                `}
                ${x0&&U`
                    <div 
                        ref=${O}
                        class="post-content"
                        dangerouslySetInnerHTML=${{__html:E1}}
                        onClick=${(d)=>{if(d.target.classList.contains("hashtag")){d.preventDefault(),d.stopPropagation();let B0=d.target.dataset.hashtag;if(B0)j?.(B0)}else if(d.target.tagName==="IMG")d.preventDefault(),d.stopPropagation(),L(d.target.src)}}
                    />
                `}
                ${I0.length>0&&U`
                    <div ref=${$1} class="post-adaptive-cards" />
                `}
                ${w0.length>0&&U`
                    <div class="post-adaptive-card-submissions">
                        ${w0.map((d,B0)=>{let r0=iK(d),Z1=`${d.card_id}-${B0}`;return U`
                                <div key=${Z1} class="adaptive-card-submission-receipt">
                                    <div class="adaptive-card-submission-header">
                                        <span class="adaptive-card-submission-icon" aria-hidden="true">✓</span>
                                        <div class="adaptive-card-submission-title-wrap">
                                            <span class="adaptive-card-submission-title">Submitted</span>
                                            <span class="adaptive-card-submission-title-action">${r0.title}</span>
                                        </div>
                                    </div>
                                    ${r0.fields.length>0&&U`
                                        <div class="adaptive-card-submission-fields">
                                            ${r0.fields.map((S1)=>U`
                                                <span class="adaptive-card-submission-field" title=${`${S1.key}: ${S1.value}`}>
                                                    <span class="adaptive-card-submission-field-key">${S1.key}</span>
                                                    <span class="adaptive-card-submission-field-sep">:</span>
                                                    <span class="adaptive-card-submission-field-value">${S1.value}</span>
                                                </span>
                                            `)}
                                        </div>
                                    `}
                                    <div class="adaptive-card-submission-meta">
                                        Submitted ${x4(r0.submittedAt)}
                                    </div>
                                </div>
                            `})}
                    </div>
                `}
                ${T0.length>0&&U`
                    <div class="generated-widget-launches">
                        ${T0.map((d,B0)=>U`
                            <${xk}
                                key=${d.widget_id||d.id||`${_.id}-widget-${B0}`}
                                block=${d}
                                post=${_}
                                onOpenWidget=${z}
                            />
                        `)}
                    </div>
                `}
                ${A0.length>0&&U`
                    ${A0.map((d,B0)=>U`
                        <${y8} key=${B0} annotations=${d} />
                    `)}
                `}
                ${S0.length>0&&U`
                    <div class="media-preview">
                        ${S0.map(({id:d,mimeType:B0})=>{let Z1=typeof B0==="string"&&B0.toLowerCase().startsWith("image/svg")?v_(d):n7(d);return U`
                                <img
                                    key=${d}
                                    src=${Z1}
                                    alt="Media"
                                    loading="lazy"
                                    decoding="async"
                                    onClick=${(S1)=>x1(S1,d)}
                                />
                            `})}
                    </div>
                `}
                ${S0.length>0&&U`
                    ${S0.map(({annotations:d},B0)=>U`
                        ${d&&U`<${y8} key=${B0} annotations=${d} />`}
                    `)}
                `}
                ${d0.length>0&&U`
                    <div class="file-attachments">
                        ${d0.map((d)=>U`
                            <${zk} key=${d} mediaId=${d} onPreview=${f1} />
                        `)}
                    </div>
                `}
                ${Z0.length>0&&U`
                    <div class="resource-links">
                        ${Z0.map((d,B0)=>U`
                            <div key=${B0}>
                                <${wk} block=${d} />
                                <${y8} annotations=${d.annotations} />
                            </div>
                        `)}
                    </div>
                `}
                ${U0.length>0&&U`
                    <div class="resource-embeds">
                        ${U0.map((d,B0)=>U`
                            <div key=${B0}>
                                <${Ik} block=${d} />
                                <${y8} annotations=${d.annotations} />
                            </div>
                        `)}
                    </div>
                `}
                ${y.link_previews?.length>0&&U`
                    <div class="link-previews">
                        ${y.link_previews.map((d,B0)=>U`
                            <${fk} key=${B0} preview=${d} />
                        `)}
                    </div>
                `}
            </div>
        </div>
        ${J&&U`<${GY} src=${J} onClose=${()=>L(null)} />`}

    `}function AY({posts:_,hasMore:$,onLoadMore:j,onPostClick:Z,onHashtagClick:X,onMessageRef:G,onScrollToMessage:q,onFileRef:Q,onOpenWidget:K,onOpenAttachmentPreview:V,emptyMessage:Y,timelineRef:N,agents:F,user:B,onDeletePost:D,reverse:W=!0,removingPostIds:H,searchQuery:z}){let[k,J]=C(!1),L=g(null),x=typeof IntersectionObserver<"u",I=R(async()=>{if(!j||!$||k)return;J(!0);try{await j({preserveScroll:!0,preserveMode:"top"})}finally{J(!1)}},[$,k,j]),E=R((u)=>{let{scrollTop:c,scrollHeight:r,clientHeight:e}=u.target,m=W?r-e-c:c,_0=Math.max(300,e);if(m<_0)I()},[W,I]);b(()=>{if(!x)return;let u=L.current,c=N?.current;if(!u||!c)return;let r=300,e=new IntersectionObserver((m)=>{for(let _0 of m){if(!_0.isIntersecting)continue;I()}},{root:c,rootMargin:`${r}px 0px ${r}px 0px`,threshold:0});return e.observe(u),()=>e.disconnect()},[x,$,j,N,I]);let M=g(I);if(M.current=I,b(()=>{if(x)return;if(!N?.current)return;let{scrollTop:u,scrollHeight:c,clientHeight:r}=N.current,e=W?c-r-u:u,m=Math.max(300,r);if(e<m)M.current?.()},[x,_,$,W,N]),b(()=>{if(!N?.current)return;if(!$||k)return;let{scrollTop:u,scrollHeight:c,clientHeight:r}=N.current,e=W?c-r-u:u,m=Math.max(300,r);if(c<=r+1||e<m)M.current?.()},[_,$,k,W,N]),!_)return U`<div class="loading"><div class="spinner"></div></div>`;if(_.length===0)return U`
            <div class="timeline" ref=${N}>
                <div class="timeline-content">
                    <div style="padding: var(--spacing-xl); text-align: center; color: var(--text-secondary)">
                        ${Y||"No messages yet. Start a conversation!"}
                    </div>
                </div>
            </div>
        `;let O=_.slice().sort((u,c)=>u.id-c.id),T=(u)=>{let c=u?.data?.thread_id;if(c===null||c===void 0||c==="")return null;let r=Number(c);return Number.isFinite(r)?r:null},y=new Map;for(let u=0;u<O.length;u+=1){let c=O[u],r=Number(c?.id),e=T(c);if(e!==null){let m=y.get(e)||{anchorIndex:-1,replyIndexes:[]};m.replyIndexes.push(u),y.set(e,m)}else if(Number.isFinite(r)){let m=y.get(r)||{anchorIndex:-1,replyIndexes:[]};m.anchorIndex=u,y.set(r,m)}}let A=new Map;for(let[u,c]of y.entries()){let r=new Set;if(c.anchorIndex>=0)r.add(c.anchorIndex);for(let e of c.replyIndexes)r.add(e);A.set(u,Array.from(r).sort((e,m)=>e-m))}let P=O.map((u,c)=>{let r=T(u);if(r===null)return{hasThreadPrev:!1,hasThreadNext:!1};let e=A.get(r);if(!e||e.length===0)return{hasThreadPrev:!1,hasThreadNext:!1};let m=e.indexOf(c);if(m<0)return{hasThreadPrev:!1,hasThreadNext:!1};return{hasThreadPrev:m>0,hasThreadNext:m<e.length-1}}),f=U`<div class="timeline-sentinel" ref=${L}></div>`;return U`
        <div class="timeline ${W?"reverse":"normal"}" ref=${N} onScroll=${E}>
            <div class="timeline-content">
                ${W?f:null}
                ${O.map((u,c)=>{let r=Boolean(u.data?.thread_id&&u.data.thread_id!==u.id),e=H?.has?.(u.id),m=P[c]||{};return U`
                    <${EY}
                        key=${u.id}
                        post=${u}
                        isThreadReply=${r}
                        isThreadPrev=${m.hasThreadPrev}
                        isThreadNext=${m.hasThreadNext}
                        isRemoving=${e}
                        highlightQuery=${z}
                        agentName=${wK(u.data?.agent_id,F||{})}
                        agentAvatarUrl=${IK(u.data?.agent_id,F||{})}
                        userName=${B?.name||B?.user_name}
                        userAvatarUrl=${B?.avatar_url||B?.avatarUrl||B?.avatar}
                        userAvatarBackground=${B?.avatar_background||B?.avatarBackground}
                        onClick=${()=>Z?.(u)}
                        onHashtagClick=${X}
                        onMessageRef=${G}
                        onScrollToMessage=${q}
                        onFileRef=${Q}
                        onOpenWidget=${K}
                        onDelete=${D}
                        onOpenAttachmentPreview=${V}
                    />
                `})}
                ${W?null:f}
            </div>
        </div>
    `}M0();T1();function MY(_){try{return _?.focus?.(),_?.select?.(),!0}catch($){return!1}}var w8="workspaceExplorerScale",ak=["compact","default","comfortable"],tk=new Set(ak),ek={compact:{indentPx:14},default:{indentPx:16},comfortable:{indentPx:18}};function kY(_,$="default"){if(typeof _!=="string")return $;let j=_.trim().toLowerCase();return tk.has(j)?j:$}function Lj(){if(typeof window>"u")return{width:0,isTouch:!1};let _=Number(window.innerWidth)||0,$=Boolean(window.matchMedia?.("(pointer: coarse)")?.matches),j=Boolean(window.matchMedia?.("(hover: none)")?.matches),Z=Number(globalThis.navigator?.maxTouchPoints||0)>0;return{width:_,isTouch:$||Z&&j}}function _T(_={}){let $=Math.max(0,Number(_.width)||0);if(Boolean(_.isTouch))return"comfortable";if($>0&&$<1180)return"comfortable";return"default"}function $T(_,$={}){if(Boolean($.isTouch)&&_==="compact")return"default";return _}function Jj(_={}){let $=_T(_),j=_.stored?kY(_.stored,$):$;return $T(j,_)}function TY(_){return ek[kY(_)]}T9();function jT(_){if(!_||_.kind!=="text")return!1;let $=Number(_.size);return!Number.isFinite($)||$<=262144}function Ej(_,$){let j=String(_||"").trim();if(!j||j.endsWith("/"))return!1;if(typeof $!=="function")return!1;let Z=$({path:j,mode:"edit"});if(!Z||typeof Z!=="object")return!1;return Z.id!=="editor"}function yY(_,$,j={}){let Z=j.resolvePane;if(Ej(_,Z))return!0;return jT($)}var PY=(_)=>{if(!_||!_.name)return!1;if(_.path===".")return!1;return _.name.startsWith(".")};function ZT(_){let $=String(_||"").trim();if(!$||$.endsWith("/"))return!1;return Ej($,(j)=>Q1.resolve(j))}function fY(_,$,j,Z=0,X=[]){if(!j&&PY(_))return X;if(!_)return X;if(X.push({node:_,depth:Z}),_.type==="dir"&&_.children&&$.has(_.path))for(let G of _.children)fY(G,$,j,Z+1,X);return X}function wY(_,$,j){if(!_)return"";let Z=[],X=(G)=>{if(!j&&PY(G))return;if(Z.push(G.type==="dir"?`d:${G.path}`:`f:${G.path}`),G.children&&$?.has(G.path))for(let q of G.children)X(q)};return X(_),Z.join("|")}function Tj(_,$){if(!$)return null;if(!_)return $;if(_.path!==$.path||_.type!==$.type)return $;let j=Array.isArray(_.children)?_.children:null,Z=Array.isArray($.children)?$.children:null;if(!Z)return _;let X=j?new Map(j.map((Q)=>[Q?.path,Q])):new Map,G=!j||j.length!==Z.length,q=Z.map((Q)=>{let K=Tj(X.get(Q.path),Q);if(K!==X.get(Q.path))G=!0;return K});return G?{...$,children:q}:_}function Mj(_,$,j){if(!_)return _;if(_.path===$)return Tj(_,j);if(!Array.isArray(_.children))return _;let Z=!1,X=_.children.map((G)=>{let q=Mj(G,$,j);if(q!==G)Z=!0;return q});return Z?{..._,children:X}:_}var RY=4,Aj=14,XT=16;function SY(_){if(!_)return 0;if(_.type==="file"){let Z=Math.max(0,Number(_.size)||0);return _.__bytes=Z,Z}let $=Array.isArray(_.children)?_.children:[],j=0;for(let Z of $)j+=SY(Z);return _.__bytes=j,j}function bY(_,$=0){let j=Math.max(0,Number(_?.__bytes??_?.size??0)),Z={name:_?.name||_?.path||".",path:_?.path||".",size:j,children:[]};if(!_||_.type!=="dir"||$>=RY)return Z;let X=Array.isArray(_.children)?_.children:[],G=[];for(let Q of X){let K=Math.max(0,Number(Q?.__bytes??Q?.size??0));if(K<=0)continue;if(Q.type==="dir")G.push({kind:"dir",node:Q,size:K});else G.push({kind:"file",name:Q.name,path:Q.path,size:K})}G.sort((Q,K)=>K.size-Q.size);let q=G;if(G.length>Aj){let Q=G.slice(0,Aj-1),K=G.slice(Aj-1),V=K.reduce((Y,N)=>Y+N.size,0);Q.push({kind:"other",name:`+${K.length} more`,path:`${Z.path}/[other]`,size:V}),q=Q}return Z.children=q.map((Q)=>{if(Q.kind==="dir")return bY(Q.node,$+1);return{name:Q.name,path:Q.path,size:Q.size,children:[]}}),Z}function IY(){if(typeof window>"u"||typeof document>"u")return!1;let{documentElement:_,body:$}=document,j=_?.getAttribute?.("data-theme")?.toLowerCase?.()||"";if(j==="dark")return!0;if(j==="light")return!1;if(_?.classList?.contains("dark")||$?.classList?.contains("dark"))return!0;if(_?.classList?.contains("light")||$?.classList?.contains("light"))return!1;return Boolean(window.matchMedia?.("(prefers-color-scheme: dark)")?.matches)}function gY(_,$,j){let Z=((_+Math.PI/2)*180/Math.PI+360)%360,X=j?Math.max(30,70-$*10):Math.max(34,66-$*8),G=j?Math.min(70,45+$*5):Math.min(60,42+$*4);return`hsl(${Z.toFixed(1)} ${X}% ${G}%)`}function I8(_,$,j,Z){return{x:_+j*Math.cos(Z),y:$+j*Math.sin(Z)}}function yj(_,$,j,Z,X,G){let q=Math.PI*2-0.0001,Q=G-X>q?X+q:G,K=I8(_,$,Z,X),V=I8(_,$,Z,Q),Y=I8(_,$,j,Q),N=I8(_,$,j,X),F=Q-X>Math.PI?1:0;return[`M ${K.x.toFixed(3)} ${K.y.toFixed(3)}`,`A ${Z} ${Z} 0 ${F} 1 ${V.x.toFixed(3)} ${V.y.toFixed(3)}`,`L ${Y.x.toFixed(3)} ${Y.y.toFixed(3)}`,`A ${j} ${j} 0 ${F} 0 ${N.x.toFixed(3)} ${N.y.toFixed(3)}`,"Z"].join(" ")}var uY={1:[26,46],2:[48,68],3:[70,90],4:[92,112]};function vY(_,$,j){let Z=[],X=[],G=Math.max(0,Number($)||0),q=(Q,K,V,Y)=>{let N=Array.isArray(Q?.children)?Q.children:[];if(!N.length)return;let F=Math.max(0,Number(Q.size)||0);if(F<=0)return;let B=V-K,D=K;N.forEach((W,H)=>{let z=Math.max(0,Number(W.size)||0);if(z<=0)return;let k=z/F,J=D,L=H===N.length-1?V:D+B*k;if(D=L,L-J<0.003)return;let x=uY[Y];if(x){let I=gY(J,Y,j);if(Z.push({key:W.path,path:W.path,label:W.name,size:z,color:I,depth:Y,startAngle:J,endAngle:L,innerRadius:x[0],outerRadius:x[1],d:yj(120,120,x[0],x[1],J,L)}),Y===1)X.push({key:W.path,name:W.name,size:z,pct:G>0?z/G*100:0,color:I})}if(Y<RY)q(W,J,L,Y+1)})};return q(_,-Math.PI/2,Math.PI*3/2,1),{segments:Z,legend:X}}function kj(_,$){if(!_||!$)return null;if(_.path===$)return _;let j=Array.isArray(_.children)?_.children:[];for(let Z of j){let X=kj(Z,$);if(X)return X}return null}function mY(_,$,j,Z){if(!j||j<=0)return{segments:[],legend:[]};let X=uY[1];if(!X)return{segments:[],legend:[]};let G=-Math.PI/2,q=Math.PI*3/2,Q=gY(G,1,Z),V=`${$||"."}/[files]`;return{segments:[{key:V,path:V,label:_,size:j,color:Q,depth:1,startAngle:G,endAngle:q,innerRadius:X[0],outerRadius:X[1],d:yj(120,120,X[0],X[1],G,q)}],legend:[{key:V,name:_,size:j,pct:100,color:Q}]}}function xY(_,$=!1,j=!1){if(!_)return null;let Z=SY(_),X=bY(_,0),G=X.size||Z,{segments:q,legend:Q}=vY(X,G,j);if(!q.length&&G>0){let K=mY("[files]",X.path,G,j);q=K.segments,Q=K.legend}return{root:X,totalSize:G,segments:q,legend:Q,truncated:$,isDarkTheme:j}}function GT({payload:_}){if(!_)return null;let[$,j]=C(null),[Z,X]=C(_?.root?.path||"."),[G,q]=C(()=>[_?.root?.path||"."]),[Q,K]=C(!1);b(()=>{let T=_?.root?.path||".";X(T),q([T]),j(null)},[_?.root?.path,_?.totalSize]),b(()=>{if(!Z)return;K(!0);let T=setTimeout(()=>K(!1),180);return()=>clearTimeout(T)},[Z]);let V=q0(()=>{return kj(_.root,Z)||_.root},[_?.root,Z]),Y=V?.size||_.totalSize||0,{segments:N,legend:F}=q0(()=>{let T=vY(V,Y,_.isDarkTheme);if(T.segments.length>0)return T;if(Y<=0)return T;let y=V?.children?.length?"Total":"[files]";return mY(y,V?.path||_?.root?.path||".",Y,_.isDarkTheme)},[V,Y,_.isDarkTheme,_?.root?.path]),[B,D]=C(N),W=g(new Map),H=g(0);b(()=>{let T=W.current,y=new Map(N.map((u)=>[u.key,u])),A=performance.now(),P=220,f=(u)=>{let c=Math.min(1,(u-A)/220),r=c*(2-c),e=N.map((m)=>{let H0=T.get(m.key)||{startAngle:m.startAngle,endAngle:m.startAngle,innerRadius:m.innerRadius,outerRadius:m.innerRadius},X0=($0,K0)=>$0+(K0-$0)*r,j0=X0(H0.startAngle,m.startAngle),Q0=X0(H0.endAngle,m.endAngle),F0=X0(H0.innerRadius,m.innerRadius),h=X0(H0.outerRadius,m.outerRadius);return{...m,d:yj(120,120,F0,h,j0,Q0)}});if(D(e),c<1)H.current=requestAnimationFrame(f)};if(H.current)cancelAnimationFrame(H.current);return H.current=requestAnimationFrame(f),W.current=y,()=>{if(H.current)cancelAnimationFrame(H.current)}},[N]);let z=B.length?B:N,k=Y>0?t1(Y):"0 B",J=V?.name||"",x=(J&&J!=="."?J:"Total")||"Total",I=k,E=G.length>1,M=(T)=>{if(!T?.path)return;let y=kj(_.root,T.path);if(!y||!Array.isArray(y.children)||y.children.length===0)return;q((A)=>[...A,y.path]),X(y.path),j(null)},O=()=>{if(!E)return;q((T)=>{let y=T.slice(0,-1);return X(y[y.length-1]||_?.root?.path||"."),y}),j(null)};return U`
        <div class="workspace-folder-starburst">
            <svg viewBox="0 0 240 240" class=${`workspace-folder-starburst-svg${Q?" is-zooming":""}`} role="img"
                aria-label=${`Folder sizes for ${V?.path||_?.root?.path||"."}`}
                data-segments=${z.length}
                data-base-size=${Y}>
                ${z.map((T)=>U`
                    <path
                        key=${T.key}
                        d=${T.d}
                        fill=${T.color}
                        stroke="var(--bg-primary)"
                        stroke-width="1"
                        class=${`workspace-folder-starburst-segment${$?.key===T.key?" is-hovered":""}`}
                        onMouseEnter=${()=>j(T)}
                        onMouseLeave=${()=>j(null)}
                        onTouchStart=${()=>j(T)}
                        onTouchEnd=${()=>j(null)}
                        onClick=${()=>M(T)}
                    >
                        <title>${T.label} — ${t1(T.size)}</title>
                    </path>
                `)}
                <g
                    class=${`workspace-folder-starburst-center-hit${E?" is-drill":""}`}
                    onClick=${O}
                    role="button"
                    aria-label="Zoom out"
                >
                    <circle
                        cx="120"
                        cy="120"
                        r="24"
                        fill="var(--bg-secondary)"
                        stroke="var(--border-color)"
                        stroke-width="1"
                        class="workspace-folder-starburst-center"
                    />
                    <text x="120" y="114" text-anchor="middle" class="workspace-folder-starburst-total-label">${x}</text>
                    <text x="120" y="130" text-anchor="middle" class="workspace-folder-starburst-total-value">${I}</text>
                </g>
            </svg>
            ${F.length>0&&U`
                <div class="workspace-folder-starburst-legend">
                    ${F.slice(0,8).map((T)=>U`
                        <div key=${T.key} class="workspace-folder-starburst-legend-item">
                            <span class="workspace-folder-starburst-swatch" style=${`background:${T.color}`}></span>
                            <span class="workspace-folder-starburst-name" title=${T.name}>${T.name}</span>
                            <span class="workspace-folder-starburst-size">${t1(T.size)}</span>
                            <span class="workspace-folder-starburst-pct">${T.pct.toFixed(1)}%</span>
                        </div>
                    `)}
                </div>
            `}
            ${_.truncated&&U`
                <div class="workspace-folder-starburst-note">Preview is truncated by tree depth/entry limits.</div>
            `}
        </div>
    `}function CY(_){if(typeof document>"u"||!_)return;let $=document.createElement("a");$.href=_,$.setAttribute("download",""),$.rel="noopener",$.style.display="none",document.body.appendChild($),$.click(),$.remove()}function cY(_){switch(_?.state){case"indexing":return"Indexing workspace…";case"ready":return"Workspace index ready";case"stale":return"Workspace index may be stale";case"failed":return"Workspace index failed";case"never_indexed":return"Workspace index not built yet";default:return"Checking workspace index…"}}function qT(_){if(!_)return"Workspace index status";let $=[cY(_)];if(_.last_indexed_at)$.push(`Last indexed: ${_.last_indexed_at}`);if(typeof _.indexed_file_count==="number")$.push(`Indexed files: ${_.indexed_file_count}`);if(Array.isArray(_.roots)&&_.roots.length)$.push(`Roots: ${_.roots.join(", ")}`);if(_.last_error)$.push(`Error: ${_.last_error}`);return $.join(`
`)}function QT(_){let $=_?.target;if($&&typeof $==="object")return $;return $?.parentElement||null}function VT(_){return Boolean(_?.closest?.(".workspace-node-icon, .workspace-label-text"))}function KT(_,$=null){let j=QT(_),Z=j?.closest?.(".workspace-row");if(!Z)return null;let X=Z.dataset.type,G=Z.dataset.path;if(!G||G===".")return null;if($===G)return null;let q=_?.touches?.[0];if(!q)return null;return{type:X,path:G,dragPath:VT(j)?G:null,startX:q.clientX,startY:q.clientY}}function hY({onFileSelect:_,onFolderSelect:$,visible:j=!0,active:Z=void 0,onOpenEditor:X,onOpenTerminalTab:G,onOpenVncTab:q,onToggleTerminal:Q,terminalVisible:K=!1}){let[V,Y]=C(null),[N,F]=C(new Set(["."])),[B,D]=C(null),[W,H]=C(null),[z,k]=C(""),[J,L]=C(null),[,x]=C(null),[I,E]=C(!0),[M,O]=C(!1),[T,y]=C(null),[A,P]=C(()=>W$("workspaceShowHidden",!1)),[f,u]=C(!1),[c,r]=C(null),[e,m]=C(null),[_0,H0]=C(null),[X0,j0]=C(!1),[Q0,F0]=C(null),[h,$0]=C(null),[K0,L0]=C(null),[a,G0]=C(!1),[O0,P0]=C(()=>M5()),[p0,g0]=C(()=>IY()),[X1,l0]=C(()=>Jj({stored:J_(w8),...Lj()})),[a0,f0]=C(!1),i0=Math.max(15000,(Number(O0?.refreshIntervalSec)||60)*1000),m0=Math.max(0,Number(O0?.folderPreviewDepth)||0),e0=g(N),s0=g(""),D1=g(null),G1=g(0),c0=g(new Set),J0=g(null),V1=g(null),o0=g(new Map),H1=g(_),z0=g($),b0=g(X),x0=g(null),n0=g(null),E1=g(null),Y1=g(null),z1=g(null),U1=g(null),A1=g("."),x1=g(0),f1=g({path:null,dragging:!1,startX:0,startY:0}),O1=g({path:null,dragging:!1,startX:0,startY:0}),s1=g({path:null,timer:0}),R1=g(!1),V0=g(0),v=g(new Map),n=g(null),s=g(null),Z0=g(null),U0=g(null),T0=g(null),A0=g(null),k0=g(A),y0=g(j),h0=g(Z??j),S0=g(0),d0=g(_0),_1=g(f),I0=g(c),w0=g(null),W1=g({x:0,y:0}),$1=g(0),d=g(null),B0=g(B),r0=g(W),Z1=g(null),S1=g(J);H1.current=_,z0.current=$,b0.current=X,b(()=>{e0.current=N},[N]),b(()=>{k0.current=A},[A]),b(()=>{y0.current=j},[j]),b(()=>{h0.current=Z??j},[Z,j]),b(()=>{d0.current=_0},[_0]);let z_=R(()=>{if(!x1.current)return;clearTimeout(x1.current),x1.current=0},[]);b(()=>()=>z_(),[z_]),b(()=>{if(typeof window>"u")return;let S=()=>{l0(Jj({stored:J_(w8),...Lj()}))};S();let p=()=>S(),o=()=>S(),t=(W0)=>{if(!W0||W0.key===null||W0.key===w8)S()};window.addEventListener("resize",p),window.addEventListener("focus",o),window.addEventListener("storage",t);let D0=window.matchMedia?.("(pointer: coarse)"),Y0=window.matchMedia?.("(hover: none)"),E0=(W0,t0)=>{if(!W0)return;if(W0.addEventListener)W0.addEventListener("change",t0);else if(W0.addListener)W0.addListener(t0)},C0=(W0,t0)=>{if(!W0)return;if(W0.removeEventListener)W0.removeEventListener("change",t0);else if(W0.removeListener)W0.removeListener(t0)};return E0(D0,p),E0(Y0,p),()=>{window.removeEventListener("resize",p),window.removeEventListener("focus",o),window.removeEventListener("storage",t),C0(D0,p),C0(Y0,p)}},[]),b(()=>{if(typeof window>"u")return;let S=()=>{P0(M5())},p=(D0)=>{if(!D0||D0.key===null||D0.key===$8||D0.key===j8)S()},o=()=>S(),t=(D0)=>{let Y0=D0?.detail?.settings;if(Y0&&typeof Y0==="object"){P0({refreshIntervalSec:Number(Y0.refreshIntervalSec)||60,folderPreviewDepth:Math.max(0,Number(Y0.folderPreviewDepth)||0)});return}S()};return window.addEventListener("focus",o),window.addEventListener("storage",p),window.addEventListener(_8,t),()=>{window.removeEventListener("focus",o),window.removeEventListener("storage",p),window.removeEventListener(_8,t)}},[]),b(()=>{let S=(p)=>{let o=p?.detail?.path;if(!o)return;let t=o.split("/"),D0=[];for(let Y0=1;Y0<t.length;Y0++)D0.push(t.slice(0,Y0).join("/"));if(D0.length)F((Y0)=>{let E0=new Set(Y0);E0.add(".");for(let C0 of D0)E0.add(C0);return E0});D(o),requestAnimationFrame(()=>{let Y0=document.querySelector(`[data-path="${CSS.escape(o)}"]`);if(Y0)Y0.scrollIntoView({block:"nearest",behavior:"smooth"})})};return window.addEventListener("workspace-reveal-path",S),()=>window.removeEventListener("workspace-reveal-path",S)},[]),b(()=>{_1.current=f},[f]),b(()=>{I0.current=c},[c]),b(()=>{B0.current=B},[B]),b(()=>{r0.current=W},[W]),b(()=>{S1.current=J},[J]),b(()=>{if(typeof window>"u"||typeof document>"u")return;let S=()=>g0(IY());S();let p=window.matchMedia?.("(prefers-color-scheme: dark)"),o=()=>S();if(p?.addEventListener)p.addEventListener("change",o);else if(p?.addListener)p.addListener(o);let t=typeof MutationObserver<"u"?new MutationObserver(()=>S()):null;if(t?.observe(document.documentElement,{attributes:!0,attributeFilter:["class","data-theme"]}),document.body)t?.observe(document.body,{attributes:!0,attributeFilter:["class","data-theme"]});return()=>{if(p?.removeEventListener)p.removeEventListener("change",o);else if(p?.removeListener)p.removeListener(o);t?.disconnect()}},[]),b(()=>{if(!W)return;let S=z1.current;if(!S)return;let p=requestAnimationFrame(()=>{MY(S)});return()=>cancelAnimationFrame(p)},[W]),b(()=>{if(!a0)return;let S=(o)=>{let t=o?.target;if(!(t instanceof Element))return;if(T0.current?.contains(t))return;if(A0.current?.contains(t))return;f0(!1)},p=(o)=>{if(o?.key==="Escape")f0(!1),A0.current?.focus?.()};return document.addEventListener("mousedown",S),document.addEventListener("touchstart",S,{passive:!0}),document.addEventListener("keydown",p),()=>{document.removeEventListener("mousedown",S),document.removeEventListener("touchstart",S),document.removeEventListener("keydown",p)}},[a0]);let u1=async(S,p={})=>{let o=Boolean(p?.autoOpen),t=String(S||"").trim();O(!0),L(null),x(null);try{let D0=await a7(t,20000);if(o&&t&&yY(t,D0,{resolvePane:(Y0)=>Q1.resolve(Y0)}))return b0.current?.(t,D0),D0;return L(D0),D0}catch(D0){let Y0={error:D0.message||"Failed to load preview"};return L(Y0),Y0}finally{O(!1)}};x0.current=u1;let A_=R(async()=>{try{let S=await i7("all");return L0(S),S}catch(S){return console.warn("[workspace-explorer] Failed to load workspace index status:",S),null}},[]);V1.current=A_;let C1=R(()=>{V1.current?.()},[]),M1=async()=>{if(!y0.current)return;try{let S=await U6("",1,k0.current),p=wY(S.root,e0.current,k0.current);if(p===s0.current){E(!1);return}if(s0.current=p,D1.current=S.root,!G1.current)G1.current=requestAnimationFrame(()=>{G1.current=0,Y((o)=>Tj(o,D1.current)),E(!1)})}catch(S){y(S.message||"Failed to load workspace"),E(!1)}},M_=async(S)=>{if(!S)return;if(c0.current.has(S))return;c0.current.add(S);try{let p=await U6(S,1,k0.current);Y((o)=>Mj(o,S,p.root))}catch(p){y(p.message||"Failed to load workspace")}finally{c0.current.delete(S)}};n0.current=M_;let L1=R(()=>{let S=B;if(!S)return".";let p=o0.current?.get(S);if(p&&p.type==="dir")return p.path;if(S==="."||!S.includes("/"))return".";let o=S.split("/");return o.pop(),o.join("/")||"."},[B]),k1=R((S)=>{let p=S?.closest?.(".workspace-row");if(!p)return null;let o=p.dataset.path,t=p.dataset.type;if(!o)return null;if(t==="dir")return o;if(o.includes("/")){let D0=o.split("/");return D0.pop(),D0.join("/")||"."}return"."},[]),k_=R((S)=>{return k1(S?.target||null)},[k1]),p1=R((S)=>{d0.current=S,H0(S)},[]),a1=R(()=>{let S=s1.current;if(S?.timer)clearTimeout(S.timer);s1.current={path:null,timer:0}},[]),e1=R((S)=>{if(!S||S==="."){a1();return}let p=o0.current?.get(S);if(!p||p.type!=="dir"){a1();return}if(e0.current?.has(S)){a1();return}if(s1.current?.path===S)return;a1();let o=setTimeout(()=>{s1.current={path:null,timer:0},n0.current?.(S),F((t)=>{let D0=new Set(t);return D0.add(S),D0})},600);s1.current={path:S,timer:o}},[a1]),F1=R((S,p)=>{if(W1.current={x:S,y:p},$1.current)return;$1.current=requestAnimationFrame(()=>{$1.current=0;let o=w0.current;if(!o)return;let t=W1.current;o.style.transform=`translate(${t.x+12}px, ${t.y+12}px)`})},[]),x_=R((S)=>{if(!S)return;let o=(o0.current?.get(S)?.name||S.split("/").pop()||S).trim();if(!o)return;m({path:S,label:o})},[]),W_=R(()=>{if(m(null),$1.current)cancelAnimationFrame($1.current),$1.current=0;if(w0.current)w0.current.style.transform="translate(-9999px, -9999px)"},[]),m_=R((S)=>{if(!S)return".";let p=o0.current?.get(S);if(p&&p.type==="dir")return p.path;if(S==="."||!S.includes("/"))return".";let o=S.split("/");return o.pop(),o.join("/")||"."},[]),T_=R(()=>{H(null),k("")},[]),j$=R((S)=>{if(!S)return;let o=(o0.current?.get(S)?.name||S.split("/").pop()||S).trim();if(!o||S===".")return;H(S),k(o)},[]),p4=R(async()=>{let S=r0.current;if(!S)return;let p=(z||"").trim();if(!p){T_();return}let o=o0.current?.get(S),t=(o?.name||S.split("/").pop()||S).trim();if(p===t){T_();return}try{let Y0=(await _9(S,p))?.path||S,E0=S.includes("/")?S.split("/").slice(0,-1).join("/")||".":".";if(T_(),y(null),window.dispatchEvent(new CustomEvent("workspace-file-renamed",{detail:{oldPath:S,newPath:Y0,type:o?.type||"file"}})),o?.type==="dir")F((C0)=>{let W0=new Set;for(let t0 of C0)if(t0===S)W0.add(Y0);else if(t0.startsWith(`${S}/`))W0.add(`${Y0}${t0.slice(S.length)}`);else W0.add(t0);return W0});if(D(Y0),o?.type==="dir")L(null),O(!1),x(null);else x0.current?.(Y0);n0.current?.(E0),C1()}catch(D0){y(D0?.message||"Failed to rename file")}},[T_,z,C1]),T$=R(async(S)=>{let t=S||".";for(let D0=0;D0<50;D0+=1){let E0=`untitled${D0===0?"":`-${D0}`}.md`;try{let W0=(await e7(t,E0,""))?.path||(t==="."?E0:`${t}/${E0}`);if(t&&t!==".")F((t0)=>new Set([...t0,t]));D(W0),y(null),n0.current?.(t),x0.current?.(W0),C1();return}catch(C0){if(C0?.status===409||C0?.code==="file_exists")continue;y(C0?.message||"Failed to create file");return}}y("Failed to create file (untitled name already in use).")},[]),__=R((S)=>{if(S?.stopPropagation?.(),X0)return;let p=m_(B0.current);T$(p)},[X0,m_,T$]);b(()=>{if(typeof window>"u")return;let S=(p)=>{let o=p?.detail?.updates||[];if(!Array.isArray(o)||o.length===0)return;Y((C0)=>{let W0=C0;for(let t0 of o){if(!t0?.root)continue;if(!W0||t0.path==="."||!t0.path)W0=t0.root;else W0=Mj(W0,t0.path,t0.root)}if(W0)s0.current=wY(W0,e0.current,k0.current);return E(!1),W0});let t=B0.current;if(Boolean(t)&&o.some((C0)=>{let W0=C0?.path||"";if(!W0||W0===".")return!0;return t===W0||t.startsWith(`${W0}/`)||W0.startsWith(`${t}/`)}))v.current.clear();if(C1(),!t||!S1.current)return;let Y0=o0.current?.get(t);if(Y0&&Y0.type==="dir")return;if(o.some((C0)=>{let W0=C0?.path||"";if(!W0||W0===".")return!0;return t===W0||t.startsWith(`${W0}/`)}))x0.current?.(t)};return window.addEventListener("workspace-update",S),()=>window.removeEventListener("workspace-update",S)},[]),J0.current=M1;let c1=g(()=>{if(typeof window>"u")return;let S=window.matchMedia("(min-width: 1024px) and (orientation: landscape)"),p=h0.current??y0.current,o=document.visibilityState!=="hidden"&&(p||S.matches&&y0.current);D6(o,k0.current).catch((t)=>{console.debug("[workspace-explorer] Workspace visibility ping failed.",t,{visible:o,showHidden:k0.current})})}).current,y_=g(0),H_=g(()=>{if(y_.current)clearTimeout(y_.current);y_.current=setTimeout(()=>{y_.current=0,c1()},250)}).current;b(()=>{if(y0.current)J0.current?.(),V1.current?.();H_()},[j,Z]),b(()=>{J0.current(),V1.current?.();let S=setInterval(()=>{J0.current(),V1.current?.()},i0);return()=>clearInterval(S)},[i0]),b(()=>{c1();let S=J4("previewHeight",null),p=Number.isFinite(S)?Math.min(Math.max(S,80),600):280;if(V0.current=p,E1.current)E1.current.style.setProperty("--preview-height",`${p}px`);let o=window.matchMedia("(min-width: 1024px) and (orientation: landscape)"),t=()=>H_();if(o.addEventListener)o.addEventListener("change",t);else if(o.addListener)o.addListener(t);return document.addEventListener("visibilitychange",t),()=>{if(G1.current)cancelAnimationFrame(G1.current),G1.current=0;if(o.removeEventListener)o.removeEventListener("change",t);else if(o.removeListener)o.removeListener(t);if(document.removeEventListener("visibilitychange",t),y_.current)clearTimeout(y_.current),y_.current=0;D6(!1,k0.current).catch((D0)=>{console.debug("[workspace-explorer] Workspace visibility teardown ping failed.",D0,{showHidden:k0.current})})}},[]);let j_=q0(()=>fY(V,N,A),[V,N,A]),y$=q0(()=>new Map(j_.map((S)=>[S.node.path,S.node])),[j_]),w$=q0(()=>TY(X1),[X1]);o0.current=y$;let y1=(B?o0.current.get(B):null)?.type==="dir";b(()=>{if(!B||!y1){$0(null),n.current=null,s.current=null;return}if(m0<=0){$0({loading:!1,error:null,payload:null,disabled:!0}),n.current=null,s.current=null;return}let S=B,p=`${A?"hidden":"visible"}:${m0}:${B}`,o=v.current,t=o.get(p);if(t?.root){o.delete(p),o.set(p,t);let E0=xY(t.root,Boolean(t.truncated),p0);if(E0)n.current=E0,s.current=B,$0({loading:!1,error:null,payload:E0,disabled:!1});return}let D0=n.current,Y0=s.current;$0({loading:!0,error:null,payload:Y0===B?D0:null,disabled:!1}),U6(B,m0,A).then((E0)=>{if(B0.current!==S)return;let C0={root:E0?.root,truncated:Boolean(E0?.truncated)};o.delete(p),o.set(p,C0);while(o.size>XT){let t0=o.keys().next().value;if(!t0)break;o.delete(t0)}let W0=xY(C0.root,C0.truncated,p0);n.current=W0,s.current=B,$0({loading:!1,error:null,payload:W0,disabled:!1})}).catch((E0)=>{if(B0.current!==S)return;$0({loading:!1,error:E0?.message||"Failed to load folder size chart",payload:Y0===B?D0:null,disabled:!1})})},[B,y1,A,p0,m0]);let Y_=Boolean(J&&J.kind==="text"&&!y1&&(!J.size||J.size<=262144)),I$=Y_?"Open in editor":J?.size>262144?"File too large to edit":"File is not editable",r4=Boolean(B&&!y1&&ZT(B)),X$=Boolean(B&&B!=="."),n4=Boolean(B&&!y1),d4=Boolean(B&&!y1),x$=B&&y1?v2(B,A):null,C$=cY(K0),c_=qT(K0),h_=K0?.state||"never_indexed",o4=h_!=="ready",N_=R(()=>f0(!1),[]),b1=R(async(S)=>{N_();try{await S?.()}catch(p){console.warn("[workspace-explorer] Header menu action failed:",p)}},[N_]),i4=R(async(S)=>{S?.stopPropagation?.(),G0(!0),L0((p)=>({scope:"all",last_indexed_at:p?.last_indexed_at||null,last_error:null,indexed_file_count:p?.indexed_file_count||0,roots:p?.roots||[],updated_at:p?.updated_at||null,state:"indexing"}));try{let p=await s7("all");L0(p),y(null),s0.current="",J0.current?.()}catch(p){let o=p?.message||"Failed to reindex workspace";L0((t)=>({scope:"all",last_indexed_at:t?.last_indexed_at||null,last_error:o,indexed_file_count:t?.indexed_file_count||0,roots:t?.roots||[],updated_at:t?.updated_at||null,state:"failed"})),y(o)}finally{G0(!1)}},[]);b(()=>{let S=Z0.current;if(U0.current)U0.current.dispose(),U0.current=null;if(!S)return;if(S.innerHTML="",!B||y1||!J||J.error)return;let p={path:B,content:typeof J.text==="string"?J.text:void 0,mtime:J.mtime,size:J.size,preview:J,mode:"view"},o=Q1.resolve(p)||Q1.get("workspace-preview-default");if(!o)return;let t=o.mount(S,p);return U0.current=t,()=>{if(U0.current===t)t.dispose(),U0.current=null;S.innerHTML=""}},[B,y1,J]);let C_=(S)=>{let p=S?.target;if(p instanceof Element)return p;return p?.parentElement||null},P$=(S)=>{return Boolean(S?.closest?.(".workspace-node-icon, .workspace-label-text"))},s4=(S)=>{if(!S)return!1;if(S.closest?.('input, textarea, [contenteditable="true"]'))return!0;return Boolean(S.isContentEditable)},v5=g((S)=>{let p=C_(S),o=p?.closest?.("[data-path]");if(!o)return;let t=o.dataset.path;if(!t||t===".")return;let D0=Boolean(p?.closest?.("button"))||Boolean(p?.closest?.("a"))||Boolean(p?.closest?.("input")),Y0=Boolean(p?.closest?.(".workspace-caret"));if(D0||Y0)return;if(r0.current===t)return;j$(t)}).current,m5=g((S)=>{if(R1.current){R1.current=!1;return}let p=C_(S),o=p?.closest?.("[data-path]");if(Y1.current?.focus?.(),!o)return;let t=o.dataset.path,D0=o.dataset.type,Y0=Boolean(p?.closest?.(".workspace-caret")),E0=Boolean(p?.closest?.("button"))||Boolean(p?.closest?.("a"))||Boolean(p?.closest?.("input")),C0=B0.current===t,W0=r0.current;if(W0){if(W0===t)return;T_()}if(D0==="dir"){if(Z1.current=null,D(t),L(null),x(null),O(!1),!e0.current.has(t))n0.current?.(t);if(C0&&!Y0)return;F((r1)=>{let Z_=new Set(r1);if(Z_.has(t))Z_.delete(t);else Z_.add(t);return Z_})}else{Z1.current=null,D(t);let t0=o0.current.get(t);if(t0)H1.current?.(t0.path,t0);if(!E0&&!Y0)x0.current?.(t)}}).current,V4=g(()=>{s0.current="",J0.current(),V1.current?.(),Array.from(e0.current||[]).filter((p)=>p&&p!==".").forEach((p)=>n0.current?.(p))}).current,f$=g(()=>{Z1.current=null,D(null),L(null),x(null),O(!1)}).current,a4=g(()=>{P((S)=>{let p=!S;if(typeof window<"u")K1("workspaceShowHidden",String(p));return k0.current=p,D6(!0,p).catch((t)=>{console.debug("[workspace-explorer] Workspace visibility refresh after toggling hidden files failed.",t,{showHidden:p})}),s0.current="",J0.current?.(),Array.from(e0.current||[]).filter((t)=>t&&t!==".").forEach((t)=>n0.current?.(t)),p})}).current,t4=g((S)=>{if(C_(S)?.closest?.("[data-path]"))return;f$()}).current,B_=R(async(S)=>{if(!S)return;let p=S.split("/").pop()||S;if(!window.confirm(`Delete "${p}"? This cannot be undone.`))return;try{await j9(S);let t=S.includes("/")?S.split("/").slice(0,-1).join("/")||".":".";if(B0.current===S)f$();n0.current?.(t),y(null),C1()}catch(t){L((D0)=>({...D0||{},error:t.message||"Failed to delete file"}))}},[f$]),R$=R((S)=>{let p=Y1.current;if(!p||!S||typeof CSS>"u"||typeof CSS.escape!=="function")return;p.querySelector(`[data-path="${CSS.escape(S)}"]`)?.scrollIntoView?.({block:"nearest"})},[]),K4=R((S)=>{let p=C_(S);if(r0.current||s4(p))return;let o=j_;if(!o||o.length===0)return;let t=B?o.findIndex((D0)=>D0.node.path===B):-1;if(S.key==="ArrowDown"){S.preventDefault();let D0=Math.min(t+1,o.length-1),Y0=o[D0];if(!Y0)return;if(D(Y0.node.path),Y0.node.type!=="dir")H1.current?.(Y0.node.path,Y0.node),x0.current?.(Y0.node.path);else L(null),O(!1),x(null);R$(Y0.node.path);return}if(S.key==="ArrowUp"){S.preventDefault();let D0=t<=0?0:t-1,Y0=o[D0];if(!Y0)return;if(D(Y0.node.path),Y0.node.type!=="dir")H1.current?.(Y0.node.path,Y0.node),x0.current?.(Y0.node.path);else L(null),O(!1),x(null);R$(Y0.node.path);return}if(S.key==="ArrowRight"&&t>=0){let D0=o[t];if(D0?.node?.type==="dir"&&!N.has(D0.node.path))S.preventDefault(),n0.current?.(D0.node.path),F((Y0)=>new Set([...Y0,D0.node.path]));return}if(S.key==="ArrowLeft"&&t>=0){let D0=o[t];if(D0?.node?.type==="dir"&&N.has(D0.node.path))S.preventDefault(),F((Y0)=>{let E0=new Set(Y0);return E0.delete(D0.node.path),E0});return}if(S.key==="Enter"&&t>=0){S.preventDefault();let D0=o[t];if(!D0)return;let Y0=D0.node.path;if(D0.node.type==="dir"){if(!e0.current.has(Y0))n0.current?.(Y0);F((C0)=>{let W0=new Set(C0);if(W0.has(Y0))W0.delete(Y0);else W0.add(Y0);return W0}),L(null),x(null),O(!1)}else H1.current?.(Y0,D0.node),x0.current?.(Y0);return}if((S.key==="Delete"||S.key==="Backspace")&&t>=0){let D0=o[t];if(!D0||D0.node.type==="dir")return;S.preventDefault(),B_(D0.node.path);return}if(S.key==="Escape")S.preventDefault(),f$()},[f$,B_,N,j_,R$,B]),Y4=R((S)=>{let p=KT(S,r0.current);if(!p)return;f1.current={path:p.dragPath,dragging:!1,startX:p.startX,startY:p.startY}},[]),P_=R(()=>{let S=f1.current;if(S?.dragging&&S.path){let p=d0.current||L1(),o=d.current;if(typeof o==="function")o(S.path,p)}f1.current={path:null,dragging:!1,startX:0,startY:0},S0.current=0,u(!1),r(null),p1(null),a1(),W_()},[L1,W_,p1,a1]),O_=R((S)=>{let p=f1.current,o=S?.touches?.[0];if(!o||!p?.path)return;let t=Math.abs(o.clientX-p.startX),D0=Math.abs(o.clientY-p.startY),Y0=t>8||D0>8;if(!p.dragging&&Y0)p.dragging=!0,u(!0),r("move"),x_(p.path);if(p.dragging){S.preventDefault(),F1(o.clientX,o.clientY);let E0=document.elementFromPoint(o.clientX,o.clientY),C0=k1(E0)||L1();if(d0.current!==C0)p1(C0);e1(C0)}},[k1,L1,x_,F1,p1,e1]),c5=g((S)=>{S.preventDefault();let p=E1.current;if(!p)return;let o=S.clientY,t=V0.current||280,D0=S.currentTarget;D0.classList.add("dragging"),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let Y0=o,E0=(W0)=>{Y0=W0.clientY;let t0=p.clientHeight-80,r1=Math.min(Math.max(t-(W0.clientY-o),80),t0);p.style.setProperty("--preview-height",`${r1}px`),V0.current=r1},C0=()=>{let W0=p.clientHeight-80,t0=Math.min(Math.max(t-(Y0-o),80),W0);V0.current=t0,D0.classList.remove("dragging"),document.body.style.cursor="",document.body.style.userSelect="",K1("previewHeight",String(Math.round(t0))),document.removeEventListener("mousemove",E0),document.removeEventListener("mouseup",C0)};document.addEventListener("mousemove",E0),document.addEventListener("mouseup",C0)}).current,N4=g((S)=>{S.preventDefault();let p=E1.current;if(!p)return;let o=S.touches[0];if(!o)return;let t=o.clientY,D0=V0.current||280,Y0=S.currentTarget;Y0.classList.add("dragging"),document.body.style.userSelect="none";let E0=(W0)=>{let t0=W0.touches[0];if(!t0)return;W0.preventDefault();let r1=p.clientHeight-80,Z_=Math.min(Math.max(D0-(t0.clientY-t),80),r1);p.style.setProperty("--preview-height",`${Z_}px`),V0.current=Z_},C0=()=>{Y0.classList.remove("dragging"),document.body.style.userSelect="",K1("previewHeight",String(Math.round(V0.current||D0))),document.removeEventListener("touchmove",E0),document.removeEventListener("touchend",C0),document.removeEventListener("touchcancel",C0)};document.addEventListener("touchmove",E0,{passive:!1}),document.addEventListener("touchend",C0),document.addEventListener("touchcancel",C0)}).current,G$=R((S=B)=>{if(!S)return;CY(u2(S))},[B]),n1=async()=>{if(!B||y1)return;await B_(B)},S$=(S)=>{return Array.from(S?.dataTransfer?.types||[]).includes("Files")},e4=R((S)=>{if(!S$(S))return;if(S.preventDefault(),S0.current+=1,!_1.current)u(!0);r("upload");let p=k_(S)||L1();p1(p),e1(p)},[L1,k_,p1,e1]),q$=R((S)=>{if(!S$(S))return;if(S.preventDefault(),S.dataTransfer)S.dataTransfer.dropEffect="copy";if(!_1.current)u(!0);if(I0.current!=="upload")r("upload");let p=k_(S)||L1();if(d0.current!==p)p1(p);e1(p)},[L1,k_,p1,e1]),r6=R((S)=>{if(!S$(S))return;if(S.preventDefault(),S0.current=Math.max(0,S0.current-1),S0.current===0)u(!1),r(null),p1(null),a1()},[p1,a1]),v1=R(async(S,p=".")=>{let o=Array.from(S||[]);if(o.length===0)return;let t=p&&p!==""?p:".",D0=t!=="."?t:"workspace root";z_(),j0(!0),F0({current:0,total:o.length,name:"",percent:0,done:!1,error:null});try{let Y0=null;for(let E0=0;E0<o.length;E0++){let C0=o[E0],W0=C0?.name||`file ${E0+1}`;F0((r1)=>({...r1,current:E0+1,name:W0,percent:0}));let t0=(r1)=>F0((Z_)=>({...Z_,percent:r1.percent}));try{Y0=await g2(C0,t,{onProgress:t0})}catch(r1){let Z_=r1?.status,N$=r1?.code;if(Z_===409||N$==="file_exists"){if(!window.confirm(`"${W0}" already exists in ${D0}. Overwrite?`))continue;Y0=await g2(C0,t,{overwrite:!0,onProgress:t0})}else throw r1}}if(Y0?.path)Z1.current=Y0.path,D(Y0.path),x0.current?.(Y0.path);n0.current?.(t),C1(),F0((E0)=>({...E0,done:!0})),z_(),x1.current=window.setTimeout(()=>{x1.current=0,F0(null)},1500)}catch(Y0){y(Y0.message||"Failed to upload file"),F0((E0)=>E0?{...E0,error:Y0.message||"Upload failed"}:null),z_(),x1.current=window.setTimeout(()=>{x1.current=0,F0(null)},4000)}finally{j0(!1)}},[z_]),G3=R(async(S,p)=>{if(!S)return;let o=o0.current?.get(S);if(!o)return;let t=p&&p!==""?p:".",D0=S.includes("/")?S.split("/").slice(0,-1).join("/")||".":".";if(t===D0)return;try{let E0=(await $9(S,t))?.path||S;if(o.type==="dir")F((C0)=>{let W0=new Set;for(let t0 of C0)if(t0===S)W0.add(E0);else if(t0.startsWith(`${S}/`))W0.add(`${E0}${t0.slice(S.length)}`);else W0.add(t0);return W0});if(D(E0),o.type==="dir")L(null),O(!1),x(null);else x0.current?.(E0);n0.current?.(D0),n0.current?.(t),C1()}catch(Y0){y(Y0?.message||"Failed to move entry")}},[]);d.current=G3;let q3=R(async(S)=>{if(!S$(S))return;S.preventDefault(),S0.current=0,u(!1),r(null),H0(null),a1();let p=Array.from(S?.dataTransfer?.files||[]);if(p.length===0)return;let o=d0.current||k_(S)||L1();await v1(p,o)},[L1,k_,v1]),f_=R((S)=>{if(S?.stopPropagation?.(),X0)return;let p=S?.currentTarget?.dataset?.uploadTarget||".";A1.current=p,U1.current?.click()},[X0]),B4=R((S)=>{S?.preventDefault?.(),S?.stopPropagation?.();let p=S?.currentTarget?.dataset?.folderHintTarget||B0.current||".";if(!p)return;z0.current?.(p,o0.current.get(p))},[]),b$=R(()=>{if(X0)return;let S=B0.current,p=S?o0.current?.get(S):null;A1.current=p?.type==="dir"?p.path:".",U1.current?.click()},[X0]),g$=R(()=>{b1(()=>__(null))},[b1,__]),u$=R(()=>{b1(()=>b$())},[b1,b$]),_5=R(()=>{b1(()=>V4())},[b1,V4]),Q$=R(()=>{b1(()=>a4())},[b1,a4]),V$=R(()=>{if(!B||!r4)return;b1(()=>b0.current?.(B,J))},[b1,B,r4,J]),F4=R(()=>{if(!B||!Y_)return;b1(()=>b0.current?.(B,J))},[b1,B,Y_,J]),U4=R(()=>{if(!B||B===".")return;b1(()=>j$(B))},[b1,B,j$]),K$=R(()=>{if(!B||y1)return;b1(()=>n1())},[b1,B,y1,n1]),n6=R(()=>{if(!B||y1)return;b1(()=>G$())},[b1,B,y1,G$]),Y$=R(()=>{if(!x$)return;N_(),CY(x$)},[N_,x$]),d6=R(()=>{N_(),G?.()},[N_,G]),h5=R(()=>{N_(),q?.()},[N_,q]),l5=R(()=>{N_(),Q?.()},[N_,Q]),p5=R((S)=>{if(!S||S.button!==0)return;let p=S.currentTarget;if(!p||!p.dataset)return;let o=p.dataset.path;if(!o||o===".")return;if(r0.current===o)return;let t=C_(S);if(t?.closest?.("button, a, input, .workspace-caret"))return;if(!P$(t))return;S.preventDefault(),O1.current={path:o,dragging:!1,startX:S.clientX,startY:S.clientY};let D0=(E0)=>{let C0=O1.current;if(!C0?.path)return;let W0=Math.abs(E0.clientX-C0.startX),t0=Math.abs(E0.clientY-C0.startY),r1=W0>4||t0>4;if(!C0.dragging&&r1)C0.dragging=!0,R1.current=!0,u(!0),r("move"),x_(C0.path),F1(E0.clientX,E0.clientY),document.body.style.userSelect="none",document.body.style.cursor="grabbing";if(C0.dragging){E0.preventDefault(),F1(E0.clientX,E0.clientY);let Z_=document.elementFromPoint(E0.clientX,E0.clientY),N$=k1(Z_)||L1();if(d0.current!==N$)p1(N$);e1(N$)}},Y0=()=>{document.removeEventListener("mousemove",D0),document.removeEventListener("mouseup",Y0);let E0=O1.current;if(E0?.dragging&&E0.path){let C0=d0.current||L1(),W0=d.current;if(typeof W0==="function")W0(E0.path,C0)}O1.current={path:null,dragging:!1,startX:0,startY:0},S0.current=0,u(!1),r(null),p1(null),a1(),W_(),document.body.style.userSelect="",document.body.style.cursor="",setTimeout(()=>{R1.current=!1},0)};document.addEventListener("mousemove",D0),document.addEventListener("mouseup",Y0)},[k1,L1,x_,F1,W_,p1,e1,a1]),Q3=R(async(S)=>{let p=Array.from(S?.target?.files||[]);if(p.length===0)return;let o=A1.current||".";if(await v1(p,o),A1.current=".",S?.target)S.target.value=""},[v1]);return U`
        <aside
            class=${`workspace-sidebar${f?" workspace-drop-active":""}`}
            data-workspace-scale=${X1}
            ref=${E1}
            onDragEnter=${e4}
            onDragOver=${q$}
            onDragLeave=${r6}
            onDrop=${q3}
        >
            <input type="file" multiple style="display:none" ref=${U1} onChange=${Q3} />
            <div class="workspace-header">
                <div class="workspace-header-left">
                    <div class="workspace-menu-wrap">
                        <button
                            ref=${A0}
                            class=${`workspace-menu-button${a0?" active":""}`}
                            onClick=${(S)=>{S.stopPropagation(),f0((p)=>!p)}}
                            title="Workspace actions"
                            aria-label="Workspace actions"
                            aria-haspopup="menu"
                            aria-expanded=${a0?"true":"false"}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <line x1="4" y1="7" x2="20" y2="7" />
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="17" x2="20" y2="17" />
                            </svg>
                        </button>
                        ${a0&&U`
                            <div class="workspace-menu-dropdown" ref=${T0} role="menu" aria-label="Workspace options">
                                <button class="workspace-menu-item" role="menuitem" onClick=${g$} disabled=${X0}>New file</button>
                                <button class="workspace-menu-item" role="menuitem" onClick=${u$} disabled=${X0}>Upload files</button>
                                <button class="workspace-menu-item" role="menuitem" onClick=${_5}>Refresh tree</button>
                                <button class="workspace-menu-item" role="menuitem" onClick=${()=>b1(()=>i4())} disabled=${a}>
                                    ${a?"Reindexing workspace…":"Reindex workspace"}
                                </button>
                                <button class=${`workspace-menu-item${A?" active":""}`} role="menuitem" onClick=${Q$}>
                                    ${A?"Hide hidden files":"Show hidden files"}
                                </button>

                                ${(G||q||Q)&&U`<div class="workspace-menu-separator"></div>`}
                                ${G&&U`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${d6}>
                                        Open terminal in tab
                                    </button>
                                `}
                                ${q&&U`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${h5}>
                                        Open VNC in tab
                                    </button>
                                `}
                                ${Q&&U`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${l5}>
                                        ${K?"Hide terminal dock":"Show terminal dock"}
                                    </button>
                                `}

                                ${B&&U`<div class="workspace-menu-separator"></div>`}
                                ${r4&&U`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${V$}>Open in tab</button>
                                `}
                                ${B&&!y1&&U`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${F4} disabled=${!Y_}>Open in editor</button>
                                `}
                                ${X$&&U`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${U4}>Rename selected</button>
                                `}
                                ${d4&&U`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${n6}>Download selected file</button>
                                `}
                                ${x$&&U`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${Y$}>Download selected folder (zip)</button>
                                `}
                                ${n4&&U`
                                    <button class="workspace-menu-item danger" role="menuitem" onClick=${K$}>Delete selected file</button>
                                `}
                                <div class="workspace-menu-separator"></div>
                                <button class="workspace-menu-item" role="menuitem" onClick=${()=>{f0(!1),window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:{section:"workspace"}}))}}>Settings</button>
                            </div>
                        `}
                    </div>
                    <span>Workspace</span>
                </div>
                <div class="workspace-header-actions">
                    <button class="workspace-create" onClick=${__} title="New file" disabled=${X0}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                    <button class="workspace-refresh" onClick=${V4} title="Refresh tree">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="8.5" stroke-dasharray="42 12" stroke-dashoffset="6"
                                transform="rotate(75 12 12)" />
                            <polyline points="21 3 21 9 15 9" />
                        </svg>
                    </button>
                </div>
            </div>
            ${o4&&U`
                <div class="workspace-index-status-row">
                    <div class=${`workspace-index-status-chip state-${h_}`} title=${c_}>
                        <span class="workspace-index-status-dot" aria-hidden="true"></span>
                        <span>${C$}</span>
                    </div>
                </div>
            `}
            <div class="workspace-tree" onClick=${t4}>
                ${Q0&&U`
                    <div class="workspace-upload-strip">
                        <div class="workspace-upload-strip-text">
                            ${Q0.error?U`<span class="workspace-upload-strip-error">${Q0.error}</span>`:Q0.done?U`<span>Done</span>`:U`<span>${Q0.total>1?`Uploading ${Q0.current}/${Q0.total}: ${Q0.name}`:`Uploading ${Q0.name}`}${Q0.percent>0?` (${Q0.percent}%)`:"…"}</span>`}
                        </div>
                        ${!Q0.done&&!Q0.error&&U`
                            <div class="workspace-upload-strip-bar">
                                <div class="workspace-upload-strip-fill" style=${`width:${Q0.percent||0}%`}></div>
                            </div>
                        `}
                    </div>
                `}
                ${I&&U`<div class="workspace-loading">Loading…</div>`}
                ${T&&U`<div class="workspace-error">${T}</div>`}
                ${V&&U`
                    <div
                        class="workspace-tree-list"
                        ref=${Y1}
                        tabIndex="0"
                        onClick=${m5}
                        onDblClick=${v5}
                        onKeyDown=${K4}
                        onTouchStart=${Y4}
                        onTouchEnd=${P_}
                        onTouchMove=${O_}
                        onTouchCancel=${P_}
                    >
                        ${j_.map(({node:S,depth:p})=>{let o=S.type==="dir",t=S.path===B,D0=S.path===W,Y0=o&&N.has(S.path),E0=_0&&S.path===_0,C0=Array.isArray(S.children)&&S.children.length>0?S.children.length:Number(S.child_count)||0;return U`
                                <div
                                    key=${S.path}
                                    class=${`workspace-row${t?" selected":""}${E0?" drop-target":""}`}
                                    style=${{paddingLeft:`${8+p*w$.indentPx}px`}}
                                    data-path=${S.path}
                                    data-type=${S.type}
                                    onMouseDown=${p5}
                                >
                                    <span class="workspace-caret" aria-hidden="true">
                                        ${o?t_(Y0?"down":"right"):null}
                                    </span>
                                    <svg class=${`workspace-node-icon${o?" folder":""}`}
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        aria-hidden="true">
                                        ${o?U`<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`:U`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>`}
                                    </svg>
                                    ${D0?U`
                                            <input
                                                class="workspace-rename-input"
                                                ref=${z1}
                                                value=${z}
                                                onInput=${(W0)=>k(W0?.target?.value||"")}
                                                onKeyDown=${(W0)=>{if(W0.stopPropagation(),W0.key==="Enter")W0.preventDefault(),p4();else if(W0.key==="Escape")W0.preventDefault(),T_()}}
                                                onBlur=${T_}
                                                onClick=${(W0)=>W0.stopPropagation()}
                                            />
                                        `:U`<span class="workspace-label"><span class="workspace-label-text">${S.name}</span></span>`}
                                    ${o&&!Y0&&C0>0&&U`
                                        <span class="workspace-count">${C0}</span>
                                    `}
                                    ${o&&U`
                                        <button
                                            class="workspace-folder-upload"
                                            data-folder-hint-target=${S.path}
                                            title="Add folder hint to compose"
                                            aria-label=${`Add folder hint for ${S.path}`}
                                            onClick=${B4}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                                <path d="M12 11v6"/>
                                                <path d="M9 14h6"/>
                                            </svg>
                                        </button>
                                        <button
                                            class="workspace-folder-upload"
                                            data-upload-target=${S.path}
                                            title="Upload files to this folder"
                                            onClick=${f_}
                                            disabled=${X0}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7 8 12 3 17 8"/>
                                                <line x1="12" y1="3" x2="12" y2="15"/>
                                            </svg>
                                        </button>
                                    `}
                                </div>
                            `})}
                    </div>
                `}
            </div>
            ${B&&U`
                <div class="workspace-preview-splitter-h" onMouseDown=${c5} onTouchStart=${N4}></div>
                <div class="workspace-preview">
                    <div class="workspace-preview-header">
                        <span class="workspace-preview-title">${B}</span>
                        <div class="workspace-preview-actions">
                            <button class="workspace-create" onClick=${__} title="New file" disabled=${X0}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>
                            ${!y1&&U`
                                <button
                                    class="workspace-download workspace-edit"
                                    onClick=${()=>Y_&&b0.current?.(B,J)}
                                    title=${I$}
                                    disabled=${!Y_}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                    </svg>
                                </button>
                                <button
                                    class="workspace-download workspace-delete"
                                    onClick=${n1}
                                    title="Delete file"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                </button>
                            `}
                            ${y1?U`
                                    <button
                                        class="workspace-download"
                                        data-folder-hint-target=${B}
                                        onClick=${B4}
                                        title="Add folder hint to compose"
                                        aria-label=${`Add folder hint for ${B}`}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                            <path d="M12 11v6"/>
                                            <path d="M9 14h6"/>
                                        </svg>
                                    </button>
                                    <button class="workspace-download" onClick=${b$}
                                        title="Upload files to this folder" disabled=${X0}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="7 8 12 3 17 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                    </button>
                                    <a class="workspace-download" href=${v2(B,A)} download
                                        title="Download folder as zip" onClick=${(S)=>S.stopPropagation()}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="7 10 12 15 17 10"/>
                                            <line x1="12" y1="15" x2="12" y2="3"/>
                                        </svg>
                                    </a>`:U`<a class="workspace-download" href=${u2(B)} download
                                        title="Download" onClick=${(S)=>S.stopPropagation()}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="7 10 12 15 17 10"/>
                                        <line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                </a>`}
                        </div>
                    </div>
                    ${M&&U`<div class="workspace-loading">Loading preview…</div>`}
                    ${J?.error&&U`<div class="workspace-error">${J.error}</div>`}
                    ${y1&&U`
                        <div class="workspace-preview-text">Folder selected — create file, upload files, or download as zip.</div>
                        ${h?.disabled&&U`<div class="workspace-preview-text">Folder size preview scanning is disabled in Workspace settings.</div>`}
                        ${h?.loading&&U`<div class="workspace-loading">Loading folder size preview…</div>`}
                        ${h?.error&&U`<div class="workspace-error">${h.error}</div>`}
                        ${h?.payload&&h.payload.segments?.length>0&&U`
                            <${GT} payload=${h.payload} />
                        `}
                        ${h?.payload&&(!h.payload.segments||h.payload.segments.length===0)&&U`
                            <div class="workspace-preview-text">No file size data available for this folder yet.</div>
                        `}
                    `}
                    ${J&&!J.error&&!y1&&U`
                        <div class="workspace-preview-body" ref=${Z0}></div>
                    `}
                </div>
            `}
            ${e&&U`
                <div class="workspace-drag-ghost" ref=${w0}>${e.label}</div>
            `}
        </aside>
    `}M0();var YT=new Set(["html-viewer","kanban-editor","mindmap-editor"]);function x8(_,$,j){let Z=String(_||"").trim();if(!Z)return null;if($)return $;if(typeof j!=="function")return null;return j({path:Z,mode:"edit"})?.id||null}function lY(_,$,j){let Z=x8(_,$,j);return Z!=null&&YT.has(Z)}function pY(_,$,j){return x8(_,$,j)==="html-viewer"?"Edit":"Edit Source"}function rY(_,$,j){return x8(_,$,j)==="editor"}var NT=/\.(docx?|xlsx?|pptx?|odt|ods|odp|rtf)$/i,BT=/\.(csv|tsv)$/i,FT=/\.pdf$/i,UT=/\.(png|jpe?g|gif|webp|bmp|ico|svg)$/i;function DT(_,{hasPopOutTab:$=!1}={}){let j=typeof _==="string"?_.trim():"";if(!j)return null;let Z=QK(j,{hasPopOutTab:$});if(Z)return Z;if(NT.test(j)){let X="/workspace/raw?path="+encodeURIComponent(j),G=j.split("/").pop()||"document";return"/office-viewer/?url="+encodeURIComponent(X)+"&name="+encodeURIComponent(G)}if(BT.test(j))return"/data-viewer/?path="+encodeURIComponent(j);if(FT.test(j))return"/workspace/raw?path="+encodeURIComponent(j);if(UT.test(j))return"/image-viewer/?path="+encodeURIComponent(j);return null}function nY({tabs:_,activeId:$,onActivate:j,onClose:Z,onCloseOthers:X,onCloseAll:G,onTogglePin:q,onTogglePreview:Q,onToggleDiff:K,onEditSource:V,previewTabs:Y,diffTabs:N,paneOverrides:F,detachedTabs:B,onReattachTab:D,onToggleDock:W,dockVisible:H,onToggleZen:z,zenMode:k,onPopOutTab:J}){let[L,x]=C(null),I=g(null);b(()=>{if(!L)return;let m=(_0)=>{if(_0.type==="keydown"&&_0.key!=="Escape")return;x(null)};return document.addEventListener("click",m),document.addEventListener("keydown",m),()=>{document.removeEventListener("click",m),document.removeEventListener("keydown",m)}},[L]),b(()=>{let m=(_0)=>{if(_0.ctrlKey&&_0.key==="Tab"){if(_0.preventDefault(),!_.length)return;let H0=_.findIndex((X0)=>X0.id===$);if(_0.shiftKey){let X0=_[(H0-1+_.length)%_.length];j?.(X0.id)}else{let X0=_[(H0+1)%_.length];j?.(X0.id)}return}if((_0.ctrlKey||_0.metaKey)&&_0.key==="w"){let H0=document.querySelector(".editor-pane");if(H0&&H0.contains(document.activeElement)){if(_0.preventDefault(),$)Z?.($)}}};return document.addEventListener("keydown",m),()=>document.removeEventListener("keydown",m)},[_,$,j,Z]);let E=R((m,_0)=>{if(m.button===0){j?.(_0);return}if(m.button===1)m.preventDefault(),Z?.(_0)},[j,Z]),M=R((m,_0)=>{if(m.defaultPrevented)return;if(m.button===0)j?.(_0)},[j]),O=R((m,_0)=>{m.preventDefault(),x({id:_0,x:m.clientX,y:m.clientY})},[]),T=R((m)=>{m.stopPropagation()},[]),y=R((m,_0)=>{m.preventDefault(),m.stopPropagation(),Z?.(_0)},[Z]);b(()=>{if(!$||!I.current)return;let m=I.current.querySelector(".tab-item.active");if(m)m.scrollIntoView({block:"nearest",inline:"nearest",behavior:"smooth"})},[$]);let A=R((m)=>{if(!(F instanceof Map))return null;return F.get(m)||null},[F]),P=q0(()=>_.find((m)=>m.id===L?.id)||null,[L?.id,_]),f=q0(()=>{let m=L?.id;if(!m)return!1;return lY(m,A(m),(_0)=>Q1.resolve(_0))},[L?.id,A]),u=q0(()=>{let m=L?.id;if(!m)return"Edit Source";return pY(m,A(m),(_0)=>Q1.resolve(_0))},[L?.id,A]),c=q0(()=>{let m=L?.id;if(!m||!(B instanceof Map))return!1;return B.has(m)},[L?.id,B]),r=q0(()=>{let m=L?.id;if(!m||!(N instanceof Set))return!1;return N.has(m)},[L?.id,N]),e=q0(()=>{let m=L?.id;if(!m)return!1;let _0=_.find((X0)=>X0.id===m)||null;if(!_0)return!1;return rY(m,A(m),(X0)=>Q1.resolve(X0))&&Boolean(_0.dirty||r)},[L?.id,r,A,_]);if(!_.length)return null;return U`
        <div class="tab-strip" ref=${I} role="tablist">
            ${_.map((m)=>U`
                <div
                    key=${m.id}
                    class=${`tab-item${m.id===$?" active":""}${m.dirty?" dirty":""}${m.pinned?" pinned":""}`}
                    role="tab"
                    aria-selected=${m.id===$}
                    title=${m.path}
                    onMouseDown=${(_0)=>E(_0,m.id)}
                    onClick=${(_0)=>M(_0,m.id)}
                    onContextMenu=${(_0)=>O(_0,m.id)}
                >
                    ${m.pinned&&U`
                        <span class="tab-pin-icon" aria-label="Pinned">
                            <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                                <path d="M4.456.734a1.75 1.75 0 0 1 2.826.504l.613 1.327a3.1 3.1 0 0 0 2.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-2.204 2.205c-.968.968-2.623.5-2.94-.832l-.584-2.454a3.1 3.1 0 0 0-1.707-2.084l-1.327-.613a1.75 1.75 0 0 1-.504-2.826z"/>
                            </svg>
                        </span>
                    `}
                    <span class="tab-label">${m.label}</span>
                    ${B instanceof Map&&B.has(m.id)&&U`
                        <span class="tab-detached-badge" aria-label="Detached" title="Open in separate window">↗</span>
                    `}
                    <button
                        type="button"
                        class="tab-close"
                        onPointerDown=${T}
                        onMouseDown=${T}
                        onClick=${(_0)=>y(_0,m.id)}
                        title=${m.dirty?"Unsaved changes":"Close"}
                        aria-label=${m.dirty?"Unsaved changes":`Close ${m.label}`}
                    >
                        ${m.dirty?U`<span class="tab-dirty-dot" aria-hidden="true"></span>`:U`<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" focusable="false" style=${{pointerEvents:"none"}}>
                                <line x1="4" y1="4" x2="12" y2="12" style=${{pointerEvents:"none"}}/>
                                <line x1="12" y1="4" x2="4" y2="12" style=${{pointerEvents:"none"}}/>
                            </svg>`}
                    </button>
                </div>
            `)}
            ${W&&U`
                <div class="tab-strip-spacer"></div>
                <button
                    class=${`tab-strip-dock-toggle${H?" active":""}`}
                    onClick=${W}
                    title=${`${H?"Hide":"Show"} terminal (Ctrl+\`)`}
                    aria-label=${`${H?"Hide":"Show"} terminal`}
                    aria-pressed=${H?"true":"false"}
                >
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="1.75" y="2.25" width="12.5" height="11.5" rx="2"/>
                        <polyline points="4.5 5.25 7 7.75 4.5 10.25"/>
                        <line x1="8.5" y1="10.25" x2="11.5" y2="10.25"/>
                    </svg>
                </button>
            `}
            ${z&&U`
                <button
                    class=${`tab-strip-zen-toggle${k?" active":""}`}
                    onClick=${z}
                    title=${`${k?"Exit":"Enter"} zen mode (Ctrl+Shift+Z)`}
                    aria-label=${`${k?"Exit":"Enter"} zen mode`}
                    aria-pressed=${k?"true":"false"}
                >
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        ${k?U`<polyline points="4 8 1.5 8 1.5 1.5 14.5 1.5 14.5 8 12 8"/><polyline points="4 8 1.5 8 1.5 14.5 14.5 14.5 14.5 8 12 8"/>`:U`<polyline points="5.5 1.5 1.5 1.5 1.5 5.5"/><polyline points="10.5 1.5 14.5 1.5 14.5 5.5"/><polyline points="5.5 14.5 1.5 14.5 1.5 10.5"/><polyline points="10.5 14.5 14.5 14.5 14.5 10.5"/>`}
                    </svg>
                </button>
            `}
        </div>
        ${L&&U`
            <div class="tab-context-menu" style=${{left:L.x+"px",top:L.y+"px"}}>
                <button onClick=${()=>{Z?.(L.id),x(null)}}>Close</button>
                <button onClick=${()=>{X?.(L.id),x(null)}}>Close Others</button>
                <button onClick=${()=>{G?.(),x(null)}}>Close All</button>
                <hr />
                <button onClick=${()=>{q?.(L.id),x(null)}}>
                    ${P?.pinned?"Unpin":"Pin"}
                </button>
                ${f&&V&&U`
                    <button onClick=${()=>{V(L.id),x(null)}}>${u}</button>
                `}
                ${c&&D&&U`
                    <button onClick=${()=>{D(L.id),x(null)}}>Reattach</button>
                `}
                ${J&&!c&&U`
                    <button onClick=${()=>{let m=_.find((_0)=>_0.id===L.id);J(L.id,m?.label),x(null)}}>Open in Window</button>
                `}
                ${e&&K&&U`
                    <hr />
                    <button onClick=${()=>{j?.(L.id),K(L.id),x(null)}}>${r?"Hide Diff":"Compare to Saved"}</button>
                `}
                ${Q&&/\.(md|mdx|markdown)$/i.test(L.id)&&U`
                    <hr />
                    <button onClick=${()=>{Q(L.id),x(null)}}>
                        ${Y?.has(L.id)?"Hide Preview":"Preview"}
                    </button>
                `}
                ${(()=>{let m=DT(L.id,{hasPopOutTab:typeof J==="function"});if(!m)return null;return U`
                        <hr />
                        <button onClick=${()=>{window.open(m,"_blank","noopener"),x(null)}}>Open in New Tab</button>
                    `})()}
            </div>
        `}
    `}M0();T1();i2();function u4(_,$=30){let j=Array.isArray(_)?_.map((Z)=>Number(Z)).filter((Z)=>Number.isFinite(Z)):[];return j.length>$?j.slice(j.length-$):j}function C8(_,$=30){return u4(_,$).map((j)=>Math.max(0,Math.min(100,j)))}function I5(_,$=56,j=16,Z={}){let X=u4(_);if(X.length===0)return"";let G=Number.isFinite(Z.min)?Number(Z.min):Math.min(...X),q=Number.isFinite(Z.max)?Number(Z.max):Math.max(...X);if(!(q>G)){let Q=(j/2).toFixed(2);return`M 0 ${Q} L ${$} ${Q}`}if(X.length===1){let Q=(X[0]-G)/(q-G),K=(j-Q*j).toFixed(2);return`M 0 ${K} L ${$} ${K}`}return X.map((Q,K)=>{let V=K/(X.length-1||1)*$,Y=(Q-G)/(q-G),N=j-Y*j;return`${K===0?"M":"L"} ${V.toFixed(2)} ${N.toFixed(2)}`}).join(" ")}function Z4(_){return`${Math.round(Number(_)||0)}%`}function wj(_){let $=Number(_);if(!Number.isFinite($)||$<=0)return"0B";let j=["B","K","M","G","T"],Z=0,X=$;while(X>=1024&&Z<j.length-1)X/=1024,Z+=1;let G=X>=100||Z===0?0:X>=10?0:1;return`${X.toFixed(G)}${j[Z]}`}function zT(_){let $=[`CPU ${Z4(_?.cpu_percent)}`,`RAM ${Z4(_?.ram_percent)}`];if(Number(_?.buffer_cache_bytes)>0)$.push(`BUF ${wj(_?.buffer_cache_bytes)}`);if(oY(_))$.push(`VRAM ${Z4(_?.vram_percent)}`);if(Number.isFinite(Number(_?.swap_percent))&&Number(_?.swap_total_bytes)>0)$.push(`SWP ${Z4(_?.swap_percent)}`);return $.join(" • ")}function dY(_){return Number(_?.process_memory?.vm_rss_bytes)>0?Number(_.process_memory.vm_rss_bytes):Number(_?.process_memory?.rss_bytes)||0}function WT(_){return dY(_)>0&&u4(_?.process_rss_series_bytes).length>0}function oY(_){return _?.vram_percent!==null&&_?.vram_percent!==void 0&&Number.isFinite(Number(_?.vram_percent))&&Number(_?.vram_total_bytes)>0&&Number(_?.vram_used_bytes)>=0&&u4(_?.vram_series).length>0}function HT(){if(typeof window>"u"||typeof window.matchMedia!=="function")return!1;return window.matchMedia("(max-width: 900px)").matches}function iY({mode:_="overlay"}){let[$,j]=C(()=>M6(!1)),[Z,X]=C(()=>$Q(!1)),[G,q]=C(()=>HT()),[Q,K]=C({cpu_percent:0,ram_percent:0,swap_percent:null,cpu_series:[],ram_series:[],swap_series:[],vram_percent:null,vram_series:[],vram_total_bytes:0,vram_used_bytes:0,gpu_provider:null,buffer_cache_bytes:null,buffer_cache_series_bytes:[],process_rss_series_bytes:[],process_memory:{rss_bytes:0,vm_rss_bytes:null},swap_total_bytes:0,swap_used_bytes:0,sample_interval_ms:2000,platform:""}),[V,Y]=C(!1);b(()=>{let y=(P)=>{j(Boolean(P?.detail?.enabled))},A=(P)=>{X(Boolean(P?.detail?.collapsed))};return window.addEventListener(f4,y),window.addEventListener(o2,A),()=>{window.removeEventListener(f4,y),window.removeEventListener(o2,A)}},[]),b(()=>{if(typeof window>"u"||typeof window.matchMedia!=="function")return;let y=window.matchMedia("(max-width: 900px)"),A=()=>q(Boolean(y.matches));if(A(),typeof y.addEventListener==="function")return y.addEventListener("change",A),()=>y.removeEventListener("change",A);return y.addListener(A),()=>y.removeListener(A)},[]);let F=_==="overlay";b(()=>{if(!$||!F)return;let y=!1,A=0,P=async()=>{Y((f)=>f||Q.cpu_series.length>0?f:!0);try{let f=await T7();if(y)return;K({cpu_percent:Number(f?.cpu_percent)||0,ram_percent:Number(f?.ram_percent)||0,swap_percent:Number.isFinite(Number(f?.swap_percent))?Number(f?.swap_percent):null,vram_percent:Number.isFinite(Number(f?.vram_percent))?Number(f?.vram_percent):null,cpu_series:C8(f?.cpu_series),ram_series:C8(f?.ram_series),swap_series:C8(f?.swap_series),vram_series:C8(f?.vram_series),vram_total_bytes:Number(f?.vram_total_bytes)||0,vram_used_bytes:Number(f?.vram_used_bytes)||0,gpu_provider:typeof f?.gpu_provider==="string"&&f.gpu_provider.trim()?f.gpu_provider.trim():null,buffer_cache_bytes:Number.isFinite(Number(f?.buffer_cache_bytes))?Number(f?.buffer_cache_bytes):null,buffer_cache_series_bytes:u4(f?.buffer_cache_series_bytes),process_rss_series_bytes:u4(f?.process_rss_series_bytes),process_memory:{rss_bytes:Number(f?.process_memory?.rss_bytes)||0,vm_rss_bytes:Number.isFinite(Number(f?.process_memory?.vm_rss_bytes))?Number(f?.process_memory?.vm_rss_bytes):null},swap_total_bytes:Number(f?.swap_total_bytes)||0,swap_used_bytes:Number(f?.swap_used_bytes)||0,sample_interval_ms:Number(f?.sample_interval_ms)||2000,platform:String(f?.platform||"")})}catch{if(y)return}finally{if(!y)Y(!1)}};return P(),A=window.setInterval(()=>{if(document?.visibilityState==="hidden")return;P()},Math.max(1000,Number(Q.sample_interval_ms)||2000)),()=>{if(y=!0,A)window.clearInterval(A)}},[$,F]);let B=q0(()=>I5(Q.cpu_series,56,16,{min:0,max:100}),[Q.cpu_series]),D=q0(()=>I5(Q.ram_series,56,16,{min:0,max:100}),[Q.ram_series]),W=q0(()=>I5(Q.swap_series,56,16,{min:0,max:100}),[Q.swap_series]),H=q0(()=>I5(Q.vram_series,56,16,{min:0,max:100}),[Q.vram_series]),z=q0(()=>I5(Q.buffer_cache_series_bytes),[Q.buffer_cache_series_bytes]),k=q0(()=>I5(Q.process_rss_series_bytes),[Q.process_rss_series_bytes]),J=Number(Q.buffer_cache_bytes)>0&&u4(Q.buffer_cache_series_bytes).length>0,L=Number.isFinite(Number(Q.swap_percent))&&Q.swap_total_bytes>0,x=oY(Q),I=dY(Q),E=WT(Q),M=q0(()=>zT(Q),[Q]);if(!$||!F)return null;let O=Z?"Show system meters":V?"Updating system meters… Click to collapse.":"System meters — click to collapse.",T=(y)=>{y?.stopPropagation?.();let A=!Z;X(A),z9(A)};return U`
        <div class=${`system-meters-hud system-meters-hud-${_}${Z?" is-collapsed":""}`} aria-live="polite">
            <button
                class="system-meters-card"
                type="button"
                title=${O}
                aria-label=${O}
                aria-expanded=${Z?"false":"true"}
                onClick=${T}
            >
                ${Z?U`<span class="system-meters-collapse-tab" aria-hidden="true">${t_("left")}</span>`:G?U`<span class="system-meters-compact-summary">${M}</span>`:U`
                            <div class="system-meters-row cpu">
                                <span class="system-meters-label">CPU</span>
                                <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                    <path d=${B}></path>
                                </svg>
                                <span class="system-meters-value">${Z4(Q.cpu_percent)}</span>
                            </div>
                            <div class="system-meters-row ram">
                                <span class="system-meters-label">RAM</span>
                                <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                    <path d=${D}></path>
                                </svg>
                                <span class="system-meters-value">${Z4(Q.ram_percent)}</span>
                            </div>
                            ${E&&U`
                                <div class="system-meters-row rss">
                                    <span class="system-meters-label">RSS</span>
                                    <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                        <path d=${k}></path>
                                    </svg>
                                    <span class="system-meters-value">${wj(I)}</span>
                                </div>
                            `}
                            ${x&&U`
                                <div class="system-meters-row vram" title=${Q.gpu_provider?`GPU telemetry: ${Q.gpu_provider}`:"GPU memory telemetry"}>
                                    <span class="system-meters-label">VRAM</span>
                                    <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                        <path d=${H}></path>
                                    </svg>
                                    <span class="system-meters-value">${Z4(Q.vram_percent)}</span>
                                </div>
                            `}
                            ${J&&U`
                                <div class="system-meters-row buf">
                                    <span class="system-meters-label">BUF</span>
                                    <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                        <path d=${z}></path>
                                    </svg>
                                    <span class="system-meters-value">${wj(Q.buffer_cache_bytes)}</span>
                                </div>
                            `}
                            ${L&&U`
                                <div class="system-meters-row swap">
                                    <span class="system-meters-label">SWP</span>
                                    <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                        <path d=${W}></path>
                                    </svg>
                                    <span class="system-meters-value">${Z4(Q.swap_percent)}</span>
                                </div>
                            `}
                        `}
            </button>
        </div>
    `}function OT(_){let{workspaceOpen:$,editorOpen:j,chatOnlyMode:Z,zenMode:X}=_;return`app-shell${$?"":" workspace-collapsed"}${j?" editor-open":""}${Z?" chat-only":""}${X?" zen-mode":""}`}function LT(_){let $=_?.user_message?.id??_?.row_id;if($===null||$===void 0||$==="")return null;let j=Number($);return Number.isFinite(j)?j:null}function JT(_){let{id:$,scrollToBottom:j,getElementById:Z=(V)=>document.getElementById(V),scheduleRaf:X=(V)=>requestAnimationFrame(V),scheduleTimeout:G=(V,Y)=>{setTimeout(V,Y)},maxAttempts:q=12}=_,Q=(V)=>{V.scrollIntoView({behavior:"smooth",block:"center"}),V.classList.add("post-highlight"),G(()=>V.classList.remove("post-highlight"),2000)},K=(V)=>{let Y=Z(`post-${$}`);if(Y){Q(Y);return}if(V<=0){j?.();return}X(()=>{G(()=>K(V-1),40)})};K(q)}function ET(_){let{response:$,viewStateRef:j,scrollToBottom:Z,scrollPostedMessage:X=(K)=>JT({id:K,scrollToBottom:Z})}=_,{searchQuery:G,searchOpen:q}=j.current||{};if(G||q)return;let Q=LT($);if(Q){X(Q);return}Z()}function sY(_){let{appShellRef:$,workspaceOpen:j,editorOpen:Z,chatOnlyMode:X,zenMode:G,isRenameBranchFormOpen:q,closeRenameCurrentBranchForm:Q,handleRenameCurrentBranch:K,renameBranchNameDraft:V,renameBranchNameInputRef:Y,setRenameBranchNameDraft:N,renameBranchDraftState:F,isRenamingBranch:B,addFileRef:D,addFolderRef:W,openEditor:H,openTerminalTab:z,openVncTab:k,hasDockPanes:J,toggleDock:L,dockVisible:x,handleSplitterMouseDown:I,handleSplitterTouchStart:E,showEditorPaneContainer:M,tabStripTabs:O,tabStripActiveId:T,handleTabActivate:y,handleTabClose:A,handleTabCloseOthers:P,handleTabCloseAll:f,handleTabTogglePin:u,handleTabTogglePreview:c,handleTabToggleDiff:r,handleTabEditSource:e,handleReattachPane:m,previewTabs:_0,diffTabs:H0,tabPaneOverrides:X0,toggleZenMode:j0,handlePopOutPane:Q0,isWebAppMode:F0,editorContainerRef:h,editorInstanceRef:$0,detachedTabs:K0,activeDetachedTab:L0,detachedDockPane:a,handleDockSplitterMouseDown:G0,handleDockSplitterTouchStart:O0,TERMINAL_TAB_PATH:P0,dockContainerRef:p0,handleEditorSplitterMouseDown:g0,handleEditorSplitterTouchStart:X1,searchQuery:l0,isIOSDevice:a0,currentBranchRecord:f0,currentChatJid:i0,currentChatBranches:m0,handleBranchPickerChange:e0,formatBranchPickerLabel:s0,openRenameCurrentBranchForm:D1,handlePruneCurrentBranch:G1,handlePurgeArchivedBranch:c0,currentHashtag:J0,handleBackToTimeline:V1,activeSearchScopeLabel:o0,oobePanelState:H1,composePrefillRequest:z0,requestComposePrefill:b0,handleOobeSetupProvider:x0,handleOobeShowModelPicker:n0,handleOobeOpenWorkspace:E1,handleDismissProviderMissingOobe:Y1,handleCompleteProviderReadyOobe:z1,posts:U1,isMainTimelineView:A1,hasMore:x1,loadMore:f1,timelineRef:O1,handleHashtagClick:s1,addMessageRef:R1,scrollToMessage:V0,openFileFromPill:v,openTimelineFileFromPill:n,handleDeletePost:s,handleOpenFloatingWidget:Z0,agents:U0,userProfile:T0,removingPostIds:A0,agentStatus:k0,isCompactionStatus:y0,agentDraft:h0,agentPlan:S0,agentThought:d0,pendingRequest:_1,intentToast:I0,currentTurnId:w0,steerQueued:W1,handlePanelToggle:$1,btwSession:d,closeBtwPanel:B0,handleBtwRetry:r0,handleBtwInject:Z1,floatingWidget:S1,handleCloseFloatingWidget:z_,handleFloatingWidgetEvent:u1,attachmentPreview:A_,setAttachmentPreview:C1,extensionStatusPanels:M1,pendingExtensionPanelActions:M_,handleExtensionPanelAction:L1,searchOpen:k1,followupQueueItems:k_,handleInjectQueuedFollowup:p1,handleRemoveQueuedFollowup:a1,handleMoveQueuedFollowup:e1,viewStateRef:F1,loadPosts:x_,scrollToBottom:W_,searchScope:m_,handleSearch:T_,handleSearchScopeChange:j$,setSearchScope:p4,enterSearchMode:T$,exitSearchMode:__,fileRefs:c1,removeFileRef:y_,clearFileRefs:H_,setFileRefsFromCompose:j_,folderRefs:y$,removeFolderRef:w$,clearFolderRefs:Z$,setFolderRefsFromCompose:y1,messageRefs:Y_,removeMessageRef:I$,clearMessageRefs:r4,setMessageRefsFromCompose:X$,handleCreateSessionFromCompose:n4,handleCreateRootSessionFromCompose:d4,handleRestoreBranch:x$,attachActiveEditorFile:C$,followupQueueCount:c_,handleBtwIntercept:h_,handleMessageResponse:o4,handleComposeSubmitError:N_,isComposeBoxAgentActive:b1,activeChatAgents:i4,connectionStatus:C_,stateAccessFailed:P$,activeModel:s4,agentModelsPayload:v5,activeModelUsage:m5,activeThinkingLevel:V4,supportsThinking:f$,contextUsage:a4,extensionWorkingState:t4,notificationsEnabled:B_,notificationPermission:R$,handleToggleNotifications:K4,setActiveModel:Y4,applyModelState:P_,setPendingRequest:O_,pendingRequestRef:c5,toggleWorkspace:N4}=_,G$=()=>{if(a0())return;W_()};return U`
    <div class=${OT({workspaceOpen:j,editorOpen:Z,chatOnlyMode:X,zenMode:G})} ref=${$}>
      <${iY} mode="overlay" />
      ${q&&U`
        <div class="rename-branch-overlay" onPointerDown=${(n1)=>{if(n1.target===n1.currentTarget)Q()}}>
          <form
            class="rename-branch-panel"
            onSubmit=${(n1)=>{n1.preventDefault(),K(V)}}
          >
            <div class="rename-branch-title">Rename session</div>
            <input
              ref=${Y}
              value=${V}
              onInput=${(n1)=>{let S$=n1.currentTarget?.value??"";N(String(S$))}}
              onKeyDown=${(n1)=>{if(n1.key==="Escape")n1.preventDefault(),Q()}}
              autocomplete="off"
              placeholder="Session handle (letters, numbers, - and _ only)"
            />
            <div class=${`rename-branch-help ${F.kind||"info"}`}>
              ${F.message}
            </div>
            <div class="rename-branch-actions">
              <button type="submit" class="compose-model-popup-btn primary" disabled=${B||!F.canSubmit}>
                ${B?"Renaming…":"Save"}
              </button>
              <button
                type="button"
                class="compose-model-popup-btn"
                onClick=${Q}
                disabled=${B}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      `}
      ${!X&&U`
        <${hY}
          onFileSelect=${D}
          onFolderSelect=${W}
          visible=${j}
          active=${j||Z}
          onOpenEditor=${H}
          onOpenTerminalTab=${z}
          onOpenVncTab=${k}
          onToggleTerminal=${J?L:void 0}
          terminalVisible=${Boolean(J&&x)}
        />
        <button
          class=${`workspace-toggle-tab${j?" open":" closed"}`}
          onClick=${N4}
          title=${j?"Hide workspace":"Show workspace"}
          aria-label=${j?"Hide workspace":"Show workspace"}
        >
          <svg class="workspace-toggle-tab-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 3 11 8 6 13" />
          </svg>
        </button>
        <div class="workspace-splitter" onMouseDown=${I} onTouchStart=${E}></div>
      `}
      ${M&&U`
        <div class="editor-pane-container">
          ${G&&U`<div class="zen-hover-zone"></div>`}
          ${Z&&U`
            <${nY}
              tabs=${O}
              activeId=${T}
              onActivate=${y}
              onClose=${A}
              onCloseOthers=${P}
              onCloseAll=${f}
              onTogglePin=${u}
              onTogglePreview=${c}
              onToggleDiff=${r}
              onEditSource=${e}
              previewTabs=${_0}
              diffTabs=${H0}
              paneOverrides=${X0}
              detachedTabs=${K0}
              onReattachTab=${m}
              onToggleDock=${J?L:void 0}
              dockVisible=${J&&x}
              onToggleZen=${j0}
              zenMode=${G}
              onPopOutTab=${F0?void 0:Q0}
            />
          `}
          ${Z&&L0&&U`
            <div class="editor-pane-host editor-pane-detached-host">
              <div class="editor-empty-state">
                <div class="editor-empty-state-title">${L0.label||L0.panePath||"Detached pane"}</div>
                <div class="editor-empty-state-body">This pane is detached into another window.</div>
                <div class="editor-empty-state-actions">
                  <button class="editor-empty-state-button" onClick=${()=>m(L0.panePath)}>Reattach here</button>
                </div>
              </div>
            </div>
          `}
          ${Z&&!L0&&U`<div class="editor-pane-host" ref=${h}></div>`}
          ${Z&&!L0&&T&&_0.has(T)&&U`
            <${Q8}
              getContent=${()=>$0.current?.getContent?.()}
              subscribeContentChange=${(n1)=>$0.current?.onContentChange?.(n1)}
              path=${T}
              onClose=${()=>c(T)}
            />
          `}
          ${J&&x&&U`<div class="dock-splitter" onMouseDown=${G0} onTouchStart=${O0}></div>`}
          ${J&&U`<div class=${`dock-panel${x?"":" hidden"}${Z?"":" standalone"}`}>
            <div class="dock-panel-header">
              <span class="dock-panel-title">Terminal</span>
              <div class="dock-panel-actions">
                ${!F0&&!a&&U`
                  <button class="dock-panel-action" onClick=${()=>Q0(P0,"Terminal")} title="Open terminal in window" aria-label="Open terminal in window">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2.25" y="2.25" width="8.5" height="8.5" rx="1.5"/>
                      <path d="M8.5 2.25h5.25v5.25"/>
                      <path d="M13.75 2.25 7.75 8.25"/>
                    </svg>
                  </button>
                `}
                ${a&&U`
                  <button class="dock-panel-action" onClick=${()=>m(P0)} title="Reattach terminal" aria-label="Reattach terminal">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.5"/>
                      <path d="M5.25 8h5.5"/>
                      <path d="M8 5.25v5.5"/>
                    </svg>
                  </button>
                `}
                <button class="dock-panel-close" onClick=${L} title="Hide terminal (Ctrl+\`)" aria-label="Hide terminal">
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                    <line x1="4" y1="4" x2="12" y2="12"/>
                    <line x1="12" y1="4" x2="4" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
            ${a?U`
                <div class="dock-panel-body dock-panel-body-detached">
                  <div class="editor-empty-state">
                    <div class="editor-empty-state-title">Terminal detached</div>
                    <div class="editor-empty-state-body">The terminal is open in another window.</div>
                    <div class="editor-empty-state-actions">
                      <button class="editor-empty-state-button" onClick=${()=>m(P0)}>Reattach here</button>
                    </div>
                  </div>
                </div>
              `:U`<div class="dock-panel-body" ref=${p0}></div>`}
          </div>`}
        </div>
        <div class="editor-splitter" onMouseDown=${g0} onTouchStart=${X1}></div>
      `}
      <${TK}
        workspaceOpen=${j}
        toggleWorkspace=${N4}
        chatOnlyMode=${X}
        onOpenTerminalTab=${z}
        onOpenVncTab=${k}
        onToggleTerminal=${J?L:void 0}
        terminalVisible=${Boolean(J&&x)}
      />
      <${kK}
        activeChatAgents=${i4}
        currentChatJid=${i0}
        workspaceOpen=${j}
        chatOnlyMode=${X}
        terminalVisible=${Boolean(J&&x)}
        onSwitchChat=${e0}
        onToggleWorkspace=${N4}
        onOpenTerminalTab=${z}
        onOpenVncTab=${k}
        onToggleTerminalDock=${J?L:void 0}
        onPrefillCompose=${b0}
      />
      <div class="container">
        ${l0&&a0()&&U`<div class="search-results-spacer"></div>`}
        ${(J0||l0)&&U`
          <div class="hashtag-header">
            <button class="back-btn" onClick=${V1}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <span>${J0?`#${J0}`:`Search: ${l0} · ${o0}`}</span>
          </div>
        `}
        ${H1?.kind&&H1.kind!=="hidden"&&U`
          <${bV}
            kind=${H1.kind}
            onSetupProvider=${x0}
            onShowModelPicker=${n0}
            onOpenWorkspace=${E1}
            onDismiss=${H1.kind==="provider-missing"?Y1:z1}
          />
        `}
        <${AY}
          posts=${U1}
          hasMore=${A1?x1:!1}
          onLoadMore=${A1?f1:void 0}
          timelineRef=${O1}
          onHashtagClick=${s1}
          onMessageRef=${R1}
          onScrollToMessage=${V0}
          onFileRef=${n||v}
          onPostClick=${void 0}
          onDeletePost=${s}
          onOpenWidget=${Z0}
          onOpenAttachmentPreview=${C1}
          emptyMessage=${J0?`No posts with #${J0}`:l0?`No results for "${l0}"`:void 0}
          agents=${U0}
          user=${T0}
          reverse=${A1}
          removingPostIds=${A0}
          searchQuery=${l0}
        />
        <${Vj}
          status=${y0(k0)?null:k0}
          draft=${h0}
          plan=${S0}
          thought=${d0}
          pendingRequest=${_1}
          intent=${I0}
          turnId=${w0}
          steerQueued=${W1}
          onPanelToggle=${$1}
          showExtensionPanels=${!1}
        />
        <${hV}
          session=${d}
          onClose=${B0}
          onRetry=${r0}
          onInject=${Z1}
        />
        <${ZK}
          widget=${S1}
          onClose=${z_}
          onWidgetEvent=${u1}
        />
        ${A_&&U`
          <${EK}
            mediaId=${A_.mediaId}
            info=${A_.info}
            onClose=${()=>C1(null)}
          />
        `}
        <${BV} />
        <${Vj}
          extensionPanels=${Array.from(M1.values())}
          pendingPanelActions=${M_}
          onExtensionPanelAction=${L1}
          turnId=${w0}
          steerQueued=${W1}
          onPanelToggle=${$1}
          showCorePanels=${!1}
        />
        <${SV}
          onPost=${(n1)=>{ET({response:n1,viewStateRef:F1,scrollToBottom:W_})}}
          onFocus=${G$}
          searchMode=${k1}
          searchScope=${m_}
          onSearch=${T_}
          onSearchScopeChange=${j$||p4}
          onEnterSearch=${T$}
          onExitSearch=${__}
          fileRefs=${c1}
          onRemoveFileRef=${y_}
          onClearFileRefs=${H_}
          onSetFileRefs=${j_}
          folderRefs=${y$}
          onRemoveFolderRef=${w$}
          onClearFolderRefs=${Z$}
          onSetFolderRefs=${y1}
          messageRefs=${Y_}
          onRemoveMessageRef=${I$}
          onClearMessageRefs=${r4}
          onSetMessageRefs=${X$}
          onSwitchChat=${e0}
          onRenameSession=${K}
          isRenameSessionInProgress=${B}
          onCreateSession=${n4}
          onCreateRootSession=${d4}
          onDeleteSession=${G1}
          onPurgeArchivedSession=${c0}
          onRestoreSession=${x$}
          activeEditorPath=${X?null:T}
          onAttachEditorFile=${X?void 0:C$}
          onOpenFilePill=${v}
          followupQueueCount=${c_}
          followupQueueItems=${k_}
          onInjectQueuedFollowup=${p1}
          onRemoveQueuedFollowup=${a1}
          onMoveQueuedFollowup=${e1}
          onSubmitIntercept=${h_}
          onMessageResponse=${o4}
          onSubmitError=${N_}
          isAgentActive=${b1}
          activeChatAgents=${i4}
          currentChatJid=${i0}
          connectionStatus=${C_}
          stateAccessFailed=${P$}
          activeModel=${s4}
          agentModelsPayload=${v5}
          modelUsage=${m5}
          thinkingLevel=${V4}
          supportsThinking=${f$}
          contextUsage=${a4}
          notificationsEnabled=${B_}
          notificationPermission=${R$}
          onToggleNotifications=${K4}
          onModelChange=${Y4}
          onModelStateChange=${P_}
          statusNotice=${y0(k0)?k0:null}
          extensionWorkingState=${t4}
          prefillRequest=${z0}
        />
        <${dK}
          request=${_1}
          onRespond=${()=>{O_(null),c5.current=null}}
        />
      </div>
    </div>
  `}function aY(_){let{branchLoaderMode:$,panePopoutMode:j,branchLoaderState:Z,panePopoutOptions:X,mainShellOptions:G,renderers:q}=_,Q=DV({branchLoaderMode:$,panePopoutMode:j}),K=q?.renderBranchLoaderMode||zV,V=q?.renderPanePopoutMode||WV,Y=q?.renderMainShell||sY;if(Q==="branch-loader")return K(Z);if(Q==="pane-popout")return V(X);return Y(G)}var f8="piclaw_btw_session",eY=900,tY="__piclawRenameBranchFormLock__";function AT(){try{return import.meta.url}catch{return null}}function Ij(_){let $=typeof _==="string"?_.trim().toLowerCase():"";return $==="1"||$==="true"||$==="yes"}function MT(_){try{let $=_?new URL(_).searchParams.get("v"):null;return $&&$.trim()?$.trim():null}catch{return null}}function P8(_,$,j=""){let Z=_?.get?.($);return Z&&Z.trim()?Z.trim():j}function _N(_={}){let $=_.importMetaUrl===void 0?AT():_.importMetaUrl,j=_.document===void 0?typeof document<"u"?document:null:_.document,Z=_.origin===void 0?typeof window<"u"?window.location.origin:"http://localhost":_.origin||"http://localhost",X=MT($);if(X)return X;try{let q=Array.from(j?.querySelectorAll?.('script[type="module"][src]')||[]).find((V)=>String(V?.getAttribute?.("src")||"").includes("/static/dist/app.bundle.js"))?.getAttribute?.("src")||"";if(!q)return null;let K=new URL(q,Z).searchParams.get("v");return K&&K.trim()?K.trim():null}catch{return null}}function $N(_={}){let $=_.window===void 0?typeof window<"u"?window:null:_.window;if(!$)return null;let j=$[tY];if(j&&typeof j==="object")return j;let Z={inFlight:!1,cooldownUntil:0};return $[tY]=Z,Z}function jN(_){if(_==="root")return"Branch family";if(_==="all")return"All chats";return"Current branch"}function ZN(_={}){let $=typeof _.readItem==="function"?_.readItem:J_,j=_.storageKey||f8,Z=$(j);if(!Z)return null;try{let X=JSON.parse(Z);if(!X||typeof X!=="object")return null;let G=typeof X.question==="string"?X.question:"",q=typeof X.answer==="string"?X.answer:"",Q=typeof X.thinking==="string"?X.thinking:"",K=typeof X.error==="string"&&X.error.trim()?X.error:null,V=X.status==="running"?"error":X.status==="success"||X.status==="error"?X.status:"success";return{question:G,answer:q,thinking:Q,error:V==="error"?K||"BTW stream interrupted. You can retry.":K,model:null,status:V}}catch{return null}}function XN(_,$={}){let j=$.defaultChatJid||"web:default",Z=P8(_,"chat_jid",j),X=Ij(_?.get?.("chat_only")||_?.get?.("chat-only")),G=Ij(_?.get?.("pane_popout")),q=P8(_,"pane_path"),Q=P8(_,"pane_label"),K=Ij(_?.get?.("branch_loader")),V=P8(_,"branch_source_chat_jid",Z);return{currentChatJid:Z,chatOnlyMode:X,panePopoutMode:G,panePopoutPath:q,panePopoutLabel:Q,branchLoaderMode:K,branchLoaderSourceChatJid:V}}function GN(_,$){let j=Array.isArray(_)?_:[];return j.find((Z)=>Z?.id===$)||j[0]||null}function qN(_,$){if(!$||!_||typeof _.get!=="function")return null;return _.get($)||null}function xj(_,$,j){return _||$?.label||j||"Pane"}function QN(_,$,j){return`${xj(_,$,j)} · PiClaw`}function VN(_,$,j,Z){let X=Array.isArray(_)?_.length:0,G=Boolean(Z&&$?.has?.(Z)),q=Boolean(Z&&j?.has?.(Z));return X>1||G||q}function KN(_,$){let j=typeof _==="string"?_:"";return j===$||j.startsWith(`${$}/`)}function YN(_,$,j,Z){return _===$&&!j||Z}function NN(_,$,j,Z,X){return _||!$&&(j||Z&&X)}T1();function kT(_,$){if(typeof window<"u")console.warn(`[app] API export missing: ${_}. Using fallback behavior.`);return async()=>$}function V_(_,$,j){let Z=_?.[$];return typeof Z==="function"?Z:kT($,j)}var BN=!1,FN=!1,UN=!1;function TT(_){if(!_||typeof _.setOptions!=="function")return;_.setOptions({breaks:!0,gfm:!0})}function yT(_=typeof window<"u"?window:null){if(!_||FN)return;let $=(j)=>{let Z=String(j?.message||j?.error?.message||"").trim();if(!/ResizeObserver loop (completed with undelivered notifications|limit exceeded)/i.test(Z)){if(!(Z==="Script error."&&(j?.lineno===0||!j?.filename)))return}j.preventDefault?.(),j.stopImmediatePropagation?.()};_.addEventListener("error",$,!0),FN=!0}function wT(){Q1.register(I3),Q1.register(G9),Q1.register(X9),Q1.register(q9),Q1.register(Q9),Q1.register(V9),Q1.register(K9),Q1.register(N9),Q1.register(K7),x3(),Q1.register(g3),Q1.register(u3)}function IT(_=typeof window<"u"?window:null){if(!_||UN)return;if(!_.isSecureContext)return;if(!("serviceWorker"in _.navigator))return;UN=!0,_.navigator.serviceWorker.register("/sw.js").catch(($)=>{console.warn("Failed to register app service worker:",$)})}async function DN(){if(BN)return;let _=typeof window<"u"?window:null,$=_?_?.marked:null;if(TT($),yT(_),Xj(_),_)try{let j=await Promise.resolve().then(() => (M0(),hZ));_.__piclawPreactHtm=j,_.__piclawPreact=j}catch(j){}wT(),await NK(_),IT(_),BN=!0}function xT(_=W6){return{searchPosts:_.searchPosts,deletePost:_.deletePost,getAgents:_.getAgents,getAgentThought:_.getAgentThought,setAgentThoughtVisibility:_.setAgentThoughtVisibility,getAgentStatus:_.getAgentStatus,getWorkspaceFile:_.getWorkspaceFile,getThread:_.getThread,getTimeline:_.getTimeline,sendAgentMessage:_.sendAgentMessage,forkChatBranch:_.forkChatBranch,getAgentContext:V_(_,"getAgentContext",null),getAutoresearchStatus:V_(_,"getAutoresearchStatus",null),stopAutoresearch:V_(_,"stopAutoresearch",{status:"ok"}),dismissAutoresearch:V_(_,"dismissAutoresearch",{status:"ok"}),getAgentModels:V_(_,"getAgentModels",{current:null,models:[]}),completeInstanceOobe:V_(_,"completeInstanceOobe",{status:"ok"}),getActiveChatAgents:V_(_,"getActiveChatAgents",{chats:[]}),getChatBranches:V_(_,"getChatBranches",{chats:[]}),renameChatBranch:V_(_,"renameChatBranch",null),pruneChatBranch:V_(_,"pruneChatBranch",null),restoreChatBranch:V_(_,"restoreChatBranch",null),getAgentQueueState:V_(_,"getAgentQueueState",{count:0}),steerAgentQueueItem:V_(_,"steerAgentQueueItem",{removed:!1,queued:"steer"}),removeAgentQueueItem:V_(_,"removeAgentQueueItem",{removed:!1}),streamSidePrompt:V_(_,"streamSidePrompt",null)}}var zN=xT(W6);function WN(_){let{routing:$,paneRuntime:j,splitters:Z,branchPaneActions:X,timelineViewActions:G,composeReferenceActions:q,sidepanelActions:Q,shellState:K,agentState:V,composeState:Y,modelState:N}=_,F={appShellRef:K.appShellRef,editorOpen:K.editorOpen,hidePanePopoutControls:j.hidePanePopoutControls,panePopoutHasMenuActions:j.panePopoutHasMenuActions,panePopoutTitle:j.panePopoutTitle,tabStripTabs:K.tabStripTabs,tabStripActiveId:K.tabStripActiveId,handleTabActivate:K.handleTabActivate,previewTabs:K.previewTabs,diffTabs:K.diffTabs,handleTabTogglePreview:K.handleTabTogglePreview,handleTabToggleDiff:K.handleTabToggleDiff,editorContainerRef:j.editorContainerRef,getPaneContent:()=>j.editorInstanceRef?.current?.getContent?.(),subscribePaneContentChange:(D)=>j.editorInstanceRef?.current?.onContentChange?.(D),panePopoutPath:K.panePopoutPath,canReattachPane:j.canReattachPanePopout,handleReattachPane:j.requestPanePopoutReattach},B={appShellRef:K.appShellRef,workspaceOpen:K.workspaceOpen,editorOpen:K.editorOpen,chatOnlyMode:K.chatOnlyMode,zenMode:j.zenMode,isRenameBranchFormOpen:K.isRenameBranchFormOpen,closeRenameCurrentBranchForm:X.closeRenameCurrentBranchForm,handleRenameCurrentBranch:X.handleRenameCurrentBranch,renameBranchNameDraft:K.renameBranchNameDraft,renameBranchNameInputRef:K.renameBranchNameInputRef,setRenameBranchNameDraft:K.setRenameBranchNameDraft,renameBranchDraftState:K.renameBranchDraftState,isRenamingBranch:K.isRenamingBranch,hasDockPanes:j.hasDockPanes,toggleDock:j.toggleDock,dockVisible:j.dockVisible,showEditorPaneContainer:j.showEditorPaneContainer,toggleZenMode:j.toggleZenMode,isWebAppMode:K.isWebAppMode,editorContainerRef:j.editorContainerRef,editorInstanceRef:j.editorInstanceRef,dockContainerRef:j.dockContainerRef,detachedTabs:j.detachedTabs,activeDetachedTab:j.activeDetachedTab,detachedDockPane:j.detachedDockPane,TERMINAL_TAB_PATH:K.TERMINAL_TAB_PATH,isIOSDevice:K.isIOSDevice,currentBranchRecord:K.currentBranchRecord,currentChatJid:K.currentChatJid,currentChatBranches:K.currentChatBranches,formatBranchPickerLabel:K.formatBranchPickerLabel,activeSearchScopeLabel:K.activeSearchScopeLabel,currentHashtag:K.currentHashtag,searchQuery:K.searchQuery,oobePanelState:K.oobePanelState,composePrefillRequest:K.composePrefillRequest,requestComposePrefill:K.requestComposePrefill,handleOobeSetupProvider:K.handleOobeSetupProvider,handleOobeShowModelPicker:K.handleOobeShowModelPicker,handleOobeOpenWorkspace:K.handleOobeOpenWorkspace,handleDismissProviderMissingOobe:K.handleDismissProviderMissingOobe,handleCompleteProviderReadyOobe:K.handleCompleteProviderReadyOobe,posts:K.posts,hasMore:K.hasMore,loadMore:K.loadMore,timelineRef:K.timelineRef,agents:K.agents,userProfile:K.userProfile,removingPostIds:K.removingPostIds,extensionStatusPanels:K.extensionStatusPanels,pendingExtensionPanelActions:K.pendingExtensionPanelActions,searchOpen:K.searchOpen,followupQueueItems:K.followupQueueItems,viewStateRef:K.viewStateRef,loadPosts:K.loadPosts,scrollToBottom:K.scrollToBottom,searchScope:K.searchScope,tabStripTabs:K.tabStripTabs,tabStripActiveId:K.tabStripActiveId,handleTabActivate:K.handleTabActivate,previewTabs:K.previewTabs,diffTabs:K.diffTabs,handleTabTogglePreview:K.handleTabTogglePreview,handleTabToggleDiff:K.handleTabToggleDiff,panePopoutPath:K.panePopoutPath,tabPaneOverrides:K.tabPaneOverrides,handleTabClose:K.handleTabClose,handleTabCloseOthers:K.handleTabCloseOthers,handleTabCloseAll:K.handleTabCloseAll,handleTabTogglePin:K.handleTabTogglePin,handleTabEditSource:K.handleTabEditSource,handleReattachPane:j.reattachPane,openEditor:K.openEditor,openTerminalTab:K.openTerminalTab,openVncTab:K.openVncTab,fileRefs:Y.fileRefs,folderRefs:Y.folderRefs,messageRefs:Y.messageRefs,followupQueueCount:Y.followupQueueCount,attachmentPreview:Y.attachmentPreview,setAttachmentPreview:Y.setAttachmentPreview,extensionWorkingState:Y.extensionWorkingState,activeChatAgents:N.activeChatAgents,connectionStatus:N.connectionStatus,stateAccessFailed:N.stateAccessFailed,activeModel:N.activeModel,activeModelUsage:N.activeModelUsage,activeThinkingLevel:N.activeThinkingLevel,supportsThinking:N.supportsThinking,contextUsage:N.contextUsage,notificationsEnabled:N.notificationsEnabled,notificationPermission:N.notificationPermission,handleToggleNotifications:N.handleToggleNotifications,setActiveModel:N.setActiveModel,applyModelState:N.applyModelState,setPendingRequest:V.setPendingRequest,pendingRequestRef:V.pendingRequestRef,...Z,...X,...G,...q,...Q,...V,...Y,...N};return{branchLoaderMode:$.branchLoaderMode,panePopoutMode:$.panePopoutMode,branchLoaderState:$.branchLoaderState,panePopoutOptions:F,mainShellOptions:B}}function CT(_){let{steerQueuedTurnId:$,currentTurnId:j,agentStatus:Z}=_;return Boolean($&&$===(Z?.turn_id||j))}function HN(_){let $=CT({steerQueuedTurnId:_.agentState.steerQueuedTurnId,currentTurnId:_.agentState.currentTurnId,agentStatus:_.agentState.agentStatus});return WN({routing:{branchLoaderMode:_.routeState.branchLoaderMode,panePopoutMode:_.routeState.panePopoutMode,branchLoaderState:_.surface.branchLoaderState},paneRuntime:_.paneRuntime,splitters:_.splitters,branchPaneActions:_.orchestration.branchPaneActions,timelineViewActions:_.orchestration.timelineViewActions,composeReferenceActions:_.interaction.composeReferenceActions,sidepanelActions:_.orchestration.sidepanelActions,shellState:{appShellRef:_.surface.appShellRef,workspaceOpen:_.surface.workspaceOpen,editorOpen:_.editorState.editorOpen,chatOnlyMode:_.routeState.chatOnlyMode,isRenameBranchFormOpen:_.surface.isRenameBranchFormOpen,renameBranchNameDraft:_.surface.renameBranchNameDraft,renameBranchNameInputRef:_.surface.renameBranchNameInputRef,setRenameBranchNameDraft:_.surface.setRenameBranchNameDraft,renameBranchDraftState:_.surface.renameBranchDraftState,isRenamingBranch:_.surface.isRenamingBranch,isWebAppMode:_.surface.isWebAppMode,TERMINAL_TAB_PATH:_.helpers.terminalTabPath,isIOSDevice:_.helpers.isIOSDevice,currentBranchRecord:_.surface.currentBranchRecord,currentChatJid:_.routeState.currentChatJid,currentChatBranches:_.surface.currentChatBranches,formatBranchPickerLabel:_.helpers.formatBranchPickerLabel,activeSearchScopeLabel:_.surface.activeSearchScopeLabel,currentHashtag:_.surface.currentHashtag,searchQuery:_.surface.searchQuery,oobePanelState:_.surface.oobePanelState,composePrefillRequest:_.surface.composePrefillRequest,requestComposePrefill:_.surface.requestComposePrefill,handleOobeSetupProvider:_.surface.handleOobeSetupProvider,handleOobeShowModelPicker:_.surface.handleOobeShowModelPicker,handleOobeOpenWorkspace:_.surface.handleOobeOpenWorkspace,handleDismissProviderMissingOobe:_.surface.handleDismissProviderMissingOobe,handleCompleteProviderReadyOobe:_.surface.handleCompleteProviderReadyOobe,posts:_.timeline.posts,hasMore:_.timeline.hasMore,loadMore:_.timeline.loadMore,timelineRef:_.surface.timelineRef,agents:_.surface.agents,userProfile:_.surface.userProfile,removingPostIds:_.surface.removingPostIds,extensionStatusPanels:_.surface.extensionStatusPanels,pendingExtensionPanelActions:_.surface.pendingExtensionPanelActions,searchOpen:_.surface.searchOpen,followupQueueItems:_.surface.followupQueueItems,viewStateRef:_.surface.viewStateRef,loadPosts:_.timeline.loadPosts,scrollToBottom:_.timeline.scrollToBottom,searchScope:_.surface.searchScope,tabStripTabs:_.editorState.tabStripTabs,tabStripActiveId:_.editorState.tabStripActiveId,handleTabActivate:_.editorState.handleTabActivate,previewTabs:_.editorState.previewTabs,diffTabs:_.editorState.diffTabs,handleTabTogglePreview:_.editorState.handleTabTogglePreview,handleTabToggleDiff:_.editorState.handleTabToggleDiff,panePopoutPath:_.routeState.panePopoutPath,tabPaneOverrides:_.editorState.tabPaneOverrides,handleTabClose:_.editorState.handleTabClose,handleTabCloseOthers:_.editorState.handleTabCloseOthers,handleTabCloseAll:_.editorState.handleTabCloseAll,handleTabTogglePin:_.editorState.handleTabTogglePin,handleTabEditSource:_.editorState.handleTabEditSource,openEditor:_.editorState.openEditor,openTerminalTab:_.paneRuntime.openTerminalTab,openVncTab:_.paneRuntime.openVncTab},agentState:{agentStatus:_.agentState.agentStatus,isCompactionStatus:_.agentState.isCompactionStatus,agentDraft:_.agentState.agentDraft,agentPlan:_.agentState.agentPlan,agentThought:_.agentState.agentThought,pendingRequest:_.agentState.pendingRequest,intentToast:_.surface.intentToast,currentTurnId:_.agentState.currentTurnId,steerQueued:$,handlePanelToggle:_.interaction.handlePanelToggle,setPendingRequest:_.agentState.setPendingRequest,pendingRequestRef:_.agentState.pendingRequestRef,handleInjectQueuedFollowup:_.orchestration.followupActions.handleInjectQueuedFollowup,handleRemoveQueuedFollowup:_.orchestration.followupActions.handleRemoveQueuedFollowup,handleMoveQueuedFollowup:_.orchestration.followupActions.handleMoveQueuedFollowup},composeState:{btwSession:_.surface.btwSession,floatingWidget:_.surface.floatingWidget,fileRefs:_.surface.fileRefs,folderRefs:_.surface.folderRefs,messageRefs:_.surface.messageRefs,followupQueueCount:_.surface.followupQueueCount,attachmentPreview:_.surface.attachmentPreview,setAttachmentPreview:_.surface.setAttachmentPreview,handleMessageResponse:_.orchestration.followupActions.handleMessageResponse,isComposeBoxAgentActive:_.orchestration.isComposeBoxAgentActive,extensionWorkingState:_.surface.extensionWorkingState},modelState:{activeChatAgents:_.surface.activeChatAgents,connectionStatus:_.surface.connectionStatus,stateAccessFailed:_.surface.stateAccessFailed,activeModel:_.surface.activeModel,agentModelsPayload:_.surface.agentModelsPayload,activeModelUsage:_.surface.activeModelUsage,activeThinkingLevel:_.surface.activeThinkingLevel,supportsThinking:_.surface.supportsThinking,contextUsage:_.surface.contextUsage,notificationsEnabled:_.surface.notificationsEnabled,notificationPermission:_.surface.notificationPermission,handleToggleNotifications:_.surface.handleToggleNotifications,setActiveModel:_.surface.setActiveModel,applyModelState:_.orchestration.chatRefreshLifecycle.applyModelState}})}M0();var LN="(min-width: 1024px) and (orientation: landscape)";function Cj(_=typeof window<"u"?window:null){return _&&typeof _==="object"?_:null}function ON(_,$){let j=Cj(_);if(!j?.localStorage?.getItem)return null;try{let Z=j.localStorage.getItem($);if(Z===null)return null;return Z==="true"}catch{return null}}function PT(_,$,j){let Z=Cj(_);if(!Z?.localStorage?.setItem)return;try{Z.localStorage.setItem($,String(Boolean(j)))}catch{return}}function S6(_=typeof window<"u"?window:null){let $=Cj(_);if(!$?.matchMedia)return"desktop";return $.matchMedia("(min-width: 1024px) and (orientation: landscape)").matches?"desktop":"narrow"}function JN(_){return _==="narrow"?"workspaceOpen.narrow":"workspaceOpen.desktop"}function EN(_={}){let{runtime:$=typeof window<"u"?window:null,bucket:j=null,allowLegacyFallback:Z=!1,defaultValue:X=!1}=_,G=j||S6($),q=JN(G),Q=ON($,q);if(typeof Q==="boolean")return Q;if(Z&&G==="desktop"){let K=ON($,"workspaceOpen");if(typeof K==="boolean")return K}return X}function AN(_,$={}){let{runtime:j=typeof window<"u"?window:null,bucket:Z=null}=$,X=Z||S6(j);PT(j,JN(X),Boolean(_))}X6();var fT=["(display-mode: standalone)","(display-mode: minimal-ui)","(display-mode: fullscreen)"];function MN(_,$={}){let j=$.window??(typeof window<"u"?window:null),Z=$.navigator??(typeof navigator<"u"?navigator:null);if(!j||typeof _!=="function")return()=>{};let X=()=>{_(b_({window:j,navigator:Z}))};X();let q=fT.map((Q)=>{try{return j.matchMedia?.(Q)??null}catch{return null}}).filter(Boolean).map((Q)=>{if(typeof Q.addEventListener==="function")return Q.addEventListener("change",X),()=>Q.removeEventListener("change",X);if(typeof Q.addListener==="function")return Q.addListener(X),()=>Q.removeListener(X);return()=>{}});return j.addEventListener?.("focus",X),j.addEventListener?.("pageshow",X),()=>{for(let Q of q)Q();j.removeEventListener?.("focus",X),j.removeEventListener?.("pageshow",X)}}function R8(_,$={}){let j=$.window??(typeof window<"u"?window:null),Z=$.document??(typeof document<"u"?document:null);if(!j||!Z||typeof _!=="function")return()=>{};let X=()=>{if(Z.visibilityState&&Z.visibilityState!=="visible")return;_()};return j.addEventListener?.("focus",X),j.addEventListener?.("pageshow",X),Z.addEventListener?.("visibilitychange",X),()=>{j.removeEventListener?.("focus",X),j.removeEventListener?.("pageshow",X),Z.removeEventListener?.("visibilitychange",X)}}function kN(_={}){return b_(_)&&U2(_)}function RT(_){let $=_?.activeElement;if(!$)return!1;let j=String($.tagName||$.nodeName||"").toLowerCase();if(j==="textarea"||j==="select")return!0;if(j==="input"){let Z=String($.type||"text").toLowerCase();return!["button","checkbox","color","file","hidden","image","radio","range","reset","submit"].includes(Z)}if($.isContentEditable===!0)return!0;if(typeof $.closest==="function")try{return Boolean($.closest('[contenteditable="true"], [contenteditable="plaintext-only"]'))}catch(Z){console.debug("[mobile-viewport] Ignoring activeElement.closest failure during keyboard detection.",Z)}return!1}function ST(_={},$={}){let j=_.window??(typeof window<"u"?window:null),Z=Number(j?.visualViewport?.height||0),X=Number(j?.innerHeight||0),G=Number.isFinite(Z)&&Z>0,q=Number.isFinite(X)&&X>0;if(G){if($.keyboardActive===!0)return Math.round(Z);if($.ignoreStandaloneChromeGap===!0&&q&&X>Z)return Math.round(X);return Math.round(Z)}if(q)return Math.round(X);return null}function bT(_){let $=Number(_?.screen?.width||0),j=Number(_?.screen?.height||0);if(!Number.isFinite($)||!Number.isFinite(j)||$<=0||j<=0)return null;let Z=Number(_?.innerWidth||0),X=Number(_?.innerHeight||0),G=Number.isFinite(Z)&&Number.isFinite(X)&&Z>X;return Math.round(G?Math.min($,j):Math.max($,j))}function gT(_){let $=Number(_?.visualViewport?.height||0);if(!Number.isFinite($)||$<=0)return!1;let j=Number(_?.innerHeight||0);if(Number.isFinite(j)&&j>0){if($<j-20)return!0}let Z=bT(_);if(Z&&Z>0){let X=Math.max(120,Math.round(Z*0.16));return $<Z-X}return!1}function uT(_={},$={}){if(!kN(_))return null;let j=_.window??(typeof window<"u"?window:null),Z=_.document??(typeof document<"u"?document:null);if(!j||!Z?.documentElement)return null;let G=RT(Z)&&gT(j),q=ST({window:j},{ignoreStandaloneChromeGap:!0,keyboardActive:G});if(G){if(q&&q>0)Z.documentElement.style.setProperty("--app-height",`${q}px`)}else Z.documentElement.style.setProperty("--app-height","100vh");if($.resetScroll===!0){try{if(typeof j.scrollTo==="function")j.scrollTo(0,0)}catch(Q){console.debug("[mobile-viewport] Ignoring scrollTo failure during standalone viewport reset.",Q)}try{if(Z.scrollingElement)Z.scrollingElement.scrollTop=0,Z.scrollingElement.scrollLeft=0;if(Z.documentElement)Z.documentElement.scrollTop=0,Z.documentElement.scrollLeft=0;if(Z.body)Z.body.scrollTop=0,Z.body.scrollLeft=0}catch(Q){console.debug("[mobile-viewport] Ignoring DOM scroll reset failure during standalone viewport sync.",Q)}}return q}function TN(_={}){if(!kN(_))return()=>{};let $=_.window??(typeof window<"u"?window:null),j=_.document??(typeof document<"u"?document:null);if(!$||!j)return()=>{};j.documentElement?.style?.setProperty?.("--app-height","100vh");let Z=0,X=new Set,G=()=>{if(Z)$.cancelAnimationFrame?.(Z),Z=0;for(let D of X)$.clearTimeout?.(D);X.clear()},q=()=>{Z=0,uT({window:$,document:j})},Q=()=>{if(Z)$.cancelAnimationFrame?.(Z);Z=$.requestAnimationFrame?.(q)??0},K=()=>{Q();for(let D of[80,220,420]){let W=$.setTimeout?.(()=>{X.delete(W),Q()},D);if(W!=null)X.add(W)}},V=()=>{if(j.visibilityState&&j.visibilityState!=="visible")return;K()},Y=()=>{try{if(typeof $.scrollTo==="function")$.scrollTo(0,0);if(j.scrollingElement)j.scrollingElement.scrollTop=0,j.scrollingElement.scrollLeft=0;if(j.documentElement)j.documentElement.scrollTop=0,j.documentElement.scrollLeft=0;if(j.body)j.body.scrollTop=0,j.body.scrollLeft=0}catch(D){console.debug("[mobile-viewport] Ignoring scroll reset failure.",D)}},N=()=>{Y(),K();for(let D of[16,50,100,200]){let W=$.setTimeout?.(()=>{X.delete(W),Y()},D);if(W!=null)X.add(W)}},F=()=>{Y(),K();for(let D of[16,50,100]){let W=$.setTimeout?.(()=>{X.delete(W),Y()},D);if(W!=null)X.add(W)}},B=$.visualViewport;return K(),$.addEventListener("focus",K),$.addEventListener("pageshow",K),$.addEventListener("resize",K),$.addEventListener("orientationchange",K),j.addEventListener("visibilitychange",V),j.addEventListener("focusin",N,!0),j.addEventListener("focusout",F,!0),B?.addEventListener?.("resize",K),B?.addEventListener?.("scroll",Y),()=>{G(),$.removeEventListener("focus",K),$.removeEventListener("pageshow",K),$.removeEventListener("resize",K),$.removeEventListener("orientationchange",K),j.removeEventListener("visibilitychange",V),j.removeEventListener("focusin",N,!0),j.removeEventListener("focusout",F,!0),B?.removeEventListener?.("resize",K),B?.removeEventListener?.("scroll",Y)}}var Pj="resume-layout-settling",vT=220,x5=new WeakMap;function mT(_){if(!_){K1(f8,"");return}K1(f8,JSON.stringify({question:_.question||"",answer:_.answer||"",thinking:_.thinking||"",error:_.error||null,status:_.status||"success"}))}function cT(_={}){if(_.panePopoutMode)return!1;let $=typeof _.search==="string"?_.search:"";return!/(?:^|[?&])pane_popout=1(?:&|$)/.test($)}function hT(_,$={}){if(!_)return()=>{};let{durationMs:j=vT,scheduleTimeout:Z=setTimeout,clearScheduledTimeout:X=clearTimeout}=$,G=x5.get(_);if(G)X(G);_.classList.add(Pj);let q=Z(()=>{if(x5.get(_)===q)_.classList.remove(Pj),x5.delete(_)},j);return x5.set(_,q),()=>{let Q=x5.get(_);if(Q)X(Q),x5.delete(_);_.classList.remove(Pj)}}function lT(_,$){if(!_?.getElementById)return;let j=encodeURIComponent(String($||"0")),Z={"dynamic-manifest":`/manifest.json?v=${j}`,"dynamic-favicon":`/favicon.ico?v=${j}`,"dynamic-apple-touch-icon":`/apple-touch-icon.png?v=${j}`,"dynamic-apple-touch-icon-180":`/apple-touch-icon-180x180.png?v=${j}`,"dynamic-apple-touch-icon-167":`/apple-touch-icon-167x167.png?v=${j}`,"dynamic-apple-touch-icon-152":`/apple-touch-icon-152x152.png?v=${j}`,"dynamic-apple-touch-icon-precomposed":`/apple-touch-icon-precomposed.png?v=${j}`};for(let[X,G]of Object.entries(Z)){let q=_.getElementById(X);if(q&&q.href!==G)q.href=G}}function yN(_){let{isRenameBranchFormOpen:$,renameBranchNameInputRef:j,appShellRef:Z,setIsWebAppMode:X,workspaceOpen:G,setWorkspaceOpen:q,btwSession:Q,agents:K,agentsRef:V,currentChatJid:Y,activeChatJidRef:N,userProfile:F,userProfileRef:B,brandingRef:D,panePopoutMode:W=!1}=_;nq(30000),b(()=>{if(!$)return;requestAnimationFrame(()=>{if($)j.current?.focus?.(),j.current?.select?.()})},[$,j]),b(()=>lG(),[]),b(()=>MN(X),[X]),b(()=>{let k=()=>{},J=R8(()=>{L7(),k(),k=hT(Z.current)});return()=>{J(),k()}},[Z]);let H=g(S6());return b(()=>{AN(G,{bucket:H.current})},[G]),b(()=>{if(typeof window>"u"||!window.matchMedia)return;let k=window.matchMedia(LN),J=()=>{let L=S6(window);if(H.current===L)return;let x=H.current;if(H.current=L,x==="desktop"&&L==="narrow")q(!1)};if(k.addEventListener)k.addEventListener("change",J);else if(k.addListener)k.addListener(J);return()=>{if(k.removeEventListener)k.removeEventListener("change",J);else if(k.removeListener)k.removeListener(J)}},[q]),b(()=>TN(),[]),b(()=>{mT(Q)},[Q]),b(()=>{V.current=K||{}},[K,V]),b(()=>{N.current=Y},[N,Y]),b(()=>{B.current=F||{name:"You",avatar_url:null,avatar_background:null}},[F,B]),{applyBranding:R((k,J,L=null)=>{if(typeof document>"u")return;let x=(k||"").trim()||"PiClaw";if(D.current.title!==x){if(cT({panePopoutMode:W,search:typeof window<"u"?window.location.search:""})){document.title=x;let E=document.querySelector('meta[name="apple-mobile-web-app-title"]');if(E&&E.getAttribute("content")!==x)E.setAttribute("content",x)}D.current.title=x}let I=J?`${J}|${L||""}`:"";if(D.current.avatarBase!==I){D.current.avatarBase=I;let E=L||Date.now();lT(document,E)}},[D])}}M0();function wN(_,$){if(typeof _!=="string")return{kind:"ignore"};let j=_.trim();if(!j)return{kind:"toast",title:"No file selected",detail:"Use a valid file path from a file pill.",level:"warning"};if(!$.editorOpen&&!$.autoOpenEditor)return{kind:"toast",title:"Editor pane is not open",detail:"Open the editor pane to open files from pills.",level:"warning"};if(/^[a-z][a-z0-9+.-]*:/i.test(j))return{kind:"toast",title:"Cannot open external path from file pill",detail:"Use an in-workspace file path.",level:"warning"};try{if(!$.resolvePane({path:j,mode:"edit"}))return{kind:"toast",title:"No editor available",detail:`No editor can open: ${j}`,level:"warning"}}catch{return{kind:"toast",title:"No editor available",detail:`No editor can open: ${j}`,level:"warning"}}return{kind:"open",path:j}}function fj(_){if(typeof _==="string")return _.trim();if(typeof _==="number")return Number.isFinite(_)?String(_):"";if(typeof _==="bigint")return String(_);return""}function S8(_,$){let j=Array.isArray(_)?_:[],Z=fj($);if(!Z)return j;if(j.includes(Z))return j;return[...j,Z]}function b8(_,$){let j=Array.isArray(_)?_:[],Z=fj($);if(!Z)return j;if(!j.includes(Z))return j;return j.filter((X)=>X!==Z)}function g8(_){if(!Array.isArray(_))return[];let $=[],j=new Set;for(let Z of _){let X=fj(Z);if(!X||j.has(X))continue;j.add(X),$.push(X)}return $}async function IN(_){let{hashtag:$,setCurrentHashtag:j,setPosts:Z,loadPosts:X}=_;j($),Z(null),await X($)}async function xN(_){let{setCurrentHashtag:$,setSearchQuery:j,setPosts:Z,loadPosts:X}=_;$(null),j(null),Z(null),await X()}async function Rj(_){let{query:$,scope:j,currentChatJid:Z,currentRootChatJid:X,searchPosts:G,setSearchScope:q,setSearchQuery:Q,setCurrentHashtag:K,setPosts:V,setHasMore:Y}=_,N=typeof $==="string"?$.trim():"";if(!N)return;let F=j==="root"||j==="all"?j:"current";q(F),Q(N),K(null),V(null);try{let B=await G(N,50,0,Z,F,X,_.filters);V(Array.isArray(B?.results)?B.results:[]),Y(!1)}catch(B){console.error("Failed to search:",B),V([])}}async function CN(_){let{post:$,posts:j,currentChatJid:Z,deletePost:X,preserveTimelineScrollTop:G,setPosts:q,setRemovingPostIds:Q,hasMoreRef:K,loadMoreRef:V,confirm:Y=(z)=>window.confirm(z),showAlert:N=(z)=>alert(z),scheduleTimeout:F=(z,k)=>{setTimeout(z,k)}}=_;if(!$)return;let B=$.id,D=typeof $?.chat_jid==="string"&&$.chat_jid.trim()?$.chat_jid.trim():Z,W=j?.filter((z)=>z?.data?.thread_id===B&&z?.id!==B).length||0;if(W>0){if(!Y(`Delete this message and its ${W} replies?`))return}let H=(z)=>{if(!z.length)return;Q((k)=>{let J=new Set(k);return z.forEach((L)=>J.add(L)),J}),F(()=>{if(G(()=>{q((k)=>k?k.filter((J)=>!z.includes(J.id)):k)}),Q((k)=>{let J=new Set(k);return z.forEach((L)=>J.delete(L)),J}),K.current)V.current?.({preserveScroll:!0,preserveMode:"top"})},180)};try{let z=await X(B,W>0,D);if(z?.ids?.length)H(z.ids)}catch(z){let k=z instanceof Error?z.message:String(z||"");if(W===0&&k.includes("Replies exist")){if(!Y("Delete this message and its replies?"))return;let L=await X(B,!0,D);if(L?.ids?.length)H(L.ids);return}console.error("Failed to delete post:",z),N(`Failed to delete message: ${k}`)}}async function PN(_){let{id:$,targetChatJid:j,currentChatJid:Z,getThread:X,setPosts:G,getElementById:q=(N)=>document.getElementById(N),scheduleRaf:Q=(N)=>requestAnimationFrame(N),scheduleTimeout:K=(N,F)=>{setTimeout(N,F)}}=_,V=(N)=>{N.scrollIntoView({behavior:"smooth",block:"center"}),N.classList.add("post-highlight"),K(()=>N.classList.remove("post-highlight"),2000)},Y=q(`post-${$}`);if(Y){V(Y);return}try{let N=typeof j==="string"&&j.trim()?j.trim():Z,B=(await X($,N))?.thread?.[0];if(!B)return;G((D)=>{if(!D)return[B];if(D.some((W)=>W.id===B.id))return D;return[...D,B]}),Q(()=>{K(()=>{let D=q(`post-${$}`);if(D)V(D)},50)})}catch(N){console.error("[scrollToMessage] Failed to fetch message",$,N)}}function pT(_){if(typeof _==="string"&&_.trim())return _.trim();return"Could not send your message."}function rT(_){let{id:$,targetChatJid:j=null,currentChatJid:Z,currentHashtag:X=null,searchQuery:G=null,searchOpen:q=!1,setCurrentHashtag:Q,setSearchQuery:K,setSearchOpen:V,setMessageRefs:Y,navigate:N,chatOnlyMode:F,baseHref:B=typeof window<"u"?window.location.href:"http://localhost/"}=_,D=String($??"").trim();if(!D)return!1;let W=typeof j==="string"&&j.trim()?j.trim():Z,H=W!==Z,z=Boolean(q||G||X);if(!H&&!z)return Y((k)=>S8(k,D)),!0;if(Y([D]),Q?.(null),K?.(null),V?.(!1),H&&typeof N==="function"){let k=I_(B,W,{chatOnly:F});N(k)}return!0}function fN(_){let{setIntentToast:$,intentToastTimerRef:j,editorOpen:Z,openEditor:X,resolvePane:G,tabStripActiveId:q,setFileRefs:Q,setFolderRefs:K,setMessageRefs:V,currentChatJid:Y,currentHashtag:N,searchQuery:F,searchOpen:B,setCurrentHashtag:D,setSearchQuery:W,setSearchOpen:H,navigate:z,chatOnlyMode:k,baseHref:J,getThread:L,setPosts:x}=_,I=R(()=>{if(j.current)clearTimeout(j.current),j.current=null;$(null)},[j,$]);b(()=>{return()=>{I()}},[I]);let E=R((h)=>{Q(($0)=>S8($0,h))},[Q]),M=R((h)=>{Q(($0)=>b8($0,h))},[Q]),O=R(()=>{Q([])},[Q]),T=R((h)=>{Q(g8(h))},[Q]),y=R((h)=>{K(($0)=>S8($0,h))},[K]),A=R((h)=>{K(($0)=>b8($0,h))},[K]),P=R(()=>{K([])},[K]),f=R((h)=>{K(g8(h))},[K]),u=R((h,$0=null,K0="info",L0=3000)=>{I(),$({title:h,detail:$0||null,kind:K0||"info"}),j.current=setTimeout(()=>{$((a)=>a?.title===h?null:a)},L0)},[I,j,$]),c=R((h,{autoOpenEditor:$0=!1}={})=>{let K0=wN(h,{editorOpen:Z,autoOpenEditor:$0,resolvePane:G});if(K0.kind==="open"){X(K0.path);return}if(K0.kind==="toast")u(K0.title,K0.detail,K0.level)},[Z,X,G,u]),r=R((h)=>{c(h,{autoOpenEditor:!1})},[c]),e=R((h)=>{c(h,{autoOpenEditor:!0})},[c]),m=R(()=>{let h=q;if(h)E(h)},[E,q]),_0=R((h,$0=null)=>{rT({id:h,targetChatJid:$0,currentChatJid:Y,currentHashtag:N,searchQuery:F,searchOpen:B,setCurrentHashtag:D,setSearchQuery:W,setSearchOpen:H,setMessageRefs:V,navigate:z,chatOnlyMode:k,baseHref:J})},[J,k,Y,N,z,B,F,D,V,H,W]),H0=R(async(h,$0=null)=>{await PN({id:h,targetChatJid:$0,currentChatJid:Y,getThread:L,setPosts:x})},[Y,L,x]),X0=R((h)=>{V(($0)=>b8($0,h))},[V]),j0=R(()=>{V([])},[V]),Q0=R((h)=>{V(g8(h))},[V]),F0=R((h)=>{u("Compose failed",pT(h),"error",5000)},[u]);return{clearIntentToast:I,addFileRef:E,removeFileRef:M,clearFileRefs:O,setFileRefsFromCompose:T,addFolderRef:y,removeFolderRef:A,clearFolderRefs:P,setFolderRefsFromCompose:f,showIntentToast:u,openFileFromPill:r,openTimelineFileFromPill:e,attachActiveEditorFile:m,addMessageRef:_0,scrollToMessage:H0,removeMessageRef:X0,clearMessageRefs:j0,setMessageRefsFromCompose:Q0,handleComposeSubmitError:F0}}M0();async function RN(_){let{panelKey:$,expanded:j,currentTurnIdRef:Z,thoughtExpandedRef:X,draftExpandedRef:G,setAgentThoughtVisibility:q,getAgentThought:Q,thoughtBufferRef:K,draftBufferRef:V,setAgentThought:Y,setAgentDraft:N}=_;if($!=="thought"&&$!=="draft")return;let F=Z.current;if($==="thought"){if(X.current=j,F)try{await q(F,"thought",j)}catch(B){console.warn("Failed to update thought visibility:",B)}if(!j)return;try{let B=F?await Q(F,"thought"):null;if(B?.text)K.current=B.text;Y((D)=>({...D||{text:"",totalLines:0},fullText:K.current||D?.fullText||"",totalLines:Number.isFinite(B?.total_lines)?B.total_lines:D?.totalLines||0}))}catch(B){console.warn("Failed to fetch full thought:",B)}return}if(G.current=j,F)try{await q(F,"draft",j)}catch(B){console.warn("Failed to update draft visibility:",B)}if(!j)return;try{let B=F?await Q(F,"draft"):null;if(B?.text)V.current=B.text;N((D)=>({...D||{text:"",totalLines:0},fullText:V.current||D?.fullText||"",totalLines:Number.isFinite(B?.total_lines)?B.total_lines:D?.totalLines||0}))}catch(B){console.warn("Failed to fetch full draft:",B)}}function nT(_){if(!_)return _;if(!(_.last_activity||_.lastActivity))return _;let{last_activity:$,lastActivity:j,...Z}=_;return Z}function dT(_){if(!_||typeof _!=="object")return{type:"active",last_activity:!0};return{..._,last_activity:!0}}function SN(_){let{lastActivityTtlMs:$,lastActivityTimerRef:j,lastActivityTokenRef:Z,lastAgentEventRef:X,lastSilenceNoticeRef:G,isAgentRunningRef:q,setIsAgentTurnActive:Q,setAgentStatus:K,draftBufferRef:V,thoughtBufferRef:Y,pendingRequestRef:N,lastAgentResponseRef:F,currentTurnIdRef:B,steerQueuedTurnIdRef:D,agentStatusRef:W,silentRecoveryRef:H,thoughtExpandedRef:z,draftExpandedRef:k,setCurrentTurnId:J,setSteerQueuedTurnId:L,currentTurnIdRefForPanel:x,setAgentThoughtVisibility:I,getAgentThought:E,setAgentThought:M,setAgentDraft:O}=_,T=R((c={})=>{let r=Number(c.atMs),e=Number.isFinite(r)&&r>0?r:Date.now();if(X.current=e,c.running)q.current=!0,Q((m)=>m?m:!0);if(c.clearSilence)G.current=0},[q,X,G,Q]),y=R(()=>{if(j.current)clearTimeout(j.current),j.current=null;Z.current=0},[j,Z]);b(()=>()=>{y()},[y]);let A=R(()=>{y(),K((c)=>nT(c))},[y,K]),P=R((c)=>{if(!c)return;y();let r=Date.now();Z.current=r,K(dT(c)),j.current=setTimeout(()=>{if(Z.current!==r)return;K((e)=>{if(!e||!(e.last_activity||e.lastActivity))return e;return null})},$)},[y,j,Z,$,K]),f=R(()=>{q.current=!1,Q(!1),X.current=null,G.current=0,V.current="",Y.current="",N.current=null,F.current=null,B.current=null,D.current=null,W.current=null,H.current={inFlight:!1,lastAttemptAt:0,turnId:null},y(),J(null),L(null),z.current=!1,k.current=!1},[W,y,B,V,k,q,X,F,G,N,J,Q,L,H,D,Y,z]),u=R(async(c,r)=>{await RN({panelKey:c,expanded:r,currentTurnIdRef:x,thoughtExpandedRef:z,draftExpandedRef:k,setAgentThoughtVisibility:I,getAgentThought:E,thoughtBufferRef:Y,draftBufferRef:V,setAgentThought:M,setAgentDraft:O})},[x,V,k,E,O,M,I,Y,z]);return{noteAgentActivity:T,clearLastActivityTimer:y,clearLastActivityFlag:A,showLastActivity:P,clearAgentRunState:f,handlePanelToggle:u}}M0();function u8(_){return _?{..._}:{text:"",totalLines:0}}function bN(_){return Array.isArray(_)?_.map(($)=>({...$})):[]}function oT(_){return{inFlight:Boolean(_?.inFlight),lastAttemptAt:Number(_?.lastAttemptAt||0),turnId:typeof _?.turnId==="string"?_.turnId:null}}function iT(){return{agentStatus:null,agentDraft:{text:"",totalLines:0},agentPlan:"",agentThought:{text:"",totalLines:0},pendingRequest:null,currentTurnId:null,steerQueuedTurnId:null,isAgentTurnActive:!1,followupQueueItems:[],activeModel:null,activeThinkingLevel:null,supportsThinking:!1,activeModelUsage:null,contextUsage:null,isAgentRunning:!1,wasAgentActive:!1,draftBuffer:"",thoughtBuffer:"",lastAgentEvent:null,lastSilenceNotice:0,lastAgentResponse:null,currentTurnIdRef:null,steerQueuedTurnIdRef:null,thoughtExpanded:!1,draftExpanded:!1,agentStatusRef:null,silentRecovery:{inFlight:!1,lastAttemptAt:0,turnId:null}}}function gN(_){return{agentStatus:_.agentStatus,agentDraft:u8(_.agentDraft),agentPlan:_.agentPlan||"",agentThought:u8(_.agentThought),pendingRequest:_.pendingRequest,currentTurnId:_.currentTurnId||null,steerQueuedTurnId:_.steerQueuedTurnId||null,isAgentTurnActive:Boolean(_.isAgentTurnActive),followupQueueItems:bN(_.followupQueueItems),activeModel:_.activeModel,activeThinkingLevel:_.activeThinkingLevel,supportsThinking:Boolean(_.supportsThinking),activeModelUsage:_.activeModelUsage,contextUsage:_.contextUsage,isAgentRunning:Boolean(_.isAgentRunning),wasAgentActive:Boolean(_.wasAgentActive),draftBuffer:_.draftBuffer||"",thoughtBuffer:_.thoughtBuffer||"",lastAgentEvent:_.lastAgentEvent||null,lastSilenceNotice:Number(_.lastSilenceNotice||0),lastAgentResponse:_.lastAgentResponse||null,currentTurnIdRef:_.currentTurnIdRef||null,steerQueuedTurnIdRef:_.steerQueuedTurnIdRef||null,thoughtExpanded:Boolean(_.thoughtExpanded),draftExpanded:Boolean(_.draftExpanded),agentStatusRef:_.agentStatusRef||null,silentRecovery:oT(_.silentRecovery)}}function uN(_){let $=_.snapshot||iT(),{refs:j,setters:Z}=_;return _.clearLastActivityTimer?.(),j.isAgentRunningRef.current=Boolean($.isAgentRunning),j.wasAgentActiveRef.current=Boolean($.wasAgentActive),Z.setIsAgentTurnActive(Boolean($.isAgentTurnActive)),j.lastAgentEventRef.current=$.lastAgentEvent||null,j.lastSilenceNoticeRef.current=Number($.lastSilenceNotice||0),j.draftBufferRef.current=$.draftBuffer||"",j.thoughtBufferRef.current=$.thoughtBuffer||"",j.pendingRequestRef.current=$.pendingRequest||null,j.lastAgentResponseRef.current=$.lastAgentResponse||null,j.currentTurnIdRef.current=$.currentTurnIdRef||null,j.steerQueuedTurnIdRef.current=$.steerQueuedTurnIdRef||null,j.agentStatusRef.current=$.agentStatusRef||null,j.silentRecoveryRef.current=$.silentRecovery||{inFlight:!1,lastAttemptAt:0,turnId:null},j.thoughtExpandedRef.current=Boolean($.thoughtExpanded),j.draftExpandedRef.current=Boolean($.draftExpanded),Z.setAgentStatus($.agentStatus||null),Z.setAgentDraft(u8($.agentDraft)),Z.setAgentPlan($.agentPlan||""),Z.setAgentThought(u8($.agentThought)),Z.setPendingRequest($.pendingRequest||null),Z.setCurrentTurnId($.currentTurnId||null),Z.setSteerQueuedTurnId($.steerQueuedTurnId||null),Z.setFollowupQueueItems(bN($.followupQueueItems)),Z.setActiveModel($.activeModel||null),Z.setActiveThinkingLevel($.activeThinkingLevel||null),Z.setSupportsThinking(Boolean($.supportsThinking)),Z.setActiveModelUsage($.activeModelUsage??null),Z.setContextUsage($.contextUsage??null),$}function Sj(_){return String(_||"").trim()||"web:default"}function vN({remainingQueueCount:_=0,currentTurnId:$=null,isAgentTurnActive:j=!1}={}){return Number(_||0)<=0&&!$&&!j}function sT(_){return vN(_)}function aT(_){let $=String(_?.data?.content||"").trim();if($)return $.replace(/\s+/g," ").slice(0,200);if((Array.isArray(_?.data?.content_blocks)?_.data.content_blocks:[]).length>0)return"Sent an attachment.";return""}function mN(_){let{isAgentTurnActive:$,steerQueuedTurnId:j,currentTurnId:Z,steerQueuedTurnIdRef:X,setSteerQueuedTurnId:G,agentStatus:q,agentDraft:Q,agentPlan:K,agentThought:V,pendingRequest:Y,pendingRequestRef:N,followupQueueItems:F,activeModel:B,activeThinkingLevel:D,supportsThinking:W,activeModelUsage:H,contextUsage:z,isAgentRunningRef:k,wasAgentActiveRef:J,draftBufferRef:L,thoughtBufferRef:x,lastAgentEventRef:I,lastSilenceNoticeRef:E,lastAgentResponseRef:M,currentTurnIdRef:O,thoughtExpandedRef:T,draftExpandedRef:y,agentStatusRef:A,silentRecoveryRef:P,clearLastActivityTimer:f,setIsAgentTurnActive:u,setAgentStatus:c,setAgentDraft:r,setAgentPlan:e,setAgentThought:m,setPendingRequest:_0,setCurrentTurnId:H0,setFollowupQueueItems:X0,setActiveModel:j0,setActiveThinkingLevel:Q0,setSupportsThinking:F0,setActiveModelUsage:h,setContextUsage:$0,lastNotifiedIdRef:K0,agentsRef:L0,notify:a,shouldNotifyLocallyForChat:G0}=_,O0=R((l0)=>{if(!sT({remainingQueueCount:l0,steerQueuedTurnId:X.current,currentTurnId:O.current,isAgentTurnActive:$}))return;X.current=null,G(null)},[$,O,G,X]),P0=R(()=>gN({agentStatus:q,agentDraft:Q,agentPlan:K,agentThought:V,pendingRequest:Y,currentTurnId:Z,steerQueuedTurnId:j,isAgentTurnActive:$,followupQueueItems:F,activeModel:B,activeThinkingLevel:D,supportsThinking:W,activeModelUsage:H,contextUsage:z,isAgentRunning:k.current,wasAgentActive:J.current,draftBuffer:L.current,thoughtBuffer:x.current,lastAgentEvent:I.current,lastSilenceNotice:E.current,lastAgentResponse:M.current,currentTurnIdRef:O.current,steerQueuedTurnIdRef:X.current,thoughtExpanded:T.current,draftExpanded:y.current,agentStatusRef:A.current,silentRecovery:P.current}),[B,H,D,Q,K,q,V,z,Z,F,$,Y,j,W,k,J,L,x,I,E,M,O,X,T,y,A,P]),p0=R((l0)=>{uN({snapshot:l0,clearLastActivityTimer:f,refs:{isAgentRunningRef:k,wasAgentActiveRef:J,lastAgentEventRef:I,lastSilenceNoticeRef:E,draftBufferRef:L,thoughtBufferRef:x,pendingRequestRef:N,lastAgentResponseRef:M,currentTurnIdRef:O,steerQueuedTurnIdRef:X,agentStatusRef:A,silentRecoveryRef:P,thoughtExpandedRef:T,draftExpandedRef:y},setters:{setIsAgentTurnActive:u,setAgentStatus:c,setAgentDraft:r,setAgentPlan:e,setAgentThought:m,setPendingRequest:_0,setCurrentTurnId:H0,setSteerQueuedTurnId:G,setFollowupQueueItems:X0,setActiveModel:j0,setActiveThinkingLevel:Q0,setSupportsThinking:F0,setActiveModelUsage:h,setContextUsage:$0}})},[A,f,O,L,y,k,I,M,E,N,j0,h,Q0,r,e,c,m,$0,H0,X0,u,_0,G,F0,P,X,x,T,J]),g0=R((l0)=>{if(!l0)return;if(O.current===l0)return;O.current=l0,P.current={inFlight:!1,lastAttemptAt:0,turnId:l0},H0(l0),X.current=null,G(null),L.current="",x.current="",r({text:"",totalLines:0}),e(""),m({text:"",totalLines:0}),_0(null),N.current=null,M.current=null,T.current=!1,y.current=!1},[O,L,y,M,N,r,e,m,H0,_0,G,P,X,x,T]),X1=R((l0)=>{let a0=M.current;if(!a0||!a0.post)return;if(l0&&a0.turnId&&a0.turnId!==l0)return;let f0=a0.post,i0=typeof f0?.chat_jid==="string"&&f0.chat_jid.trim()?f0.chat_jid.trim():"";if(!i0||!G0(i0))return;if(f0.id&&K0.current===f0.id)return;let m0=aT(f0);if(!m0)return;K0.current=f0.id||K0.current,M.current=null;let e0=L0.current||{},D1=(f0?.data?.agent_id?e0[f0.data.agent_id]:null)?.name||"Pi";a(D1,m0,{sourceLabel:"Local"})},[L0,M,K0,a,G0]);return{clearQueuedSteerStateIfStale:O0,snapshotCurrentChatPaneState:P0,restoreChatPaneState:p0,setActiveTurn:g0,notifyForFinalResponse:X1}}M0();function v8(_){return _?.turn_id||_?.turnId||null}function C5(_){if(typeof _?.text!=="string"||!_.text)return null;let $=Number.isFinite(_?.totalLines)?Number(_.totalLines):Number.isFinite(_?.total_lines)?Number(_.total_lines):0;return{text:_.text,totalLines:$}}function bj(_,$){return typeof _?.text==="string"&&_.text.length>=$.length}function gj(_,$){return Number.isFinite($)?Number($):_?_.replace(/\r\n/g,`
`).split(`
`).length:0}function m8(_,$){return{text:_,totalLines:gj(_,$)}}function uj(_,$){return{text:$?.text||"",totalLines:dq(_),fullText:_}}function cN(_,$,j){return j==="replace"?$:`${_||""}${$}`}function hN(_,$){let j=_||"";if($?.reset)j="";if($?.delta)j+=String($.delta);return j}function lN(_,$){let j=_||"";if($?.reset)j="";if(typeof $?.delta==="string")j+=$.delta;return j}function e_(_){return!_?.currentHashtag&&!_?.searchQuery&&!_?.searchOpen}function pN(_,$,j){return Boolean($&&j&&(_==="new_post"||_==="new_reply"||_==="agent_response"))}function vj(_,$){return _&&$}function rN(_,$){if(!Array.isArray(_)||_.length===0)return[$];if(_.some((j)=>j?.id===$?.id))return _;return[..._,$]}function nN(_,$){if(!Array.isArray(_))return _;if(!_.some((j)=>j?.id===$?.id))return _;return _.map((j)=>j?.id===$?.id?$:j)}function dN(_,$){if(!Array.isArray(_))return _;let j=Array.isArray($)?$:[];if(j.length===0)return _;let Z=new Set(j),X=_.filter((G)=>!Z.has(G?.id));return X.length===_.length?_:X}async function oN(_){let{currentChatJid:$,getAgentStatus:j,activeChatJidRef:Z,wasAgentActiveRef:X,viewStateRef:G,refreshTimeline:q,clearAgentRunState:Q,agentStatusRef:K,pendingRequestRef:V,thoughtBufferRef:Y,draftBufferRef:N,setAgentStatus:F,setAgentDraft:B,setAgentPlan:D,setAgentThought:W,setPendingRequest:H,setActiveTurn:z,noteAgentActivity:k,clearLastActivityFlag:J,onStateAccessResult:L}=_,x=$;try{let I=await j(x);if(L?.(!1),Z.current!==x)return null;if(!I||I.status!=="active"||!I.data){if(X.current&&e_(G.current))q();return X.current=!1,Q(),K.current=null,F(null),B({text:"",totalLines:0}),D(""),W({text:"",totalLines:0}),H(null),V.current=null,I??null}X.current=!0;let E=I.data;K.current=E;let M=v8(E);if(M)z(M);k({running:!0,clearSilence:!0,atMs:o$(E)??Date.now()}),J(),F(E);let O=C5(I.thought);if(O)W((y)=>{if(bj(y,O.text))return y;return Y.current=O.text,O});let T=C5(I.draft);if(T)B((y)=>{if(bj(y,T.text))return y;return N.current=T.text,T});return I}catch(I){return L?.(!0),console.warn("Failed to fetch agent status:",I),null}}async function iN(_){let{isAgentRunningRef:$,pendingRequestRef:j,currentTurnIdRef:Z,silentRecoveryRef:X,silenceRefreshMs:G,viewStateRef:q,refreshTimeline:Q,refreshQueueState:K,refreshAgentStatus:V,now:Y=()=>Date.now()}=_;if(!$.current)return null;if(j.current)return null;let N=Z.current||null,F=X.current,B=Y();if(F.inFlight)return null;if(F.turnId===N&&B-F.lastAttemptAt<G)return null;F.inFlight=!0,F.lastAttemptAt=B,F.turnId=N;try{if(e_(q.current))await Q();return await K(),await V()}finally{F.inFlight=!1}}function tT(_){if(!_||typeof _!=="object")return!1;let $=typeof _.type==="string"?_.type:"";if($==="tool_call"||$==="tool_status"||$==="intent")return!0;return Boolean(_.tool_name||_.tool_args)}function sN(_){let{isAgentRunningRef:$,pendingRequestRef:j,lastAgentEventRef:Z,lastSilenceNoticeRef:X,agentStatusRef:G,silenceWarningMs:q,silenceFinalizeMs:Q,silenceRefreshMs:K,isCompactionStatus:V,setAgentStatus:Y,reconcileSilentTurn:N,now:F=()=>Date.now()}=_;if(!$.current)return;if(j.current)return;let B=Z.current;if(!B)return;let D=F(),W=D-B,H=G.current,z=V(H),k=tT(H);if(W>=Q){if(!z&&!k)Y({type:"waiting",title:"Re-syncing after a quiet period…"});N();return}if(W>=q&&D-X.current>=K){if(!z&&!k){let J=Math.floor(W/1000);Y({type:"waiting",title:`Waiting for model… No events for ${J}s`})}X.current=D,N()}}function eT(_){if(!_||typeof _!=="object")return null;let $=typeof _.type==="string"?_.type:"",j=typeof _.title==="string"&&_.title.trim()?_.title.trim():null,Z=typeof _.tool_name==="string"&&_.tool_name.trim()?_.tool_name.trim():null,X=typeof _.status==="string"&&_.status.trim()?_.status.trim():null;if($==="tool_call")return{summary:`Timed out while running ${j||Z||"tool"}`,title:j,toolName:Z,statusText:X};if($==="tool_status"){let G=j||Z||"tool";return{summary:X?`Timed out after ${G}: ${X}`:`Timed out after ${G}`,title:j,toolName:Z,statusText:X}}if(Z||j)return{summary:`Timed out after ${j||Z||"tool"}`,title:j,toolName:Z,statusText:X};return null}function aN(_){let{isAgentRunningRef:$,lastSilenceNoticeRef:j,lastAgentEventRef:Z,currentTurnIdRef:X,thoughtExpandedRef:G,draftExpandedRef:q,draftBufferRef:Q,thoughtBufferRef:K,pendingRequestRef:V,lastAgentResponseRef:Y,agentStatusRef:N,stalledPostIdRef:F,scrollToBottomRef:B,setCurrentTurnId:D,setAgentDraft:W,setAgentPlan:H,setAgentThought:z,setPendingRequest:k,setAgentStatus:J,setPosts:L,dedupePosts:x,now:I=()=>Date.now(),nowIso:E=()=>new Date().toISOString()}=_;if(!$.current)return;let M=eT(N.current);$.current=!1,j.current=0,Z.current=null,N.current=null,X.current=null,D(null),G.current=!1,q.current=!1;let O=(Q.current||"").trim();if(Q.current="",K.current="",H(""),z({text:"",totalLines:0}),k(null),V.current=null,Y.current=null,!O){W({text:"",totalLines:0}),J({type:"error",title:"Response stalled - No content received"});return}W({text:O,totalLines:gj(O,null),fullText:O});let T=O,y=I(),A=E(),P={id:y,timestamp:A,data:{type:"agent_response",content:T,content_blocks:[{type:"timeout_marker",timed_out:!0,title:"Timed out",tool_action_summary:M?.summary||"",tool_title:M?.title||"",tool_name:M?.toolName||"",tool_status:M?.statusText||"",draft_recovered:!0}],agent_id:"default",is_local_stall:!0}};F.current=y,L((f)=>f?x([...f,P]):[P]),B.current?.(),J(null)}function _y(_){let{stalledPostIdRef:$,setPosts:j}=_,Z=$.current;if(!Z)return;j((X)=>X?X.filter((G)=>G.id!==Z):X),$.current=null}function $y(_){aN(_)}function tN(_){let{viewStateRef:$,currentHashtag:j,searchQuery:Z,searchOpen:X}=_;b(()=>{$.current={currentHashtag:j,searchQuery:Z,searchOpen:X}},[j,X,Z,$])}function eN(_){let{stalledPostIdRef:$,setPosts:j,isAgentRunningRef:Z,lastSilenceNoticeRef:X,lastAgentEventRef:G,currentTurnIdRef:q,thoughtExpandedRef:Q,draftExpandedRef:K,draftBufferRef:V,thoughtBufferRef:Y,pendingRequestRef:N,lastAgentResponseRef:F,agentStatusRef:B,scrollToBottomRef:D,setCurrentTurnId:W,setAgentDraft:H,setAgentPlan:z,setAgentThought:k,setPendingRequest:J,setAgentStatus:L,dedupePosts:x}=_,I=R(()=>{_y({stalledPostIdRef:$,setPosts:j})},[j,$]),E=R(()=>{$y({isAgentRunningRef:Z,lastSilenceNoticeRef:X,lastAgentEventRef:G,currentTurnIdRef:q,thoughtExpandedRef:Q,draftExpandedRef:K,draftBufferRef:V,thoughtBufferRef:Y,pendingRequestRef:N,lastAgentResponseRef:F,agentStatusRef:B,stalledPostIdRef:$,scrollToBottomRef:D,setCurrentTurnId:W,setAgentDraft:H,setAgentPlan:z,setAgentThought:k,setPendingRequest:J,setAgentStatus:L,setPosts:j,dedupePosts:x})},[q,x,V,K,Z,G,F,B,X,N,D,H,z,L,k,W,J,j,$,Y,Q]);return{removeStalledPost:I,finalizeStalledResponse:E}}function jy(_){let{removeFileRefRef:$,composeReferenceActions:j}=_;$.current=j.removeFileRef||null}function Zy(_){return{applyBranding:_.applyBranding,composeReferenceActions:_.composeReferenceActions,..._.agentActivity,..._.chatPaneRuntime,recoveryCallbacks:_.recoveryCallbacks}}function _B(_){let{environment:$,composeReferences:j,agentActivity:Z,chatPaneRuntime:X,recovery:G,viewState:q,removeFileRefRef:Q}=_,{applyBranding:K}=yN($),V=fN(j);jy({removeFileRefRef:Q,composeReferenceActions:V});let Y=SN(Z),N=mN({...X,clearLastActivityTimer:Y.clearLastActivityTimer}),F=eN(G);return tN(q),Zy({applyBranding:K,composeReferenceActions:V,agentActivity:Y,chatPaneRuntime:N,recoveryCallbacks:F})}M0();M0();T1();var c8=new Map,mj=new Map;function $B(){return Date.now()}function b6(_){return String(_||"").trim()}function jB(_,$=600000){return Boolean(_&&$B()-_.cachedAt<=$)}function Xy(_){while(_.size>24){let $=_.keys().next().value;if(!$)break;_.delete($)}}function ZB(_,$){return c8.delete(_),c8.set(_,$),Xy(c8),$}function h8(_,$){let j=b6(_);if(!j)return null;let Z={posts:Array.isArray($?.posts)?$.posts:[],has_more:Boolean($?.has_more),cachedAt:$B()};return ZB(j,Z)}function cj(_,$={}){let j=b6(_);if(!j)return null;let Z=Number.isFinite($.maxAgeMs)?Number($.maxAgeMs):600000,X=c8.get(j)||null;if(!jB(X,Z))return null;return ZB(j,X)}function XB(_,$,j=5){if(!Array.isArray(_))return[];let Z=b6($),X=Number.isFinite(j)?Math.max(1,Math.min(8,Number(j))):5,G=new Set,q=[];for(let Q of _){let K=b6(Q?.chat_jid);if(!K||K===Z||G.has(K))continue;if(G.add(K),q.push(K),q.length>=X)break}return q}async function GB(_){let $=Array.from(new Set((_.chatJids||[]).map((Q)=>b6(Q)).filter(Boolean)));if($.length===0)return;let j=Number.isFinite(_.maxAgeMs)?Number(_.maxAgeMs):600000,Z=Number.isFinite(_.maxConcurrent)?Math.max(1,Math.min(4,Number(_.maxConcurrent))):2,X=$.filter((Q)=>!jB(cj(Q,{maxAgeMs:j}),j)),G=0,q=Array.from({length:Math.min(Z,X.length)},async()=>{while(G<X.length){let Q=X[G++],K=mj.get(Q);if(K){await K;continue}let V=(async()=>{try{let Y=await _.fetchTimeline(Q);h8(Q,Y)}catch(Y){console.debug("[app-timeline-cache] Ignoring timeline prewarm failure for a best-effort background fetch.",Y,{chatJid:Q})}finally{mj.delete(Q)}})();mj.set(Q,V),await V}});await Promise.all(q)}function qB(_,$){let j=Array.isArray(_)?_:[],Z=Array.isArray($)?$:null;if(!Z)return j;if(Z.length===0)return Z;if(j.length===0)return Z;let X=1/0;for(let q of Z){let Q=q?.id;if(typeof Q==="number"&&Number.isFinite(Q)&&Q<X)X=Q}if(!Number.isFinite(X))return L5([...Z,...j]);let G=j.filter((q)=>{let Q=q?.id;return typeof Q==="number"&&Number.isFinite(Q)&&Q<X});return L5([...Z,...G])}function QB({preserveTimelineScroll:_,preserveTimelineScrollTop:$,chatJid:j=null,currentHashtag:Z=null,searchQuery:X=null}){let[G,q]=C(null),[Q,K]=C(!1),V=g(!1),Y=g(null),N=g(!1),F=g(null),B=g(null),D=g(0),W=g(0);b(()=>{V.current=Q},[Q]),b(()=>{B.current=G},[G]);let H=!Z&&!X,z=g(H);b(()=>{z.current=H},[H]),b(()=>{D.current+=1,q(null),B.current=null,F.current=null,N.current=!1,V.current=!1,K(!1),W.current=0},[j]);let k=R((M,O)=>{if(!H)return;h8(j,{posts:Array.isArray(M)?M:[],has_more:Boolean(O)})},[j,H]),J=R((M,O)=>{B.current=Array.isArray(M)?M:[],V.current=Boolean(O),q(B.current),K(V.current),k(B.current,V.current)},[k]),L=R(async(M=null)=>{let O=D.current;try{if(M){let P=await k7(M,50,0,j);if(O!==D.current)return;q(P.posts),K(!1);return}let T=(P)=>{if(O!==D.current)return;let f=Array.isArray(P?.posts)?P.posts:[],u=Boolean(P?.has_more);J(f,u)},y=cj(j);if(y){J(y.posts,y.has_more);let P=W.current;n$(10,null,j).then((f)=>{if(O!==D.current||W.current!==P)return;if(!z.current)return;let u=Array.isArray(f?.posts)?f.posts:[],c=Boolean(f?.has_more);J(qB(B.current,u),c)}).catch((f)=>{if(O!==D.current)return;console.error("Failed to refresh cached timeline:",f)});return}let A=await n$(10,null,j);T(A)}catch(T){if(O!==D.current)return;throw console.error("Failed to load posts:",T),T}},[j,J]),x=R(async()=>{let M=D.current;try{let O=await n$(10,null,j);if(M!==D.current)return;J(qB(B.current,O?.posts),Boolean(O?.has_more))}catch(O){if(M!==D.current)return;console.error("Failed to refresh timeline:",O)}},[j,J]),I=R(async(M={})=>{let O=D.current,T=B.current;if(!T||T.length===0)return;if(N.current)return;let{preserveScroll:y=!0,preserveMode:A="top",allowRepeat:P=!1}=M,f=(r)=>{if(!y){r();return}if(A==="top")$(r);else _(r)},c=T.slice().sort((r,e)=>r.id-e.id)[0]?.id;if(!Number.isFinite(c))return;if(!P&&F.current===c)return;N.current=!0,F.current=c;try{let r=await n$(10,c,j);if(O!==D.current)return;if(W.current+=1,r.posts.length>0)f(()=>{let e=L5([...r.posts,...B.current||[]]);J(e,r.has_more)});else J(B.current||[],!1)}catch(r){if(O!==D.current)return;console.error("Failed to load more posts:",r)}finally{if(O===D.current)N.current=!1}},[j,_,$,J]);b(()=>{Y.current=I},[I]);let E=R((M)=>{q((O)=>{let T=typeof M==="function"?M(O):M;if(B.current=T,Array.isArray(T)){if(W.current+=1,H)h8(j,{posts:T,has_more:V.current})}return T})},[j,H]);return{posts:G,setPosts:E,hasMore:Q,setHasMore:K,hasMoreRef:V,loadPosts:L,refreshTimeline:x,loadMore:I,loadMoreRef:Y,loadingMoreRef:N,lastBeforeIdRef:F}}M0();function Gy(_){if(!_?.data?.is_bot_message)return!1;let $=_.data.content;return $==="Queued as a follow-up (one-at-a-time)."||$==="⁣"}function VB(_,$){if(!_||!Array.isArray(_))return _;let j=new Set($||[]),Z=_.filter((X)=>!j.has(X?.id)&&!Gy(X));return Z.length===_.length?_:Z}function KB(_,$){let j=$||new Set;return Array.isArray(_)?_.map((Z)=>({...Z})).filter((Z)=>!j.has(Z.row_id)):[]}function YB(_,$){if(!Array.isArray(_)||!Array.isArray($))return!1;return _.length===$.length&&_.every((j,Z)=>j?.row_id===$[Z]?.row_id)}function X4(_,$){let j=Array.isArray(_)&&$!=null?_.filter((Z)=>Z?.row_id!==$):Array.isArray(_)?[..._]:[];return{items:j,remainingQueueCount:j.length}}function NB(_,$){let j=Array.isArray(_)?_:[],Z=$?.row_id,X=$?.content;if(Z==null||typeof X!=="string"||!X.trim())return j;if(j.some((G)=>G?.row_id===Z))return j;return[...j,{row_id:Z,content:X,timestamp:$?.timestamp||null,thread_id:$?.thread_id??null}]}function BB(_){if(!_||typeof _!=="object")return!1;if(_.queued==="followup"||_.queued==="steer")return!0;let $=_.command;return Boolean($&&typeof $==="object"&&($.queued_followup||$.queued_steer))}function qy(_,$=150){return Math.abs(_)<=$}function FB(_){let{timelineRef:$,viewStateRef:j,followupQueueRowIdsRef:Z}=_,X=R(()=>{let K=$.current;if(!K)return;if(qy(K.scrollTop))K.scrollTop=0},[$]),G=R((K)=>{let V=$.current;if(!V||typeof K!=="function"){K?.();return}let{currentHashtag:Y,searchQuery:N,searchOpen:F}=j.current||{},B=!((N||F)&&!Y),D=B?V.scrollHeight-V.scrollTop:V.scrollTop;K(),requestAnimationFrame(()=>{let W=$.current;if(!W)return;if(B){let H=Math.max(W.scrollHeight-D,0);W.scrollTop=H}else{let H=Math.max(W.scrollHeight-W.clientHeight,0),z=Math.min(D,H);W.scrollTop=z}})},[$,j]),q=R((K)=>{let V=$.current;if(!V||typeof K!=="function"){K?.();return}let Y=V.scrollTop;K(),requestAnimationFrame(()=>{let N=$.current;if(!N)return;let F=Math.max(N.scrollHeight-N.clientHeight,0);N.scrollTop=Math.min(Y,F)})},[$]),Q=R((K)=>{return VB(K,Z.current)},[Z]);return{scrollToBottom:X,preserveTimelineScroll:G,preserveTimelineScrollTop:q,filterQueuedPosts:Q}}function Qy(_){let{rawPosts:$,filterQueuedPosts:j}=_;return j($)}function Vy(_){_.scrollToBottomRef.current=_.scrollToBottom}function UB(_){let{timelineRef:$,viewStateRef:j,followupQueueRowIdsRef:Z,currentChatJid:X,currentHashtag:G,searchQuery:q,followupQueueItems:Q}=_,K=g(null),{scrollToBottom:V,preserveTimelineScroll:Y,preserveTimelineScrollTop:N,filterQueuedPosts:F}=FB({timelineRef:$,viewStateRef:j,followupQueueRowIdsRef:Z});Vy({scrollToBottomRef:K,scrollToBottom:V});let{posts:B,setPosts:D,hasMore:W,setHasMore:H,hasMoreRef:z,loadPosts:k,refreshTimeline:J,loadMore:L,loadMoreRef:x}=QB({preserveTimelineScroll:Y,preserveTimelineScrollTop:N,chatJid:X,currentHashtag:G,searchQuery:q}),I=q0(()=>Qy({rawPosts:B,followupQueueItems:Q,filterQueuedPosts:F}),[F,Q,B]);return{scrollToBottomRef:K,scrollToBottom:V,preserveTimelineScroll:Y,preserveTimelineScrollTop:N,rawPosts:B,setPosts:D,hasMore:W,setHasMore:H,hasMoreRef:z,loadPosts:k,refreshTimeline:J,loadMore:L,loadMoreRef:x,posts:I}}M0();function Ky(_){let{currentHashtag:$,searchQuery:j,searchOpen:Z}=_;return!$&&!j&&!Z}function DB(_){let{currentHashtag:$,searchQuery:j,searchOpen:Z,searchScope:X,currentChatJid:G,currentRootChatJid:q,posts:Q,loadPosts:K,searchPosts:V,setCurrentHashtag:Y,setSearchQuery:N,setSearchOpen:F,setSearchScope:B,setPosts:D,setHasMore:W,preserveTimelineScrollTop:H,setRemovingPostIds:z,deletePost:k,hasMoreRef:J,loadMoreRef:L}=_,x=R(async(P)=>{await IN({hashtag:P,setCurrentHashtag:Y,setPosts:D,loadPosts:K})},[K,Y,D]),I=R(async()=>{await xN({setCurrentHashtag:Y,setSearchQuery:N,setPosts:D,loadPosts:K})},[K,Y,D,N]),E=R(async(P,f=X,u)=>{await Rj({query:P,scope:f,currentChatJid:G,currentRootChatJid:q,searchPosts:V,setSearchScope:B,setSearchQuery:N,setCurrentHashtag:Y,setPosts:D,setHasMore:W,filters:u})},[G,q,V,X,Y,W,D,N,B]),M=R((P)=>{if(B(P),j&&j.trim())Rj({query:j,scope:P,currentChatJid:G,currentRootChatJid:q,searchPosts:V,setSearchScope:B,setSearchQuery:N,setCurrentHashtag:Y,setPosts:D,setHasMore:W})},[G,q,V,j,Y,W,D,N,B]),O=R(()=>{F(!0),N(null),Y(null),B("current"),D([])},[Y,D,F,N,B]),T=R(()=>{F(!1),N(null),K()},[K,F,N]),y=q0(()=>Ky({currentHashtag:$,searchQuery:j,searchOpen:Z}),[$,Z,j]),A=R(async(P)=>{await CN({post:P,posts:Q,currentChatJid:G,deletePost:k,preserveTimelineScrollTop:H,setPosts:D,setRemovingPostIds:z,hasMoreRef:J,loadMoreRef:L})},[G,k,J,L,Q,H,D,z]);return{handleHashtagClick:x,handleBackToTimeline:I,handleSearch:E,handleSearchScopeChange:M,enterSearchMode:O,exitSearchMode:T,isMainTimelineView:y,handleDeletePost:A}}M0();function hj(_){if(!Array.isArray(_?.content))return null;return _.content.find((j)=>j?.type==="status_panel"&&j?.panel)?.panel||null}function zB(_,$){let j=new Map(_),Z=hj($);if(typeof $?.key==="string"&&$.key&&Z)j.set($.key,Z);else j.delete("autoresearch");return j}function WB(_,$){let j=typeof $?.key==="string"?$.key:"";if(!j)return _;let Z=new Map(_),X=hj($);if($?.options?.remove||!X)Z.delete(j);else Z.set(j,X);return Z}function HB(_){if(_?.options?.remove)return!0;return hj(_)?.state!=="running"}function lj(_,$){return`${_}:${$}`}function OB(_,$,j){let Z=lj($,j);if(_.has(Z))return _;let X=new Set(_);return X.add(Z),X}function LB(_,$){if(!_.has($))return _;let j=new Set(_);return j.delete($),j}function l8(_,$){if(_.size===0)return _;let j=`${$}:`,Z=new Set(Array.from(_).filter((X)=>!String(X).startsWith(j)));return Z.size===_.size?_:Z}async function JB(_){let $=typeof _.action?.action_type==="string"?_.action.action_type:"",j=typeof _.action?.key==="string"?_.action.key:"";if($==="autoresearch.stop")return await _.stopAutoresearch(_.currentChatJid,{generateReport:!0}),{refreshAutoresearchStatus:!0};if($==="autoresearch.dismiss")return await _.dismissAutoresearch(_.currentChatJid),{refreshAutoresearchStatus:!0};if($==="autoresearch.copy_tmux"){let Z=typeof _.panel?.tmux_command==="string"?_.panel.tmux_command.trim():"";if(!Z)throw Error("No tmux command available.");return await _.writeClipboard(Z),{refreshAutoresearchStatus:!1,toast:{title:"Copied",detail:"tmux command copied to clipboard.",kind:"success"}}}throw Error(`Unsupported panel action: ${$||j}`)}var EB="piclaw:ctx:";function G4(_){if(!_||typeof _!=="object")return null;let $=_,j=$.tokens==null?null:Number($.tokens),Z=$.contextWindow==null?null:Number($.contextWindow),X=$.percent==null?null:Number($.percent);return{tokens:Number.isFinite(j)?j:null,contextWindow:Number.isFinite(Z)?Z:null,percent:Number.isFinite(X)?X:null}}function v4(_,$){let j=G4(_),Z=G4($);if(!j&&!Z)return!0;if(!j||!Z)return!1;return j.tokens===Z.tokens&&j.contextWindow===Z.contextWindow&&j.percent===Z.percent}function P5(_,$){if(!_||!$||typeof $!=="object")return;if($.percent==null)return;try{K1(EB+_,JSON.stringify($))}catch(Z){console.debug("[app-status-refresh] Ignoring best-effort context usage persistence failure.",Z,{chatJid:_})}}function AB(_){if(!_)return null;return M2(EB+_)}async function MB(_){let{currentChatJid:$,queueRefreshGenRef:j,activeChatJidRef:Z,dismissedQueueRowIdsRef:X,getAgentQueueState:G,setFollowupQueueItems:q,clearQueuedSteerStateIfStale:Q}=_,K=++j.current,V=$;try{let Y=await G(V);if(K!==j.current)return;if(Z.current!==V)return;let N=X.current,F=Array.isArray(Y?.items)?Y.items:[],B=KB(F,N);if(B.length){q((D)=>YB(D,B)?D:B);return}if(F.length>0)return;N.clear(),Q(0),q((D)=>D.length===0?D:[])}catch{if(K!==j.current)return;if(Z.current!==V)return;q((Y)=>Y.length===0?Y:[])}}async function kB(_){let{currentChatJid:$,activeChatJidRef:j,getAgentContext:Z,setContextUsage:X}=_,G=$;try{let q=G4(await Z(G));if(j.current!==G)return;if(q&&q.percent!=null)X((Q)=>v4(Q,q)?Q:q),P5(G,q)}catch(q){if(j.current!==G)return;console.warn("Failed to fetch agent context:",q)}}async function TB(_){let{currentChatJid:$,activeChatJidRef:j,getAutoresearchStatus:Z,setExtensionStatusPanels:X,setPendingExtensionPanelActions:G}=_,q=$;try{let Q=await Z(q);if(j.current!==q)return;X((K)=>zB(K,Q)),G((K)=>l8(K,"autoresearch"))}catch(Q){if(j.current!==q)return;console.warn("Failed to fetch autoresearch status:",Q)}}function yB(_){let{refreshModelState:$,refreshActiveChatAgents:j,refreshCurrentChatBranches:Z,refreshQueueState:X,refreshContextUsage:G,refreshAutoresearchStatus:q}=_;$(),j(),Z(),X(),G(),q()}function wB(_){let{viewStateRef:$,refreshTimeline:j,refreshModelAndQueueState:Z}=_;if(e_($.current))j();Z()}Y6();var p8=new Map,r8=new Map,Yy=250,IB=1500,xB=300000;function f5(){if(typeof performance<"u"&&typeof performance.now==="function")return performance.now();return Date.now()}function Ny(_,$){return`${_}:${$}`}function By(_){for(let[$,j]of r8.entries())if(_-j>xB)r8.delete($)}function Fy(_){for(let[$,j]of p8.entries()){if(j.inFlight)continue;if(!Number.isFinite(j.lastCompletedAt)||_-j.lastCompletedAt>xB)p8.delete($)}}function CB(_=f5()){By(_),Fy(_)}function PB(_){let{chatJid:$,nowMs:j=f5()}=_;if(!$)return;r8.set($,j),CB(j)}function g6(_,$=IB,j=f5()){if(!_)return!1;let Z=r8.get(_);if(!Number.isFinite(Z))return!1;return j-Number(Z)<=$}async function k$(_){let{kind:$,chatJid:j,run:Z,cooldownMs:X=Yy,activationWindowMs:G=IB,nowMs:q=f5()}=_;CB(q);let Q=Ny($,j),K=p8.get(Q)||{inFlight:null,lastCompletedAt:Number.NaN,lastValue:null};if(p8.set(Q,K),K.inFlight)return await K.inFlight;if(Boolean(P2("thread-switch",j)||g6(j,G,q))&&Number.isFinite(K.lastCompletedAt)&&q-K.lastCompletedAt<=X)return K.lastValue;let Y=Promise.resolve().then(Z).then((N)=>{return K.lastCompletedAt=f5(),K.lastValue=N??null,K.inFlight=null,N}).catch((N)=>{throw K.lastCompletedAt=f5(),K.inFlight=null,N});return K.inFlight=Y,await Y}function fB(_){let{serverVersion:$,currentAppAssetVersion:j,staleUiVersionRef:Z,staleUiReloadScheduledRef:X,tabStoreHasUnsaved:G,isAgentRunningRef:q,pendingRequestRef:Q,showIntentToast:K}=_,V=typeof $==="string"&&$.trim()?$.trim():null;if(!V||!j||V===j)return!1;if(Z.current===V)return!0;Z.current=V;let Y=typeof document<"u"?String(document.querySelector(".compose-box textarea")?.value||"").trim():"";if(!G()&&!Y&&!q.current&&!Q.current&&!X.current);return K("New UI available","Reload this page to apply the latest interface update.","warning",8000),!0}function pj(_){let{currentHashtag:$,searchQuery:j,searchOpen:Z}=_||{};return!$&&!j&&!Z}function RB(_){let{currentChatJid:$,status:j,setConnectionStatus:Z,setAgentStatus:X,setAgentDraft:G,setAgentPlan:q,setAgentThought:Q,setPendingRequest:K,pendingRequestRef:V,clearAgentRunState:Y,hasConnectedOnceRef:N,viewStateRef:F,refreshTimeline:B,refreshAgentStatus:D,refreshQueueState:W,refreshContextUsage:H}=_;if(Z(j),j!=="connected"){X(null),G({text:"",totalLines:0}),q(""),Q({text:"",totalLines:0}),K(null),V.current=null,Y();return}if(!N.current){if(N.current=!0,X(null),G({text:"",totalLines:0}),q(""),Q({text:"",totalLines:0}),K(null),V.current=null,Y(),g6($))return;if(pj(F.current))B();D(),W(),H();return}if(pj(F.current))B();D(),W(),H()}function SB(_){let{viewStateRef:$,isAgentActive:j,refreshTimeline:Z,refreshQueueState:X,refreshAgentStatus:G,refreshContextUsage:q,refreshAutoresearchStatus:Q}=_,K=pj($.current);if(j){if(K)Z();X(),G(),q(),Q();return}if(K)Z();G(),q(),Q()}function Uy(_){return Math.min(1000,Math.max(100,Math.floor(_/2)))}function bB(_){let{currentChatJid:$,activeChatJidRef:j,queueRefreshGenRef:Z,dismissedQueueRowIdsRef:X,getAgentQueueState:G,setFollowupQueueItems:q,clearQueuedSteerStateIfStale:Q,getAgentContext:K,setContextUsage:V,getAutoresearchStatus:Y,setExtensionStatusPanels:N,setPendingExtensionPanelActions:F,getAgentStatus:B,wasAgentActiveRef:D,viewStateRef:W,refreshTimeline:H,clearAgentRunState:z,agentStatusRef:k,pendingRequestRef:J,thoughtBufferRef:L,draftBufferRef:x,setAgentStatus:I,setAgentDraft:E,setAgentPlan:M,setAgentThought:O,setPendingRequest:T,setActiveTurn:y,noteAgentActivity:A,clearLastActivityFlag:P,isAgentRunningRef:f,currentTurnIdRef:u,silentRecoveryRef:c,silenceRefreshMs:r,lastAgentEventRef:e,lastSilenceNoticeRef:m,silenceWarningMs:_0,silenceFinalizeMs:H0,isCompactionStatus:X0,serverVersionContext:j0,setConnectionStatus:Q0,setStateAccessFailed:F0,setPendingRequestForConnection:h,hasConnectedOnceRef:$0}=_,K0=R(()=>{return k$({kind:"queue-state",chatJid:$,run:async()=>{return await MB({currentChatJid:$,queueRefreshGenRef:Z,activeChatJidRef:j,dismissedQueueRowIdsRef:X,getAgentQueueState:G,setFollowupQueueItems:q,clearQueuedSteerStateIfStale:Q}),null}})},[j,Q,$,X,G,Z,q]),L0=R(async()=>{await k$({kind:"context-usage",chatJid:$,run:async()=>{return await kB({currentChatJid:$,activeChatJidRef:j,getAgentContext:K,setContextUsage:V}),null}})},[j,$,K,V]),a=R(async()=>{await k$({kind:"autoresearch-status",chatJid:$,run:async()=>{return await TB({currentChatJid:$,activeChatJidRef:j,getAutoresearchStatus:Y,setExtensionStatusPanels:N,setPendingExtensionPanelActions:F}),null}})},[j,$,Y,N,F]),G0=R(async()=>{return await k$({kind:"agent-status",chatJid:$,run:async()=>{return await oN({currentChatJid:$,getAgentStatus:B,activeChatJidRef:j,wasAgentActiveRef:D,viewStateRef:W,refreshTimeline:H,clearAgentRunState:z,agentStatusRef:k,pendingRequestRef:J,thoughtBufferRef:L,draftBufferRef:x,setAgentStatus:I,setAgentDraft:E,setAgentPlan:M,setAgentThought:O,setPendingRequest:T,setActiveTurn:y,noteAgentActivity:A,clearLastActivityFlag:P,onStateAccessResult:F0})}})},[j,k,z,P,$,x,B,A,J,H,y,E,M,I,O,T,F0,L,W,D]),O0=R(async()=>{return await iN({isAgentRunningRef:f,pendingRequestRef:J,currentTurnIdRef:u,silentRecoveryRef:c,silenceRefreshMs:r,viewStateRef:W,refreshTimeline:H,refreshQueueState:K0,refreshAgentStatus:G0})},[u,f,J,G0,K0,H,r,c,W]);b(()=>{let g0=Uy(_0),X1=setInterval(()=>{sN({isAgentRunningRef:f,pendingRequestRef:J,lastAgentEventRef:e,lastSilenceNoticeRef:m,agentStatusRef:k,silenceWarningMs:_0,silenceFinalizeMs:H0,silenceRefreshMs:r,isCompactionStatus:X0,setAgentStatus:I,reconcileSilentTurn:O0})},g0);return()=>clearInterval(X1)},[k,f,X0,e,m,J,O0,I,H0,r,_0]);let P0=R((g0)=>{return fB({serverVersion:g0,...j0})},[j0]),p0=R((g0)=>{if(g0==="connected")F0(!1);RB({currentChatJid:$,status:g0,setConnectionStatus:Q0,setAgentStatus:I,setAgentDraft:E,setAgentPlan:M,setAgentThought:O,setPendingRequest:h,pendingRequestRef:J,clearAgentRunState:z,hasConnectedOnceRef:$0,viewStateRef:W,refreshTimeline:H,refreshAgentStatus:G0,refreshQueueState:K0,refreshContextUsage:L0})},[z,$,$0,J,G0,L0,K0,H,E,M,I,O,Q0,h,F0,W]);return{refreshQueueState:K0,refreshContextUsage:L0,refreshAutoresearchStatus:a,refreshAgentStatus:G0,handleUiVersionDrift:P0,handleConnectionStatusChange:p0}}M0();function u6(_){return typeof _==="string"}function v6(_){return typeof _==="string"&&_.trim().length>0}function n8(_){if(!v6(_))return 0;let $=Date.parse(_);return Number.isFinite($)?$:0}function rj(_){if(!Array.isArray(_))return[];return _.filter(($)=>v6($?.chat_jid)&&v6($?.agent_name))}function gB(_){if(!Array.isArray(_))return[];return _.filter(($)=>u6($?.chat_jid)&&u6($?.agent_name))}function uB(_,$,j){if(!Array.isArray($)||$.length===0)return Array.isArray(_)?_:[];let Z=new Map;if(Array.isArray(_)){for(let q of _)if(u6(q?.chat_jid))Z.set(q.chat_jid,q)}let X=$.map((q)=>{if(!u6(q?.chat_jid))return q;let Q=Z.get(q.chat_jid);return Q?{...q,...Q,is_active:Q.is_active??q.is_active}:q}),G=u6(j)?j:"";return X.sort((q,Q)=>{if(q.chat_jid===G&&Q.chat_jid!==G)return-1;if(Q.chat_jid===G&&q.chat_jid!==G)return 1;let K=Boolean(q.archived_at),V=Boolean(Q.archived_at);if(K!==V)return K?1:-1;if(Boolean(q.is_active)!==Boolean(Q.is_active))return q.is_active?-1:1;let Y=n8(q.updated_at)||n8(q.created_at),N=n8(Q.updated_at)||n8(Q.created_at);if(Y!==N)return N-Y;let F=v6(q.agent_name)?q.agent_name.trim():"",B=v6(Q.agent_name)?Q.agent_name.trim():"",D=F.localeCompare(B,void 0,{sensitivity:"base"});if(D!==0)return D;return String(q.chat_jid).localeCompare(String(Q.chat_jid))}),X}var Dy={hasModel:!1,model:void 0,hasThinkingLevel:!1,thinkingLevel:null,thinkingLevelLabel:null,hasSupportsThinking:!1,supportsThinking:!1,hasProviderUsage:!1,providerUsage:null};function vB(_){if(!_||typeof _!=="object")return Dy;let $=_.model??_.current;return{hasModel:$!==void 0,model:$,hasThinkingLevel:_.thinking_level!==void 0,thinkingLevel:_.thinking_level??null,thinkingLevelLabel:_.thinking_level_label??_.thinking_level??null,hasSupportsThinking:_.supports_thinking!==void 0,supportsThinking:Boolean(_.supports_thinking),hasProviderUsage:_.provider_usage!==void 0,providerUsage:_.provider_usage??null}}function mB(_){let j=(Array.isArray(_)?_:[]).find((Z)=>Z?.id==="default");return{name:j?.name,avatarUrl:j?.avatar_url}}function cB(_,$){if(!_||typeof _!=="object")return null;let j=_.agent_id;if(!j)return null;let Z=String(j),X=_.agent_name,G=_.agent_avatar;if(!X&&G===void 0)return null;let q=$||{id:Z},Q=q.name||null,K=q.avatar_url??q.avatarUrl??q.avatar??null,V=!1,Y=!1;if(X&&X!==q.name)Q=X,V=!0;if(G!==void 0){let N=typeof G==="string"?G.trim():null,F=typeof K==="string"?K.trim():null,B=N||null;if(B!==(F||null))K=B,Y=!0}if(!V&&!Y)return null;return{agentId:Z,nameChanged:V,avatarChanged:Y,resolvedName:Q,resolvedAvatar:K}}function hB(_,$){let j=typeof $?.name==="string"&&$.name.trim()?$.name.trim():"You",Z=typeof $?.avatar_url==="string"?$.avatar_url.trim():null,X=typeof $?.avatar_background==="string"&&$.avatar_background.trim()?$.avatar_background.trim():null;if(_.name===j&&_.avatar_url===Z&&_.avatar_background===X)return _;return{name:j,avatar_url:Z,avatar_background:X}}function lB(_,$){if(!$||typeof $!=="object")return _;let j=$.user_name??$.userName,Z=$.user_avatar??$.userAvatar,X=$.user_avatar_background??$.userAvatarBackground;if(j===void 0&&Z===void 0&&X===void 0)return _;let G=typeof j==="string"&&j.trim()?j.trim():_.name||"You",q=Z===void 0?_.avatar_url:typeof Z==="string"&&Z.trim()?Z.trim():null,Q=X===void 0?_.avatar_background:typeof X==="string"&&X.trim()?X.trim():null;if(_.name===G&&_.avatar_url===q&&_.avatar_background===Q)return _;return{name:G,avatar_url:q,avatar_background:Q}}async function rB(_){let{getAgents:$,setAgents:j,setUserProfile:Z,applyBranding:X}=_;try{let G=await $();j(rq(G));let q=G?.user||{};Z((K)=>hB(K,q));let Q=mB(G?.agents);X(Q.name,Q.avatarUrl)}catch(G){console.warn("Failed to load agents:",G)}}function nB(_){let{payload:$,agentsRef:j,setAgents:Z,applyBranding:X}=_,G=cB($,$?.agent_id?j.current?.[String($.agent_id)]||{id:String($.agent_id)}:null);if(!G)return;if(Z((q)=>{let K={...q[G.agentId]||{id:G.agentId}};if(G.nameChanged)K.name=G.resolvedName;if(G.avatarChanged)K.avatar_url=G.resolvedAvatar;return{...q,[G.agentId]:K}}),G.agentId==="default")X(G.resolvedName,G.resolvedAvatar,G.avatarChanged?Date.now():null)}function dB(_){let{payload:$,setUserProfile:j}=_;j((Z)=>lB(Z,$))}function pB(_,$){if(Object.is(_,$))return!0;try{return JSON.stringify(_)===JSON.stringify($)}catch{return!1}}function oB(_){let{payload:$,setActiveModel:j,setActiveThinkingLevel:Z,setSupportsThinking:X,setActiveModelUsage:G,setAgentModelsPayload:q,setHasLoadedAgentModels:Q}=_;if($&&typeof $==="object")q?.((V)=>pB(V,$)?V:$),Q?.(!0);let K=vB($);if(K.hasModel)j((V)=>Object.is(V,K.model)?V:K.model);if(K.hasThinkingLevel){let V=K.thinkingLevelLabel??K.thinkingLevel;Z((Y)=>Object.is(Y,V)?Y:V)}if(K.hasSupportsThinking)X((V)=>V===K.supportsThinking?V:K.supportsThinking);if(K.hasProviderUsage)G((V)=>pB(V,K.providerUsage)?V:K.providerUsage)}async function iB(_){let{currentChatJid:$,getActiveChatAgents:j,getChatBranches:Z,activeChatJidRef:X,setActiveChatAgents:G}=_,q=$;try{let[Q,K]=await Promise.all([j().catch(()=>({chats:[]})),Z(null,{includeArchived:!0}).catch(()=>({chats:[]}))]);if(X.current!==q)return[];let V=rj(Q?.chats),Y=rj(K?.chats),N=uB(V,Y,q);return G(N),N}catch{if(X.current!==q)return[];return G([]),[]}}async function sB(_){let{currentRootChatJid:$,getChatBranches:j,setCurrentChatBranches:Z}=_;try{let X=await j($);Z(gB(X?.chats))}catch{Z([])}}function aB(_){let{response:$,refreshActiveChatAgents:j,refreshCurrentChatBranches:Z,refreshContextUsage:X,refreshAutoresearchStatus:G,refreshQueueState:q}=_;if(!$||typeof $!=="object")return;if(j(),Z(),X(),G(),BB($))q()}function tB(_){let{readStoredNumber:$,sidebarWidthRef:j,shellElement:Z,minWidth:X=160,maxWidth:G=600,fallbackWidth:q=280}=_,Q=$("sidebarWidth",null),K=Number.isFinite(Q)?Math.min(Math.max(Number(Q),X),G):q;if(j.current=K,Z)Z.style.setProperty("--sidebar-width",`${K}px`);return K}async function eB(_){let{currentHashtag:$,searchQuery:j,searchScope:Z,currentChatJid:X,currentRootChatJid:G,loadPosts:q,searchPosts:Q,setPosts:K,setHasMore:V,scrollToBottom:Y,isCancelled:N,scheduleRaf:F=(L)=>{if(typeof requestAnimationFrame==="function"){requestAnimationFrame(L);return}setTimeout(L,0)},scheduleTimeout:B=(L,x)=>{setTimeout(L,x)},onTimelineLoadStart:D,onTimelineDataReady:W,onTimelineFirstPaint:H,onTimelineError:z}=_,k=(L)=>{if(N())return;F(()=>{if(N())return;F(()=>{if(N())return;H?.(L)})})},J=()=>{if(N())return;F(()=>{if(N())return;B(()=>{if(N())return;Y()},0)})};if($){D?.({mode:"hashtag",hashtag:$});try{if(await q($),N())return;W?.({mode:"hashtag",hashtag:$}),k({mode:"hashtag"})}catch(L){if(N())return;throw z?.(L,{mode:"hashtag",hashtag:$}),L}return}if(j){D?.({mode:"search",searchQuery:j,searchScope:Z});try{let L=await Q(j,50,0,X,Z,G);if(N())return;K(Array.isArray(L?.results)?L.results:[]),V(!1),W?.({mode:"search",resultCount:Array.isArray(L?.results)?L.results.length:0}),k({mode:"search"})}catch(L){if(N())return;z?.(L,{mode:"search",searchQuery:j,searchScope:Z}),console.error("Failed to search:",L),K([]),V(!1)}return}D?.({mode:"timeline"});try{if(await q(),N())return;W?.({mode:"timeline"}),k({mode:"timeline"}),J()}catch(L){if(N())return;z?.(L,{mode:"timeline"}),console.error("Failed to load timeline:",L)}}Y6();T1();function zy(_){let{refreshModelAndQueueState:$,refreshModelState:j,refreshActiveChatAgents:Z,refreshCurrentChatBranches:X,refreshQueueState:G,runImmediately:q=!0,intervalMs:Q=60000,scheduleInterval:K=(N,F)=>setInterval(N,F),clearScheduledInterval:V=(N)=>clearInterval(N)}=_;if(q)$();let Y=K(()=>{j(),Z(),X(),G()},Q);return()=>{V(Y)}}function Wy(_){let{refreshModelState:$,refreshActiveChatAgents:j,refreshCurrentChatBranches:Z,refreshQueueState:X,refreshContextUsage:G,refreshAutoresearchStatus:q,prewarmLimit:Q=5}=_;$(),j({prewarmRecent:!0,prewarmLimit:Q}),Z(),X(),G(),q()}function Hy(_){let $=XB(_.chats,_.currentChatJid,_.prewarmLimit??5);if($.length===0)return;GB({chatJids:$,fetchTimeline:_.fetchTimeline??((j)=>n$(10,null,j))})}function _F(_){let{getAgents:$,setAgents:j,setUserProfile:Z,applyBranding:X,readStoredNumber:G,sidebarWidthRef:q,appShellRef:Q,currentChatJid:K,currentRootChatJid:V,getAgentModels:Y,getAgentContext:N,getActiveChatAgents:F,getChatBranches:B,activeChatJidRef:D,setActiveChatAgents:W,setCurrentChatBranches:H,setActiveModel:z,setActiveThinkingLevel:k,setSupportsThinking:J,setActiveModelUsage:L,setAgentModelsPayload:x,setHasLoadedAgentModels:I,agentsRef:E,refreshQueueState:M,refreshContextUsage:O,refreshAutoresearchStatus:T,setContextUsage:y,setExtensionWorkingState:A}=_,P=R(async()=>{await rB({getAgents:$,setAgents:j,setUserProfile:Z,applyBranding:X})},[X,$,j,Z]);b(()=>{P(),tB({readStoredNumber:G,sidebarWidthRef:q,shellElement:Q.current,maxWidth:L6(Number.POSITIVE_INFINITY)})},[Q,P,G,q]);let f=R((j0)=>{oB({payload:j0,setActiveModel:z,setActiveThinkingLevel:k,setSupportsThinking:J,setActiveModelUsage:L,setAgentModelsPayload:x,setHasLoadedAgentModels:I})},[z,L,k,x,I,J]),u=R(()=>P2("thread-switch",K),[K]),c=R(()=>{return k$({kind:"model-state",chatJid:K,run:async()=>{let j0=u();if(j0)Q_(j0,"runtime-hydration-start",{phase:"model-state"});let Q0=K;try{let[h,$0]=await Promise.all([(async()=>{let L0=j0||u();if(L0)Q_(L0,"model-request-start",{chatJid:Q0});let a=await Y(Q0);if(L0)Q_(L0,"model-request-ready",{chatJid:Q0,hasCurrent:Boolean(a?.current),modelCount:Array.isArray(a?.models)?a.models.length:0});return a})(),N(Q0).catch(()=>null)]);if(D.current&&D.current!==Q0)return null;f(h);let K0=G4($0);if(K0&&K0.percent!=null)y((L0)=>v4(L0,K0)?L0:K0),P5(Q0,K0)}catch{if(D.current&&D.current!==Q0)return null;f(null)}let F0=j0||u();if(F0)Q_(F0,"runtime-hydration-ready",{chatJid:K}),f2(F0,["runtime-hydration-ready","timeline-first-paint"],"settled",{chatJid:K});return null}})},[D,f,K,N,Y,u,y]);b(()=>{PB({chatJid:K}),z(null),k(null),J(!1),L(null),I(!1),x(null),A({message:null,indicator:null,visible:!0});let j0=AB(K);if(j0)y(j0);else y(null);c()},[K,c,z,L,k,x,y,A,I,J]);let r=R((j0)=>{nB({payload:j0,agentsRef:E,setAgents:j,applyBranding:X})},[E,X,j]),e=R((j0)=>{dB({payload:j0,setUserProfile:Z})},[Z]),m=R((j0)=>{let Q0=Boolean(j0?.prewarmRecent),F0=Number.isFinite(j0?.prewarmLimit)?Number(j0?.prewarmLimit):5;return k$({kind:"active-chat-agents",chatJid:K,run:async()=>{let h=u(),$0=await iB({currentChatJid:K,getActiveChatAgents:async()=>{if(h)Q_(h,"active-chat-list-request-start",{chatJid:K});let K0=await F(K);if(h)Q_(h,"active-chat-list-request-ready",{rowCount:Array.isArray(K0?.chats)?K0.chats.length:0});return K0},getChatBranches:async(K0,L0)=>{if(h)Q_(h,"branch-list-request-start",{rootChatJid:K0});let a=await B(K0,L0);if(h)Q_(h,"branch-list-request-ready",{rootChatJid:K0,rowCount:Array.isArray(a?.chats)?a.chats.length:0});return a},activeChatJidRef:D,setActiveChatAgents:W});if(Q0)Hy({chats:$0,currentChatJid:K,prewarmLimit:F0});return null}})},[D,K,F,B,u,W]),_0=R(()=>{return k$({kind:"current-chat-branches",chatJid:K,run:async()=>{let j0=u();return await sB({currentRootChatJid:V,getChatBranches:async(Q0,F0)=>{if(j0)Q_(j0,"root-branch-request-start",{rootChatJid:Q0});let h=await B(Q0,F0);if(j0)Q_(j0,"root-branch-request-ready",{rootChatJid:Q0,rowCount:Array.isArray(h?.chats)?h.chats.length:0});return h},setCurrentChatBranches:H}),null}})},[K,V,B,u,H]),H0=R(()=>{yB({refreshModelState:c,refreshActiveChatAgents:m,refreshCurrentChatBranches:_0,refreshQueueState:M,refreshContextUsage:O,refreshAutoresearchStatus:T})},[m,T,O,_0,c,M]),X0=R(()=>{Wy({refreshModelState:c,refreshActiveChatAgents:m,refreshCurrentChatBranches:_0,refreshQueueState:M,refreshContextUsage:O,refreshAutoresearchStatus:T,prewarmLimit:5})},[m,T,O,_0,c,M]);return b(()=>zy({refreshModelAndQueueState:H0,refreshModelState:c,refreshActiveChatAgents:m,refreshCurrentChatBranches:_0,refreshQueueState:M,runImmediately:!1}),[m,_0,H0,c,M]),b(()=>{let j0=setInterval(()=>{c()},5000);return()=>clearInterval(j0)},[c]),{updateAgentProfile:r,updateUserProfile:e,applyModelState:f,refreshModelState:c,refreshActiveChatAgents:m,refreshCurrentChatBranches:_0,refreshModelAndQueueState:H0,refreshPostPaintThreadState:X0}}M0();function Oy(_,$){let j=D_(_);return Boolean(_&&j===$)}function R5(_,$,j){if(!Oy(_,$))return _;return{..._,runtimeState:{..._?.runtimeState&&typeof _.runtimeState==="object"?_.runtimeState:{},...j}}}function $F(_,$){return{..._,openedAt:$}}function jF(_){let $=D_(_);return{nextWidget:null,dismissedSessionKey:_?.source==="live"&&$?$:null}}function ZF(_,$,j){let Z=nV({...$,...$&&$.status?{}:{status:j.fallbackStatus||"streaming"}});if(!Z)return _;let X=D_(Z);if(X&&j.dismissedSessionKeys?.has(X))return _;let G=D_(_),q=Boolean(X&&G&&X===G),Q={...q&&_?.artifact?_.artifact:{},...Z.artifact||{}};return{...q&&_?_:{},...Z,artifact:Q,source:"live",originChatJid:Z.originChatJid||j.currentChatJid,openedAt:q&&_?.openedAt?_.openedAt:j.updatedAt,liveUpdatedAt:j.updatedAt}}function XF(_,$){if(!_||_?.source!=="live")return _||null;let j=D_($),Z=D_(_);if(j&&Z&&j!==Z)return _;return null}function GF(_,$,j){return R5(_,$,{lastEventKind:j.kind,lastEventPayload:j.payload||null,lastSubmitAt:j.submittedAt,lastHostUpdate:{type:"submit_pending",submittedAt:j.submittedAt,preview:j.submissionText||null}})}function nj(_,$,j){if(j.errorMessage)return R5(_,$,{lastHostUpdate:{type:"submit_failed",submittedAt:j.submittedAt,preview:j.submissionText,error:j.errorMessage}});return R5(_,$,{lastHostUpdate:{type:j.queued==="followup"?"submit_queued":"submit_sent",submittedAt:j.submittedAt,preview:j.submissionText,queued:j.queued||null}})}function qF(_,$,j){return R5(_,$,{lastEventKind:j.kind,lastEventPayload:j.payload||null,...j.kind==="widget.ready"?{readyAt:j.eventAt,lastHostUpdate:{type:"ready_ack",at:j.eventAt}}:{},...j.kind==="widget.request_refresh"?{lastRefreshRequestAt:j.eventAt,refreshCount:j.nextRefreshCount,lastHostUpdate:{type:j.shouldBuildDashboard?"refresh_building":"refresh_ack",at:j.eventAt,count:j.nextRefreshCount,echo:j.payload||null}}:{}})}function QF(_,$,j){return R5(_,$,{dashboard:j.dashboard,lastHostUpdate:{type:"refresh_dashboard",at:j.at,count:j.count,echo:j.echo||null}})}function VF(_,$,j){return R5(_,$,{lastHostUpdate:{type:"refresh_failed",at:j.at,count:j.count,error:j.errorMessage}})}Y6();function Ly(_){let{setExtensionStatusPanels:$,setPendingExtensionPanelActions:j,setExtensionWorkingState:Z}=_;$(new Map),j(new Set),Z({message:null,indicator:null,visible:!0})}function KF(_){let{refreshAgentStatus:$,refreshPostPaintThreadState:j}=_;j(),$()}function YF(_){let{currentChatJid:$,currentRootChatJid:j,currentHashtag:Z,searchQuery:X,searchScope:G,loadPosts:q,searchPosts:Q,setPosts:K,setHasMore:V,scrollToBottom:Y,setExtensionStatusPanels:N,setPendingExtensionPanelActions:F,setExtensionWorkingState:B,paneStateOwnerChatJidRef:D,chatPaneStateByChatRef:W,snapshotCurrentChatPaneState:H,restoreChatPaneState:z,dismissedQueueRowIdsRef:k,refreshAgentStatus:J,viewStateRef:L,refreshTimeline:x,refreshModelAndQueueState:I,refreshPostPaintThreadState:E,setFloatingWidget:M,dismissedLiveWidgetKeysRef:O}=_;b(()=>{Ly({setExtensionStatusPanels:N,setPendingExtensionPanelActions:F,setExtensionWorkingState:B})},[$,N,F,B]),b(()=>{let A=!1,P=Zq("thread-switch",$,{currentRootChatJid:j,currentHashtag:Z||null,searchQuery:X||null,searchScope:G});return Q_(P,"route-effect-start",{currentChatJid:$,currentRootChatJid:j}),eB({currentHashtag:Z,searchQuery:X,searchScope:G,currentChatJid:$,currentRootChatJid:j,loadPosts:q,searchPosts:Q,setPosts:K,setHasMore:V,scrollToBottom:Y,isCancelled:()=>A,onTimelineLoadStart:(f)=>{Q_(P,"timeline-load-start",f||null)},onTimelineDataReady:(f)=>{Q_(P,"timeline-data-ready",f||null)},onTimelineFirstPaint:(f)=>{Q_(P,"timeline-first-paint",f||null),f2(P,["runtime-hydration-ready","timeline-first-paint"],"settled",f||null),KF({refreshAgentStatus:J,refreshPostPaintThreadState:E})},onTimelineError:(f,u)=>{Xq(P,f,"timeline-load-failed",u||null),KF({refreshAgentStatus:J,refreshPostPaintThreadState:E})}}),()=>{A=!0,Gq(P,"route-effect-cancelled",{currentChatJid:$})}},[$,Z,X,G,j,q,Y,Q,V,K,J,E]),b(()=>{let A=D.current||$;W.current.set(A,H())},[W,$,D,H]),b(()=>{let A=D.current||$;if(A===$)return;W.current.set(A,H()),D.current=$,k.current.clear(),z(W.current.get($)||null)},[W,$,k,D,z,H]);let T=R(()=>{wB({viewStateRef:L,refreshTimeline:x,refreshModelAndQueueState:I})},[I,x,L]),y=R((A,P="streaming")=>{let f=new Date().toISOString();M((u)=>ZF(u,A,{fallbackStatus:P,currentChatJid:$,dismissedSessionKeys:O.current,updatedAt:f}))},[$,O,M]);return{refreshCurrentView:T,applyLiveGeneratedWidgetUpdate:y}}M0();M0();T1();function Jy({sse:_,onWake:$},j={}){let Z=j.window??(typeof window<"u"?window:null),X=j.document??(typeof document<"u"?document:null);if(!Z||!X||!_)return()=>{};let G=()=>{if(typeof _.forceReconnect==="function"){_.forceReconnect();return}_.reconnectIfNeeded()},q=typeof j.useFocusReconnect==="boolean"?j.useFocusReconnect:!E6(),Q=X.visibilityState&&X.visibilityState!=="visible",K=()=>{if(X.visibilityState&&X.visibilityState!=="visible")return Q=!0,!0;return!1},V=()=>{if(K())return;if(Q)Q=!1,G(),$?.()},Y=()=>{if(K())return;if(Q){V();return}if(q)_.reconnectIfNeeded()},N=()=>{V()},F=()=>{V()};return Z.addEventListener("focus",Y),Z.addEventListener("pageshow",N),X.addEventListener("visibilitychange",F),()=>{Z.removeEventListener("focus",Y),Z.removeEventListener("pageshow",N),X.removeEventListener("visibilitychange",F)}}function NF({handleSseEvent:_,handleConnectionStatusChange:$,loadPosts:j,onWake:Z,chatJid:X}){let G=g(_);G.current=_;let q=g($);q.current=$;let Q=g(j);Q.current=j;let K=g(Z);K.current=Z,b(()=>{let V=new m2((N,F)=>G.current(N,F),(N)=>q.current(N),{chatJid:X});V.connect();let Y=Jy({sse:V,onWake:()=>K.current?.()});return()=>{Y(),V.disconnect()}},[X])}X6();i2();function m4(_,$){return Boolean(_)&&Boolean($)&&_!==$}function S5(_,$){return Boolean(_)&&!Boolean($)}function BF(_,$){return _||$||null}function FF(_){switch(_){case"generated_widget_open":return{kind:"update",fallbackStatus:"loading",shouldAdoptTurn:!0};case"generated_widget_delta":return{kind:"update",fallbackStatus:"streaming",shouldAdoptTurn:!0};case"generated_widget_final":return{kind:"update",fallbackStatus:"final",shouldAdoptTurn:!0};case"generated_widget_error":return{kind:"update",fallbackStatus:"error",shouldAdoptTurn:!1};case"generated_widget_close":return{kind:"close",fallbackStatus:null,shouldAdoptTurn:!1};default:return{kind:null,fallbackStatus:null,shouldAdoptTurn:!1}}}function b5(_,$){let j=$?.row_id??$?.id;if(j==null||typeof j!=="string"&&typeof j!=="number")return null;let Z=X4(_,j);return{rowId:j,items:Z.items,remainingQueueCount:Z.remainingQueueCount}}function dj(_){if(_==="steer")return{title:"Failed to steer message",detail:"The queued message could not be sent as steering."};return{title:"Failed to remove message",detail:"The queued message could not be removed."}}function Ey(_,$){return typeof _?.chat_jid==="string"&&_.chat_jid.trim()?_.chat_jid.trim():$}function UF(_,$,j){return{isStatusPanelWidgetEvent:_==="extension_ui_widget"&&$?.options?.surface==="status-panel",eventChatJid:Ey($,j),panelKey:typeof $?.key==="string"?$.key:""}}function Ay(_,$){if(_!=="extension_ui_working_indicator")return;if(!Array.isArray($?.frames))return{mode:"default",frames:[],intervalMs:null};let j=$.frames.filter((G)=>typeof G==="string"),Z=$.interval_ms??$.intervalMs,X=typeof Z==="number"&&Number.isFinite(Z)&&Z>0?Z:null;if(j.length===0)return{mode:"hidden",frames:[],intervalMs:X};return{mode:"custom",frames:j,intervalMs:X}}function DF(_,$,j){if($==="extension_ui_working_visible"){let X=j?.visible!==!1;if(X===_.visible)return;return{..._,visible:X}}if($==="extension_ui_working")return{message:typeof j?.message==="string"&&j.message.trim()?j.message.trim():null,indicator:_.indicator,visible:_.visible};if($==="extension_ui_status"){if(j?.key==="context_usage")return;return{message:typeof j?.text==="string"&&j.text.trim()?j.text.trim():null,indicator:_.indicator,visible:_.visible}}let Z=Ay($,j);if(Z===void 0)return;return{message:_.message,indicator:Z,visible:_.visible}}function zF(_,$){if(_!=="extension_ui_status")return null;if($?.key!=="context_usage")return null;let j=typeof $?.text==="string"?$.text.trim():"";if(!j)return null;try{let Z=JSON.parse(j);if(!Z||typeof Z!=="object")return null;let X=Z,G=X.tokens==null?null:Number(X.tokens),q=X.contextWindow==null?null:Number(X.contextWindow),Q=X.percent==null?null:Number(X.percent);return{tokens:Number.isFinite(G)?G:null,contextWindow:Number.isFinite(q)?q:null,percent:Number.isFinite(Q)?Q:null,estimated:X.estimated===!0,source:typeof X.source==="string"?X.source:null,phase:typeof X.phase==="string"?X.phase:null}}catch{return null}}function WF(_,$){if(_==="extension_ui_notify"&&typeof $?.message==="string")return{title:$.message,detail:null,kind:typeof $?.type==="string"&&$.type.trim()?$.type:"info"};if(_==="extension_ui_error"){let j=$?.error;return{title:"Extension UI error",detail:typeof j==="string"?j:j&&typeof j==="object"&&typeof j.error==="string"?j.error:j?String(j):"Unknown extension error",kind:"error",durationMs:5000}}return null}var My=new Set(["extension_ui_request","extension_ui_timeout","extension_ui_notify","extension_ui_status","extension_ui_working","extension_ui_working_indicator","extension_ui_working_visible","extension_ui_widget","extension_ui_title","extension_ui_editor_text","extension_ui_error"]);function HF(_){return My.has(String(_||"").trim())}function ky(_){let $=String(_||"").trim();if(!$.startsWith("extension_ui_"))return"piclaw-extension-ui";return`piclaw-extension-ui:${$.slice(13).replace(/_/g,"-")}`}function d8(_,$,j=globalThis.window){if(!j||typeof j.dispatchEvent!=="function"||typeof CustomEvent>"u")return!1;let Z={type:_,payload:$};return j.dispatchEvent(new CustomEvent("piclaw-extension-ui",{detail:Z})),j.dispatchEvent(new CustomEvent(ky(_),{detail:Z})),!0}function OF(_,$,j){let Z=$?.turn_id,X=$?.chat_jid,G=typeof X==="string"&&X.trim()?X.trim():null,q=_==="connected"||_==="workspace_update";return{turnId:Z,eventChatJid:G,isGlobalUiEvent:q,isCurrentChatEvent:G?G===j:q}}function LF(_){return _==="agent_draft_delta"||_==="agent_thought_delta"||_==="agent_draft"||_==="agent_thought"}function JF(_,$,j){let{currentChatJid:Z,updateAgentProfile:X,updateUserProfile:G,currentTurnIdRef:q,activeChatJidRef:Q,pendingRequestRef:K,draftBufferRef:V,thoughtBufferRef:Y,previewResyncPendingRef:N,previewResyncGenerationRef:F,steerQueuedTurnIdRef:B,thoughtExpandedRef:D,draftExpandedRef:W,draftThrottleRef:H,thoughtThrottleRef:z,viewStateRef:k,followupQueueItemsRef:J,dismissedQueueRowIdsRef:L,scrollToBottomRef:x,hasMoreRef:I,loadMoreRef:E,lastAgentResponseRef:M,wasAgentActiveRef:O,setActiveTurn:T,applyLiveGeneratedWidgetUpdate:y,setFloatingWidget:A,clearLastActivityFlag:P,handleUiVersionDrift:f,setAgentStatus:u,setAgentDraft:c,setAgentPlan:r,setAgentThought:e,setPendingRequest:m,clearAgentRunState:_0,getAgentStatus:H0,noteAgentActivity:X0,showLastActivity:j0,refreshTimeline:Q0,refreshModelAndQueueState:F0,refreshActiveChatAgents:h,refreshCurrentChatBranches:$0,notifyForFinalResponse:K0,setContextUsage:L0,refreshContextUsage:a,refreshQueueState:G0,setFollowupQueueItems:O0,clearQueuedSteerStateIfStale:P0,setSteerQueuedTurnId:p0,applyModelState:g0,getAgentContext:X1,setExtensionStatusPanels:l0,setPendingExtensionPanelActions:a0,setExtensionWorkingState:f0,refreshActiveEditorFromWorkspace:i0,showIntentToast:m0,removeStalledPost:e0,setPosts:s0,preserveTimelineScrollTop:D1,openEditor:G1}=j,{turnId:c0,isCurrentChatEvent:J0}=OF(_,$,Z);if(J0)X($),G($);if(_==="ui_theme"){z5($);return}if(_==="ui_meters"){W9($);return}if(_==="ui_open_tab"){let z0=typeof $?.path==="string"?$.path.trim():"",b0=typeof $?.label==="string"?$.label.trim():void 0;if(z0==="piclaw://settings"){let x0=typeof $?.section==="string"?$.section.trim():"";window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:x0?{section:x0}:void 0}));return}if(z0&&typeof G1==="function")G1(z0,b0?{label:b0}:void 0);return}let V1=FF(_);if(V1.kind==="update"){if(!J0)return;if(V1.shouldAdoptTurn&&S5(c0,q.current))T(c0);y($,V1.fallbackStatus||"streaming");return}if(V1.kind==="close"){if(!J0)return;A((z0)=>XF(z0,$));return}if(_?.startsWith("agent_")&&!LF(_))P();if(_==="connected"){if(f($?.app_asset_version))return;if($?.ui_theme){let x0=$.ui_theme.theme||"default",n0=$.ui_theme.tint||null;z5({theme:x0,tint:n0})}if($?.ui_meters)W9($.ui_meters);let z0=F.current+1;if(F.current=z0,N.current=!0,V.current="",Y.current="",u(null),c({text:"",totalLines:0}),r(""),e({text:"",totalLines:0}),f0({message:null,indicator:null,visible:!0}),m(null),K.current=null,_0(),g6(Z)){if(F.current===z0)N.current=!1;return}let b0=Z;if(H0(b0).then((x0)=>{if(Q.current!==b0)return;if(!x0||x0.status!=="active"||!x0.data)return;let n0=x0.data,E1=v8(n0);if(E1)T(E1);u(n0),X0({clearSilence:!0,atMs:o$(n0)??Date.now()}),j0(n0);let Y1=C5(x0.thought);if(Y1)Y.current=Y1.text,e(Y1);let z1=C5(x0.draft);if(z1)V.current=z1.text,c(z1)}).catch((x0)=>{console.warn("Failed to fetch agent status:",x0)}).finally(()=>{if(F.current===z0)N.current=!1}),e_(k.current))Q0();F0();return}if(_==="agent_status"){if(!J0){if($?.type==="done"||$?.type==="error")h(),$0();return}let z0=G4($.context_usage);if(z0&&z0.percent!=null)L0((b0)=>v4(b0,z0)?b0:z0),P5(Z,z0);if($.type==="context_usage")return;if($.type==="done"||$.type==="error"){if(m4(c0,q.current))return;if($.type==="done"){if(K0(c0||q.current),e_(k.current))Q0()}if(a(),O.current=!1,_0(),L.current.clear(),h(),F0(),c({text:"",totalLines:0}),r(""),e({text:"",totalLines:0}),f0({message:null,indicator:null,visible:!0}),m(null),$.type==="error")u({type:"error",title:$.title||"Agent error"}),setTimeout(()=>u(null),8000);else u(null)}else{if(c0)T(c0);if(X0({running:!0,clearSilence:!0,atMs:o$($)??Date.now()}),$.type==="thinking")V.current="",Y.current="",c({text:"",totalLines:0}),r(""),e({text:"",totalLines:0});u($)}return}if(_==="agent_steer_queued"){if(!J0)return;if(m4(c0,q.current))return;let z0=BF(c0,q.current);if(!z0)return;B.current=z0,p0(z0);return}if(_==="agent_followup_queued"){if(!J0)return;O0((z0)=>NB(z0,$)),G0();return}if(_==="agent_followup_consumed"){if(!J0)return;let z0=b5(J.current,$);if(z0)P0(z0.remainingQueueCount),O0((b0)=>X4(b0,z0.rowId).items);if(G0(),e_(k.current))Q0();return}if(_==="agent_followup_removed"){if(!J0)return;let z0=b5(J.current,$);if(z0)L.current.add(z0.rowId),P0(z0.remainingQueueCount),O0((b0)=>X4(b0,z0.rowId).items);G0();return}if(_==="agent_draft_delta"){if(!J0)return;if(N.current)return;if(m4(c0,q.current))return;if(S5(c0,q.current))T(c0);X0({running:!0,clearSilence:!0}),V.current=hN(V.current,$);let z0=Date.now();if(!H.current||z0-H.current>=100){H.current=z0;let b0=V.current;if(W.current)c((x0)=>uj(b0,x0));else c(m8(b0,null))}return}if(_==="agent_draft"){if(!J0)return;if(N.current)return;if(m4(c0,q.current))return;if(S5(c0,q.current))T(c0);X0({running:!0,clearSilence:!0});let z0=$.text||"",b0=$.mode||($.kind==="plan"?"replace":"append");if($.kind==="plan")r((x0)=>cN(x0,z0,b0));else if(!W.current)V.current=z0,c(m8(z0,$.total_lines));return}if(_==="agent_thought_delta"){if(!J0)return;if(N.current)return;if(m4(c0,q.current))return;if(S5(c0,q.current))T(c0);X0({running:!0,clearSilence:!0}),Y.current=lN(Y.current,$);let z0=Date.now();if(D.current&&(!z.current||z0-z.current>=100)){z.current=z0;let b0=Y.current;e((x0)=>uj(b0,x0))}return}if(_==="agent_thought"){if(!J0)return;if(N.current)return;if(m4(c0,q.current))return;if(S5(c0,q.current))T(c0);X0({running:!0,clearSilence:!0});let z0=$.text||"";if(!D.current)Y.current=z0,e(m8(z0,$.total_lines));return}if(_==="model_changed"){if(!J0)return;g0($);let z0=Z;X1(z0).then((b0)=>{if(Q.current!==z0)return;let x0=G4(b0);if(x0&&x0.percent!=null)L0((n0)=>v4(n0,x0)?n0:x0),P5(z0,x0)}).catch(()=>{if(Q.current!==z0)return});return}let o0=UF(_,$,Z);if(o0.isStatusPanelWidgetEvent){if(o0.eventChatJid!==Z)return;if(!o0.panelKey)return;if(l0((z0)=>WB(z0,$)),HB($))a0((z0)=>l8(z0,o0.panelKey));d8(_,$);return}if(_==="workspace_update"){if(typeof window<"u")window.dispatchEvent(new CustomEvent("workspace-update",{detail:$}));i0($?.updates);return}if(HF(_)){if(_==="extension_ui_title"){h(),$0(),d8(_,$);return}if(!J0)return;let z0=zF(_,$);if(z0&&z0.percent!=null)L0((x0)=>v4(x0,z0)?x0:z0);f0((x0)=>{return DF(x0,_,$)??x0}),d8(_,$);let b0=WF(_,$);if(b0)m0(b0.title,b0.detail,b0.kind,b0.durationMs);return}let H1=e_(k.current);if(_==="agent_response"){if(!J0)return;f0({message:null,indicator:null,visible:!0}),e0(),M.current={post:$,turnId:q.current}}if(pN(_,J0,H1))s0((z0)=>rN(z0,$)),x.current?.();if(_==="interaction_updated"){if(!vj(J0,H1))return;s0((z0)=>nN(z0,$))}if(_==="interaction_deleted"){if(!vj(J0,H1))return;let z0=$?.ids||[];if(z0.length){if(D1(()=>{s0((b0)=>dN(b0,z0))}),I.current)E.current?.({preserveScroll:!0,preserveMode:"top"})}}}function Ty(_){return _?15000:60000}function EF(_){let{currentChatJid:$,posts:j,scrollToMessage:Z,handleConnectionStatusChange:X,loadPosts:G,refreshCurrentView:q,updateAgentProfile:Q,updateUserProfile:K,currentTurnIdRef:V,activeChatJidRef:Y,pendingRequestRef:N,draftBufferRef:F,thoughtBufferRef:B,previewResyncPendingRef:D,previewResyncGenerationRef:W,steerQueuedTurnIdRef:H,thoughtExpandedRef:z,draftExpandedRef:k,draftThrottleRef:J,thoughtThrottleRef:L,viewStateRef:x,followupQueueItemsRef:I,dismissedQueueRowIdsRef:E,scrollToBottomRef:M,hasMoreRef:O,loadMoreRef:T,lastAgentResponseRef:y,wasAgentActiveRef:A,setActiveTurn:P,applyLiveGeneratedWidgetUpdate:f,setFloatingWidget:u,clearLastActivityFlag:c,handleUiVersionDrift:r,setAgentStatus:e,setAgentDraft:m,setAgentPlan:_0,setAgentThought:H0,setPendingRequest:X0,clearAgentRunState:j0,getAgentStatus:Q0,noteAgentActivity:F0,showLastActivity:h,refreshTimeline:$0,refreshModelAndQueueState:K0,refreshActiveChatAgents:L0,refreshCurrentChatBranches:a,notifyForFinalResponse:G0,setContextUsage:O0,refreshContextUsage:P0,refreshQueueState:p0,setFollowupQueueItems:g0,clearQueuedSteerStateIfStale:X1,setSteerQueuedTurnId:l0,applyModelState:a0,getAgentContext:f0,setExtensionStatusPanels:i0,setPendingExtensionPanelActions:m0,setExtensionWorkingState:e0,refreshActiveEditorFromWorkspace:s0,showIntentToast:D1,removeStalledPost:G1,setPosts:c0,preserveTimelineScrollTop:J0,openEditor:V1,finalizeStalledResponse:o0,connectionStatus:H1,agentStatus:z0,refreshAgentStatus:b0,refreshAutoresearchStatus:x0}=_,n0=R((Y1,z1)=>{JF(Y1,z1,{currentChatJid:$,updateAgentProfile:Q,updateUserProfile:K,currentTurnIdRef:V,activeChatJidRef:Y,pendingRequestRef:N,draftBufferRef:F,thoughtBufferRef:B,previewResyncPendingRef:D,previewResyncGenerationRef:W,steerQueuedTurnIdRef:H,thoughtExpandedRef:z,draftExpandedRef:k,draftThrottleRef:J,thoughtThrottleRef:L,viewStateRef:x,followupQueueItemsRef:I,dismissedQueueRowIdsRef:E,scrollToBottomRef:M,hasMoreRef:O,loadMoreRef:T,lastAgentResponseRef:y,wasAgentActiveRef:A,setActiveTurn:P,applyLiveGeneratedWidgetUpdate:f,setFloatingWidget:u,clearLastActivityFlag:c,handleUiVersionDrift:r,setAgentStatus:e,setAgentDraft:m,setAgentPlan:_0,setAgentThought:H0,setPendingRequest:X0,clearAgentRunState:j0,getAgentStatus:Q0,noteAgentActivity:F0,showLastActivity:h,refreshTimeline:$0,refreshModelAndQueueState:K0,refreshActiveChatAgents:L0,refreshCurrentChatBranches:a,notifyForFinalResponse:G0,setContextUsage:O0,refreshContextUsage:P0,refreshQueueState:p0,setFollowupQueueItems:g0,clearQueuedSteerStateIfStale:X1,setSteerQueuedTurnId:l0,applyModelState:a0,getAgentContext:f0,setExtensionStatusPanels:i0,setPendingExtensionPanelActions:m0,setExtensionWorkingState:e0,refreshActiveEditorFromWorkspace:s0,showIntentToast:D1,removeStalledPost:G1,setPosts:c0,preserveTimelineScrollTop:J0,openEditor:V1})},[Y,f,a0,j0,c,X1,$,V,E,F,k,J,I,f0,Q0,r,O,y,T,F0,G0,N,J0,W,D,L0,s0,P0,a,K0,p0,$0,G1,M,P,m,_0,e,H0,O0,i0,e0,u,g0,m0,X0,c0,l0,D1,h,H,B,z,L,Q,K,x,A,V1]);b(()=>{if(typeof window>"u")return;let Y1=window.__PICLAW_TEST_API||{};return Y1.emit=n0,Y1.reset=()=>{G1(),j0(),e(null),m({text:"",totalLines:0}),_0(""),H0({text:"",totalLines:0}),e0({message:null,indicator:null,visible:!0}),X0(null)},Y1.finalize=()=>o0(),window.__PICLAW_TEST_API=Y1,()=>{if(window.__PICLAW_TEST_API===Y1)window.__PICLAW_TEST_API=void 0}},[j0,o0,n0,G1,m,_0,e,H0,e0,X0]),NF({handleSseEvent:n0,handleConnectionStatusChange:X,loadPosts:G,onWake:q,chatJid:$}),b(()=>{if(!j||j.length===0)return;let Y1=location.hash;if(!Y1||!Y1.startsWith("#msg-"))return;let z1=Y1.slice(5);Z(z1),history.replaceState(null,"",location.pathname+location.search)},[j,Z]);let E1=z0!==null;b(()=>{if(H1!=="connected")return;let Y1=Ty(E1),z1=setInterval(()=>{SB({viewStateRef:x,isAgentActive:E1,refreshTimeline:$0,refreshQueueState:p0,refreshAgentStatus:b0,refreshContextUsage:P0,refreshAutoresearchStatus:x0})},Y1);return()=>clearInterval(z1)},[H1,E1,b0,x0,P0,p0,$0,x]),b(()=>{return R8(()=>{b0(),P0(),p0(),x0()})},[b0,x0,P0,p0])}function yy(_){return{currentChatJid:_.currentChatJid,activeChatJidRef:_.activeChatJidRef,queueRefreshGenRef:_.queueRefreshGenRef,dismissedQueueRowIdsRef:_.dismissedQueueRowIdsRef,getAgentQueueState:_.getAgentQueueState,setFollowupQueueItems:_.setFollowupQueueItems,clearQueuedSteerStateIfStale:_.clearQueuedSteerStateIfStale,getAgentContext:_.getAgentContext,setContextUsage:_.setContextUsage,getAutoresearchStatus:_.getAutoresearchStatus,setExtensionStatusPanels:_.setExtensionStatusPanels,setPendingExtensionPanelActions:_.setPendingExtensionPanelActions,getAgentStatus:_.getAgentStatus,wasAgentActiveRef:_.wasAgentActiveRef,viewStateRef:_.viewStateRef,refreshTimeline:_.refreshTimeline,clearAgentRunState:_.clearAgentRunState,agentStatusRef:_.agentStatusRef,pendingRequestRef:_.pendingRequestRef,thoughtBufferRef:_.thoughtBufferRef,draftBufferRef:_.draftBufferRef,setAgentStatus:_.setAgentStatus,setAgentDraft:_.setAgentDraft,setAgentPlan:_.setAgentPlan,setAgentThought:_.setAgentThought,setPendingRequest:_.setPendingRequest,setActiveTurn:_.setActiveTurn,noteAgentActivity:_.noteAgentActivity,clearLastActivityFlag:_.clearLastActivityFlag,isAgentRunningRef:_.isAgentRunningRef,currentTurnIdRef:_.currentTurnIdRef,silentRecoveryRef:_.silentRecoveryRef,silenceRefreshMs:_.silenceRefreshMs,lastAgentEventRef:_.lastAgentEventRef,lastSilenceNoticeRef:_.lastSilenceNoticeRef,silenceWarningMs:_.silenceWarningMs,silenceFinalizeMs:_.silenceFinalizeMs,isCompactionStatus:_.isCompactionStatus,serverVersionContext:_.serverVersionContext,setConnectionStatus:_.setConnectionStatus,setStateAccessFailed:_.setStateAccessFailed,setPendingRequestForConnection:_.setPendingRequest,hasConnectedOnceRef:_.hasConnectedOnceRef}}function wy(_){return{getAgents:_.getAgents,setAgents:_.setAgents,setUserProfile:_.setUserProfile,applyBranding:_.applyBranding,readStoredNumber:_.readStoredNumber,sidebarWidthRef:_.sidebarWidthRef,appShellRef:_.appShellRef,currentChatJid:_.currentChatJid,currentRootChatJid:_.currentRootChatJid,getAgentModels:_.getAgentModels,getAgentContext:_.getAgentContext,getActiveChatAgents:_.getActiveChatAgents,getChatBranches:_.getChatBranches,activeChatJidRef:_.activeChatJidRef,setActiveChatAgents:_.setActiveChatAgents,setCurrentChatBranches:_.setCurrentChatBranches,setActiveModel:_.setActiveModel,setActiveThinkingLevel:_.setActiveThinkingLevel,setSupportsThinking:_.setSupportsThinking,setActiveModelUsage:_.setActiveModelUsage,setAgentModelsPayload:_.setAgentModelsPayload,setHasLoadedAgentModels:_.setHasLoadedAgentModels,agentsRef:_.agentsRef,refreshQueueState:_.refreshQueueState,refreshContextUsage:_.refreshContextUsage,refreshAutoresearchStatus:_.refreshAutoresearchStatus,setContextUsage:_.setContextUsage,setExtensionWorkingState:_.setExtensionWorkingState}}function Iy(_){return{currentChatJid:_.currentChatJid,currentRootChatJid:_.currentRootChatJid,currentHashtag:_.currentHashtag,searchQuery:_.searchQuery,searchScope:_.searchScope,loadPosts:_.loadPosts,searchPosts:_.searchPosts,setPosts:_.setPosts,setHasMore:_.setHasMore,scrollToBottom:_.scrollToBottom,setExtensionStatusPanels:_.setExtensionStatusPanels,setPendingExtensionPanelActions:_.setPendingExtensionPanelActions,setExtensionWorkingState:_.setExtensionWorkingState,paneStateOwnerChatJidRef:_.paneStateOwnerChatJidRef,chatPaneStateByChatRef:_.chatPaneStateByChatRef,snapshotCurrentChatPaneState:_.snapshotCurrentChatPaneState,restoreChatPaneState:_.restoreChatPaneState,dismissedQueueRowIdsRef:_.dismissedQueueRowIdsRef,refreshQueueState:_.refreshQueueState,refreshAgentStatus:_.refreshAgentStatus,refreshContextUsage:_.refreshContextUsage,viewStateRef:_.viewStateRef,refreshTimeline:_.refreshTimeline,refreshModelAndQueueState:_.refreshModelAndQueueState,refreshPostPaintThreadState:_.refreshPostPaintThreadState,setFloatingWidget:_.setFloatingWidget,dismissedLiveWidgetKeysRef:_.dismissedLiveWidgetKeysRef}}function xy(_){return{currentChatJid:_.currentChatJid,posts:_.posts,scrollToMessage:_.scrollToMessage,handleConnectionStatusChange:_.handleConnectionStatusChange,loadPosts:_.loadPosts,refreshCurrentView:_.refreshCurrentView,updateAgentProfile:_.updateAgentProfile,updateUserProfile:_.updateUserProfile,currentTurnIdRef:_.currentTurnIdRef,activeChatJidRef:_.activeChatJidRef,pendingRequestRef:_.pendingRequestRef,draftBufferRef:_.draftBufferRef,thoughtBufferRef:_.thoughtBufferRef,previewResyncPendingRef:_.previewResyncPendingRef,previewResyncGenerationRef:_.previewResyncGenerationRef,steerQueuedTurnIdRef:_.steerQueuedTurnIdRef,thoughtExpandedRef:_.thoughtExpandedRef,draftExpandedRef:_.draftExpandedRef,draftThrottleRef:_.draftThrottleRef,thoughtThrottleRef:_.thoughtThrottleRef,viewStateRef:_.viewStateRef,followupQueueItemsRef:_.followupQueueItemsRef,dismissedQueueRowIdsRef:_.dismissedQueueRowIdsRef,scrollToBottomRef:_.scrollToBottomRef,hasMoreRef:_.hasMoreRef,loadMoreRef:_.loadMoreRef,lastAgentResponseRef:_.lastAgentResponseRef,wasAgentActiveRef:_.wasAgentActiveRef,setActiveTurn:_.setActiveTurn,applyLiveGeneratedWidgetUpdate:_.applyLiveGeneratedWidgetUpdate,setFloatingWidget:_.setFloatingWidget,clearLastActivityFlag:_.clearLastActivityFlag,handleUiVersionDrift:_.handleUiVersionDrift,setAgentStatus:_.setAgentStatus,setAgentDraft:_.setAgentDraft,setAgentPlan:_.setAgentPlan,setAgentThought:_.setAgentThought,setPendingRequest:_.setPendingRequest,clearAgentRunState:_.clearAgentRunState,getAgentStatus:_.getAgentStatus,noteAgentActivity:_.noteAgentActivity,showLastActivity:_.showLastActivity,refreshTimeline:_.refreshTimeline,refreshModelAndQueueState:_.refreshModelAndQueueState,refreshActiveChatAgents:_.refreshActiveChatAgents,refreshCurrentChatBranches:_.refreshCurrentChatBranches,notifyForFinalResponse:_.notifyForFinalResponse,setContextUsage:_.setContextUsage,refreshContextUsage:_.refreshContextUsage,refreshQueueState:_.refreshQueueState,setFollowupQueueItems:_.setFollowupQueueItems,clearQueuedSteerStateIfStale:_.clearQueuedSteerStateIfStale,setSteerQueuedTurnId:_.setSteerQueuedTurnId,applyModelState:_.applyModelState,getAgentContext:_.getAgentContext,setExtensionStatusPanels:_.setExtensionStatusPanels,setPendingExtensionPanelActions:_.setPendingExtensionPanelActions,setExtensionWorkingState:_.setExtensionWorkingState,refreshActiveEditorFromWorkspace:_.refreshActiveEditorFromWorkspace,showIntentToast:_.showIntentToast,removeStalledPost:_.removeStalledPost,setPosts:_.setPosts,preserveTimelineScrollTop:_.preserveTimelineScrollTop,finalizeStalledResponse:_.finalizeStalledResponse,connectionStatus:_.connectionStatus,agentStatus:_.agentStatus,refreshAgentStatus:_.refreshAgentStatus,refreshAutoresearchStatus:_.refreshAutoresearchStatus}}function AF(_){let $=bB(yy(_)),j=_F(wy({..._,refreshQueueState:$.refreshQueueState,refreshContextUsage:$.refreshContextUsage,refreshAutoresearchStatus:$.refreshAutoresearchStatus})),Z=YF(Iy({..._,refreshQueueState:$.refreshQueueState,refreshAgentStatus:$.refreshAgentStatus,refreshContextUsage:$.refreshContextUsage,refreshModelAndQueueState:j.refreshModelAndQueueState,refreshPostPaintThreadState:j.refreshPostPaintThreadState}));return EF(xy({..._,handleConnectionStatusChange:$.handleConnectionStatusChange,handleUiVersionDrift:$.handleUiVersionDrift,refreshCurrentView:Z.refreshCurrentView,updateAgentProfile:j.updateAgentProfile,updateUserProfile:j.updateUserProfile,applyLiveGeneratedWidgetUpdate:Z.applyLiveGeneratedWidgetUpdate,refreshModelAndQueueState:j.refreshModelAndQueueState,refreshActiveChatAgents:j.refreshActiveChatAgents,refreshCurrentChatBranches:j.refreshCurrentChatBranches,refreshContextUsage:$.refreshContextUsage,refreshQueueState:$.refreshQueueState,applyModelState:j.applyModelState,refreshAgentStatus:$.refreshAgentStatus,refreshAutoresearchStatus:$.refreshAutoresearchStatus})),{agentStatusLifecycle:$,chatRefreshLifecycle:j,viewRefreshLifecycle:Z}}M0();var MF="piclaw:pane-host-transfer:",Cy=300000;function kF(_){try{return _?.localStorage??null}catch{return null}}function TF(_){return typeof _==="string"?_.trim():""}function yF(_){if(!_||typeof _!=="object"||Array.isArray(_))return null;return _}function Py(_=Date.now()){return`pane-transfer-${_.toString(36)}-${Math.random().toString(36).slice(2,10)}`}function fy(_,$){try{return _?.removeItem($),!0}catch(j){return!1}}function Ry(_,$=globalThis,j=Date.now()){let Z=kF($),X=TF(_?.path),G=yF(_?.payload);if(!Z||!X||!G)return null;let q=Py(j);try{return Z.setItem(`${MF}${q}`,JSON.stringify({path:X,payload:G,capturedAt:j})),q}catch{return null}}function oj(_,$=globalThis,j=Date.now()){let Z=typeof _==="string"?_.trim():"",X=kF($);if(!Z||!X)return null;let G=`${MF}${Z}`,q="";try{q=X.getItem(G)||""}catch{return null}if(!q)return null;fy(X,G);try{let Q=JSON.parse(q),K=typeof Q?.capturedAt==="number"&&Number.isFinite(Q.capturedAt)?Q.capturedAt:j;if(K+Cy<j)return null;let V=TF(Q?.path),Y=yF(Q?.payload);if(!V||!Y)return null;return{path:V,payload:Y,capturedAt:K}}catch{return null}}function o8(_,$=globalThis,j=Date.now()){let Z=Ry(_,$,j);return Z?{pane_transfer:Z}:null}function wF(_=globalThis,$=Date.now()){let j=q5("pane_transfer",_);return oj(j,_,$)}function c4(_){return typeof _==="string"?_.trim():""}function Sy(_){return Boolean(_)&&typeof _.get==="function"&&typeof _.set==="function"&&typeof _.delete==="function"&&typeof _.entries==="function"}function ij(_){if(!_)return null;let $=_.__piclawPaneLiveTransferRegistry__;if(Sy($))return $;let j=new Map;return _.__piclawPaneLiveTransferRegistry__=j,j}function by(_){try{return _?.(),!0}catch($){return!1}}function g5(_,$=typeof window<"u"?window:null){let j=ij($),Z=c4(_?.panePath),X=c4(_?.paneInstanceId),G=c4(_?.paneWindowId);if(!j||!Z||!X||!G||typeof _?.instance?.moveHost!=="function")return!1;return j.set(G,{..._,panePath:Z,paneInstanceId:X,paneWindowId:G,registeredAt:typeof _?.registeredAt==="number"?_.registeredAt:Date.now()}),!0}function IF(_,$=typeof window<"u"?window:null){let j=ij($),Z=c4(_);if(!j||!Z)return;for(let[X,G]of j.entries())if(G?.panePath===Z)j.delete(X)}async function xF(_,$,j,Z){let X=ij(_),G=c4($?.panePath),q=c4($?.paneInstanceId),Q=c4($?.paneWindowId);if(!X||!G||!q||!Q)return null;let K=X.get(Q)||null;if(!K)return null;if(K.panePath!==G||K.paneInstanceId!==q)return null;if(typeof K.instance?.moveHost!=="function")return null;if(!await K.instance.moveHost(j,Z))return null;return X.delete(Q),by(K.releaseSourceHost),K.instance}e2();function m6(_){if(!_||typeof _!=="object")return!1;let $=_;if(typeof $.closest==="function"&&$.closest('input, textarea, select, [contenteditable="true"], .compose-box, .compose-model-popup, .compose-session-popup'))return!0;return Boolean($.isContentEditable)}function CF(_,$={}){let j=$.document??(typeof document<"u"?document:null);if(!j)return()=>{};let Z=_?.openTab,X=_?.editSource,G=_?.popOutPane,q=(Y)=>{let N=Y?.detail?.path,F=typeof Y?.detail?.label==="string"&&Y.detail.label.trim()?Y.detail.label.trim():void 0;if(N)Z?.(N,F)},Q=(Y)=>{let N=Y?.detail?.path,F=typeof Y?.detail?.label==="string"&&Y.detail.label.trim()?Y.detail.label.trim():void 0;if(N)X?.(N,F)},K=(Y)=>{let N=Y?.detail?.path,F=typeof Y?.detail?.label==="string"&&Y.detail.label.trim()?Y.detail.label.trim():void 0;if(N)G?.(N,F)},V=["pane:open-tab","office-viewer:open-tab","data-viewer:open-tab","pdf-viewer:open-tab","image-viewer:open-tab","video-viewer:open-tab","html-viewer:open-tab","mindmap:open-tab","vnc:open-tab"];return V.forEach((Y)=>j.addEventListener(Y,q)),j.addEventListener("html-viewer:edit-source",Q),j.addEventListener("pane:popout",K),()=>{V.forEach((Y)=>j.removeEventListener(Y,q)),j.removeEventListener("html-viewer:edit-source",Q),j.removeEventListener("pane:popout",K)}}function PF(_,$={}){let j=$.document??(typeof document<"u"?document:null);if(!j)return()=>{};let Z=(X)=>{if(m6(X?.target))return;if(!M$(X,"toggleDock"))return;X.preventDefault?.(),_?.()};return j.addEventListener("keydown",Z),()=>j.removeEventListener("keydown",Z)}function fF(_,$={}){let j=$.document??(typeof document<"u"?document:null);if(!j)return()=>{};let Z=_?.toggleZenMode,X=_?.exitZenMode,G=typeof _?.isZenModeActive==="function"?_.isZenModeActive:()=>Boolean(_?.zenMode),q=(Q)=>{if(M$(Q,"toggleZenMode")){Q.preventDefault?.(),Z?.();return}if(m6(Q?.target))return;if(Q?.key==="Escape"&&G())Q.preventDefault?.(),X?.()};return j.addEventListener("keydown",q),()=>j.removeEventListener("keydown",q)}function RF(_,$={}){let j=$.document??(typeof document<"u"?document:null);if(!j)return()=>{};let Z=(X)=>{if(m6(X?.target))return;if(M$(X,"previousChat")){X.preventDefault?.(),_?.previousChat?.();return}if(M$(X,"nextChat"))X.preventDefault?.(),_?.nextChat?.()};return j.addEventListener("keydown",Z),()=>j.removeEventListener("keydown",Z)}function SF(_={}){let $=_.document??(typeof document<"u"?document:null);if(!$)return()=>{};let j=(Z)=>{if(m6(Z?.target))return;if(!M$(Z,"openSettings"))return;Z.preventDefault(),a_()};return $.addEventListener("keydown",j),()=>$.removeEventListener("keydown",j)}function bF(_={}){let $=_.document??(typeof document<"u"?document:null);if(!$)return()=>{};let j=(Z)=>{if(m6(Z?.target))return;if(!M$(Z,"openHelp"))return;Z.preventDefault(),a_({section:"keyboard"})};return $.addEventListener("keydown",j),()=>$.removeEventListener("keydown",j)}function gF(_){let{hasWindow:$=typeof window<"u",currentBranchRecord:j,renameBranchInFlight:Z,renameBranchLockUntil:X,getFormLock:G,setRenameBranchNameDraft:q,setIsRenameBranchFormOpen:Q,now:K=Date.now()}=_;if(!$||!j?.chat_jid)return!1;let V=G?.()||null;if(!V)return!1;if(Z||K<Number(X||0)||V.inFlight||K<Number(V.cooldownUntil||0))return!1;return q?.(j.agent_name||""),Q?.(!0),!0}function uF(_){let{setIsRenameBranchFormOpen:$,setRenameBranchNameDraft:j}=_;$?.(!1),j?.("")}async function vF(_){let{hasWindow:$=typeof window<"u",currentBranchRecord:j,nextName:Z,openRenameForm:X,renameBranchInFlightRef:G,renameBranchLockUntilRef:q,getFormLock:Q,setIsRenamingBranch:K,renameChatBranch:V,refreshActiveChatAgents:Y,refreshCurrentChatBranches:N,navigate:F,baseHref:B,chatOnlyMode:D,showIntentToast:W,closeRenameForm:H,now:z=()=>Date.now()}=_;if(!$||!j?.chat_jid)return!1;if(typeof Z!=="string")return X?.(),!1;let k=z(),J=Q?.()||null;if(!J)return!1;if(G.current||k<Number(q.current||0)||J.inFlight||k<Number(J.cooldownUntil||0))return!1;G.current=!0,J.inFlight=!0,K?.(!0);try{let L=j.agent_name||"",x=Y8(Z,L);if(!x.canSubmit)return W?.("Could not rename session",x.message||"Enter a valid session handle.","warning",4000),!1;let I=x.normalized||L,E=await V(j.chat_jid,{agentName:I});await Promise.allSettled([Y?.(),N?.()]);let M=E?.branch?.agent_name||I||L;return W?.("Session renamed",`@${M}`,"info",3500),H?.(),!0}catch(L){let x=L instanceof Error?L.message:String(L||"Could not rename session."),I=/already in use/i.test(x||"")?`${x} Switch to or restore that existing session from the session manager.`:x;return W?.("Could not rename session",I||"Could not rename session.","warning",5000),!1}finally{G.current=!1,K?.(!1);let L=z()+eY;q.current=L;let x=Q?.()||null;if(x)x.inFlight=!1,x.cooldownUntil=L}}async function mF(_){let{hasWindow:$=typeof window<"u",targetChatJid:j=null,currentChatJid:Z,currentBranchRecord:X,currentChatBranches:G=[],activeChatAgents:q=[],pruneChatBranch:Q,refreshActiveChatAgents:K,refreshCurrentChatBranches:V,showIntentToast:Y,baseHref:N,chatOnlyMode:F,navigate:B,confirm:D=(M)=>window.confirm(M)}=_;if(!$)return!1;let W=typeof j==="string"&&j.trim()?j.trim():"",H=typeof Z==="string"&&Z.trim()?Z.trim():"",z=W||X?.chat_jid||H;if(!z)return Y?.("Could not prune branch","No active session is selected yet.","warning",4000),!1;let k=(X?.chat_jid===z?X:null)||G.find((M)=>M?.chat_jid===z)||q.find((M)=>M?.chat_jid===z)||null,J=k?.chat_jid===(k?.root_chat_jid||k?.chat_jid),L=Boolean(J&&z==="web:default"),x=Boolean(J&&G.some((M)=>{let O=typeof M?.chat_jid==="string"?M.chat_jid.trim():"",T=typeof M?.root_chat_jid==="string"?M.root_chat_jid.trim():O;return O&&O!==z&&T===z&&!M?.archived_at}));if(L)return Y?.("Cannot archive session","The default chat session cannot be archived.","warning",4000),!1;if(x)return Y?.("Cannot archive session","Archive or delete the child branch sessions first.","warning",4500),!1;let I=`@${k?.agent_name||z}${k?.chat_jid?` — ${k.chat_jid}`:""}`;if(!D(J?`Archive ${I}?

This removes the session from the session picker. Chat history is preserved.`:`Prune ${I}?

This archives the branch agent and removes it from the branch picker. Chat history is preserved.`))return!1;try{await Q(z),await Promise.allSettled([K?.(),V?.()]);let M=J?"web:default":k?.root_chat_jid||"web:default";Y?.(J?"Session archived":"Branch pruned",`${I} has been archived.`,"info",3000);let O=I_(N,M,{chatOnly:F});return B?.(O),!0}catch(M){let O=M instanceof Error?M.message:String(M||"Could not prune branch.");return Y?.("Could not prune branch",O||"Could not prune branch.","warning",5000),!1}}async function cF(_){let{targetChatJid:$,purgeChatBranch:j,currentChatBranches:Z=[],refreshActiveChatAgents:X,refreshCurrentChatBranches:G,showIntentToast:q,confirm:Q=(W)=>window.confirm(W)}=_,K=typeof $==="string"?$.trim():"";if(!K||typeof j!=="function")return!1;let V=Z.find((W)=>W?.chat_jid===K)||null;if(!Boolean(V?.archived_at))return q?.("Could not delete branch","Only archived sessions can be permanently deleted.","warning",4500),!1;let N=Boolean(V?.chat_jid&&V.chat_jid===(V.root_chat_jid||V.chat_jid)),F=`@${V?.agent_name||K}`;if(!Q(`Permanently delete ${F}?

This removes all chat history, token usage, cursor state, scheduled tasks, and session files for this ${N?"session":"branch"}. It cannot be undone.`))return!1;try{return await j(K),await Promise.allSettled([X?.(),G?.()]),q?.(N?"Archived session deleted":"Archived branch deleted",`${F} was permanently deleted.`,"info",4000),!0}catch(W){let H=W instanceof Error?W.message:String(W||`Could not permanently delete archived ${N?"session":"branch"}.`);return q?.("Could not delete branch",H||`Could not permanently delete archived ${N?"session":"branch"}.`,"warning",5000),!1}}async function hF(_){let{targetChatJid:$,restoreChatBranch:j,currentChatBranches:Z=[],refreshActiveChatAgents:X,refreshCurrentChatBranches:G,showIntentToast:q,baseHref:Q,chatOnlyMode:K,navigate:V}=_,Y=typeof $==="string"?$.trim():"";if(!Y||typeof j!=="function")return!1;try{let N=Z.find((z)=>z?.chat_jid===Y)||null,F=await j(Y);await Promise.allSettled([X?.(),G?.()]);let B=F?.branch,D=typeof B?.chat_jid==="string"&&B.chat_jid.trim()?B.chat_jid.trim():Y,W=JV(N?.agent_name,B?.agent_name,D);q?.("Branch restored",W,"info",4200);let H=I_(Q,D,{chatOnly:K});return V?.(H),!0}catch(N){let F=N instanceof Error?N.message:String(N||"Could not restore branch.");return q?.("Could not restore branch",F||"Could not restore branch.","warning",5000),!1}}async function lF(_){let{branchLoaderSourceChatJid:$,forkChatBranch:j,setBranchLoaderState:Z,navigate:X,baseHref:G,isCancelled:q=()=>!1}=_;try{Z?.({status:"running",message:"Preparing a new chat branch…"});let Q=await j($);if(q())return!1;let K=Q?.branch,V=typeof K?.chat_jid==="string"&&K.chat_jid.trim()?K.chat_jid.trim():null;if(!V)throw Error("Branch fork did not return a chat id.");let Y=I_(G,V,{chatOnly:!0});return X?.(Y,{replace:!0}),!0}catch(Q){if(q())return!1;return Z?.({status:"error",message:H4(Q)}),!1}}function rF(_){let{hasWindow:$=typeof window<"u",nextChatJid:j,currentChatJid:Z,chatOnlyMode:X,currentHref:G,navigate:q}=_;if(!$)return!1;let Q=typeof j==="string"?j.trim():"";if(!Q||Q===Z)return!1;let K=I_(G,Q,{chatOnly:X});return q?.(K),!0}function gy(_){return typeof _==="string"?_.trim():""}function uy(_){return new Promise(($)=>setTimeout($,_))}async function pF(_,$){if(typeof _?.beforeDetachFromHost!=="function")return;await _.beforeDetachFromHost({path:$,target:"popout"})}async function nF(_){let{panePath:$,tabStripActiveId:j,editorInstanceRef:Z,dockInstanceRef:X,terminalTabPath:G,activateTab:q,getActiveTabId:Q,resolveTab:K,buildEditorPopoutTransfer:V}=_,Y=$===G&&Boolean(K?.($));if($===G&&!Y){let W=X.current;if(await pF(W,$),typeof W?.preparePopoutTransfer!=="function")return null;return await W.preparePopoutTransfer()}let N=()=>gy(Q?.()??j),F=N(),B=Z.current;if(F!==$)q?.($);let D=F===$?Z.current:null;if(typeof D?.preparePopoutTransfer!=="function")for(let W=0;W<12;W+=1){if(W>0)await uy(16);else await Promise.resolve();let H=N(),z=Z.current,k=H===$,J=z!==B;if(!k||typeof z?.preparePopoutTransfer!=="function")continue;if(F===$||J||W>0){D=z;break}}if(await pF(D,$),typeof D?.preparePopoutTransfer==="function"){let W=await D.preparePopoutTransfer();if(W)return W}return V?.($)??null}function dF(_){let{panePath:$,terminalTabPath:j,dockVisible:Z,resolveTab:X,closeTab:G,setDockVisible:q}=_,Q=X($);if(Q&&!Q.dirty){G($);return}if($===j&&Z)q(!1)}function oF(_){let{hasWindow:$=typeof window<"u",editorOpen:j,shellElement:Z,editorWidthRef:X,dockHeightRef:G,sidebarWidthRef:q,readStoredNumber:Q}=_;if(!j||!$||!Z)return;if(!X.current){let K=Q("editorWidth",null),V=q.current||280,Y=Number.isFinite(K)?Number(K):V;X.current=J6(Y,typeof window<"u"?window.innerWidth:0,q.current||0)}if(Z.style.setProperty("--editor-width",`${X.current}px`),!G.current){let K=Q("dockHeight",null);G.current=Number.isFinite(K)?Number(K):200}Z.style.setProperty("--dock-height",`${G.current}px`)}T1();async function iF(_){if(typeof _!=="function")return null;try{return await _()}catch{return null}}async function sF(_){let{currentChatJid:$,chatOnlyMode:j,forkChatBranch:Z,refreshActiveChatAgents:X,refreshCurrentChatBranches:G,showIntentToast:q,navigate:Q,baseHref:K}=_;if(typeof Q==="function")try{let V=l3(K,$,{chatOnly:j});return Q(V),!0}catch(V){return q?.("Could not create branch",H4(V),"warning",5000),!1}try{let Y=(await Z($))?.branch,N=typeof Y?.chat_jid==="string"&&Y.chat_jid.trim()?Y.chat_jid.trim():null;if(!N)throw Error("Branch fork did not return a chat id.");await Promise.allSettled([X?.(),G?.()]);let F=Y?.agent_name?`@${Y.agent_name}`:N;q?.("New branch created",`Switched to ${F}.`,"info",2500);let B=I_(K,N,{chatOnly:j});return Q?.(B),!0}catch(V){return q?.("Could not create branch",H4(V),"warning",5000),!1}}async function aF(_){let{rootName:$,chatOnlyMode:j,createRootChatSession:Z,refreshActiveChatAgents:X,refreshCurrentChatBranches:G,showIntentToast:q,navigate:Q,baseHref:K}=_,V=String($||"").trim();if(!V)return!1;try{let F=(await(typeof Z==="function"?Z:v7)(V))?.branch,B=typeof F?.chat_jid==="string"&&F.chat_jid.trim()?F.chat_jid.trim():null;if(!B)throw Error("Root session creation did not return a chat id.");await Promise.allSettled([X?.(),G?.()]);let D=F?.agent_name?`@${F.agent_name}`:B;q?.("Root session created",`Switched to ${D}.`,"info",2500);let W=I_(K,B,{chatOnly:j});return Q?.(W),!0}catch(Y){return q?.("Could not create root session",H4(Y),"warning",5000),!1}}async function tF(_){let{hasWindow:$=typeof window<"u",isWebAppMode:j=!1,path:Z,label:X,showIntentToast:G,resolveSourceTransfer:q,closeSourcePaneIfTransferred:Q,onPaneWindowOpened:K,currentChatJid:V,baseHref:Y}=_;if(!$||j)return!1;let N=typeof Z==="string"&&Z.trim()?Z.trim():"";if(!N)return!1;let F=UX(N);if(!F)return G?.("Could not open pane window","Opening pane windows is unavailable in standalone webapp mode.","warning",5000),!1;let B=v3(F);if(!B)return G?.("Could not open pane window","The browser blocked opening a new tab or window.","warning",5000),!1;m3(B,{title:typeof X==="string"&&X.trim()?`Opening ${X}…`:"Opening pane…",message:"Preparing a standalone pane window. This should only take a moment."});try{let D=await q?.(N),W=Boolean(D&&Object.keys(D).length>0),H=FX(Y,N,{label:typeof X==="string"&&X.trim()?X.trim():void 0,chatJid:V,params:D});if(c3(B,H),K?.(N,B,D||null),W&&!K)Q?.(N);return!0}catch(D){h3(B);let W=D instanceof Error?D.message:"Could not transfer pane state to the new window.";return G?.("Could not open pane window",W,"warning",5000),!1}}async function eF(_){let{hasWindow:$=typeof window<"u",isWebAppMode:j=!1,currentChatJid:Z,currentRootChatJid:X,forkChatBranch:G,getActiveChatAgents:q,getChatBranches:Q,setActiveChatAgents:K,setCurrentChatBranches:V,showIntentToast:Y,baseHref:N}=_;if(!$||j)return!1;let F=BX(Z);if(!F)return Y?.("Could not open branch window","Opening branch windows is unavailable in standalone webapp mode.","warning",5000),!1;if(F.mode==="tab"){let D=l3(N,Z,{chatOnly:!0});if(!window.open(D,F.target))return Y?.("Could not open branch window","The browser blocked opening a new tab or window.","warning",5000),!1;return!0}let B=v3(F);if(!B)return Y?.("Could not open branch window","The browser blocked opening a new tab or window.","warning",5000),!1;m3(B,{title:"Opening branch…",message:"Preparing a new chat branch. This should only take a moment."});try{let W=(await G(Z))?.branch,H=typeof W?.chat_jid==="string"&&W.chat_jid.trim()?W.chat_jid.trim():null;if(!H)throw Error("Branch fork did not return a chat id.");let z=await iF(()=>q?.());if(z)K?.(Array.isArray(z?.chats)?z.chats:[]);let k=await iF(()=>Q?.(X));if(k)V?.(Array.isArray(k?.chats)?k.chats:[]);let J=I_(N,H,{chatOnly:!0});return c3(B,J),!0}catch(D){return h3(B),Y?.("Could not open branch window",H4(D),"error",5000),!1}}function vy(_){_(($)=>!$)}function my(_){let{nextChatJid:$,currentChatJid:j,chatOnlyMode:Z,navigate:X,hasWindow:G=typeof window<"u",currentHref:q=G?window.location.href:"http://localhost/"}=_;return rF({hasWindow:G,nextChatJid:$,currentChatJid:j,chatOnlyMode:Z,currentHref:q,navigate:X})}function cy(_){let{currentBranchRecord:$,renameBranchInFlight:j,renameBranchLockUntil:Z,getFormLock:X,setRenameBranchNameDraft:G,setIsRenameBranchFormOpen:q,hasWindow:Q=typeof window<"u"}=_;return gF({hasWindow:Q,currentBranchRecord:$,renameBranchInFlight:j,renameBranchLockUntil:Z,getFormLock:X,setRenameBranchNameDraft:G,setIsRenameBranchFormOpen:q})}function hy(_){uF(_)}async function ly(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...Z}=_;await vF({hasWindow:$,baseHref:String(j||"").trim()||($?window.location.href:"http://localhost/"),...Z})}async function py(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...Z}=_;await mF({hasWindow:$,baseHref:j,...Z})}async function ry(_){await cF(_)}async function ny(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...Z}=_;await hF({baseHref:j,...Z})}function dy(_){let{branchLoaderMode:$,branchLoaderSourceChatJid:j,forkChatBranch:Z,setBranchLoaderState:X,navigate:G,hasWindow:q=typeof window<"u",baseHref:Q=q?window.location.href:"http://localhost/",runBranchLoaderImpl:K=lF}=_;if(!$||!q)return;let V=!1;return K({branchLoaderSourceChatJid:j,forkChatBranch:Z,setBranchLoaderState:X,navigate:G,baseHref:Q,isCancelled:()=>V}),()=>{V=!0}}async function oy(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...Z}=_;await sF({baseHref:j,...Z})}async function iy(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...Z}=_;await aF({baseHref:j,...Z})}async function sy(_){let{isWebAppMode:$,path:j,label:Z,showIntentToast:X,currentChatJid:G,activateTab:q,tabStripActiveId:Q,editorInstanceRef:K,dockInstanceRef:V,terminalTabPath:Y,tabPaneOverrides:N,buildPaneDetachTransfer:F,registerDetachedPaneWindow:B,dockVisible:D,resolveTab:W,closeTab:H,setDockVisible:z,hasWindow:k=typeof window<"u",baseHref:J=k?window.location.href:"http://localhost/"}=_,L=F?.(j)||null;return await tF({hasWindow:k,isWebAppMode:$,path:j,label:Z,showIntentToast:X,currentChatJid:G,baseHref:J,resolveSourceTransfer:async(x)=>{let I=await nF({panePath:x,activateTab:q,getActiveTabId:()=>j1.getActiveId(),tabStripActiveId:Q,editorInstanceRef:K,dockInstanceRef:V,terminalTabPath:Y,resolveTab:W,buildEditorPopoutTransfer:(T)=>{if(!T||T===Y)return null;let y=K.current,A=typeof y?.getContent==="function"?y.getContent():void 0,P=typeof y?.isDirty==="function"?y.isDirty():!1,f=N instanceof Map?N.get(T)||null:null,u=j1.getViewState(T)||null;return N2({path:T,content:P?A:void 0,paneOverrideId:f,viewState:u})}}),E=x===Y&&!W(x)?V.current:K.current,M=typeof E?.exportHostTransferState==="function"?E.exportHostTransferState():null,O=M?o8({path:x,payload:M}):null;if(L?.paneInstanceId&&L?.paneWindowId&&E&&x!==Y&&M?.kind!=="terminal")g5({panePath:x,paneInstanceId:L.paneInstanceId,paneWindowId:L.paneWindowId,instance:E,releaseSourceHost:()=>{if(x===Y){if(V.current===E)V.current=null;if(K.current===E)K.current=null;return}if(K.current===E)K.current=null}});return{...I||{},...O||{},...L?.params||{}}},onPaneWindowOpened:B?(x,I,E)=>{B(x,Z,I,E)}:void 0,closeSourcePaneIfTransferred:B?void 0:(x)=>{dF({panePath:x,terminalTabPath:Y,dockVisible:D,resolveTab:W,closeTab:H,setDockVisible:z})}})}function ay(_){let{openEditor:$,popOutPane:j,watchPaneOpenEventsImpl:Z=CF}=_;return Z({openTab:(X,G)=>$(X,G?{label:G}:void 0),editSource:(X,G)=>$(X,{...G?{label:G}:{},paneOverrideId:"editor"}),popOutPane:(X,G)=>{j(X,G)}})}async function ty(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...Z}=_;await eF({hasWindow:$,baseHref:j,...Z})}function ey(_){let{hasWindow:$=typeof window<"u",...j}=_;oF({hasWindow:$,...j})}function _U(_){let{setWorkspaceOpen:$,currentChatJid:j,chatOnlyMode:Z,navigate:X,currentBranchRecord:G,renameBranchInFlightRef:q,renameBranchLockUntilRef:Q,getFormLock:K,setRenameBranchNameDraft:V,setIsRenameBranchFormOpen:Y,setIsRenamingBranch:N,renameChatBranch:F,refreshActiveChatAgents:B,refreshCurrentChatBranches:D,showIntentToast:W,currentChatBranches:H,activeChatAgents:z,pruneChatBranch:k,purgeChatBranch:J,restoreChatBranch:L,branchLoaderMode:x,branchLoaderSourceChatJid:I,forkChatBranch:E,createRootChatSession:M,setBranchLoaderState:O,currentRootChatJid:T,isWebAppMode:y,getActiveChatAgents:A,getChatBranches:P,setActiveChatAgents:f,setCurrentChatBranches:u,openEditor:c,activateTab:r,tabStripActiveId:e,editorInstanceRef:m,dockInstanceRef:_0,terminalTabPath:H0,tabPaneOverrides:X0,buildPaneDetachTransfer:j0,registerDetachedPaneWindow:Q0,dockVisible:F0,resolveTab:h,closeTab:$0,setDockVisible:K0,editorOpen:L0,shellElement:a,editorWidthRef:G0,dockHeightRef:O0,sidebarWidthRef:P0,readStoredNumber:p0}=_,g0=R(()=>{vy($)},[$]),X1=R((J0)=>{my({nextChatJid:J0,currentChatJid:j,chatOnlyMode:Z,navigate:X})},[Z,j,X]),l0=R(()=>{cy({currentBranchRecord:G,renameBranchInFlight:q.current,renameBranchLockUntil:Q.current,getFormLock:K,setRenameBranchNameDraft:V,setIsRenameBranchFormOpen:Y})},[G,K,q,Q,Y,V]),a0=R(()=>{hy({setIsRenameBranchFormOpen:Y,setRenameBranchNameDraft:V})},[Y,V]),f0=R(async(J0)=>{await ly({currentBranchRecord:G,nextName:J0,openRenameForm:l0,renameBranchInFlightRef:q,renameBranchLockUntilRef:Q,getFormLock:K,setIsRenamingBranch:N,renameChatBranch:F,refreshActiveChatAgents:B,refreshCurrentChatBranches:D,navigate:X,chatOnlyMode:Z,showIntentToast:W,closeRenameForm:a0})},[a0,G,Z,K,X,l0,B,D,q,Q,F,N,W]),i0=R(async(J0=null)=>{await py({targetChatJid:J0,currentChatJid:j,currentBranchRecord:G,currentChatBranches:H,activeChatAgents:z,pruneChatBranch:k,refreshActiveChatAgents:B,refreshCurrentChatBranches:D,showIntentToast:W,chatOnlyMode:Z,navigate:X})},[z,Z,G,H,j,X,k,B,D,W]),m0=R(async(J0)=>{await ry({targetChatJid:J0,purgeChatBranch:J,currentChatBranches:H,refreshActiveChatAgents:B,refreshCurrentChatBranches:D,showIntentToast:W})},[H,J,B,D,W]),e0=R(async(J0)=>{await ny({targetChatJid:J0,restoreChatBranch:L,currentChatBranches:H,refreshActiveChatAgents:B,refreshCurrentChatBranches:D,showIntentToast:W,chatOnlyMode:Z,navigate:X})},[Z,H,X,B,D,L,W]);b(()=>dy({branchLoaderMode:x,branchLoaderSourceChatJid:I,forkChatBranch:E,setBranchLoaderState:O,navigate:X}),[x,I,E,X,O]);let s0=R(async()=>{await oy({currentChatJid:j,chatOnlyMode:Z,forkChatBranch:E,refreshActiveChatAgents:B,refreshCurrentChatBranches:D,showIntentToast:W,navigate:X})},[Z,j,E,X,B,D,W]),D1=R(async(J0)=>{await iy({rootName:J0,chatOnlyMode:Z,createRootChatSession:M,refreshActiveChatAgents:B,refreshCurrentChatBranches:D,showIntentToast:W,navigate:X})},[Z,M,X,B,D,W]),G1=R(async(J0,V1)=>{return await sy({isWebAppMode:y,path:J0,label:V1,showIntentToast:W,currentChatJid:j,activateTab:r,tabStripActiveId:e,editorInstanceRef:m,dockInstanceRef:_0,terminalTabPath:H0,tabPaneOverrides:X0,buildPaneDetachTransfer:j0,registerDetachedPaneWindow:Q0,dockVisible:F0,resolveTab:h,closeTab:$0,setDockVisible:K0})},[r,j0,$0,j,_0,F0,m,y,Q0,h,K0,W,X0,e,H0]);b(()=>ay({openEditor:c,popOutPane:(J0,V1)=>{G1(J0,V1)}}),[G1,c]);let c0=R(async()=>{await ty({isWebAppMode:y,currentChatJid:j,currentRootChatJid:T,forkChatBranch:E,getActiveChatAgents:A,getChatBranches:P,setActiveChatAgents:f,setCurrentChatBranches:u,showIntentToast:W})},[j,T,E,A,P,y,f,u,W]);return b(()=>{ey({editorOpen:L0,shellElement:a,editorWidthRef:G0,dockHeightRef:O0,sidebarWidthRef:P0,readStoredNumber:p0})},[O0,L0,G0,p0,a,P0]),{toggleWorkspace:g0,handleBranchPickerChange:X1,openRenameCurrentBranchForm:l0,closeRenameCurrentBranchForm:a0,handleRenameCurrentBranch:f0,handlePruneCurrentBranch:i0,handlePurgeArchivedBranch:m0,handleRestoreBranch:e0,handleCreateSessionFromCompose:s0,handleCreateRootSessionFromCompose:D1,handlePopOutPane:G1,handlePopOutChat:c0}}M0();function q4(_){return _.status==="fulfilled"?_.value:null}function i8(_){return Math.max(0,Math.min(100,_))}function $U(_){let $=Array.isArray(_.timelinePayload?.posts)?_.timelinePayload.posts:Array.isArray(_.rawPosts)?_.rawPosts:[],j=$.length?$[$.length-1]:null,Z=$.filter((H)=>H?.data?.is_bot_message).length,X=$.filter((H)=>!H?.data?.is_bot_message).length,G=Number(_.queuePayload?.count??_.followupQueueItems?.length??0)||0,q=Array.isArray(_.activeChatsPayload?.chats)?_.activeChatsPayload.chats.length:Array.isArray(_.activeChatAgents)?_.activeChatAgents.length:0,Q=Array.isArray(_.branchesPayload?.chats)?_.branchesPayload.chats.length:Array.isArray(_.currentChatBranches)?_.currentChatBranches.length:0,K=Number(_.contextPayload?.percent??_.contextUsage?.percent??0)||0,V=Number(_.contextPayload?.tokens??_.contextUsage?.tokens??0)||0,Y=Number(_.contextPayload?.contextWindow??_.contextUsage?.contextWindow??0)||0,N=_.modelsPayload?.current??_.activeModel??null,F=_.modelsPayload?.thinking_level??_.activeThinkingLevel??null,B=_.modelsPayload?.supports_thinking??_.supportsThinking,D=_.statusPayload?.status||(_.isAgentTurnActive?"active":"idle"),W=_.statusPayload?.data?.type||_.statusPayload?.type||null;return{generatedAt:_.generatedAt,request:_.request,chat:{currentChatJid:_.currentChatJid,rootChatJid:_.currentRootChatJid,activeChats:q,branches:Q},agent:{status:D,phase:W,running:Boolean(_.isAgentTurnActive)},model:{current:N,thinkingLevel:F,supportsThinking:Boolean(B)},context:{tokens:V,contextWindow:Y,percent:K},queue:{count:G},timeline:{loadedPosts:$.length,botPosts:Z,userPosts:X,latestPostId:j?.id??null,latestTimestamp:j?.timestamp??null},bars:[{key:"context",label:"Context",value:i8(Math.round(K))},{key:"queue",label:"Queue",value:i8(G*18)},{key:"activeChats",label:"Active chats",value:i8(q*12)},{key:"posts",label:"Timeline load",value:i8($.length*5)}]}}function jU(_){if(_==="followup")return{title:"Widget submission queued",detail:"The widget message was queued because the agent is busy.",kind:"info",durationMs:3500};return{title:"Widget submission sent",detail:"The widget message was sent to the chat.",kind:"info",durationMs:3500}}function ZU(_){return{title:"Widget submission failed",detail:_||"Could not send the widget message.",kind:"warning",durationMs:5000}}function XU(_,$){return{shouldBuildDashboard:_?.buildDashboard!==!1,nextRefreshCount:Number($||0)+1}}function GU(){return{title:"Dashboard built",detail:"Live dashboard state pushed into the widget.",kind:"info",durationMs:3000}}function qU(_){return{title:"Dashboard build failed",detail:_||"Could not build dashboard.",kind:"warning",durationMs:5000}}function QU(){return{title:"Widget refresh requested",detail:"The widget received a host acknowledgement update.",kind:"info",durationMs:3000}}async function VU(_){let{requestPayload:$=null,currentChatJid:j,currentRootChatJid:Z,getAgentStatus:X,getAgentContext:G,getAgentQueueState:q,getAgentModels:Q,getActiveChatAgents:K,getChatBranches:V,getTimeline:Y,rawPosts:N,activeChatAgents:F,currentChatBranches:B,contextUsage:D,followupQueueItems:W,activeModel:H,activeThinkingLevel:z,supportsThinking:k,isAgentTurnActive:J}=_,[L,x,I,E,M,O,T]=await Promise.allSettled([X(j),G(j),q(j),Q(j),K(),V(Z),Y(20,null,j)]);return $U({generatedAt:new Date().toISOString(),request:$,currentChatJid:j,currentRootChatJid:Z,statusPayload:q4(L),contextPayload:q4(x),queuePayload:q4(I),modelsPayload:q4(E),activeChatsPayload:q4(M),branchesPayload:q4(O),timelinePayload:q4(T),rawPosts:N,activeChatAgents:F,currentChatBranches:B,contextUsage:D,followupQueueItems:W,activeModel:H,activeThinkingLevel:z,supportsThinking:k,isAgentTurnActive:J})}function KU(_){let{queuedItem:$,followupQueueItemsRef:j,dismissedQueueRowIdsRef:Z,currentChatJid:X,refreshQueueState:G,setFollowupQueueItems:q,showIntentToast:Q,steerAgentQueueItem:K}=_,V=b5(j.current,$);if(!V)return;let{rowId:Y}=V;Z.current.add(Y),q((N)=>X4(N,Y).items),K(Y,Sj(X)).then(()=>{G()}).catch((N)=>{console.warn("[queue] Failed to steer queued item:",N);let F=dj("steer");Q(F.title,F.detail,"warning"),Z.current.delete(Y),G()})}function YU(_){let{queuedItem:$,followupQueueItemsRef:j,dismissedQueueRowIdsRef:Z,currentChatJid:X,refreshQueueState:G,setFollowupQueueItems:q,showIntentToast:Q,clearQueuedSteerStateIfStale:K,removeAgentQueueItem:V}=_,Y=b5(j.current,$);if(!Y)return;let{rowId:N}=Y;Z.current.add(N),K?.(Y.remainingQueueCount),q((F)=>X4(F,N).items),V(N,Sj(X)).then(()=>{G()}).catch((F)=>{console.warn("[queue] Failed to remove queued item:",F);let B=dj("remove");Q(B.title,B.detail,"warning"),Z.current.delete(N),G()})}function NU(_){let{widget:$,dismissedLiveWidgetKeysRef:j,setFloatingWidget:Z}=_;if(!$||typeof $!=="object")return;let X=D_($);if(X)j.current.delete(X);Z($F($,new Date().toISOString()))}function BU(_){let{dismissedLiveWidgetKeysRef:$,setFloatingWidget:j}=_;j((Z)=>{let X=jF(Z);if(X.dismissedSessionKey)$.current.add(X.dismissedSessionKey);return X.nextWidget})}function FU(_){let{event:$,widget:j,currentChatJid:Z,isComposeBoxAgentActive:X,setFloatingWidget:G,handleCloseFloatingWidget:q,handleMessageResponse:Q,showIntentToast:K,sendAgentMessage:V,buildFloatingWidgetDashboardSnapshot:Y}=_,N=typeof $?.kind==="string"?$.kind:"",F=D_(j);if(!N||!F)return;if(N==="widget.close"){q();return}if(N==="widget.submit"){let B=sV($?.payload),D=aV($?.payload),W=new Date().toISOString();if(G((H)=>GF(H,F,{kind:N,payload:$?.payload||null,submittedAt:W,submissionText:B})),!B){if(K("Widget submission received","The widget submitted data without a message payload yet.","info",3500),D)q();return}(async()=>{try{let H=await V("default",B,null,[],X?"queue":null,Z);Q(H),G((k)=>nj(k,F,{submittedAt:W,submissionText:B,queued:H?.queued||null}));let z=jU(H?.queued);if(K(z.title,z.detail,z.kind,z.durationMs),D)q()}catch(H){G((k)=>nj(k,F,{submittedAt:W,submissionText:B,errorMessage:H?.message||"Could not send the widget message."}));let z=ZU(H?.message);K(z.title,z.detail,z.kind,z.durationMs)}})();return}if(N==="widget.ready"||N==="widget.request_refresh"){let B=new Date().toISOString(),D=XU($?.payload||null,j?.runtimeState?.refreshCount);if(G((W)=>qF(W,F,{kind:N,payload:$?.payload||null,eventAt:B,nextRefreshCount:D.nextRefreshCount,shouldBuildDashboard:D.shouldBuildDashboard})),N==="widget.request_refresh")if(D.shouldBuildDashboard)(async()=>{try{let W=await Y($?.payload||null);G((z)=>QF(z,F,{dashboard:W,at:new Date().toISOString(),count:D.nextRefreshCount,echo:$?.payload||null}));let H=GU();K(H.title,H.detail,H.kind,H.durationMs)}catch(W){G((z)=>VF(z,F,{errorMessage:W?.message||"Could not build dashboard.",at:new Date().toISOString(),count:D.nextRefreshCount}));let H=qU(W?.message);K(H.title,H.detail,H.kind,H.durationMs)}})();else{let W=QU();K(W.title,W.detail,W.kind,W.durationMs)}}}function _w(_,$=KU){$(_)}function $w(_,$=YU){$(_)}function jw(_,$,j=aB){j({response:_,refreshActiveChatAgents:$.refreshActiveChatAgents,refreshCurrentChatBranches:$.refreshCurrentChatBranches,refreshContextUsage:$.refreshContextUsage,refreshAutoresearchStatus:$.refreshAutoresearchStatus,refreshQueueState:$.refreshQueueState})}function UU(_){let{currentChatJid:$,followupQueueItemsRef:j,dismissedQueueRowIdsRef:Z,refreshQueueState:X,setFollowupQueueItems:G,showIntentToast:q,clearQueuedSteerStateIfStale:Q,steerAgentQueueItem:K,removeAgentQueueItem:V,refreshActiveChatAgents:Y,refreshCurrentChatBranches:N,refreshContextUsage:F,refreshAutoresearchStatus:B}=_,D=R((k)=>{_w({queuedItem:k,followupQueueItemsRef:j,dismissedQueueRowIdsRef:Z,currentChatJid:$,refreshQueueState:X,setFollowupQueueItems:G,showIntentToast:q,steerAgentQueueItem:K,removeAgentQueueItem:V})},[$,Z,j,X,V,G,q,K]),W=R((k)=>{$w({queuedItem:k,followupQueueItemsRef:j,dismissedQueueRowIdsRef:Z,currentChatJid:$,refreshQueueState:X,setFollowupQueueItems:G,showIntentToast:q,clearQueuedSteerStateIfStale:Q,steerAgentQueueItem:K,removeAgentQueueItem:V})},[Q,$,Z,j,X,V,G,q,K]),H=R(async(k,J)=>{G((L)=>{if(!Array.isArray(L)||k<0||J<0||k>=L.length||J>=L.length||k===J)return L;let x=[...L],[I]=x.splice(k,1);return x.splice(J,0,I),x});try{let{reorderAgentQueueItem:L}=await Promise.resolve().then(() => (T1(),W6));await L(k,J,$)}catch(L){console.warn("Failed to persist queue reorder:",L),X()}},[$,X,G]),z=R((k)=>{jw(k,{refreshActiveChatAgents:Y,refreshCurrentChatBranches:N,refreshContextUsage:F,refreshAutoresearchStatus:B,refreshQueueState:X})},[Y,B,F,N,X]);return{handleInjectQueuedFollowup:D,handleRemoveQueuedFollowup:W,handleMoveQueuedFollowup:H,handleMessageResponse:z}}M0();function DU(_){let{btwAbortRef:$,setBtwSession:j}=_;if($.current)$.current.abort(),$.current=null;j(null)}async function zU(_){let{question:$,currentChatJid:j,streamSidePrompt:Z,resolveBtwChatJid:X,showIntentToast:G,btwAbortRef:q,setBtwSession:Q}=_,K=String($||"").trim();if(!K)return G("BTW needs a question","Usage: /btw <question>","warning"),!0;if(q.current)q.current.abort();let V=new AbortController;q.current=V,Q({question:K,answer:"",thinking:"",error:null,model:null,status:"running"});try{let Y=await Z(K,{signal:V.signal,chatJid:X(j),systemPrompt:"Answer the user briefly and directly. This is a side conversation that should not affect the main chat until explicitly injected.",onEvent:(N)=>{if(N==="side_prompt_start")Q((F)=>F?{...F,status:"running"}:F)},onThinkingDelta:(N)=>{Q((F)=>F?{...F,thinking:`${F.thinking||""}${N||""}`}:F)},onTextDelta:(N)=>{Q((F)=>F?{...F,answer:`${F.answer||""}${N||""}`}:F)}});if(q.current!==V)return!0;Q((N)=>N?{...N,answer:Y?.result||N.answer||"",thinking:Y?.thinking||N.thinking||"",model:Y?.model||null,status:"success",error:null}:N)}catch(Y){if(V.signal.aborted)return!0;Q((N)=>N?{...N,status:"error",error:Y?.payload?.error||Y?.message||"BTW request failed."}:N)}finally{if(q.current===V)q.current=null}return!0}async function WU(_){let{content:$,parseBtwCommand:j,closeBtwPanel:Z,runBtwPrompt:X,showIntentToast:G}=_,q=j($);if(!q)return!1;if(q.type==="help")return G("BTW usage","Use /btw <question> to open a side conversation.","info",4000),!0;if(q.type==="clear")return Z(),G("BTW cleared","Closed the side conversation panel.","info"),!0;if(q.type==="ask")return await X(q.question),!0;return!1}async function HU(_){let{btwSession:$,buildBtwInjectionText:j,isComposeBoxAgentActive:Z,currentChatJid:X,sendAgentMessage:G,handleMessageResponse:q,showIntentToast:Q}=_,K=j($);if(!K)return!1;try{let V=await G("default",K,null,[],Z?"queue":null,X);return q(V),Q(V?.queued==="followup"?"BTW queued":"BTW injected",V?.queued==="followup"?"The BTW summary was queued as a follow-up because the agent is busy.":"The BTW summary was sent to the main chat.","info",3500),!0}catch(V){return Q("BTW inject failed",V?.message||"Could not inject BTW answer into chat.","warning"),!1}}async function Zw(_){let $=typeof _==="string"?_:"";if(!$)return!1;let j=null;if(navigator.clipboard?.writeText)try{return await navigator.clipboard.writeText($),!0}catch(Z){j=Z}try{let Z=document.createElement("textarea");Z.value=$,Z.setAttribute("readonly",""),Z.style.position="fixed",Z.style.opacity="0",Z.style.pointerEvents="none",document.body.appendChild(Z),Z.select(),Z.setSelectionRange(0,Z.value.length);let X=document.execCommand("copy");return document.body.removeChild(Z),X}catch(Z){return console.debug("[sidepanel] Clipboard copy failed after falling back from navigator.clipboard.",Z,{clipboardApiAvailable:Boolean(navigator.clipboard?.writeText),clipboardApiError:j}),!1}}function Xw(_){let{dismissedLiveWidgetKeysRef:$,setFloatingWidget:j}=_;$.current.clear(),j(null)}function OU(_){let{currentChatJid:$,currentRootChatJid:j,isComposeBoxAgentActive:Z,showIntentToast:X,setPendingExtensionPanelActions:G,refreshAutoresearchStatus:q,stopAutoresearch:Q,dismissAutoresearch:K,streamSidePrompt:V,btwAbortRef:Y,btwSession:N,setBtwSession:F,sendAgentMessage:B,handleMessageResponse:D,dismissedLiveWidgetKeysRef:W,setFloatingWidget:H,getAgentStatus:z,getAgentContext:k,getAgentQueueState:J,getAgentModels:L,getActiveChatAgents:x,getChatBranches:I,getTimeline:E,rawPosts:M,activeChatAgents:O,currentChatBranches:T,contextUsage:y,followupQueueItemsRef:A,activeModel:P,activeThinkingLevel:f,supportsThinking:u,isAgentTurnActive:c}=_,r=R(async($0,K0)=>{let L0=typeof $0?.key==="string"?$0.key:"",a=typeof K0?.key==="string"?K0.key:"",G0=lj(L0,a);if(!L0||!a)return;G((O0)=>OB(O0,L0,a));try{let O0=await JB({panel:$0,action:K0,currentChatJid:$,stopAutoresearch:Q,dismissAutoresearch:K,writeClipboard:async(P0)=>{if(!await Zw(P0))throw Error("Clipboard access is unavailable.")}});if(O0.refreshAutoresearchStatus)q();if(O0.toast)X(O0.toast.title,O0.toast.detail,O0.toast.kind,O0.toast.durationMs)}catch(O0){X("Panel action failed",O0?.message||"Could not complete that action.","warning")}finally{G((O0)=>LB(O0,G0))}},[$,K,q,G,X,Q]),e=R(()=>{DU({btwAbortRef:Y,setBtwSession:F})},[Y,F]),m=R(async($0)=>{return await zU({question:$0,currentChatJid:$,streamSidePrompt:V,resolveBtwChatJid:uV,showIntentToast:X,btwAbortRef:Y,setBtwSession:F})},[Y,$,F,X,V]),_0=R(async({content:$0})=>{return await WU({content:$0,parseBtwCommand:gV,closeBtwPanel:e,runBtwPrompt:m,showIntentToast:X})},[e,m,X]),H0=R(()=>{if(N?.question)m(N.question)},[N,m]),X0=R(async()=>{await HU({btwSession:N,buildBtwInjectionText:cV,isComposeBoxAgentActive:Z,currentChatJid:$,sendAgentMessage:B,handleMessageResponse:D,showIntentToast:X})},[N,$,D,Z,B,X]),j0=R(async($0=null)=>{return VU({requestPayload:$0,currentChatJid:$,currentRootChatJid:j,getAgentStatus:z,getAgentContext:k,getAgentQueueState:J,getAgentModels:L,getActiveChatAgents:x,getChatBranches:I,getTimeline:E,rawPosts:M,activeChatAgents:O,currentChatBranches:T,contextUsage:y,followupQueueItems:A.current,activeModel:P,activeThinkingLevel:f,supportsThinking:u,isAgentTurnActive:c})},[O,P,f,y,T,$,j,A,x,k,L,J,z,I,E,c,M,u]),Q0=R(($0)=>{NU({widget:$0,dismissedLiveWidgetKeysRef:W,setFloatingWidget:H})},[W,H]),F0=R(()=>{BU({dismissedLiveWidgetKeysRef:W,setFloatingWidget:H})},[W,H]),h=R(($0,K0)=>{FU({event:$0,widget:K0,currentChatJid:$,isComposeBoxAgentActive:Z,setFloatingWidget:H,handleCloseFloatingWidget:F0,handleMessageResponse:D,showIntentToast:X,sendAgentMessage:B,buildFloatingWidgetDashboardSnapshot:j0})},[j0,$,F0,D,Z,B,H,X]);return b(()=>{Xw({dismissedLiveWidgetKeysRef:W,setFloatingWidget:H})},[$,W,H]),{handleExtensionPanelAction:r,closeBtwPanel:e,handleBtwIntercept:_0,handleBtwRetry:H0,handleBtwInject:X0,handleOpenFloatingWidget:Q0,handleCloseFloatingWidget:F0,handleFloatingWidgetEvent:h}}M0();function Gw(_){let{hasDockPanes:$,chatOnlyMode:j}=_;return Boolean($&&!j)}function qw(_){return!_}function LU(_){let{hasDockPanes:$,chatOnlyMode:j,toggleDock:Z,toggleZenMode:X,exitZenMode:G,zenMode:q,previousChat:Q,nextChat:K}=_;b(()=>{if(!Gw({hasDockPanes:$,chatOnlyMode:j}))return;return PF(Z)},[j,$,Z]),b(()=>{if(!qw(j))return;return fF({toggleZenMode:X,exitZenMode:G,zenMode:q,isZenModeActive:()=>q})},[j,G,X,q]),b(()=>{if(typeof Q!=="function"&&typeof K!=="function")return;return RF({previousChat:Q,nextChat:K})},[K,Q]),b(()=>bF(),[]),b(()=>SF(),[])}function Qw(_){return Boolean(_&&typeof _.closest==="function")}function JU(_=typeof window<"u"?window:null){if(!_||typeof _.getSelection!=="function")return!1;try{let $=_.getSelection();if(!$||$.isCollapsed)return!1;return String($.toString()||"").trim().length>0}catch{return!1}}function Vw(){return{active:!1,horizontalLocked:!1,cancelled:!1,startX:0,startY:0,lastX:0,lastY:0,startedAt:0}}function Kw(){return{lastTriggeredAt:0,accumX:0}}function sj(_){if(!_)return;_.active=!1,_.horizontalLocked=!1,_.cancelled=!1,_.startX=0,_.startY=0,_.lastX=0,_.lastY=0,_.startedAt=0}var Yw=["input","textarea","select","button","label","a[href]",'[contenteditable="true"]','[role="button"]',"[data-no-chat-swipe]",".compose-box",".compose-model-popup",".compose-session-popup",".workspace-explorer",".editor-pane-container",".dock-panel",".terminal-pane-content",".attachment-preview-modal",".rename-branch-overlay",".agent-request-modal",".adaptive-card-container",".adaptive-card-container input",".adaptive-card-container textarea",".adaptive-card-container select",".adaptive-card-container button"].join(", "),Nw=[".agent-thinking",".agent-status-panel",".agent-thinking-intent"].join(", ");function EU(_){if(!_||!Qw(_))return!1;let $=_.closest(Yw);if(!$)return!0;return Boolean($.closest(Nw))}function MU(_,$){if(!Array.isArray(_))return $?[$]:[];let j=new Set,Z=_.filter((G)=>Boolean(G&&typeof G==="object")).filter((G)=>{let q=typeof G.chat_jid==="string"?G.chat_jid.trim():"";if(!q||j.has(q))return!1;if(G.archived_at)return!1;return j.add(q),!0});Z.sort((G,q)=>{if(Boolean(G.is_active)!==Boolean(q.is_active))return G.is_active?-1:1;return String(G.chat_jid).localeCompare(String(q.chat_jid))});let X=Z.map((G)=>String(G.chat_jid).trim());if($&&!j.has($))X.unshift($);return X}function aj(_){let $=MU(_.candidates,_.currentChatJid);if($.length<=1)return null;let j=$.indexOf(_.currentChatJid);if(j<0)return $[0]??null;let Z=_.direction==="next"?(j+1)%$.length:(j-1+$.length)%$.length;return $[Z]??null}function AU(_,$){let j=_.find((X)=>X.chat_jid===$);if(!j)return $.replace(/^[^:]+:/,"");return(typeof j.agent_name==="string"?j.agent_name.trim():"")||$.replace(/^[^:]+:/,"")}function Bw(_){let $=MU(_.candidates,_.currentChatJid);if($.length<=1)return{prev:null,next:null};let j=$.indexOf(_.currentChatJid);if(j<0)return{prev:null,next:null};let Z=$[(j-1+$.length)%$.length],X=$[(j+1)%$.length];return{prev:{chatJid:Z,name:AU(_.candidates,Z)},next:{chatJid:X,name:AU(_.candidates,X)}}}function Fw(_){let $=Number.isFinite(_.minDistancePx)?Number(_.minDistancePx):72,j=Number.isFinite(_.axisRatio)?Number(_.axisRatio):1.35;return Math.abs(_.dx)>=$&&Math.abs(_.dx)>Math.abs(_.dy)*j}function Uw(_){let $=document.querySelector(".chat-swipe-indicator");if(!$)$=document.createElement("div"),$.className="chat-swipe-indicator",$.innerHTML='<span class="chat-swipe-chevron"></span><span class="chat-swipe-name"></span>',document.body.appendChild($);return $}function Dw(_,$,j,Z){let X=Math.abs($),G=Math.min(X/100,1),q=X>=72;_.style.display="flex",_.style.opacity=String(Math.min(G*2.5,1)),_.classList.toggle("chat-swipe-indicator--ready",q);let Q=$<0,K=Q?Z.next:Z.prev,V=_.querySelector(".chat-swipe-chevron");if(V)V.textContent=Q?"›":"‹",V.style.order=Q?"2":"0";let Y=_.querySelector(".chat-swipe-name");if(Y)Y.textContent=K?.name??""}function c6(_){_.style.display="none",_.style.opacity="0"}function kU(_){let{timelineRef:$,activeChatAgents:j,currentChatJid:Z,onSwitch:X,isIOSDevice:G,isLikelySafari:q}=_,Q=$.current;if(!Q)return()=>{};let K=G(),V=typeof q==="function"?q():!1;if(!K&&!V)return()=>{};let Y=Vw(),N=Kw(),F=null,B={prev:null,next:null},D=!1;function W(){B=Bw({candidates:j,currentChatJid:Z})}W();function H(){if(!F)F=Uw(Q);return F}function z(M){let O=M==="next"?B.next:B.prev;if(O)X(O.chatJid)}function k(M){D=String(M.pointerType||"").toLowerCase()==="pen"}function J(M){if(sj(Y),W(),!K)return;if(M.touches.length!==1)return;if(D)return;if(JU())return;if(!EU(M.target))return;let O=M.touches[0];Y.active=!0,Y.startX=O.clientX,Y.startY=O.clientY,Y.lastX=O.clientX,Y.lastY=O.clientY,Y.startedAt=Date.now()}function L(M){if(!Y.active||Y.cancelled)return;if(JU()){Y.cancelled=!0,c6(H());return}let O=M.touches[0];if(!O)return;Y.lastX=O.clientX,Y.lastY=O.clientY;let T=Y.lastX-Y.startX,y=Y.lastY-Y.startY;if(!Y.horizontalLocked){if(Math.abs(y)>16&&Math.abs(y)>=Math.abs(T)){Y.cancelled=!0,c6(H());return}if(Math.abs(T)>12&&Math.abs(T)>Math.abs(y)*1.15)Y.horizontalLocked=!0}if(Y.horizontalLocked){if(M.cancelable)M.preventDefault();Dw(H(),T,Q.clientWidth,B)}}function x(){if(!Y.active)return;let M=Y.lastX-Y.startX,O=Y.lastY-Y.startY,T=!Y.cancelled&&Fw({dx:M,dy:O});if(c6(H()),sj(Y),T)z(M<0?"next":"prev")}function I(){c6(H()),sj(Y)}function E(M){if(K)return;if(!V)return;if(!EU(M.target))return;let{deltaX:O,deltaY:T}=M;if(!Number.isFinite(O)||Math.abs(O)<72)return;if(Math.abs(O)<=Math.abs(T)*1.35)return;if(M.cancelable)M.preventDefault();let y=Date.now();if(y-N.lastTriggeredAt<450)return;N.lastTriggeredAt=y,z(O>0?"next":"prev")}return Q.addEventListener("pointerdown",k,{passive:!0}),Q.addEventListener("touchstart",J,{passive:!0}),Q.addEventListener("touchmove",L,{passive:!1}),Q.addEventListener("touchend",x,{passive:!0}),Q.addEventListener("touchcancel",I,{passive:!0}),Q.addEventListener("wheel",E,{passive:!1}),()=>{if(Q.removeEventListener("pointerdown",k),Q.removeEventListener("touchstart",J),Q.removeEventListener("touchmove",L),Q.removeEventListener("touchend",x),Q.removeEventListener("touchcancel",I),Q.removeEventListener("wheel",E),F)c6(F),F.remove(),F=null}}function zw(_){return{currentChatJid:_.currentChatJid,followupQueueItemsRef:_.followupQueueItemsRef,dismissedQueueRowIdsRef:_.dismissedQueueRowIdsRef,refreshQueueState:_.refreshQueueState,setFollowupQueueItems:_.setFollowupQueueItems,showIntentToast:_.showIntentToast,clearQueuedSteerStateIfStale:_.clearQueuedSteerStateIfStale,steerAgentQueueItem:_.steerAgentQueueItem,removeAgentQueueItem:_.removeAgentQueueItem,refreshActiveChatAgents:_.refreshActiveChatAgents,refreshCurrentChatBranches:_.refreshCurrentChatBranches,refreshContextUsage:_.refreshContextUsage,refreshAutoresearchStatus:_.refreshAutoresearchStatus}}function Ww(_){return{currentChatJid:_.currentChatJid,currentRootChatJid:_.currentRootChatJid,isComposeBoxAgentActive:_.isComposeBoxAgentActive,showIntentToast:_.showIntentToast,setPendingExtensionPanelActions:_.setPendingExtensionPanelActions,refreshAutoresearchStatus:_.refreshAutoresearchStatus,stopAutoresearch:_.stopAutoresearch,dismissAutoresearch:_.dismissAutoresearch,streamSidePrompt:_.streamSidePrompt,btwAbortRef:_.btwAbortRef,btwSession:_.btwSession,setBtwSession:_.setBtwSession,sendAgentMessage:_.sendAgentMessage,handleMessageResponse:_.handleMessageResponse,dismissedLiveWidgetKeysRef:_.dismissedLiveWidgetKeysRef,setFloatingWidget:_.setFloatingWidget,getAgentStatus:_.getAgentStatus,getAgentContext:_.getAgentContext,getAgentQueueState:_.getAgentQueueState,getAgentModels:_.getAgentModels,getActiveChatAgents:_.getActiveChatAgents,getChatBranches:_.getChatBranches,getTimeline:_.getTimeline,rawPosts:_.rawPosts,activeChatAgents:_.activeChatAgents,currentChatBranches:_.currentChatBranches,contextUsage:_.contextUsage,followupQueueItemsRef:_.followupQueueItemsRef,activeModel:_.activeModel,activeThinkingLevel:_.activeThinkingLevel,supportsThinking:_.supportsThinking,isAgentTurnActive:_.isAgentTurnActive}}function Hw(_){return{setWorkspaceOpen:_.setWorkspaceOpen,currentChatJid:_.currentChatJid,chatOnlyMode:_.chatOnlyMode,navigate:_.navigate,currentBranchRecord:_.currentBranchRecord,renameBranchInFlightRef:_.renameBranchInFlightRef,renameBranchLockUntilRef:_.renameBranchLockUntilRef,getFormLock:_.getFormLock,setRenameBranchNameDraft:_.setRenameBranchNameDraft,setIsRenameBranchFormOpen:_.setIsRenameBranchFormOpen,setIsRenamingBranch:_.setIsRenamingBranch,renameChatBranch:_.renameChatBranch,refreshActiveChatAgents:_.refreshActiveChatAgents,refreshCurrentChatBranches:_.refreshCurrentChatBranches,showIntentToast:_.showIntentToast,currentChatBranches:_.currentChatBranches,activeChatAgents:_.activeChatAgents,pruneChatBranch:_.pruneChatBranch,purgeChatBranch:_.purgeChatBranch,restoreChatBranch:_.restoreChatBranch,branchLoaderMode:_.branchLoaderMode,branchLoaderSourceChatJid:_.branchLoaderSourceChatJid,forkChatBranch:_.forkChatBranch,createRootChatSession:_.createRootChatSession,setBranchLoaderState:_.setBranchLoaderState,currentRootChatJid:_.currentRootChatJid,isWebAppMode:_.isWebAppMode,getActiveChatAgents:_.getActiveChatAgents,getChatBranches:_.getChatBranches,setActiveChatAgents:_.setActiveChatAgents,setCurrentChatBranches:_.setCurrentChatBranches,openEditor:_.openEditor,activateTab:_.activateTab,tabStripActiveId:_.tabStripActiveId,editorInstanceRef:_.editorInstanceRef,dockInstanceRef:_.dockInstanceRef,terminalTabPath:_.terminalTabPath,tabPaneOverrides:_.tabPaneOverrides,buildPaneDetachTransfer:_.buildPaneDetachTransfer,registerDetachedPaneWindow:_.registerDetachedPaneWindow,dockVisible:_.dockVisible,resolveTab:_.resolveTab,closeTab:_.closeTab,setDockVisible:_.setDockVisible,editorOpen:_.editorOpen,shellElement:_.shellElement,editorWidthRef:_.editorWidthRef,dockHeightRef:_.dockHeightRef,sidebarWidthRef:_.sidebarWidthRef,readStoredNumber:_.readStoredNumber}}function Ow(_){return{hasDockPanes:_.hasDockPanes,chatOnlyMode:_.chatOnlyMode,toggleDock:_.toggleDock,toggleZenMode:_.toggleZenMode,exitZenMode:_.exitZenMode,zenMode:_.zenMode,previousChat:()=>{let $=aj({candidates:_.activeChatAgents,currentChatJid:_.currentChatJid,direction:"prev"});if($)_.handleBranchPickerChange?.($)},nextChat:()=>{let $=aj({candidates:_.activeChatAgents,currentChatJid:_.currentChatJid,direction:"next"});if($)_.handleBranchPickerChange?.($)}}}function TU(_){let $=UU(zw(_)),j=OU(Ww({..._,handleMessageResponse:$.handleMessageResponse})),Z=_U(Hw(_));return LU(Ow({..._,handleBranchPickerChange:Z.handleBranchPickerChange})),{followupActions:$,sidepanelActions:j,branchPaneActions:Z}}function Lw(_,$){return Boolean(_||$!==null)}function Jw(_){return{..._.agentStatusLifecycleBundle,..._.actionBundle,timelineViewActions:_.timelineViewActions,isComposeBoxAgentActive:_.isComposeBoxAgentActive}}function Ew(_,$){let{routeState:j,searchState:Z,shellState:X,timeline:G,interaction:q,paneRuntime:Q,refs:K,setters:V,services:Y,helpers:N}=_;return{currentChatJid:j.currentChatJid,activeChatJidRef:K.activeChatJidRef,queueRefreshGenRef:K.queueRefreshGenRef,dismissedQueueRowIdsRef:K.dismissedQueueRowIdsRef,getAgentQueueState:Y.getAgentQueueState,setFollowupQueueItems:V.setFollowupQueueItems,clearQueuedSteerStateIfStale:q.clearQueuedSteerStateIfStale,getAgentContext:Y.getAgentContext,setContextUsage:V.setContextUsage,getAutoresearchStatus:Y.getAutoresearchStatus,setExtensionStatusPanels:V.setExtensionStatusPanels,setPendingExtensionPanelActions:V.setPendingExtensionPanelActions,setExtensionWorkingState:V.setExtensionWorkingState,getAgentStatus:Y.getAgentStatus,wasAgentActiveRef:K.wasAgentActiveRef,viewStateRef:K.viewStateRef,refreshTimeline:G.refreshTimeline,clearAgentRunState:q.clearAgentRunState,agentStatusRef:K.agentStatusRef,pendingRequestRef:K.pendingRequestRef,thoughtBufferRef:K.thoughtBufferRef,draftBufferRef:K.draftBufferRef,previewResyncPendingRef:K.previewResyncPendingRef,previewResyncGenerationRef:K.previewResyncGenerationRef,setAgentStatus:V.setAgentStatus,setAgentDraft:V.setAgentDraft,setAgentPlan:V.setAgentPlan,setAgentThought:V.setAgentThought,setPendingRequest:V.setPendingRequest,setActiveTurn:q.setActiveTurn,noteAgentActivity:q.noteAgentActivity,showLastActivity:q.showLastActivity,clearLastActivityFlag:q.clearLastActivityFlag,isAgentRunningRef:K.isAgentRunningRef,currentTurnIdRef:K.currentTurnIdRef,silentRecoveryRef:K.silentRecoveryRef,silenceRefreshMs:Y.silenceRefreshMs,lastAgentEventRef:K.lastAgentEventRef,lastSilenceNoticeRef:K.lastSilenceNoticeRef,silenceWarningMs:Y.silenceWarningMs,silenceFinalizeMs:Y.silenceFinalizeMs,isCompactionStatus:Y.isCompactionStatus,serverVersionContext:{currentAppAssetVersion:Y.currentAppAssetVersion,staleUiVersionRef:K.staleUiVersionRef,staleUiReloadScheduledRef:K.staleUiReloadScheduledRef,tabStoreHasUnsaved:Y.tabStoreHasUnsaved,isAgentRunningRef:K.isAgentRunningRef,pendingRequestRef:K.pendingRequestRef,showIntentToast:$},setConnectionStatus:V.setConnectionStatus,setStateAccessFailed:V.setStateAccessFailed,hasConnectedOnceRef:K.hasConnectedOnceRef,getAgents:Y.getAgents,setAgents:V.setAgents,setUserProfile:V.setUserProfile,applyBranding:q.applyBranding,readStoredNumber:N.readStoredNumber,sidebarWidthRef:K.sidebarWidthRef,appShellRef:K.appShellRef,currentRootChatJid:j.currentRootChatJid,getAgentModels:Y.getAgentModels,getActiveChatAgents:Y.getActiveChatAgents,getChatBranches:Y.getChatBranches,setActiveChatAgents:V.setActiveChatAgents,setCurrentChatBranches:V.setCurrentChatBranches,setActiveModel:V.setActiveModel,setActiveThinkingLevel:V.setActiveThinkingLevel,setSupportsThinking:V.setSupportsThinking,setActiveModelUsage:V.setActiveModelUsage,setAgentModelsPayload:V.setAgentModelsPayload,setHasLoadedAgentModels:V.setHasLoadedAgentModels,agentsRef:K.agentsRef,currentHashtag:Z.currentHashtag,searchQuery:Z.searchQuery,searchScope:Z.searchScope,loadPosts:G.loadPosts,searchPosts:Y.searchPosts,setPosts:G.setPosts,setHasMore:G.setHasMore,scrollToBottom:G.scrollToBottom,paneStateOwnerChatJidRef:K.paneStateOwnerChatJidRef,chatPaneStateByChatRef:K.chatPaneStateByChatRef,snapshotCurrentChatPaneState:q.snapshotCurrentChatPaneState,restoreChatPaneState:q.restoreChatPaneState,setFloatingWidget:V.setFloatingWidget,dismissedLiveWidgetKeysRef:K.dismissedLiveWidgetKeysRef,posts:G.posts,scrollToMessage:q.composeReferenceActions.scrollToMessage,draftThrottleRef:K.draftThrottleRef,thoughtThrottleRef:K.thoughtThrottleRef,followupQueueItemsRef:K.followupQueueItemsRef,scrollToBottomRef:G.scrollToBottomRef,hasMoreRef:G.hasMoreRef,loadMoreRef:G.loadMoreRef,lastAgentResponseRef:K.lastAgentResponseRef,notifyForFinalResponse:q.notifyForFinalResponse,setSteerQueuedTurnId:V.setSteerQueuedTurnId,refreshActiveEditorFromWorkspace:Q.refreshActiveEditorFromWorkspace,showIntentToast:$,removeStalledPost:q.recoveryCallbacks.removeStalledPost,preserveTimelineScrollTop:G.preserveTimelineScrollTop,finalizeStalledResponse:()=>{V.setExtensionWorkingState({message:null,indicator:null,visible:!0}),q.recoveryCallbacks.finalizeStalledResponse()},connectionStatus:X.connectionStatus,agentStatus:Y.agentStatus,thoughtExpandedRef:K.thoughtExpandedRef,draftExpandedRef:K.draftExpandedRef,steerQueuedTurnIdRef:K.steerQueuedTurnIdRef}}function yU(_){let{routeState:$,searchState:j,shellState:Z,timeline:X,interaction:G,paneRuntime:q,refs:Q,setters:K,services:V,helpers:Y}=_,N=G.composeReferenceActions.showIntentToast,F=DB({currentHashtag:j.currentHashtag,searchQuery:j.searchQuery,searchOpen:j.searchOpen,searchScope:j.searchScope,currentChatJid:$.currentChatJid,currentRootChatJid:$.currentRootChatJid,posts:X.posts,loadPosts:X.loadPosts,searchPosts:V.searchPosts,setCurrentHashtag:j.setCurrentHashtag,setSearchQuery:j.setSearchQuery,setSearchOpen:j.setSearchOpen,setSearchScope:j.setSearchScope,setPosts:X.setPosts,setHasMore:X.setHasMore,preserveTimelineScrollTop:X.preserveTimelineScrollTop,setRemovingPostIds:K.setRemovingPostIds,deletePost:V.deletePost,hasMoreRef:X.hasMoreRef,loadMoreRef:X.loadMoreRef}),B=AF(Ew(_,N)),D=Lw(V.isAgentTurnActive,V.agentStatus),W=TU({currentChatJid:$.currentChatJid,followupQueueItemsRef:Q.followupQueueItemsRef,dismissedQueueRowIdsRef:Q.dismissedQueueRowIdsRef,setFollowupQueueItems:K.setFollowupQueueItems,showIntentToast:N,clearQueuedSteerStateIfStale:G.clearQueuedSteerStateIfStale,steerAgentQueueItem:V.steerAgentQueueItem,removeAgentQueueItem:V.removeAgentQueueItem,refreshQueueState:B.agentStatusLifecycle.refreshQueueState,refreshActiveChatAgents:B.chatRefreshLifecycle.refreshActiveChatAgents,refreshCurrentChatBranches:B.chatRefreshLifecycle.refreshCurrentChatBranches,refreshContextUsage:B.agentStatusLifecycle.refreshContextUsage,refreshAutoresearchStatus:B.agentStatusLifecycle.refreshAutoresearchStatus,currentRootChatJid:$.currentRootChatJid,isComposeBoxAgentActive:D,setPendingExtensionPanelActions:K.setPendingExtensionPanelActions,stopAutoresearch:V.stopAutoresearch,dismissAutoresearch:V.dismissAutoresearch,streamSidePrompt:V.streamSidePrompt,btwAbortRef:Q.btwAbortRef,btwSession:Z.btwSession,setBtwSession:K.setBtwSession,sendAgentMessage:V.sendAgentMessage,dismissedLiveWidgetKeysRef:Q.dismissedLiveWidgetKeysRef,setFloatingWidget:K.setFloatingWidget,getAgentStatus:V.getAgentStatus,getAgentContext:V.getAgentContext,getAgentQueueState:V.getAgentQueueState,getAgentModels:V.getAgentModels,getActiveChatAgents:V.getActiveChatAgents,getChatBranches:V.getChatBranches,getTimeline:V.getTimeline,rawPosts:X.rawPosts,activeChatAgents:Z.activeChatAgents,currentChatBranches:Z.currentChatBranches,contextUsage:Z.contextUsage,activeModel:Z.activeModel,activeThinkingLevel:Z.activeThinkingLevel,supportsThinking:Z.supportsThinking,isAgentTurnActive:V.isAgentTurnActive,chatOnlyMode:$.chatOnlyMode,navigate:$.navigate,setWorkspaceOpen:Z.setWorkspaceOpen,currentBranchRecord:Z.currentBranchRecord,renameBranchInFlightRef:Q.renameBranchInFlightRef,renameBranchLockUntilRef:Q.renameBranchLockUntilRef,getFormLock:Y.getFormLock,setRenameBranchNameDraft:K.setRenameBranchNameDraft,setIsRenameBranchFormOpen:K.setIsRenameBranchFormOpen,setIsRenamingBranch:K.setIsRenamingBranch,renameChatBranch:V.renameChatBranch,pruneChatBranch:V.pruneChatBranch,purgeChatBranch:V.purgeChatBranch,restoreChatBranch:V.restoreChatBranch,branchLoaderMode:$.branchLoaderMode,branchLoaderSourceChatJid:$.branchLoaderSourceChatJid,forkChatBranch:V.forkChatBranch,createRootChatSession:V.createRootChatSession,setBranchLoaderState:K.setBranchLoaderState,isWebAppMode:$.isWebAppMode,setActiveChatAgents:K.setActiveChatAgents,setCurrentChatBranches:K.setCurrentChatBranches,openEditor:V.openEditor,tabStripActiveId:V.tabStripActiveId,editorInstanceRef:q.editorInstanceRef,dockInstanceRef:q.dockInstanceRef,terminalTabPath:V.terminalTabPath,tabPaneOverrides:V.tabPaneOverrides,buildPaneDetachTransfer:q.buildPaneDetachTransfer,registerDetachedPaneWindow:q.registerDetachedPaneWindow,dockVisible:q.dockVisible,resolveTab:V.resolveTab,closeTab:V.closeTab,setDockVisible:q.setDockVisible,editorOpen:V.editorOpen,shellElement:Q.appShellRef.current,editorWidthRef:Q.editorWidthRef,dockHeightRef:Q.dockHeightRef,sidebarWidthRef:Q.sidebarWidthRef,readStoredNumber:Y.readStoredNumber,hasDockPanes:q.hasDockPanes,toggleDock:q.toggleDock,toggleZenMode:q.toggleZenMode,exitZenMode:q.exitZenMode,zenMode:q.zenMode});return Jw({agentStatusLifecycleBundle:B,actionBundle:W,timelineViewActions:F,isComposeBoxAgentActive:D})}M0();T1();M0();function wU(_){try{return _?.focus?.(),!0}catch($){return!1}}function h6(_,$){if(!_||!$)return null;try{return _.getItem($)}catch{return null}}function tj(_,$,j){if(!_||!$)return;try{_.setItem($,j)}catch{return}}function IU(_,$){if(!_||!$)return;try{_.removeItem($)}catch{return}}function xU(_="piclaw"){try{if(typeof crypto<"u"&&typeof crypto.randomUUID==="function")return`${_}-${crypto.randomUUID()}`}catch($){console.debug("[notification-delivery-coordinator] crypto.randomUUID threw; falling back to Math.random-based id.",$)}return`${_}-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`}function Q4(_=typeof window<"u"?window:null){let $=_?.localStorage,j=h6($,"piclaw.notifications.deviceId");if(j)return j;let Z=xU("device");return tj($,"piclaw.notifications.deviceId",Z),h6($,"piclaw.notifications.deviceId")||Z}function l6(_=typeof window<"u"?window:null){let $=_?.sessionStorage,j=h6($,"piclaw.notifications.clientId");if(j)return j;let Z=_?.__PICLAW_NOTIFICATION_CLIENT_ID__;if(typeof Z==="string"&&Z.trim())return Z.trim();let X=xU("client");if(tj($,"piclaw.notifications.clientId",X),_)_.__PICLAW_NOTIFICATION_CLIENT_ID__=h6($,"piclaw.notifications.clientId")||X;return _?.__PICLAW_NOTIFICATION_CLIENT_ID__||X}function CU(_,$){return`piclaw.notifications.presence.${String(_||"").trim()}:${String($||"").trim()}`}function ej(_={}){let $=_.runtimeWindow??(typeof window<"u"?window:null),j=_.runtimeDocument??(typeof document<"u"?document:null),Z=typeof _.chatJid==="string"&&_.chatJid.trim()?_.chatJid.trim():"",X=typeof _.deviceId==="string"&&_.deviceId.trim()?_.deviceId.trim():Q4($),G=typeof _.clientId==="string"&&_.clientId.trim()?_.clientId.trim():l6($),q=Number.isFinite(_.updatedAtMs)?Number(_.updatedAtMs):Date.now(),Q=Boolean(typeof j?.hasFocus==="function"?j.hasFocus():!0),V=String(j?.visibilityState||"").trim().toLowerCase()==="hidden"?"hidden":"visible";return{deviceId:X,clientId:G,chatJid:Z,visibilityState:V,hasFocus:Q,updatedAtMs:q}}function PU(_,$=typeof window<"u"?window:null){let j=$?.localStorage,Z=typeof _?.deviceId==="string"?_.deviceId.trim():"",X=typeof _?.clientId==="string"?_.clientId.trim():"",G=typeof _?.chatJid==="string"?_.chatJid.trim():"";if(!j||!Z||!X||!G)return!1;return tj(j,CU(Z,X),JSON.stringify({deviceId:Z,clientId:X,chatJid:G,visibilityState:_.visibilityState==="hidden"?"hidden":"visible",hasFocus:Boolean(_.hasFocus),updatedAtMs:Number.isFinite(_.updatedAtMs)?Number(_.updatedAtMs):Date.now()})),!0}function fU(_,$=typeof window<"u"?window:null){let j=$?.localStorage,Z=typeof _?.deviceId==="string"?_.deviceId.trim():"",X=typeof _?.clientId==="string"?_.clientId.trim():"";if(!j||!Z||!X)return!1;return IU(j,CU(Z,X)),!0}function Aw(_={}){let $=_.runtimeWindow??(typeof window<"u"?window:null),j=$?.localStorage,Z=typeof _.deviceId==="string"&&_.deviceId.trim()?_.deviceId.trim():Q4($),X=Number.isFinite(_.nowMs)?Number(_.nowMs):Date.now(),G=Number.isFinite(_.ttlMs)?Number(_.ttlMs):120000;if(!j||!Z)return[];let q=`piclaw.notifications.presence.${Z}:`,Q=[],K=[];for(let V=0;V<j.length;V+=1){let Y=j.key(V);if(!Y||!Y.startsWith(q))continue;let N=h6(j,Y);if(!N){K.push(Y);continue}try{let F=JSON.parse(N),B=Number(F?.updatedAtMs);if(!Number.isFinite(B)||X-B>G){K.push(Y);continue}let D=typeof F?.chatJid==="string"?F.chatJid.trim():"",W=typeof F?.clientId==="string"?F.clientId.trim():"";if(!D||!W){K.push(Y);continue}Q.push({deviceId:Z,clientId:W,chatJid:D,visibilityState:F?.visibilityState==="hidden"?"hidden":"visible",hasFocus:Boolean(F?.hasFocus),updatedAtMs:B})}catch{K.push(Y)}}return K.forEach((V)=>IU(j,V)),Q.sort((V,Y)=>V.clientId.localeCompare(Y.clientId))}function RU(_={}){let $=ej(_),j=$.chatJid;if(!j)return!1;let Z=Aw({runtimeWindow:_.runtimeWindow,deviceId:$.deviceId,nowMs:$.updatedAtMs,ttlMs:_.ttlMs}).filter((q)=>q.chatJid===j&&q.clientId!==$.clientId),X=[$,...Z];if(X.some((q)=>q.visibilityState==="visible"))return!1;let G=[...X].sort((q,Q)=>q.clientId.localeCompare(Q.clientId))[0]||null;return Boolean(G&&G.clientId===$.clientId)}function Mw(_=typeof window<"u"?window:null){return Boolean(_?.__PICLAW_NOTIFICATION_SOURCE_LABELS_ENABLED__)}function kw(_,$="",j=typeof window<"u"?window:null){let Z=typeof _==="string"&&_.trim()?_.trim():"PiClaw",X=Mw(j)&&typeof $==="string"?$.trim():"";return X?`${Z} [${X}]`:Z}function Tw(_){let $=String(_||"").replace(/-/g,"+").replace(/_/g,"/"),j=$.padEnd(Math.ceil($.length/4)*4,"="),Z=atob(j),X=new Uint8Array(Z.length);for(let G=0;G<Z.length;G+=1)X[G]=Z.charCodeAt(G);return X}function s8(_=typeof window<"u"?window:null){if(!_||!_.isSecureContext)return!1;return"serviceWorker"in _.navigator&&"PushManager"in _}async function bU(_){return await _.navigator.serviceWorker.register("/sw.js",{updateViaCache:"none"}),await _.navigator.serviceWorker.ready}async function yw(_){let $=await bU(_),j=await $.pushManager.getSubscription();if(j)return j;let Z=await m7(),X=typeof Z?.publicKey==="string"?Z.publicKey.trim():"";if(!X)throw Error("Missing web push public key.");return $.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Tw(X)})}async function SU(_,$){if(!s8(_))return!1;let j=await yw(_);return await c7(j.toJSON?j.toJSON():j,{deviceId:$}),!0}async function ww(_,$){if(!s8(_))return!1;let Z=await(await bU(_)).pushManager.getSubscription();if(!Z)return!1;let X=Z.toJSON?Z.toJSON():Z;try{await h7(X,{deviceId:$})}catch(G){console.warn("Failed to remove web push subscription from the server:",G)}try{await Z.unsubscribe()}catch(G){console.warn("Failed to unsubscribe from web push notifications:",G)}return!0}function Iw(_,$={}){let j=$.runtimeWindow??(typeof window<"u"?window:null);if(!j?.fetch)return Promise.resolve(!1);return j.fetch("/agent/push/presence",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(_),keepalive:Boolean($.keepalive)}).then(()=>!0).catch(()=>!1)}function xw(_,$=typeof window<"u"?window:null){try{if($?.navigator?.sendBeacon){let j=new Blob([JSON.stringify(_)],{type:"application/json"});return $.navigator.sendBeacon("/agent/push/presence",j)}}catch(j){console.debug("[use-notifications] Ignoring sendBeacon failure for best-effort notification presence teardown.",j,{hasNavigator:Boolean($?.navigator)})}return!1}function gU(_={}){let $=typeof _?.chatJid==="string"&&_.chatJid.trim()?_.chatJid.trim():"web:default",[j,Z]=C(!1),[X,G]=C("default"),q=g(!1),Q=g(null),K=g(null);b(()=>{let B=W$("notificationsEnabled",!1);if(q.current=B,Z(B),typeof window<"u")Q.current=Q4(window),K.current=l6(window);if(typeof Notification>"u")return;let D=Notification.permission;if(G(D),D==="denied"&&B){q.current=!1,Z(!1),K1("notificationsEnabled","false");return}if(D==="granted"&&B&&typeof window<"u"&&s8(window))SU(window,Q.current||Q4(window)).catch((W)=>{console.warn("Failed to refresh stored web push subscription:",W)})},[]),b(()=>{q.current=j},[j]),b(()=>{if(typeof window>"u"||typeof document>"u")return;let B=Q.current||Q4(window),D=K.current||l6(window);Q.current=B,K.current=D;let W=(J=!0,L="fetch")=>{let x=ej({chatJid:$,runtimeWindow:window,runtimeDocument:document,deviceId:B,clientId:D});if(J)PU(x,window);else fU({deviceId:B,clientId:D},window);let I={device_id:B,client_id:D,chat_jid:$,visibility_state:x.visibilityState,has_focus:x.hasFocus,active:J};if(!J&&L==="beacon"&&xw(I,window))return;Iw(I,{runtimeWindow:window,keepalive:!J||L==="keepalive"})},H=()=>W(!0),z=()=>W(!1,"beacon");W(!0);let k=setInterval(()=>W(!0),15000);return document.addEventListener("visibilitychange",H),window.addEventListener("focus",H),window.addEventListener("blur",H),window.addEventListener("pageshow",H),window.addEventListener("pagehide",z),window.addEventListener("beforeunload",z),()=>{clearInterval(k),document.removeEventListener("visibilitychange",H),window.removeEventListener("focus",H),window.removeEventListener("blur",H),window.removeEventListener("pageshow",H),window.removeEventListener("pagehide",z),window.removeEventListener("beforeunload",z),W(!1,"beacon")}},[$]);let V=R(()=>{if(typeof Notification>"u")return Promise.resolve("denied");try{let B=Notification.requestPermission();if(B&&typeof B.then==="function")return B;return Promise.resolve(B)}catch(B){return console.debug("[use-notifications] Notification permission request threw; returning default permission state.",B),Promise.resolve("default")}},[]),Y=R(async()=>{if(typeof window>"u"||typeof Notification>"u")return;if(!window.isSecureContext){alert("Notifications require a secure context (HTTPS or installed app).");return}if(Notification.permission==="denied"){G("denied"),alert("Browser notifications are blocked. Enable them in your browser settings.");return}if(Notification.permission==="default"){let W=await V();if(G(W||"default"),W!=="granted"){q.current=!1,Z(!1),K1("notificationsEnabled","false");return}}let B=!q.current;q.current=B,Z(B),K1("notificationsEnabled",String(B));let D=Q.current||Q4(window);if(Q.current=D,s8(window))try{if(B)await SU(window,D);else await ww(window,D)}catch(W){if(console.warn("Failed to sync web push notifications:",W),B)alert("Notifications were enabled, but web push setup failed. If you are on iPhone or iPad, reopen PiClaw from the Home Screen and try again.")}},[V]),N=R((B,D,W={})=>{if(!q.current)return!1;if(typeof Notification>"u")return!1;if(Notification.permission!=="granted")return!1;try{let H=new Notification(kw(B,W?.sourceLabel||"",window),{body:D});return H.onclick=()=>{wU(window)},!0}catch(H){return console.debug("[use-notifications] Local notification creation failed.",H,{title:typeof B==="string"?B:null}),!1}},[]),F=R((B)=>{if(typeof window>"u"||typeof document>"u")return!1;return RU({chatJid:typeof B==="string"&&B.trim()?B.trim():$,runtimeWindow:window,runtimeDocument:document,deviceId:Q.current||Q4(window),clientId:K.current||l6(window)})},[$]);return{notificationsEnabled:j,notificationPermission:X,toggleNotifications:Y,notify:N,shouldNotifyLocallyForChat:F}}function Cw(_){let{activeChatAgents:$,currentChatBranches:j,currentChatJid:Z}=_,X=j.find((G)=>G?.chat_jid===Z);if(X)return X;return $.find((G)=>G?.chat_jid===Z)||null}function Pw(_){return{status:_?"running":"idle",message:_?"Preparing a new chat branch…":""}}function fw(_,$){let j=typeof $?.root_chat_jid==="string"?$.root_chat_jid.trim():"";if(j)return j;let Z=typeof _==="string"?_.trim():"";if(!Z)return"web:default";let X=Z.indexOf(":branch:");if(X<=0)return Z;return Z.slice(0,X)||Z}function uU(_){let{currentChatJid:$,branchLoaderMode:j}=_,[Z,X]=C("disconnected"),[G,q]=C(!1),[Q,K]=C(()=>b_()),[V,Y]=C(null),[N,F]=C(null),[B,D]=C(!1),[W,H]=C("current"),[z,k]=C([]),[J,L]=C([]),[x,I]=C([]),[E,M]=C(null),[O,T]=C({}),[y,A]=C(null),[P,f]=C(null),[u,c]=C(!1),[r,e]=C(null),[m,_0]=C(null),[H0,X0]=C(!1),[j0,Q0]=C([]),[F0,h]=C([]),[$0,K0]=C(null),[L0,a]=C(()=>new Map),[G0,O0]=C(()=>new Set),[P0,p0]=C(()=>({message:null,indicator:null,visible:!0})),[g0,X1]=C([]),[l0,a0]=C(!1),[f0,i0]=C(()=>ZN()),[m0,e0]=C(null),[s0,D1]=C(null),G1=g(new Set),c0=q0(()=>Cw({activeChatAgents:j0,currentChatBranches:F0,currentChatJid:$}),[j0,F0,$]),J0=q0(()=>fw($,c0),[c0,$]),V1=jN(W),[o0,H1]=C(()=>Pw(j)),z0=g0.length,b0=g(new Set),x0=g([]),n0=g(new Set),E1=g(0),Y1=g({inFlight:!1,lastAttemptAt:0,turnId:null});b0.current=new Set(g0.map((m_)=>m_.row_id)),x0.current=g0;let{notificationsEnabled:z1,notificationPermission:U1,toggleNotifications:A1,notify:x1,shouldNotifyLocallyForChat:f1}=gU({chatJid:$}),[O1,s1]=C(()=>new Set),[R1,V0]=C(()=>EN({allowLegacyFallback:!0,defaultValue:!1})),[v,n]=C({name:"You",avatar_url:null,avatar_background:null}),s=g(null),Z0=g(!1),U0=g(!1),T0=g(!1),A0=g(null),k0=g($),y0=g(new Map),h0=g($),S0=g(0),d0=g(0),_1=g({}),I0=g({name:null,avatar_url:null}),w0=g({currentHashtag:null,searchQuery:null,searchOpen:!1}),W1=g(null),$1=g(null),d=g(0),B0=g(0),r0=g(0),Z1=g(null),S1=g(null),z_=g(null),u1=g(null),A_=g(0),C1=g({title:null,avatarBase:null}),M1=g(null),M_=g(!1),[L1,k1]=C(!1),k_=g(0),[p1,a1]=C(!1),[e1,F1]=C(""),x_=q0(()=>Y8(e1,c0?.agent_name||""),[c0?.agent_name,e1]),W_=g(null);return{connectionStatus:Z,setConnectionStatus:X,stateAccessFailed:G,setStateAccessFailed:q,isWebAppMode:Q,setIsWebAppMode:K,currentHashtag:V,setCurrentHashtag:Y,searchQuery:N,setSearchQuery:F,searchOpen:B,setSearchOpen:D,searchScope:W,setSearchScope:H,fileRefs:z,setFileRefs:k,folderRefs:J,setFolderRefs:L,messageRefs:x,setMessageRefs:I,intentToast:E,setIntentToast:M,agents:O,setAgents:T,activeModel:y,setActiveModel:A,activeThinkingLevel:P,setActiveThinkingLevel:f,supportsThinking:u,setSupportsThinking:c,activeModelUsage:r,setActiveModelUsage:e,agentModelsPayload:m,setAgentModelsPayload:_0,hasLoadedAgentModels:H0,setHasLoadedAgentModels:X0,activeChatAgents:j0,setActiveChatAgents:Q0,currentChatBranches:F0,setCurrentChatBranches:h,contextUsage:$0,setContextUsage:K0,extensionStatusPanels:L0,setExtensionStatusPanels:a,pendingExtensionPanelActions:G0,setPendingExtensionPanelActions:O0,extensionWorkingState:P0,setExtensionWorkingState:p0,followupQueueItems:g0,setFollowupQueueItems:X1,isAgentTurnActive:l0,setIsAgentTurnActive:a0,btwSession:f0,setBtwSession:i0,floatingWidget:m0,setFloatingWidget:e0,attachmentPreview:s0,setAttachmentPreview:D1,dismissedLiveWidgetKeysRef:G1,currentBranchRecord:c0,currentRootChatJid:J0,activeSearchScopeLabel:V1,branchLoaderState:o0,setBranchLoaderState:H1,followupQueueCount:z0,followupQueueRowIdsRef:b0,followupQueueItemsRef:x0,dismissedQueueRowIdsRef:n0,queueRefreshGenRef:E1,silentRecoveryRef:Y1,notificationsEnabled:z1,notificationPermission:U1,handleToggleNotifications:A1,notify:x1,shouldNotifyLocallyForChat:f1,removingPostIds:O1,setRemovingPostIds:s1,workspaceOpen:R1,setWorkspaceOpen:V0,userProfile:v,setUserProfile:n,staleUiVersionRef:s,staleUiReloadScheduledRef:Z0,hasConnectedOnceRef:U0,wasAgentActiveRef:T0,agentStatusRef:A0,activeChatJidRef:k0,chatPaneStateByChatRef:y0,paneStateOwnerChatJidRef:h0,draftThrottleRef:S0,thoughtThrottleRef:d0,agentsRef:_1,userProfileRef:I0,viewStateRef:w0,timelineRef:W1,appShellRef:$1,sidebarWidthRef:d,editorWidthRef:B0,dockHeightRef:r0,lastNotifiedIdRef:Z1,lastAgentResponseRef:S1,btwAbortRef:z_,lastActivityTimerRef:u1,lastActivityTokenRef:A_,brandingRef:C1,intentToastTimerRef:M1,renameBranchInFlightRef:M_,isRenamingBranch:L1,setIsRenamingBranch:k1,renameBranchLockUntilRef:k_,isRenameBranchFormOpen:p1,setIsRenameBranchFormOpen:a1,renameBranchNameDraft:e1,setRenameBranchNameDraft:F1,renameBranchDraftState:x_,renameBranchNameInputRef:W_}}M0();M0();function Rw(_,$,j,Z){if(!(_ instanceof Map)||_.size===0||!$||!j)return _;let X=!1,G=new Map;for(let[q,Q]of _.entries()){let K=q;if(Z==="dir"){if(q===$)K=j,X=!0;else if(q.startsWith(`${$}/`))K=`${j}${q.slice($.length)}`,X=!0}else if(q===$)K=j,X=!0;G.set(K,Q)}return X?G:_}function vU(_,$,j,Z){if(!(_ instanceof Set)||_.size===0||!$||!j)return _;let X=!1,G=new Set;for(let q of _.values()){let Q=q;if(Z==="dir"){if(q===$)Q=j,X=!0;else if(q.startsWith(`${$}/`))Q=`${j}${q.slice($.length)}`,X=!0}else if(q===$)Q=j,X=!0;G.add(Q)}return X?G:_}function mU({onTabClosed:_}={}){let $=g(_);$.current=_;let[j,Z]=C(()=>j1.getTabs()),[X,G]=C(()=>j1.getActiveId()),[q,Q]=C(()=>j1.getTabs().length>0);b(()=>{return j1.onChange((A,P)=>{Z(A),G(P),Q(A.length>0)})},[]);let[K,V]=C(()=>new Set),[Y,N]=C(()=>new Set),[F,B]=C(()=>new Map),D=R((A)=>{V((P)=>{let f=new Set(P);if(f.has(A))f.delete(A);else f.add(A);return f})},[]),W=R((A)=>{V((P)=>{if(!P.has(A))return P;let f=new Set(P);return f.delete(A),f})},[]),H=R((A)=>{N((P)=>{if(!P.has(A))return P;let f=new Set(P);return f.delete(A),f})},[]),z=R((A)=>{B((P)=>{if(!P.has(A))return P;let f=new Map(P);return f.delete(A),f})},[]),k=R((A,P={})=>{if(!A)return;let f=typeof P?.paneOverrideId==="string"&&P.paneOverrideId.trim()?P.paneOverrideId.trim():null,u={path:A,mode:"edit"};try{if(!(f?Q1.get(f):Q1.resolve(u))){if(!Q1.get("editor")){console.warn(`[openEditor] No pane handler for: ${A}`);return}}}catch(m){console.warn(`[openEditor] paneRegistry.resolve() error for "${A}":`,m)}let c=typeof P?.label==="string"&&P.label.trim()?P.label.trim():void 0,r=P?.viewState&&typeof P.viewState==="object"?P.viewState:null,e=P?.diffMode==="saved"?"saved":null;if(j1.open(A,c),r)j1.saveViewState(A,r);if(f)B((m)=>{if(m.get(A)===f)return m;let _0=new Map(m);return _0.set(A,f),_0});if(e==="saved")N((m)=>{if(m.has(A))return m;let _0=new Set(m);return _0.add(A),_0})},[]),J=R(()=>{let A=j1.getActiveId();if(A){let P=j1.get(A);if(P?.dirty){if(!window.confirm(`"${P.label}" has unsaved changes. Close anyway?`))return}j1.close(A),W(A),H(A),z(A),$.current?.(A)}},[H,z,W]),L=R((A)=>{let P=j1.get(A);if(P?.dirty){if(!window.confirm(`"${P.label}" has unsaved changes. Close anyway?`))return}j1.close(A),W(A),H(A),z(A),$.current?.(A)},[H,z,W]),x=R((A)=>{j1.activate(A)},[]),I=R((A)=>{let P=j1.getTabs().filter((c)=>c.id!==A&&!c.pinned),f=P.filter((c)=>c.dirty).length;if(f>0){if(!window.confirm(`${f} unsaved tab${f>1?"s":""} will be closed. Continue?`))return}let u=P.map((c)=>c.id);j1.closeOthers(A),u.forEach((c)=>{W(c),H(c),z(c),$.current?.(c)})},[H,z,W]),E=R(()=>{let A=j1.getTabs().filter((u)=>!u.pinned),P=A.filter((u)=>u.dirty).length;if(P>0){if(!window.confirm(`${P} unsaved tab${P>1?"s":""} will be closed. Continue?`))return}let f=A.map((u)=>u.id);j1.closeAll(),f.forEach((u)=>{W(u),H(u),z(u),$.current?.(u)})},[H,z,W]),M=R((A)=>{j1.togglePin(A)},[]),O=R((A)=>{if(!A)return;N((P)=>{let f=new Set(P);if(f.has(A))f.delete(A);else f.add(A);return f}),j1.activate(A)},[]),T=R((A)=>{if(!A)return;B((P)=>{if(P.get(A)==="editor")return P;let f=new Map(P);return f.set(A,"editor"),f}),j1.activate(A)},[]),y=R(()=>{let A=j1.getActiveId();if(A)window.dispatchEvent(new CustomEvent("workspace-reveal-path",{detail:{path:A}}))},[]);return b(()=>{let A=(P)=>{let{oldPath:f,newPath:u,type:c}=P.detail||{};if(!f||!u)return;if(c==="dir"){for(let r of j1.getTabs())if(r.path===f||r.path.startsWith(`${f}/`)){let e=`${u}${r.path.slice(f.length)}`;j1.rename(r.id,e)}}else j1.rename(f,u);V((r)=>vU(r,f,u,c)),N((r)=>vU(r,f,u,c)),B((r)=>Rw(r,f,u,c))};return window.addEventListener("workspace-file-renamed",A),()=>window.removeEventListener("workspace-file-renamed",A)},[]),b(()=>{let A=(P)=>{if(j1.hasUnsaved())P.preventDefault(),P.returnValue=""};return window.addEventListener("beforeunload",A),()=>window.removeEventListener("beforeunload",A)},[]),{editorOpen:q,tabStripTabs:j,tabStripActiveId:X,previewTabs:K,diffTabs:Y,tabPaneOverrides:F,openEditor:k,closeEditor:J,handleTabClose:L,handleTabActivate:x,handleTabCloseOthers:I,handleTabCloseAll:E,handleTabTogglePin:M,handleTabTogglePreview:D,handleTabToggleDiff:O,handleTabEditSource:T,revealInExplorer:y}}M0();function _$(_){return typeof _==="string"&&_.trim()?_.trim():null}function Sw(_=globalThis){try{return typeof _?.crypto?.randomUUID==="function"?_.crypto.randomUUID():null}catch($){return null}}function h4(_="pane"){let $=Sw();if($)return`${_}-${$}`;return`${_}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`}function cU(_){let $=_$(_?.paneInstanceId),j=_$(_?.paneWindowId);if(!$||!j)return{};let Z=_$(_?.paneSourceWindowId);return{pane_instance_id:$,pane_window_id:j,...Z?{pane_source_window_id:Z}:{}}}function hU(_={}){let $=new URLSearchParams(_.search||"");return{panePath:_$($.get("pane_path"))||_$(_.panePath),paneLabel:_$($.get("pane_label"))||_$(_.paneLabel),paneInstanceId:_$($.get("pane_instance_id")),paneWindowId:_$($.get("pane_window_id")),paneSourceWindowId:_$($.get("pane_source_window_id"))}}function l4(_){return Boolean(_?.panePath&&_?.paneInstanceId&&_?.paneWindowId)}function $$(_){return typeof _==="string"&&_.trim()?_.trim():null}function lU(_){let $=$$(_?.panePath),j=$$(_?.paneInstanceId),Z=$$(_?.ownerWindowId);if(!$||!j||!Z)return null;let X=$$(_?.now)||new Date().toISOString();return{panePath:$,paneInstanceId:j,ownerWindowId:Z,detachedAt:X,requestedAt:X,label:$$(_?.label),sourceWindowId:$$(_?.sourceWindowId)}}function _Z(_,$){if(!_||!$)return!1;return $$($.panePath)===_.panePath&&$$($.paneInstanceId)===_.paneInstanceId&&$$($.paneWindowId)===_.ownerWindowId}function $Z(_,$){if(!_)return null;return{panePath:_.panePath,paneInstanceId:_.paneInstanceId,ownerWindowId:_.ownerWindowId,detachedAt:$$($)||new Date().toISOString(),label:_.label||null}}function a8(_){try{return _?.close?.(),!0}catch($){return!1}}function jZ(_,$,j){try{return _?.postMessage?.($,j),!0}catch(Z){return!1}}function bw(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$)return!1;if(_.openTabIds?.has($))return!0;if(_.pendingDetachedTabPaths?.has?.($))return!0;if(_.detachedTabPaths?.has?.($))return!0;if($===_.terminalTabPath)return Boolean(_.hasPendingDetachedDockPane||_.hasDetachedDockPane);return!1}function pU(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$)return;let j=_?.sourceHost==="dock"?"dock":"tab";if($===_.terminalTabPath&&j==="dock"){_.setDockVisible?.(!1);return}_.closeTab?.($)}var gw=400;function uw(_){let $=Array.isArray(_?.changed_paths)?_.changed_paths.map((Z)=>typeof Z==="string"?Z.trim():"").filter(Boolean):[];if($.length>0)return $;let j=typeof _?.path==="string"?_.path.trim():"";return j?[j]:["."]}function vw(_,$){if(!_)return!1;if(!Array.isArray($)||$.length===0)return!0;return $.some((j)=>{return uw(j).some((X)=>X==="."||X===_)})}async function rU(_,$){if(typeof _?.afterAttachToHost!=="function")return;await _.afterAttachToHost($)}function mw(_=typeof document<"u"?document:null){if(!_)return!0;let $=typeof _.visibilityState==="string"?_.visibilityState:"";return!$||$==="visible"}function _3(_=typeof navigator<"u"?navigator:null){if(!_)return!1;let $=String(_.userAgent||""),j=String(_.vendor||""),Z=/AppleWebKit/i.test($),X=/Safari/i.test($),G=/Chrome|Chromium|CriOS|EdgiOS|EdgA|Edg\//i.test($),q=/FxiOS/i.test($);return Z&&(j.includes("Apple")||X)&&!G&&!q}function nU(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$)return!1;if($!==_.terminalTabPath)return!1;if((_?.reason==="message"?"message":"closed-window")==="closed-window")return!0;return _?.allowLiveTransfer===!1}function t8(_){if(!nU(_))return!1;return _3(_?.runtimeNavigator)}function e8(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$||$!==_?.terminalTabPath)return!1;return _3(_?.runtimeNavigator)}function u5(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$)return!1;return $!==_?.terminalTabPath}function cw(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$)return null;let j=_?.runtime??globalThis,Z=typeof _?.nowMs==="number"?_.nowMs:Date.now(),X=typeof _?.paneInstanceId==="string"?_.paneInstanceId.trim():"",G=typeof _?.paneOverrideId==="string"?_.paneOverrideId.trim():"",q=typeof _?.terminalTabPath==="string"?_.terminalTabPath:"piclaw://terminal",Q=_?.allowLiveTransfer!==!1,K=_?.instance||null,V=typeof K?.exportHostTransferState==="function"?K.exportHostTransferState():null,Y=$===q,N=V&&!Y?o8({path:$,payload:V},j,Z):null,F=null;if($!==q){let B=V&&typeof V==="object"?typeof V.mtime==="string"?V.mtime:V.mtime===null?null:void 0:void 0,D=typeof K?.isDirty==="function"?K.isDirty():!1,W=typeof K?.getContent==="function"?K.getContent():void 0;F=N2({path:$,content:D?W:void 0,mtime:B,paneOverrideId:G||null,viewState:_?.viewState||null},j,Z)}return{type:"piclaw-pane-reattach-request",panePath:$,...X?{paneInstanceId:X}:{},...F?.editor_popout?{editorPopoutToken:F.editor_popout}:{},...N?.pane_transfer?{paneTransferToken:N.pane_transfer}:{},...Y&&V?{paneTransferPayload:V}:{},...Q?{}:{allowLiveTransfer:!1}}}function hw(_){let $=typeof _?.payload?.panePath==="string"?_.payload.panePath.trim():"";if(!$)return null;let j=_?.runtime??globalThis,Z=typeof _?.nowMs==="number"?_.nowMs:Date.now(),X=typeof _?.payload?.paneInstanceId==="string"&&_.payload.paneInstanceId.trim()?_.payload.paneInstanceId.trim():null,G=typeof _?.payload?.editorPopoutToken==="string"?_.payload.editorPopoutToken.trim():"",q=typeof _?.payload?.paneTransferToken==="string"?_.payload.paneTransferToken.trim():"",Q=_?.payload?.paneTransferPayload&&typeof _.payload.paneTransferPayload==="object"&&!Array.isArray(_.payload.paneTransferPayload)?_.payload.paneTransferPayload:null,K=G?C3(G,j,Z):null,V=Q?{panePath:$,path:$,payload:Q,capturedAt:Z}:q?oj(q,j,Z):null;return{panePath:$,paneInstanceId:X,editorTransfer:K?.path===$?K:null,hostTransfer:V?.path===$?V:null,allowLiveTransfer:_?.payload?.allowLiveTransfer!==!1}}function dU(_){let{panePopoutMode:$,panePopoutPath:j,panePopoutLabel:Z,chatOnlyMode:X,editorOpen:G,tabStripTabs:q,tabStripActiveId:Q,previewTabs:K,diffTabs:V,tabPaneOverrides:Y,terminalTabPath:N,vncTabPrefix:F,openEditor:B,closeEditor:D,getWorkspaceFile:W}=_,H=g(null),z=g(null),k=g(null),J=g(null),L=g((()=>{if(!$)return null;let V0=q5("editor_popout");return C3(V0)})()),x=g((()=>{if(!$)return null;return wF()})()),I=g(hU({search:typeof window<"u"?window.location.search:"",panePath:j,paneLabel:Z})),E=g(I.current.paneWindowId||h4("pane-window")),M=g(new Map),O=g(new Map),T=g(new Map),y=g(new Map),A=g(!1),P=g(new Map),f=g(h4("pane-instance")),u=g(new Map),c=g(new Map),r=g(new Set),[e,m]=C(()=>new Map),_0=g(e);_0.current=e;let[H0,X0]=C(()=>new Map),j0=g(H0);j0.current=H0;let[Q0,F0]=C(null),h=g(Q0);h.current=Q0;let[$0,K0]=C(null),L0=g($0);L0.current=$0;let a=Q1.getDockPanes().length>0,[G0,O0]=C(!1),P0=R(()=>O0((V0)=>!V0),[]),p0=R(()=>{B(N,{label:"Terminal"})},[B,N]),g0=R(()=>{B(F,{label:"VNC"})},[B,F]),X1=R((V0)=>{let v=typeof V0==="string"?V0.trim():"";if(!v)return h4("pane-instance");if(v===N&&!j1.get(v)){if(!f.current)f.current=h4("pane-instance");return f.current}let s=P.current.get(v);if(s)return s;let Z0=h4("pane-instance");return P.current.set(v,Z0),Z0},[N]),l0=q0(()=>!$&&Q?H0.get(Q)||null:null,[H0,$,Q]),a0=!$?$0:null,f0=R((V0)=>{if(!V0)return;IF(V0),c.current.delete(V0),r.current.delete(V0),F0((v)=>v?.panePath===V0?null:v),m((v)=>{if(!v.has(V0))return v;let n=new Map(v);return n.delete(V0),n})},[]),i0=R((V0)=>{if(!V0)return;u.current.delete(V0),c.current.delete(V0),r.current.delete(V0),f0(V0),K0((v)=>v?.panePath===V0?null:v),X0((v)=>{if(!v.has(V0))return v;let n=new Map(v);return n.delete(V0),n})},[f0]),m0=R((V0,v={})=>{let n=typeof V0==="string"?V0.trim():"";if(!n)return!1;if(e8({panePath:n,terminalTabPath:N}))return!1;let s=u.current.get(n),Z0=Boolean(j0.current.get(n)),U0=Boolean(L0.current?.panePath===n);if(i0(n),n===N&&U0&&!Z0)O0(!0);else if(n===N&&Z0)B(n,{label:"Terminal"});else if(j1.get(n))j1.activate(n);else B(n);if(v.closeDetachedWindow!==!1&&s&&typeof s.close==="function")a8(s);return!0},[i0,B,O0,N]),e0=R(()=>{if($)return;if(!mw())return;let V0=Date.now();for(let[v,n]of c.current.entries()){if(n>V0)continue;c.current.delete(v),m0(v,{closeDetachedWindow:!1})}},[$,m0]),s0=R((V0,v={})=>{let n=typeof V0==="string"?V0.trim():"";if(!n)return!1;let s={panePath:n,terminalTabPath:N,allowLiveTransfer:v.allowLiveTransfer,reason:v.reason};if(t8(s))return u.current.delete(n),c.current.delete(n),r.current.add(n),!0;if(!nU(s))return m0(n,{closeDetachedWindow:!1});return c.current.set(n,Date.now()+gw),e0(),!0},[e0,m0,N]),D1=R((V0)=>{let v=typeof V0==="string"?V0.trim():"";if(!v)return null;let n=X1(v),s=h4("pane-window");return{paneInstanceId:n,paneWindowId:s,params:cU({paneInstanceId:n,paneWindowId:s,paneSourceWindowId:E.current})}},[X1]),G1=R((V0,v,n,s)=>{let Z0=typeof V0==="string"?V0.trim():"";if(!Z0||!s)return;let U0=lU({panePath:Z0,paneInstanceId:s.pane_instance_id,ownerWindowId:s.pane_window_id,sourceWindowId:s.pane_source_window_id,label:v});if(!U0)return;if(u.current.set(Z0,n||null),Z0===N&&!j1.get(Z0)){F0(U0);return}m((A0)=>{let k0=new Map(A0);return k0.set(Z0,U0),k0})},[N]),c0=R((V0,v)=>{let n=typeof V0?.panePath==="string"?V0.panePath.trim():"";if(!n)return!1;let s=u.current.get(n);if(s&&v&&s!==v)return!1;let Z0=_0.current.get(n)||null;if(_Z(Z0,V0)){let y0=z.current,h0=u5({panePath:n,terminalTabPath:N});if(h0&&y0&&typeof y0.moveHost==="function")g5({panePath:n,paneInstanceId:Z0.paneInstanceId,paneWindowId:Z0.ownerWindowId,instance:y0,releaseSourceHost:()=>{if(z.current===y0)z.current=null}});if(h0&&z.current)z.current=null;let S0=$Z(Z0);if(!S0)return!1;return m((d0)=>{if(!d0.has(n))return d0;let _1=new Map(d0);return _1.delete(n),_1}),X0((d0)=>{let _1=new Map(d0);return _1.set(n,S0),_1}),pU({panePath:n,terminalTabPath:N,closeTab:(d0)=>j1.close(d0),sourceHost:"tab"}),!0}if(n!==N)return!1;let U0=h.current,T0=J.current,A0=u5({panePath:n,terminalTabPath:N});if(A0&&U0&&T0&&typeof T0.moveHost==="function")g5({panePath:n,paneInstanceId:U0.paneInstanceId,paneWindowId:U0.ownerWindowId,instance:T0,releaseSourceHost:()=>{if(J.current===T0)J.current=null}});if(A0&&J.current)J.current=null;if(!_Z(U0,V0))return!1;let k0=$Z(U0);if(!k0)return!1;return F0(null),K0(k0),pU({panePath:n,terminalTabPath:N,setDockVisible:O0,sourceHost:"dock"}),!0},[O0,N]),J0=R((V0=!1,v=!0)=>{if(!$)return!1;let n=I.current;if(!l4(n))return!1;if(typeof window>"u"||!window.opener||window.opener.closed)return!1;if(A.current){if(V0)a8(window);return!0}let s=n.panePath||j,Z0=s===N?J.current||z.current:z.current,U0=v&&u5({panePath:s,terminalTabPath:N}),T0=cw({panePath:s,paneInstanceId:n.paneInstanceId,paneOverrideId:s===N?null:typeof Y?.get==="function"?Y.get(s)||null:null,terminalTabPath:N,viewState:s===N?null:j1.getViewState(s)||null,allowLiveTransfer:U0,instance:Z0});if(!T0)return!1;if(U0&&T0.paneTransferToken&&typeof Z0?.moveHost==="function"){if(J.current===Z0)J.current=null;if(z.current===Z0)z.current=null}if(!jZ(window.opener,T0,window.location.origin))return!1;if(A.current=!0,V0)a8(window);return!0},[$,j,Y,N]),V1=R(()=>J0(!0,!0),[J0]);b(()=>{if(!$||typeof window>"u")return;let V0=()=>{let v=I.current,n=l4(v)?v.panePath||j||"":"";if(t8({panePath:n,terminalTabPath:N,allowLiveTransfer:!1,reason:"closed-window"}))return;J0(!1,!1)};return window.addEventListener("pagehide",V0),window.addEventListener("beforeunload",V0),()=>{window.removeEventListener("pagehide",V0),window.removeEventListener("beforeunload",V0)}},[$,J0]);let o0=q0(()=>GN(q,Q),[Q,q]),H1=q0(()=>qN(Y,Q),[Y,Q]),z0=q0(()=>xj(Z,o0,j),[o0,Z,j]),b0=q0(()=>Q&&V.has(Q)?"saved":null,[V,Q]),x0=g(b0);b(()=>{x0.current=b0},[b0]);let n0=q0(()=>VN(q,K,V,Q),[V,K,Q,q]),E1=q0(()=>KN(j,F),[j,F]),Y1=q0(()=>YN(j,N,n0,E1),[E1,n0,j,N]),z1=NN($,X,G,a,G0),[U1,A1]=C(!1),x1=g(!1),f1=R(()=>{if(!G||X)return;if(x1.current=G0,G0)O0(!1);A1(!0)},[X,G0,G]),O1=R(()=>{if(!U1)return;if(A1(!1),x1.current)O0(!0),x1.current=!1},[U1]),s1=R(()=>{if(U1){O1();return}f1()},[f1,O1,U1]);b(()=>{if(U1&&!G)O1()},[G,O1,U1]),b(()=>{let V0=new Set(q.map((s)=>s.id)),v=new Set(_0.current.keys()),n=new Set(j0.current.keys());for(let s of Array.from(P.current.keys()))if(!bw({panePath:s,openTabIds:V0,pendingDetachedTabPaths:v,detachedTabPaths:n,terminalTabPath:N,hasPendingDetachedDockPane:Boolean(h.current),hasDetachedDockPane:Boolean(L0.current)}))P.current.delete(s)},[q,N]),b(()=>{if($||typeof window>"u")return;let V0=(v)=>{if(v.origin!==window.location.origin)return;let n=v.data;if(!n||typeof n!=="object")return;if(n.type==="piclaw-pane-detach-claim"){c0({panePath:n.panePath,paneInstanceId:n.paneInstanceId,paneWindowId:n.paneWindowId},v.source);return}if(n.type!=="piclaw-pane-reattach-request")return;let s=hw({payload:n}),Z0=s?.panePath||"";if(!Z0)return;if(s?.editorTransfer)M.current.set(Z0,s.editorTransfer);if(s?.hostTransfer)if(O.current.set(Z0,s.hostTransfer),s.allowLiveTransfer&&v.source)T.current.set(Z0,v.source);else T.current.delete(Z0);let U0=j0.current.get(Z0)||null,T0=Z0===N?L0.current:null,A0=u5({panePath:Z0,terminalTabPath:N}),k0=U0||T0;if(!k0)return;if(s?.paneInstanceId&&s.paneInstanceId!==k0.paneInstanceId)return;if(e8({panePath:Z0,terminalTabPath:N})){T.current.delete(Z0),y.current.delete(Z0),O.current.delete(Z0),M.current.delete(Z0);return}if(s?.hostTransfer&&s.allowLiveTransfer&&A0)y.current.set(Z0,{panePath:Z0,paneInstanceId:k0.paneInstanceId,paneWindowId:k0.ownerWindowId});else y.current.delete(Z0);if(t8({panePath:Z0,terminalTabPath:N,allowLiveTransfer:s?.allowLiveTransfer,reason:"message"})){T.current.delete(Z0),u.current.delete(Z0),c.current.delete(Z0),r.current.add(Z0);return}s0(Z0,{allowLiveTransfer:s?.allowLiveTransfer,reason:"message"})};return window.addEventListener("message",V0),()=>window.removeEventListener("message",V0)},[c0,$,s0,N]),b(()=>{if($||typeof window>"u"||typeof document>"u")return;let V0=()=>e0();window.addEventListener("focus",V0),window.addEventListener("pageshow",V0),document.addEventListener("visibilitychange",V0);let v=setInterval(()=>{e0();for(let[n,s]of u.current.entries()){if(!s||!s.closed)continue;if(n===N?Boolean(h.current):_0.current.has(n)){u.current.delete(n),f0(n);continue}if(e8({panePath:n,terminalTabPath:N})){i0(n);continue}if(t8({panePath:n,terminalTabPath:N,allowLiveTransfer:!1,reason:"closed-window"})){u.current.delete(n),c.current.delete(n),r.current.add(n);continue}if(r.current.has(n)){u.current.delete(n);continue}s0(n,{allowLiveTransfer:!1,reason:"closed-window"})}},750);return()=>{window.removeEventListener("focus",V0),window.removeEventListener("pageshow",V0),document.removeEventListener("visibilitychange",V0),clearInterval(v)}},[i0,f0,e0,$,s0,N]),b(()=>{if(!$||!j)return;if(j1.getActiveId()===j)return;let v=L.current?.path===j?L.current:null,n=x.current?.path===j?x.current:null;B(j,{...Z?{label:Z}:{},...v?.paneOverrideId?{paneOverrideId:v.paneOverrideId}:{},...v?.viewState?{viewState:v.viewState}:{},...n?.payload?.diffMode?{diffMode:n.payload.diffMode}:{}})},[B,Z,$,j]),b(()=>{if(!$)return;let V0=I.current;if(!l4(V0))return;if(typeof window>"u"||!window.opener||window.opener.closed)return;jZ(window.opener,{type:"piclaw-pane-detach-claim",panePath:V0.panePath,paneInstanceId:V0.paneInstanceId,paneWindowId:V0.paneWindowId},window.location.origin)},[$]),b(()=>{let V0=H.current;if(!V0)return;if(z.current)z.current.dispose(),z.current=null;let v=Q;if(!v)return;if(!$&&l0?.panePath===v){V0.innerHTML="";return}let n=L.current?.path===v?L.current:null,s=M.current.get(v)||null,Z0=n||s,U0=x.current?.path===v?x.current:null,T0=O.current.get(v)||null,A0=U0||T0,k0=H1||Z0?.paneOverrideId||null,y0=A0?.payload?{...A0.payload}:null;if(x0.current)y0={...y0||{},diffMode:x0.current};else if(y0&&"diffMode"in y0)delete y0.diffMode;let h0={path:v,mode:"edit",...Z0?.content!==void 0?{content:Z0.content}:{},...Z0?.mtime!==void 0?{mtime:Z0.mtime}:{},...y0?{transferState:y0}:{}},S0=(k0?Q1.get(k0):null)||Q1.resolve(h0)||Q1.get("editor");if(!S0){V0.innerHTML='<div style="padding:2em;color:var(--text-secondary);text-align:center;">No editor available for this file.</div>';return}let d0=null,_1=!1,I0=(w0)=>{d0=w0,z.current=w0,w0.onDirtyChange?.((d)=>{j1.setDirty(v,d)}),w0.onSaveRequest?.(()=>{}),w0.onClose?.(()=>{D()});let W1=j1.getViewState(v);if(W1&&typeof w0.restoreViewState==="function")requestAnimationFrame(()=>w0.restoreViewState(W1));if(typeof w0.onViewStateChange==="function")w0.onViewStateChange((d)=>{j1.saveViewState(v,d)});let $1=I.current;if($&&l4($1)&&typeof w0?.moveHost==="function"&&u5({panePath:v,terminalTabPath:N}))g5({panePath:v,paneInstanceId:$1.paneInstanceId||"",paneWindowId:$1.paneWindowId||"",instance:w0,releaseSourceHost:()=>{if(J.current===w0)J.current=null;if(z.current===w0)z.current=null}});rU(w0,{path:v,hostMode:$?"popout":"main",transferState:y0}).catch((d)=>{console.warn("[pane-attach] afterAttachToHost failed:",d)}),requestAnimationFrame(()=>w0.focus?.())};return(async()=>{let w0=I.current,W1=$&&l4(w0)&&w0.panePath===v?{panePath:v,paneInstanceId:w0.paneInstanceId||"",paneWindowId:w0.paneWindowId||""}:null,$1=y.current.get(v)||null,d=u5({panePath:v,terminalTabPath:N})?W1||$1:null,B0=$?typeof window<"u"&&window.opener&&!window.opener.closed?window.opener:null:T.current.get(v)||null,r0=$?"popout":"main";if(A0&&d&&B0)try{let Z1=await xF(B0,d,V0,{path:v,hostMode:r0,transferState:y0});if(!_1&&Z1){if(I0(Z1),n)L.current=null;if(s)M.current.delete(v);if(U0)x.current=null;if(T0)O.current.delete(v);T.current.delete(v),y.current.delete(v);return}}catch(Z1){console.warn("[pane-live-transfer] Failed to claim live pane instance:",Z1)}if(_1)return;if(I0(S0.mount(V0,h0)),n)L.current=null;if(s)M.current.delete(v);if(U0)x.current=null;if(T0)O.current.delete(v);T.current.delete(v),y.current.delete(v)})(),()=>{if(_1=!0,z.current===d0)d0.dispose(),z.current=null}},[l0,H1,D,$,Q]),b(()=>{let V0=Q,v=z.current;if(!V0||typeof v?.setDiffMode!=="function")return;v.setDiffMode(b0)},[b0,Q]);let R1=R(async(V0)=>{let v=typeof Q==="string"?Q.trim():"",n=z.current;if(!v||!n?.setContent)return;if(typeof n.isDirty==="function"&&n.isDirty())return;if(!vw(v,V0))return;try{let s=await W(v,1e6,"edit"),Z0=typeof s?.text==="string"?s.text:"",U0=typeof s?.mtime==="string"&&s.mtime.trim()?s.mtime.trim():new Date().toISOString();n.setContent(Z0,U0)}catch(s){console.warn("[workspace_update] Failed to refresh active pane:",s)}},[W,Q]);return b(()=>{let V0=k.current;if(J.current)J.current.dispose(),J.current=null;if(!V0||!a||!G0)return;if(!$&&a0?.panePath===N){V0.innerHTML="";return}let v=Q1.getDockPanes()[0];if(!v){V0.innerHTML='<div class="terminal-placeholder">No dock pane available.</div>';return}let n=x.current?.path===N?x.current:null,s=O.current.get(N)||null,Z0=n||s,U0=v.mount(V0,{mode:"view",...Z0?.payload?{transferState:Z0.payload}:{}});if(J.current=U0,rU(U0,{path:N,hostMode:$?"popout":"main",transferState:Z0?.payload||null}).catch((T0)=>{console.warn("[pane-attach] afterAttachToHost failed:",T0)}),n)x.current=null;if(s)O.current.delete(N);return requestAnimationFrame(()=>U0.focus?.()),()=>{if(J.current===U0)U0.dispose(),J.current=null}},[a0,G0,a,$,N]),{editorContainerRef:H,editorInstanceRef:z,dockContainerRef:k,dockInstanceRef:J,hasDockPanes:a,dockVisible:G0,setDockVisible:O0,toggleDock:P0,openTerminalTab:p0,openVncTab:g0,panePopoutTitle:z0,panePopoutHasMenuActions:n0,hidePanePopoutControls:Y1,showEditorPaneContainer:z1,zenMode:U1,exitZenMode:O1,toggleZenMode:s1,refreshActiveEditorFromWorkspace:R1,detachedTabs:H0,activeDetachedTab:l0,detachedDockPane:a0,buildPaneDetachTransfer:D1,registerDetachedPaneWindow:G1,reattachPane:m0,requestPanePopoutReattach:V1,canReattachPanePopout:$&&l4(I.current)&&!e8({panePath:j||"",terminalTabPath:N})}}function lw(_){return{removeFileRefRef:_.removeFileRefRef,editorState:_.editorState,paneRuntime:_.paneRuntime}}function oU(_){let $=g(null),j=mU({onTabClosed:(X)=>$.current?.(X)}),Z=dU({panePopoutMode:_.panePopoutMode,panePopoutPath:_.panePopoutPath,panePopoutLabel:_.panePopoutLabel,chatOnlyMode:_.chatOnlyMode,editorOpen:j.editorOpen,tabStripTabs:j.tabStripTabs,tabStripActiveId:j.tabStripActiveId,previewTabs:j.previewTabs,diffTabs:j.diffTabs,tabPaneOverrides:j.tabPaneOverrides,terminalTabPath:_.terminalTabPath,vncTabPrefix:_.vncTabPrefix,openEditor:j.openEditor,closeEditor:j.closeEditor,getWorkspaceFile:_.getWorkspaceFile});return lw({removeFileRefRef:$,editorState:j,paneRuntime:Z})}T1();var j3=1280,Z3=820;function $3(_){if(typeof _!=="number"||!Number.isFinite(_)||_<=0)return null;return _}function p6(_){return typeof _==="string"&&_.trim()?_.trim():null}function pw(_){let $=p6(_);if(!$)return!1;if($.startsWith("/")||$.startsWith("\\"))return!1;if($.includes("://"))return!1;if($==="."||$===".."||$.startsWith("../"))return!1;return!0}function rw(_){if(_.isMobile)return!1;let $=$3(_.windowWidth),j=$3(_.windowHeight);if($===null||j===null)return!1;if($<j3||j<Z3)return!1;let Z=$3(_.screenWidth),X=$3(_.screenHeight);if(Z!==null&&Z<j3)return!1;if(X!==null&&X<Z3)return!1;return!0}function nw(_){let $=_?.navigator,j=String($?.userAgent||""),Z=Number($?.maxTouchPoints||0);return(typeof _?.matchMedia==="function"?Boolean(_.matchMedia("(pointer: coarse)")?.matches):!1)||Z>1||/Android|iPhone|iPad|iPod/i.test(j)}function dw(_){if(!_||_.kind!=="custom")return null;let $=p6(_.request_id),j=_.options&&typeof _.options==="object"?_.options:null;if(!$||!j||j.action!=="open_workspace_file")return null;let Z=p6(j.path);if(!pw(Z))return null;let X=j.target==="tab"?"tab":"popout";return{requestId:$,chatJid:p6(_.chat_jid),path:Z,label:p6(j.label),target:X}}async function ow(_,$,j){await O5(_,$,j||void 0)}async function iU(_,$){let j=dw(_?.detail?.payload);if(!j)return!1;if(j.chatJid&&j.chatJid!==$.currentChatJid)return!1;let Z=$.respond||ow,X=$.windowObject||(typeof window<"u"?window:void 0),G={width:Number(X?.innerWidth||0)||void 0,height:Number(X?.innerHeight||0)||void 0},q={width:j3,height:Z3};if(j.target==="popout"){if(!rw({windowWidth:X?.innerWidth,windowHeight:X?.innerHeight,screenWidth:X?.screen?.availWidth,screenHeight:X?.screen?.availHeight,isMobile:nw(X)}))return $.showIntentToast?.("Editor popout unavailable",`Need at least ${j3}×${Z3} viewport space for a separate editor window.`,"warning",4500),await Z(j.requestId,{ok:!1,opened:!1,reason:"insufficient_screen_space",detail:"Browser viewport is too small for a separate editor window.",target:j.target,path:j.path,viewport:G,minimum_viewport:q},j.chatJid),!0;let K=await $.popOutPane(j.path,j.label);return await Z(j.requestId,{ok:K,opened:K,reason:K?void 0:"popout_failed",detail:K?void 0:"The browser blocked the editor popout window.",target:j.target,path:j.path},j.chatJid),!0}return $.openEditor(j.path),await Z(j.requestId,{ok:!0,opened:!0,target:j.target,path:j.path},j.chatJid),!0}var ZZ="piclaw:oobe:provider-missing:dismissed";function iw(_){if(!_||typeof _!=="object")return 0;let $=Array.isArray(_.model_options)?_.model_options.filter(Boolean):[];if($.length>0)return $.length;return(Array.isArray(_.models)?_.models.filter((Z)=>typeof Z==="string"&&Z.trim()):[]).length}function sw(_){if(!_||typeof _!=="object")return!1;let $=_.current;return typeof $==="string"&&$.trim().length>0}function sU(_){let{panePopoutMode:$=!1,modelsLoaded:j,modelPayload:Z,providerMissingDismissed:X=!1}=_,G=iw(Z),q=G>0,Q=sw(Z),K=q||Q;if($||!j)return{kind:"hidden",hasAvailableModels:q,availableModelCount:G,hasConfiguredModelHint:Q};if(K)return{kind:"hidden",hasAvailableModels:q,availableModelCount:G,hasConfiguredModelHint:Q};return{kind:X?"hidden":"provider-missing",hasAvailableModels:q,availableModelCount:G,hasConfiguredModelHint:Q}}var aw=_N();await DN();var{searchPosts:tw,deletePost:ew,getAgents:_I,getAgentThought:aU,setAgentThoughtVisibility:tU,getAgentStatus:$I,getAgentContext:jI,getAutoresearchStatus:ZI,stopAutoresearch:XI,dismissAutoresearch:GI,getAgentModels:qI,getActiveChatAgents:QI,getChatBranches:VI,renameChatBranch:KI,pruneChatBranch:YI,purgeChatBranch:NI,restoreChatBranch:BI,getAgentQueueState:FI,steerAgentQueueItem:UI,removeAgentQueueItem:DI,streamSidePrompt:zI,getWorkspaceFile:WI,getThread:HI,getTimeline:OI,sendAgentMessage:LI,forkChatBranch:JI,createRootChatSession:EI}=zN;function AI({locationParams:_,navigate:$}){let{currentChatJid:j,chatOnlyMode:Z,panePopoutMode:X,panePopoutPath:G,panePopoutLabel:q,branchLoaderMode:Q,branchLoaderSourceChatJid:K}=q0(()=>XN(_),[_]);b(()=>{if(typeof window>"u")return;window.__piclawCurrentChatJid=j,window.dispatchEvent?.(new CustomEvent("piclaw:current-chat-changed",{detail:{chatJid:j}}))},[j]);let V=uU({currentChatJid:j,branchLoaderMode:Q}),[Y,N]=C(()=>W$(ZZ,!1)),[F,B]=C(null),D=R((f0)=>{let i0=typeof f0==="string"?f0:"";if(!i0.trim())return;B({token:`prefill-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,text:i0})},[]),{agentStatus:W,setAgentStatus:H,agentDraft:z,setAgentDraft:k,agentPlan:J,setAgentPlan:L,agentThought:x,setAgentThought:I,pendingRequest:E,setPendingRequest:M,currentTurnId:O,setCurrentTurnId:T,steerQueuedTurnId:y,setSteerQueuedTurnId:A,lastAgentEventRef:P,lastSilenceNoticeRef:f,isAgentRunningRef:u,draftBufferRef:c,thoughtBufferRef:r,previewResyncPendingRef:e,previewResyncGenerationRef:m,pendingRequestRef:_0,stalledPostIdRef:H0,currentTurnIdRef:X0,steerQueuedTurnIdRef:j0,thoughtExpandedRef:Q0,draftExpandedRef:F0}=Pq(),h=oU({panePopoutMode:X,panePopoutPath:G,panePopoutLabel:q,chatOnlyMode:Z,terminalTabPath:V5,vncTabPrefix:s_,getWorkspaceFile:WI}),$0=UB({timelineRef:V.timelineRef,viewStateRef:V.viewStateRef,followupQueueRowIdsRef:V.followupQueueRowIdsRef,currentChatJid:j,currentHashtag:V.currentHashtag,searchQuery:V.searchQuery,followupQueueItems:V.followupQueueItems,onIdentity:R((f0)=>{if(!f0)return;let{assistant_name:i0,assistant_avatar_url:m0}=f0;if(i0||m0)V.setAgents((c0)=>{let J0=c0.default||{id:"default"},V1=i0&&!J0.name,o0=m0&&!J0.avatar_url;if(!V1&&!o0)return c0;return{...c0,["default"]:{...J0,...V1?{name:i0}:{},...o0?{avatar_url:m0}:{}}}});let{user_name:e0,user_avatar_url:s0,user_avatar_background:D1}=f0;if(e0||s0||D1)V.setUserProfile((G1)=>{let c0=e0&&!G1.name,J0=s0&&!G1.avatar_url,V1=D1&&!G1.avatar_background;if(!c0&&!J0&&!V1)return G1;return{...G1,...c0?{name:e0}:{},...J0?{avatar_url:s0}:{},...V1?{avatar_background:D1}:{}}})},[V.setAgents,V.setUserProfile])}),K0=_B({environment:{isRenameBranchFormOpen:V.isRenameBranchFormOpen,renameBranchNameInputRef:V.renameBranchNameInputRef,appShellRef:V.appShellRef,setIsWebAppMode:V.setIsWebAppMode,workspaceOpen:V.workspaceOpen,setWorkspaceOpen:V.setWorkspaceOpen,btwSession:V.btwSession,agents:V.agents,agentsRef:V.agentsRef,currentChatJid:j,activeChatJidRef:V.activeChatJidRef,userProfile:V.userProfile,userProfileRef:V.userProfileRef,brandingRef:V.brandingRef,panePopoutMode:X},composeReferences:{setIntentToast:V.setIntentToast,intentToastTimerRef:V.intentToastTimerRef,editorOpen:h.editorState.editorOpen,openEditor:h.editorState.openEditor,resolvePane:(f0)=>Q1.resolve(f0),tabStripActiveId:h.editorState.tabStripActiveId,setFileRefs:V.setFileRefs,setFolderRefs:V.setFolderRefs,setMessageRefs:V.setMessageRefs,currentChatJid:j,currentHashtag:V.currentHashtag,searchQuery:V.searchQuery,searchOpen:V.searchOpen,setCurrentHashtag:V.setCurrentHashtag,setSearchQuery:V.setSearchQuery,setSearchOpen:V.setSearchOpen,navigate:$,chatOnlyMode:Z,getThread:HI,setPosts:$0.setPosts},agentActivity:{lastActivityTtlMs:pq,lastActivityTimerRef:V.lastActivityTimerRef,lastActivityTokenRef:V.lastActivityTokenRef,lastAgentEventRef:P,lastSilenceNoticeRef:f,isAgentRunningRef:u,setIsAgentTurnActive:V.setIsAgentTurnActive,setAgentStatus:H,draftBufferRef:c,thoughtBufferRef:r,pendingRequestRef:_0,lastAgentResponseRef:V.lastAgentResponseRef,currentTurnIdRef:X0,steerQueuedTurnIdRef:j0,agentStatusRef:V.agentStatusRef,silentRecoveryRef:V.silentRecoveryRef,thoughtExpandedRef:Q0,draftExpandedRef:F0,setCurrentTurnId:T,setSteerQueuedTurnId:A,currentTurnIdRefForPanel:X0,setAgentThoughtVisibility:tU,getAgentThought:aU,setAgentThought:I,setAgentDraft:k},chatPaneRuntime:{isAgentTurnActive:V.isAgentTurnActive,steerQueuedTurnId:y,currentTurnId:O,steerQueuedTurnIdRef:j0,setSteerQueuedTurnId:A,agentStatus:W,agentDraft:z,agentPlan:J,agentThought:x,pendingRequest:E,pendingRequestRef:_0,followupQueueItems:V.followupQueueItems,activeModel:V.activeModel,activeThinkingLevel:V.activeThinkingLevel,supportsThinking:V.supportsThinking,activeModelUsage:V.activeModelUsage,contextUsage:V.contextUsage,isAgentRunningRef:u,wasAgentActiveRef:V.wasAgentActiveRef,draftBufferRef:c,thoughtBufferRef:r,lastAgentEventRef:P,lastSilenceNoticeRef:f,lastAgentResponseRef:V.lastAgentResponseRef,currentTurnIdRef:X0,thoughtExpandedRef:Q0,draftExpandedRef:F0,agentStatusRef:V.agentStatusRef,silentRecoveryRef:V.silentRecoveryRef,setIsAgentTurnActive:V.setIsAgentTurnActive,setAgentStatus:H,setAgentDraft:k,setAgentPlan:L,setAgentThought:I,setPendingRequest:M,setCurrentTurnId:T,setFollowupQueueItems:V.setFollowupQueueItems,setActiveModel:V.setActiveModel,setActiveThinkingLevel:V.setActiveThinkingLevel,setSupportsThinking:V.setSupportsThinking,setActiveModelUsage:V.setActiveModelUsage,setContextUsage:V.setContextUsage,lastNotifiedIdRef:V.lastNotifiedIdRef,agentsRef:V.agentsRef,notify:V.notify,shouldNotifyLocallyForChat:V.shouldNotifyLocallyForChat},recovery:{isAgentRunningRef:u,lastSilenceNoticeRef:f,lastAgentEventRef:P,currentTurnIdRef:X0,thoughtExpandedRef:Q0,draftExpandedRef:F0,draftBufferRef:c,thoughtBufferRef:r,pendingRequestRef:_0,lastAgentResponseRef:V.lastAgentResponseRef,agentStatusRef:V.agentStatusRef,stalledPostIdRef:H0,scrollToBottomRef:$0.scrollToBottomRef,setCurrentTurnId:T,setAgentDraft:k,setAgentPlan:L,setAgentThought:I,setPendingRequest:M,setAgentStatus:H,setPosts:$0.setPosts,dedupePosts:L5},viewState:{viewStateRef:V.viewStateRef,currentHashtag:V.currentHashtag,searchQuery:V.searchQuery,searchOpen:V.searchOpen},removeFileRefRef:h.removeFileRefRef}),L0=mq({appShellRef:V.appShellRef,sidebarWidthRef:V.sidebarWidthRef,editorWidthRef:V.editorWidthRef,dockHeightRef:V.dockHeightRef}),{chatRefreshLifecycle:a,timelineViewActions:G0,isComposeBoxAgentActive:O0,followupActions:P0,sidepanelActions:p0,branchPaneActions:g0}=yU({routeState:{currentChatJid:j,currentRootChatJid:V.currentRootChatJid,chatOnlyMode:Z,navigate:$,branchLoaderMode:Q,branchLoaderSourceChatJid:K,isWebAppMode:V.isWebAppMode},searchState:{currentHashtag:V.currentHashtag,setCurrentHashtag:V.setCurrentHashtag,searchQuery:V.searchQuery,setSearchQuery:V.setSearchQuery,searchOpen:V.searchOpen,setSearchOpen:V.setSearchOpen,searchScope:V.searchScope,setSearchScope:V.setSearchScope},shellState:{activeChatAgents:V.activeChatAgents,currentChatBranches:V.currentChatBranches,currentBranchRecord:V.currentBranchRecord,contextUsage:V.contextUsage,activeModel:V.activeModel,activeThinkingLevel:V.activeThinkingLevel,supportsThinking:V.supportsThinking,activeModelUsage:V.activeModelUsage,connectionStatus:V.connectionStatus,notificationsEnabled:V.notificationsEnabled,notificationPermission:V.notificationPermission,workspaceOpen:V.workspaceOpen,setWorkspaceOpen:V.setWorkspaceOpen,userProfile:V.userProfile,agents:V.agents,removingPostIds:V.removingPostIds,btwSession:V.btwSession},timeline:$0,interaction:K0,paneRuntime:h.paneRuntime,refs:{activeChatJidRef:V.activeChatJidRef,queueRefreshGenRef:V.queueRefreshGenRef,dismissedQueueRowIdsRef:V.dismissedQueueRowIdsRef,wasAgentActiveRef:V.wasAgentActiveRef,viewStateRef:V.viewStateRef,agentStatusRef:V.agentStatusRef,pendingRequestRef:_0,thoughtBufferRef:r,draftBufferRef:c,previewResyncPendingRef:e,previewResyncGenerationRef:m,isAgentRunningRef:u,currentTurnIdRef:X0,silentRecoveryRef:V.silentRecoveryRef,lastAgentEventRef:P,lastSilenceNoticeRef:f,staleUiVersionRef:V.staleUiVersionRef,staleUiReloadScheduledRef:V.staleUiReloadScheduledRef,hasConnectedOnceRef:V.hasConnectedOnceRef,sidebarWidthRef:V.sidebarWidthRef,appShellRef:V.appShellRef,agentsRef:V.agentsRef,paneStateOwnerChatJidRef:V.paneStateOwnerChatJidRef,chatPaneStateByChatRef:V.chatPaneStateByChatRef,dismissedLiveWidgetKeysRef:V.dismissedLiveWidgetKeysRef,draftThrottleRef:V.draftThrottleRef,thoughtThrottleRef:V.thoughtThrottleRef,followupQueueItemsRef:V.followupQueueItemsRef,lastAgentResponseRef:V.lastAgentResponseRef,thoughtExpandedRef:Q0,draftExpandedRef:F0,steerQueuedTurnIdRef:j0,btwAbortRef:V.btwAbortRef,renameBranchInFlightRef:V.renameBranchInFlightRef,renameBranchLockUntilRef:V.renameBranchLockUntilRef,editorWidthRef:V.editorWidthRef,dockHeightRef:V.dockHeightRef},setters:{setFollowupQueueItems:V.setFollowupQueueItems,setContextUsage:V.setContextUsage,setExtensionStatusPanels:V.setExtensionStatusPanels,setPendingExtensionPanelActions:V.setPendingExtensionPanelActions,setExtensionWorkingState:V.setExtensionWorkingState,setAgentStatus:H,setAgentDraft:k,setAgentPlan:L,setAgentThought:I,setPendingRequest:M,setConnectionStatus:V.setConnectionStatus,setStateAccessFailed:V.setStateAccessFailed,setAgents:V.setAgents,setUserProfile:V.setUserProfile,setActiveChatAgents:V.setActiveChatAgents,setCurrentChatBranches:V.setCurrentChatBranches,setActiveModel:V.setActiveModel,setActiveThinkingLevel:V.setActiveThinkingLevel,setSupportsThinking:V.setSupportsThinking,setActiveModelUsage:V.setActiveModelUsage,setAgentModelsPayload:V.setAgentModelsPayload,setHasLoadedAgentModels:V.setHasLoadedAgentModels,setHasMore:$0.setHasMore,setFloatingWidget:V.setFloatingWidget,setSteerQueuedTurnId:A,setRemovingPostIds:V.setRemovingPostIds,setBtwSession:V.setBtwSession,setWorkspaceOpen:V.setWorkspaceOpen,setRenameBranchNameDraft:V.setRenameBranchNameDraft,setIsRenameBranchFormOpen:V.setIsRenameBranchFormOpen,setIsRenamingBranch:V.setIsRenamingBranch},services:{searchPosts:tw,deletePost:ew,getAgentQueueState:FI,getAgentContext:jI,getAutoresearchStatus:ZI,getAgentStatus:$I,getAgents:_I,getAgentModels:qI,getActiveChatAgents:QI,getChatBranches:VI,getTimeline:OI,stopAutoresearch:XI,dismissAutoresearch:GI,streamSidePrompt:zI,sendAgentMessage:LI,renameChatBranch:KI,pruneChatBranch:YI,purgeChatBranch:NI,restoreChatBranch:BI,forkChatBranch:JI,createRootChatSession:EI,steerAgentQueueItem:UI,removeAgentQueueItem:DI,getAgentThought:aU,setAgentThoughtVisibility:tU,silenceRefreshMs:lq,silenceWarningMs:cq,silenceFinalizeMs:hq,isCompactionStatus:E$,currentAppAssetVersion:aw,tabStoreHasUnsaved:()=>j1.hasUnsaved(),agentStatus:W,isAgentTurnActive:V.isAgentTurnActive,openEditor:h.editorState.openEditor,activateTab:h.editorState.handleTabActivate,tabStripActiveId:h.editorState.tabStripActiveId,terminalTabPath:V5,resolveTab:(f0)=>j1.get(f0),closeTab:h.editorState.handleTabClose,editorOpen:h.editorState.editorOpen},helpers:{getFormLock:$N,readStoredNumber:J4}});b(()=>{return kU({timelineRef:V.timelineRef,activeChatAgents:V.activeChatAgents,currentChatJid:j,onSwitch:(f0)=>g0.handleBranchPickerChange(f0),isIOSDevice:E6,isLikelySafari:_3})},[V.timelineRef,V.activeChatAgents,j,g0.handleBranchPickerChange]);let X1=q0(()=>sU({panePopoutMode:X,modelsLoaded:V.hasLoadedAgentModels,modelPayload:V.agentModelsPayload,providerMissingDismissed:Y}),[X,V.hasLoadedAgentModels,V.agentModelsPayload,Y]),l0=R(()=>{NV()},[]),a0=R(()=>{N(!0),K1(ZZ,"true")},[]);return b(()=>{if(!X||typeof document>"u")return;document.title=QN(q,h.paneRuntime.activePaneTab,G)},[h.paneRuntime.activePaneTab,q,X,G]),b(()=>{if(typeof window>"u")return;let f0=(i0)=>{iU(i0,{currentChatJid:j,openEditor:h.editorState.openEditor,popOutPane:g0.handlePopOutPane,showIntentToast:K0.composeReferenceActions.showIntentToast})};return window.addEventListener("piclaw-extension-ui:request",f0),()=>{window.removeEventListener("piclaw-extension-ui:request",f0)}},[g0.handlePopOutPane,j,K0.composeReferenceActions.showIntentToast,h.editorState.openEditor]),aY(HN({routeState:{branchLoaderMode:Q,panePopoutMode:X,currentChatJid:j,chatOnlyMode:Z,panePopoutPath:G},paneRuntime:h.paneRuntime,splitters:L0,orchestration:{branchPaneActions:g0,timelineViewActions:G0,sidepanelActions:p0,followupActions:P0,chatRefreshLifecycle:a,isComposeBoxAgentActive:O0},interaction:K0,timeline:$0,surface:{...V,oobePanelState:X1,composePrefillRequest:F,requestComposePrefill:D,handleOobeSetupProvider:l0,handleOobeShowModelPicker:l0,handleOobeOpenWorkspace:l0,handleDismissProviderMissingOobe:a0},editorState:h.editorState,agentState:{agentStatus:W,agentDraft:z,agentPlan:J,agentThought:x,pendingRequest:E,currentTurnId:O,steerQueuedTurnId:y,setPendingRequest:M,pendingRequestRef:_0,isCompactionStatus:E$},helpers:{formatBranchPickerLabel:N8,isIOSDevice:E6,terminalTabPath:V5}}))}function MI(){let{locationParams:_,navigate:$}=FV();return U`<${AI} locationParams=${_} navigate=${$} />`}var X3=document.getElementById("app");if(typeof window<"u")window.__PICLAW_APP_BOOTED__=!1;if(X3){if(U$(null,X3),X3.replaceChildren(),U$(U`<${MI} />`,X3),typeof window<"u")window.__PICLAW_APP_BOOTED__=!0}

//# debugId=61CB5B408B9BC75664756E2164756E21
//# sourceMappingURL=app.bundle.js.map
