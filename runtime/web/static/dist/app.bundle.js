var WF=Object.defineProperty;var OF=(_)=>_;function zF(_,$){this[_]=OF.bind(null,$)}var j1=(_,$)=>{for(var j in $)WF(_,j,{get:$[j],enumerable:!0,configurable:!0,set:zF.bind($,j)})};var J_=(_,$)=>()=>(_&&($=_(_=0)),$);var OG={};j1(OG,{useState:()=>f,useRef:()=>g,useReducer:()=>HG,useMemo:()=>Y0,useLayoutEffect:()=>j2,useImperativeHandle:()=>IF,useErrorBoundary:()=>PF,useEffect:()=>u,useDebugValue:()=>fF,useContext:()=>CF,useCallback:()=>R,render:()=>Q$,html:()=>F,h:()=>N3,createContext:()=>xF,Component:()=>r2});function K$(_,$){for(var j in $)_[j]=$[j];return _}function Q3(_){_&&_.parentNode&&_.parentNode.removeChild(_)}function N3(_,$,j){var G,Z,X,Y={};for(X in $)X=="key"?G=$[X]:X=="ref"?Z=$[X]:Y[X]=$[X];if(arguments.length>2&&(Y.children=arguments.length>3?e5.call(arguments,2):j),typeof _=="function"&&_.defaultProps!=null)for(X in _.defaultProps)Y[X]===void 0&&(Y[X]=_.defaultProps[X]);return i5(_,Y,G,Z,null)}function i5(_,$,j,G,Z){var X={type:_,props:$,key:j,ref:G,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:Z==null?++XG:Z,__i:-1,__u:0};return Z==null&&x_.vnode!=null&&x_.vnode(X),X}function $6(_){return _.children}function r2(_,$){this.props=_,this.context=$}function e4(_,$){if($==null)return _.__?e4(_.__,_.__i+1):null;for(var j;$<_.__k.length;$++)if((j=_.__k[$])!=null&&j.__e!=null)return j.__e;return typeof _.type=="function"?e4(_):null}function kF(_){if(_.__P&&_.__d){var $=_.__v,j=$.__e,G=[],Z=[],X=K$({},$);X.__v=$.__v+1,x_.vnode&&x_.vnode(X),B3(_.__P,X,$,_.__n,_.__P.namespaceURI,32&$.__u?[j]:null,G,j==null?e4($):j,!!(32&$.__u),Z),X.__v=$.__v,X.__.__k[X.__i]=X,BG(G,X,Z),$.__e=$.__=null,X.__e!=j&&KG(X)}}function KG(_){if((_=_.__)!=null&&_.__c!=null)return _.__e=_.__c.base=null,_.__k.some(function($){if($!=null&&$.__e!=null)return _.__e=_.__c.base=$.__e}),KG(_)}function L3(_){(!_.__d&&(_.__d=!0)&&b$.push(_)&&!t5.__r++||dj!=x_.debounceRendering)&&((dj=x_.debounceRendering)||YG)(t5)}function t5(){try{for(var _,$=1;b$.length;)b$.length>$&&b$.sort(LG),_=b$.shift(),$=b$.length,kF(_)}finally{b$.length=t5.__r=0}}function QG(_,$,j,G,Z,X,Y,L,V,q,Q){var K,B,N,U,D,H,E,k=G&&G.__k||a5,z=$.length;for(V=yF(j,$,k,V,z),K=0;K<z;K++)(N=j.__k[K])!=null&&(B=N.__i!=-1&&k[N.__i]||s5,N.__i=K,H=B3(_,N,B,Z,X,Y,L,V,q,Q),U=N.__e,N.ref&&B.ref!=N.ref&&(B.ref&&F3(B.ref,null,N),Q.push(N.ref,N.__c||U,N)),D==null&&U!=null&&(D=U),(E=!!(4&N.__u))||B.__k===N.__k?(V=NG(N,V,_,E),E&&B.__e&&(B.__e=null)):typeof N.type=="function"&&H!==void 0?V=H:U&&(V=U.nextSibling),N.__u&=-7);return j.__e=D,V}function yF(_,$,j,G,Z){var X,Y,L,V,q,Q=j.length,K=Q,B=0;for(_.__k=Array(Z),X=0;X<Z;X++)(Y=$[X])!=null&&typeof Y!="boolean"&&typeof Y!="function"?(typeof Y=="string"||typeof Y=="number"||typeof Y=="bigint"||Y.constructor==String?Y=_.__k[X]=i5(null,Y,null,null,null):_6(Y)?Y=_.__k[X]=i5($6,{children:Y},null,null,null):Y.constructor===void 0&&Y.__b>0?Y=_.__k[X]=i5(Y.type,Y.props,Y.key,Y.ref?Y.ref:null,Y.__v):_.__k[X]=Y,V=X+B,Y.__=_,Y.__b=_.__b+1,L=null,(q=Y.__i=MF(Y,j,V,K))!=-1&&(K--,(L=j[q])&&(L.__u|=2)),L==null||L.__v==null?(q==-1&&(Z>Q?B--:Z<Q&&B++),typeof Y.type!="function"&&(Y.__u|=4)):q!=V&&(q==V-1?B--:q==V+1?B++:(q>V?B--:B++,Y.__u|=4))):_.__k[X]=null;if(K)for(X=0;X<Q;X++)(L=j[X])!=null&&(2&L.__u)==0&&(L.__e==G&&(G=e4(L)),UG(L,L));return G}function NG(_,$,j,G){var Z,X;if(typeof _.type=="function"){for(Z=_.__k,X=0;Z&&X<Z.length;X++)Z[X]&&(Z[X].__=_,$=NG(Z[X],$,j,G));return $}_.__e!=$&&(G&&($&&_.type&&!$.parentNode&&($=e4(_)),j.insertBefore(_.__e,$||null)),$=_.__e);do $=$&&$.nextSibling;while($!=null&&$.nodeType==8);return $}function MF(_,$,j,G){var Z,X,Y,L=_.key,V=_.type,q=$[j],Q=q!=null&&(2&q.__u)==0;if(q===null&&L==null||Q&&L==q.key&&V==q.type)return j;if(G>(Q?1:0)){for(Z=j-1,X=j+1;Z>=0||X<$.length;)if((q=$[Y=Z>=0?Z--:X++])!=null&&(2&q.__u)==0&&L==q.key&&V==q.type)return Y}return-1}function ij(_,$,j){$[0]=="-"?_.setProperty($,j==null?"":j):_[$]=j==null?"":typeof j!="number"||AF.test($)?j:j+"px"}function p5(_,$,j,G,Z){var X,Y;_:if($=="style")if(typeof j=="string")_.style.cssText=j;else{if(typeof G=="string"&&(_.style.cssText=G=""),G)for($ in G)j&&$ in j||ij(_.style,$,"");if(j)for($ in j)G&&j[$]==G[$]||ij(_.style,$,j[$])}else if($[0]=="o"&&$[1]=="n")X=$!=($=$.replace(qG,"$1")),Y=$.toLowerCase(),$=Y in _||$=="onFocusOut"||$=="onFocusIn"?Y.slice(2):$.slice(2),_.l||(_.l={}),_.l[$+X]=j,j?G?j[n2]=G[n2]:(j[n2]=K3,_.addEventListener($,X?Y3:X3,X)):_.removeEventListener($,X?Y3:X3,X);else{if(Z=="http://www.w3.org/2000/svg")$=$.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if($!="width"&&$!="height"&&$!="href"&&$!="list"&&$!="form"&&$!="tabIndex"&&$!="download"&&$!="rowSpan"&&$!="colSpan"&&$!="role"&&$!="popover"&&$ in _)try{_[$]=j==null?"":j;break _}catch(L){}typeof j=="function"||(j==null||j===!1&&$[4]!="-"?_.removeAttribute($):_.setAttribute($,$=="popover"&&j==1?"":j))}}function oj(_){return function($){if(this.l){var j=this.l[$.type+_];if($[d5]==null)$[d5]=K3++;else if($[d5]<j[n2])return;return j(x_.event?x_.event($):$)}}}function B3(_,$,j,G,Z,X,Y,L,V,q){var Q,K,B,N,U,D,H,E,k,z,O,I,x,A,y,W=$.type;if($.constructor!==void 0)return null;128&j.__u&&(V=!!(32&j.__u),X=[L=$.__e=j.__e]),(Q=x_.__b)&&Q($);_:if(typeof W=="function")try{if(E=$.props,k=W.prototype&&W.prototype.render,z=(Q=W.contextType)&&G[Q.__c],O=Q?z?z.props.value:Q.__:G,j.__c?H=(K=$.__c=j.__c).__=K.__E:(k?$.__c=K=new W(E,O):($.__c=K=new r2(E,O),K.constructor=W,K.render=TF),z&&z.sub(K),K.state||(K.state={}),K.__n=G,B=K.__d=!0,K.__h=[],K._sb=[]),k&&K.__s==null&&(K.__s=K.state),k&&W.getDerivedStateFromProps!=null&&(K.__s==K.state&&(K.__s=K$({},K.__s)),K$(K.__s,W.getDerivedStateFromProps(E,K.__s))),N=K.props,U=K.state,K.__v=$,B)k&&W.getDerivedStateFromProps==null&&K.componentWillMount!=null&&K.componentWillMount(),k&&K.componentDidMount!=null&&K.__h.push(K.componentDidMount);else{if(k&&W.getDerivedStateFromProps==null&&E!==N&&K.componentWillReceiveProps!=null&&K.componentWillReceiveProps(E,O),$.__v==j.__v||!K.__e&&K.shouldComponentUpdate!=null&&K.shouldComponentUpdate(E,K.__s,O)===!1){$.__v!=j.__v&&(K.props=E,K.state=K.__s,K.__d=!1),$.__e=j.__e,$.__k=j.__k,$.__k.some(function(M){M&&(M.__=$)}),a5.push.apply(K.__h,K._sb),K._sb=[],K.__h.length&&Y.push(K);break _}K.componentWillUpdate!=null&&K.componentWillUpdate(E,K.__s,O),k&&K.componentDidUpdate!=null&&K.__h.push(function(){K.componentDidUpdate(N,U,D)})}if(K.context=O,K.props=E,K.__P=_,K.__e=!1,I=x_.__r,x=0,k)K.state=K.__s,K.__d=!1,I&&I($),Q=K.render(K.props,K.state,K.context),a5.push.apply(K.__h,K._sb),K._sb=[];else do K.__d=!1,I&&I($),Q=K.render(K.props,K.state,K.context),K.state=K.__s;while(K.__d&&++x<25);K.state=K.__s,K.getChildContext!=null&&(G=K$(K$({},G),K.getChildContext())),k&&!B&&K.getSnapshotBeforeUpdate!=null&&(D=K.getSnapshotBeforeUpdate(N,U)),A=Q!=null&&Q.type===$6&&Q.key==null?FG(Q.props.children):Q,L=QG(_,_6(A)?A:[A],$,j,G,Z,X,Y,L,V,q),K.base=$.__e,$.__u&=-161,K.__h.length&&Y.push(K),H&&(K.__E=K.__=null)}catch(M){if($.__v=null,V||X!=null)if(M.then){for($.__u|=V?160:128;L&&L.nodeType==8&&L.nextSibling;)L=L.nextSibling;X[X.indexOf(L)]=null,$.__e=L}else{for(y=X.length;y--;)Q3(X[y]);q3($)}else $.__e=j.__e,$.__k=j.__k,M.then||q3($);x_.__e(M,$,j)}else X==null&&$.__v==j.__v?($.__k=j.__k,$.__e=j.__e):L=$.__e=wF(j.__e,$,j,G,Z,X,Y,V,q);return(Q=x_.diffed)&&Q($),128&$.__u?void 0:L}function q3(_){_&&(_.__c&&(_.__c.__e=!0),_.__k&&_.__k.some(q3))}function BG(_,$,j){for(var G=0;G<j.length;G++)F3(j[G],j[++G],j[++G]);x_.__c&&x_.__c($,_),_.some(function(Z){try{_=Z.__h,Z.__h=[],_.some(function(X){X.call(Z)})}catch(X){x_.__e(X,Z.__v)}})}function FG(_){return typeof _!="object"||_==null||_.__b>0?_:_6(_)?_.map(FG):K$({},_)}function wF(_,$,j,G,Z,X,Y,L,V){var q,Q,K,B,N,U,D,H=j.props||s5,E=$.props,k=$.type;if(k=="svg"?Z="http://www.w3.org/2000/svg":k=="math"?Z="http://www.w3.org/1998/Math/MathML":Z||(Z="http://www.w3.org/1999/xhtml"),X!=null){for(q=0;q<X.length;q++)if((N=X[q])&&"setAttribute"in N==!!k&&(k?N.localName==k:N.nodeType==3)){_=N,X[q]=null;break}}if(_==null){if(k==null)return document.createTextNode(E);_=document.createElementNS(Z,k,E.is&&E),L&&(x_.__m&&x_.__m($,X),L=!1),X=null}if(k==null)H===E||L&&_.data==E||(_.data=E);else{if(X=X&&e5.call(_.childNodes),!L&&X!=null)for(H={},q=0;q<_.attributes.length;q++)H[(N=_.attributes[q]).name]=N.value;for(q in H)N=H[q],q=="dangerouslySetInnerHTML"?K=N:q=="children"||(q in E)||q=="value"&&("defaultValue"in E)||q=="checked"&&("defaultChecked"in E)||p5(_,q,null,N,Z);for(q in E)N=E[q],q=="children"?B=N:q=="dangerouslySetInnerHTML"?Q=N:q=="value"?U=N:q=="checked"?D=N:L&&typeof N!="function"||H[q]===N||p5(_,q,N,H[q],Z);if(Q)L||K&&(Q.__html==K.__html||Q.__html==_.innerHTML)||(_.innerHTML=Q.__html),$.__k=[];else if(K&&(_.innerHTML=""),QG($.type=="template"?_.content:_,_6(B)?B:[B],$,j,G,k=="foreignObject"?"http://www.w3.org/1999/xhtml":Z,X,Y,X?X[0]:j.__k&&e4(j,0),L,V),X!=null)for(q=X.length;q--;)Q3(X[q]);L||(q="value",k=="progress"&&U==null?_.removeAttribute("value"):U!=null&&(U!==_[q]||k=="progress"&&!U||k=="option"&&U!=H[q])&&p5(_,q,U,H[q],Z),q="checked",D!=null&&D!=_[q]&&p5(_,q,D,H[q],Z))}return _}function F3(_,$,j){try{if(typeof _=="function"){var G=typeof _.__u=="function";G&&_.__u(),G&&$==null||(_.__u=_($))}else _.current=$}catch(Z){x_.__e(Z,j)}}function UG(_,$,j){var G,Z;if(x_.unmount&&x_.unmount(_),(G=_.ref)&&(G.current&&G.current!=_.__e||F3(G,null,$)),(G=_.__c)!=null){if(G.componentWillUnmount)try{G.componentWillUnmount()}catch(X){x_.__e(X,$)}G.base=G.__P=null}if(G=_.__k)for(Z=0;Z<G.length;Z++)G[Z]&&UG(G[Z],$,j||typeof _.type!="function");j||Q3(_.__e),_.__c=_.__=_.__e=void 0}function TF(_,$,j){return this.constructor(_,j)}function Q$(_,$,j){var G,Z,X,Y;$==document&&($=document.documentElement),x_.__&&x_.__(_,$),Z=(G=typeof j=="function")?null:j&&j.__k||$.__k,X=[],Y=[],B3($,_=(!G&&j||$).__k=N3($6,null,[_]),Z||s5,s5,$.namespaceURI,!G&&j?[j]:Z?null:$.firstChild?e5.call($.childNodes):null,X,!G&&j?j:Z?Z.__e:$.firstChild,G,Y),BG(X,_,Y)}function xF(_){function $(j){var G,Z;return this.getChildContext||(G=new Set,(Z={})[$.__c]=this,this.getChildContext=function(){return Z},this.componentWillUnmount=function(){G=null},this.shouldComponentUpdate=function(X){this.props.value!=X.value&&G.forEach(function(Y){Y.__e=!0,L3(Y)})},this.sub=function(X){G.add(X);var Y=X.componentWillUnmount;X.componentWillUnmount=function(){G&&G.delete(X),Y&&Y.call(X)}}),j.children}return $.__c="__cC"+VG++,$.__=_,$.Provider=$.__l=($.Consumer=function(j,G){return j.children(G)}).contextType=$,$}function $2(_,$){S_.__h&&S_.__h(T_,_,_2||$),_2=0;var j=T_.__H||(T_.__H={__:[],__h:[]});return _>=j.__.length&&j.__.push({}),j.__[_]}function f(_){return _2=1,HG(DG,_)}function HG(_,$,j){var G=$2(v$++,2);if(G.t=_,!G.__c&&(G.__=[j?j($):DG(void 0,$),function(L){var V=G.__N?G.__N[0]:G.__[0],q=G.t(V,L);V!==q&&(G.__N=[q,G.__[1]],G.__c.setState({}))}],G.__c=T_,!T_.__f)){var Z=function(L,V,q){if(!G.__c.__H)return!0;var Q=G.__c.__H.__.filter(function(B){return B.__c});if(Q.every(function(B){return!B.__N}))return!X||X.call(this,L,V,q);var K=G.__c.props!==L;return Q.some(function(B){if(B.__N){var N=B.__[0];B.__=B.__N,B.__N=void 0,N!==B.__[0]&&(K=!0)}}),X&&X.call(this,L,V,q)||K};T_.__f=!0;var{shouldComponentUpdate:X,componentWillUpdate:Y}=T_;T_.componentWillUpdate=function(L,V,q){if(this.__e){var Q=X;X=void 0,Z(L,V,q),X=Q}Y&&Y.call(this,L,V,q)},T_.shouldComponentUpdate=Z}return G.__N||G.__}function u(_,$){var j=$2(v$++,3);!S_.__s&&U3(j.__H,$)&&(j.__=_,j.u=$,T_.__H.__h.push(j))}function j2(_,$){var j=$2(v$++,4);!S_.__s&&U3(j.__H,$)&&(j.__=_,j.u=$,T_.__h.push(j))}function g(_){return _2=5,Y0(function(){return{current:_}},[])}function IF(_,$,j){_2=6,j2(function(){if(typeof _=="function"){var G=_($());return function(){_(null),G&&typeof G=="function"&&G()}}if(_)return _.current=$(),function(){return _.current=null}},j==null?j:j.concat(_))}function Y0(_,$){var j=$2(v$++,7);return U3(j.__H,$)&&(j.__=_(),j.__H=$,j.__h=_),j.__}function R(_,$){return _2=8,Y0(function(){return _},$)}function CF(_){var $=T_.context[_.__c],j=$2(v$++,9);return j.c=_,$?(j.__==null&&(j.__=!0,$.sub(T_)),$.props.value):_.__}function fF(_,$){S_.useDebugValue&&S_.useDebugValue($?$(_):_)}function PF(_){var $=$2(v$++,10),j=f();return $.__=_,T_.componentDidCatch||(T_.componentDidCatch=function(G,Z){$.__&&$.__(G,Z),j[1](G)}),[j[0],function(){j[1](void 0)}]}function RF(){for(var _;_=EG.shift();){var $=_.__H;if(_.__P&&$)try{$.__h.some(o5),$.__h.some(V3),$.__h=[]}catch(j){$.__h=[],S_.__e(j,_.__v)}}}function SF(_){var $,j=function(){clearTimeout(G),GG&&cancelAnimationFrame($),setTimeout(_)},G=setTimeout(j,35);GG&&($=requestAnimationFrame(j))}function o5(_){var $=T_,j=_.__c;typeof j=="function"&&(_.__c=void 0,j()),T_=$}function V3(_){var $=T_;_.__c=_.__(),T_=$}function U3(_,$){return!_||_.length!==$.length||$.some(function(j,G){return j!==_[G]})}function DG(_,$){return typeof $=="function"?$(_):$}function uF(_){var $=ZG.get(this);return $||($=new Map,ZG.set(this,$)),($=WG(this,$.get(_)||($.set(_,$=function(j){for(var G,Z,X=1,Y="",L="",V=[0],q=function(B){X===1&&(B||(Y=Y.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?V.push(0,B,Y):X===3&&(B||Y)?(V.push(3,B,Y),X=2):X===2&&Y==="..."&&B?V.push(4,B,0):X===2&&Y&&!B?V.push(5,0,!0,Y):X>=5&&((Y||!B&&X===5)&&(V.push(X,0,Y,Z),X=6),B&&(V.push(X,B,0,Z),X=6)),Y=""},Q=0;Q<j.length;Q++){Q&&(X===1&&q(),q(Q));for(var K=0;K<j[Q].length;K++)G=j[Q][K],X===1?G==="<"?(q(),V=[V],X=3):Y+=G:X===4?Y==="--"&&G===">"?(X=1,Y=""):Y=G+Y[0]:L?G===L?L="":Y+=G:G==='"'||G==="'"?L=G:G===">"?(q(),X=1):X&&(G==="="?(X=5,Z=Y,Y=""):G==="/"&&(X<5||j[Q][K+1]===">")?(q(),X===3&&(V=V[0]),X=V,(V=V[0]).push(2,0,X),X=0):G===" "||G==="\t"||G===`
`||G==="\r"?(q(),X=2):Y+=G),X===3&&Y==="!--"&&(X=4,V=V[0])}return q(),V}(_)),$),arguments,[])).length>1?$:$[0]}var e5,x_,XG,JF,b$,dj,YG,LG,G3,d5,n2,qG,K3,X3,Y3,VG,s5,a5,AF,_6,v$,T_,Z3,sj,_2=0,EG,S_,aj,tj,ej,_G,$G,jG,GG,WG=function(_,$,j,G){var Z;$[0]=0;for(var X=1;X<$.length;X++){var Y=$[X++],L=$[X]?($[0]|=Y?1:2,j[$[X++]]):$[++X];Y===3?G[0]=L:Y===4?G[1]=Object.assign(G[1]||{},L):Y===5?(G[1]=G[1]||{})[$[++X]]=L:Y===6?G[1][$[++X]]+=L+"":Y?(Z=_.apply(L,WG(_,L,j,["",null])),G.push(Z),L[0]?$[0]|=2:($[X-2]=0,$[X]=Z)):G.push(L)}return G},ZG,F;var M0=J_(()=>{s5={},a5=[],AF=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,_6=Array.isArray;e5=a5.slice,x_={__e:function(_,$,j,G){for(var Z,X,Y;$=$.__;)if((Z=$.__c)&&!Z.__)try{if((X=Z.constructor)&&X.getDerivedStateFromError!=null&&(Z.setState(X.getDerivedStateFromError(_)),Y=Z.__d),Z.componentDidCatch!=null&&(Z.componentDidCatch(_,G||{}),Y=Z.__d),Y)return Z.__E=Z}catch(L){_=L}throw _}},XG=0,JF=function(_){return _!=null&&_.constructor===void 0},r2.prototype.setState=function(_,$){var j;j=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=K$({},this.state),typeof _=="function"&&(_=_(K$({},j),this.props)),_&&K$(j,_),_!=null&&this.__v&&($&&this._sb.push($),L3(this))},r2.prototype.forceUpdate=function(_){this.__v&&(this.__e=!0,_&&this.__h.push(_),L3(this))},r2.prototype.render=$6,b$=[],YG=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,LG=function(_,$){return _.__v.__b-$.__v.__b},t5.__r=0,G3=Math.random().toString(8),d5="__d"+G3,n2="__a"+G3,qG=/(PointerCapture)$|Capture$/i,K3=0,X3=oj(!1),Y3=oj(!0),VG=0;EG=[],S_=x_,aj=S_.__b,tj=S_.__r,ej=S_.diffed,_G=S_.__c,$G=S_.unmount,jG=S_.__;S_.__b=function(_){T_=null,aj&&aj(_)},S_.__=function(_,$){_&&$.__k&&$.__k.__m&&(_.__m=$.__k.__m),jG&&jG(_,$)},S_.__r=function(_){tj&&tj(_),v$=0;var $=(T_=_.__c).__H;$&&(Z3===T_?($.__h=[],T_.__h=[],$.__.some(function(j){j.__N&&(j.__=j.__N),j.u=j.__N=void 0})):($.__h.some(o5),$.__h.some(V3),$.__h=[],v$=0)),Z3=T_},S_.diffed=function(_){ej&&ej(_);var $=_.__c;$&&$.__H&&($.__H.__h.length&&(EG.push($)!==1&&sj===S_.requestAnimationFrame||((sj=S_.requestAnimationFrame)||SF)(RF)),$.__H.__.some(function(j){j.u&&(j.__H=j.u),j.u=void 0})),Z3=T_=null},S_.__c=function(_,$){$.some(function(j){try{j.__h.some(o5),j.__h=j.__h.filter(function(G){return!G.__||V3(G)})}catch(G){$.some(function(Z){Z.__h&&(Z.__h=[])}),$=[],S_.__e(G,j.__v)}}),_G&&_G(_,$)},S_.unmount=function(_){$G&&$G(_);var $,j=_.__c;j&&j.__H&&(j.__H.__.some(function(G){try{o5(G)}catch(Z){$=Z}}),j.__H=void 0,$&&S_.__e($,j.__v))};GG=typeof requestAnimationFrame=="function";ZG=new Map;F=uF.bind(N3)});function O1(_){if(typeof window>"u"||!window.localStorage)return null;try{return window.localStorage.getItem(_)}catch{return null}}function V_(_,$){if(typeof window>"u"||!window.localStorage)return;try{window.localStorage.setItem(_,$)}catch{return}}function F$(_,$=!1){let j=O1(_);if(j===null)return $;return j==="true"}function W4(_,$=null){let j=O1(_);if(j===null)return $;let G=parseInt(j,10);return Number.isFinite(G)?G:$}function U6(_){let $=O1(_);if(!$)return null;try{return JSON.parse($)}catch{return null}}function e3(_){let $=String(_||"").trim().toLowerCase();if(!$)return"default";if($==="solarized-dark"||$==="solarized-light")return"solarized";if($==="github-dark"||$==="github-light")return"github";if($==="tokyo-night")return"tokyo";return $}function cZ(_){if(!_)return null;let $=String(_).trim();if(!$)return null;let j=$.startsWith("#")?$.slice(1):$;if(!/^[0-9a-fA-F]{3}$/.test(j)&&!/^[0-9a-fA-F]{6}$/.test(j))return null;let G=j.length===3?j.split("").map((X)=>X+X).join(""):j,Z=parseInt(G,16);return{r:Z>>16&255,g:Z>>8&255,b:Z&255,hex:`#${G.toLowerCase()}`}}function iE(_,$){try{if(document.body){_.style.display="none",document.body.appendChild(_);let j=getComputedStyle(_).color||_.style.color;return document.body.removeChild(_),j}}catch{return $}return $}function oE(_){if(!_||typeof document>"u")return null;let $=String(_).trim();if(!$)return null;let j=document.createElement("div");if(j.style.color="",j.style.color=$,!j.style.color)return null;let Z=iE(j,j.style.color).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!Z)return null;let X=parseInt(Z[1],10),Y=parseInt(Z[2],10),L=parseInt(Z[3],10);if(![X,Y,L].every((q)=>Number.isFinite(q)))return null;let V=`#${[X,Y,L].map((q)=>q.toString(16).padStart(2,"0")).join("")}`;return{r:X,g:Y,b:L,hex:V}}function O4(_){return cZ(_)||oE(_)}function _7(_,$,j){let G=Math.round(_.r+($.r-_.r)*j),Z=Math.round(_.g+($.g-_.g)*j),X=Math.round(_.b+($.b-_.b)*j);return`rgb(${G} ${Z} ${X})`}function E6(_,$){return`rgba(${_.r}, ${_.g}, ${_.b}, ${$})`}function sE(_){let $=_.r/255,j=_.g/255,G=_.b/255,Z=$<=0.03928?$/12.92:Math.pow(($+0.055)/1.055,2.4),X=j<=0.03928?j/12.92:Math.pow((j+0.055)/1.055,2.4),Y=G<=0.03928?G/12.92:Math.pow((G+0.055)/1.055,2.4);return 0.2126*Z+0.7152*X+0.0722*Y}function aE(_){return sE(_)>0.4?"#000000":"#ffffff"}function lZ(){if(typeof window>"u")return"light";try{return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch{return"light"}}function $7(_){return bZ[_]||bZ.default}function tE(_){return _.mode==="auto"?lZ():_.mode}function hZ(_,$){let j=$7(_);if($==="dark"&&j.dark)return j.dark;if($==="light"&&j.light)return j.light;return j.dark||j.light||E$}function U$(_,$,j){let G=O4(_);if(!G)return _;return _7(G,$,j)}function nZ(_,$,j){let G=O4($);if(!G)return _;let X=cZ(j==="dark"?"#ffffff":"#000000");return{..._,bgPrimary:U$(_.bgPrimary,G,0.08),bgSecondary:U$(_.bgSecondary,G,0.12),bgHover:U$(_.bgHover,G,0.16),textPrimary:U$(_.textPrimary,G,j==="dark"?0.08:0.06),textSecondary:U$(_.textSecondary,G,j==="dark"?0.12:0.1),borderColor:U$(_.borderColor,G,0.1),accent:G.hex,accentHover:X?_7(G,X,0.18):G.hex,warning:U$(_.warning||E$.warning,G,0.14),danger:U$(_.danger,G,0.16),success:U$(_.success,G,0.16)}}function eE(_,$){let j=O4(_?.warning);if(j)return j.hex;let G=O4($==="dark"?W6.warning:E$.warning)||O4(E$.warning),Z=O4(_?.accent);if(G&&Z)return _7(G,Z,$==="dark"?0.18:0.14);return $==="dark"?W6.warning:E$.warning}function _H(_,$){if(typeof document>"u")return;let j=document.documentElement,G=_.accent,Z=O4(G),X=Z?E6(Z,$==="dark"?0.35:0.2):_.searchHighlight||_.searchHighlightColor,Y=Z?E6(Z,$==="dark"?0.16:0.12):"rgba(29, 155, 240, 0.12)",L=Z?E6(Z,$==="dark"?0.28:0.2):"rgba(29, 155, 240, 0.2)",V=Z?aE(Z):$==="dark"?"#000000":"#ffffff",q=Z?E6(Z,$==="dark"?0.35:0.25):"rgba(29, 155, 240, 0.25)",Q=eE(_,$),K={"--bg-primary":_.bgPrimary,"--bg-secondary":_.bgSecondary,"--bg-hover":_.bgHover,"--text-primary":_.textPrimary,"--text-secondary":_.textSecondary,"--border-color":_.borderColor,"--accent-color":G,"--accent-hover":_.accentHover||G,"--accent-color-alpha":q,"--accent-soft":Y,"--accent-soft-strong":L,"--accent-contrast-text":V,"--warning-color":Q,"--danger-color":_.danger||E$.danger,"--success-color":_.success||E$.success,"--search-highlight-color":X||"rgba(29, 155, 240, 0.2)"};Object.entries(K).forEach(([B,N])=>{if(N)j.style.setProperty(B,N)})}function $H(){if(typeof document>"u")return;let _=document.documentElement;dE.forEach(($)=>_.style.removeProperty($))}function B2(_,$={}){if(typeof document>"u")return null;let j=typeof $.id==="string"&&$.id.trim()?$.id.trim():null,G=j?document.getElementById(j):document.querySelector(`meta[name="${_}"]`);if(!G)G=document.createElement("meta"),document.head.appendChild(G);if(G.setAttribute("name",_),j)G.setAttribute("id",j);return G}function vZ(_){let $=e3(z4?.theme||"default"),j=z4?.tint?String(z4.tint).trim():null,G=hZ($,_);if($==="default"&&j)G=nZ(G,j,_);if(G?.bgPrimary)return G.bgPrimary;return _==="dark"?W6.bgPrimary:E$.bgPrimary}function jH(_,$){if(typeof document>"u")return;let j=B2("theme-color",{id:"dynamic-theme-color"});if(j&&_)j.removeAttribute("media"),j.setAttribute("content",_);let G=B2("theme-color",{id:"theme-color-light"});if(G)G.setAttribute("media","(prefers-color-scheme: light)"),G.setAttribute("content",vZ("light"));let Z=B2("theme-color",{id:"theme-color-dark"});if(Z)Z.setAttribute("media","(prefers-color-scheme: dark)"),Z.setAttribute("content",vZ("dark"));let X=B2("msapplication-TileColor");if(X&&_)X.setAttribute("content",_);let Y=B2("msapplication-navbutton-color");if(Y&&_)Y.setAttribute("content",_);let L=B2("apple-mobile-web-app-status-bar-style");if(L)L.setAttribute("content",$==="dark"?"black-translucent":"default")}function GH(){if(typeof window>"u")return;let _={...z4,mode:mZ};window.dispatchEvent(new CustomEvent("piclaw-theme-change",{detail:_}))}function ZH(){if(typeof window>"u")return"web:default";try{let $=new URL(window.location.href).searchParams.get("chat_jid");return $&&$.trim()?$.trim():"web:default"}catch{return"web:default"}}function j7(_,$={}){if(typeof window>"u"||typeof document>"u")return;let j=e3(_?.theme||"default"),G=_?.tint?String(_.tint).trim():null,Z=$7(j),X=tE(Z),Y=hZ(j,X);z4={theme:j,tint:G},mZ=X;let L=document.documentElement;L.dataset.theme=X,L.dataset.colorTheme=j,L.dataset.tint=G?String(G):"",L.style.colorScheme=X;let V=Y;if(j==="default"&&G)V=nZ(Y,G,X);if(j==="default"&&!G)$H();else _H(V,X);if(jH(V.bgPrimary,X),GH(),$.persist!==!1)if(V_(t3,j),G)V_(D6,G);else V_(D6,"")}function H6(){if($7(z4.theme).mode!=="auto")return;j7(z4,{persist:!1})}function G7(){if(typeof window>"u")return;let _=e3(O1(t3)||"default"),$=(()=>{let j=O1(D6);return j?j.trim():null})();j7({theme:_,tint:$},{persist:!1})}function rZ(){if(typeof window>"u")return()=>{};if(G7(),window.matchMedia&&!a3){let _=window.matchMedia("(prefers-color-scheme: dark)");if(_.addEventListener)_.addEventListener("change",H6);else if(_.addListener)_.addListener(H6);return a3=!0,()=>{if(_.removeEventListener)_.removeEventListener("change",H6);else if(_.removeListener)_.removeListener(H6);a3=!1}}return()=>{}}function F2(_){if(!_||typeof _!=="object")return;let $=ZH(),j=_.chat_jid||_.chatJid||null,G=_.theme??_.name??_.colorTheme,Z=_.tint??null;if(!j||j===$)j7({theme:G||"default",tint:Z},{persist:!1});V_(t3,G||"default"),V_(D6,Z||"")}function pZ(){if(typeof document>"u")return"light";let _=document.documentElement?.dataset?.theme;if(_==="dark"||_==="light")return _;return lZ()}var t3="piclaw_theme",D6="piclaw_tint",E$,W6,bZ,dE,z4,mZ="light",a3=!1;var _5=J_(()=>{E$={bgPrimary:"#ffffff",bgSecondary:"#f7f9fa",bgHover:"#e8ebed",textPrimary:"#0f1419",textSecondary:"#536471",borderColor:"#eff3f4",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},W6={bgPrimary:"#000000",bgSecondary:"#16181c",bgHover:"#1d1f23",textPrimary:"#e7e9ea",textSecondary:"#71767b",borderColor:"#2f3336",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},bZ={default:{label:"Default",mode:"auto",light:E$,dark:W6},tango:{label:"Tango",mode:"light",light:{bgPrimary:"#f6f5f4",bgSecondary:"#efedeb",bgHover:"#e5e3e1",textPrimary:"#2e3436",textSecondary:"#5c6466",borderColor:"#d3d7cf",accent:"#3465a4",accentHover:"#2c5890",danger:"#cc0000",success:"#4e9a06"}},xterm:{label:"XTerm",mode:"dark",dark:{bgPrimary:"#000000",bgSecondary:"#0a0a0a",bgHover:"#121212",textPrimary:"#d0d0d0",textSecondary:"#8a8a8a",borderColor:"#1f1f1f",accent:"#00a2ff",accentHover:"#0086d1",danger:"#ff5f5f",success:"#5fff87"}},monokai:{label:"Monokai",mode:"dark",dark:{bgPrimary:"#272822",bgSecondary:"#2f2f2f",bgHover:"#3a3a3a",textPrimary:"#f8f8f2",textSecondary:"#cfcfc2",borderColor:"#3e3d32",accent:"#f92672",accentHover:"#e81560",danger:"#f92672",success:"#a6e22e"}},"monokai-pro":{label:"Monokai Pro",mode:"dark",dark:{bgPrimary:"#2d2a2e",bgSecondary:"#363237",bgHover:"#403a40",textPrimary:"#fcfcfa",textSecondary:"#c1c0c0",borderColor:"#444046",accent:"#ff6188",accentHover:"#f74f7e",danger:"#ff4f5e",success:"#a9dc76"}},ristretto:{label:"Ristretto",mode:"dark",dark:{bgPrimary:"#2c2525",bgSecondary:"#362d2d",bgHover:"#403535",textPrimary:"#f4f1ef",textSecondary:"#cbbdb8",borderColor:"#4a3c3c",accent:"#ff9f43",accentHover:"#f28a2e",danger:"#ff5f56",success:"#a9dc76"}},dracula:{label:"Dracula",mode:"dark",dark:{bgPrimary:"#282a36",bgSecondary:"#303445",bgHover:"#3a3f52",textPrimary:"#f8f8f2",textSecondary:"#c5c8d6",borderColor:"#44475a",accent:"#bd93f9",accentHover:"#a87ded",danger:"#ff5555",success:"#50fa7b"}},catppuccin:{label:"Catppuccin",mode:"dark",dark:{bgPrimary:"#1e1e2e",bgSecondary:"#24273a",bgHover:"#2c2f41",textPrimary:"#cdd6f4",textSecondary:"#a6adc8",borderColor:"#313244",accent:"#89b4fa",accentHover:"#74a0f5",danger:"#f38ba8",success:"#a6e3a1"}},nord:{label:"Nord",mode:"dark",dark:{bgPrimary:"#2e3440",bgSecondary:"#3b4252",bgHover:"#434c5e",textPrimary:"#eceff4",textSecondary:"#d8dee9",borderColor:"#4c566a",accent:"#88c0d0",accentHover:"#78a9c0",danger:"#bf616a",success:"#a3be8c"}},gruvbox:{label:"Gruvbox",mode:"dark",dark:{bgPrimary:"#282828",bgSecondary:"#32302f",bgHover:"#3c3836",textPrimary:"#ebdbb2",textSecondary:"#bdae93",borderColor:"#3c3836",accent:"#d79921",accentHover:"#c28515",danger:"#fb4934",success:"#b8bb26"}},solarized:{label:"Solarized",mode:"auto",light:{bgPrimary:"#fdf6e3",bgSecondary:"#f5efdc",bgHover:"#eee8d5",textPrimary:"#586e75",textSecondary:"#657b83",borderColor:"#e0d8c6",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"},dark:{bgPrimary:"#002b36",bgSecondary:"#073642",bgHover:"#0b3c4a",textPrimary:"#eee8d5",textSecondary:"#93a1a1",borderColor:"#18424a",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"}},tokyo:{label:"Tokyo",mode:"dark",dark:{bgPrimary:"#1a1b26",bgSecondary:"#24283b",bgHover:"#2f3549",textPrimary:"#c0caf5",textSecondary:"#9aa5ce",borderColor:"#414868",accent:"#7aa2f7",accentHover:"#6b92e6",danger:"#f7768e",success:"#9ece6a"}},miasma:{label:"Miasma",mode:"dark",dark:{bgPrimary:"#1f1f23",bgSecondary:"#29292f",bgHover:"#33333a",textPrimary:"#e5e5e5",textSecondary:"#b4b4b4",borderColor:"#3d3d45",accent:"#c9739c",accentHover:"#b8618c",danger:"#e06c75",success:"#98c379"}},github:{label:"GitHub",mode:"auto",light:{bgPrimary:"#ffffff",bgSecondary:"#f6f8fa",bgHover:"#eaeef2",textPrimary:"#24292f",textSecondary:"#57606a",borderColor:"#d0d7de",accent:"#0969da",accentHover:"#0550ae",danger:"#cf222e",success:"#1a7f37"},dark:{bgPrimary:"#0d1117",bgSecondary:"#161b22",bgHover:"#21262d",textPrimary:"#c9d1d9",textSecondary:"#8b949e",borderColor:"#30363d",accent:"#2f81f7",accentHover:"#1f6feb",danger:"#f85149",success:"#3fb950"}},gotham:{label:"Gotham",mode:"dark",dark:{bgPrimary:"#0b0f14",bgSecondary:"#111720",bgHover:"#18212b",textPrimary:"#cbd6e2",textSecondary:"#9bb0c3",borderColor:"#1f2a37",accent:"#5ccfe6",accentHover:"#48b8ce",danger:"#d26937",success:"#2aa889"}}},dE=["--bg-primary","--bg-secondary","--bg-hover","--text-primary","--text-secondary","--border-color","--accent-color","--accent-hover","--accent-color-alpha","--accent-contrast-text","--accent-soft","--accent-soft-strong","--warning-color","--danger-color","--success-color","--search-highlight-color"],z4={theme:"default",tint:null}});function $X(_=typeof window<"u"?window:null){return _||null}function z6(){if(typeof performance<"u"&&typeof performance.now==="function")return performance.now();return Date.now()}function X5(_,$){return`${_}:${$}`}function jX(_){return`${_}-${Math.random().toString(36).slice(2,10)}-${Date.now().toString(36)}`}function GX(_,$){if(_.length<=$)return;_.splice(0,_.length-$)}function A4(_){if(!_||typeof _!=="object")return null;return{..._}}function M4(_){if(!_)return null;return k4.find(($)=>$.id===_)||null}function X7(_,$){if(typeof performance>"u"||typeof performance.mark!=="function")return;try{performance.mark(`piclaw:${_}:${$}`)}catch(j){console.debug("[app-perf] Ignoring performance.mark failure.",j,{traceId:_,phase:$})}}function ZX(_){if(typeof performance>"u"||typeof performance.clearMarks!=="function")return;try{performance.clearMarks(`piclaw:${_}:start`);let $=M4(_);if(!$)return;for(let j of $.phases)performance.clearMarks(`piclaw:${_}:${j.phase}`)}catch($){console.debug("[app-perf] Ignoring performance.clearMarks failure.",$,{traceId:_})}}function _X(_,$,j){let G=y4.get(X5(_,$));if(G&&M4(G)?.status==="active")Z5(G,"cancelled","superseded",{replacementType:_,replacementChatJid:$});let Z=jX(_),X={id:Z,type:_,chatJid:$,startedAt:z6(),detail:A4(j),phases:[],status:"active"};return k4.push(X),GX(k4,100),y4.set(X5(_,$),Z),X7(Z,"start"),Z}function Z5(_,$,j,G,Z){let X=M4(_);if(!X||X.status!=="active")return;if(j)X.phases.push({phase:j,at:z6(),detail:A4(G)}),X7(X.id,j);if(X.status=$,X.completedAt=z6(),X.durationMs=X.completedAt-X.startedAt,Z!==void 0)X.error=Z instanceof Error?Z.message:String(Z);let Y=X5(X.type,X.chatJid);if(y4.get(Y)===X.id)y4.delete(Y);ZX(X.id)}function yH(_=$X()){let $=_?.__PICLAW_PERF__;if($)return $;if(_)_.__PICLAW_PERF__=J6;return J6}function U2(_=$X()){return yH(_)}function XX(_,$,j){return U2().ensureTrace(_,$,j)}function A6(_,$){return U2().getActiveTraceId(_,$)}function X1(_,$,j){U2().markTrace(_,$,j)}function k6(_,$,j="settled",G){let Z=M4(_);if(!Z||Z.status!=="active")return!1;let X=new Set(Z.phases.map((Y)=>Y.phase));if(!$.every((Y)=>X.has(Y)))return!1;return Z5(_,"completed",j,G),!0}function YX(_,$,j="failed",G){U2().failTrace(_,$,j,G)}function LX(_,$="cancelled",j){U2().cancelTrace(_,$,j)}function Y7(_){return U2().recordRequest(_)}var k4,G5,y4,J6;var Y5=J_(()=>{k4=[],G5=[],y4=new Map;J6={startTrace(_,$,j){return _X(_,$,j)},ensureTrace(_,$,j){let G=y4.get(X5(_,$));if(G&&M4(G)?.status==="active")return G;return _X(_,$,j)},getActiveTraceId(_,$){let j=y4.get(X5(_,$));return j&&M4(j)?.status==="active"?j:null},markTrace(_,$,j){let G=M4(_);if(!G||G.status!=="active")return;G.phases.push({phase:$,at:z6(),detail:A4(j)}),X7(G.id,$)},completeTrace(_,$="settled",j){Z5(_,"completed",$,j)},failTrace(_,$,j="failed",G){Z5(_,"failed",j,G,$)},cancelTrace(_,$="cancelled",j){Z5(_,"cancelled",$,j)},recordRequest(_){let $=jX("req");return G5.push({..._,id:$,detail:A4(_.detail)}),GX(G5,300),$},getTraces(){return k4.map((_)=>({..._,detail:A4(_.detail),phases:_.phases.map(($)=>({...$,detail:A4($.detail)}))}))},getRequests(){return G5.map((_)=>({..._,detail:A4(_.detail)}))},clear(){k4.forEach((_)=>ZX(_.id)),k4.splice(0,k4.length),G5.splice(0,G5.length),y4.clear()},printSummary(){let _={traces:J6.getTraces(),requests:J6.getRequests()};return console.table(_.traces.map(($)=>({id:$.id,type:$.type,chatJid:$.chatJid,status:$.status,durationMs:Number($.durationMs||0).toFixed(1),lastPhase:$.phases[$.phases.length-1]?.phase||"start"}))),_}}});function E2(_){let $=Number(_||0);return Number.isFinite($)&&$>0?$:null}function MH(_){try{return Boolean(_?.matchMedia?.("(pointer: coarse)")?.matches)}catch{return!1}}function wH(_){let $=String(_?.navigator?.userAgent||"");return/Android|webOS|iPhone|iPod|Mobile|Windows Phone/i.test($)}function qX(_){let $=String(_?.navigator?.userAgent||"");return/iPad|Tablet|PlayBook|Silk/i.test($)}function VX(_=typeof window<"u"?window:null){let $=E2(_?.innerWidth)??E2(_?.screen?.availWidth)??E2(_?.screen?.width)??0,j=E2(_?.innerHeight)??E2(_?.screen?.availHeight)??E2(_?.screen?.height)??0,G=$&&j?Math.min($,j):$||j,Z=$&&j?Math.max($,j):$||j,X=MH(_),Y=Number(_?.navigator?.maxTouchPoints||0),L=X||Y>1;if(G>0&&G<=640)return"mobile";if(wH(_)&&!qX(_))return"mobile";if(qX(_))return"tablet";if(L&&G>0&&G<=1100)return"tablet";if(Z>0&&Z<=1180&&G>0&&G<=900)return"tablet";return"desktop"}var N5={};j1(N5,{uploadWorkspaceFile:()=>w6,uploadMedia:()=>O7,updateWorkspaceFile:()=>XD,updateScheduledTask:()=>Q7,submitAdaptiveCardAction:()=>z7,streamSidePrompt:()=>$D,stopAutoresearch:()=>iH,steerAgentQueueItem:()=>tH,setWorkspaceVisibility:()=>K5,setAgentThoughtVisibility:()=>GD,sendPeerAgentMessage:()=>hH,sendAgentMessage:()=>z1,searchPosts:()=>xH,saveWorkspaceSettings:()=>F7,saveWebPushSubscription:()=>D7,saveUiState:()=>N7,saveQuickActionsSettings:()=>B7,saveEnvironmentOverride:()=>y6,restoreChatBranch:()=>lH,respondToAgentRequest:()=>H2,reorderAgentQueueItem:()=>eH,renameWorkspaceFile:()=>C7,renameChatJid:()=>cH,renameChatBranch:()=>gH,removeAgentQueueItem:()=>aH,reindexWorkspace:()=>w7,purgeChatBranch:()=>mH,pruneChatBranch:()=>vH,moveWorkspaceEntry:()=>f7,mergeChatBranchIntoParent:()=>bH,getWorkspaceTree:()=>V5,getWorkspaceRawUrl:()=>Q5,getWorkspaceIndexStatus:()=>M7,getWorkspaceFileStat:()=>x7,getWorkspaceFileDownloadUrl:()=>T6,getWorkspaceFile:()=>T7,getWorkspaceDownloadUrl:()=>x6,getWorkspaceBranch:()=>y7,getWebPushPublicKey:()=>H7,getTimeline:()=>h$,getThumbnailUrl:()=>A7,getThread:()=>IH,getSystemMetrics:()=>V7,getScheduledTasks:()=>K7,getQuickActionsSettings:()=>q5,getPostsByHashtag:()=>q7,getMediaUrl:()=>u1,getMediaText:()=>ZD,getMediaInfo:()=>M6,getMediaBlob:()=>k7,getEnvironmentSettings:()=>U7,getChatBranches:()=>SH,getAutoresearchStatus:()=>dH,getAgents:()=>nH,getAgentThought:()=>jD,getAgentStatus:()=>rH,getAgentQueueState:()=>sH,getAgentModels:()=>w4,getAgentContext:()=>pH,getAgentCommands:()=>L5,getActiveChatAgents:()=>RH,forkChatBranch:()=>uH,dismissAutoresearch:()=>oH,deleteWorkspaceFile:()=>P7,deleteWebPushSubscription:()=>W7,deletePost:()=>PH,createWorkspaceFile:()=>I7,createRootChatSession:()=>E7,createReply:()=>fH,createPost:()=>CH,completeInstanceOobe:()=>_D,attachWorkspaceFile:()=>YD,addToWhitelist:()=>J7,SSEClient:()=>I6});async function r0(_,$={}){let j=typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now(),G;try{G=await fetch(h_+_,{...$,headers:{"Content-Type":"application/json",...$.headers}})}catch(X){throw Y7({method:String($.method||"GET").toUpperCase(),url:_,startedAt:j,durationMs:(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-j,ok:!1,detail:{failedBeforeResponse:!0}}),X}let Z=(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-j;if(Y7({method:String($.method||"GET").toUpperCase(),url:_,startedAt:j,durationMs:Z,status:G.status,ok:G.ok,requestId:G.headers?.get?.("x-request-id")||null,serverTiming:G.headers?.get?.("Server-Timing")||null}),!G.ok){let X=await G.json().catch(()=>({error:"Unknown error"}));throw Error(X.error||`HTTP ${G.status}`)}return G.json()}function KX(_){let $=String(_||"").split(`
`),j="message",G=[];for(let X of $)if(X.startsWith("event:"))j=X.slice(6).trim()||"message";else if(X.startsWith("data:"))G.push(X.slice(5).trim());let Z=G.join(`
`);if(!Z)return null;try{return{event:j,data:JSON.parse(Z)}}catch{return{event:j,data:Z}}}async function TH(_,$){if(!_.body)throw Error("Missing event stream body");let j=_.body.getReader(),G=new TextDecoder,Z="";while(!0){let{value:Y,done:L}=await j.read();if(L)break;Z+=G.decode(Y,{stream:!0});let V=Z.split(`

`);Z=V.pop()||"";for(let q of V){let Q=KX(q);if(Q)$(Q.event,Q.data)}}Z+=G.decode();let X=KX(Z);if(X)$(X.event,X.data)}async function h$(_=10,$=null,j=null){let G=`/timeline?limit=${_}`;if($)G+=`&before=${$}`;if(j)G+=`&chat_jid=${encodeURIComponent(j)}`;return r0(G)}async function q7(_,$=50,j=0,G=null){let Z=G?`&chat_jid=${encodeURIComponent(G)}`:"";return r0(`/hashtag/${encodeURIComponent(_)}?limit=${$}&offset=${j}${Z}`)}async function xH(_,$=50,j=0,G=null,Z="current",X=null,Y=null){let L=G?`&chat_jid=${encodeURIComponent(G)}`:"",V=Z?`&scope=${encodeURIComponent(Z)}`:"",q=X?`&root_chat_jid=${encodeURIComponent(X)}`:"",Q=Y?.images?"&images=1":"",K=Y?.attachments?"&attachments=1":"";return r0(`/search?q=${encodeURIComponent(_)}&limit=${$}&offset=${j}${L}${V}${q}${Q}${K}`)}async function IH(_,$=null){let j=$?`?chat_jid=${encodeURIComponent($)}`:"";return r0(`/thread/${_}${j}`)}async function V7(){return r0("/agent/system-metrics")}async function K7(_={}){let $=new URLSearchParams;if(_?.id)$.set("id",String(_.id));if(_?.chatJid)$.set("chat_jid",String(_.chatJid));if(_?.status&&_.status!=="all")$.set("status",String(_.status));if(_?.limit)$.set("limit",String(_.limit));if(_?.includeRunLogs)$.set("include_run_logs","1");if(_?.runLogLimit)$.set("run_log_limit",String(_.runLogLimit));let j=$.toString()?`?${$.toString()}`:"";return r0(`/agent/scheduled-tasks${j}`)}async function Q7(_,$,j={}){return r0("/agent/scheduled-tasks/action",{method:"POST",body:JSON.stringify({action:_,id:$,allow_internal:j?.allowInternal===!0})})}async function N7(_){return r0("/agent/ui-state",{method:"POST",body:JSON.stringify(_||{})})}async function CH(_,$=[],j=null){let G=j?`?chat_jid=${encodeURIComponent(j)}`:"";return r0(`/post${G}`,{method:"POST",body:JSON.stringify({content:_,media_ids:$})})}async function fH(_,$,j=[],G=null){let Z=G?`?chat_jid=${encodeURIComponent(G)}`:"";return r0(`/post/reply${Z}`,{method:"POST",body:JSON.stringify({thread_id:_,content:$,media_ids:j})})}async function PH(_,$=!1,j=null){let G=j?`&chat_jid=${encodeURIComponent(j)}`:"",Z=`/post/${_}?cascade=${$?"true":"false"}${G}`;return r0(Z,{method:"DELETE"})}async function z1(_,$,j=null,G=[],Z=null,X=null){let Y=X?`?chat_jid=${encodeURIComponent(X)}`:"",L={content:$,thread_id:j,media_ids:G,client_context:{screen_hint:VX()}};if(Z==="auto"||Z==="queue"||Z==="steer")L.mode=Z;return r0(`/agent/${_}/message${Y}`,{method:"POST",body:JSON.stringify(L)})}async function L5(_="web:default"){let $=typeof _==="string"&&_.trim()?_.trim():"web:default";return r0(`/agent/commands?chat_jid=${encodeURIComponent($)}`)}async function q5(){return r0("/agent/settings/quick-actions")}async function B7(_){return r0("/agent/settings/quick-actions",{method:"POST",body:JSON.stringify(_||{})})}async function F7(_){return r0("/agent/settings/workspace",{method:"POST",body:JSON.stringify(_||{})})}async function U7(){return r0("/agent/settings/environment")}async function y6(_){return r0("/agent/settings/environment",{method:"POST",body:JSON.stringify(_||{})})}async function RH(){return r0("/agent/active-chats")}async function SH(_=null,$={}){let j=new URLSearchParams;if(_)j.set("root_chat_jid",String(_));if($?.includeArchived)j.set("include_archived","1");let G=j.toString()?`?${j.toString()}`:"";return r0(`/agent/branches${G}`)}async function uH(_,$={}){return r0("/agent/branch-fork",{method:"POST",body:JSON.stringify({source_chat_jid:_,...$?.agentName?{agent_name:$.agentName}:{}})})}async function E7(_){return r0("/agent/root-session",{method:"POST",body:JSON.stringify({agent_name:_})})}async function gH(_,$={}){return r0("/agent/branch-rename",{method:"POST",body:JSON.stringify({chat_jid:_,...$&&Object.prototype.hasOwnProperty.call($,"agentName")?{agent_name:$.agentName}:{}})})}async function bH(_){return r0("/agent/branch-merge-parent",{method:"POST",body:JSON.stringify({chat_jid:_})})}async function vH(_){return r0("/agent/branch-prune",{method:"POST",body:JSON.stringify({chat_jid:_})})}async function mH(_){return r0("/agent/branch-purge",{method:"POST",body:JSON.stringify({chat_jid:_})})}async function cH(_,$){return r0("/agent/rename-jid",{method:"POST",body:JSON.stringify({old_jid:_,new_jid:$})})}async function lH(_,$={}){return r0("/agent/branch-restore",{method:"POST",body:JSON.stringify({chat_jid:_,...$&&Object.prototype.hasOwnProperty.call($,"agentName")?{agent_name:$.agentName}:{}})})}async function hH(_,$,j,G="auto",Z={}){let X={source_chat_jid:_,content:j,mode:G,...Z?.sourceAgentName?{source_agent_name:Z.sourceAgentName}:{},...Z?.targetBy==="agent_name"?{target_agent_name:$}:{target_chat_jid:$}};return r0("/agent/peer-message",{method:"POST",body:JSON.stringify(X)})}async function H7(){return r0("/agent/push/vapid-public-key")}async function D7(_,$={}){let j={subscription:_,...$?.deviceId?{device_id:$.deviceId}:{}};return r0("/agent/push/subscription",{method:"POST",body:JSON.stringify(j)})}async function W7(_,$={}){let j={subscription:_,...$?.deviceId?{device_id:$.deviceId}:{}};return r0("/agent/push/subscription",{method:"DELETE",body:JSON.stringify(j)})}async function nH(){return r0("/agent/roster")}async function rH(_=null){let $=_?`?chat_jid=${encodeURIComponent(_)}`:"";return r0(`/agent/status${$}`)}async function pH(_=null){let $=_?`?chat_jid=${encodeURIComponent(_)}`:"";return r0(`/agent/context${$}`)}async function dH(_=null){let $=_?`?chat_jid=${encodeURIComponent(_)}`:"";return r0(`/agent/autoresearch/status${$}`)}async function iH(_=null,$={}){return r0("/agent/autoresearch/stop",{method:"POST",body:JSON.stringify({chat_jid:_||void 0,generate_report:$?.generateReport!==!1})})}async function oH(_=null){return r0("/agent/autoresearch/dismiss",{method:"POST",body:JSON.stringify({chat_jid:_||void 0})})}async function sH(_=null){let $=_?`?chat_jid=${encodeURIComponent(_)}`:"";return r0(`/agent/queue-state${$}`)}async function aH(_,$=null){let j=await fetch(h_+"/agent/queue-remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:_,chat_jid:$||void 0})});if(!j.ok){let G=await j.json().catch(()=>({error:"Failed to remove queued item"}));throw Error(G.error||`HTTP ${j.status}`)}return j.json()}async function tH(_,$=null){let j=await fetch(h_+"/agent/queue-steer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:_,chat_jid:$||void 0})});if(!j.ok){let G=await j.json().catch(()=>({error:"Failed to steer queued item"}));throw Error(G.error||`HTTP ${j.status}`)}return j.json()}async function eH(_,$,j=null){let G=await fetch(h_+"/agent/queue-reorder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from_index:_,to_index:$,chat_jid:j||void 0})});if(!G.ok){let Z=await G.json().catch(()=>({error:"Failed to reorder queued item"}));throw Error(Z.error||`HTTP ${G.status}`)}return G.json()}async function w4(_=null){let $=_?`?chat_jid=${encodeURIComponent(_)}`:"";return r0(`/agent/models${$}`)}async function _D(_="provider-ready"){return r0("/agent/oobe/complete",{method:"POST",body:JSON.stringify({kind:_})})}async function O7(_){let $=new FormData;$.append("file",_);let j=await fetch(h_+"/media/upload",{method:"POST",body:$});if(!j.ok){let G=await j.json().catch(()=>({error:"Upload failed"}));throw Error(G.error||`HTTP ${j.status}`)}return j.json()}async function H2(_,$,j=null){let G=await fetch(h_+"/agent/respond",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request_id:_,outcome:$,chat_jid:j||void 0})});if(!G.ok){let Z=await G.json().catch(()=>({error:"Failed to respond"}));throw Error(Z.error||`HTTP ${G.status}`)}return G.json()}async function z7(_){let $=await fetch(h_+"/agent/card-action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(_)});if(!$.ok){let j=await $.json().catch(()=>({error:"Adaptive Card action failed"}));throw Error(j.error||`HTTP ${$.status}`)}return $.json()}async function $D(_,$={}){let j=await fetch(h_+"/agent/side-prompt/stream",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:_,system_prompt:$.systemPrompt||void 0,chat_jid:$.chatJid||void 0}),signal:$.signal});if(!j.ok){let X=await j.json().catch(()=>({error:"Side prompt failed"}));throw Error(X.error||`HTTP ${j.status}`)}let G=null,Z=null;if(await TH(j,(X,Y)=>{if($.onEvent?.(X,Y),X==="side_prompt_thinking_delta")$.onThinkingDelta?.(Y?.delta||"");else if(X==="side_prompt_text_delta")$.onTextDelta?.(Y?.delta||"");else if(X==="side_prompt_done")G=Y;else if(X==="side_prompt_error")Z=Y}),Z){let X=Error(Z?.error||"Side prompt failed");throw X.payload=Z,X}return G}async function J7(_,$){let j=await fetch(h_+"/agent/whitelist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pattern:_,description:$})});if(!j.ok){let G=await j.json().catch(()=>({error:"Failed to add to whitelist"}));throw Error(G.error||`HTTP ${j.status}`)}return j.json()}async function jD(_,$="thought"){let j=`/agent/thought?turn_id=${encodeURIComponent(_)}&panel=${encodeURIComponent($)}`;return r0(j)}async function GD(_,$,j){return r0("/agent/thought/visibility",{method:"POST",body:JSON.stringify({turn_id:_,panel:$,expanded:Boolean(j)})})}function u1(_){return`${h_}/media/${_}`}function A7(_){return`${h_}/media/${_}/thumbnail`}async function M6(_){let $=await fetch(`${h_}/media/${_}/info`);if(!$.ok)throw Error("Failed to get media info");return $.json()}async function ZD(_){let $=await fetch(`${h_}/media/${_}`);if(!$.ok)throw Error("Failed to load media text");return $.text()}async function k7(_){let $=await fetch(`${h_}/media/${_}`);if(!$.ok)throw Error("Failed to load media blob");return $.blob()}async function V5(_="",$=2,j=!1){let G=`/workspace/tree?path=${encodeURIComponent(_)}&depth=${$}&show_hidden=${j?"1":"0"}`;return r0(G)}async function y7(_=""){let $=`/workspace/branch?path=${encodeURIComponent(_||"")}`;return r0($)}async function M7(_="all"){let $=`/workspace/index-status?scope=${encodeURIComponent(_||"all")}`;return r0($)}async function w7(_="all"){return r0("/workspace/reindex",{method:"POST",body:JSON.stringify({scope:_})})}async function T7(_,$=20000,j=null){let G=j?`&mode=${encodeURIComponent(j)}`:"",Z=`/workspace/file?path=${encodeURIComponent(_)}&max=${$}${G}`;return r0(Z)}async function x7(_){return r0(`/workspace/stat?path=${encodeURIComponent(_)}`)}async function XD(_,$){return r0("/workspace/file",{method:"PUT",body:JSON.stringify({path:_,content:$})})}async function YD(_){return r0("/workspace/attach",{method:"POST",body:JSON.stringify({path:_})})}function qD(_,$="",j={}){let G=new URLSearchParams;if($)G.set("path",$);if(j.overwrite)G.set("overwrite","1");let Z=G.toString();return Z?`${_}?${Z}`:_}function VD(){if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();return`upload-${Date.now()}-${Math.random().toString(36).slice(2)}`}function KD(_,$,j,G){return new Promise((Z,X)=>{let Y=new XMLHttpRequest;Y.open("POST",h_+$);for(let[L,V]of Object.entries(j||{}))if(V!==void 0&&V!==null)Y.setRequestHeader(L,String(V));Y.upload.onprogress=(L)=>{if(typeof G==="function")G({loaded:L.lengthComputable?L.loaded:0,total:L.lengthComputable?L.total:_.size,lengthComputable:L.lengthComputable})},Y.onload=()=>{try{let L=Y.responseText?JSON.parse(Y.responseText):{};if(Y.status>=200&&Y.status<300)Z(L);else{let V=Error(L.error||`HTTP ${Y.status}`);V.status=Y.status,V.code=L.code,X(V)}}catch{let L=Error(`HTTP ${Y.status}`);L.status=Y.status,X(L)}},Y.onerror=()=>X(Error("Upload failed (network error)")),Y.ontimeout=()=>X(Error("Upload timed out")),Y.send(_)})}async function QD(_,$="",j={}){let G=VD(),Z=qD("/workspace/upload-chunk",$,j),X=Math.max(1,Math.min(L7,Number(j.chunkSize)||LD)),Y=Math.max(0,Number(_?.size)||0),L=Math.max(1,Math.ceil(Y/X)),V=0,q=null;for(let Q=0;Q<L;Q+=1){let K=Q*X,B=Math.min(Y,K+X),N=_.slice(K,B),U=N.size;if(q=await KD(N,Z,{"X-Upload-Id":G,"X-Chunk-Index":Q,"X-Chunk-Total":L,"X-File-Name":_?.name||"upload.bin","X-File-Size":Y},(D)=>{if(typeof j.onProgress!=="function")return;let H=Math.min(Y,V+(D?.loaded||0)),E=Y||1;j.onProgress({loaded:H,total:E,percent:Math.round(H/E*100),chunkIndex:Q,chunkTotal:L})}),V+=U,typeof j.onProgress==="function"){let D=Y||1,H=Y?V:D;j.onProgress({loaded:H,total:D,percent:Math.round(H/D*100),chunkIndex:Q+1,chunkTotal:L})}}return q}async function w6(_,$="",j={}){if(_?.size>L7){let G=(_.size/1048576).toFixed(0),Z=(L7/1048576).toFixed(0),X=Error(`File too large (${G} MB). Maximum upload size is ${Z} MB.`);throw X.code="file_too_large",X}return await QD(_,$,j)}async function I7(_,$,j=""){let G=await fetch(h_+"/workspace/file",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:_,name:$,content:j})});if(!G.ok){let Z=await G.json().catch(()=>({error:"Create failed"})),X=Error(Z.error||`HTTP ${G.status}`);throw X.status=G.status,X.code=Z.code,X}return G.json()}async function C7(_,$){let j=await fetch(h_+"/workspace/rename",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:_,name:$})});if(!j.ok){let G=await j.json().catch(()=>({error:"Rename failed"})),Z=Error(G.error||`HTTP ${j.status}`);throw Z.status=j.status,Z.code=G.code,Z}return j.json()}async function f7(_,$){let j=await fetch(h_+"/workspace/move",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:_,target:$})});if(!j.ok){let G=await j.json().catch(()=>({error:"Move failed"})),Z=Error(G.error||`HTTP ${j.status}`);throw Z.status=j.status,Z.code=G.code,Z}return j.json()}async function P7(_){let $=`/workspace/file?path=${encodeURIComponent(_||"")}`;return r0($,{method:"DELETE"})}async function K5(_,$=!1){return r0("/workspace/visibility",{method:"POST",body:JSON.stringify({visible:Boolean(_),show_hidden:Boolean($)})})}function Q5(_,$={}){let j=new URLSearchParams({path:String(_||"")});if($.download)j.set("download","1");return`${h_}/workspace/raw?${j.toString()}`}function T6(_){return Q5(_,{download:!0})}function x6(_,$=!1){let j=`path=${encodeURIComponent(_||"")}&show_hidden=${$?"1":"0"}`;return`${h_}/workspace/download?${j}`}class I6{onEvent;onStatusChange;chatJid;eventSource;reconnectTimeout;reconnectDelay;status;reconnectAttempts;cooldownUntil;connecting;lastActivityAt;staleCheckTimer;staleThresholdMs;constructor(_,$,j={}){this.onEvent=_,this.onStatusChange=$,this.chatJid=typeof j?.chatJid==="string"&&j.chatJid.trim()?j.chatJid.trim():null,this.eventSource=null,this.reconnectTimeout=null,this.reconnectDelay=1000,this.status="disconnected",this.reconnectAttempts=0,this.cooldownUntil=0,this.connecting=!1,this.lastActivityAt=0,this.staleCheckTimer=null,this.staleThresholdMs=70000}markActivity(){this.lastActivityAt=Date.now()}clearStaleMonitor(){if(this.staleCheckTimer)clearInterval(this.staleCheckTimer),this.staleCheckTimer=null}startStaleMonitor(){this.clearStaleMonitor(),this.staleCheckTimer=setInterval(()=>{if(this.status!=="connected")return;if(!this.lastActivityAt)return;if(Date.now()-this.lastActivityAt<=this.staleThresholdMs)return;console.warn("SSE connection went stale; forcing reconnect"),this.forceReconnect()},15000)}forceReconnect(){if(this.connecting=!1,this.eventSource)this.eventSource.close(),this.eventSource=null;this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()}connect(){if(this.connecting)return;if(this.eventSource&&this.status==="connected")return;if(this.connecting=!0,this.eventSource)this.eventSource.close();this.clearStaleMonitor();let _=this.chatJid?`?chat_jid=${encodeURIComponent(this.chatJid)}`:"";this.eventSource=new EventSource(h_+"/sse/stream"+_);let $=(j)=>{this.eventSource.addEventListener(j,(G)=>{this.markActivity(),this.onEvent(j,JSON.parse(G.data))})};this.eventSource.onopen=()=>{this.connecting=!1,this.reconnectDelay=1000,this.reconnectAttempts=0,this.cooldownUntil=0,this.status="connected",this.markActivity(),this.startStaleMonitor(),this.onStatusChange("connected")},this.eventSource.onerror=()=>{this.connecting=!1,this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()},this.eventSource.addEventListener("connected",()=>{this.markActivity(),console.log("SSE connected"),this.onEvent("connected",{})}),this.eventSource.addEventListener("heartbeat",()=>{this.markActivity()}),$("new_post"),$("new_reply"),$("agent_response"),$("interaction_updated"),$("interaction_deleted"),$("agent_status"),$("agent_steer_queued"),$("agent_followup_queued"),$("agent_followup_consumed"),$("agent_followup_removed"),$("workspace_update"),$("agent_draft"),$("agent_draft_delta"),$("agent_thought"),$("agent_thought_delta"),$("model_changed"),$("ui_theme"),$("ui_meters"),["extension_ui_request","extension_ui_timeout","extension_ui_notify","extension_ui_status","extension_ui_working","extension_ui_working_indicator","extension_ui_working_visible","extension_ui_widget","extension_ui_title","extension_ui_editor_text","extension_ui_error"].forEach($)}scheduleReconnect(){if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout);let _=10,$=60000,j=Date.now();if(this.reconnectAttempts>=_)this.cooldownUntil=Math.max(this.cooldownUntil,j+$),this.reconnectAttempts=0;let G=Math.max(this.cooldownUntil-j,0),Z=Math.max(this.reconnectDelay,G);this.reconnectTimeout=setTimeout(()=>{console.log("Reconnecting SSE..."),this.connect()},Z),this.reconnectDelay=Math.min(this.reconnectDelay*2,30000)}reconnectIfNeeded(){let _=Date.now();if(this.status==="connected"){if(this.lastActivityAt&&_-this.lastActivityAt>this.staleThresholdMs)this.forceReconnect();return}if(this.cooldownUntil&&_<this.cooldownUntil)return;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null;this.connect()}disconnect(){if(this.connecting=!1,this.clearStaleMonitor(),this.eventSource)this.eventSource.close(),this.eventSource=null;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null}}var h_="",L7=1073741824,LD=8388608;var I_=J_(()=>{Y5()});function W2(_){let $=typeof _==="string"?_.trim():"";return $?$:null}function o1(_={}){if(typeof window>"u")return;let $=W2(_.section);try{if(window.__piclawSettingsOpenRequested=!0,$)window.__piclawSettingsRequestedSection=$;else delete window.__piclawSettingsRequestedSection}catch(j){console.debug("[settings-dialog-events] failed to record open request flags",j)}window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:$?{section:$}:void 0}))}function d7(){if(typeof window>"u")return null;return W2(window.__piclawSettingsRequestedSection)}function R6(){if(typeof window>"u")return{open:!1,section:null};let _=Boolean(window.__piclawSettingsOpenRequested),$=d7();try{window.__piclawSettingsOpenRequested=!1,delete window.__piclawSettingsRequestedSection}catch(j){console.debug("[settings-dialog-events] failed to clear open request flags",j)}return{open:_,section:$}}function p$({children:_,className:$=""}){let[j,G]=f(null);return u(()=>{if(typeof document>"u")return;let Z=document.createElement("div");return document.body.appendChild(Z),G(Z),()=>{try{Q$(null,Z)}finally{Z.remove()}}},[]),u(()=>{if(!j)return;j.className=$||"";return},[$,j]),j2(()=>{if(!j)return;Q$(_,j);return},[_,j]),null}var S6=J_(()=>{M0()});function i7(_,$){let j=String(_.label||"").localeCompare(String($.label||""),void 0,{sensitivity:"base"});if(j!==0)return j;return String(_.id||"").localeCompare(String($.id||""),void 0,{sensitivity:"base"})}function d$(_){let $=x4.findIndex((j)=>j.id===_.id);if($>=0)x4[$]=_;else x4.push(_);x4.sort(i7)}function aX(_){let $=x4.findIndex((j)=>j.id===_);if($>=0)x4.splice($,1)}function tX(){return[...x4]}function o7(){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent("piclaw:settings-panes-changed"))}var x4;var O2=J_(()=>{x4=[]});function RD(_){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(I4,{detail:{enabled:Boolean(_)}}))}function $Y(_){if(typeof fetch!=="function")return;N7({ui_meters:_}).catch(($)=>{console.debug("[meters] Failed to persist meters UI state.",$)})}function SD(_){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(g6,{detail:{collapsed:Boolean(_)}}))}function W5(_=!1){return F$(eX,_)}function jY(_=!1){return F$(_Y,_)}function u6(_,$={}){let j=$.persist!==!1,G=$.persistServer!==!1,Z=Boolean(_);if(j)V_(eX,Z?"true":"false");if(G)$Y({enabled:Z});return RD(Z),Z}function s7(_,$={}){let j=$.persist!==!1,G=$.persistServer!==!1,Z=Boolean(_);if(j)V_(_Y,Z?"true":"false");if(G)$Y({collapsed:Z});return SD(Z),Z}function a7(_){let $=typeof _?.mode==="string"?_.mode.trim().toLowerCase():"";if(typeof _?.enabled==="boolean")u6(Boolean(_.enabled),{persistServer:!1});else if($==="toggle"){let j=!W5(!1);u6(j,{persistServer:!1})}if(typeof _?.collapsed==="boolean")s7(Boolean(_.collapsed),{persistServer:!1})}var eX="piclaw_system_meters_enabled",_Y="piclaw_system_meters_collapsed",I4="piclaw-meters-change",g6="piclaw-meters-collapsed-change";var b6=J_(()=>{I_()});function GY(_,$){if(_===""||_===null||_===void 0)return $;let j=Number(_);return Number.isFinite(j)?j:$}function ZY(_,{min:$=-1/0,max:j=1/0}={}){let G=Number.isFinite(Number($))?Number($):-1/0,Z=Number.isFinite(Number(j))?Number(j):1/0;return Math.min(Z,Math.max(G,Number(_)))}function O$(_,{fallback:$=0,min:j=-1/0,max:G=1/0}={}){let Z=GY(_,$);return ZY(Z,{min:j,max:G})}function uD(_,{direction:$=1,step:j=1,fallback:G=0,min:Z=-1/0,max:X=1/0}={}){let Y=O$(_,{fallback:G,min:Z,max:X}),L=Math.abs(GY(j,1))||1,V=Number($)<0?-1:1;return ZY(Y+V*L,{min:Z,max:X})}function v_({value:_,min:$,max:j,step:G=1,fallback:Z,width:X="80px",disabled:Y=!1,label:L,onChange:V}){let q=Number.isFinite(Number(Z))?Number(Z):O$(_,{fallback:0,min:$,max:j}),[Q,K]=f(String(_??q)),B=g(!1);u(()=>{if(!B.current)K(String(_??q))},[_,q]);let N=R((D)=>{B.current=!1;let H=O$(D,{fallback:q,min:$,max:j});K(String(H)),V?.(H)},[q,$,j,V]),U=R((D)=>{B.current=!1;let H=uD(_,{direction:D,step:G,fallback:q,min:$,max:j});K(String(H)),V?.(H)},[q,j,$,V,G,_]);return F`
        <span class="settings-number-stepper">
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Decrease ${L||"value"}`}
                title=${`Decrease ${L||"value"}`}
                disabled=${Y}
                onClick=${()=>U(-1)}
            >−</button>
            <input
                class="settings-number-input"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                value=${Q}
                disabled=${Y}
                style=${`width:${X}`}
                onInput=${(D)=>{B.current=!0,K(D.target.value)}}
                onBlur=${(D)=>N(D.target.value)}
                onKeyDown=${(D)=>{if(D.key==="Enter")D.preventDefault(),N(D.target.value),D.target.blur()}}
            />
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Increase ${L||"value"}`}
                title=${`Increase ${L||"value"}`}
                disabled=${Y}
                onClick=${()=>U(1)}
            >+</button>
        </span>
    `}var C4=J_(()=>{M0()});function XY(_){let $=String(_||"").trim();if(!$)return"";if($.startsWith("http://")||$.startsWith("https://")||$.startsWith("data:")||$.startsWith("blob:"))return $;if($.startsWith("/workspace/"))return`/workspace/file?path=${encodeURIComponent($.slice(11))}`;if($.startsWith("/"))return"";if(/^[a-zA-Z]:[\\/]/.test($))return"";if($.startsWith("\\\\"))return"";if($.includes("\\"))return"";return`/workspace/file?path=${encodeURIComponent($.replace(/^\.\//,""))}`}function YY({value:_,onChange:$}){let j=g(null),[G,Z]=f(XY(_));u(()=>{Z(XY(_))},[_]);let X=R((Y)=>{let L=Y.target.files?.[0];if(!L)return;let V=new FileReader;V.onload=()=>{let q=V.result;Z(q),$?.(q)},V.readAsDataURL(L)},[$]);return F`
        <div class="settings-avatar-inline" onClick=${()=>j.current?.click()} title="Click to upload">
            ${G?F`<img src=${G} alt="avatar" />`:F`<span class="settings-avatar-placeholder">+</span>`}
            <input type="file" accept="image/*" ref=${j} style="display:none" onChange=${X} />
        </div>
    `}function LY(_={}){return{userName:_.userName||"",userAvatar:_.userAvatar||"",assistantName:_.assistantName||"",assistantAvatar:_.assistantAvatar||"",composeUploadLimitMb:_.composeUploadLimitMb??32,workspaceUploadLimitMb:_.workspaceUploadLimitMb??256}}function t7({settingsData:_,setStatus:$,mergeSettingsData:j}){let[G,Z]=f(""),[X,Y]=f(""),[L,V]=f(""),[q,Q]=f(""),[K,B]=f(32),[N,U]=f(256),[D,H]=f(""),[E,k]=f(!1),[z,O]=f(!1),[I,x]=f(!1),[A,y]=f(()=>W5(!1)),[W,M]=f(!1),T=g(""),J=g(null),C=g(!0);u(()=>{return C.current=!0,()=>{C.current=!1}},[]);let P=R((G0)=>{let $0=LY(G0);Z($0.userName),Y($0.userAvatar),V($0.assistantName),Q($0.assistantAvatar),B($0.composeUploadLimitMb),U($0.workspaceUploadLimitMb),H(G0?.widgetToken||""),T.current=JSON.stringify($0)},[]);u(()=>{P(_||{})},[_,P]),u(()=>{let G0=($0)=>{y(Boolean($0?.detail?.enabled))};return window.addEventListener(I4,G0),()=>window.removeEventListener(I4,G0)},[]);let b=Y0(()=>JSON.stringify(LY({userName:G,userAvatar:X,assistantName:L,assistantAvatar:q,composeUploadLimitMb:K,workspaceUploadLimitMb:N})),[G,X,L,q,K,N]);u(()=>{if(b===T.current)return;if(J.current)clearTimeout(J.current);return J.current=setTimeout(async()=>{if(!C.current)return;let G0=document.activeElement;if(G0&&G0.closest?.(".settings-number-stepper"))return;try{let $0=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:b}),L0=await $0.json().catch(()=>({}));if(!C.current)return;if(!$0.ok||!L0?.ok||!L0?.settings)return;T.current=b,j?.(L0.settings),M(!0),setTimeout(()=>{if(C.current)M(!1)},4000)}catch($0){console.warn("[settings/general] Failed to persist general settings snapshot.",$0)}},800),()=>{if(J.current)clearTimeout(J.current)}},[b,j]);let m=_?.instanceTotp||{configured:!1,issuer:L||"Piclaw",label:G?`${L||"Piclaw"}:${G}`:L||"Piclaw",secret:"",otpauth:"",qrSvg:""},h=R(async()=>{if(!D)return;try{await navigator.clipboard?.writeText(D),O(!0),setTimeout(()=>{if(C.current)O(!1)},3000)}catch(G0){console.warn("[settings/general] Failed to copy widget token.",G0)}},[D]),_0=R(async()=>{if(I)return;if(!confirm("Regenerate the widget token? Existing macOS widgets using the old token will stop updating."))return;x(!0);try{let G0=await fetch("/agent/settings/widget-token/regenerate",{method:"POST"}),$0=await G0.json().catch(()=>({}));if(!G0.ok||!$0?.ok||!$0?.settings)throw Error($0?.error||"Failed to regenerate widget token.");H($0.settings.widgetToken||""),j?.($0.settings),M(!0),setTimeout(()=>{if(C.current)M(!1)},4000)}catch(G0){console.warn("[settings/general] Failed to regenerate widget token.",G0)}finally{if(C.current)x(!1)}},[I,j]),v=typeof window<"u"&&window.isSecureContext,e=D?"•".repeat(Math.min(Math.max(D.length,16),48)):"—",W0=E?D||"—":e;return F`
        <div class="settings-section">
            ${W&&F`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Identity</h3>
            <div class="settings-row">
                <label>User</label>
                <${YY} value=${X} onChange=${Y} />
                <input type="text" value=${G} onInput=${(G0)=>Z(G0.target.value)} placeholder="Your name" />
            </div>
            <div class="settings-row">
                <label>Agent</label>
                <${YY} value=${q} onChange=${Q} />
                <input type="text" value=${L} onInput=${(G0)=>V(G0.target.value)} placeholder="Agent name" />
            </div>

            <h3 style="margin-top:20px">Notifications</h3>
            ${v?F`
                <div class="settings-row">
                    <label>Browser notifications</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="settings-hint" style="margin:0">
                            Use the 🔔 bell button in the compose bar to enable/disable notifications.
                            Web Push requires HTTPS or localhost.
                        </span>
                    </div>
                </div>
            `:F`
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
                    <input type="checkbox" checked=${A}
                        onChange=${()=>{let G0=u6(!A);y(G0)}} />
                    <span class="settings-hint" style="margin:0">CPU/memory/network meters in the status bar. This browser only.</span>
                </div>
            </div>

            <h3 style="margin-top:20px">Instance Configuration</h3>
            <div class="settings-row">
                <label>Compose upload (MB)</label>
                <${v_}
                    label="compose upload limit"
                    value=${K}
                    min=${1}
                    max=${512}
                    fallback=${32}
                    width="80px"
                    onChange=${B}
                />
                <span class="settings-hint" style="margin:0">chat/media attachments</span>
            </div>
            <div class="settings-row">
                <label>Workspace upload (MB)</label>
                <${v_}
                    label="workspace upload limit"
                    value=${N}
                    min=${1}
                    max=${1024}
                    fallback=${256}
                    width="80px"
                    onChange=${U}
                />
                <span class="settings-hint" style="margin:0">defaults to 256 MB; chunked uploads allow up to 1 GB</span>
            </div>

            <h3 style="margin-top:20px">Authentication</h3>
            <div class="settings-row settings-row-vertical settings-widget-token-row">
                <label>Widget bearer token</label>
                <div class="settings-keychain-reveal-panel settings-widget-token-panel">
                    <div class="settings-keychain-reveal-field settings-widget-token-field">
                        <span class="settings-keychain-reveal-label">Token</span>
                        <code class="settings-keychain-reveal-value settings-widget-token-value">${W0}</code>
                        <button class=${`settings-keychain-reveal-btn${E?" active":""}`}
                            type="button"
                            onClick=${()=>k((G0)=>!G0)}
                            disabled=${!D}
                            title=${E?"Hide token":"Reveal token"}>
                            ${E?F`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:F`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                        </button>
                        <button class="settings-keychain-copy-btn" type="button" onClick=${h} disabled=${!D} title="Copy token">
                            ${z?F`<span class="settings-widget-token-copied">Copied</span>`:F`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`}
                        </button>
                        <button class="settings-keychain-prompt-submit settings-widget-token-regenerate" type="button" onClick=${_0} disabled=${I}>${I?"Regenerating…":"Regenerate"}</button>
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
                            ${m.configured?"Current web-login authenticator secret. Scan this QR to add another authenticator device.":"TOTP is not configured for this instance yet, so no setup QR is available."}
                        </div>
                    </div>
                </div>
                ${m.configured?F`
                    <div class="settings-totp-grid">
                        <div class="settings-totp-qr" dangerouslySetInnerHTML=${{__html:m.qrSvg}}></div>
                        <div class="settings-totp-meta">
                            <div class="settings-row settings-row-vertical">
                                <label>Issuer</label>
                                <input type="text" readonly value=${m.issuer||""} />
                            </div>
                            <div class="settings-row settings-row-vertical">
                                <label>Label</label>
                                <input type="text" readonly value=${m.label||""} />
                            </div>
                            <div class="settings-row settings-row-vertical">
                                <label>Secret</label>
                                <input type="text" readonly value=${m.secret||""} />
                            </div>
                        </div>
                    </div>
                `:null}
            </div>
        </div>
    `}var qY=J_(()=>{M0();b6();C4()});var KY={};j1(KY,{SessionsSection:()=>gD});function VY(_={}){return{sessionAutoRotate:_.sessionAutoRotate!==!1,sessionMaxSizeMb:_.sessionMaxSizeMb??16,sessionMaxLines:_.sessionMaxLines??4000,sessionMaxCompactions:_.sessionMaxCompactions??3,sessionIsolation:_.sessionIsolation||"none",toolUseBudget:_.toolUseBudget??64}}function gD({settingsData:_,setStatus:$,mergeSettingsData:j}){let[G,Z]=f(!0),[X,Y]=f(16),[L,V]=f(4000),[q,Q]=f(3),[K,B]=f(64),[N,U]=f("none"),[D,H]=f(!1),E=g(""),k=g(null),z=g(!0);u(()=>{return z.current=!0,()=>{z.current=!1}},[]);let O=R((x)=>{let A=VY(x);Z(A.sessionAutoRotate),Y(A.sessionMaxSizeMb),V(A.sessionMaxLines),Q(A.sessionMaxCompactions),B(A.toolUseBudget),U(A.sessionIsolation),E.current=JSON.stringify(A)},[]);u(()=>{O(_||{})},[_,O]);let I=Y0(()=>JSON.stringify(VY({sessionAutoRotate:G,sessionMaxSizeMb:X,sessionMaxLines:L,sessionMaxCompactions:q,toolUseBudget:K,sessionIsolation:N})),[G,X,L,q,K,N]);return u(()=>{if(I===E.current)return;if(k.current)clearTimeout(k.current);return k.current=setTimeout(async()=>{if(!z.current)return;let x=document.activeElement;if(x&&x.closest?.(".settings-number-stepper"))return;try{let A=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:I}),y=await A.json().catch(()=>({}));if(!z.current)return;if(!A.ok||!y?.ok||!y?.settings)return;E.current=I,j?.(y.settings),H(!0),setTimeout(()=>{if(z.current)H(!1)},4000)}catch(A){console.warn("[settings/sessions] Failed to persist session settings.",A)}},800),()=>{if(k.current)clearTimeout(k.current)}},[I,j]),F`
        <div class="settings-section">
            ${D&&F`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Session Lifecycle</h3>
            <div class="settings-row">
                <label>Auto-rotate sessions</label>
                <input type="checkbox" checked=${G} onChange=${(x)=>Z(x.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Max session size (MB)</label>
                <${v_}
                    label="max session size"
                    value=${X}
                    min=${1}
                    max=${256}
                    fallback=${32}
                    width="80px"
                    onChange=${Y}
                />
            </div>

            <h3 style="margin-top:20px">Agent Behaviour</h3>
            <div class="settings-row">
                <label>Tool use budget</label>
                <${v_}
                    label="tool use budget"
                    value=${K}
                    min=${8}
                    max=${512}
                    fallback=${64}
                    width="80px"
                    onChange=${B}
                />
                <span class="settings-hint" style="margin:0">max tool-call messages per turn</span>
            </div>
            <div class="settings-row">
                <label>Session isolation</label>
                <select value=${N} onChange=${(x)=>U(x.target.value)}>
                    <option value="none">None — full cross-session visibility</option>
                    <option value="summary">Summary — tools visible, no arguments</option>
                    <option value="full">Full — sessions cannot see each other</option>
                </select>
            </div>
        </div>
    `}var QY=J_(()=>{M0();C4()});var NY={};j1(NY,{CompactionSection:()=>vD});function bD(_={}){return{compactionTimeoutSec:_.compactionTimeoutSec??180,compactionBackoffBaseMin:_.compactionBackoffBaseMin??15,compactionBackoffMaxMin:_.compactionBackoffMaxMin??360,compactionThresholdPercent:_.compactionThresholdPercent??75,compactionBackoffDecayFactor:_.compactionBackoffDecayFactor??0.5,progressWatchdogEnabled:Boolean(_.progressWatchdogEnabled??!1),progressWatchdogTimeoutSec:_.progressWatchdogTimeoutSec??120,compactionBackoffs:Array.isArray(_.compactionBackoffs)?_.compactionBackoffs:[],progressWatchdogPhases:Array.isArray(_.progressWatchdogPhases)?_.progressWatchdogPhases:[]}}function e7(_){let $=String(_||"").trim();if(!$)return"—";let j=new Date($);if(Number.isNaN(j.getTime()))return $;return j.toLocaleString()}function vD({settingsData:_,setStatus:$,mergeSettingsData:j}){let[G,Z]=f(180),[X,Y]=f(15),[L,V]=f(360),[q,Q]=f(75),[K,B]=f(0.5),[N,U]=f(!1),[D,H]=f(120),[E,k]=f([]),[z,O]=f([]),[I,x]=f(!1),A=g(""),y=g(null),W=g(!0);u(()=>{return W.current=!0,()=>{W.current=!1}},[]);let M=R((C)=>{let P=bD(C);Z(P.compactionTimeoutSec),Y(P.compactionBackoffBaseMin),V(P.compactionBackoffMaxMin),Q(P.compactionThresholdPercent),B(P.compactionBackoffDecayFactor),U(P.progressWatchdogEnabled),H(P.progressWatchdogTimeoutSec),k(P.compactionBackoffs),O(P.progressWatchdogPhases),A.current=JSON.stringify({compactionTimeoutSec:P.compactionTimeoutSec,compactionBackoffBaseMin:P.compactionBackoffBaseMin,compactionBackoffMaxMin:P.compactionBackoffMaxMin,compactionThresholdPercent:P.compactionThresholdPercent,compactionBackoffDecayFactor:P.compactionBackoffDecayFactor,progressWatchdogEnabled:P.progressWatchdogEnabled,progressWatchdogTimeoutSec:P.progressWatchdogTimeoutSec})},[]);u(()=>{M(_||{})},[_,M]);let T=Y0(()=>JSON.stringify({compactionTimeoutSec:G,compactionBackoffBaseMin:X,compactionBackoffMaxMin:L,compactionThresholdPercent:q,compactionBackoffDecayFactor:K,progressWatchdogEnabled:N,progressWatchdogTimeoutSec:D}),[G,X,L,q,K,N,D]);u(()=>{if(T===A.current)return;if(y.current)clearTimeout(y.current);return y.current=setTimeout(async()=>{if(!W.current)return;let C=document.activeElement;if(C&&C.closest?.(".settings-number-stepper"))return;try{$?.("Saving compaction settings…","info");let P=await fetch("/agent/settings/compaction",{method:"POST",headers:{"Content-Type":"application/json"},body:T}),b=await P.json().catch(()=>({}));if(!W.current)return;if(!P.ok||!b?.ok||!b?.settings){$?.(b?.error||"Failed to save compaction settings.","error");return}A.current=T,j?.(b.settings),M({..._||{},...b.settings||{}}),$?.("Compaction settings saved.","success"),x(!0),setTimeout(()=>{if(W.current)x(!1),$?.(null)},4000)}catch(P){if(console.warn("[settings/compaction] Failed to persist compaction settings.",P),W.current)$?.("Failed to save compaction settings.","error")}},800),()=>{if(y.current)clearTimeout(y.current)}},[T,j,$,M,_]);let J=R(async(C)=>{try{$?.(`Clearing compaction suppression for ${C}…`,"info");let P=await fetch("/agent/settings/compaction/reset-backoff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatJid:C})}),b=await P.json().catch(()=>({}));if(!P.ok||!b?.ok||!b?.settings){$?.(b?.error||"Failed to clear compaction suppression.","error");return}j?.(b.settings),M({..._||{},...b.settings||{}}),$?.(`Cleared compaction suppression for ${C}.`,"success")}catch(P){console.warn("[settings/compaction] Failed to clear compaction suppression.",P),$?.("Failed to clear compaction suppression.","error")}},[M,j,$,_]);return F`
        <div class="settings-section">
            ${I&&F`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Compaction settings applied. Existing turns keep their current timers; new turns use the updated values.
                </div>
            `}

            <h3>Automatic compaction</h3>
            <div class="settings-row">
                <label>Compaction threshold (%)</label>
                <${v_}
                    label="compaction threshold"
                    value=${q}
                    min=${10}
                    max=${95}
                    fallback=${75}
                    width="80px"
                    onChange=${Q}
                />
                <span class="settings-hint" style="margin:0">auto-compact when context exceeds this % of window</span>
            </div>
            <div class="settings-row">
                <label>Compaction timeout (sec)</label>
                <${v_}
                    label="compaction timeout"
                    value=${G}
                    min=${1}
                    max=${3600}
                    fallback=${180}
                    width="90px"
                    onChange=${Z}
                />
                <span class="settings-hint" style="margin:0">Abort a stuck pre-prompt/manual compaction instead of hanging forever.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff base (min)</label>
                <${v_}
                    label="compaction backoff base"
                    value=${X}
                    min=${1}
                    max=${1440}
                    fallback=${15}
                    width="90px"
                    onChange=${Y}
                />
                <span class="settings-hint" style="margin:0">First suppression window after a compaction failure.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff max (min)</label>
                <${v_}
                    label="compaction backoff max"
                    value=${L}
                    min=${1}
                    max=${10080}
                    fallback=${360}
                    width="90px"
                    onChange=${V}
                />
                <span class="settings-hint" style="margin:0">Upper bound for exponential suppression after repeated failures.</span>
            </div>

            <div class="settings-row">
                <label>Backoff decay factor</label>
                <${v_}
                    label="backoff decay factor"
                    value=${Math.round(K*100)}
                    min=${10}
                    max=${100}
                    fallback=${50}
                    width="80px"
                    onChange=${(C)=>B(C/100)}
                />
                <span class="settings-hint" style="margin:0">% — halves backoff after each successful compaction</span>
            </div>

            <h3 style="margin-top:20px">Stall watchdog</h3>
            <div class="settings-row">
                <label>Enable watchdog</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${N} onChange=${(C)=>U(Boolean(C.target.checked))} />
                    <span class="settings-hint" style="margin:0">Disabled by default. When enabled, a helper process terminates the runtime if an active phase stops heartbeating.</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Watchdog timeout (sec)</label>
                <${v_}
                    label="watchdog timeout"
                    value=${D}
                    min=${0}
                    max=${3600}
                    fallback=${120}
                    width="90px"
                    disabled=${!N}
                    onChange=${H}
                />
                <span class="settings-hint" style="margin:0">How long an active phase can go without a heartbeat before the watchdog kills the runtime.</span>
            </div>

            <h3 style="margin-top:20px">Active compaction suppressions</h3>
            ${E.length===0?F`
                <p class="settings-hint">No chats are currently under compaction backoff.</p>
            `:F`
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
                            ${E.map((C)=>F`
                                <tr>
                                    <td><code>${C.chatJid}</code></td>
                                    <td>${C.failureCount}</td>
                                    <td>${e7(C.backoffUntil)}</td>
                                    <td title=${C.lastErrorMessage||""}>${C.lastErrorMessage||"—"}</td>
                                    <td>
                                        <button class="settings-secondary-btn" onClick=${()=>J(C.chatJid)}>
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
            ${z.length===0?F`
                <p class="settings-hint">No active tracked phases right now.</p>
            `:F`
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
                            ${z.map((C)=>F`
                                <tr>
                                    <td><code>${C.chatJid}</code></td>
                                    <td>${C.phase}</td>
                                    <td>${e7(C.startedAt)}</td>
                                    <td>${e7(C.lastProgressAt)}</td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `}var BY=J_(()=>{M0();C4()});function UY(_){let $=String(_||"").trim().toLowerCase();if(!$)return null;let j=lD[$]||$;if(/^f(?:[1-9]|1[0-2])$/.test(j))return j;if(hD.has(j))return j;if(j.length===1)return j;if(/^[a-z0-9]+$/.test(j))return j;return null}function z2(_){let $=String(_||"").trim();if(!$)return null;let j=$.split("+").map((X)=>X.trim()).filter(Boolean);if(!j.length)return null;let G={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let X of j){let Y=X.toLowerCase(),L=cD[Y];if(L){G[L]=!0;continue}if(G.key)return null;let V=UY(X);if(!V||V==="escape")return null;G.key=V}if(!G.key)return null;let Z=[];if(G.ctrl)Z.push("ctrl");if(G.meta)Z.push("meta");if(G.alt)Z.push("alt");if(G.shift)Z.push("shift");return Z.push(G.key),Z.join("+")}function EY(_){return String(_||"").split(/[\n,]/).map(($)=>z2($)).filter(($)=>Boolean($))}function o$(_){return _.join(", ")}function $9(){let _=U6(FY);if(!_||typeof _!=="object")return{};let $={};for(let j of i$){let G=_[j.id];if(!Array.isArray(G))continue;let Z=G.map((X)=>z2(String(X||""))).filter((X)=>Boolean(X));$[j.id]=[...new Set(Z)]}return $}function _9(_){if(V_(FY,JSON.stringify(_)),typeof window<"u")window.dispatchEvent(new CustomEvent("piclaw:keyboard-shortcuts-changed",{detail:{config:_}}))}function HY(_){return mD.get(_)}function O5(_){let $=$9()[_];if(Array.isArray($))return $;return[...HY(_).defaultBindings]}function DY(_,$){let j=$9(),G=HY(_).defaultBindings,Z=[...new Set($.map((X)=>z2(X)).filter((X)=>Boolean(X)))];if(Z.length===G.length&&Z.every((X,Y)=>X===G[Y]))delete j[_];else j[_]=Z;_9(j)}function j9(_){if(!_){_9({});return}let $=$9();delete $[_],_9($)}function v6(){let _={};for(let $ of i$)_[$.id]=O5($.id);return _}function nD(_){let $=typeof _==="string"?_:"";if(!$)return"";if($.length===1)return $.toLowerCase();return UY($)||$.toLowerCase()}function rD(_){let $=z2(_);if(!$)return null;let j={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let G of $.split("+")){if(G==="ctrl"||G==="meta"||G==="alt"||G==="shift"){j[G]=!0;continue}j.key=G}return j.key?j:null}function pD(_,$){let j=rD($);if(!j)return!1;if(nD(_?.key)!==j.key)return!1;let Z=!j.shift&&j.key.length===1&&/[^a-z0-9]/i.test(j.key);return Boolean(_?.ctrlKey)===j.ctrl&&Boolean(_?.metaKey)===j.meta&&Boolean(_?.altKey)===j.alt&&(Z||Boolean(_?.shiftKey)===j.shift)}function z$(_,$){return O5($).some((j)=>pD(_,j))}var FY="piclaw_keyboard_shortcuts_v1",i$,mD,cD,lD,hD;var m6=J_(()=>{i$=[{id:"openHelp",label:"Open keyboard help",description:"Open Settings → Keyboard. Default: question mark and quote when focus is outside compose and other editable fields.",defaultBindings:["?",'"']},{id:"openSettings",label:"Open settings",description:"Open the settings dialog.",defaultBindings:["ctrl+,","meta+,","alt+,"]},{id:"previousChat",label:"Previous session",description:"Switch to the previous visible chat/session.",defaultBindings:["["]},{id:"nextChat",label:"Next session",description:"Switch to the next visible chat/session.",defaultBindings:["]"]},{id:"toggleDock",label:"Toggle dock",description:"Show or hide the bottom dock panes.",defaultBindings:["ctrl+`"]},{id:"toggleZenMode",label:"Toggle zen mode",description:"Collapse surrounding chrome for a focused chat view.",defaultBindings:["ctrl+shift+z","meta+shift+z"]}],mD=new Map(i$.map((_)=>[_.id,_])),cD={cmd:"meta",command:"meta",meta:"meta",super:"meta",ctrl:"ctrl",control:"ctrl",alt:"alt",option:"alt",shift:"shift"},lD={esc:"escape",return:"enter",spacebar:"space"},hD=new Set(["tab","enter","space","backspace","delete","insert","clear","home","end","pageup","pagedown","up","down","left","right"])});var WY={};j1(WY,{KeyboardSection:()=>iD});function dD(_,$,j){let G=String(_||"").trim().toLowerCase();if(!G)return!0;return[$.label,$.description,j,...$.defaultBindings||[]].some((Z)=>String(Z||"").toLowerCase().includes(G))}function iD({filter:_="",setStatus:$}){let[j,G]=f(()=>{let V=v6();return Object.fromEntries(Object.entries(V).map(([q,Q])=>[q,o$(Q)]))});u(()=>{let V=()=>{let q=v6();G(Object.fromEntries(Object.entries(q).map(([Q,K])=>[Q,o$(K)])))};return window.addEventListener("piclaw:keyboard-shortcuts-changed",V),()=>window.removeEventListener("piclaw:keyboard-shortcuts-changed",V)},[]);let Z=Y0(()=>i$.filter((V)=>{let q=String(j[V.id]||"");return dD(_,V,q)}),[j,_]),X=(V)=>{let q=String(j[V]||"").trim(),K=(q?q.split(/[\n,]/).map((N)=>N.trim()).filter(Boolean):[]).filter((N)=>!z2(N));if(K.length>0){$?.(`Invalid shortcut: ${K[0]}. Escape is reserved and cannot be rebound.`,"error");return}let B=EY(q);DY(V,B),G((N)=>({...N,[V]:o$(O5(V))})),$?.("Keyboard shortcuts saved.","success")},Y=(V)=>{j9(V),G((q)=>({...q,[V]:o$(O5(V))})),$?.("Keyboard shortcut reset to default.","success")};return F`
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
                <button class="settings-addon-btn" style="min-width:180px; height:40px; font-size:14px;" onClick=${()=>{j9();let V=v6();G(Object.fromEntries(Object.entries(V).map(([q,Q])=>[q,o$(Q)]))),$?.("Keyboard shortcuts reset to defaults.","success")}}>Reset all to defaults</button>
            </div>

            <div class="settings-shortcut-list" style="display:grid; gap:16px;">
                ${Z.map((V)=>F`
                    <div class="settings-shortcut-card" key=${V.id} style="display:grid; grid-template-columns:minmax(240px, 1.25fr) minmax(320px, 1fr); gap:18px; align-items:start; padding:18px 20px; border:1px solid var(--border-color, rgba(120,120,120,.22)); border-radius:16px; background:var(--panel-bg, rgba(255,255,255,.04));">
                        <div class="settings-shortcut-copy" style="min-width:0;">
                            <div class="settings-shortcut-title" style="font-size:17px; font-weight:700; line-height:1.3;">${V.label}</div>
                            <div class="settings-hint" style="margin:6px 0 0 0; font-size:14px; line-height:1.5;">${V.description}</div>
                            <div class="settings-shortcut-default" style="margin-top:10px; font-size:13px; color:var(--text-secondary);">Default: <code style="font-size:13px;">${o$(V.defaultBindings)}</code></div>
                        </div>
                        <div class="settings-shortcut-controls" style="display:grid; gap:10px; min-width:0;">
                            <input
                                type="text"
                                value=${j[V.id]||""}
                                placeholder=${o$(V.defaultBindings)}
                                onInput=${(q)=>G((Q)=>({...Q,[V.id]:q.target.value}))}
                                style="width:100%; min-height:46px; padding:10px 14px; font-size:16px; line-height:1.35; font-family:var(--font-mono, ui-monospace, monospace); border-radius:12px;"
                            />
                            <div class="settings-shortcut-actions" style="display:flex; justify-content:flex-end; align-items:center; gap:10px; flex-wrap:wrap;">
                                <button class="settings-addon-btn settings-addon-btn-install" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>X(V.id)}>Save</button>
                                <button class="settings-addon-btn" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>Y(V.id)}>Default</button>
                            </div>
                        </div>
                    </div>
                `)}
                ${Z.length===0&&F`<div class="settings-hint">No shortcuts match this filter.</div>`}
            </div>
        </div>
    `}var OY=J_(()=>{M0();m6()});function zY(_,$=G9){let j=Number(_);if(!Number.isFinite(j))return $;return Math.min(300,Math.max(15,Math.round(j)))}function JY(_,$=Z9){let j=Number(_);if(!Number.isFinite(j))return $;return Math.min(8,Math.max(0,Math.round(j)))}function J2(){return{refreshIntervalSec:zY(W4(l6,G9),G9),folderPreviewDepth:JY(W4(h6,Z9),Z9)}}function AY(_={}){let $=J2(),j={refreshIntervalSec:zY(Object.prototype.hasOwnProperty.call(_,"refreshIntervalSec")?_.refreshIntervalSec:$.refreshIntervalSec,$.refreshIntervalSec),folderPreviewDepth:JY(Object.prototype.hasOwnProperty.call(_,"folderPreviewDepth")?_.folderPreviewDepth:$.folderPreviewDepth,$.folderPreviewDepth)};if(V_(l6,String(j.refreshIntervalSec)),V_(h6,String(j.folderPreviewDepth)),typeof window<"u")window.dispatchEvent(new CustomEvent(c6,{detail:{settings:j}}));return j}var c6="piclaw:workspace-client-settings-updated",l6="workspaceRefreshIntervalSec",h6="workspaceFolderPreviewDepth",G9=60,Z9=3;var X9=()=>{};var yY={};j1(yY,{WorkspaceSection:()=>oD});function kY(_={}){let $=_.workspaceSettings||{};return{webTerminalEnabled:$.webTerminalEnabled!==!1,vncAllowDirect:$.vncAllowDirect!==!1,treeMaxDepth:$.treeMaxDepth??4,treeMaxEntries:$.treeMaxEntries??5000}}function oD({settingsData:_,setStatus:$,mergeSettingsData:j}){let[G,Z]=f(!0),[X,Y]=f(!0),[L,V]=f(4),[q,Q]=f(5000),[K,B]=f(60),[N,U]=f(3),[D,H]=f(!1),[E,k]=f(!1),z=g(""),O=g(null),I=g(null),x=g(null),A=g(!0);u(()=>{return A.current=!0,()=>{if(A.current=!1,O.current)clearTimeout(O.current);if(I.current)clearTimeout(I.current);if(x.current)clearTimeout(x.current)}},[]);let y=R((T)=>{let J=kY(T),C=J2();Z(J.webTerminalEnabled),Y(J.vncAllowDirect),V(J.treeMaxDepth),Q(J.treeMaxEntries),B(C.refreshIntervalSec),U(C.folderPreviewDepth),z.current=JSON.stringify(J)},[]);u(()=>{y(_||{})},[_,y]);let W=Y0(()=>JSON.stringify(kY({workspaceSettings:{webTerminalEnabled:G,vncAllowDirect:X,treeMaxDepth:L,treeMaxEntries:q}})),[G,X,L,q]);u(()=>{if(W===z.current)return;if(O.current)clearTimeout(O.current);return O.current=setTimeout(async()=>{if(!A.current)return;let T=document.activeElement;if(T&&T.closest?.(".settings-number-stepper"))return;try{let J=await F7(JSON.parse(W));if(!A.current||!J?.ok||!J?.settings)return;if(z.current=W,j?.({workspaceSettings:J.settings}),$?.(null),H(!0),I.current)clearTimeout(I.current);I.current=setTimeout(()=>{if(A.current)H(!1)},4000)}catch(J){$?.(String(J?.message||J),"error")}},800),()=>{if(O.current)clearTimeout(O.current)}},[W,j,$]);let M=R((T)=>{let J=AY(T);if(B(J.refreshIntervalSec),U(J.folderPreviewDepth),k(!0),x.current)clearTimeout(x.current);x.current=setTimeout(()=>{if(A.current)k(!1)},3000)},[]);return F`
        <div class="settings-section">
            ${D&&F`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Workspace settings applied. Server-side limits affect new workspace requests immediately.
                </div>
            `}
            ${E&&F`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Browser workspace settings applied immediately in this tab.
                </div>
            `}

            <h3>Access</h3>
            <div class="settings-row">
                <label>Enable web terminal</label>
                <input type="checkbox" checked=${G} onChange=${(T)=>Z(T.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Allow direct VNC targets</label>
                <input type="checkbox" checked=${X} onChange=${(T)=>Y(T.target.checked)} />
            </div>
            <p class="settings-hint">Terminal access updates immediately. Direct VNC target policy applies to new VNC requests.</p>

            <h3 style="margin-top:20px">Server scan guardrails</h3>
            <div class="settings-row">
                <label>Max tree depth</label>
                <${v_}
                    label="workspace tree max depth"
                    value=${L}
                    min=${1}
                    max=${8}
                    fallback=${4}
                    width="80px"
                    onChange=${V}
                />
                <span class="settings-hint" style="margin:0">caps all <code>/workspace/tree</code> requests</span>
            </div>
            <div class="settings-row">
                <label>Max entries per scan</label>
                <${v_}
                    label="workspace tree max entries"
                    value=${q}
                    min=${250}
                    max=${5000}
                    step=${250}
                    fallback=${5000}
                    width="92px"
                    onChange=${Q}
                />
                <span class="settings-hint" style="margin:0">truncate oversized tree walks earlier</span>
            </div>

            <h3 style="margin-top:20px">This browser</h3>
            <div class="settings-row">
                <label>Refresh interval (seconds)</label>
                <${v_}
                    label="workspace refresh interval"
                    value=${K}
                    min=${15}
                    max=${300}
                    step=${15}
                    fallback=${60}
                    width="92px"
                    onChange=${(T)=>M({refreshIntervalSec:T})}
                />
            </div>
            <div class="settings-row">
                <label>Folder preview scan depth</label>
                <${v_}
                    label="folder preview scan depth"
                    value=${N}
                    min=${0}
                    max=${8}
                    fallback=${3}
                    width="80px"
                    onChange=${(T)=>M({folderPreviewDepth:T})}
                />
                <span class="settings-hint" style="margin:0">set to <code>0</code> to disable folder size preview scans</span>
            </div>
            <p class="settings-hint">Root and folder-expansion tree loads remain shallow; the folder size preview is the deepest workspace scan in the UI.</p>
        </div>
    `}var MY=J_(()=>{M0();I_();X9();C4()});var wY={};j1(wY,{EnvironmentSection:()=>sD});function Y9(_={}){let $=_.environmentSettings||_.settings||_.environment||{};return{variables:Array.isArray($.variables)?$.variables:[],overrides:$.overrides&&typeof $.overrides==="object"?$.overrides:{},count:Number($.count||0),overrideCount:Number($.overrideCount||0),keychainEnvNames:Array.isArray($.keychainEnvNames)?$.keychainEnvNames:[]}}function sD({settingsData:_,filter:$="",setStatus:j,mergeSettingsData:G}){let[Z,X]=f(()=>Y9(_||{})),[Y,L]=f({}),[V,q]=f(""),[Q,K]=f(""),[B,N]=f(null);u(()=>{X(Y9(_||{})),L({})},[_]);let U=R((O)=>{let I=Y9({environmentSettings:O?.settings||O});return X(I),G?.({environmentSettings:I}),L({}),I},[G]),D=R(async()=>{try{let O=await U7();if(O?.ok)U(O.settings);j?.("Environment refreshed.","info")}catch(O){j?.(String(O?.message||O),"error")}},[U,j]),H=R(async(O,I)=>{let x=String(O||"").trim();if(!x)return;N(x);try{let A=await y6({action:"set",name:x,value:String(I??"")});if(A?.ok)U(A.settings);if(j?.(`Saved environment override for ${x}.`,"info"),x===V.trim())q(""),K("")}catch(A){j?.(String(A?.message||A),"error")}finally{N(null)}},[U,V,j]),E=R(async(O)=>{let I=String(O||"").trim();if(!I)return;N(I);try{let x=await y6({action:"clear",name:I});if(x?.ok)U(x.settings);j?.(`Cleared environment override for ${I}.`,"info")}catch(x){j?.(String(x?.message||x),"error")}finally{N(null)}},[U,j]),k=Y0(()=>{let O=String($||"").trim().toLowerCase(),I=Array.isArray(Z.variables)?Z.variables:[];if(!O)return I;return I.filter((x)=>{return`${x?.name||""} ${x?.value||""} ${x?.source||""}`.toLowerCase().includes(O)})},[Z.variables,$]),z=R((O,I)=>{L((x)=>({...x||{},[O]:I}))},[]);return F`
        <div class="settings-section">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:12px;">
                <div>
                    <h3 style="margin-top:0">Environment</h3>
                    <p class="settings-hint" style="margin-top:4px">
                        Showing non-keychain environment variables only. Overrides are stored in extension KV and applied to <code>process.env</code>, so subsequent tool calls inherit them.
                    </p>
                </div>
                <button type="button" class="settings-secondary-btn" onClick=${D}>Refresh</button>
            </div>

            <div class="settings-row" style="align-items:flex-start; gap:10px;">
                <label>Add override</label>
                <div style="display:grid; grid-template-columns:minmax(180px, 0.7fr) minmax(240px, 1fr) auto; gap:8px; flex:1;">
                    <input
                        type="text"
                        value=${V}
                        placeholder="VARIABLE_NAME"
                        spellcheck="false"
                        onInput=${(O)=>q(O.target.value)}
                    />
                    <input
                        type="text"
                        value=${Q}
                        placeholder="value"
                        spellcheck="false"
                        onInput=${(O)=>K(O.target.value)}
                    />
                    <button
                        type="button"
                        disabled=${!V.trim()||B===V.trim()}
                        onClick=${()=>H(V,Q)}
                    >Save</button>
                </div>
            </div>

            <p class="settings-hint">
                ${Z.count} variables visible • ${Z.overrideCount} overrides active • ${Z.keychainEnvNames.length} keychain-injected variables hidden
            </p>

            <div class="settings-tool-list" style="max-height:58vh; overflow:auto;">
                ${k.map((O)=>{let I=String(O?.name||""),x=Object.prototype.hasOwnProperty.call(Y,I)?Y[I]:O.value,A=x!==O.value,y=B===I;return F`
                        <div class="settings-tool-row" key=${I} style="grid-template-columns:minmax(180px,0.45fr) minmax(240px,1fr) auto auto; align-items:center;">
                            <span class="settings-tool-name" title=${I}>${I}</span>
                            <input
                                type="text"
                                value=${x}
                                spellcheck="false"
                                onInput=${(W)=>z(I,W.target.value)}
                                style="min-width:0; width:100%; font-family:var(--font-mono, monospace);"
                            />
                            <span class="settings-tool-kind" title=${O.overridden?"Overridden in KV":"Inherited from process environment"}>
                                ${O.overridden?"override":"process"}
                            </span>
                            <span style="display:flex; gap:6px; justify-content:flex-end;">
                                <button type="button" disabled=${y||!A} onClick=${()=>H(I,x)}>Save</button>
                                <button type="button" disabled=${y||!O.overridden} onClick=${()=>E(I)}>Clear</button>
                            </span>
                        </div>
                    `})}
                ${k.length===0&&F`<p class="settings-hint">No environment variables match "${$}".</p>`}
            </div>
        </div>
    `}var TY=J_(()=>{M0();I_()});var xY={};j1(xY,{ProvidersSection:()=>tD});function aD(_){switch(_){case"oauth":return"OAuth";case"api_key":return"API key";case"custom":return"Configured";default:return"Configured"}}function tD({providers:_,setStatus:$}){let[j,G]=f(null),[Z,X]=f(null),[Y,L]=f({}),V=R((H,E)=>{L((k)=>({...k,[H]:E}))},[]),q=R(async(H)=>{let E=(Y.apiKey||"").trim();if(!E){$?.("API key cannot be empty.","error");return}G(H),$?.(`Configuring ${H}…`,"info");try{let k=JSON.stringify({provider:H,method:"api_key",api_key:E}),z=await z1("default",`/login __step2 ${k}`,null,[]);if(z?.command?.status==="error"){$?.(z.command.message,"error");return}$?.(z?.command?.message||`${H} configured.`,"success"),X(null),L({})}catch(k){$?.(String(k.message||k),"error")}finally{G(null)}},[Y,$]),Q=R(async(H,E)=>{G(H),$?.(`Configuring ${H}…`,"info");try{let k={provider:H,method:"custom"};for(let I of E.customFields||[])k[I.key]=(Y[I.key]||"").trim();let z=JSON.stringify(k),O=await z1("default",`/login __step2 ${z}`,null,[]);if(O?.command?.status==="error"){$?.(O.command.message,"error");return}$?.(O?.command?.message||`${H} configured.`,"success"),X(null),L({})}catch(k){$?.(String(k.message||k),"error")}finally{G(null)}},[Y,$]),K=R(async(H)=>{G(H),$?.(`Starting OAuth for ${H}…`,"info");try{let E=JSON.stringify({provider:H}),z=(await z1("default",`/login __step1 ${E}`,null,[]))?.command?.message||"";if(z.includes("http")){let O=z.match(/(https?:\/\/[^\s)]+)/);if(O)window.open(O[1],"_blank","noopener"),$?.("OAuth window opened. Complete the sign-in flow, then close this message.","success");else $?.(z,"success")}else $?.(z||`OAuth flow started for ${H}. Check the chat.`,"success")}catch(E){$?.(String(E.message||E),"error")}finally{G(null)}},[$]),B=R(async(H)=>{if(j)return;G(H),$?.(`Logging out ${H}…`,"info");try{await z1("default",`/logout ${H}`,null,[]),$?.(`Logged out ${H}. Restart may be needed.`,"success")}catch(E){$?.(String(E.message||E),"error")}finally{G(null)}},[j,$]),N=_||[],U=(H)=>Z===H,D=(H)=>{X((E)=>E===H?null:H),L({})};return F`
        <div class="settings-section">
            <h3>Providers</h3>
            <div class="settings-provider-list">
                ${N.map((H)=>F`
                    <div class=${`settings-provider-card${H.configured?" configured":""}`}>
                        <div class="settings-provider-card-header" onClick=${()=>!H.configured&&D(H.id)}>
                            <div class="settings-provider-card-title">
                                <strong>${H.name}</strong>
                                <span class="settings-provider-id">${H.id}</span>
                                ${H.configured&&F`<span class="settings-tag settings-tag-skill">${aD(H.authType)}</span>`}
                            </div>
                            <div class="settings-provider-card-meta">
                                ${H.hasOAuth&&F`<span class="settings-tag">OAuth</span>`}
                                ${H.hasApiKey&&F`<span class="settings-tag">API Key</span>`}
                                ${H.isCustom&&F`<span class="settings-tag">Custom</span>`}
                            </div>
                            <div class="settings-provider-card-actions">
                                ${H.configured?F`
                                    <button class="settings-addon-btn settings-addon-btn-remove"
                                        disabled=${j===H.id} onClick=${(E)=>{E.stopPropagation(),B(H.id)}}
                                    >${j===H.id?"…":"Logout"}</button>
                                    <button class="settings-addon-btn"
                                        disabled=${j===H.id} onClick=${(E)=>{E.stopPropagation(),D(H.id)}}
                                    >Reconfigure</button>
                                `:F`
                                    <button class="settings-addon-btn settings-addon-btn-install"
                                        disabled=${j===H.id} onClick=${(E)=>{E.stopPropagation(),D(H.id)}}
                                    >Set up</button>
                                `}
                            </div>
                        </div>

                        ${U(H.id)&&F`
                            <div class="settings-provider-setup">
                                <p class="settings-hint settings-provider-setup-hint">Sign-in flows open in the browser. In narrow panes the setup form stacks vertically to avoid clipping.</p>
                                ${H.hasOAuth&&F`
                                    <div class="settings-provider-method">
                                        <button class="settings-addon-btn settings-addon-btn-install"
                                            disabled=${j===H.id}
                                            onClick=${()=>K(H.id)}>
                                            ${j===H.id?"Starting…":"Sign in with OAuth"}
                                        </button>
                                    </div>
                                `}
                                ${H.hasApiKey&&F`
                                    <div class="settings-provider-method">
                                        <div class="settings-provider-field-row">
                                            <label>API Key</label>
                                            <input type="password" value=${Y.apiKey||""}
                                                onInput=${(E)=>V("apiKey",E.target.value)}
                                                placeholder=${H.apiKeyHint||"Enter API key"} />
                                            <button class="settings-addon-btn settings-addon-btn-install"
                                                disabled=${j===H.id||!(Y.apiKey||"").trim()}
                                                onClick=${()=>q(H.id)}>
                                                ${j===H.id?"…":"Save"}
                                            </button>
                                        </div>
                                    </div>
                                `}
                                ${H.isCustom&&F`
                                    <div class="settings-provider-method">
                                        ${(H.customFields||[]).map((E)=>F`
                                            <div class="settings-provider-field-row">
                                                <label>${E.label}${E.required?" *":""}</label>
                                                <input type="text" value=${Y[E.key]||""}
                                                    onInput=${(k)=>V(E.key,k.target.value)}
                                                    placeholder=${E.placeholder||""} />
                                            </div>
                                        `)}
                                        <div class="settings-provider-form-actions">
                                            <button class="settings-addon-btn settings-addon-btn-install"
                                                disabled=${j===H.id}
                                                onClick=${()=>Q(H.id,H)}>
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
    `}var IY=J_(()=>{M0();I_()});var CY={};j1(CY,{ModelsSection:()=>GW});function $W(_){return typeof _==="string"&&_.toLowerCase()==="anthropic"}function jW({thinkingLevel:_,supportsThinking:$,provider:j,availableLevels:G,onSetLevel:Z,disabled:X}){let Y=$W(j)?eD:_W,L=G&&G.length>1?G:["off","minimal","low","medium","high"],V=Math.max(0,L.indexOf(_??"off"));if(!$)return F`<div class="settings-thinking-slider"><label>Thinking level</label><p class="settings-hint" style="margin:4px 0 0">Current model does not support thinking.</p></div>`;return F`
        <div class="settings-thinking-slider">
            <label>Thinking level: <strong>${Y[L[V]]||L[V]}</strong></label>
            <div class="settings-slider-track">
                <input type="range" min="0" max=${L.length-1} step="1" value=${V} disabled=${X}
                    onInput=${(q)=>Z(L[parseInt(q.target.value,10)])} />
                <div class="settings-slider-labels">
                    ${L.map((q,Q)=>F`<span class=${Q===V?"active":""} onClick=${()=>!X&&Z(q)}>${Y[q]||q}</span>`)}
                </div>
            </div>
        </div>
    `}function GW({filter:_=""}){let[$,j]=f(null),[G,Z]=f(!1),[X,Y]=f("off"),[L,V]=f(!1),[q,Q]=f(["off"]),[K,B]=f(!1),N=R(async()=>{let x=await w4();if(j(x),x.thinking_level)Y(x.thinking_level);if(V(Boolean(x.supports_thinking)),Array.isArray(x.available_thinking_levels)&&x.available_thinking_levels.length>0)Q(x.available_thinking_levels);return x},[]);u(()=>{N().catch(()=>j({models:[],model_options:[]}))},[]);let U=R(async(x)=>{if(G)return;Z(!0);try{await z1("default",`/model ${x}`,null,[]),await N()}catch(A){console.error("Failed to switch model:",A)}finally{Z(!1)}},[G,N]),D=R(async(x)=>{if(K)return;B(!0),Y(x);try{let A=await z1("default",`/thinking ${x}`,null,[]);if(A?.command?.thinking_level)Y(A.command.thinking_level);V(A?.command?.supports_thinking!==!1),await N()}catch(A){console.error("Failed to set thinking:",A),await N().catch((y)=>{})}finally{B(!1)}},[K,N]);if(!$)return F`<div class="settings-loading">Loading models\u2026</div>`;let H=$.model_options||[],E=$.current,z=H.find((x)=>x.label===E)?.provider||"",O=_.toLowerCase(),I=O?H.filter((x)=>x.label.toLowerCase().includes(O)||(x.provider||"").toLowerCase().includes(O)):H;return F`
        <div class="settings-models-split">
            <div class="settings-models-summary settings-hint">Model and provider names may wrap in narrow panes to avoid clipping.</div>
            <div class="settings-models-list">
                <table class="settings-table settings-borderless settings-models-table">
                    <thead><tr><th style="width:32px"></th><th>Model</th><th>Provider</th><th>Context</th><th style="text-align:center">Reasoning</th></tr></thead>
                    <tbody>
                        ${I.map((x)=>F`
                            <tr class=${x.label===E?"settings-row-active":""}>
                                <td><input type="radio" name="settings-model" checked=${x.label===E} disabled=${G} onChange=${()=>U(x.label)} /></td>
                                <td>${x.name||x.label}</td><td>${x.provider}</td>
                                <td>${x.context_window?(x.context_window/1000).toFixed(0)+"K":"—"}</td>
                                <td style="text-align:center">${x.reasoning?"\uD83E\uDDE0":"—"}</td>
                            </tr>
                        `)}
                        ${I.length===0&&F`<tr><td colspan="5" class="settings-empty">No models match "${_}"</td></tr>`}
                    </tbody>
                </table>
            </div>
            <div class="settings-models-footer">
                <${jW}
                    thinkingLevel=${X}
                    supportsThinking=${L}
                    provider=${z}
                    availableLevels=${q}
                    onSetLevel=${D}
                    disabled=${K||G} />
            </div>
        </div>
    `}var eD,_W;var fY=J_(()=>{M0();I_();eD={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"max"},_W={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"xhigh"}});var RY={};j1(RY,{ThemeSection:()=>ZW});function PY(_={}){return{uiTheme:typeof _.uiTheme==="string"&&_.uiTheme.trim()?_.uiTheme.trim():"default",uiTint:typeof _.uiTint==="string"&&_.uiTint.trim()?_.uiTint.trim():""}}function ZW({themes:_,colorKeys:$,settingsData:j,setStatus:G,mergeSettingsData:Z}){let[X,Y]=f("default"),[L,V]=f(""),[q,Q]=f(!1),K=g(""),B=g(null),N=g(!0);u(()=>{return N.current=!0,()=>{N.current=!1}},[]);let U=R((z)=>{let O=PY(z);Y(O.uiTheme),V(O.uiTint),K.current=JSON.stringify(O)},[]);u(()=>{if(j){U(j);return}U({uiTheme:document.documentElement.dataset.colorTheme||"default",uiTint:document.documentElement.dataset.tint||""})},[j,U]);let D=R((z,O)=>{F2({theme:z,tint:O||null}),Y(z||"default"),V(O||"")},[]),H=Y0(()=>JSON.stringify(PY({uiTheme:X,uiTint:L})),[X,L]);u(()=>{if(H===K.current)return;if(B.current)clearTimeout(B.current);return B.current=setTimeout(async()=>{if(!N.current)return;Q(!0);try{let z=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:H}),O=await z.json().catch(()=>({}));if(!N.current)return;if(!z.ok||!O?.ok||!O?.settings){G?.(O?.error||"Failed to save appearance settings.","error");return}K.current=H,Z?.(O.settings),G?.("Appearance synced across clients.","success")}catch(z){if(!N.current)return;console.warn("[settings/appearance] Failed to persist appearance settings.",z),G?.("Failed to save appearance settings.","error")}finally{if(N.current)Q(!1)}},250),()=>{if(B.current)clearTimeout(B.current)}},[H,Z,G]);let E=$||[],k=_||[];return F`
        <div class="settings-section">
            ${q&&F`<div class="settings-hint" style="margin:0 0 12px 0;">Syncing appearance…</div>`}
            <div class="settings-tint-row">
                <label class="settings-tint-label">
                    <input type="radio" name="settings-theme"
                        checked=${X==="default"}
                        onChange=${()=>D("default",L)} />
                    <strong>Default</strong>
                    <span class="settings-hint" style="margin:0 0 0 6px">auto (light/dark)</span>
                </label>
                <div class="settings-tint-picker">
                    <label class="settings-hint" style="margin:0">Tint:</label>
                    <input type="color"
                        value=${L||"#1d9bf0"}
                        onInput=${(z)=>{let O=z.target.value;if(V(O),X==="default")F2({theme:"default",tint:O})}} />
                    ${L&&F`
                        <button class="settings-tint-clear" onClick=${()=>D("default","")}
                            title="Clear tint">\u2715</button>
                    `}
                    <span class="settings-tint-hex">${L||"none"}</span>
                </div>
            </div>

            <table class="settings-table settings-borderless settings-theme-table">
                <thead>
                    <tr>
                        <th></th><th>Theme</th><th>Mode</th>
                        ${E.map((z)=>F`<th class="settings-swatch-header">${z.replace(/([A-Z])/g," $1").trim()}</th>`)}
                    </tr>
                </thead>
                <tbody>
                    ${k.filter((z)=>z.name!=="default").map((z)=>F`
                        <tr class=${z.name===X?"settings-row-active":""}
                            style="cursor:pointer" onClick=${()=>D(z.name,"")}>
                            <td><input type="radio" name="settings-theme" checked=${z.name===X} onChange=${()=>D(z.name,"")} /></td>
                            <td><strong>${z.label}</strong></td>
                            <td>${z.mode}</td>
                            ${E.map((O)=>{let I=z.colors?.[O];return F`<td class="settings-swatch-cell">
                                    ${I?F`<span class="settings-color-swatch" style=${"background:"+I} title=${I}></span>`:"—"}
                                </td>`})}
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    `}var SY=J_(()=>{M0();_5()});var gY={};j1(gY,{__scheduledTasksSettingsTest:()=>KW,ScheduledTasksSection:()=>VW});function f4(_){if(!_)return"—";let $=new Date(_);if(Number.isNaN($.getTime()))return _;return $.toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function uY(_){let $=Number(_);if(!Number.isFinite($))return"—";if($<1000)return`${Math.round($)}ms`;return`${($/1000).toFixed($<1e4?1:0)}s`}function L9(_){if(!_)return"—";if(_.schedule_type==="once")return`once · ${f4(_.schedule_value)}`;if(_.schedule_type==="interval")return`interval · ${_.schedule_value}`;if(_.schedule_type==="cron")return`cron · ${_.schedule_value}`;return`${_.schedule_type||"schedule"} · ${_.schedule_value||"—"}`}function q9(_){let $=_?.task_kind||"agent";return $==="internal"?"internal/protected":$}function V9(_){return(_?.task_kind||"agent")==="internal"}function YW(_){if(!_)return"";let $=String(_).replace(/\s+/g," ").trim();return $.length>180?`${$.slice(0,179)}…`:$}function A2({children:_,type:$="neutral"}){return F`<span class=${`settings-task-pill settings-task-pill-${$}`}>${_}</span>`}function LW({task:_}){let $=Array.isArray(_?.recent_run_logs)?_.recent_run_logs:[];if(!$.length)return F`<p class="settings-hint">No run logs recorded yet.</p>`;return F`
        <div class="settings-task-run-list">
            ${$.map((j)=>F`
                <div class=${`settings-task-run-row settings-task-run-${j.status||"unknown"}`}>
                    <div class="settings-task-run-meta">
                        <${A2} type=${j.status==="error"?"error":"success"}>${j.status||"unknown"}<//>
                        <span>${f4(j.run_at)}</span>
                        <span>${uY(j.duration_ms)}</span>
                    </div>
                    <div class="settings-task-run-summary">
                        ${j.error_summary||YW(j.error)||j.result_summary||j.result||"No summary"}
                    </div>
                </div>
            `)}
        </div>
    `}function qW({task:_,onAction:$}){if(!_)return F`<div class="settings-task-detail-empty">Select a task to inspect schedule, status, and run history.</div>`;let j=V9(_);return F`
        <div class="settings-task-detail">
            <div class="settings-task-detail-header">
                <div>
                    <h4>${_.summary||_.id}</h4>
                    <code>${_.id}</code>
                </div>
                <div class="settings-task-detail-actions">
                    ${_.status==="active"&&F`<button onClick=${()=>$("pause",_)}>Pause</button>`}
                    ${_.status==="paused"&&F`<button onClick=${()=>$("resume",_)}>Resume</button>`}
                    <button class="danger" onClick=${()=>$("delete",_)}>Delete</button>
                </div>
            </div>
            <div class="settings-task-detail-grid">
                <span>Status</span><strong>${_.status||"—"}</strong>
                <span>Kind</span><strong>${q9(_)}</strong>
                <span>Schedule</span><strong>${L9(_)}</strong>
                <span>Next run</span><strong>${f4(_.next_run)}</strong>
                <span>Last run</span><strong>${f4(_.last_run)}</strong>
                <span>Last result</span><strong>${_.latest_run_log?.status||_.last_result||"—"}</strong>
                <span>Chat</span><code>${_.chat_jid||"—"}</code>
                <span>Model</span><code>${_.model||"default"}</code>
                ${_.cwd&&F`<span>CWD</span><code>${_.cwd}</code>`}
                ${_.timeout_sec&&F`<span>Timeout</span><strong>${_.timeout_sec}s</strong>`}
                ${j&&F`<span>Protection</span><strong>Internal task actions require explicit confirmation.</strong>`}
            </div>
            <div class="settings-task-command-block">
                <strong>${_.task_kind==="shell"?"Command":"Prompt"}</strong>
                <pre>${_.command||_.prompt||_.command_summary||_.prompt_summary||_.summary||"—"}</pre>
            </div>
            <h4>Recent runs</h4>
            <${LW} task=${_} />
        </div>
    `}function VW({filter:_="",setStatus:$}){let[j,G]=f([]),[Z,X]=f({active:0,paused:0,completed:0}),[Y,L]=f("all"),[V,q]=f(""),[Q,K]=f(!0),[B,N]=f(null),[U,D]=f(null),[H,E]=f(null),[k,z]=f(!1),O=R(async(W={})=>{K(!0),N(null);try{let M=await K7({status:Y,chatJid:V.trim()||void 0,limit:50,includeRunLogs:!0,runLogLimit:5});G(M.tasks||[]),X(M.counts||{active:0,paused:0,completed:0});let T=W.selectedId||U,J=(M.tasks||[]).find((C)=>C.id===T)||(M.tasks||[])[0]||null;D(J?.id||null),E(J)}catch(M){N(M?.message||"Failed to load scheduled tasks.")}finally{K(!1)}},[Y,V,U]);u(()=>{O()},[O]);let I=String(_||"").trim().toLowerCase(),x=Y0(()=>{if(!I)return j;return j.filter((W)=>[W.id,W.chat_jid,W.status,W.task_kind,W.schedule_type,W.schedule_value,W.summary,W.prompt_summary,W.command_summary,W.latest_run_log?.error_summary].some((M)=>String(M||"").toLowerCase().includes(I)))},[j,I]),A=R((W)=>{D(W?.id||null),E(W||null)},[]),y=R(async(W,M)=>{if(!M||k)return;let T=V9(M),J=M.summary||M.command_summary||M.prompt_summary||M.id,C=W==="delete"?`Delete scheduled task ${M.id}?

${J}`:`${W==="pause"?"Pause":"Resume"} scheduled task ${M.id}?

${J}`;if(!window.confirm(C))return;if(T&&!window.confirm(`Task ${M.id} is internal/protected. Continue with ${W}?`))return;z(!0),$?.(`${W==="delete"?"Deleting":W==="pause"?"Pausing":"Resuming"} ${M.id}…`,"info");try{await Q7(W,M.id,{allowInternal:T}),$?.(`Scheduled task ${M.id} ${W==="delete"?"deleted":W==="pause"?"paused":"resumed"}.`,"success"),await O({selectedId:W==="delete"?null:M.id})}catch(P){$?.(P?.message||`Failed to ${W} task.`,"error")}finally{z(!1)}},[k,O,$]);return F`
        <div class="settings-section settings-scheduled-tasks-section">
            <div class="settings-task-toolbar">
                <div class="settings-task-counts">
                    <${A2} type="active">Active ${Z.active||0}<//>
                    <${A2} type="paused">Paused ${Z.paused||0}<//>
                    <${A2} type="completed">Completed ${Z.completed||0}<//>
                </div>
                <div class="settings-task-filters">
                    <select value=${Y} onChange=${(W)=>L(W.target.value)}>
                        ${XW.map((W)=>F`<option value=${W}>${W==="all"?"All statuses":W}</option>`)}
                    </select>
                    <input type="text" placeholder="Filter chat JID…" value=${V} onInput=${(W)=>q(W.target.value)} />
                    <button onClick=${()=>O()} disabled=${Q}>Refresh</button>
                </div>
            </div>

            ${Q&&F`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>Loading scheduled tasks…</span></div>`}
            ${B&&F`<div class="settings-error-state">${B}</div>`}
            ${!Q&&!B&&j.length===0&&F`
                <div class="settings-empty-state">
                    <strong>No scheduled tasks found.</strong>
                    <p>Tasks created with reminders, `/j`, or the scheduler tool will appear here.</p>
                </div>
            `}
            ${!Q&&!B&&j.length>0&&F`
                <div class="settings-task-layout">
                    <div class="settings-task-list" role="listbox" aria-label="Scheduled tasks">
                        ${x.map((W)=>F`
                            <button class=${`settings-task-row ${W.id===U?"active":""}`} onClick=${()=>A(W)}>
                                <span class="settings-task-row-main">
                                    <strong>${W.summary||W.id}</strong>
                                    <span>${L9(W)}</span>
                                </span>
                                <span class="settings-task-row-meta">
                                    <${A2} type=${W.status||"neutral"}>${W.status}<//>
                                    <${A2}>${q9(W)}<//>
                                </span>
                                <span class="settings-task-row-times">Next ${f4(W.next_run)} · Last ${f4(W.last_run)}${W.latest_run_log?.status?` · ${W.latest_run_log.status}`:""}</span>
                            </button>
                        `)}
                        ${x.length===0&&F`<p class="settings-hint">No tasks match “${_}”.</p>`}
                    </div>
                    <${qW} task=${H&&x.some((W)=>W.id===H.id)?H:x[0]} onAction=${y} />
                </div>
            `}
        </div>
    `}var XW,KW;var bY=J_(()=>{M0();I_();XW=["all","active","paused","completed"];KW={formatDateTime:f4,formatDuration:uY,labelForSchedule:L9,kindLabel:q9,isProtectedTask:V9}});function vY(_){return String(_||"").toLowerCase().replace(/^[@/]+/,"").replace(/\s+/g," ").trim()}function k2(_){return typeof _==="string"&&_.trim().length>0}function K9(_,...$){let j=vY(_);if(!j)return!0;let G=$.map((Z)=>vY(Z)).filter(Boolean);for(let Z of G)if(Z.startsWith(j)||Z.includes(j))return!0;return!1}function mY(_){if(!Array.isArray(_))return null;let $=[],j=new Set;for(let G of _){let Z=String(G||"").trim();if(!Z)continue;let X=Z.toLowerCase();if(j.has(X))continue;j.add(X),$.push(Z)}return $}function a$(_){let $=_&&typeof _==="object"?_:{};return{workspaceCommands:mY($.workspaceCommands),slashCommands:mY($.slashCommands)}}function cY(_,$){if(!Array.isArray(_))return!0;return _.some((j)=>j.toLowerCase()===$.toLowerCase())}function QW(_){let $=Array.isArray(_?.commands)?_.commands:[],j=a$(_?.settings),G=String(_?.query||"");return $.filter((Z)=>cY(j.workspaceCommands,Z.id)).filter((Z)=>K9(G,Z.label,Z.description,...Z.keywords||[])).map((Z)=>({key:`workspace:${Z.id}`,kind:"workspace",title:Z.label,subtitle:Z.description,searchText:`${Z.label} ${Z.description} ${(Z.keywords||[]).join(" ")}`.trim(),visualHint:Z.label.slice(0,1).toUpperCase()||"W",categoryLabel:"Workspace",actionHint:"Run",commandId:Z.id}))}function NW(_){let $=Array.isArray(_?.agents)?_.agents:[],j=String(_?.query||""),G=new Set;return $.filter((Z)=>{let X=k2(Z?.chat_jid)?Z.chat_jid.trim():"";if(!X||G.has(X))return!1;if(Z?.archived_at)return!1;return G.add(X),!0}).filter((Z)=>K9(j,`@${String(Z?.agent_name||"").trim()}`,Z?.session_name,Z?.chat_jid)).map((Z)=>{let X=k2(Z?.agent_name)?Z.agent_name.trim():String(Z?.chat_jid||"").replace(/^[^:]+:/,""),Y=k2(Z?.session_name)?Z.session_name.trim():"",L=String(Z?.chat_jid||"").trim();return{key:`agent:${L}`,kind:"agent",title:`@${X}`,subtitle:Y||L,searchText:`@${X} ${Y} ${L}`.trim(),visualHint:X.slice(0,1).toUpperCase()||"@",categoryLabel:"Agent",actionHint:"Open",chatJid:L}})}function BW(_){let $=Array.isArray(_?.slashCommands)?_.slashCommands:[],j=a$(_?.settings),G=String(_?.query||""),Z=new Set;return $.filter((X)=>{let Y=k2(X?.name)?X.name.trim():"";if(!Y||Z.has(Y.toLowerCase()))return!1;return Z.add(Y.toLowerCase()),cY(j.slashCommands,Y)}).filter((X)=>K9(G,X?.name,X?.description,X?.source)).map((X)=>{let Y=String(X?.name||"").trim(),L=k2(X?.description)?X.description.trim():"slash command",V=k2(X?.source)?X.source.trim():"";return{key:`slash:${Y}`,kind:"slash",title:Y,subtitle:L,searchText:`${Y} ${L} ${String(X?.source||"")}`.trim(),visualHint:"/",categoryLabel:V||"Slash",actionHint:"Insert",commandName:Y}})}function lY(_){return[...NW({agents:_?.agents,query:_?.query}),...QW({commands:_?.workspaceCommands,settings:_?.settings,query:_?.query}),...BW({slashCommands:_?.slashCommands,settings:_?.settings,query:_?.query})]}var s$;var Q9=J_(()=>{s$=[{id:"toggle-workspace",label:"Toggle workspace",description:"Show or hide the workspace sidebar.",keywords:["workspace","sidebar","explorer"]},{id:"open-explorer",label:"Open explorer",description:"Open the workspace explorer sidebar.",keywords:["workspace","explorer","sidebar"]},{id:"toggle-chat-only",label:"Chat-only mode",description:"Toggle chat-only mode.",keywords:["chat","mode","layout"]},{id:"open-terminal-tab",label:"Open terminal in tab",description:"Open the terminal pane in a workspace tab.",keywords:["terminal","shell","tab"]},{id:"open-vnc-tab",label:"Open VNC in tab",description:"Open the VNC viewer in a workspace tab.",keywords:["vnc","remote","desktop","tab"]},{id:"toggle-terminal-dock",label:"Toggle terminal dock",description:"Show or hide the terminal dock.",keywords:["terminal","dock","shell"]},{id:"open-settings",label:"Settings",description:"Open the settings dialog.",keywords:["settings","preferences","config"]}]});var rY={};j1(rY,{QuickActionsSection:()=>FW});function hY(_,...$){let j=String(_||"").trim().toLowerCase();if(!j)return!0;return $.some((G)=>String(G||"").toLowerCase().includes(j))}function nY(_){if(!Array.isArray(_))return null;return new Set(_.map(($)=>String($||"").trim().toLowerCase()).filter(Boolean))}function FW({filter:_="",setStatus:$,mergeSettingsData:j}){let[G,Z]=f(()=>s$.map((x)=>x.id)),[X,Y]=f([]),[L,V]=f([]),[q,Q]=f(!0),[K,B]=f(!1),N=R(async()=>{Q(!0);try{let[x,A]=await Promise.all([q5(),L5("web:default").catch(()=>({commands:[]}))]),y=a$(x?.settings),W=Array.isArray(A?.commands)?A.commands:[];V(W),Z(Array.isArray(y.workspaceCommands)?y.workspaceCommands:s$.map((M)=>M.id)),Y(Array.isArray(y.slashCommands)?y.slashCommands:W.map((M)=>String(M?.name||"").trim()).filter(Boolean))}catch(x){$?.(String(x?.message||x),"error")}finally{Q(!1)}},[$]);u(()=>{N()},[N]);let U=Y0(()=>nY(G),[G]),D=Y0(()=>nY(X),[X]),H=Y0(()=>s$.filter((x)=>hY(_,x.label,x.description,...x.keywords||[])),[_]),E=Y0(()=>L.filter((x)=>hY(_,x?.name,x?.description,x?.source)),[L,_]),k=R((x)=>{Z((A)=>{let y=new Set((Array.isArray(A)?A:[]).map((W)=>String(W||"").trim()).filter(Boolean));if(y.has(x))y.delete(x);else y.add(x);return s$.map((W)=>W.id).filter((W)=>y.has(W))})},[]),z=R((x)=>{Y((A)=>{let y=new Set((Array.isArray(A)?A:[]).map((W)=>String(W||"").trim()).filter(Boolean));if(y.has(x))y.delete(x);else y.add(x);return L.map((W)=>String(W?.name||"").trim()).filter((W)=>W&&y.has(W))})},[L]),O=R(()=>{Z(s$.map((x)=>x.id)),Y(L.map((x)=>String(x?.name||"").trim()).filter(Boolean))},[L]),I=R(async()=>{if(K)return;B(!0),$?.("Saving quick actions…","info");try{let x=await B7({workspaceCommands:G,slashCommands:X}),A=a$(x?.settings);j?.({quickActions:A}),window.dispatchEvent(new CustomEvent("piclaw:quick-actions-settings-updated",{detail:{settings:A}})),$?.("Quick Actions saved.","success")}catch(x){$?.(String(x?.message||x),"error")}finally{B(!1)}},[j,K,$,X,G]);if(q)return F`<div class="settings-loading">Loading…</div>`;return F`
        <div class="settings-section">
            <h3>Timeline Quick Actions</h3>
            <p class="settings-hint">
                Choose which actions appear in the timeline typeahead. Agents are always pinned first, then workspace commands, then slash commands.
            </p>

            <div class="settings-row" style="align-items:center; gap:10px; margin-bottom:12px;">
                <button class="settings-addon-btn" onClick=${O} disabled=${K}>Enable all</button>
                <button class="settings-addon-btn settings-addon-btn-install" onClick=${I} disabled=${K}>
                    ${K?"Saving…":"Save & apply"}
                </button>
            </div>

            <h3 style="margin-top:8px;">Workspace commands</h3>
            <div class="settings-subsection-list">
                ${H.map((x)=>{let A=U?U.has(x.id.toLowerCase()):!0;return F`
                        <label class="settings-checkbox-row" key=${x.id}>
                            <input type="checkbox" checked=${A} onChange=${()=>k(x.id)} />
                            <div>
                                <div>${x.label}</div>
                                <div class="settings-hint" style="margin:2px 0 0 0;">${x.description}</div>
                            </div>
                        </label>
                    `})}
                ${H.length===0&&F`<div class="settings-hint">No workspace commands match this filter.</div>`}
            </div>

            <h3 style="margin-top:20px;">Slash commands</h3>
            <div class="settings-subsection-list">
                ${E.map((x)=>{let A=String(x?.name||"").trim(),y=D?D.has(A.toLowerCase()):!0;return F`
                        <label class="settings-checkbox-row" key=${A}>
                            <input type="checkbox" checked=${y} onChange=${()=>z(A)} />
                            <div>
                                <div><code>${A}</code></div>
                                <div class="settings-hint" style="margin:2px 0 0 0;">${x?.description||"slash command"}</div>
                            </div>
                        </label>
                    `})}
                ${E.length===0&&F`<div class="settings-hint">No slash commands match this filter.</div>`}
            </div>
        </div>
    `}var pY=J_(()=>{M0();I_();Q9()});var dY={};j1(dY,{KeychainSection:()=>HW});function UW(_){if(!_)return"—";try{return new Date(_).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"})}catch{return _}}function HW({filter:_=""}){let[$,j]=f([]),[G,Z]=f(!0),[X,Y]=f(null),[L,V]=f(!1),[q,Q]=f(""),[K,B]=f(""),[N,U]=f(""),[D,H]=f(""),[E,k]=f(""),[z,O]=f("secret"),[I,x]=f(!1),[A,y]=f({}),[W,M]=f(null),[T,J]=f(null),[C,P]=f(null),b=g(null),m=g(null),h=g(null),_0=R(async()=>{Z(!0),Y(null);try{let X0=await(await fetch("/agent/keychain")).json();if(X0?.ok)j(X0.entries||[]);else Y(X0?.error||"Failed to load keychain.")}catch(s){Y("Failed to load keychain.")}finally{Z(!1)}},[]);u(()=>{_0()},[_0]);let v=R(async()=>{let s=q.trim(),X0=K;if(!s||!X0)return;x(!0);try{let C0=await(await fetch("/agent/keychain",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:s,secret:X0,type:z,username:N.trim()||void 0,userNote:D,agentNote:E})})).json();if(C0?.ok)Q(""),B(""),U(""),H(""),k(""),O("secret"),V(!1),await _0();else Y(C0?.error||"Failed to add entry.")}catch{Y("Failed to add entry.")}finally{x(!1)}},[q,K,N,D,E,z,_0]),e=R(async(s)=>{try{let D0=await(await fetch("/agent/keychain",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:s})})).json();if(D0?.ok)J(null),P((C0)=>C0?.name===s?null:C0),await _0();else Y(D0?.error||"Failed to delete entry.")}catch{Y("Failed to delete entry.")}},[_0]),W0=R(async(s)=>{let X0=s?.name;if(!X0)return;let D0=A[X0]||{},C0=Object.prototype.hasOwnProperty.call(D0,"userNote")?D0.userNote:s.userNote||"",g0=Object.prototype.hasOwnProperty.call(D0,"agentNote")?D0.agentNote:s.agentNote||"";M(X0);try{let j_=await(await fetch("/agent/keychain/notes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:X0,userNote:C0,agentNote:g0})})).json();if(j_?.ok)y((m0)=>{let d0={...m0||{}};return delete d0[X0],d0}),await _0();else Y(j_?.error||"Failed to save notes.")}catch{Y("Failed to save notes.")}finally{M(null)}},[A,_0]),G0=R((s,X0,D0)=>{y((C0)=>({...C0||{},[s]:{...(C0||{})[s]||{},[X0]:D0}}))},[]),$0=R(async(s,X0,D0)=>{try{let g0=await(await fetch("/agent/keychain/reveal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:s,master_password:X0||void 0,totp_code:D0||void 0})})).json();if(g0?.ok)P({name:s,phase:"revealed",secret:g0.secret,username:g0.username,masterPassword:X0});else if(g0?.needs_master_password)P((p0)=>({name:s,phase:"password",masterPassword:"",error:p0?.name===s&&p0?.masterPassword?g0.error:null})),requestAnimationFrame(()=>m.current?.focus());else if(g0?.needs_totp)P((p0)=>({name:s,phase:"totp",masterPassword:X0,totpCode:"",error:p0?.name===s&&p0?.phase==="totp"&&p0?.totpCode?g0.error:null})),requestAnimationFrame(()=>h.current?.focus());else P({name:s,phase:"error",error:g0?.error||"Failed to reveal."})}catch{P({name:s,phase:"error",error:"Failed to reveal."})}},[]),L0=R((s)=>{if(C?.name===s&&C?.phase==="revealed"){P(null);return}$0(s,null,null)},[C,$0]),B0=R((s)=>{let X0=C?.masterPassword||"";if(!X0)return;$0(s,X0,null)},[C,$0]),t=R((s)=>{let X0=C?.totpCode||"";if(X0.length<6)return;$0(s,C?.masterPassword,X0)},[C,$0]),V0=R(async(s)=>{try{await navigator.clipboard.writeText(s)}catch{let X0=document.createElement("textarea");X0.value=s,X0.style.position="fixed",X0.style.opacity="0",document.body.appendChild(X0),X0.select(),document.execCommand("copy"),document.body.removeChild(X0)}},[]);u(()=>{if(L)requestAnimationFrame(()=>b.current?.focus())},[L]);let K0=_.toLowerCase(),k0=Y0(()=>{if(!K0)return $;return $.filter((s)=>s.name.toLowerCase().includes(K0)||(s.type||"").toLowerCase().includes(K0)||(s.envVar||"").toLowerCase().includes(K0)||(s.userNote||"").toLowerCase().includes(K0)||(s.agentNote||"").toLowerCase().includes(K0))},[$,K0]);if(G)return F`<div class="settings-section"><div class="settings-loading">Loading keychain…</div></div>`;return F`
        <div class="settings-section">
            ${X&&F`
                <div class="settings-keychain-error" role="alert">
                    ${X}
                    <button class="settings-keychain-dismiss" onClick=${()=>Y(null)}>✕</button>
                </div>
            `}
            <div class="settings-keychain-toolbar" style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <span class="settings-hint" style="margin:0; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span>${k0.length} entr${k0.length===1?"y":"ies"}${K0?` matching "${_}"`:""}, encrypted at rest.</span>
                    <span style="display:inline-flex; align-items:center; gap:6px;">
                        <span>Click</span>
                        <span aria-hidden="true" style="display:inline-flex; width:18px; height:18px; align-items:center; justify-content:center; border-radius:999px; border:1px solid var(--border-color, rgba(120,120,120,.22)); background:var(--panel-bg, rgba(255,255,255,.04));">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </span>
                        <span>to reveal.</span>
                    </span>
                </span>
                <button class="settings-keychain-add-btn" onClick=${()=>V(!L)}>
                    ${L?"Cancel":"+ Add entry"}
                </button>
            </div>

            ${L&&F`
                <div class="settings-keychain-add-form">
                    <div class="settings-keychain-add-row">
                        <input ref=${b} type="text" placeholder="Entry name (e.g. github/my-token)"
                            value=${q} onInput=${(s)=>Q(s.target.value)}
                            class="settings-keychain-input" />
                        <select value=${z} onChange=${(s)=>O(s.target.value)}
                            class="settings-keychain-select">
                            ${EW.map((s)=>F`<option value=${s}>${s}</option>`)}
                        </select>
                    </div>
                    <div class="settings-keychain-add-row">
                        <input type="password" placeholder="Secret value"
                            value=${K} onInput=${(s)=>B(s.target.value)}
                            class="settings-keychain-input settings-keychain-secret" />
                        <input type="text" placeholder="Username (optional)"
                            value=${N} onInput=${(s)=>U(s.target.value)}
                            class="settings-keychain-input" style="max-width:200px" />
                        <button class="settings-keychain-save-btn" onClick=${v}
                            disabled=${I||!q.trim()||!K}>
                            ${I?"Saving…":"Save"}
                        </button>
                    </div>
                    <div class="settings-keychain-add-row" style="align-items:stretch">
                        <textarea placeholder="User note (visible in this UI only)"
                            value=${D} onInput=${(s)=>H(s.target.value)}
                            class="settings-keychain-input" rows="2" style="resize:vertical; min-height:56px"></textarea>
                        <textarea placeholder="Agent note (safe to expose to agents)"
                            value=${E} onInput=${(s)=>k(s.target.value)}
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
                        ${k0.length===0&&F`
                            <tr><td colspan="5" class="settings-keychain-empty">
                                ${K0?"No entries match the filter.":"No keychain entries."}
                            </td></tr>
                        `}
                        ${k0.map((s)=>{let X0=C?.name===s.name?C:null,D0=X0?.phase==="revealed",C0=X0?.phase==="password",g0=X0?.phase==="totp",p0=X0?.phase==="error",j_=A[s.name]||{},m0=Object.prototype.hasOwnProperty.call(j_,"userNote")?j_.userNote:s.userNote||"",d0=Object.prototype.hasOwnProperty.call(j_,"agentNote")?j_.agentNote:s.agentNote||"",u0=m0!==(s.userNote||"")||d0!==(s.agentNote||""),o0=W===s.name;return F`
                            <tr class="settings-keychain-row" key=${s.name}>
                                <td class="settings-keychain-name">${s.name}</td>
                                <td><span class="settings-keychain-type-badge">${s.type}</span></td>
                                <td class="settings-keychain-env">${s.envVar?F`<code>$${s.envVar}</code>`:"—"}</td>
                                <td class="settings-keychain-date">${UW(s.updatedAt)}</td>
                                <td class="settings-keychain-actions">
                                    <button class=${`settings-keychain-reveal-btn${D0?" active":""}`}
                                        onClick=${()=>L0(s.name)}
                                        title=${D0?"Hide secret":"Reveal secret"}>
                                        ${D0?F`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:F`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                                    </button>
                                    ${T===s.name?F`
                                            <span class="settings-keychain-confirm">Delete?
                                                <button class="settings-keychain-confirm-yes" onClick=${()=>e(s.name)}>Yes</button>
                                                <button class="settings-keychain-confirm-no" onClick=${()=>J(null)}>No</button>
                                            </span>
                                        `:F`<button class="settings-keychain-delete-btn" onClick=${()=>J(s.name)} title="Delete">🗑</button>`}
                                </td>
                            </tr>
                            <tr class="settings-keychain-notes-row" key=${s.name+"-notes"}>
                                <td colspan="5">
                                    <div style="display:grid; grid-template-columns:1fr 1fr auto; gap:8px; align-items:start; padding:8px 0 10px 0;">
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">User note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Human/UI note only"
                                                value=${m0}
                                                onInput=${(v0)=>G0(s.name,"userNote",v0.target.value)}></textarea>
                                        </label>
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">Agent-readable note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Safe guidance for agents"
                                                value=${d0}
                                                onInput=${(v0)=>G0(s.name,"agentNote",v0.target.value)}></textarea>
                                        </label>
                                        <button class="settings-keychain-save-btn" style="margin-top:20px" disabled=${!u0||o0} onClick=${()=>W0(s)}>
                                            ${o0?"Saving…":"Save notes"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ${C0&&F`
                                <tr class="settings-keychain-prompt-row" key=${s.name+"-pw"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">Master password:</span>
                                            <input ref=${m} type="password" autocomplete="off"
                                                placeholder="Enter keychain master password"
                                                class="settings-keychain-prompt-input"
                                                value=${X0?.masterPassword||""}
                                                onInput=${(v0)=>P((a0)=>({...a0,masterPassword:v0.target.value}))}
                                                onKeyDown=${(v0)=>{if(v0.key==="Enter")B0(s.name);if(v0.key==="Escape")P(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>B0(s.name)}
                                                disabled=${!X0?.masterPassword}>Unlock</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>P(null)}>Cancel</button>
                                            ${X0?.error&&F`<span class="settings-keychain-prompt-error">${X0.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${g0&&F`
                                <tr class="settings-keychain-prompt-row" key=${s.name+"-totp"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">TOTP code:</span>
                                            <input ref=${h} type="text" inputmode="numeric" autocomplete="one-time-code"
                                                maxlength="6" placeholder="000000"
                                                class="settings-keychain-prompt-input" style="width:90px;text-align:center;letter-spacing:0.15em"
                                                value=${X0?.totpCode||""}
                                                onInput=${(v0)=>P((a0)=>({...a0,totpCode:v0.target.value.replace(/\\D/g,"").slice(0,6)}))}
                                                onKeyDown=${(v0)=>{if(v0.key==="Enter")t(s.name);if(v0.key==="Escape")P(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>t(s.name)}
                                                disabled=${(X0?.totpCode||"").length<6}>Verify</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>P(null)}>Cancel</button>
                                            ${X0?.error&&F`<span class="settings-keychain-prompt-error">${X0.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${D0&&F`
                                <tr class="settings-keychain-reveal-row" key=${s.name+"-reveal"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel">
                                            ${X0.username&&F`
                                                <div class="settings-keychain-reveal-field">
                                                    <span class="settings-keychain-reveal-label">Username</span>
                                                    <code class="settings-keychain-reveal-value">${X0.username}</code>
                                                    <button class="settings-keychain-copy-btn" onClick=${()=>V0(X0.username)} title="Copy username">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                    </button>
                                                </div>
                                            `}
                                            <div class="settings-keychain-reveal-field">
                                                <span class="settings-keychain-reveal-label">Secret</span>
                                                <code class="settings-keychain-reveal-value">${X0.secret}</code>
                                                <button class="settings-keychain-copy-btn" onClick=${()=>V0(X0.secret)} title="Copy secret">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${p0&&F`
                                <tr class="settings-keychain-reveal-row" key=${s.name+"-error"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel" style="color: var(--error-color, #e55)">${X0.error}</div>
                                    </td>
                                </tr>
                            `}
                        `})}
                    </tbody>
                </table>
            </div>
        </div>
    `}var EW;var iY=J_(()=>{M0();EW=["secret","token","password","basic"]});var oY={};j1(oY,{ToolsSection:()=>JW});function JW({toolsets:_,filter:$="",settingsData:j,mergeSettingsData:G}){let Z=_||[],[X,Y]=f(()=>{let B={};for(let N of Z)B[N.name]=!0;return B}),L=R((B)=>{Y((N)=>({...N,[B]:!N[B]}))},[]),V=j?.searchMatchMode||"or",q=R(async()=>{let B=V==="or"?"and":"or";try{let U=await(await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({searchMatchMode:B})})).json().catch(()=>({}));if(U?.ok&&U?.settings)G?.(U.settings)}catch(N){console.warn("[settings/tools] Failed to save search match mode.",N)}},[V,G]),Q=$.toLowerCase(),K=Y0(()=>{if(!Q)return Z;return Z.map((B)=>{let N=B.tools.filter((U)=>U.name.toLowerCase().includes(Q)||B.name.toLowerCase().includes(Q)||(U.summary||"").toLowerCase().includes(Q));return N.length>0?{...B,tools:N}:null}).filter(Boolean)},[Z,Q]);if(Z.length===0)return F`<div class="settings-section"><p class="settings-hint">Tool data not available.</p></div>`;return F`
        <div class="settings-section">
            <div class="settings-search-options">
                <h4 style="margin:0 0 8px 0">Search</h4>
                <div class="settings-row">
                    <label>Match mode</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" checked=${V==="and"} onChange=${q} />
                        <span class="settings-hint" style="margin:0">
                            ${V==="or"?"Any keyword (OR) — results match at least one search term":"All keywords (AND) — results must match every search term"}
                        </span>
                    </div>
                </div>
            </div>
            ${K.map((B)=>{let N=X[B.name]!==!1;return F`
                <div class="settings-toolset">
                    <div class="settings-toolset-header">
                        <label class="settings-toolset-toggle">
                            <input type="checkbox" checked=${N} onChange=${()=>L(B.name)} />
                            <span class="settings-toolset-icon">${DW[B.name]||zW}</span>
                            <strong>${B.name}</strong>
                        </label>
                        <span class="settings-hint" style="margin:0">${B.description}</span>
                    </div>
                    ${N&&F`<div class="settings-tool-list">${B.tools.map((U)=>F`
                        <div class="settings-tool-row">
                            <input type="checkbox" checked disabled />
                            <span class="settings-tool-name">${U.name}</span>
                            <span class="settings-tool-kind" title=${U.kind}>${OW[U.kind]||"?"}</span>
                            ${U.summary&&F`<span class="settings-tool-summary">${U.summary}</span>`}
                            <span class="settings-tool-source">${WW[U.name]||B.name}</span>
                        </div>
                    `)}</div>`}
                </div>
            `})}
            ${K.length===0&&F`<p class="settings-hint">No tools match "${$}"</p>`}
            <p class="settings-hint">Tool activation is managed by the agent runtime. Group checkboxes collapse/expand; individual tools use <code>activate_tools</code>.</p>
        </div>
    `}var DW,WW,OW,zW;var sY=J_(()=>{M0();DW={core:F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M7.5 10l2.5 2-2.5 2"/><path d="M12.5 15H16"/></svg>`,discovery:F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,attachments:F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,"model-control":F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><path d="M9 15c.83.67 2 1 3 1s2.17-.33 3-1"/></svg>`,data:F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,workspace:F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,automation:F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,remote:F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,browser:F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,ui:F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,experiments:F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v7l4.6 7.7A1 1 0 0 1 18.7 19H5.3a1 1 0 0 1-.9-1.3L9 10z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>`,lifecycle:F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`},WW={read:"pi-core",write:"pi-core",edit:"pi-core",bash:"pi-core",powershell:"pi-core",find:"pi-core",grep:"pi-core",ls:"pi-core",list_tools:"internal-tools",list_internal_tools:"internal-tools",activate_tools:"tool-activation",reset_active_tools:"tool-activation",list_scripts:"runtime-scripts",attach_file:"file-attachments",read_attachment:"file-attachments",export_attachment:"file-attachments",get_model_state:"model-control",list_models:"model-control",switch_model:"model-control",switch_thinking:"model-control",messages:"messages-crud",introspect_sql:"sql-introspect",keychain:"keychain-tools",search_workspace:"workspace-search",refresh_workspace_index:"workspace-search",open_office_viewer:"office-viewer",office_read:"office-viewer",office_write:"office-viewer",open_workspace_file:"open-workspace-file",image_process:"image-processing",schedule_task:"scheduled-tasks",scheduled_tasks:"scheduled-tasks",bun_run:"bun-runner",exec_batch:"exec-batch",search_tool_output:"search-tool-output",ssh:"ssh",proxmox:"proxmox",portainer:"portainer",mcp:"mcp",cdp_browser:"cdp-browser",send_adaptive_card:"send-adaptive-card",send_dashboard_widget:"send-dashboard-widget",start_autoresearch:"autoresearch",stop_autoresearch:"autoresearch",autoresearch_status:"autoresearch",exit_process:"exit-process",env:"env-tools"},OW={"read-only":"\uD83D\uDD0D",mutating:"✏️",mixed:"\uD83D\uDD04"},zW=F`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`});var aY={};j1(aY,{AddonsSection:()=>AW});function AW({setStatus:_,filter:$=""}){let[j,G]=f(null),[Z,X]=f(!0),[Y,L]=f(null),[V,q]=f(!1),[Q,K]=f({runtime:"",windowsNative:!1}),[B,N]=f([]),[U,D]=f([]);function H(){let W=new URLSearchParams;try{let T=(localStorage.getItem("piclaw_addons_catalog_url")||"").trim(),J=(localStorage.getItem("piclaw_addons_catalog_urls")||"").split(/\r?\n/).map((P)=>P.trim()).filter(Boolean),C=localStorage.getItem("piclaw_addons_repo_url");if(T)W.append("catalog_url",T);for(let P of J)W.append("catalog_url",P);if(C)W.set("repo_url",C)}catch(T){}let M=W.toString();return M?`?${M}`:""}let E=R(async()=>{try{let[W,M]=await Promise.all([fetch(`/agent/addons${H()}`),fetch("/agent/settings-data")]),T=await W.json();if(T.error)throw Error(T.error);G(T.addons||[]),N(T.sources||[]),D(T.failed_sources||[]);let J=await M.json().catch(()=>({})),C=typeof J?.runtimePlatform==="string"?J.runtimePlatform:"";K({runtime:C,windowsNative:C==="win32"})}catch(W){G(null),_?.(String(W.message||W),"error")}finally{X(!1)}},[_]);u(()=>{E()},[]);let k=R(async(W)=>{if(Y)return;L({slug:W,action:"install"}),_?.(`Installing ${W}…`,"info");try{let T=await(await fetch(`/agent/addons/install${H()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:W})})).json();if(T.error){_?.(T.error,"error");return}q(!0);let J=[T.message,T.warning].filter(Boolean).join(" ");_?.(J||"Add-on installed.","success"),await E()}catch(M){_?.(String(M.message||M),"error")}finally{L(null)}},[Y,E,_]),z=R(async(W)=>{if(Y)return;L({slug:W,action:"remove"}),_?.(`Removing ${W}…`,"info");try{let T=await(await fetch(`/agent/addons/uninstall${H()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:W})})).json();if(T.error){_?.(T.error,"error");return}q(!0);let J=[T.message,T.warning].filter(Boolean).join(" ");_?.(J||"Add-on removed.","success"),await E()}catch(M){_?.(String(M.message||M),"error")}finally{L(null)}},[Y,E,_]),O=R(async()=>{if(Y)return;L({slug:null,action:"restart"}),_?.("Restarting piclaw…","info");try{let M=await(await fetch("/agent/addons/restart",{method:"POST"})).json();if(M.error){_?.(M.error,"error"),L(null);return}_?.(M.message||"Restarting piclaw…","success"),q(!1),(async(J=30,C=2000)=>{for(let P=0;P<J;P++){await new Promise((b)=>setTimeout(b,C));try{if((await fetch("/agent/addons",{signal:AbortSignal.timeout(3000)})).ok){await E(),L(null),_?.("Restart complete — add-ons refreshed.","success");return}}catch(b){}}L(null),_?.("Backend did not return in time. Reload the page manually.","warning")})()}catch(W){_?.(String(W.message||W),"error"),L(null)}},[Y,_,E]);if(Z)return F`<div class="settings-loading">Fetching add-ons\u2026</div>`;if(!j)return F`<div class="settings-section"><p class="settings-hint">Could not load add-ons.</p></div>`;let I=$.toLowerCase(),x=I?j.filter((W)=>W.slug.toLowerCase().includes(I)||(W.description||"").toLowerCase().includes(I)||(W.tags||[]).some((M)=>M.toLowerCase().includes(I))):j,A=Y?.slug||null,y=Y?Y.action==="remove"?`Removing ${Y.slug}…`:Y.action==="restart"?"Restarting piclaw…":`Installing ${Y.slug}…`:"";return F`
        <div class=${`settings-section settings-addon-panel${Y?" busy":""}`} aria-busy=${Y?"true":"false"}>
            <div class="settings-addon-toolbar">
                <div>
                    <p class="settings-hint">
                        ${B.length<=1?F`Catalog from <a href="https://github.com/rcarmo/piclaw-addons" target="_blank">rcarmo/piclaw-addons</a>.`:F`${B.length} catalog sources merged.`}
                        ${" "}Package-first install via Bun; restart required after install/uninstall.
                    </p>
                    ${U.length>0&&F`
                        <div class="settings-addon-error" role="alert">
                            Failed to fetch ${U.length} catalog source${U.length>1?"s":""}:
                            ${U.map((W)=>F` <code style="font-size:0.82em;word-break:break-all">${W}</code>`)}
                        </div>
                    `}
                    ${B.length>1&&F`
                        <details class="settings-hint" style="margin-top:4px">
                            <summary style="cursor:pointer">Active catalog sources (${B.length})</summary>
                            <ul style="margin:4px 0 0 16px;font-size:0.82em">
                                ${B.map((W)=>F`<li style="word-break:break-all"><code>${W}</code></li>`)}
                            </ul>
                        </details>
                    `}
                    ${Q.windowsNative&&F`
                        <div class="settings-addon-error" role="alert">
                            Native Windows add-on installs are higher risk: Bun package installs, symlink cleanup, locked files, and restart timing can all be less predictable than in Linux/WSL. Prefer WSL or a container when possible.
                        </div>
                    `}
                </div>
            </div>
            ${Y&&F`
                <div class="settings-addon-panel-overlay" role="status" aria-live="polite" aria-label=${y}>
                    <div class="settings-addon-panel-overlay-card">
                        <div class="settings-spinner"></div>
                        <span>${y}</span>
                    </div>
                </div>
            `}
            <div class="settings-addon-list">
                ${x.map((W)=>{let M=(W.skills||[]).length>0,T=W.type==="extension",J=M&&T?"extension + skill":M?"skill":"extension",C=M&&!T?"settings-tag-skill":"",P=typeof W.homepage==="string"&&W.homepage.trim()?W.homepage.trim():"";return F`
                    <div class=${`settings-addon-card${W.installed?" installed":""}`}>
                        <div class="settings-addon-card-header">
                            ${P?F`<a class="settings-addon-name-link" href=${P} target="_blank" rel="noopener noreferrer">${W.slug}</a>`:F`<strong>${W.slug}</strong>`}
                            <span class=${`settings-tag settings-tag-type ${C}`}>${J}</span>
                            <span class="settings-addon-version">${W.installed?W.installedVersion||"?":W.version||""}</span>
                            ${W.installKind&&F`<span class="settings-tag">${W.installKind}</span>`}
                            ${W.hasUpdate&&F`<span class="settings-tag settings-tag-skill">\u2191 ${W.version}</span>`}
                            <div class="settings-addon-actions">
                                ${W.installed?F`
                                    ${W.hasUpdate&&F`<button class="settings-addon-btn settings-addon-btn-upgrade" disabled=${Boolean(Y)} onClick=${()=>k(W.slug)}>${A===W.slug?"…":"Update"}</button>`}
                                    <button class="settings-addon-btn settings-addon-btn-remove" disabled=${Boolean(Y)} onClick=${()=>z(W.slug)}>${A===W.slug?"…":"Remove"}</button>
                                `:F`
                                    <button class="settings-addon-btn settings-addon-btn-install" disabled=${Boolean(Y)} onClick=${()=>k(W.slug)}>${A===W.slug?"…":"Install"}</button>
                                `}
                            </div>
                        </div>
                        <div class="settings-addon-card-body">${W.description}</div>
                        <div class="settings-addon-card-footer">
                            <div class="settings-addon-tags">${(W.tags||[]).map((b)=>F`<span class="settings-tag">${b}</span>`)}${(W.skills||[]).map((b)=>F`<span class="settings-tag settings-tag-skill">\ud83d\udcdd ${b}</span>`)}</div>
                        </div>
                    </div>
                `})}
                ${x.length===0&&F`<p class="settings-hint">No add-ons match "${$}"</p>`}
            </div>
            ${V&&F`
                <div class="settings-addon-restart-notice" role="status" aria-live="polite">
                    <span>Extension changes are installed but inactive until piclaw restarts.</span>
                    <button class="settings-addon-btn settings-addon-btn-restart-now" type="button" disabled=${Boolean(Y)} onClick=${O}>Restart Now</button>
                </div>
            `}
        </div>
    `}var tY=J_(()=>{M0()});var IW={};function N9(_,$){try{let j=localStorage.getItem(_);return j===null?$:j==="true"}catch{return $}}function n6(_,$){try{localStorage.setItem(_,String($))}catch(j){}}function kW(_,$){try{return localStorage.getItem(_)||$}catch{return $}}function yW(_,$){try{localStorage.setItem(_,$)}catch(j){}}function MW(_,$,j,G){try{return O$(localStorage.getItem(_),{fallback:$,min:j,max:G})}catch{return O$($,{fallback:$,min:j,max:G})}}function wW(_,$){try{localStorage.setItem(_,String($))}catch(j){}}function TW(){let[_,$]=f(()=>N9("piclaw_vim_mode",!1)),[j,G]=f(()=>N9("piclaw_show_whitespace",!0)),[Z,X]=f(()=>N9("piclaw_md_live_preview",!0)),[Y,L]=f(()=>MW("piclaw_editor_font_size",13,10,24)),[V,q]=f(()=>kW("piclaw_editor_font_family","")),Q=R((K,B,N)=>{let U=!B;N(U),n6(K,U)},[]);return F`
        <div class="settings-section">
            <h3>Editor</h3>
            <div class="settings-row">
                <label>Vim mode</label>
                <input type="checkbox" checked=${_}
                    onChange=${()=>{let K=!_;$(K),n6("piclaw_vim_mode",K)}} />
            </div>
            <div class="settings-row">
                <label>Show whitespace</label>
                <input type="checkbox" checked=${j}
                    onChange=${()=>{let K=!j;G(K),n6("piclaw_show_whitespace",K)}} />
            </div>
            <div class="settings-row">
                <label>Markdown live preview</label>
                <input type="checkbox" checked=${Z}
                    onChange=${()=>{let K=!Z;X(K),n6("piclaw_md_live_preview",K)}} />
            </div>
            <div class="settings-row">
                <label>Font size (px)</label>
                <${v_}
                    label="editor font size"
                    value=${Y}
                    min=${10}
                    max=${24}
                    fallback=${13}
                    width="70px"
                    onChange=${(K)=>{L(K),wW("piclaw_editor_font_size",K)}}
                />
            </div>
            <div class="settings-row">
                <label>Font family</label>
                <input type="text" value=${V}
                    onInput=${(K)=>{let B=K.target.value;q(B),yW("piclaw_editor_font_family",B)}}
                    placeholder="monospace (default)" />
            </div>
            <p class="settings-hint settings-local-only-hint">This browser only. Editor changes are stored in local browser storage and take effect when you next open or reload a file tab.</p>
        </div>
    `}var xW;var eY=J_(()=>{M0();O2();C4();xW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;d$({id:"editor",label:"Editor",icon:xW,component:TW,order:150})});var SW={};function _L(_,$){try{let j=localStorage.getItem(_);return j===null?$:j==="true"}catch{return $}}function $L(_,$){try{localStorage.setItem(_,String($))}catch(j){}}function CW(_,$,j,G){try{return O$(localStorage.getItem(_),{fallback:$,min:j,max:G})}catch{return O$($,{fallback:$,min:j,max:G})}}function fW(_,$){try{localStorage.setItem(_,String($))}catch(j){}}function PW(){let[_,$]=f(()=>_L("piclaw_mindmap_auto_expand",!0)),[j,G]=f(()=>CW("piclaw_mindmap_node_spacing",40,20,100)),[Z,X]=f(()=>_L("piclaw_mindmap_animate",!0));return F`
        <div class="settings-section">
            <h3>Mind Map</h3>
            <div class="settings-row">
                <label>Auto-expand nodes</label>
                <input type="checkbox" checked=${_}
                    onChange=${()=>{let Y=!_;$(Y),$L("piclaw_mindmap_auto_expand",Y)}} />
            </div>
            <div class="settings-row">
                <label>Node spacing (px)</label>
                <${v_}
                    label="node spacing"
                    value=${j}
                    min=${20}
                    max=${100}
                    fallback=${40}
                    width="70px"
                    onChange=${(Y)=>{G(Y),fW("piclaw_mindmap_node_spacing",Y)}}
                />
            </div>
            <div class="settings-row">
                <label>Animate transitions</label>
                <input type="checkbox" checked=${Z}
                    onChange=${()=>{let Y=!Z;X(Y),$L("piclaw_mindmap_animate",Y)}} />
            </div>
            <p class="settings-hint settings-local-only-hint">This browser only. Opens <code>.mindmap.yaml</code> files. Changes take effect on the next map open.</p>
        </div>
    `}var RW;var jL=J_(()=>{M0();O2();C4();RW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="9.5" y1="9.5" x2="6.5" y2="6.5"/><line x1="14.5" y1="9.5" x2="17.5" y2="6.5"/><line x1="9.5" y1="14.5" x2="6.5" y2="17.5"/><line x1="14.5" y1="14.5" x2="17.5" y2="17.5"/></svg>`;d$({id:"mindmap",label:"Mind Map",icon:RW,component:PW,order:170})});var bW={};function B9(_,$){try{let j=localStorage.getItem(_);return j===null?$:j==="true"}catch{return $}}function F9(_,$){try{localStorage.setItem(_,String($))}catch(j){}}function U9(_,$){try{return localStorage.getItem(_)||$}catch{return $}}function E9(_,$){try{localStorage.setItem(_,$)}catch(j){}}function uW(){let[_,$]=f(()=>B9("piclaw_dev_mode",!1)),[j,G]=f(()=>U9("piclaw_addons_catalog_url","")),[Z,X]=f(()=>U9("piclaw_addons_catalog_urls","")),[Y,L]=f(()=>U9("piclaw_addons_repo_url","")),[V,q]=f(()=>B9("piclaw_debug_sse",!1)),[Q,K]=f(()=>B9("piclaw_debug_tool_calls",!1)),B=R(()=>{let N=!_;$(N),F9("piclaw_dev_mode",N)},[_]);return F`
        <div class="settings-section">
            <h3>Developer</h3>
            <div class="settings-row">
                <label>Developer mode</label>
                <input type="checkbox" checked=${_} onChange=${B} />
            </div>

            <p class="settings-hint settings-local-only-hint">This browser only. Developer-mode toggles and add-on catalog overrides are stored in local browser storage.</p>

            ${_&&F`
                <h3 style="margin-top:16px">Add-on Sources</h3>
                <div class="settings-row">
                    <label>Catalog URL</label>
                    <input type="text" value=${j}
                        onInput=${(N)=>{let U=N.target.value;G(U),E9("piclaw_addons_catalog_url",U)}}
                        placeholder="https://raw.githubusercontent.com/.../catalog.json" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Primary add-on catalog URL. Leave empty to use the default (<code>rcarmo/piclaw-addons</code>).</p>
                <div class="settings-row" style="align-items:flex-start;">
                    <label>Additional catalog URLs</label>
                    <textarea
                        value=${Z}
                        onInput=${(N)=>{let U=N.target.value;X(U),E9("piclaw_addons_catalog_urls",U)}}
                        placeholder="One URL per line\nhttps://example.com/catalog.json"
                        style="max-width:400px; min-height:86px; resize:vertical;"
                    ></textarea>
                </div>
                <p class="settings-hint" style="margin-top:0">Fetched in addition to the primary/default catalog. One URL per line.</p>
                <div class="settings-row">
                    <label>Repo URL</label>
                    <input type="text" value=${Y}
                        onInput=${(N)=>{let U=N.target.value;L(U),E9("piclaw_addons_repo_url",U)}}
                        placeholder="https://github.com/.../piclaw-addons.git" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Override the git repo used for <code>bun add</code> installs. Leave empty for default.</p>

                <h3 style="margin-top:16px">Debug</h3>
                <div class="settings-row">
                    <label>Log SSE events</label>
                    <input type="checkbox" checked=${V}
                        onChange=${()=>{let N=!V;q(N),F9("piclaw_debug_sse",N)}} />
                </div>
                <div class="settings-row">
                    <label>Log tool calls</label>
                    <input type="checkbox" checked=${Q}
                        onChange=${()=>{let N=!Q;K(N),F9("piclaw_debug_tool_calls",N)}} />
                </div>
                <p class="settings-hint">Debug flags take effect on next page reload.</p>
            `}
        </div>
    `}var gW;var GL=J_(()=>{M0();O2();gW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;d$({id:"developer",label:"Developer",icon:gW,component:uW,order:900})});var qL={};j1(qL,{openSettingsDialog:()=>ZO,SettingsDialogContent:()=>LL,SettingsDialog:()=>GO});function J5(_){z5.push({ts:performance.now(),label:_})}function vW(){if(!z5.length)return;let _=z5[0].ts,$=z5.map((j)=>`+${(j.ts-_).toFixed(1)}ms ${j.label}`);console.info(`[settings-dialog perf]
`+$.join(`
`));try{window.__piclawSettingsPerfLog=$}catch(j){}try{fetch("/agent/client-perf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({label:"settings-dialog",lines:$})}).catch((j)=>{})}catch(j){}z5.length=0}function lW(_){let $=d6.get(_);if($)return Promise.resolve($);let j=r6.get(_);if(j)return j;let G=mW[_]().then((Z)=>{return d6.set(_,Z),r6.delete(_),Z}).catch((Z)=>{throw r6.delete(_),Z});return r6.set(_,G),G}function p6(_="Loading…"){return F`
        <div class="settings-loading settings-loading-pane" role="status" aria-live="polite">
            <span class="settings-spinner"></span>
            <span>${_}</span>
        </div>
    `}function LL({onClose:_}){J5("SettingsDialogContent-render-start");let[$,j]=f(()=>d7()||"general"),[G,Z]=f(ZL),[X,Y]=f(null),[L,V]=f(""),[,q]=f(0),[Q,K]=f(()=>Object.fromEntries(d6.entries())),[B,N]=f(null),[U,D]=f({compact:!1,narrow:!1}),H=g(null),E=g(null);u(()=>{J5("SettingsDialogContent-mounted"),vW()},[]),u(()=>{let J=(C)=>{if(C.key==="Escape")_()};return window.addEventListener("keydown",J),()=>window.removeEventListener("keydown",J)},[_]),u(()=>{let J=(C)=>{let P=typeof C?.detail?.section==="string"?C.detail.section.trim():"";if(P)j(P),V("")};return window.addEventListener("piclaw:open-settings",J),()=>window.removeEventListener("piclaw:open-settings",J)},[]),u(()=>{let J=()=>q((C)=>C+1);return window.addEventListener("piclaw:settings-panes-changed",J),()=>window.removeEventListener("piclaw:settings-panes-changed",J)},[]),u(()=>{fetch("/agent/settings-data").then((J)=>J.json()).then((J)=>{ZL=J,Z(J)}).catch(()=>Z({}))},[]),u(()=>{let J=E.current;if(!J)return;let C=()=>{let P=J.clientWidth||0;D((b)=>{let m={compact:P>0&&P<=860,narrow:P>0&&P<=720};return b.compact===m.compact&&b.narrow===m.narrow?b:m})};if(C(),typeof ResizeObserver==="function"){let P=new ResizeObserver(()=>C());return P.observe(J),()=>P.disconnect()}return window.addEventListener("resize",C),()=>window.removeEventListener("resize",C)},[]);let k=[...YL].sort((J,C)=>(J.order??500)-(C.order??500)),O=tX().map((J)=>({id:J.id,label:J.label,icon:J.icon,searchable:J.searchable||!1,placeholder:J.searchPlaceholder,order:J.order??500,isExtension:!0,component:J.component})).sort(i7),I=[...k,...O],x=I.find((J)=>J.id===$)||YL.find((J)=>J.id===$);u(()=>{if(x?.searchable)requestAnimationFrame(()=>H.current?.focus())},[$]),u(()=>{if(x?.isExtension){N(null);return}let J=!1;if(Q[$]){N(null);return}return N($),lW($).then((C)=>{if(J)return;K((P)=>P?.[$]?P:{...P||{},[$]:C})}).catch((C)=>{if(J)return;console.error(`[settings-dialog] Failed to lazy-load section "${$}".`,C)}).finally(()=>{if(!J)N((C)=>C===$?null:C)}),()=>{J=!0}},[$,x?.isExtension,Q]);let A=R((J,C="info")=>{Y(J?{text:J,type:C}:null)},[]),y=R((J)=>{j(J),V("");let C=cW[J];if(C&&!XL.has(J))XL.add(J),C().then(()=>q((P)=>P+1)).catch((P)=>{})},[]),W=R((J)=>{Z((C)=>({...C||{},...J||{}}))},[]),M=()=>{if(x?.isExtension){if(!x.component)return p6("Loading pane…");let C=x.component;return F`<${C} filter=${L} />`}let J=Q[$];if(!J||B===$)return p6(`Loading ${x?.label||"settings"}…`);switch($){case"general":return F`<${J} settingsData=${G} setStatus=${A} mergeSettingsData=${W} />`;case"sessions":return F`<${J} settingsData=${G} setStatus=${A} mergeSettingsData=${W} />`;case"compaction":return F`<${J} settingsData=${G} setStatus=${A} mergeSettingsData=${W} />`;case"keyboard":return F`<${J} filter=${L} setStatus=${A} />`;case"workspace":return F`<${J} settingsData=${G} setStatus=${A} mergeSettingsData=${W} />`;case"environment":return F`<${J} settingsData=${G} filter=${L} setStatus=${A} mergeSettingsData=${W} />`;case"providers":return F`<${J} providers=${G?.providers} setStatus=${A} />`;case"models":return F`<${J} filter=${L} />`;case"theme":return F`<${J} themes=${G?.themes} colorKeys=${G?.colorKeys} settingsData=${G} setStatus=${A} mergeSettingsData=${W} />`;case"scheduled-tasks":return F`<${J} filter=${L} setStatus=${A} />`;case"quick-actions":return F`<${J} filter=${L} setStatus=${A} mergeSettingsData=${W} />`;case"keychain":return F`<${J} filter=${L} />`;case"tools":return F`<${J} toolsets=${G?.toolsets} filter=${L} settingsData=${G} mergeSettingsData=${W} />`;case"addons":return F`<${J} setStatus=${A} filter=${L} />`;default:return p6("Loading settings…")}},T=!x;return J5("SettingsDialogContent-render-end"),F`
        <div class="settings-dialog-backdrop" onClick=${(J)=>{if(J.target===J.currentTarget)_()}}>
            <div ref=${E} data-testid="settings-dialog" class=${`settings-dialog${U.compact?" settings-dialog-compact":""}${U.narrow?" settings-dialog-narrow":""}`}>
                <div class="settings-dialog-header">
                    <span class="settings-dialog-title">Settings</span>
                    ${x?.searchable&&F`
                        <input ref=${H} type="text" class="settings-header-filter"
                            placeholder=${x.placeholder||"Filter…"}
                            value=${L} onInput=${(J)=>V(J.target.value)} />
                    `}
                    <button class="settings-dialog-close" onClick=${_} title="Close (Esc)">✕</button>
                </div>
                <div class="settings-dialog-body">
                    <nav class="settings-nav">
                        ${I.map((J,C)=>{let P=C>0&&!I[C-1].isExtension,b=J.isExtension&&P;return F`
                                ${b&&F`<div class="settings-nav-separator"></div>`}
                                <button class=${`settings-nav-item ${J.id===$?"active":""}`} onClick=${()=>y(J.id)}>
                                    <span class="settings-nav-icon">${J.icon}</span>
                                    <span class="settings-nav-label">${J.label}</span>
                                </button>
                            `})}
                    </nav>
                    <main class="settings-content">
                        ${T?p6("Loading settings…"):M()}
                    </main>
                </div>
                ${X&&F`
                    <div class=${`settings-status-bar settings-status-bar-${X.type}`}>
                        ${X.type==="info"&&F`<span class="settings-spinner"></span>`}
                        <span>${X.text}</span>
                        ${X.type!=="info"&&F`<button class="settings-status-dismiss" onClick=${()=>Y(null)}>✕</button>`}
                    </div>
                `}
            </div>
        </div>
    `}function GO(){let[_,$]=f(!1);if(u(()=>{let j=(Z)=>{let X=W2(Z?.detail?.section);if(X)try{window.__piclawSettingsRequestedSection=X}catch(Y){}$(!0)};window.addEventListener("piclaw:open-settings",j);let G=R6();if(G.open){if(G.section)try{window.__piclawSettingsRequestedSection=G.section}catch(Z){}$(!0)}return()=>window.removeEventListener("piclaw:open-settings",j)},[]),!_)return null;return F`<${p$} className="settings-portal"><${LL} onClose=${()=>$(!1)} /><//>`}function ZO(_={}){o1(_)}var z5,ZL=null,d6,r6,mW,cW,XL,hW,nW,rW,pW,dW,iW,oW,sW,aW,tW,eW,_O,$O,jO,YL;var VL=J_(()=>{M0();S6();O2();qY();z5=[];J5("module-eval-start");J5("imports-done");d6=new Map,r6=new Map;d6.set("general",t7);mW={general:()=>Promise.resolve(t7),sessions:()=>Promise.resolve().then(() => (QY(),KY)).then((_)=>_.SessionsSection),compaction:()=>Promise.resolve().then(() => (BY(),NY)).then((_)=>_.CompactionSection),keyboard:()=>Promise.resolve().then(() => (OY(),WY)).then((_)=>_.KeyboardSection),workspace:()=>Promise.resolve().then(() => (MY(),yY)).then((_)=>_.WorkspaceSection),environment:()=>Promise.resolve().then(() => (TY(),wY)).then((_)=>_.EnvironmentSection),providers:()=>Promise.resolve().then(() => (IY(),xY)).then((_)=>_.ProvidersSection),models:()=>Promise.resolve().then(() => (fY(),CY)).then((_)=>_.ModelsSection),theme:()=>Promise.resolve().then(() => (SY(),RY)).then((_)=>_.ThemeSection),"scheduled-tasks":()=>Promise.resolve().then(() => (bY(),gY)).then((_)=>_.ScheduledTasksSection),"quick-actions":()=>Promise.resolve().then(() => (pY(),rY)).then((_)=>_.QuickActionsSection),keychain:()=>Promise.resolve().then(() => (iY(),dY)).then((_)=>_.KeychainSection),tools:()=>Promise.resolve().then(() => (sY(),oY)).then((_)=>_.ToolsSection),addons:()=>Promise.resolve().then(() => (tY(),aY)).then((_)=>_.AddonsSection)},cW={"editor-settings":()=>Promise.resolve().then(() => (eY(),IW)).then(()=>{}),"mindmap-settings":()=>Promise.resolve().then(() => (jL(),SW)).then(()=>{}),developer:()=>Promise.resolve().then(() => (GL(),bW)).then(()=>{})},XL=new Set;hW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M8.5 5.9L9.6 2.3h4.8l1.1 3.6 3.7-.8 2.4 4.1-2.6 2.8 2.6 2.8-2.4 4.1-3.7-.8-1.1 3.6H9.6l-1.1-3.6-3.7.8-2.4-4.1L5 12 2.4 9.2l2.4-4.1z"/></svg>`,nW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,rW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 10 9 10"/><path d="M12 7v5l3 3"/></svg>`,pW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,dW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/><path d="M8 7v10"/><path d="M16 7v10"/></svg>`,iW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01"/><path d="M10 9h.01"/><path d="M14 9h.01"/><path d="M18 9h.01"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M7 17h10"/></svg>`,oW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,sW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="14" height="10" rx="2"/><circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none"/><line x1="12" y1="9" x2="12" y2="5"/><circle cx="12" cy="4" r="1.5"/></svg>`,aW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.53-.21-1.01-.55-1.36-.34-.36-.55-.84-.55-1.37 0-1.1.9-2 2-2h2.36c3.08 0 5.64-2.56 5.64-5.64C22.9 5.85 18.05 2 12 2z"/><circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none"/></svg>`,tW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M7 3.5 4 6"/><path d="m17 3.5 3 2.5"/></svg>`,eW=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,_O=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,$O=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="14" r="3"/><path d="M11 14h9"/><path d="M16 14v-2"/><path d="M19 14v2"/></svg>`,jO=F`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,YL=[{id:"general",label:"General",icon:hW,searchable:!1,order:10},{id:"sessions",label:"Sessions",icon:nW,searchable:!1,order:12},{id:"compaction",label:"Compaction",icon:rW,searchable:!1,order:13},{id:"keyboard",label:"Keyboard",icon:iW,searchable:!0,placeholder:"Filter shortcuts…",order:14},{id:"workspace",label:"Workspace",icon:pW,searchable:!1,order:15},{id:"environment",label:"Environment",icon:dW,searchable:!0,placeholder:"Filter environment…",order:16},{id:"providers",label:"Providers",icon:oW,searchable:!1,order:20},{id:"models",label:"Models",icon:sW,searchable:!0,placeholder:"Filter models…",order:30},{id:"theme",label:"Appearance",icon:aW,searchable:!1,order:40},{id:"scheduled-tasks",label:"Scheduled Tasks",icon:tW,searchable:!0,placeholder:"Filter scheduled tasks…",order:65},{id:"quick-actions",label:"Quick Actions",icon:_O,searchable:!0,placeholder:"Filter quick actions…",order:70},{id:"keychain",label:"Keychain",icon:$O,searchable:!0,placeholder:"Filter entries…",order:75},{id:"tools",label:"Tools",icon:eW,searchable:!0,placeholder:"Filter tools…",order:80},{id:"addons",label:"Add-ons",icon:jO,searchable:!0,placeholder:"Filter add-ons…",order:90}]});M0();class zG{extensions=new Map;register(_){this.extensions.set(_.id,_)}unregister(_){this.extensions.delete(_)}resolve(_){let $,j=-1/0;for(let G of this.extensions.values()){if(G.placement!=="tabs")continue;if(!G.canHandle)continue;try{let Z=G.canHandle(_);if(Z===!1||Z===0)continue;let X=Z===!0?0:typeof Z==="number"?Z:0;if(X>j)j=X,$=G}catch(Z){console.warn(`[PaneRegistry] canHandle() error for "${G.id}":`,Z)}}return $}list(){return Array.from(this.extensions.values())}getDockPanes(){return Array.from(this.extensions.values()).filter((_)=>_.placement==="dock")}getTabPanes(){return Array.from(this.extensions.values()).filter((_)=>_.placement==="tabs")}get(_){return this.extensions.get(_)}get size(){return this.extensions.size}}var X_=new zG;var j6=null,E3=null;function gF(){try{return`/static/dist/editor.bundle.js${new URL(import.meta.url).search||""}`}catch{return"/static/dist/editor.bundle.js"}}function JG(){if(E3)return Promise.resolve(E3);if(!j6)j6=import(gF()).then((_)=>{return E3=_,_}).catch((_)=>{throw j6=null,_});return j6}class AG{container;context;real=null;disposed=!1;loadingEl;queuedDirtyCb=null;queuedSaveCb=null;queuedCloseCb=null;queuedViewStateCb=null;queuedViewState=null;queuedDiffMode=void 0;constructor(_,$){this.container=_,this.context=$,this.loadingEl=document.createElement("div"),this.loadingEl.className="editor-pane",this.loadingEl.innerHTML=`
            <div class="editor-body">
                <div class="editor-status" style="padding: 2em; text-align: center; color: var(--text-secondary);">Loading editor…</div>
            </div>
        `,_.appendChild(this.loadingEl),this.load()}escapeHtml(_){let $=document.createElement("div");return $.textContent=_,$.innerHTML}async load(){try{let _=await JG();if(this.disposed)return;if(this.loadingEl.parentNode)this.loadingEl.remove();if(this.real=new _.StandaloneEditorInstance(this.container,this.context),this.queuedDirtyCb&&this.real.onDirtyChange)this.real.onDirtyChange(this.queuedDirtyCb);if(this.queuedSaveCb&&this.real.onSaveRequest)this.real.onSaveRequest(this.queuedSaveCb);if(this.queuedCloseCb&&this.real.onClose)this.real.onClose(this.queuedCloseCb);if(this.queuedViewStateCb&&typeof this.real.onViewStateChange==="function")this.real.onViewStateChange(this.queuedViewStateCb);if(this.queuedViewState&&typeof this.real.restoreViewState==="function")requestAnimationFrame(()=>this.real?.restoreViewState?.(this.queuedViewState));if(this.queuedDiffMode!==void 0&&typeof this.real.setDiffMode==="function")this.real.setDiffMode(this.queuedDiffMode)}catch(_){if(this.disposed)return;console.error("[editor-loader] Failed to load editor bundle:",_),this.loadingEl.querySelector(".editor-status").textContent="Failed to load editor. Check console for details."}}getContent(){return this.real?.getContent()}isDirty(){return this.real?.isDirty()||!1}setContent(_,$){if(this.real?.setContent)this.real.setContent(_,$)}focus(){this.real?.focus()}resize(){this.real?.resize?.()}dispose(){if(this.disposed)return;if(this.disposed=!0,this.real)this.real.dispose(),this.real=null;this.container.innerHTML="",this.queuedDirtyCb=null,this.queuedSaveCb=null,this.queuedCloseCb=null,this.queuedViewStateCb=null}onDirtyChange(_){if(this.queuedDirtyCb=_,this.real?.onDirtyChange)this.real.onDirtyChange(_)}onSaveRequest(_){if(this.queuedSaveCb=_,this.real?.onSaveRequest)this.real.onSaveRequest(_)}onClose(_){if(this.queuedCloseCb=_,this.real?.onClose)this.real.onClose(_)}beforeDetachFromHost(_){return this.real?.beforeDetachFromHost?.(_)}afterAttachToHost(_){return this.real?.afterAttachToHost?.(_)}moveHost(_,$){return this.real?.moveHost?.(_,$)??!1}exportHostTransferState(){return this.real?.exportHostTransferState?.()??null}onViewStateChange(_){this.queuedViewStateCb=_,this.real?.onViewStateChange?.(_)}restoreViewState(_){this.queuedViewState=_,this.real?.restoreViewState?.(_)}getPath(){return this.real?.getPath?.()??this.context.path??""}setPath(_){this.real?.setPath?.(_)}setDiffMode(_){this.queuedDiffMode=_,this.real?.setDiffMode?.(_)}}var H3={id:"editor",label:"Editor",icon:"edit",capabilities:["edit"],placement:"tabs",canHandle(_){if(!_.path)return!1;if(_.mode!=="edit")return!1;return 1},mount(_,$){return new AG(_,$)}};function D3(){JG().catch((_)=>{console.warn("[editor-loader] Background preload failed; the editor will retry on demand.",_)})}function kG(_){try{return typeof _?.crypto?.randomUUID==="function"?_.crypto.randomUUID():null}catch($){return null}}function G6(_,$){try{return _?.removeItem?.($),!0}catch(j){return!1}}var yG="piclaw:editor-popout:",bF=300000;function MG(_){try{return _?.localStorage??null}catch{return null}}function vF(_=Date.now()){return`editor-popout-${_.toString(36)}-${Math.random().toString(36).slice(2,10)}`}function wG(_){return typeof _==="string"?_.trim():""}function TG(_){return(typeof _==="string"?_.trim():"")||null}function xG(_){return typeof _==="string"?_:void 0}function IG(_){if(_===void 0)return;if(typeof _!=="string")return null;return _.trim()||null}function CG(_){if(!_||typeof _!=="object")return null;let $=_,j={};if(typeof $.cursorLine==="number"&&Number.isFinite($.cursorLine))j.cursorLine=$.cursorLine;if(typeof $.cursorCol==="number"&&Number.isFinite($.cursorCol))j.cursorCol=$.cursorCol;if(typeof $.scrollTop==="number"&&Number.isFinite($.scrollTop))j.scrollTop=$.scrollTop;return Object.keys(j).length>0?j:null}function G2(_,$=globalThis){let j=$?.window??$;if(!j?.location?.href)return null;try{let G=new URL(j.location.href),Z=G.searchParams.get(_)?.trim()||"";if(!Z)return null;return G.searchParams.delete(_),j.history?.replaceState?.(j.history.state,j.document?.title||"",G.toString()),Z}catch{return null}}function mF(_,$=globalThis,j=Date.now()){let G=MG($),Z=wG(_?.path);if(!G||!Z)return null;let X={path:Z,content:xG(_?.content),mtime:IG(_?.mtime),paneOverrideId:TG(_?.paneOverrideId),viewState:CG(_?.viewState),capturedAt:j};if(!Boolean(X.content!==void 0||X.paneOverrideId||X.viewState||X.mtime))return null;let L=vF(j);try{return G.setItem(`${yG}${L}`,JSON.stringify(X)),L}catch{return null}}function W3(_,$=globalThis,j=Date.now()){let G=typeof _==="string"?_.trim():"",Z=MG($);if(!G||!Z)return null;let X=`${yG}${G}`,Y="";try{Y=Z.getItem(X)||""}catch{return null}if(!Y)return null;G6(Z,X);try{let L=JSON.parse(Y),V=typeof L?.capturedAt==="number"&&Number.isFinite(L.capturedAt)?L.capturedAt:j;if(V+bF<j)return null;let q=wG(L?.path);if(!q)return null;return{path:q,content:xG(L?.content),mtime:IG(L?.mtime),paneOverrideId:TG(L?.paneOverrideId),viewState:CG(L?.viewState),capturedAt:V}}catch{return null}}function Z6(_,$=globalThis,j=Date.now()){let G=mF(_,$,j);return G?{editor_popout:G}:null}function w1(_){try{return _(),!0}catch($){return!1}}function fG(_){let{ownerWindow:$,themeChangeListener:j,mediaQuery:G,mediaQueryListener:Z,dockResizeListener:X,windowResizeListener:Y,themeObserver:L,resizeObserver:V}=_;w1(()=>{if(j)$?.removeEventListener?.("piclaw-theme-change",j)}),w1(()=>{if(G&&Z){if(G.removeEventListener)G.removeEventListener("change",Z);else if(G.removeListener)G.removeListener(Z)}}),w1(()=>{if(X)$?.removeEventListener?.("dock-resize",X);if(Y)$?.removeEventListener?.("resize",Y)}),w1(()=>{L?.disconnect?.()}),w1(()=>{V?.disconnect?.()})}function PG(_){_.syncHostLayout(),w1(()=>{_.terminal?.renderer?.remeasureFont?.()}),w1(()=>{_.fitAddon?.fit?.()}),w1(()=>{_.terminal?.refresh?.()}),_.syncHostLayout(),_.sendResize()}function RG(_){let{resizeFrame:$=0,cancelAnimationFrameFn:j=cancelAnimationFrame,socket:G,fitAddon:Z,terminal:X,termEl:Y}=_;if($)w1(()=>{j($)});return w1(()=>{G?.close?.()}),w1(()=>{Z?.dispose?.()}),w1(()=>{X?.dispose?.()}),Y?.remove?.(),0}function h1(_){try{return _(),!0}catch($){return!1}}function SG(_){let{termEl:$,bodyEl:j,terminal:G,theme:Z,themeChanged:X=!1,socket:Y,resize:L}=_;if(h1(()=>{if($?.style)$.style.backgroundColor=Z.background,$.style.color=Z.foreground;if(j?.style)j.style.backgroundColor=Z.background,j.style.color=Z.foreground;let V=j?.querySelector?.(".terminal-live-host");if(V&&typeof V==="object"&&"style"in V)V.style.backgroundColor=Z.background,V.style.color=Z.foreground;let q=j?.querySelector?.("canvas");if(q&&typeof q==="object"&&"style"in q)q.style.backgroundColor=Z.background,q.style.color=Z.foreground}),h1(()=>{if(G?.options)G.options.theme=Z}),X)h1(()=>{G?.reset?.()});h1(()=>{G?.renderer?.setTheme?.(Z),G?.renderer?.clear?.()}),h1(()=>{G?.loadFonts?.()}),h1(()=>{G?.renderer?.remeasureFont?.()}),h1(()=>{if(G?.wasmTerm&&G?.renderer?.render)G.renderer.render(G.wasmTerm,!0,G.viewportY||0,G),G.renderer.render(G.wasmTerm,!1,G.viewportY||0,G)}),h1(()=>{L?.()}),h1(()=>{if(X&&Y?.readyState===1)Y.send?.(JSON.stringify({type:"input",data:"\f"}))}),h1(()=>{G?.refresh?.()})}var cF="/static/js/vendor/ghostty-web.js",lF="/static/js/vendor/ghostty-vt.wasm",X2="piclaw://terminal",hF='FiraCode Nerd Font Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',nF='400 13px "FiraCode Nerd Font Mono"',rF='700 13px "FiraCode Nerd Font Mono"',cG="x-piclaw-terminal-client",uG="piclaw_terminal_client",pF={yellow:"#9a6700",magenta:"#8250df",cyan:"#1b7c83",brightBlack:"#57606a",brightRed:"#cf222e",brightGreen:"#1a7f37",brightYellow:"#bf8700",brightBlue:"#0550ae",brightMagenta:"#6f42c1",brightCyan:"#0a7b83"},dF={yellow:"#d29922",magenta:"#bc8cff",cyan:"#39c5cf",brightBlack:"#8b949e",brightRed:"#ff7b72",brightGreen:"#7ee787",brightYellow:"#e3b341",brightBlue:"#79c0ff",brightMagenta:"#d2a8ff",brightCyan:"#56d4dd"},X6=null,O3=null;function iF(_){if(!_)return!1;return _.startsWith("data:application/wasm")||/(^|\/)ghostty-vt\.wasm(?:[?#].*)?$/.test(_)}async function oF(_){let $=globalThis.fetch?.bind(globalThis);if(!$)return await _();let j=new URL(lF,window.location.origin).href,G=(Z,X)=>{let Y=Z instanceof Request?Z.url:Z instanceof URL?Z.href:String(Z);if(!iF(Y))return $(Z,X);if(Z instanceof Request)return $(new Request(j,Z));return $(j,X)};globalThis.fetch=G;try{return await _()}finally{globalThis.fetch=$}}async function sF(){let $=await import(new URL(cF,window.location.origin).href);if(!X6)X6=oF(()=>Promise.resolve($.init?.())).catch((j)=>{throw X6=null,j});return await X6,$}async function aF(){if(typeof document>"u"||!("fonts"in document)||!document.fonts)return;if(!O3)O3=Promise.allSettled([document.fonts.load(nF),document.fonts.load(rF),document.fonts.ready]).then(()=>{return}).catch(()=>{return});await O3}function gG(_=typeof window<"u"?window:null){try{if(typeof _?.crypto?.randomUUID==="function")return _.crypto.randomUUID()}catch($){console.debug("[terminal-pane] Failed to generate crypto-backed terminal client token; falling back.",$)}return`terminal-client-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`}function J3(_=typeof window<"u"?window:null){if(!_)return null;try{let $=_.localStorage,j=typeof $?.getItem==="function"?String($.getItem(uG)||"").trim():"";if(j)return j;let G=gG(_);return $?.setItem?.(uG,G),G}catch($){return gG(_)}}async function tF(_=J3()){let $=await fetch("/terminal/session",{method:"GET",credentials:"same-origin",headers:_?{[cG]:_}:void 0}),j=await $.json().catch(()=>({}));if(!$.ok)throw Error(j?.error||`HTTP ${$.status}`);return j}async function eF(_=J3()){let $=await fetch("/terminal/handoff",{method:"POST",credentials:"same-origin",headers:_?{[cG]:_}:void 0}),j=await $.json().catch(()=>({}));if(!$.ok)throw Error(j?.error||`HTTP ${$.status}`);return typeof j?.handoff?.token==="string"&&j.handoff.token.trim()?j.handoff.token.trim():null}function _U(_,$=null,j=J3()){let G=window.location.protocol==="https:"?"wss:":"ws:",Z=new URL(`${G}//${window.location.host}${_}`);if($)Z.searchParams.set("handoff",String($));if(j)Z.searchParams.set("client",String(j));return Z.toString()}function $U(_=typeof window<"u"?window:null,$=typeof document<"u"?document:null){if(!_||!$)return!1;let{documentElement:j,body:G}=$,Z=j?.getAttribute?.("data-theme")?.toLowerCase?.()||"";if(Z==="dark")return!0;if(Z==="light")return!1;if(j?.classList?.contains("dark")||G?.classList?.contains("dark"))return!0;if(j?.classList?.contains("light")||G?.classList?.contains("light"))return!1;return Boolean(_.matchMedia?.("(prefers-color-scheme: dark)")?.matches)}function F4(_,$="",j=typeof document<"u"?document:null){if(!j)return $;return getComputedStyle(j.documentElement).getPropertyValue(_)?.trim()||$}function Z2(_){let $=String(_||"").trim();if(!$)return null;let j=$.startsWith("#")?$.slice(1):$;if(/^[0-9a-fA-F]{3}$/.test(j)||/^[0-9a-fA-F]{6}$/.test(j)){let Z=j.length===3?j.split("").map((Y)=>Y+Y).join(""):j,X=parseInt(Z,16);return{r:X>>16&255,g:X>>8&255,b:X&255}}let G=$.match(/rgba?\(\s*(\d+)[,\s]\s*(\d+)[,\s]\s*(\d+)/i);if(G)return{r:parseInt(G[1],10),g:parseInt(G[2],10),b:parseInt(G[3],10)};return null}function bG(_){let $=(j)=>{let G=j/255;return G<=0.03928?G/12.92:Math.pow((G+0.055)/1.055,2.4)};return 0.2126*$(_.r)+0.7152*$(_.g)+0.0722*$(_.b)}function p2(_,$){let j=bG(_),G=bG($),Z=Math.max(j,G),X=Math.min(j,G);return(Z+0.05)/(X+0.05)}function lG(_){let $=Z2(_);if(!$)return"#ffffff";let j={r:255,g:255,b:255},G={r:0,g:0,b:0};return p2($,j)>=p2($,G)?"#ffffff":"#000000"}function Y6(_){let $=(j)=>Math.max(0,Math.min(255,Math.round(j||0)));return`#${[_.r,_.g,_.b].map((j)=>$(j).toString(16).padStart(2,"0")).join("")}`}function vG(_,$,j){let G=Math.max(0,Math.min(1,Number.isFinite(j)?j:0));return{r:_.r+($.r-_.r)*G,g:_.g+($.g-_.g)*G,b:_.b+($.b-_.b)*G}}function G1(_,$,j=4.5){let G=Z2(_),Z=Z2($);if(!G||!Z)return $;if(p2(G,Z)>=j)return Y6(Z);let X=Z2(lG(_));if(!X)return Y6(Z);let Y=X,L=1,V=0,q=1;for(let B=0;B<14;B+=1){let N=(V+q)/2,U=vG(Z,X,N);if(p2(G,U)>=j)Y=U,L=N,q=N;else V=N}let Q=Y6(Y),K=Z2(Q);while(K&&p2(G,K)<j&&L<1)L=Math.min(1,L+0.01),Q=Y6(vG(Z,X,L)),K=Z2(Q);return Q}function jU(_,$){if(!_||!_.startsWith("#"))return _;let j=_.slice(1);if(j.length===3)return`#${j[0]}${j[0]}${j[1]}${j[1]}${j[2]}${j[2]}${$}`;if(j.length===6)return`#${j}${$}`;return _}function mG(_=typeof window<"u"?window:null,$=typeof document<"u"?document:null){let j=$U(_,$),G=j?dF:pF,Z=F4("--bg-primary",j?"#000000":"#ffffff",$),X=F4("--text-primary",j?"#e7e9ea":"#0f1419",$),Y=G1(Z,X||lG(Z),7),L=F4("--accent-color","#1d9bf0",$),V=F4("--danger-color",j?"#ff7b72":"#cf222e",$),q=F4("--success-color",j?"#7ee787":"#1a7f37",$),Q=F4("--bg-hover",j?"#1d1f23":"#e8ebed",$),K=F4("--accent-soft-strong",jU(L,j?"47":"33"),$);return{background:Z,foreground:Y,cursor:G1(Z,L,3),cursorAccent:Z,selectionBackground:K,selectionForeground:Y,black:G1(Z,Q,3),red:G1(Z,V,4.5),green:G1(Z,q,4.5),yellow:G1(Z,G.yellow,4.5),blue:G1(Z,L,4.5),magenta:G1(Z,G.magenta,4.5),cyan:G1(Z,G.cyan,4.5),white:Y,brightBlack:G1(Z,G.brightBlack,3),brightRed:G1(Z,G.brightRed,4.5),brightGreen:G1(Z,G.brightGreen,4.5),brightYellow:G1(Z,G.brightYellow,4.5),brightBlue:G1(Z,G.brightBlue,4.5),brightMagenta:G1(Z,G.brightMagenta,4.5),brightCyan:G1(Z,G.brightCyan,4.5),brightWhite:Y}}function hG(_){let $=_?.activeElement;if(!$||$===_?.body||$===_?.documentElement)return!1;if(typeof $.blur!=="function")return!1;return $.blur(),!0}function z3(_,$){let j=[_?.inputElement,_?.textarea,_?.container,$,$?.querySelector?.("textarea")].filter((G,Z,X)=>Boolean(G)&&X.indexOf(G)===Z);for(let G of j)try{let Z=G.ownerDocument?.defaultView||window,X=typeof Z.CompositionEvent==="function"?new Z.CompositionEvent("compositionend",{data:""}):new Z.Event("compositionend");G.dispatchEvent?.(X)}catch(Z){console.debug("[terminal-pane] Failed to dispatch best-effort IME composition reset.",Z)}if(_&&typeof _==="object")_.isComposing=!1,_.pendingKeyAfterComposition=null,_.compositionJustEnded=!1}function GU(_){if(hG(_.ownerDocument),z3(_.terminal,_.terminalHost||null),typeof _.terminal?.focus==="function")_.terminal.focus();else _.termEl?.focus?.();z3(_.terminal,_.terminalHost||null)}class A3{container;ownerDocument;ownerWindow;disposed=!1;termEl;bodyEl;statusEl;terminal=null;fitAddon=null;socket=null;themeObserver=null;themeChangeListener=null;mediaQuery=null;mediaQueryListener=null;resizeObserver=null;dockResizeListener=null;windowResizeListener=null;resizeFrame=0;resizeRetryTimers=new Set;lastAppliedThemeSignature=null;lastResizeSignature=null;pendingHandoffToken=null;standbyHandoffToken=null;standbyHandoffRequest=null;constructor(_,$){this.container=_,this.ownerDocument=_.ownerDocument||document,this.ownerWindow=this.ownerDocument.defaultView||window;let j=typeof $?.transferState?.handoffToken==="string"&&$.transferState.handoffToken.trim()?$.transferState.handoffToken.trim():null,G=G2("terminal_handoff");this.pendingHandoffToken=j||G||null,this.termEl=this.ownerDocument.createElement("div"),this.termEl.className="terminal-pane-content",this.termEl.setAttribute("tabindex","0"),this.termEl.setAttribute("inputmode","none"),this.statusEl=this.ownerDocument.createElement("span"),this.statusEl.className="terminal-pane-status",this.statusEl.textContent="Loading terminal…",this.bodyEl=this.ownerDocument.createElement("div"),this.bodyEl.className="terminal-pane-body",this.bodyEl.style.display="flex",this.bodyEl.style.flex="1 1 auto",this.bodyEl.style.minHeight="0",this.bodyEl.innerHTML='<div class="terminal-placeholder">Bootstrapping ghostty-web…</div>',this.termEl.append(this.bodyEl),_.appendChild(this.termEl),this.bootstrapGhostty()}setStatus(_){this.statusEl.textContent=_,this.termEl.dataset.connectionStatus=_,this.termEl.setAttribute("aria-label",`Terminal ${_}`)}getResizeSignature(){try{let _=this.container?.getBoundingClientRect?.(),$=this.bodyEl?.getBoundingClientRect?.(),j=Number.isFinite(_?.width)?_.width:0,G=Number.isFinite(_?.height)?_.height:0,Z=Number.isFinite($?.width)?$.width:0,X=Number.isFinite($?.height)?$.height:0;return`${Math.round(j)}x${Math.round(G)}:${Math.round(Z)}x${Math.round(X)}`}catch{return"0x0:0x0"}}syncHostLayout(){let _=this.bodyEl.querySelector(".terminal-live-host");if(!(_ instanceof HTMLElement))return;_.style.display="flex",_.style.flex="1 1 auto",_.style.width="100%",_.style.height="100%",_.style.minWidth="0",_.style.minHeight="0",_.style.overflow="hidden";let $=_.firstElementChild;if($ instanceof HTMLElement)$.style.width="100%",$.style.height="100%",$.style.maxWidth="100%",$.style.minWidth="0",$.style.minHeight="0",$.style.flex="1 1 auto",$.style.display="block";let j=_.querySelector("canvas");if(j instanceof HTMLElement)j.style.display="block",j.style.maxWidth="none",j.style.maxHeight="none"}queueResizeRetries(_=[32,96,180,320,520,900]){if(this.disposed||!this.ownerWindow)return;this.clearResizeRetries();for(let $ of _){let j=this.ownerWindow.setTimeout(()=>{if(this.resizeRetryTimers.delete(j),this.disposed)return;this.scheduleResize(!0)},$);this.resizeRetryTimers.add(j)}}clearResizeRetries(){if(!this.ownerWindow||this.resizeRetryTimers.size===0)return;for(let _ of Array.from(this.resizeRetryTimers))try{this.ownerWindow.clearTimeout(_)}catch($){console.debug("[terminal-pane] Ignoring timeout clear failure during resize retry drain.",$,{timer:_})}this.resizeRetryTimers.clear()}scheduleResize(_=!1){if(this.disposed)return;let $=this.getResizeSignature();if(!_&&this.lastResizeSignature===$)return;if(this.resizeFrame)cancelAnimationFrame(this.resizeFrame);this.resizeFrame=requestAnimationFrame(()=>{this.resizeFrame=0,this.lastResizeSignature=this.getResizeSignature(),this.resize()})}async bootstrapGhostty(){try{let _=await sF();if(await aF(),this.disposed)return;this.bodyEl.innerHTML="";let $=this.ownerDocument.createElement("div");$.className="terminal-live-host",$.style.display="flex",$.style.flex="1 1 auto",$.style.width="100%",$.style.height="100%",$.style.minWidth="0",$.style.minHeight="0",$.setAttribute("inputmode","none"),this.bodyEl.appendChild($);let j=new _.Terminal({cols:120,rows:30,cursorBlink:!0,fontFamily:hF,fontSize:13,theme:mG(this.ownerWindow,this.ownerDocument)}),G=null;if(typeof _.FitAddon==="function")G=new _.FitAddon,j.loadAddon?.(G);hG(this.ownerDocument),await j.open($),$.__terminal=j,z3(j,$),this.syncHostLayout(),j.loadFonts?.(),G?.observeResize?.(),this.terminal=j,this.fitAddon=G,this.installThemeSync(),this.installResizeSync(),this.scheduleResize(!0),this.queueResizeRetries([32,96,180,320]),await this.connectBackend()}catch(_){if(console.error("[terminal-pane] Failed to bootstrap ghostty-web:",_),this.disposed)return;this.bodyEl.innerHTML='<div class="terminal-placeholder">Terminal failed to load. Check vendored assets and backend wiring.</div>',this.setStatus("Load failed")}}applyTheme(){if(!this.terminal)return;let _=mG(this.ownerWindow,this.ownerDocument),$=JSON.stringify(_),j=this.lastAppliedThemeSignature!==null&&this.lastAppliedThemeSignature!==$;SG({termEl:this.termEl,bodyEl:this.bodyEl,terminal:this.terminal,theme:_,themeChanged:j,socket:this.socket,resize:()=>this.resize()}),this.lastAppliedThemeSignature=$}installThemeSync(){if(!this.ownerWindow||!this.ownerDocument)return;let _=()=>requestAnimationFrame(()=>this.applyTheme());_();let $=()=>_();this.ownerWindow.addEventListener("piclaw-theme-change",$),this.themeChangeListener=$;let j=this.ownerWindow.matchMedia?.("(prefers-color-scheme: dark)"),G=()=>_();if(j?.addEventListener)j.addEventListener("change",G);else if(j?.addListener)j.addListener(G);this.mediaQuery=j,this.mediaQueryListener=G;let Z=typeof MutationObserver<"u"?new MutationObserver(()=>_()):null;if(Z?.observe(this.ownerDocument.documentElement,{attributes:!0,attributeFilter:["class","data-theme","style"]}),this.ownerDocument.body)Z?.observe(this.ownerDocument.body,{attributes:!0,attributeFilter:["class","data-theme"]});this.themeObserver=Z}installResizeSync(){if(!this.ownerWindow)return;let _=()=>this.scheduleResize(),$=()=>this.scheduleResize();if(this.ownerWindow.addEventListener("dock-resize",_),this.ownerWindow.addEventListener("resize",$),this.dockResizeListener=_,this.windowResizeListener=$,typeof ResizeObserver<"u"){let j=new ResizeObserver(()=>{if(this.disposed)return;this.scheduleResize()});j.observe(this.container),j.observe(this.termEl),j.observe(this.bodyEl),this.resizeObserver=j}}consumeStandbyHandoffToken(){let _=this.standbyHandoffToken||null;return this.standbyHandoffToken=null,_}async ensureStandbyHandoffToken(_=!1){if(this.disposed)return null;if(!_&&this.standbyHandoffToken)return this.standbyHandoffToken;if(this.standbyHandoffRequest)return await this.standbyHandoffRequest;return this.standbyHandoffRequest=eF().then(($)=>{if(!$||this.disposed)return null;return this.standbyHandoffToken=$,$}).catch(($)=>{return console.warn("[terminal-pane] Failed to prepare standby handoff token:",$),null}).finally(()=>{this.standbyHandoffRequest=null}),await this.standbyHandoffRequest}async connectBackend(){let _=this.terminal;if(!_)return;try{let $=await tF();if(this.disposed)return;if(!$?.enabled){_.write?.(`Terminal backend unavailable: ${$?.error||"disabled"}\r
`),this.setStatus("Unavailable");return}let j=this.pendingHandoffToken||null,G=new WebSocket(_U($.ws_path||"/terminal/ws",j));this.socket=G,this.setStatus(j?"Transferring…":"Connecting…"),_.onData?.((Z)=>{if(G.readyState===WebSocket.OPEN)G.send(JSON.stringify({type:"input",data:Z}))}),_.onResize?.(({cols:Z,rows:X})=>{if(G.readyState===WebSocket.OPEN)G.send(JSON.stringify({type:"resize",cols:Z,rows:X}))}),G.addEventListener("open",()=>{if(this.disposed)return;if(j&&this.pendingHandoffToken===j)this.pendingHandoffToken=null;this.ensureStandbyHandoffToken(!1),this.setStatus("Connected"),this.scheduleResize(!0),this.queueResizeRetries([24,72,160,320])}),G.addEventListener("message",(Z)=>{if(this.disposed)return;let X=null;try{X=JSON.parse(String(Z.data))}catch{X={type:"output",data:String(Z.data)}}if(X?.type==="session"){let Y=typeof X.session_id==="string"?X.session_id:null;if(_.__piclawSessionMeta={sessionId:Y,createdAt:typeof X.created_at==="string"?X.created_at:null,processPid:typeof X.process_pid==="number"?X.process_pid:null},!this.standbyHandoffToken)this.ensureStandbyHandoffToken(!1);return}if(X?.type==="output"&&typeof X.data==="string"){_.write?.(X.data);return}if(X?.type==="exit")_.write?.(`\r
[terminal exited]\r
`),this.setStatus("Exited")}),G.addEventListener("close",()=>{if(this.disposed)return;this.setStatus("Disconnected")}),G.addEventListener("error",()=>{if(this.disposed)return;this.setStatus("Connection error")})}catch($){_.write?.(`Terminal backend unavailable: ${$ instanceof Error?$.message:String($)}\r
`),this.setStatus("Unavailable")}}sendResize(){if(!this.socket||this.socket.readyState!==WebSocket.OPEN||!this.fitAddon?.proposeDimensions)return;let _=this.fitAddon.proposeDimensions();if(!_)return;this.socket.send(JSON.stringify({type:"resize",cols:_.cols,rows:_.rows}))}detachHostListeners(){fG({ownerWindow:this.ownerWindow,themeChangeListener:this.themeChangeListener,mediaQuery:this.mediaQuery,mediaQueryListener:this.mediaQueryListener,dockResizeListener:this.dockResizeListener,windowResizeListener:this.windowResizeListener,themeObserver:this.themeObserver,resizeObserver:this.resizeObserver}),this.themeChangeListener=null,this.mediaQuery=null,this.mediaQueryListener=null,this.themeObserver=null,this.resizeObserver=null,this.dockResizeListener=null,this.windowResizeListener=null}beforeDetachFromHost(){this.setStatus("Moving terminal…")}afterAttachToHost(_){let $=typeof _?.transferState?.handoffToken==="string"&&_.transferState.handoffToken.trim()?_.transferState.handoffToken.trim():null;if($)this.pendingHandoffToken=$;if(this.installThemeSync(),this.installResizeSync(),this.socket?.readyState===WebSocket.OPEN)this.setStatus("Connected");else if(this.pendingHandoffToken)this.setStatus("Transferring…");else if(this.socket?.readyState===WebSocket.CONNECTING)this.setStatus("Connecting…");this.scheduleResize(!0),this.queueResizeRetries([32,96,180,320]),requestAnimationFrame(()=>this.focus())}moveHost(_){return!1}exportHostTransferState(){let _=this.standbyHandoffToken||this.pendingHandoffToken||null;return _?{kind:"terminal",live:!1,handoffToken:_}:null}async preparePopoutTransfer(){let _=this.consumeStandbyHandoffToken();if(!_)await this.ensureStandbyHandoffToken(!0),_=this.consumeStandbyHandoffToken();if(!_)return null;return this.pendingHandoffToken=_,{terminal_handoff:_}}getContent(){return}isDirty(){return!1}focus(){let _=this.bodyEl.querySelector(".terminal-live-host");GU({terminal:this.terminal,terminalHost:_,termEl:this.termEl,ownerDocument:this.ownerDocument})}resize(){PG({syncHostLayout:()=>this.syncHostLayout(),terminal:this.terminal,fitAddon:this.fitAddon,sendResize:()=>this.sendResize()})}dispose(){if(this.disposed)return;this.disposed=!0,this.standbyHandoffToken=null,this.standbyHandoffRequest=null,this.clearResizeRetries(),this.detachHostListeners(),this.resizeFrame=RG({resizeFrame:this.resizeFrame,socket:this.socket,fitAddon:this.fitAddon,terminal:this.terminal,termEl:this.termEl})}}var k3={id:"terminal",label:"Terminal",icon:"terminal",capabilities:["terminal"],placement:"dock",mount(_,$){return new A3(_,$)}},y3={id:"terminal-tab",label:"Terminal",icon:"terminal",capabilities:["terminal"],placement:"tabs",canHandle(_){return _?.path===X2?1e4:!1},mount(_,$){return new A3(_,$)}};function P1(_={}){let $=_.window??(typeof window<"u"?window:null),j=_.navigator??(typeof navigator<"u"?navigator:null);if(j&&j.standalone===!0)return!0;if(!$||typeof $.matchMedia!=="function")return!1;return["(display-mode: standalone)","(display-mode: minimal-ui)","(display-mode: fullscreen)"].some((Z)=>{try{return Boolean($.matchMedia(Z)?.matches)}catch{return!1}})}function L6(_={}){let $=_.window??(typeof window<"u"?window:null),j=_.navigator??(typeof navigator<"u"?navigator:null);if(!$&&!j)return!1;let G=String(j?.userAgent||""),Z=Number(j?.maxTouchPoints||0),X=/Android|webOS|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(G),Y=(()=>{if(!$||typeof $.matchMedia!=="function")return!1;try{return Boolean($.matchMedia("(pointer: coarse)")?.matches||$.matchMedia("(any-pointer: coarse)")?.matches)}catch{return!1}})();return Boolean(X||Z>1||Y)}function nG(_,$={}){if(P1($))return null;if(L6($))return{target:"_blank",features:void 0,mode:"tab"};return{target:ZU(_),features:"popup=yes,width=900,height=960,resizable=yes,scrollbars=yes",mode:"popup"}}function M3(_,$={}){let j=$.window??(typeof window<"u"?window:null);if(!j||!_)return null;try{return _.features?j.open("about:blank",_.target,_.features):j.open("about:blank",_.target)}catch{return null}}function w3(_,$={}){if(!_||!_.document)return;try{let j=String($.title||"Opening branch…"),G=String($.message||"Preparing a new branch window…");_.document.title=j;let Z=_.document.body;if(!Z)return;if(typeof _.document.createElement!=="function"){Z.textContent=`${j}
${G}`;return}let X=_.document.createElement("div");X.setAttribute("style","font-family: system-ui, sans-serif; padding: 24px; color: #222;");let Y=_.document.createElement("h1");Y.setAttribute("style","font-size: 18px; margin: 0 0 12px;"),Y.textContent=j;let L=_.document.createElement("p");if(L.setAttribute("style","margin: 0; line-height: 1.5;"),L.textContent=G,X.appendChild(Y),X.appendChild(L),typeof Z.replaceChildren==="function")Z.replaceChildren(X);else Z.innerHTML="",Z.appendChild(X)}catch{return}}function T3(_,$){if(!_||!$)return;try{if(_.location&&typeof _.location.replace==="function"){_.location.replace(String($));return}_.location=String($)}catch{return}}function x3(_){if(!_||typeof _.close!=="function")return;try{_.close()}catch{return}}function T1(_,$,j={}){let G=new URL(String(_||"http://localhost/")),Z=String($||"").trim()||"web:default";if(G.searchParams.set("chat_jid",Z),G.searchParams.delete("branch_loader"),G.searchParams.delete("branch_source_chat_jid"),G.searchParams.delete("pane_popout"),G.searchParams.delete("pane_path"),G.searchParams.delete("pane_label"),j.chatOnly!==!1)G.searchParams.set("chat_only","1");return G.toString()}function I3(_,$,j={}){let G=new URL(String(_||"http://localhost/")),Z=String($||"").trim()||"web:default";if(G.searchParams.set("branch_loader","1"),G.searchParams.set("branch_source_chat_jid",Z),G.searchParams.delete("chat_jid"),G.searchParams.delete("pane_popout"),G.searchParams.delete("pane_path"),G.searchParams.delete("pane_label"),j.chatOnly!==!1)G.searchParams.set("chat_only","1");return G.toString()}function rG(_,$,j={}){let G=new URL(String(_||"http://localhost/")),Z=String($||"").trim();if(!Z)return G.toString();if(G.searchParams.set("pane_popout","1"),G.searchParams.set("pane_path",Z),j?.label)G.searchParams.set("pane_label",String(j.label));else G.searchParams.delete("pane_label");if(j?.chatJid)G.searchParams.set("chat_jid",String(j.chatJid));let X=j?.params&&typeof j.params==="object"?j.params:null;if(X)for(let[Y,L]of Object.entries(X)){let V=String(Y||"").trim();if(!V)continue;if(L===null||L===void 0||L==="")G.searchParams.delete(V);else G.searchParams.set(V,String(L))}return G.searchParams.delete("chat_only"),G.searchParams.delete("branch_loader"),G.searchParams.delete("branch_source_chat_jid"),G.toString()}function ZU(_){return`piclaw-chat-${String(_||"web:default").trim().toLowerCase().replace(/[^a-z0-9_-]+/g,"-")||"default"}`}function XU(_){return`piclaw-pane-${String(_||"pane").trim().toLowerCase().replace(/[^a-z0-9_-]+/g,"-")||"default"}`}function pG(_,$={}){if(P1($))return null;if(L6($))return{target:"_blank",features:void 0,mode:"tab"};return{target:XU(_),features:"popup=yes,width=1200,height=960,resizable=yes,scrollbars=yes",mode:"popup"}}function U4(_){let $=_ instanceof Error?_.message:String(_||"").trim(),j=String($||"").trim();if(!j)return"PiClaw could not open a new branch window.";let G=j.toLowerCase();if(G.includes("no stable turn boundary"))return"This chat is still in flight and does not yet have a stable turn boundary to fork from.";if(G.includes("cannot fork a branch while the source chat is still active"))return"This chat is still active. Please wait for the current turn to settle, then try again.";if(G.includes("cancelled"))return"Branch creation was cancelled before a new chat window could be opened.";if(G.includes("did not return a chat id"))return"PiClaw created no usable branch id for the new window. Please try again.";if(G.includes("failed to fork branch")||G.includes("failed to fork chat branch"))return"PiClaw could not create the new branch. Please try again.";return j}function YU(_){try{return JSON.parse(_)}catch{return null}}function LU(_){if(typeof _==="string")return new TextEncoder().encode(_).byteLength;if(_ instanceof ArrayBuffer)return _.byteLength;if(ArrayBuffer.isView(_))return _.byteLength;if(_ instanceof Blob)return _.size;return 0}function qU(_){if(typeof _==="string")return _.length;if(_ instanceof ArrayBuffer)return _.byteLength;if(_ instanceof Blob)return _.size;return Number(_?.size||0)}function dG(_){try{return _?.close?.(),!0}catch($){return!1}}class C3{socket=null;disposed=!1;options;bytesIn=0;bytesOut=0;pendingOutbound=[];constructor(_){this.options=_}connect(){if(this.disposed)return;dG(this.socket);let _=new WebSocket(this.options.url);_.binaryType=this.options.binaryType||"arraybuffer",_.addEventListener("open",()=>{if(this.disposed||this.socket!==_)return;this.flushPendingOutbound(_),this.options.onOpen?.()}),_.addEventListener("message",($)=>{if(this.disposed||this.socket!==_)return;let j=qU($.data);if(this.bytesIn+=j,this.emitMetrics(),typeof $.data==="string"){let G=this.options.parseControlMessage||YU;this.options.onMessage?.({kind:"control",raw:$.data,payload:G($.data)});return}this.options.onMessage?.({kind:"binary",data:$.data,size:j})}),_.addEventListener("close",()=>{if(this.socket===_)this.socket=null;if(this.disposed)return;this.options.onClose?.()}),_.addEventListener("error",()=>{if(this.disposed||this.socket!==_)return;this.options.onError?.()}),this.socket=_}send(_){if(this.disposed)return;let $=this.socket;if(!$||$.readyState!==WebSocket.OPEN){this.pendingOutbound.push(_);return}this.sendNow($,_)}sendControl(_){this.send(JSON.stringify(_??{}))}getMetrics(){return{bytesIn:this.bytesIn,bytesOut:this.bytesOut}}dispose(){if(this.disposed)return;this.disposed=!0,dG(this.socket),this.socket=null}emitMetrics(){this.options.onMetrics?.(this.getMetrics())}sendNow(_,$){let j=LU($);this.bytesOut+=j,this.emitMetrics(),_.send($)}flushPendingOutbound(_){if(this.pendingOutbound.length===0)return;let $=this.pendingOutbound.splice(0);for(let j=0;j<$.length;j+=1){if(this.disposed||this.socket!==_||_.readyState!==WebSocket.OPEN){this.pendingOutbound.unshift(...$.slice(j));return}this.sendNow(_,$[j])}}}var d2=()=>{throw Error("Operation requires compiling with --exportRuntime")},VU=typeof BigUint64Array<"u",i2=Symbol();var KU=new TextDecoder("utf-16le",{fatal:!0});Object.hasOwn=Object.hasOwn||function(_,$){return Object.prototype.hasOwnProperty.call(_,$)};function iG(_,$){let j=new Uint32Array(_)[$+-4>>>2]>>>1,G=new Uint16Array(_,$,j);if(j<=192)return String.fromCharCode(...G);try{return KU.decode(G)}catch{let Z="",X=0;while(j-X>1024)Z+=String.fromCharCode(...G.subarray(X,X+=1024));return Z+String.fromCharCode(...G.subarray(X))}}function oG(_){let $={};function j(Z,X){if(!Z)return"<yet unknown>";return iG(Z.buffer,X)}let G=_.env=_.env||{};return G.abort=G.abort||function(X,Y,L,V){let q=$.memory||G.memory;throw Error(`abort: ${j(q,X)} at ${j(q,Y)}:${L}:${V}`)},G.trace=G.trace||function(X,Y,...L){let V=$.memory||G.memory;console.log(`trace: ${j(V,X)}${Y?" ":""}${L.slice(0,Y).join(", ")}`)},G.seed=G.seed||Date.now,_.Math=_.Math||Math,_.Date=_.Date||Date,$}function sG(_,$){let j=$.exports,G=j.memory,Z=j.table,X=j.__new||d2,Y=j.__pin||d2,L=j.__unpin||d2,V=j.__collect||d2,q=j.__rtti_base,Q=q?(M)=>M[q>>>2]:d2;_.__new=X,_.__pin=Y,_.__unpin=L,_.__collect=V;function K(M){let T=new Uint32Array(G.buffer);if((M>>>=0)>=Q(T))throw Error(`invalid id: ${M}`);return T[(q+4>>>2)+M]}function B(M){let T=K(M);if(!(T&7))throw Error(`not an array: ${M}, flags=${T}`);return T}function N(M){return 31-Math.clz32(M>>>6&31)}function U(M){if(M==null)return 0;let T=M.length,J=X(T<<1,2),C=new Uint16Array(G.buffer);for(let P=0,b=J>>>1;P<T;++P)C[b+P]=M.charCodeAt(P);return J}_.__newString=U;function D(M){if(M==null)return 0;let T=new Uint8Array(M),J=X(T.length,1);return new Uint8Array(G.buffer).set(T,J),J}_.__newArrayBuffer=D;function H(M){if(!M)return null;let T=G.buffer;if(new Uint32Array(T)[M+-8>>>2]!==2)throw Error(`not a string: ${M}`);return iG(T,M)}_.__getString=H;function E(M,T,J){let C=G.buffer;if(J)switch(M){case 2:return new Float32Array(C);case 3:return new Float64Array(C)}else switch(M){case 0:return new(T?Int8Array:Uint8Array)(C);case 1:return new(T?Int16Array:Uint16Array)(C);case 2:return new(T?Int32Array:Uint32Array)(C);case 3:return new(T?BigInt64Array:BigUint64Array)(C)}throw Error(`unsupported align: ${M}`)}function k(M,T=0){let J=T,C=B(M),P=N(C),b=typeof J!=="number",m=b?J.length:J,h=X(m<<P,C&4?M:1),_0;if(C&4)_0=h;else{Y(h);let v=X(C&2?16:12,M);L(h);let e=new Uint32Array(G.buffer);if(e[v+0>>>2]=h,e[v+4>>>2]=h,e[v+8>>>2]=m<<P,C&2)e[v+12>>>2]=m;_0=v}if(b){let v=E(P,C&2048,C&4096),e=h>>>P;if(C&16384)for(let W0=0;W0<m;++W0)v[e+W0]=J[W0];else v.set(J,e)}return _0}_.__newArray=k;function z(M){let T=new Uint32Array(G.buffer),J=T[M+-8>>>2],C=B(J),P=N(C),b=C&4?M:T[M+4>>>2],m=C&2?T[M+12>>>2]:T[b+-4>>>2]>>>P;return E(P,C&2048,C&4096).subarray(b>>>=P,b+m)}_.__getArrayView=z;function O(M){let T=z(M),J=T.length,C=Array(J);for(let P=0;P<J;P++)C[P]=T[P];return C}_.__getArray=O;function I(M){let T=G.buffer,J=new Uint32Array(T)[M+-4>>>2];return T.slice(M,M+J)}_.__getArrayBuffer=I;function x(M){if(!Z)throw Error("Operation requires compiling with --exportTable");let T=new Uint32Array(G.buffer)[M>>>2];return Z.get(T)}_.__getFunction=x;function A(M,T,J){return new M(y(M,T,J))}function y(M,T,J){let C=G.buffer,P=new Uint32Array(C);return new M(C,P[J+4>>>2],P[J+8>>>2]>>>T)}function W(M,T,J){_[`__get${T}`]=A.bind(null,M,J),_[`__get${T}View`]=y.bind(null,M,J)}if([Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array].forEach((M)=>{W(M,M.name,31-Math.clz32(M.BYTES_PER_ELEMENT))}),VU)[BigUint64Array,BigInt64Array].forEach((M)=>{W(M,M.name.slice(3),3)});return _.memory=_.memory||G,_.table=_.table||Z,NU(j,_)}function aG(_){return typeof Response<"u"&&_ instanceof Response}function QU(_){return _ instanceof WebAssembly.Module}async function f3(_,$={}){if(aG(_=await _))return q6(_,$);let j=QU(_)?_:await WebAssembly.compile(_),G=oG($),Z=await WebAssembly.instantiate(j,$),X=sG(G,Z);return{module:j,instance:Z,exports:X}}async function q6(_,$={}){if(!WebAssembly.instantiateStreaming)return f3(aG(_=await _)?_.arrayBuffer():_,$);let j=oG($),G=await WebAssembly.instantiateStreaming(_,$),Z=sG(j,G.instance);return{...G,exports:Z}}function NU(_,$={}){let j=_.__argumentsLength?(G)=>{_.__argumentsLength.value=G}:_.__setArgumentsLength||_.__setargc||(()=>{});for(let G of Object.keys(_)){let Z=_[G],X=G.split("."),Y=$;while(X.length>1){let q=X.shift();if(!Object.hasOwn(Y,q))Y[q]={};Y=Y[q]}let L=X[0],V=L.indexOf("#");if(V>=0){let q=L.substring(0,V),Q=Y[q];if(typeof Q>"u"||!Q.prototype){let K=function(...B){return K.wrap(K.prototype.constructor(0,...B))};if(K.prototype={valueOf(){return this[i2]}},K.wrap=function(B){return Object.create(K.prototype,{[i2]:{value:B,writable:!1}})},Q)Object.getOwnPropertyNames(Q).forEach((B)=>Object.defineProperty(K,B,Object.getOwnPropertyDescriptor(Q,B)));Y[q]=K}if(L=L.substring(V+1),Y=Y[q].prototype,/^(get|set):/.test(L)){if(!Object.hasOwn(Y,L=L.substring(4))){let K=_[G.replace("set:","get:")],B=_[G.replace("get:","set:")];Object.defineProperty(Y,L,{get(){return K(this[i2])},set(N){B(this[i2],N)},enumerable:!0})}}else if(L==="constructor")(Y[L]=function(...K){return j(K.length),Z(...K)}).original=Z;else(Y[L]=function(...K){return j(K.length),Z(this[i2],...K)}).original=Z}else if(/^(get|set):/.test(L)){if(!Object.hasOwn(Y,L=L.substring(4)))Object.defineProperty(Y,L,{get:_[G.replace("set:","get:")],set:_[G.replace("get:","set:")],enumerable:!0})}else if(typeof Z==="function"&&Z!==j)(Y[L]=(...q)=>{return j(q.length),Z(...q)}).original=Z;else Y[L]=Z}return $}function P3(_){try{return _?.__collect?.(),!0}catch($){return!1}}var FU="/static/js/vendor/remote-display-decoder.wasm",V6=null;function tG(_){if(_ instanceof ArrayBuffer)return _;if(_.byteOffset===0&&_.byteLength===_.buffer.byteLength)return _.buffer;return _.slice().buffer}async function eG(){if(V6)return V6;return V6=(async()=>{try{let G=function(Z,X,Y,L,V,q,Q){let K=tG(X),B=j.__pin(j.__newArrayBuffer(K));try{return j[Z](B,Y,L,V,q,Q.bitsPerPixel,Q.bigEndian?1:0,Q.trueColor?1:0,Q.redMax,Q.greenMax,Q.blueMax,Q.redShift,Q.greenShift,Q.blueShift)}finally{j.__unpin(B),P3(j)}},_=await fetch(FU,{credentials:"same-origin"});if(!_.ok)throw Error(`HTTP ${_.status}`);let j=(typeof q6==="function"?await q6(_,{}):await f3(await _.arrayBuffer(),{})).exports;for(let Z of["initFramebuffer","getFramebufferPtr","getFramebufferLen","getFramebufferWidth","getFramebufferHeight","processRawRect","processCopyRect","processRreRect","processHextileRect","processZrleTileData","decodeRawRectToRgba"])if(typeof j[Z]!=="function")throw Error(`${Z} export is missing.`);return{initFramebuffer(Z,X){j.initFramebuffer(Z,X)},getFramebuffer(){let Z=j.getFramebufferPtr(),X=j.getFramebufferLen();return new Uint8ClampedArray(new Uint8Array(j.memory.buffer,Z,X).slice().buffer)},getFramebufferWidth(){return j.getFramebufferWidth()},getFramebufferHeight(){return j.getFramebufferHeight()},processRawRect(Z,X,Y,L,V,q){return G("processRawRect",Z,X,Y,L,V,q)},processCopyRect(Z,X,Y,L,V,q){return j.processCopyRect(Z,X,Y,L,V,q)},processRreRect(Z,X,Y,L,V,q){return G("processRreRect",Z,X,Y,L,V,q)},processHextileRect(Z,X,Y,L,V,q){return G("processHextileRect",Z,X,Y,L,V,q)},processZrleTileData(Z,X,Y,L,V,q){return G("processZrleTileData",Z,X,Y,L,V,q)},decodeRawRectToRgba(Z,X,Y,L){let V=tG(Z),q=j.__pin(j.__newArrayBuffer(V));try{let Q=j.__pin(j.decodeRawRectToRgba(q,X,Y,L.bitsPerPixel,L.bigEndian?1:0,L.trueColor?1:0,L.redMax,L.greenMax,L.blueMax,L.redShift,L.greenShift,L.blueShift));try{return new Uint8ClampedArray(j.__getArrayBuffer(Q))}finally{j.__unpin(Q)}}finally{j.__unpin(q),P3(j)}}}}catch(_){return console.warn("[remote-display] Failed to load WASM pipeline, using JS fallback.",_),null}})(),V6}function Y2(_,$,j){return Math.max($,Math.min(j,_))}function K6(_,$,j){let G=new Uint8Array(6),Z=Y2(Math.floor(Number($||0)),0,65535),X=Y2(Math.floor(Number(j||0)),0,65535);return G[0]=5,G[1]=Y2(Math.floor(Number(_||0)),0,255),G[2]=Z>>8&255,G[3]=Z&255,G[4]=X>>8&255,G[5]=X&255,G}function m$(_){switch(Number(_)){case 0:return 1;case 1:return 2;case 2:return 4;default:return 0}}function S3(_){let $=m$(_?.button);if($)return $;let j=String(_?.pointerType||"").toLowerCase();if(j==="touch"||j==="pen")return m$(0);let G=Number(_?.buttons||0);if(G&1)return m$(0);if(G&4)return m$(1);if(G&2)return m$(2);return 0}function E4(_){let $=String(_?.type||"").toLowerCase();if($==="pointerup"||$==="pointercancel"||$==="lostpointercapture")return!0;let j=Number(_?.buttons);if(Number.isFinite(j)&&j===0&&$!=="pointerdown")return!0;let G=String(_?.pointerType||"").toLowerCase(),Z=Number(_?.pressure);if(G==="touch"||G==="pen"){if($==="pointerleave"||$==="pointerout")return!0;if(Number.isFinite(Z)&&Z<=0&&$!=="pointerdown")return!0}return!1}function _Z(_){let $=String(_?.type||"").toLowerCase();if($==="touchend"||$==="touchcancel")return!0;if($==="touchmove")return Number(_?.touches?.length||0)<=0;return!1}function n1(_){return String(_||"").toLowerCase()==="touch"}function UU(_,$,j,G){let Z=Number(j||0)-Number(_||0),X=Number(G||0)-Number($||0);return Math.hypot(Z,X)}function u3(_){let $=Number.isFinite(_?.maxDistancePx)?Number(_.maxDistancePx):14;return UU(_?.startX,_?.startY,_?.clientX,_?.clientY)>$}function $Z(_){let $=Number.isFinite(_?.maxElapsedMs)?Number(_.maxElapsedMs):300;if(Number(_?.elapsedMs||0)>$)return!1;return!u3(_)}function jZ(_){return String(_||"").toLowerCase()!=="mouse"}function g3(_,$,j,G,Z){let X=Math.max(1,Math.floor(Number(G||0))),Y=Math.max(1,Math.floor(Number(Z||0))),L=Math.max(1,Number(j?.width||0)),V=Math.max(1,Number(j?.height||0)),q=(Number(_||0)-Number(j?.left||0))/L,Q=(Number($||0)-Number(j?.top||0))/V;return{x:Y2(Math.floor(q*X),0,Math.max(0,X-1)),y:Y2(Math.floor(Q*Y),0,Math.max(0,Y-1))}}function GZ(_,$,j,G=0){let Z=Number(_)<0?8:16,X=Y2(Number(G||0)|Z,0,255);return[K6(X,$,j),K6(Number(G||0),$,j)]}function ZZ(_,$){let j=new Uint8Array(8),G=Math.max(0,Math.min(4294967295,Number($||0)>>>0));return j[0]=4,j[1]=_?1:0,j[4]=G>>>24&255,j[5]=G>>>16&255,j[6]=G>>>8&255,j[7]=G&255,j}function XZ(_,$,j=!1){if(_==null||$==null)return!1;return Boolean(j)||Number(_)===Number($)}function H4(_){if(typeof _!=="string")return null;return _.length>0?_:null}function YZ(_,$,j,G){let Z=Math.max(1,Math.floor(Number(_||0))),X=Math.max(1,Math.floor(Number($||0))),Y=Math.max(1,Math.floor(Number(j||0))),L=Math.max(1,Math.floor(Number(G||0))),V=Math.min(Z/Y,X/L);if(!Number.isFinite(V)||V<=0)return 1;return Math.max(0.01,V)}var R3={Backspace:65288,Tab:65289,Enter:65293,Escape:65307,Insert:65379,Delete:65535,Home:65360,End:65367,PageUp:65365,PageDown:65366,ArrowLeft:65361,ArrowUp:65362,ArrowRight:65363,ArrowDown:65364,Shift:65505,ShiftLeft:65505,ShiftRight:65506,Control:65507,ControlLeft:65507,ControlRight:65508,Alt:65513,AltLeft:65513,AltRight:65514,Meta:65515,MetaLeft:65515,MetaRight:65516,Super:65515,Super_L:65515,Super_R:65516,CapsLock:65509,NumLock:65407,ScrollLock:65300,Pause:65299,PrintScreen:65377,ContextMenu:65383,Menu:65383," ":32};for(let _=1;_<=12;_+=1)R3[`F${_}`]=65470+(_-1);function b3(_){let $=[_?.key,_?.code];for(let X of $)if(X&&Object.prototype.hasOwnProperty.call(R3,X))return R3[X];let j=String(_?.key||""),G=j?j.codePointAt(0):null,Z=G==null?0:G>65535?2:1;if(G!=null&&j.length===Z){if(G<=255)return G;return(16777216|G)>>>0}return null}var o_=Uint8Array,W1=Uint16Array,d3=Int32Array,Q6=new o_([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),N6=new o_([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),h3=new o_([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),KZ=function(_,$){var j=new W1(31);for(var G=0;G<31;++G)j[G]=$+=1<<_[G-1];var Z=new d3(j[30]);for(var G=1;G<30;++G)for(var X=j[G];X<j[G+1];++X)Z[X]=X-j[G]<<5|G;return{b:j,r:Z}},QZ=KZ(Q6,2),NZ=QZ.b,n3=QZ.r;NZ[28]=258,n3[258]=28;var BZ=KZ(N6,0),EU=BZ.b,LZ=BZ.r,r3=new W1(32768);for(Q_=0;Q_<32768;++Q_)r1=(Q_&43690)>>1|(Q_&21845)<<1,r1=(r1&52428)>>2|(r1&13107)<<2,r1=(r1&61680)>>4|(r1&3855)<<4,r3[Q_]=((r1&65280)>>8|(r1&255)<<8)>>1;var r1,Q_,p1=function(_,$,j){var G=_.length,Z=0,X=new W1($);for(;Z<G;++Z)if(_[Z])++X[_[Z]-1];var Y=new W1($);for(Z=1;Z<$;++Z)Y[Z]=Y[Z-1]+X[Z-1]<<1;var L;if(j){L=new W1(1<<$);var V=15-$;for(Z=0;Z<G;++Z)if(_[Z]){var q=Z<<4|_[Z],Q=$-_[Z],K=Y[_[Z]-1]++<<Q;for(var B=K|(1<<Q)-1;K<=B;++K)L[r3[K]>>V]=q}}else{L=new W1(G);for(Z=0;Z<G;++Z)if(_[Z])L[Z]=r3[Y[_[Z]-1]++]>>15-_[Z]}return L},c$=new o_(288);for(Q_=0;Q_<144;++Q_)c$[Q_]=8;var Q_;for(Q_=144;Q_<256;++Q_)c$[Q_]=9;var Q_;for(Q_=256;Q_<280;++Q_)c$[Q_]=7;var Q_;for(Q_=280;Q_<288;++Q_)c$[Q_]=8;var Q_,t2=new o_(32);for(Q_=0;Q_<32;++Q_)t2[Q_]=5;var Q_,HU=p1(c$,9,0),DU=p1(c$,9,1),WU=p1(t2,5,0),OU=p1(t2,5,1),v3=function(_){var $=_[0];for(var j=1;j<_.length;++j)if(_[j]>$)$=_[j];return $},R1=function(_,$,j){var G=$/8|0;return(_[G]|_[G+1]<<8)>>($&7)&j},m3=function(_,$){var j=$/8|0;return(_[j]|_[j+1]<<8|_[j+2]<<16)>>($&7)},i3=function(_){return(_+7)/8|0},a2=function(_,$,j){if($==null||$<0)$=0;if(j==null||j>_.length)j=_.length;return new o_(_.subarray($,j))};var zU=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],N1=function(_,$,j){var G=Error($||zU[_]);if(G.code=_,Error.captureStackTrace)Error.captureStackTrace(G,N1);if(!j)throw G;return G},JU=function(_,$,j,G){var Z=_.length,X=G?G.length:0;if(!Z||$.f&&!$.l)return j||new o_(0);var Y=!j,L=Y||$.i!=2,V=$.i;if(Y)j=new o_(Z*3);var q=function(X0){var D0=j.length;if(X0>D0){var C0=new o_(Math.max(D0*2,X0));C0.set(j),j=C0}},Q=$.f||0,K=$.p||0,B=$.b||0,N=$.l,U=$.d,D=$.m,H=$.n,E=Z*8;do{if(!N){Q=R1(_,K,1);var k=R1(_,K+1,3);if(K+=3,!k){var z=i3(K)+4,O=_[z-4]|_[z-3]<<8,I=z+O;if(I>Z){if(V)N1(0);break}if(L)q(B+O);j.set(_.subarray(z,I),B),$.b=B+=O,$.p=K=I*8,$.f=Q;continue}else if(k==1)N=DU,U=OU,D=9,H=5;else if(k==2){var x=R1(_,K,31)+257,A=R1(_,K+10,15)+4,y=x+R1(_,K+5,31)+1;K+=14;var W=new o_(y),M=new o_(19);for(var T=0;T<A;++T)M[h3[T]]=R1(_,K+T*3,7);K+=A*3;var J=v3(M),C=(1<<J)-1,P=p1(M,J,1);for(var T=0;T<y;){var b=P[R1(_,K,C)];K+=b&15;var z=b>>4;if(z<16)W[T++]=z;else{var m=0,h=0;if(z==16)h=3+R1(_,K,3),K+=2,m=W[T-1];else if(z==17)h=3+R1(_,K,7),K+=3;else if(z==18)h=11+R1(_,K,127),K+=7;while(h--)W[T++]=m}}var _0=W.subarray(0,x),v=W.subarray(x);D=v3(_0),H=v3(v),N=p1(_0,D,1),U=p1(v,H,1)}else N1(1);if(K>E){if(V)N1(0);break}}if(L)q(B+131072);var e=(1<<D)-1,W0=(1<<H)-1,G0=K;for(;;G0=K){var m=N[m3(_,K)&e],$0=m>>4;if(K+=m&15,K>E){if(V)N1(0);break}if(!m)N1(2);if($0<256)j[B++]=$0;else if($0==256){G0=K,N=null;break}else{var L0=$0-254;if($0>264){var T=$0-257,B0=Q6[T];L0=R1(_,K,(1<<B0)-1)+NZ[T],K+=B0}var t=U[m3(_,K)&W0],V0=t>>4;if(!t)N1(3);K+=t&15;var v=EU[V0];if(V0>3){var B0=N6[V0];v+=m3(_,K)&(1<<B0)-1,K+=B0}if(K>E){if(V)N1(0);break}if(L)q(B+131072);var K0=B+L0;if(B<v){var k0=X-v,s=Math.min(v,K0);if(k0+B<0)N1(3);for(;B<s;++B)j[B]=G[k0+B]}for(;B<K0;++B)j[B]=j[B-v]}}if($.l=N,$.p=G0,$.b=B,$.f=Q,N)Q=1,$.m=D,$.d=U,$.n=H}while(!Q);return B!=j.length&&Y?a2(j,0,B):j.subarray(0,B)},N$=function(_,$,j){j<<=$&7;var G=$/8|0;_[G]|=j,_[G+1]|=j>>8},o2=function(_,$,j){j<<=$&7;var G=$/8|0;_[G]|=j,_[G+1]|=j>>8,_[G+2]|=j>>16},c3=function(_,$){var j=[];for(var G=0;G<_.length;++G)if(_[G])j.push({s:G,f:_[G]});var Z=j.length,X=j.slice();if(!Z)return{t:UZ,l:0};if(Z==1){var Y=new o_(j[0].s+1);return Y[j[0].s]=1,{t:Y,l:1}}j.sort(function(I,x){return I.f-x.f}),j.push({s:-1,f:25001});var L=j[0],V=j[1],q=0,Q=1,K=2;j[0]={s:-1,f:L.f+V.f,l:L,r:V};while(Q!=Z-1)L=j[j[q].f<j[K].f?q++:K++],V=j[q!=Q&&j[q].f<j[K].f?q++:K++],j[Q++]={s:-1,f:L.f+V.f,l:L,r:V};var B=X[0].s;for(var G=1;G<Z;++G)if(X[G].s>B)B=X[G].s;var N=new W1(B+1),U=p3(j[Q-1],N,0);if(U>$){var G=0,D=0,H=U-$,E=1<<H;X.sort(function(x,A){return N[A.s]-N[x.s]||x.f-A.f});for(;G<Z;++G){var k=X[G].s;if(N[k]>$)D+=E-(1<<U-N[k]),N[k]=$;else break}D>>=H;while(D>0){var z=X[G].s;if(N[z]<$)D-=1<<$-N[z]++-1;else++G}for(;G>=0&&D;--G){var O=X[G].s;if(N[O]==$)--N[O],++D}U=$}return{t:new o_(N),l:U}},p3=function(_,$,j){return _.s==-1?Math.max(p3(_.l,$,j+1),p3(_.r,$,j+1)):$[_.s]=j},qZ=function(_){var $=_.length;while($&&!_[--$]);var j=new W1(++$),G=0,Z=_[0],X=1,Y=function(V){j[G++]=V};for(var L=1;L<=$;++L)if(_[L]==Z&&L!=$)++X;else{if(!Z&&X>2){for(;X>138;X-=138)Y(32754);if(X>2)Y(X>10?X-11<<5|28690:X-3<<5|12305),X=0}else if(X>3){Y(Z),--X;for(;X>6;X-=6)Y(8304);if(X>2)Y(X-3<<5|8208),X=0}while(X--)Y(Z);X=1,Z=_[L]}return{c:j.subarray(0,G),n:$}},s2=function(_,$){var j=0;for(var G=0;G<$.length;++G)j+=_[G]*$[G];return j},FZ=function(_,$,j){var G=j.length,Z=i3($+2);_[Z]=G&255,_[Z+1]=G>>8,_[Z+2]=_[Z]^255,_[Z+3]=_[Z+1]^255;for(var X=0;X<G;++X)_[Z+X+4]=j[X];return(Z+4+G)*8},VZ=function(_,$,j,G,Z,X,Y,L,V,q,Q){N$($,Q++,j),++Z[256];var K=c3(Z,15),B=K.t,N=K.l,U=c3(X,15),D=U.t,H=U.l,E=qZ(B),k=E.c,z=E.n,O=qZ(D),I=O.c,x=O.n,A=new W1(19);for(var y=0;y<k.length;++y)++A[k[y]&31];for(var y=0;y<I.length;++y)++A[I[y]&31];var W=c3(A,7),M=W.t,T=W.l,J=19;for(;J>4&&!M[h3[J-1]];--J);var C=q+5<<3,P=s2(Z,c$)+s2(X,t2)+Y,b=s2(Z,B)+s2(X,D)+Y+14+3*J+s2(A,M)+2*A[16]+3*A[17]+7*A[18];if(V>=0&&C<=P&&C<=b)return FZ($,Q,_.subarray(V,V+q));var m,h,_0,v;if(N$($,Q,1+(b<P)),Q+=2,b<P){m=p1(B,N,0),h=B,_0=p1(D,H,0),v=D;var e=p1(M,T,0);N$($,Q,z-257),N$($,Q+5,x-1),N$($,Q+10,J-4),Q+=14;for(var y=0;y<J;++y)N$($,Q+3*y,M[h3[y]]);Q+=3*J;var W0=[k,I];for(var G0=0;G0<2;++G0){var $0=W0[G0];for(var y=0;y<$0.length;++y){var L0=$0[y]&31;if(N$($,Q,e[L0]),Q+=M[L0],L0>15)N$($,Q,$0[y]>>5&127),Q+=$0[y]>>12}}}else m=HU,h=c$,_0=WU,v=t2;for(var y=0;y<L;++y){var B0=G[y];if(B0>255){var L0=B0>>18&31;if(o2($,Q,m[L0+257]),Q+=h[L0+257],L0>7)N$($,Q,B0>>23&31),Q+=Q6[L0];var t=B0&31;if(o2($,Q,_0[t]),Q+=v[t],t>3)o2($,Q,B0>>5&8191),Q+=N6[t]}else o2($,Q,m[B0]),Q+=h[B0]}return o2($,Q,m[256]),Q+h[256]},AU=new d3([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),UZ=new o_(0),kU=function(_,$,j,G,Z,X){var Y=X.z||_.length,L=new o_(G+Y+5*(1+Math.ceil(Y/7000))+Z),V=L.subarray(G,L.length-Z),q=X.l,Q=(X.r||0)&7;if($){if(Q)V[0]=X.r>>3;var K=AU[$-1],B=K>>13,N=K&8191,U=(1<<j)-1,D=X.p||new W1(32768),H=X.h||new W1(U+1),E=Math.ceil(j/3),k=2*E,z=function(g0){return(_[g0]^_[g0+1]<<E^_[g0+2]<<k)&U},O=new d3(25000),I=new W1(288),x=new W1(32),A=0,y=0,W=X.i||0,M=0,T=X.w||0,J=0;for(;W+2<Y;++W){var C=z(W),P=W&32767,b=H[C];if(D[P]=b,H[C]=P,T<=W){var m=Y-W;if((A>7000||M>24576)&&(m>423||!q)){Q=VZ(_,V,0,O,I,x,y,M,J,W-J,Q),M=A=y=0,J=W;for(var h=0;h<286;++h)I[h]=0;for(var h=0;h<30;++h)x[h]=0}var _0=2,v=0,e=N,W0=P-b&32767;if(m>2&&C==z(W-W0)){var G0=Math.min(B,m)-1,$0=Math.min(32767,W),L0=Math.min(258,m);while(W0<=$0&&--e&&P!=b){if(_[W+_0]==_[W+_0-W0]){var B0=0;for(;B0<L0&&_[W+B0]==_[W+B0-W0];++B0);if(B0>_0){if(_0=B0,v=W0,B0>G0)break;var t=Math.min(W0,B0-2),V0=0;for(var h=0;h<t;++h){var K0=W-W0+h&32767,k0=D[K0],s=K0-k0&32767;if(s>V0)V0=s,b=K0}}}P=b,b=D[P],W0+=P-b&32767}}if(v){O[M++]=268435456|n3[_0]<<18|LZ[v];var X0=n3[_0]&31,D0=LZ[v]&31;y+=Q6[X0]+N6[D0],++I[257+X0],++x[D0],T=W+_0,++A}else O[M++]=_[W],++I[_[W]]}}for(W=Math.max(W,T);W<Y;++W)O[M++]=_[W],++I[_[W]];if(Q=VZ(_,V,q,O,I,x,y,M,J,W-J,Q),!q)X.r=Q&7|V[Q/8|0]<<3,Q-=7,X.h=H,X.p=D,X.i=W,X.w=T}else{for(var W=X.w||0;W<Y+q;W+=65535){var C0=W+65535;if(C0>=Y)V[Q/8|0]=q,C0=Y;Q=FZ(V,Q+1,_.subarray(W,C0))}X.i=Y}return a2(L,0,G+i3(Q)+Z)};var EZ=function(){var _=1,$=0;return{p:function(j){var G=_,Z=$,X=j.length|0;for(var Y=0;Y!=X;){var L=Math.min(Y+2655,X);for(;Y<L;++Y)Z+=G+=j[Y];G=(G&65535)+15*(G>>16),Z=(Z&65535)+15*(Z>>16)}_=G,$=Z},d:function(){return _%=65521,$%=65521,(_&255)<<24|(_&65280)<<8|($&255)<<8|$>>8}}},yU=function(_,$,j,G,Z){if(!Z){if(Z={l:1},$.dictionary){var X=$.dictionary.subarray(-32768),Y=new o_(X.length+_.length);Y.set(X),Y.set(_,X.length),_=Y,Z.w=X.length}}return kU(_,$.level==null?6:$.level,$.mem==null?Z.l?Math.ceil(Math.max(8,Math.min(13,Math.log(_.length)))*1.5):20:12+$.mem,j,G,Z)};var HZ=function(_,$,j){for(;j;++$)_[$]=j,j>>>=8};var MU=function(_,$){var j=$.level,G=j==0?0:j<6?1:j==9?3:2;if(_[0]=120,_[1]=G<<6|($.dictionary&&32),_[1]|=31-(_[0]<<8|_[1])%31,$.dictionary){var Z=EZ();Z.p($.dictionary),HZ(_,2,Z.d())}},wU=function(_,$){if((_[0]&15)!=8||_[0]>>4>7||(_[0]<<8|_[1])%31)N1(6,"invalid zlib data");if((_[1]>>5&1)==+!$)N1(6,"invalid zlib data: "+(_[1]&32?"need":"unexpected")+" dictionary");return(_[1]>>3&4)+2};var l3=function(){function _($,j){if(typeof $=="function")j=$,$={};this.ondata=j;var G=$&&$.dictionary&&$.dictionary.subarray(-32768);if(this.s={i:0,b:G?G.length:0},this.o=new o_(32768),this.p=new o_(0),G)this.o.set(G)}return _.prototype.e=function($){if(!this.ondata)N1(5);if(this.d)N1(4);if(!this.p.length)this.p=$;else if($.length){var j=new o_(this.p.length+$.length);j.set(this.p),j.set($,this.p.length),this.p=j}},_.prototype.c=function($){this.s.i=+(this.d=$||!1);var j=this.s.b,G=JU(this.p,this.s,this.o);this.ondata(a2(G,j,this.s.b),this.d),this.o=a2(G,this.s.b-32768),this.s.b=this.o.length,this.p=a2(this.p,this.s.p/8|0),this.s.p&=7},_.prototype.push=function($,j){this.e($),this.c(j)},_}();function DZ(_,$){if(!$)$={};var j=EZ();j.p(_);var G=yU(_,$,$.dictionary?6:2,4);return MU(G,$),HZ(G,G.length-4,j.d()),G}var WZ=function(){function _($,j){l3.call(this,$,j),this.v=$&&$.dictionary?2:1}return _.prototype.push=function($,j){if(l3.prototype.e.call(this,$),this.v){if(this.p.length<6&&!j)return;this.p=this.p.subarray(wU(this.p,this.v-1)),this.v=0}if(j){if(this.p.length<4)N1(6,"invalid zlib data");this.p=this.p.subarray(0,-4)}l3.prototype.c.call(this,j)},_}();var TU=typeof TextDecoder<"u"&&new TextDecoder,xU=0;try{TU.decode(UZ,{stream:!0}),xU=1}catch(_){}var IU=[58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7],CU=[40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25],fU=[32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1],PU=[16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25],RU=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],SU=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],uU=[1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],gU=[[[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]],[[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],[3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],[0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],[13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]],[[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],[13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],[13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],[1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]],[[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],[13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],[10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],[3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]],[[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],[14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],[4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],[11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]],[[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],[10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],[9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],[4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]],[[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],[13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],[1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],[6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]],[[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],[1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],[7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],[2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]]],JZ=new Uint8Array(256);for(let _=0;_<256;_+=1){let $=0;for(let j=0;j<8;j+=1)$=$<<1|_>>j&1;JZ[_]=$}function AZ(_){if(_ instanceof Uint8Array)return _;if(_ instanceof ArrayBuffer)return new Uint8Array(_);if(ArrayBuffer.isView(_))return new Uint8Array(_.buffer,_.byteOffset,_.byteLength);return new Uint8Array(0)}function kZ(_){let $=0n,j=AZ(_);for(let G of j)$=$<<8n|BigInt(G);return $}function bU(_,$){let j=new Uint8Array($),G=BigInt(_);for(let Z=$-1;Z>=0;Z-=1)j[Z]=Number(G&0xffn),G>>=8n;return j}function L2(_,$,j){let G=0n;for(let Z of $){let X=BigInt(_)>>BigInt(j-Z)&1n;G=G<<1n|X}return G}function OZ(_,$){let j=28n,G=(1n<<j)-1n,Z=BigInt($%28);return(_<<Z|_>>j-Z)&G}function vU(_){let $=L2(kZ(_),RU,64),j=$>>28n&0x0fffffffn,G=$&0x0fffffffn,Z=[];for(let X of uU){j=OZ(j,X),G=OZ(G,X);let Y=j<<28n|G;Z.push(L2(Y,SU,56))}return Z}function mU(_){let $=0n;for(let j=0;j<8;j+=1){let G=BigInt((7-j)*6),Z=Number(_>>G&0x3fn),X=(Z&32)>>4|Z&1,Y=Z>>1&15;$=$<<4n|BigInt(gU[j][X][Y])}return $}function cU(_,$){let j=L2(_,fU,32)^BigInt($),G=mU(j);return L2(G,PU,32)}function zZ(_,$){let j=vU($),G=L2(kZ(_),IU,64),Z=G>>32n&0xffffffffn,X=G&0xffffffffn;for(let L of j){let V=X,q=(Z^cU(X,L))&0xffffffffn;Z=V,X=q}let Y=X<<32n|Z;return bU(L2(Y,CU,64),8)}function lU(_){let $=String(_??""),j=new Uint8Array(8);for(let G=0;G<8;G+=1){let Z=G<$.length?$.charCodeAt(G)&255:0;j[G]=JZ[Z]}return j}function yZ(_,$){let j=AZ($);if(j.byteLength!==16)throw Error(`Invalid VNC auth challenge length ${j.byteLength}; expected 16 bytes.`);let G=lU(_),Z=new Uint8Array(16);return Z.set(zZ(j.slice(0,8),G),0),Z.set(zZ(j.slice(8,16),G),8),Z}var S1="vnc";function hU(_){return Number(_)}function nU(_){let $=Array.isArray(_)?_:typeof _==="string"?_.split(",").map((Z)=>Z.trim()).filter((Z)=>Z.length>0):[],j=[],G=new Set;for(let Z of $){let X=hU(Z);if(!Number.isFinite(X))continue;let Y=Number(X);if(!G.has(Y))j.push(Y),G.add(Y)}if(j.length>0)return j;return[5,2,1,0,-223]}function K2(_){if(_ instanceof Uint8Array)return _;if(_ instanceof ArrayBuffer)return new Uint8Array(_);if(ArrayBuffer.isView(_))return new Uint8Array(_.buffer,_.byteOffset,_.byteLength);return new Uint8Array(0)}function rU(_,$){let j=K2(_),G=K2($);if(!j.byteLength)return new Uint8Array(G);if(!G.byteLength)return new Uint8Array(j);let Z=new Uint8Array(j.byteLength+G.byteLength);return Z.set(j,0),Z.set(G,j.byteLength),Z}function pU(_){let $=0;for(let Z of _||[])$+=Z?.byteLength||0;let j=new Uint8Array($),G=0;for(let Z of _||[]){let X=K2(Z);j.set(X,G),G+=X.byteLength}return j}function dU(){return(_)=>{let $=K2(_);try{let j=[],G=new WZ((Z)=>{j.push(new Uint8Array(Z))});if(G.push($,!0),G.err)throw Error(G.msg||"zlib decompression error");return pU(j)}catch(j){try{let G=DZ($);return G instanceof Uint8Array?G:new Uint8Array(G)}catch(G){let Z=G instanceof Error?G.message:"unexpected EOF";throw Error(`unexpected EOF: ${Z}`)}}}}function iU(_){return new TextEncoder().encode(String(_||""))}function q2(_){return new TextDecoder().decode(K2(_))}function oU(_){let $=/^RFB (\d{3})\.(\d{3})\n$/.exec(String(_||""));if(!$)return null;return{major:parseInt($[1],10),minor:parseInt($[2],10),text:$[0]}}function sU(_){if(!_)return`RFB 003.008
`;if(_.major>3||_.minor>=8)return`RFB 003.008
`;if(_.minor>=7)return`RFB 003.007
`;return`RFB 003.003
`}function MZ(_,$=0){return{bitsPerPixel:_.getUint8($),depth:_.getUint8($+1),bigEndian:_.getUint8($+2)===1,trueColor:_.getUint8($+3)===1,redMax:_.getUint16($+4,!1),greenMax:_.getUint16($+6,!1),blueMax:_.getUint16($+8,!1),redShift:_.getUint8($+10),greenShift:_.getUint8($+11),blueShift:_.getUint8($+12)}}function aU(_){let $=new ArrayBuffer(20),j=new DataView($);return j.setUint8(0,0),j.setUint8(1,0),j.setUint8(2,0),j.setUint8(3,0),j.setUint8(4,_.bitsPerPixel),j.setUint8(5,_.depth),j.setUint8(6,_.bigEndian?1:0),j.setUint8(7,_.trueColor?1:0),j.setUint16(8,_.redMax,!1),j.setUint16(10,_.greenMax,!1),j.setUint16(12,_.blueMax,!1),j.setUint8(14,_.redShift),j.setUint8(15,_.greenShift),j.setUint8(16,_.blueShift),new Uint8Array($)}function tU(_){let $=Array.isArray(_)?_:[],j=new ArrayBuffer(4+$.length*4),G=new DataView(j);G.setUint8(0,2),G.setUint8(1,0),G.setUint16(2,$.length,!1);let Z=4;for(let X of $)G.setInt32(Z,Number(X||0),!1),Z+=4;return new Uint8Array(j)}function wZ(_,$,j,G=0,Z=0){let X=new ArrayBuffer(10),Y=new DataView(X);return Y.setUint8(0,3),Y.setUint8(1,_?1:0),Y.setUint16(2,G,!1),Y.setUint16(4,Z,!1),Y.setUint16(6,Math.max(0,$||0),!1),Y.setUint16(8,Math.max(0,j||0),!1),new Uint8Array(X)}function V2(_,$){let j=Number($||0);if(j<=0)return 0;if(j===255)return _&255;return Math.max(0,Math.min(255,Math.round((_||0)*255/j)))}function xZ(_,$,j,G){if(j===1)return _[$];if(j===2)return G?(_[$]<<8|_[$+1])>>>0:(_[$]|_[$+1]<<8)>>>0;if(j===3)return G?(_[$]<<16|_[$+1]<<8|_[$+2])>>>0:(_[$]|_[$+1]<<8|_[$+2]<<16)>>>0;if(j===4)return G?(_[$]<<24>>>0|_[$+1]<<16|_[$+2]<<8|_[$+3])>>>0:(_[$]|_[$+1]<<8|_[$+2]<<16|_[$+3]<<24>>>0)>>>0;return 0}function eU(_,$,j,G){let Z=G||Q2,X=K2(_),Y=Math.max(1,Math.floor(Number(Z.bitsPerPixel||0)/8)),L=Math.max(0,$||0)*Math.max(0,j||0)*Y;if(X.byteLength<L)throw Error(`Incomplete raw rectangle payload: expected ${L} byte(s), got ${X.byteLength}`);if(!Z.trueColor)throw Error("Indexed-colour VNC framebuffers are not supported yet.");let V=new Uint8ClampedArray(Math.max(0,$||0)*Math.max(0,j||0)*4),q=0,Q=0;for(let K=0;K<Math.max(0,$||0)*Math.max(0,j||0);K+=1){let B=xZ(X,q,Y,Z.bigEndian),N=V2(B>>>Z.redShift&Z.redMax,Z.redMax),U=V2(B>>>Z.greenShift&Z.greenMax,Z.greenMax),D=V2(B>>>Z.blueShift&Z.blueMax,Z.blueMax);V[Q]=N,V[Q+1]=U,V[Q+2]=D,V[Q+3]=255,q+=Y,Q+=4}return V}function B$(_,$,j){let G=j||Q2,Z=Math.max(1,Math.floor(Number(G.bitsPerPixel||0)/8));if(_.byteLength<$+Z)return null;let X=xZ(_,$,Z,G.bigEndian);return{rgba:[V2(X>>>G.redShift&G.redMax,G.redMax),V2(X>>>G.greenShift&G.greenMax,G.greenMax),V2(X>>>G.blueShift&G.blueMax,G.blueMax),255],bytesPerPixel:Z}}function l$(_,$,j,G,Z,X,Y){if(!Y)return;for(let L=0;L<X;L+=1)for(let V=0;V<Z;V+=1){let q=((G+L)*$+(j+V))*4;_[q]=Y[0],_[q+1]=Y[1],_[q+2]=Y[2],_[q+3]=Y[3]}}function IZ(_,$,j,G,Z,X,Y){for(let L=0;L<X;L+=1){let V=L*Z*4,q=((G+L)*$+j)*4;_.set(Y.subarray(V,V+Z*4),q)}}function TZ(_,$){let j=$,G=1;while(!0){if(_.byteLength<j+1)return null;let Z=_[j++];if(G+=Z,Z!==255)break}return{consumed:j-$,runLength:G}}function _E(_,$,j,G,Z,X,Y){let L=Z||Q2,V=Math.max(1,Math.floor(Number(L.bitsPerPixel||0)/8));if(_.byteLength<$+4)return null;let q=new DataView(_.buffer,_.byteOffset+$,4).getUint32(0,!1);if(_.byteLength<$+4+q)return null;let Q=_.slice($+4,$+4+q),K;try{K=Y(Q)}catch{return{consumed:4+q,skipped:!0}}let B=0,N=new Uint8ClampedArray(Math.max(0,j||0)*Math.max(0,G||0)*4);for(let U=0;U<G;U+=64){let D=Math.min(64,G-U);for(let H=0;H<j;H+=64){let E=Math.min(64,j-H);if(K.byteLength<B+1)return null;let k=K[B++],z=k&127,O=(k&128)!==0;if(!O&&z===0){let I=E*D*V;if(K.byteLength<B+I)return null;let x=X(K.slice(B,B+I),E,D,L);B+=I,IZ(N,j,H,U,E,D,x);continue}if(!O&&z===1){let I=B$(K,B,L);if(!I)return null;B+=I.bytesPerPixel,l$(N,j,H,U,E,D,I.rgba);continue}if(!O&&z>1&&z<=16){let I=[];for(let W=0;W<z;W+=1){let M=B$(K,B,L);if(!M)return null;B+=M.bytesPerPixel,I.push(M.rgba)}let x=z<=2?1:z<=4?2:4,A=Math.ceil(E*x/8),y=A*D;if(K.byteLength<B+y)return null;for(let W=0;W<D;W+=1){let M=B+W*A;for(let T=0;T<E;T+=1){let J=T*x,C=M+(J>>3),P=8-x-(J&7),b=K[C]>>P&(1<<x)-1;l$(N,j,H+T,U+W,1,1,I[b])}}B+=y;continue}if(O&&z===0){let I=0,x=0;while(x<D){let A=B$(K,B,L);if(!A)return null;B+=A.bytesPerPixel;let y=TZ(K,B);if(!y)return null;B+=y.consumed;for(let W=0;W<y.runLength;W+=1)if(l$(N,j,H+I,U+x,1,1,A.rgba),I+=1,I>=E){if(I=0,x+=1,x>=D)break}}continue}if(O&&z>0){let I=[];for(let y=0;y<z;y+=1){let W=B$(K,B,L);if(!W)return null;B+=W.bytesPerPixel,I.push(W.rgba)}let x=0,A=0;while(A<D){if(K.byteLength<B+1)return null;let y=K[B++],W=y,M=1;if(y&128){W=y&127;let J=TZ(K,B);if(!J)return null;B+=J.consumed,M=J.runLength}let T=I[W];if(!T)return null;for(let J=0;J<M;J+=1)if(l$(N,j,H+x,U+A,1,1,T),x+=1,x>=E){if(x=0,A+=1,A>=D)break}}continue}return{consumed:4+q,skipped:!0}}}return{consumed:4+q,rgba:N,decompressed:K}}function $E(_,$,j,G,Z){let X=Z||Q2,Y=Math.max(1,Math.floor(Number(X.bitsPerPixel||0)/8));if(_.byteLength<$+4+Y)return null;let V=new DataView(_.buffer,_.byteOffset+$,_.byteLength-$).getUint32(0,!1),q=4+Y+V*(Y+8);if(_.byteLength<$+q)return null;let Q=$+4,K=B$(_,Q,X);if(!K)return null;Q+=K.bytesPerPixel;let B=new Uint8ClampedArray(Math.max(0,j||0)*Math.max(0,G||0)*4);l$(B,j,0,0,j,G,K.rgba);for(let N=0;N<V;N+=1){let U=B$(_,Q,X);if(!U)return null;if(Q+=U.bytesPerPixel,_.byteLength<Q+8)return null;let D=new DataView(_.buffer,_.byteOffset+Q,8),H=D.getUint16(0,!1),E=D.getUint16(2,!1),k=D.getUint16(4,!1),z=D.getUint16(6,!1);Q+=8,l$(B,j,H,E,k,z,U.rgba)}return{consumed:Q-$,rgba:B}}function jE(_,$,j,G,Z,X){let Y=Z||Q2,L=Math.max(1,Math.floor(Number(Y.bitsPerPixel||0)/8)),V=new Uint8ClampedArray(Math.max(0,j||0)*Math.max(0,G||0)*4),q=$,Q=[0,0,0,255],K=[255,255,255,255];for(let B=0;B<G;B+=16){let N=Math.min(16,G-B);for(let U=0;U<j;U+=16){let D=Math.min(16,j-U);if(_.byteLength<q+1)return null;let H=_[q++];if(H&1){let E=D*N*L;if(_.byteLength<q+E)return null;let k=X(_.slice(q,q+E),D,N,Y);q+=E,IZ(V,j,U,B,D,N,k);continue}if(H&2){let E=B$(_,q,Y);if(!E)return null;Q=E.rgba,q+=E.bytesPerPixel}if(l$(V,j,U,B,D,N,Q),H&4){let E=B$(_,q,Y);if(!E)return null;K=E.rgba,q+=E.bytesPerPixel}if(H&8){if(_.byteLength<q+1)return null;let E=_[q++];for(let k=0;k<E;k+=1){let z=K;if(H&16){let M=B$(_,q,Y);if(!M)return null;z=M.rgba,q+=M.bytesPerPixel}if(_.byteLength<q+2)return null;let O=_[q++],I=_[q++],x=O>>4,A=O&15,y=(I>>4)+1,W=(I&15)+1;l$(V,j,U+x,B+A,y,W,z)}}}}return{consumed:q-$,rgba:V}}var Q2={bitsPerPixel:32,depth:24,bigEndian:!1,trueColor:!0,redMax:255,greenMax:255,blueMax:255,redShift:16,greenShift:8,blueShift:0};class B6{protocol=S1;state;framebufferWidth;framebufferHeight;serverName;constructor(_={}){this.shared=_.shared!==!1,this.decodeRawRect=typeof _.decodeRawRect==="function"?_.decodeRawRect:eU,this.pipeline=_.pipeline||null,this.encodings=nU(_.encodings||null),this.state="version",this.buffer=new Uint8Array(0),this.serverVersion=null,this.clientVersionText=null,this.framebufferWidth=0,this.framebufferHeight=0,this.serverName="",this.serverPixelFormat=null,this.clientPixelFormat={...Q2},this.password=typeof _.password==="string"&&_.password.length>0?_.password:null,this.inflateZrle=typeof _.inflateZrle==="function"?_.inflateZrle:dU()}receive(_){if(_)this.buffer=rU(this.buffer,_);let $=[],j=[],G=!0;while(G){if(G=!1,this.state==="version"){if(this.buffer.byteLength<12)break;let Z=this.consume(12),X=q2(Z),Y=oU(X);if(!Y)throw Error(`Unsupported RFB version banner: ${X||"<empty>"}`);this.serverVersion=Y,this.clientVersionText=sU(Y),j.push(iU(this.clientVersionText)),$.push({type:"protocol-version",protocol:S1,server:Y.text.trim(),client:this.clientVersionText.trim()}),this.state=Y.minor>=7?"security-types":"security-type-33",G=!0;continue}if(this.state==="security-types"){if(this.buffer.byteLength<1)break;let Z=this.buffer[0];if(Z===0){if(this.buffer.byteLength<5)break;let V=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(1,!1);if(this.buffer.byteLength<5+V)break;this.consume(1);let q=q2(this.consume(4+V).slice(4));throw Error(q||"VNC server rejected the connection.")}if(this.buffer.byteLength<1+Z)break;this.consume(1);let X=Array.from(this.consume(Z));$.push({type:"security-types",protocol:S1,types:X});let Y=null;if(X.includes(2)&&this.password!==null)Y=2;else if(X.includes(1))Y=1;else if(X.includes(2))throw Error("VNC password authentication is required. Enter a password and reconnect.");else throw Error(`Unsupported VNC security types: ${X.join(", ")||"none"}. This viewer currently supports only "None" and password-based VNC auth.`);j.push(Uint8Array.of(Y)),$.push({type:"security-selected",protocol:S1,securityType:Y,label:Y===2?"VNC Authentication":"None"}),this.state=Y===2?"security-challenge":"security-result",G=!0;continue}if(this.state==="security-type-33"){if(this.buffer.byteLength<4)break;let X=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(0,!1);if(this.consume(4),X===0){if(this.buffer.byteLength<4)break;let L=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(0,!1);if(this.buffer.byteLength<4+L)break;let V=q2(this.consume(4+L).slice(4));throw Error(V||"VNC server rejected the connection.")}if(X===2){if(this.password===null)throw Error("VNC password authentication is required. Enter a password and reconnect.");$.push({type:"security-selected",protocol:S1,securityType:2,label:"VNC Authentication"}),this.state="security-challenge",G=!0;continue}if(X!==1)throw Error(`Unsupported VNC security type ${X}. This viewer currently supports only "None" and password-based VNC auth.`);$.push({type:"security-selected",protocol:S1,securityType:1,label:"None"}),j.push(Uint8Array.of(this.shared?1:0)),this.state="server-init",G=!0;continue}if(this.state==="security-challenge"){if(this.buffer.byteLength<16)break;if(this.password===null)throw Error("VNC password authentication is required. Enter a password and reconnect.");let Z=this.consume(16);j.push(yZ(this.password,Z)),this.state="security-result",G=!0;continue}if(this.state==="security-result"){if(this.buffer.byteLength<4)break;let X=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(0,!1);if(this.consume(4),X!==0){if(this.buffer.byteLength>=4){let Y=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(0,!1);if(this.buffer.byteLength>=4+Y){let L=q2(this.consume(4+Y).slice(4));throw Error(L||"VNC authentication failed.")}}throw Error("VNC authentication failed.")}$.push({type:"security-result",protocol:S1,ok:!0}),j.push(Uint8Array.of(this.shared?1:0)),this.state="server-init",G=!0;continue}if(this.state==="server-init"){if(this.buffer.byteLength<24)break;let Z=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength),X=Z.getUint16(0,!1),Y=Z.getUint16(2,!1),L=MZ(Z,4),V=Z.getUint32(20,!1);if(this.buffer.byteLength<24+V)break;let q=this.consume(24),Q=new DataView(q.buffer,q.byteOffset,q.byteLength);if(this.framebufferWidth=Q.getUint16(0,!1),this.framebufferHeight=Q.getUint16(2,!1),this.serverPixelFormat=MZ(Q,4),this.serverName=q2(this.consume(V)),this.state="connected",this.pipeline)this.pipeline.initFramebuffer(this.framebufferWidth,this.framebufferHeight);j.push(aU(this.clientPixelFormat)),j.push(tU(this.encodings)),j.push(wZ(!1,this.framebufferWidth,this.framebufferHeight)),$.push({type:"display-init",protocol:S1,width:X,height:Y,name:this.serverName,pixelFormat:L}),G=!0;continue}if(this.state==="connected"){if(this.buffer.byteLength<1)break;let Z=this.buffer[0];if(Z===0){if(this.buffer.byteLength<4)break;let Y=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint16(2,!1),L=4,V=[],q=!1,Q=!!this.pipeline;for(let B=0;B<Y;B+=1){if(this.buffer.byteLength<L+12){q=!0;break}let N=new DataView(this.buffer.buffer,this.buffer.byteOffset+L,12),U=N.getUint16(0,!1),D=N.getUint16(2,!1),H=N.getUint16(4,!1),E=N.getUint16(6,!1),k=N.getInt32(8,!1);if(L+=12,k===0){let z=Math.max(1,Math.floor(Number(this.clientPixelFormat.bitsPerPixel||0)/8)),O=H*E*z;if(this.buffer.byteLength<L+O){q=!0;break}let I=this.buffer.slice(L,L+O);if(L+=O,Q)this.pipeline.processRawRect(I,U,D,H,E,this.clientPixelFormat),V.push({kind:"pipeline",x:U,y:D,width:H,height:E});else V.push({kind:"rgba",x:U,y:D,width:H,height:E,rgba:this.decodeRawRect(I,H,E,this.clientPixelFormat)});continue}if(k===2){let z=$E(this.buffer,L,H,E,this.clientPixelFormat);if(!z){q=!0;break}if(Q){let O=this.buffer.slice(L,L+z.consumed);this.pipeline.processRreRect(O,U,D,H,E,this.clientPixelFormat),V.push({kind:"pipeline",x:U,y:D,width:H,height:E})}else V.push({kind:"rgba",x:U,y:D,width:H,height:E,rgba:z.rgba});L+=z.consumed;continue}if(k===1){if(this.buffer.byteLength<L+4){q=!0;break}let z=new DataView(this.buffer.buffer,this.buffer.byteOffset+L,4),O=z.getUint16(0,!1),I=z.getUint16(2,!1);if(L+=4,Q)this.pipeline.processCopyRect(U,D,H,E,O,I),V.push({kind:"pipeline",x:U,y:D,width:H,height:E});else V.push({kind:"copy",x:U,y:D,width:H,height:E,srcX:O,srcY:I});continue}if(k===16){let z=_E(this.buffer,L,H,E,this.clientPixelFormat,this.decodeRawRect,this.inflateZrle);if(!z){q=!0;break}if(L+=z.consumed,z.skipped)continue;if(Q&&z.decompressed)this.pipeline.processZrleTileData(z.decompressed,U,D,H,E,this.clientPixelFormat),V.push({kind:"pipeline",x:U,y:D,width:H,height:E});else V.push({kind:"rgba",x:U,y:D,width:H,height:E,rgba:z.rgba});continue}if(k===5){let z=jE(this.buffer,L,H,E,this.clientPixelFormat,this.decodeRawRect);if(!z){q=!0;break}if(Q){let O=this.buffer.slice(L,L+z.consumed);this.pipeline.processHextileRect(O,U,D,H,E,this.clientPixelFormat),V.push({kind:"pipeline",x:U,y:D,width:H,height:E})}else V.push({kind:"rgba",x:U,y:D,width:H,height:E,rgba:z.rgba});L+=z.consumed;continue}if(k===-223){if(this.framebufferWidth=H,this.framebufferHeight=E,Q)this.pipeline.initFramebuffer(H,E);V.push({kind:"resize",x:U,y:D,width:H,height:E});continue}throw Error(`Unsupported VNC rectangle encoding ${k}. This viewer currently supports ZRLE, Hextile, RRE, CopyRect, raw rectangles, and DesktopSize only.`)}if(q)break;this.consume(L);let K={type:"framebuffer-update",protocol:S1,width:this.framebufferWidth,height:this.framebufferHeight,rects:V};if(Q)K.framebuffer=this.pipeline.getFramebuffer();$.push(K),j.push(wZ(!0,this.framebufferWidth,this.framebufferHeight)),G=!0;continue}if(Z===2){this.consume(1),$.push({type:"bell",protocol:S1}),G=!0;continue}if(Z===3){if(this.buffer.byteLength<8)break;let Y=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength).getUint32(4,!1);if(this.buffer.byteLength<8+Y)break;this.consume(8);let L=q2(this.consume(Y));$.push({type:"clipboard",protocol:S1,text:L}),G=!0;continue}throw Error(`Unsupported VNC server message type ${Z}.`)}}return{events:$,outgoing:j}}consume(_){let $=this.buffer.slice(0,_);return this.buffer=this.buffer.slice(_),$}}var i1="piclaw://vnc";function PZ(_){let $=String(_||"").trim();return $?`${i1}/${encodeURIComponent($)}`:i1}var o3="piclaw:vnc-popout:",GE=60000;function RZ(_=globalThis){try{return _?.localStorage??null}catch{return null}}function ZE(_=globalThis){let $=kG(_);if($)return $;return`vnc-popout-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`}function SZ(_,$=Date.now()){if(!_||typeof _.key!=="function"||!Number.isFinite(_.length))return;let j=[];for(let G=0;G<Number(_.length||0);G+=1){let Z=_.key(G);if(Z&&Z.startsWith(o3))j.push(Z)}for(let G of j)try{let Z=_.getItem(G);if(!Z){_.removeItem(G);continue}let X=JSON.parse(Z),Y=Number(X?.expiresAt||0);if(!Number.isFinite(Y)||Y<=$)_.removeItem(G)}catch{G6(_,G)}}function XE(_,$=globalThis,j=Date.now()){let G=H4(_);if(G===null)return null;let Z=RZ($);if(!Z)return null;SZ(Z,j);let X=ZE($);try{return Z.setItem(`${o3}${X}`,JSON.stringify({password:G,expiresAt:j+GE})),X}catch{return null}}function YE(_,$=globalThis,j=Date.now()){let G=String(_||"").trim();if(!G)return null;let Z=RZ($);if(!Z)return null;SZ(Z,j);let X=`${o3}${G}`;try{let Y=Z.getItem(X);if(Z.removeItem(X),!Y)return null;let L=JSON.parse(Y),V=Number(L?.expiresAt||0);if(!Number.isFinite(V)||V<=j)return null;return H4(L?.password)}catch{try{Z.removeItem(X)}catch{}return null}}function LE(_,$,j=globalThis){let G=String(_||"").trim();if(!G)return null;let Z={pane_path:PZ(G)},X=XE($,j);if(X)Z.vnc_secret=X;return Z}function qE(_){let $=String(_||"");if($===i1)return null;if(!$.startsWith(`${i1}/`))return null;let j=$.slice(`${i1}/`.length).trim();if(!j)return null;try{return decodeURIComponent(j)}catch{return j}}function d1(_){return String(_||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function VE(_=null){let $=_?`/vnc/session?target=${encodeURIComponent(_)}`:"/vnc/session",j=await fetch($,{credentials:"same-origin"}),G=await j.json().catch(()=>({}));if(!j.ok)throw Error(G?.error||`HTTP ${j.status}`);return G}function KE(){if(typeof window>"u")return!1;try{let _=new URLSearchParams(window.location.search).get("pane_popout"),$=String(_||"").trim().toLowerCase();return $==="1"||$==="true"||$==="yes"}catch{return!1}}function QE(_,$=null){let j=window.location.protocol==="https:"?"wss:":"ws:",G=new URL(`${j}//${window.location.host}/vnc/ws`);if(G.searchParams.set("target",String(_||"")),$)G.searchParams.set("handoff",String($));return G.toString()}function NE(_){return String(_||"").trim()||"localhost"}function BE(_,$){let j=NE(_),G=Math.floor(Number($||0));if(!Number.isFinite(G)||G<=0||G>65535)return null;return`${j.includes(":")&&!j.startsWith("[")?`[${j}]`:j}:${G}`}function FE(_={}){let $=Boolean(_?.enabled),j=Boolean(_?.directConnectEnabled);if((Array.isArray(_?.targets)?_.targets.length:Number(_?.targetCount||0))>0)return{title:"",body:""};if(j)return{title:"No saved VNC targets yet.",body:"Connect directly above."};if(!$)return{title:"VNC is not configured yet.",body:"No saved targets are available and direct connect is disabled on this host."};return{title:"No saved VNC targets yet.",body:"This host has no configured VNC targets, and direct connect is disabled."}}function CZ(_){if(typeof window>"u")return null;try{let $=new URL(window.location.href),j=$.searchParams.get(_)?.trim()||"";if(!j)return null;return $.searchParams.delete(_),window.history?.replaceState?.(window.history.state,document.title,$.toString()),j}catch{return null}}function fZ(_){if(!String(_?.handoffToken||"").trim())return!1;return Number(_?.bytesIn||0)<=0&&!Boolean(_?.hasRenderedFrame)&&Number(_?.reconnectAttempts||0)<=0}function UE(_,$){if(!_||!$||typeof $.appendChild!=="function")return!1;try{$.innerHTML=""}catch{}return $.appendChild(_),!0}class uZ{container;root;statusEl;bodyEl;metricsEl;targetSubtitleEl;socketBoundary=null;protocol=null;disposed=!1;targetId=null;targetLabel=null;bytesIn=0;bytesOut=0;canvas=null;canvasCtx=null;displayPlaceholderEl=null;displayInfoEl=null;displayMetaEl=null;displayStageEl=null;chromeEl=null;sessionShellEl=null;resizeObserver=null;displayScale=null;readOnly=!1;pointerButtonMask=0;pointerInputAbortController=null;pressedKeysyms=new Map;passwordInputEl=null;authPassword=null;directHostInputEl=null;directPortInputEl=null;directPasswordInputEl=null;hasRenderedFrame=!1;frameTimeoutId=null;reconnectTimerId=null;reconnectAttempts=0;rawFallbackAttempted=!1;protocolRecovering=!1;pendingHandoffToken=null;constructor(_,$){this.container=_,this.targetId=qE($?.path),this.targetLabel=this.targetId||null,this.pendingHandoffToken=CZ("vnc_handoff");let j=CZ("vnc_secret"),G=YE(j);if(G!==null)this.authPassword=G;this.root=document.createElement("div"),this.root.className="vnc-pane-shell",this.root.style.cssText="display:flex;flex-direction:column;width:100%;height:100%;background:var(--bg-primary);color:var(--text-primary);",this.targetSubtitleEl=null,this.statusEl=document.createElement("div"),this.statusEl.style.cssText="display:none;",this.statusEl.textContent="",this.bodyEl=document.createElement("div"),this.bodyEl.style.cssText="flex:1;min-height:0;display:flex;align-items:stretch;justify-content:stretch;padding:12px;",this.metricsEl=document.createElement("div"),this.metricsEl.style.cssText="display:none;",this.updateMetrics(),this.root.append(this.statusEl,this.bodyEl),this.container.appendChild(this.root),this.load()}setStatus(_){this.statusEl.textContent=String(_||"")}setSessionChromeVisible(_){if(this.chromeEl)this.chromeEl.style.display=_?"grid":"none";if(this.sessionShellEl?.style)this.sessionShellEl.style.gridTemplateRows=_?"auto minmax(0,1fr)":"1fr";if(this.displayStageEl?.style)this.displayStageEl.style.padding=_?"12px":"0",this.displayStageEl.style.border=_?"1px solid var(--border-color)":"none",this.displayStageEl.style.borderRadius=_?"16px":"0",this.displayStageEl.style.background=_?"#0a0a0a":"#000";if(this.displayPlaceholderEl?.style)this.displayPlaceholderEl.style.display=_&&!this.hasRenderedFrame?"block":"none"}clearReconnectTimer(){if(this.reconnectTimerId)clearTimeout(this.reconnectTimerId),this.reconnectTimerId=null}scheduleReconnect(_=null){if(this.disposed||!this.targetId)return;this.clearReconnectTimer();let $=Math.min(8000,1500+this.reconnectAttempts*1000),j=Number.isFinite(_)?Math.max(0,Number(_)):$;this.reconnectAttempts+=1,this.reconnectTimerId=setTimeout(()=>{if(this.reconnectTimerId=null,this.disposed||!this.targetId)return;this.connectSocket()},j)}updateMetrics(){this.metricsEl.textContent=`Transport bytes — in: ${this.bytesIn} / out: ${this.bytesOut}`}applyMetrics(_){this.bytesIn=Number(_?.bytesIn||0),this.bytesOut=Number(_?.bytesOut||0),this.updateMetrics()}openTargetTab(_,$){if(this.targetId=String(_||"").trim()||null,this.targetLabel=String($||_||"").trim()||this.targetId||"VNC",this.targetId)this.renderTargetSession({direct_connect_enabled:!0,target:{id:this.targetId,label:this.targetLabel,read_only:!1,direct_connect:!0}}),this.setStatus("Connecting…"),this.updateDisplayInfo("Connecting…"),this.updateDisplayMeta("connecting");this.load()}requestPanePopout(_,$){this.container.dispatchEvent(new CustomEvent("pane:popout",{bubbles:!0,detail:{path:_,label:$}}))}resetLiveSession(){this.clearReconnectTimer(),this.reconnectAttempts=0,this.protocol=null;try{this.socketBoundary?.dispose?.()}catch{}this.socketBoundary=null;try{this.resizeObserver?.disconnect?.()}catch{}this.resizeObserver=null;try{this.pointerInputAbortController?.abort?.()}catch{}if(this.pointerInputAbortController=null,this.canvas=null,this.canvasCtx=null,this.displayPlaceholderEl=null,this.displayInfoEl=null,this.displayMetaEl=null,this.displayStageEl=null,this.displayScale=null,this.passwordInputEl=null,this.directHostInputEl=null,this.directPortInputEl=null,this.directPasswordInputEl=null,this.hasRenderedFrame=!1,this.rawFallbackAttempted=!1,this.protocolRecovering=!1,this.frameTimeoutId)clearTimeout(this.frameTimeoutId),this.frameTimeoutId=null;this.pressedKeysyms.clear()}renderTargets(_){this.resetLiveSession();let $=Array.isArray(_?.targets)?_.targets:[],j=Boolean(_?.direct_connect_enabled),G=FE({enabled:_?.enabled,directConnectEnabled:j,targets:$});this.bodyEl.innerHTML=`
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
                        ${$.map((X)=>`
                            <div style="text-align:left;padding:14px;border:1px solid var(--border-color);border-radius:10px;background:transparent;color:inherit;display:flex;flex-direction:column;gap:10px;">
                                <div>
                                    <div style="font-weight:600;margin-bottom:6px;">${d1(X.label||X.id)}</div>
                                    <div style="font:12px var(--font-family-mono, monospace);color:var(--text-secondary);">${d1(X.id)}</div>
                                    <div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">${X.readOnly?"Read-only target":"Interactive target"}</div>
                                </div>
                                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                                    <button type="button" data-target-open-tab="${d1(X.id)}" data-target-label="${d1(X.label||X.id)}" style="padding:8px 12px;border:1px solid var(--border-color);border-radius:8px;background:transparent;cursor:pointer;color:inherit;">Connect</button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `:`
                    <div style="min-height:0;display:grid;place-items:center;justify-items:center;">
                        <div style="width:min(100%,540px);text-align:center;padding:24px 20px;border:1px dashed var(--border-color);border-radius:10px;background:transparent;font-size:13px;color:var(--text-secondary);line-height:1.5;display:grid;gap:6px;">
                            <div style="font-weight:600;color:var(--text-primary);">${d1(G.title)}</div>
                            <div>${d1(G.body)}</div>
                        </div>
                    </div>
                `}
            </div>
        `,this.directHostInputEl=this.bodyEl.querySelector("[data-vnc-direct-host]"),this.directPortInputEl=this.bodyEl.querySelector("[data-vnc-direct-port]"),this.directPasswordInputEl=this.bodyEl.querySelector("[data-vnc-direct-password]");let Z=()=>{let X=BE(this.directHostInputEl?.value,this.directPortInputEl?.value);if(!X)return;this.authPassword=H4(this.directPasswordInputEl?this.directPasswordInputEl.value:this.authPassword),this.openTargetTab(X,X)};this.directHostInputEl?.addEventListener("keydown",(X)=>{if(X.key!=="Enter")return;X.preventDefault(),Z()}),this.directPortInputEl?.addEventListener("keydown",(X)=>{if(X.key!=="Enter")return;X.preventDefault(),Z()}),this.directPasswordInputEl?.addEventListener("keydown",(X)=>{if(X.key!=="Enter")return;X.preventDefault(),Z()}),this.bodyEl.querySelector("[data-direct-open-tab]")?.addEventListener("click",()=>Z());for(let X of Array.from(this.bodyEl.querySelectorAll("[data-target-open-tab]")))X.addEventListener("click",()=>{let Y=X.getAttribute("data-target-open-tab"),L=X.getAttribute("data-target-label")||Y||"VNC";if(!Y)return;this.openTargetTab(Y,L)})}renderTargetSession(_){this.resetLiveSession();let $=_?.target||{},j=$?.label||this.targetId||"VNC target",G=KE();if(this.targetLabel=j,this.readOnly=Boolean($.read_only),this.pointerButtonMask=0,this.hasRenderedFrame=!1,this.pressedKeysyms.clear(),this.bodyEl.innerHTML=G?`
                <div data-vnc-session-shell style="width:100%;height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:6px;">
                    <div data-vnc-session-chrome style="padding:6px 8px;border:1px solid var(--border-color);border-radius:8px;background:transparent;display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
                        <div data-display-info style="min-width:0;flex:1 1 240px;font-size:12px;color:var(--text-secondary);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Negotiating remote display…</div>
                        <input type="password" data-vnc-password placeholder="Password" autocomplete="current-password" style="width:150px;max-width:100%;padding:6px 8px;border:1px solid var(--border-color);border-radius:6px;background:transparent;color:inherit;" />
                        <button type="button" data-vnc-reconnect="1" style="padding:6px 10px;border:1px solid var(--border-color);border-radius:6px;background:transparent;cursor:pointer;color:inherit;">Reconnect</button>
                    </div>
                    <div data-display-stage style="min-height:0;height:100%;border:1px solid var(--border-color);border-radius:8px;background:#0a0a0a;display:flex;align-items:center;justify-content:center;padding:4px;position:relative;overflow:hidden;">
                        <canvas data-display-canvas tabindex="0" style="display:none;max-width:100%;max-height:100%;width:auto;height:auto;image-rendering:auto;box-shadow:none;border-radius:2px;background:#000;"></canvas>
                        <div data-display-placeholder style="max-width:520px;text-align:center;color:#d7d7d7;line-height:1.5;">
                            <div style="font-weight:600;font-size:14px;margin-bottom:6px;">${d1(j)}</div>
                            <div style="font-size:12px;color:#b7b7b7;">Waiting for the VNC/RFB handshake and first framebuffer update…</div>
                        </div>
                    </div>
                </div>
            `:`
                <div data-vnc-session-shell style="width:100%;height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:12px;">
                    <div data-vnc-session-chrome style="padding:10px 12px;border:1px solid var(--border-color);border-radius:10px;background:transparent;display:grid;gap:10px;">
                        <div style="display:grid;gap:4px;min-width:0;">
                            <div style="font:12px var(--font-family-mono, monospace);color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d1($.id||this.targetId||"")} · ${$.read_only?"read-only":"interactive"} · websocket → TCP proxy</div>
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
                            <div style="font-weight:700;font-size:18px;margin-bottom:8px;">${d1(j)}</div>
                            <div style="font-size:13px;color:#b7b7b7;">Waiting for the VNC/RFB handshake and first framebuffer update…</div>
                        </div>
                    </div>
                </div>
            `,this.sessionShellEl=this.bodyEl.querySelector("[data-vnc-session-shell]"),this.chromeEl=this.bodyEl.querySelector("[data-vnc-session-chrome]"),this.displayStageEl=this.bodyEl.querySelector("[data-display-stage]"),this.canvas=this.bodyEl.querySelector("[data-display-canvas]"),this.displayPlaceholderEl=this.bodyEl.querySelector("[data-display-placeholder]"),this.displayInfoEl=this.bodyEl.querySelector("[data-display-info]"),this.displayMetaEl=this.bodyEl.querySelector("[data-display-meta]"),this.canvasCtx=this.canvas?.getContext?.("2d",{alpha:!1})||null,this.canvasCtx)this.canvasCtx.imageSmoothingEnabled=!0,this.canvasCtx.imageSmoothingQuality="high";if(this.updateDisplayInfo("Waiting for VNC protocol negotiation…"),this.updateDisplayMeta(),this.setSessionChromeVisible(!0),this.attachDisplayResizeObserver(),this.attachCanvasPointerHandlers(),this.attachCanvasKeyboardHandlers(),this.passwordInputEl=this.bodyEl.querySelector("[data-vnc-password]"),this.passwordInputEl&&this.authPassword!==null)this.passwordInputEl.value=this.authPassword;this.passwordInputEl?.addEventListener("input",()=>{this.authPassword=H4(this.passwordInputEl.value)}),this.passwordInputEl?.addEventListener("keydown",(Y)=>{if(Y.key!=="Enter")return;Y.preventDefault(),this.connectSocket()}),this.bodyEl.querySelector("[data-vnc-reconnect]")?.addEventListener("click",()=>{this.authPassword=H4(this.passwordInputEl?this.passwordInputEl.value:this.authPassword),this.connectSocket()}),this.bodyEl.querySelector("[data-open-target-picker]")?.addEventListener("click",()=>{this.openTargetTab("","VNC")})}updateDisplayInfo(_){if(this.displayInfoEl)this.displayInfoEl.textContent=String(_||"")}updateDisplayMeta(_=""){if(!this.displayMetaEl)return;let $=this.protocol?.state?`state=${this.protocol.state}`:"state=idle",j=this.protocol?.framebufferWidth&&this.protocol?.framebufferHeight?`${this.protocol.framebufferWidth}×${this.protocol.framebufferHeight}`:"pending",G=this.protocol?.serverName?` · name=${this.protocol.serverName}`:"",Z=this.displayScale?` · scale=${Math.round(this.displayScale*100)}%`:"",X=_?` · ${_}`:"";this.displayMetaEl.textContent=`${$} · framebuffer=${j}${G}${Z}${X}`}ensureCanvasSize(_,$,j={}){if(!this.canvas||!this.canvasCtx||!_||!$)return;if(this.canvas.width!==_||this.canvas.height!==$)this.canvas.width=_,this.canvas.height=$;let G=j?.reveal===!0;if(this.canvas.style.display=G||this.hasRenderedFrame?"block":"none",this.canvas.style.aspectRatio=`${_} / ${$}`,this.displayPlaceholderEl)this.displayPlaceholderEl.style.display=G||this.hasRenderedFrame?"none":"";this.updateCanvasScale()}attachDisplayResizeObserver(){if(!this.displayStageEl||typeof ResizeObserver>"u")return;try{this.resizeObserver?.disconnect?.()}catch{}this.resizeObserver=new ResizeObserver(()=>{this.updateCanvasScale()}),this.resizeObserver.observe(this.displayStageEl)}updateCanvasScale(){if(!this.canvas||!this.displayStageEl||!this.canvas.width||!this.canvas.height)return;requestAnimationFrame(()=>{if(!this.canvas||!this.displayStageEl)return;let _=this.displayStageEl.getBoundingClientRect?.(),$=Math.max(1,Math.floor(_?.width||this.displayStageEl.clientWidth||0)-32),j=Math.max(1,Math.floor(_?.height||this.displayStageEl.clientHeight||0)-32);if(!$||!j)return;let G=YZ($,j,this.canvas.width,this.canvas.height);this.displayScale=G,this.canvas.style.width=`${Math.max(1,Math.round(this.canvas.width*G))}px`,this.canvas.style.height=`${Math.max(1,Math.round(this.canvas.height*G))}px`,this.updateDisplayMeta()})}getFramebufferPointFromEvent(_){if(!this.canvas||!this.protocol?.framebufferWidth||!this.protocol?.framebufferHeight)return null;let $=this.canvas.getBoundingClientRect?.();if(!$||!$.width||!$.height)return null;return g3(_.clientX,_.clientY,$,this.protocol.framebufferWidth,this.protocol.framebufferHeight)}sendPointerEvent(_,$,j){if(!this.socketBoundary||!this.protocol||this.protocol.state!=="connected")return;this.socketBoundary.send(K6(_,$,j))}attachCanvasPointerHandlers(){if(!this.canvas||this.readOnly)return;this.canvas.style.cursor="crosshair",this.canvas.style.touchAction="none";try{this.pointerInputAbortController?.abort?.()}catch{}let _=new AbortController;this.pointerInputAbortController=_;let $=_.signal,j=this.canvas.ownerDocument||document,G=j.defaultView||window,Z=new Map,X=new Map,Y=new Map,L=new Map,V=new Set,q=!1,Q=(A)=>this.getFramebufferPointFromEvent(A)||X.get(A?.pointerId)||{x:0,y:0},K=(A)=>{if(!A||!this.canvas||!this.protocol?.framebufferWidth||!this.protocol?.framebufferHeight)return null;let y=this.canvas.getBoundingClientRect?.();if(!y||!y.width||!y.height)return null;return g3(A.clientX,A.clientY,y,this.protocol.framebufferWidth,this.protocol.framebufferHeight)},B=(A)=>{let y=Y.get(A);if(y)G.clearTimeout(y),Y.delete(A)},N=(A)=>{let y=L.get(A);if(y?.holdTimer)G.clearTimeout(y.holdTimer);L.delete(A)},U=()=>{for(let A of L.keys())N(A)},D=()=>{if(!V.size)q=!1},H=(A,y=80)=>{let W=String(A?.pointerType||"").toLowerCase();if(!jZ(W))return;let M=Number(A?.pointerId);if(!Number.isFinite(M))return;B(M);let T=G.setTimeout(()=>{if(Y.delete(M),!Z.has(M)&&!this.pointerButtonMask)return;k({pointerId:M,pointerType:W,type:"pointercancel",clientX:A?.clientX,clientY:A?.clientY},{resetAll:!0})},y);Y.set(M,T)},E=(A=null)=>{if(!Z.size&&!this.pointerButtonMask&&!L.size)return;for(let W of Y.keys())B(W);U(),V.clear(),q=!1;let y=A||X.values().next().value||{x:0,y:0};Z.clear(),X.clear(),this.pointerButtonMask=0,this.sendPointerEvent(0,y.x,y.y)},k=(A,y={})=>{if(y.resetAll){let C=Number(A?.pointerId);B(C),E(Q(A));try{this.canvas?.releasePointerCapture?.(C)}catch{}return}let W=Q(A),M=Number(A?.pointerId);B(M),N(M),V.delete(M),D();let T=Z.has(M),J=Z.get(M)??S3(A);if(!T&&!J&&!this.pointerButtonMask)return;if(Z.delete(M),X.delete(M),J)this.pointerButtonMask&=~J;else if(!Z.size)this.pointerButtonMask=0;this.sendPointerEvent(this.pointerButtonMask,W.x,W.y);try{this.canvas?.releasePointerCapture?.(M)}catch{}},z=(A)=>{if(q)return;let y=L.get(A);if(!y||y.dragActivated)return;y.dragActivated=!0,y.holdTimer=null;let W=m$(0);if(!W)return;Z.set(A,(Z.get(A)??0)|W),this.pointerButtonMask|=W,H({pointerId:A,pointerType:"touch",clientX:y.lastClientX,clientY:y.lastClientY}),this.sendPointerEvent(this.pointerButtonMask,y.lastPoint.x,y.lastPoint.y)},O=(A,y,W={})=>{let M=L.get(A);if(!M)return!1;let T=y||M.lastPoint||{x:0,y:0},J=Number.isFinite(W.clientX)?Number(W.clientX):M.lastClientX,C=Number.isFinite(W.clientY)?Number(W.clientY):M.lastClientY;if(V.delete(A),W.cancelled||q){if(N(A),D(),Z.has(A)||this.pointerButtonMask)E(T);return!0}if(M.dragActivated||Z.has(A))return k({pointerId:A,pointerType:"touch",type:"pointerup",clientX:J,clientY:C}),D(),!0;let P=Date.now()-M.startedAt,b=$Z({startX:M.startClientX,startY:M.startClientY,clientX:J,clientY:C,elapsedMs:P});if(B(A),N(A),X.delete(A),D(),b){let m=m$(0);this.sendPointerEvent(m,T.x,T.y),this.sendPointerEvent(0,T.x,T.y)}else this.sendPointerEvent(this.pointerButtonMask,T.x,T.y);return!0};this.canvas.addEventListener("contextmenu",(A)=>{A.preventDefault()},{signal:$}),this.canvas.addEventListener("pointermove",(A)=>{let y=this.getFramebufferPointFromEvent(A);if(!y)return;let W=String(A?.pointerType||"").toLowerCase(),M=n1(W);if(X.set(A.pointerId,y),M){let T=L.get(A.pointerId);if(T){if(T.lastClientX=Number(A?.clientX||0),T.lastClientY=Number(A?.clientY||0),T.lastPoint=y,!T.dragActivated&&u3({startX:T.startClientX,startY:T.startClientY,clientX:T.lastClientX,clientY:T.lastClientY}))N(A.pointerId),L.set(A.pointerId,{...T,holdTimer:null,dragActivated:!1});if(!T.dragActivated){this.sendPointerEvent(this.pointerButtonMask,y.x,y.y);return}}if(q)return}if(Z.has(A.pointerId)&&E4(A)){k(A,{resetAll:!0});return}if(this.pointerButtonMask&&!Z.has(A.pointerId)&&E4(A)){E(y);return}if(Z.has(A.pointerId))H(A);this.sendPointerEvent(this.pointerButtonMask,y.x,y.y)},{signal:$}),this.canvas.addEventListener("pointerdown",(A)=>{let y=this.getFramebufferPointFromEvent(A);if(!y)return;let W=String(A?.pointerType||"").toLowerCase(),M=n1(W);if(A.preventDefault(),this.canvas?.focus?.(),X.set(A.pointerId,y),M){if(V.add(A.pointerId),V.size>1){let C=[...V];q=!0,E(y);for(let P of C)V.add(P);q=!0;return}N(A.pointerId);let J={startClientX:Number(A?.clientX||0),startClientY:Number(A?.clientY||0),lastClientX:Number(A?.clientX||0),lastClientY:Number(A?.clientY||0),startedAt:Date.now(),lastPoint:y,holdTimer:null,dragActivated:!1};J.holdTimer=G.setTimeout(()=>{z(A.pointerId)},260),L.set(A.pointerId,J),this.sendPointerEvent(this.pointerButtonMask,y.x,y.y);return}if(W==="mouse")try{this.canvas?.setPointerCapture?.(A.pointerId)}catch{}let T=S3(A);if(!T)return;Z.set(A.pointerId,(Z.get(A.pointerId)??0)|T),this.pointerButtonMask|=T,H(A),this.sendPointerEvent(this.pointerButtonMask,y.x,y.y)},{signal:$,passive:!1}),this.canvas.addEventListener("pointerup",(A)=>{if(A.preventDefault(),n1(A?.pointerType)){let y=Q(A);if(O(A.pointerId,y,{clientX:A?.clientX,clientY:A?.clientY}))return}k(A)},{signal:$,passive:!1}),this.canvas.addEventListener("pointercancel",(A)=>{if(A.preventDefault(),n1(A?.pointerType)){let y=Q(A);if(O(A.pointerId,y,{clientX:A?.clientX,clientY:A?.clientY,cancelled:!0}))return}k(A,{resetAll:!0})},{signal:$,passive:!1}),this.canvas.addEventListener("pointerleave",(A)=>{if(L.has(A.pointerId)&&n1(A?.pointerType)){O(A.pointerId,Q(A),{clientX:A?.clientX,clientY:A?.clientY,cancelled:!0});return}if(!Z.has(A.pointerId))return;if(!E4(A))return;k(A,{resetAll:!0})},{signal:$}),this.canvas.addEventListener("pointerout",(A)=>{if(L.has(A.pointerId)&&n1(A?.pointerType)){O(A.pointerId,Q(A),{clientX:A?.clientX,clientY:A?.clientY,cancelled:!0});return}if(!Z.has(A.pointerId))return;if(!E4(A))return;k(A,{resetAll:!0})},{signal:$}),this.canvas.addEventListener("lostpointercapture",(A)=>{k(A,{resetAll:!0})},{signal:$}),G.addEventListener("pointermove",(A)=>{if(!Z.size&&!this.pointerButtonMask||!E4(A))return;if(!Z.has(A.pointerId)&&!this.pointerButtonMask)return;k(A,{resetAll:!0})},{signal:$}),G.addEventListener("pointerup",(A)=>{if(!Z.has(A.pointerId)&&!this.pointerButtonMask&&!L.has(A.pointerId))return;if(A.preventDefault?.(),n1(A?.pointerType)){let y=Q(A);if(O(A.pointerId,y,{clientX:A?.clientX,clientY:A?.clientY}))return}k(A,{resetAll:!Z.has(A.pointerId)})},{signal:$,passive:!1}),G.addEventListener("pointercancel",(A)=>{if(!Z.has(A.pointerId)&&!this.pointerButtonMask&&!L.has(A.pointerId))return;if(A.preventDefault?.(),n1(A?.pointerType)){let y=Q(A);if(O(A.pointerId,y,{clientX:A?.clientX,clientY:A?.clientY,cancelled:!0}))return}k(A,{resetAll:!0})},{signal:$,passive:!1});let I=(A)=>{if(!Z.size&&!this.pointerButtonMask&&!L.size)return;if(!_Z(A))return;let y=A?.changedTouches?.[0]||A?.touches?.[0]||null,W=K(y)||X.values().next().value||L.values().next().value?.lastPoint||{x:0,y:0};if(!Z.size&&!this.pointerButtonMask&&L.size===1){let[M]=L.entries().next().value||[];if(Number.isFinite(M)){O(M,W,{clientX:y?.clientX,clientY:y?.clientY,cancelled:A?.type==="touchcancel"});return}}E(W)},x=(A,y={})=>{if(!Z.size&&!this.pointerButtonMask&&!L.has(A?.pointerId))return;if(!E4(A))return;if(A?.preventDefault?.(),n1(A?.pointerType)){let W=Q(A);if(O(A.pointerId,W,{clientX:A?.clientX,clientY:A?.clientY,cancelled:y.resetAll===!0}))return}k(A,{resetAll:y.resetAll===!0||!Z.has(A?.pointerId)})};this.canvas.addEventListener("touchend",I,{signal:$,passive:!0,capture:!0}),this.canvas.addEventListener("touchcancel",I,{signal:$,passive:!0,capture:!0}),j.addEventListener("touchend",I,{signal:$,passive:!0,capture:!0}),j.addEventListener("touchcancel",I,{signal:$,passive:!0,capture:!0}),G.addEventListener("touchend",I,{signal:$,passive:!0,capture:!0}),G.addEventListener("touchcancel",I,{signal:$,passive:!0,capture:!0}),j.addEventListener("pointerup",(A)=>{x(A)},{signal:$,passive:!1,capture:!0}),j.addEventListener("pointercancel",(A)=>{x(A,{resetAll:!0})},{signal:$,passive:!1,capture:!0}),G.addEventListener("mouseup",()=>{if(!Z.size&&!this.pointerButtonMask&&!L.size)return;E()},{signal:$}),G.addEventListener("blur",()=>{if(!Z.size&&!this.pointerButtonMask&&!L.size)return;E()},{signal:$}),j.addEventListener("visibilitychange",()=>{if(j.visibilityState==="hidden")E()},{signal:$}),this.canvas.addEventListener("wheel",(A)=>{let y=this.getFramebufferPointFromEvent(A);if(!y)return;A.preventDefault();for(let W of GZ(A.deltaY,y.x,y.y,this.pointerButtonMask))this.socketBoundary?.send?.(W)},{signal:$,passive:!1})}sendKeyEvent(_,$){if(!this.socketBoundary||!this.protocol||this.protocol.state!=="connected")return;this.socketBoundary.send(ZZ(_,$))}releasePressedKeys(){for(let _ of this.pressedKeysyms.values())this.sendKeyEvent(!1,_);this.pressedKeysyms.clear()}attachCanvasKeyboardHandlers(){if(!this.canvas||this.readOnly)return;this.canvas.addEventListener("keydown",(_)=>{let $=b3(_);if($==null)return;let j=_.code||_.key,G=this.pressedKeysyms.get(j);if(XZ(G,$,_.repeat)){_.preventDefault();return}_.preventDefault(),this.pressedKeysyms.set(j,$),this.sendKeyEvent(!0,$)}),this.canvas.addEventListener("keyup",(_)=>{let $=_.code||_.key,j=this.pressedKeysyms.get($)??b3(_);if(j==null)return;_.preventDefault(),this.pressedKeysyms.delete($),this.sendKeyEvent(!1,j)}),this.canvas.addEventListener("blur",()=>{this.releasePressedKeys()})}drawRgbaRect(_){if(!this.canvasCtx||!this.canvas)return;this.ensureCanvasSize(this.canvas.width||_.width,this.canvas.height||_.height,{reveal:!0});let $=new ImageData(_.rgba,_.width,_.height);this.canvasCtx.putImageData($,_.x,_.y),this.hasRenderedFrame=!0}copyCanvasRect(_){if(!this.canvasCtx||!this.canvas)return;this.ensureCanvasSize(this.canvas.width||_.width,this.canvas.height||_.height,{reveal:!0});let $=this.canvasCtx.getImageData(_.srcX,_.srcY,_.width,_.height);this.canvasCtx.putImageData($,_.x,_.y),this.hasRenderedFrame=!0}scheduleRawFallbackTimeout(){if(this.frameTimeoutId)clearTimeout(this.frameTimeoutId),this.frameTimeoutId=null;if(this.rawFallbackAttempted||this.protocolRecovering)return;this.frameTimeoutId=setTimeout(()=>{if(this.hasRenderedFrame||this.rawFallbackAttempted||this.protocolRecovering)return;if(this.protocol&&this.socketBoundary)this.rawFallbackAttempted=!0,this.protocolRecovering=!0,this.setStatus("No framebuffer update yet; retrying with RAW encoding."),this.updateDisplayInfo("No framebuffer update yet. Retrying with RAW encoding."),this.updateDisplayMeta("reconnect-encoding-fallback"),this.connectWithEncodings("0")},2200)}applyRemoteDisplayEvent(_){if(!_)return;switch(_.type){case"protocol-version":this.setStatus(`Negotiated ${_.protocol.toUpperCase()} ${_.server} → ${_.client}.`),this.updateDisplayInfo(`Negotiated ${_.server} → ${_.client}.`),this.updateDisplayMeta();return;case"security-types":this.setStatus(`Server offered security types: ${_.types.join(", ")||"none"}.`),this.updateDisplayInfo(`Security types: ${_.types.join(", ")||"none"}.`),this.updateDisplayMeta();return;case"security-selected":this.setStatus(`Using ${_.protocol.toUpperCase()} security type ${_.label}.`),this.updateDisplayInfo(`Security: ${_.label}.`),this.updateDisplayMeta();return;case"security-result":this.setStatus("Security negotiation complete. Waiting for server init…"),this.updateDisplayInfo("Security negotiation complete. Waiting for server init…"),this.updateDisplayMeta();return;case"display-init":this.ensureCanvasSize(_.width,_.height),this.setSessionChromeVisible(!1),this.setStatus(`Connected to ${this.targetLabel||this.targetId||"target"} — waiting for first framebuffer update (${_.width}×${_.height}).`),this.updateDisplayInfo(`Connected to ${_.name||this.targetLabel||this.targetId||"remote display"}. Waiting for first framebuffer update…`),this.updateDisplayMeta("awaiting-frame"),this.scheduleRawFallbackTimeout();return;case"framebuffer-update":if(this.frameTimeoutId)clearTimeout(this.frameTimeoutId),this.frameTimeoutId=null;let $=!1,j=(_.rects||[]).some((G)=>G.kind==="pipeline");if(_.framebuffer&&_.framebuffer.length>0&&_.width>0&&_.height>0&&j){this.ensureCanvasSize(_.width,_.height,{reveal:!0});for(let Z of _.rects||[])if(Z.kind==="resize")this.ensureCanvasSize(Z.width,Z.height);let G=this.canvas?.getContext("2d",{alpha:!1});if(G){let Z=new ImageData(new Uint8ClampedArray(_.framebuffer),_.width,_.height);G.putImageData(Z,0,0),$=!0}}else for(let G of _.rects||[]){if(G.kind==="resize"){this.ensureCanvasSize(G.width,G.height);continue}if(G.kind==="copy"){this.ensureCanvasSize(_.width,_.height,{reveal:!0}),this.copyCanvasRect(G),$=!0;continue}if(G.kind==="rgba")this.ensureCanvasSize(_.width,_.height,{reveal:!0}),this.drawRgbaRect(G),$=!0}if($||this.hasRenderedFrame)this.protocolRecovering=!1,this.setStatus(`Rendering live framebuffer — ${_.width}×${_.height}.`),this.updateDisplayInfo(`Framebuffer update applied (${(_.rects||[]).length} rect${(_.rects||[]).length===1?"":"s"}).`),this.updateDisplayMeta();else this.setStatus(`Connected to ${this.targetLabel||this.targetId||"target"} — waiting for painted framebuffer data.`),this.updateDisplayInfo(`Framebuffer update received, but no paintable rects yet (${(_.rects||[]).length} rect${(_.rects||[]).length===1?"":"s"}).`),this.updateDisplayMeta("awaiting-frame"),this.scheduleRawFallbackTimeout();return;case"clipboard":this.setStatus("Remote clipboard updated."),this.updateDisplayInfo(`Clipboard text received (${_.text.length} chars).`),this.updateDisplayMeta();return;case"bell":this.setStatus("Remote display bell received."),this.updateDisplayInfo("Remote display bell received."),this.updateDisplayMeta();return}}async handleSocketMessage(_){if(_?.kind==="control"){let j=_.payload;if(j?.type==="vnc.error"){this.setStatus(`Proxy error: ${j.error||"Unknown error"}`),this.updateDisplayInfo(`Proxy error: ${j.error||"Unknown error"}`),this.updateDisplayMeta("proxy-error");return}if(j?.type==="vnc.connected"){let G=j?.target?.label||this.targetLabel||this.targetId;this.setStatus(`Connected to ${G}. Waiting for VNC/RFB data…`),this.updateDisplayInfo(`Connected to ${G}. Waiting for VNC handshake…`),this.updateDisplayMeta();return}if(j?.type==="pong")return;return}let $=this.protocol||(this.protocol=new B6);try{let j=_.data instanceof Blob?await _.data.arrayBuffer():_.data,G=$.receive(j);for(let Z of G.outgoing||[])this.socketBoundary?.send?.(Z);for(let Z of G.events||[])this.applyRemoteDisplayEvent(Z)}catch(j){let G=j?.message||"Unknown error";if(this.setSessionChromeVisible(!0),this.setStatus(`Display protocol error: ${G}`),this.updateDisplayInfo(`Display protocol error: ${G}`),this.updateDisplayMeta("protocol-error"),this.frameTimeoutId)clearTimeout(this.frameTimeoutId),this.frameTimeoutId=null;if(!this.rawFallbackAttempted&&!this.protocolRecovering&&/unexpected eof|zlib|decompress|protocol|buffer|undefined|not an object|reading '0'/i.test(G))this.rawFallbackAttempted=!0,this.protocolRecovering=!0,this.connectWithEncodings("0")}}async connectSocket(_=null){if(!this.targetId||this.disposed)return;if(this.clearReconnectTimer(),this.protocolRecovering&&_==null)this.protocolRecovering=!1;try{this.socketBoundary?.dispose?.()}catch{}if(_==null)this.rawFallbackAttempted=!1,this.protocolRecovering=!1;let $=this.pendingHandoffToken||null,j=_==null?null:String(_).trim(),G=await eG(),Z={};if(G)Z.pipeline=G,Z.decodeRawRect=(L,V,q,Q)=>G.decodeRawRectToRgba(L,V,q,Q);let X=H4(this.authPassword);if(X!==null)Z.password=X;if(j)Z.encodings=j;let Y=Boolean(this.canvas&&this.hasRenderedFrame);if(this.protocol=new B6(Z),this.hasRenderedFrame=Y,this.frameTimeoutId=null,this.canvas)this.canvas.style.display=Y?"block":"none";if(this.displayPlaceholderEl)this.displayPlaceholderEl.style.display=Y?"none":"";this.socketBoundary=new C3({url:QE(this.targetId,$),binaryType:"arraybuffer",onOpen:()=>{if($&&this.pendingHandoffToken===$)this.pendingHandoffToken=null;this.reconnectAttempts=0,this.setStatus(`Connected to proxy for ${this.targetId}. Waiting for VNC/RFB data…`),this.updateDisplayInfo("WebSocket proxy connected. Waiting for handshake…"),this.updateDisplayMeta(),this.socketBoundary?.sendControl?.({type:"ping"})},onMetrics:(L)=>{this.applyMetrics(L)},onMessage:(L)=>{this.handleSocketMessage(L)},onClose:()=>{if(this.setSessionChromeVisible(!0),this.frameTimeoutId)clearTimeout(this.frameTimeoutId),this.frameTimeoutId=null;if(this.disposed)return;if(fZ({handoffToken:$,bytesIn:this.bytesIn,hasRenderedFrame:this.hasRenderedFrame,reconnectAttempts:this.reconnectAttempts})){this.pendingHandoffToken=null,this.setStatus("Transferred VNC session was not ready yet. Retrying…"),this.updateDisplayInfo("Transferred VNC session was not ready yet. Retrying without handoff…"),this.updateDisplayMeta("handoff-retrying"),this.scheduleReconnect(150);return}if(this.bytesIn>0||this.hasRenderedFrame||this.reconnectAttempts>0){this.setStatus("Remote display connection lost. Reconnecting…"),this.updateDisplayInfo("Remote display transport closed. Attempting to reconnect…"),this.updateDisplayMeta("reconnecting"),this.scheduleReconnect();return}this.setStatus(this.bytesIn>0?`Proxy closed after receiving ${this.bytesIn} byte(s).`:"Proxy closed."),this.updateDisplayInfo(this.bytesIn>0?"Remote display transport closed after receiving data.":"Remote display transport closed."),this.updateDisplayMeta("closed")},onError:()=>{if(this.setSessionChromeVisible(!0),fZ({handoffToken:$,bytesIn:this.bytesIn,hasRenderedFrame:this.hasRenderedFrame,reconnectAttempts:this.reconnectAttempts})){this.pendingHandoffToken=null,this.setStatus("Transferred VNC session was not ready yet. Retrying…"),this.updateDisplayInfo("Transferred VNC session was not ready yet. Retrying without handoff…"),this.updateDisplayMeta("handoff-retrying"),this.scheduleReconnect(150);return}if(this.bytesIn>0||this.hasRenderedFrame||this.reconnectAttempts>0){this.setStatus("WebSocket proxy connection failed. Reconnecting…"),this.updateDisplayInfo("WebSocket proxy connection failed. Attempting to reconnect…"),this.updateDisplayMeta("socket-reconnecting"),this.scheduleReconnect();return}this.setStatus("WebSocket proxy connection failed."),this.updateDisplayInfo("WebSocket proxy connection failed."),this.updateDisplayMeta("socket-error")}}),this.socketBoundary.connect()}connectWithEncodings(_){return this.connectSocket(_)}async load(){this.setStatus("");try{let _=await VE(this.targetId);if(!_?.enabled){this.renderTargets(_),this.setStatus("");return}if(!this.targetId){this.renderTargets(_),this.setStatus("");return}this.renderTargetSession(_),await this.connectSocket()}catch(_){this.resetLiveSession(),this.bodyEl.innerHTML=`
                <div style="max-width:620px;text-align:center;padding:28px;border:1px dashed var(--border-color);border-radius:14px;background:var(--bg-secondary);">
                    <div style="font-size:32px;margin-bottom:10px;">⚠️</div>
                    <div style="font-weight:600;margin-bottom:6px;">Failed to load VNC session</div>
                    <div style="color:var(--text-secondary);font-size:13px;line-height:1.5;">${d1(_?.message||"Unknown error")}</div>
                </div>
            `,this.setStatus(`Session load failed: ${_?.message||"Unknown error"}`)}}beforeDetachFromHost(){this.releasePressedKeys(),this.setStatus("Moving VNC session…"),this.updateDisplayInfo("Moving VNC session to a new window…"),this.updateDisplayMeta("moving")}afterAttachToHost(){this.attachDisplayResizeObserver(),this.updateCanvasScale(),requestAnimationFrame(()=>this.focus())}moveHost(_){if(this.disposed||!this.root)return!1;if(this.releasePressedKeys(),this.container=_,!UE(this.root,_))return!1;return this.afterAttachToHost(),!0}async preparePopoutTransfer(){return LE(this.targetId,this.authPassword)}getContent(){return}isDirty(){return!1}focus(){this.canvas?.focus?.(),this.root?.focus?.()}resize(){this.updateCanvasScale()}dispose(){if(this.disposed)return;this.disposed=!0,this.resetLiveSession(),this.root?.remove?.()}}var s3={id:"vnc-viewer",label:"VNC",icon:"display",capabilities:["preview"],placement:"tabs",canHandle(_){let $=String(_?.path||"");return $===i1||$.startsWith(`${i1}/`)?9000:!1},mount(_,$){return new uZ(_,$)}};import{classHighlighter as EE,highlightTree as HE,StreamLanguage as N2,cssLanguage as DE,cppLanguage as WE,goLanguage as OE,htmlLanguage as zE,javascriptLanguage as JE,jsxLanguage as AE,tsxLanguage as kE,typescriptLanguage as yE,jsonLanguage as ME,markdownLanguage as wE,pythonLanguage as TE,rustLanguage as xE,StandardSQL as IE,xmlLanguage as CE,yamlLanguage as fE,dockerFile as PE,powerShell as RE,ruby as SE,shell as uE,swift as gE,toml as bE}from"#editor-vendor/codemirror";function D4(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}var vE={js:"JavaScript",javascript:"JavaScript",ts:"TypeScript",typescript:"TypeScript",jsx:"JSX",tsx:"TSX",py:"Python",python:"Python",sh:"Shell",shell:"Shell",bash:"Bash",zsh:"Zsh",ps1:"PowerShell",powershell:"PowerShell",md:"Markdown",markdown:"Markdown",yml:"YAML",yaml:"YAML",json:"JSON",html:"HTML",css:"CSS",sql:"SQL",go:"Go",c:"C",cc:"C++",cpp:"C++","c++":"C++",cxx:"C++",h:"C/C++",hh:"C++",hpp:"C++",hxx:"C++",rust:"Rust",rs:"Rust",ruby:"Ruby",swift:"Swift",toml:"TOML",dockerfile:"Dockerfile"},mE=N2.define(uE).parser,cE=N2.define(RE).parser,lE=N2.define(PE).parser,hE=N2.define(SE).parser,nE=N2.define(gE).parser,rE=N2.define(bE).parser;function gZ(_){let $=String(_||"").trim().toLowerCase();if(!$)return"text";return vE[$]||String(_||"").trim()}function pE(_){switch(String(_||"").trim().toLowerCase()){case"js":case"javascript":return JE.parser;case"ts":case"typescript":return yE.parser;case"jsx":return AE.parser;case"tsx":return kE.parser;case"py":case"python":return TE.parser;case"json":return ME.parser;case"css":return DE.parser;case"html":return zE.parser;case"xml":return CE.parser;case"yaml":case"yml":return fE.parser;case"md":case"markdown":return wE.parser;case"sql":return IE.language.parser;case"go":return OE.parser;case"c":case"cc":case"cpp":case"cxx":case"c++":case"h":case"hh":case"hpp":case"hxx":return WE.parser;case"sh":case"bash":case"shell":case"zsh":return mE;case"ps1":case"powershell":return cE;case"dockerfile":return lE;case"rb":case"ruby":return hE;case"rs":case"rust":return xE.parser;case"swift":return nE;case"toml":return rE;default:return null}}function F6(_,$){let j=pE($);if(!j)return D4(_);let G=[];try{let Y=j.parse(_);HE(Y,EE,(L,V,q)=>{if(!q||L>=V)return;G.push({from:L,to:V,cls:q})})}catch{return D4(_)}if(!G.length)return D4(_);G.sort((Y,L)=>Y.from-L.from||Y.to-L.to);let Z=0,X="";for(let Y of G){if(Y.from>Z)X+=D4(_.slice(Z,Y.from));X+=`<span class="${D4(Y.cls)}">${D4(_.slice(Y.from,Y.to))}</span>`,Z=Math.max(Z,Y.to)}if(Z<_.length)X+=D4(_.slice(Z));return X}_5();var O6=/#(\w+)/g,XH=new Set(["strong","em","b","i","u","s","del","ins","sub","sup","mark","small","br","p","ul","ol","li","blockquote","ruby","rt","rp","span","input"]),YH=new Set(["a","abbr","blockquote","br","code","del","div","em","hr","h1","h2","h3","h4","h5","h6","i","img","input","ins","kbd","li","mark","ol","p","pre","ruby","rt","rp","s","small","span","strong","sub","sup","table","tbody","td","th","thead","tr","u","ul","math","semantics","mrow","mi","mn","mo","mtext","mspace","msup","msub","msubsup","mfrac","msqrt","mroot","mtable","mtr","mtd","annotation"]),LH=new Set(["class","title","role","aria-hidden","aria-label","aria-expanded","aria-live","data-mermaid","data-hashtag"]),dZ={a:new Set(["href","target","rel"]),img:new Set(["src","alt","title"]),input:new Set(["type","checked","disabled"])},qH=new Set(["http:","https:","mailto:",""]);function VH(_,$){let j=String(_||"").toLowerCase(),G=String($||"").toLowerCase();if(!G||G.startsWith("on"))return!1;if(G.startsWith("data-")||G.startsWith("aria-"))return!0;return(dZ[j]||new Set).has(G)||LH.has(G)}function Z7(_){return String(_||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#39;")}function J4(_,$={}){if(!_)return null;let j=String(_).trim();if(!j)return null;if(j.startsWith("#")||j.startsWith("/"))return j;if(j.startsWith("data:")){if($.allowDataImage&&/^data:image\//i.test(j))return j;return null}if(j.startsWith("blob:"))return j;try{let G=new URL(j,typeof window<"u"?window.location.origin:"http://localhost");if(!qH.has(G.protocol))return null;return G.href}catch{return null}}function iZ(_,$={}){if(!_)return"";if($?.sanitize===!1)return _;let j=new DOMParser().parseFromString(_,"text/html"),G=[],Z=j.createTreeWalker(j.body,NodeFilter.SHOW_ELEMENT),X;while(X=Z.nextNode())G.push(X);for(let Y of G){let L=Y.tagName.toLowerCase();if(!YH.has(L)){let q=Y.parentNode;if(!q)continue;while(Y.firstChild)q.insertBefore(Y.firstChild,Y);q.removeChild(Y);continue}let V=dZ[L]||new Set;for(let q of Array.from(Y.attributes)){let Q=q.name.toLowerCase(),K=q.value;if(Q.startsWith("on")){Y.removeAttribute(q.name);continue}if(VH(L,Q)){if(Q==="href"){let B=J4(K);if(!B)Y.removeAttribute(q.name);else if(Y.setAttribute(q.name,B),L==="a"){if(!Y.getAttribute("rel"))Y.setAttribute("rel","noopener noreferrer");if(/^https?:\/\//i.test(B))Y.setAttribute("target","_blank")}}else if(Q==="src"){let B=L==="img"&&typeof $.rewriteImageSrc==="function"?$.rewriteImageSrc(K):K,N=J4(B,{allowDataImage:L==="img"});if(!N)Y.removeAttribute(q.name);else Y.setAttribute(q.name,N)}continue}Y.removeAttribute(q.name)}}return j.body.innerHTML}function oZ(_){if(!_)return _;let $=_.replace(/</g,"&lt;").replace(/>/g,"&gt;");return new DOMParser().parseFromString($,"text/html").documentElement.textContent}function $5(_,$=2){if(!_)return _;let j=_;for(let G=0;G<$;G+=1){let Z=oZ(j);if(Z===j)break;j=Z}return j}function KH(_){if(!_)return{text:"",frontmatter:null};let $=_.replace(/^\uFEFF/,"").replace(/\r\n/g,`
`).replace(/\r/g,`
`);if(!$.startsWith(`---
`))return{text:$,frontmatter:null};let j=$.split(`
`),G=-1;for(let Y=1;Y<j.length;Y+=1)if(/^(---|\.\.\.)\s*$/.test(j[Y])){G=Y;break}if(G<=0)return{text:$,frontmatter:null};let Z=j.slice(1,G).join(`
`);return{text:j.slice(G+1).join(`
`).replace(/^\n+/,""),frontmatter:Z}}function QH(_){let{text:$,frontmatter:j}=KH(_);if(j===null)return $;return["<!--frontmatter-block-start-->","```yaml",j,"```","<!--frontmatter-block-end-->",$].filter(Boolean).join(`

`)}function NH(_){if(!_)return{text:"",blocks:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),G=[],Z=[],X=!1,Y=[];for(let L of j){if(!X&&L.trim().match(/^```mermaid\s*$/i)){X=!0,Y=[];continue}if(X&&L.trim().match(/^```\s*$/)){let V=G.length;G.push(Y.join(`
`)),Z.push(`@@MERMAID_BLOCK_${V}@@`),X=!1,Y=[];continue}if(X)Y.push(L);else Z.push(L)}if(X)Z.push("```mermaid"),Z.push(...Y);return{text:Z.join(`
`),blocks:G}}function BH(_){if(!_)return _;return $5(_,5)}function FH(_){let $=new TextEncoder().encode(String(_||"")),j="";for(let G of $)j+=String.fromCharCode(G);return btoa(j)}function UH(_){let $=atob(String(_||"")),j=new Uint8Array($.length);for(let G=0;G<$.length;G+=1)j[G]=$.charCodeAt(G);return new TextDecoder().decode(j)}function EH(_,$){if(!_||!$||$.length===0)return _;return _.replace(/@@MERMAID_BLOCK_(\d+)@@/g,(j,G)=>{let Z=Number(G),X=$[Z]??"",Y=BH(X);return`<div class="mermaid-container" data-mermaid="${FH(Y)}"><div class="mermaid-loading">Loading diagram...</div></div>`})}function sZ(_){if(!_)return _;return _.replace(/<code>([\s\S]*?)<\/code>/gi,($,j)=>{if(j.includes(`
`))return`
\`\`\`
${j}
\`\`\`
`;return`\`${j}\``})}function HH(_){if(!_)return _;return _.replace(/<pre><code(?:\s+class="language-([A-Za-z0-9_+-]+)")?>([\s\S]*?)<\/code><\/pre>/g,(j,G,Z)=>{let X=String(G||"").trim().toLowerCase(),Y=$5(Z,2),L=X||"plaintext",V=F6(Y,X);return`<pre><code class="hljs language-${Z7(L)}">${V}</code></pre>`}).replace(/<!--frontmatter-block-start-->\s*<pre>/g,'<pre class="frontmatter-block">').replace(/<\/pre>\s*<!--frontmatter-block-end-->/g,"</pre>")}var DH={span:new Set(["title","class","lang","dir"]),input:new Set(["type","checked","disabled"])};function WH(_,$){let j=DH[_];if(!j||!$)return"";let G=[],Z=/([a-zA-Z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/g,X;while(X=Z.exec($)){let Y=(X[1]||"").toLowerCase();if(!Y||Y.startsWith("on")||!j.has(Y))continue;let L=X[2]??X[3]??X[4]??"";G.push(` ${Y}="${Z7(L)}"`)}return G.join("")}function aZ(_){if(!_)return _;return _.replace(/&lt;((?:[^"'<>]|"[^"]*"|'[^']*')*?)(?:&gt;|>)/g,($,j)=>{let G=j.trim(),Z=G.startsWith("/"),X=Z?G.slice(1).trim():G,L=X.endsWith("/")?X.slice(0,-1).trim():X,[V=""]=L.split(/\s+/,1),q=V.toLowerCase();if(!q||!XH.has(q))return $;if(q==="br")return Z?"":"<br>";if(Z)return`</${q}>`;let Q=L.slice(V.length).trim(),K=WH(q,Q);return`<${q}${K}>`})}function tZ(_){if(!_)return _;let $=(j)=>j.replace(/&amp;lt;/g,"&lt;").replace(/&amp;gt;/g,"&gt;").replace(/&amp;quot;/g,"&quot;").replace(/&amp;#39;/g,"&#39;").replace(/&amp;amp;/g,"&amp;");return _.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,(j,G)=>`<pre><code>${$(G)}</code></pre>`).replace(/<code>([\s\S]*?)<\/code>/g,(j,G)=>`<code>${$(G)}</code>`)}function eZ(_){if(!_)return _;let $=new DOMParser().parseFromString(_,"text/html"),j=$.createTreeWalker($.body,NodeFilter.SHOW_TEXT),G=(X)=>X.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&"),Z;while(Z=j.nextNode()){if(!Z.nodeValue)continue;let X=G(Z.nodeValue);if(X!==Z.nodeValue)Z.nodeValue=X}return $.body.innerHTML}function OH(_){if(!window.katex)return _;let $=(Y)=>oZ(Y).replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&").replace(/<br\s*\/?\s*>/gi,`
`),j=(Y)=>{let L=[],V=Y.replace(/<pre\b[^>]*>\s*<code\b[^>]*>[\s\S]*?<\/code>\s*<\/pre>/gi,(q)=>{let Q=L.length;return L.push(q),`@@CODE_BLOCK_${Q}@@`});return V=V.replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi,(q)=>{let Q=L.length;return L.push(q),`@@CODE_INLINE_${Q}@@`}),{html:V,blocks:L}},G=(Y,L)=>{if(!L.length)return Y;return Y.replace(/@@CODE_(?:BLOCK|INLINE)_(\d+)@@/g,(V,q)=>{let Q=Number(q);return L[Q]??""})},Z=j(_),X=Z.html;return X=X.replace(/(^|\n|<br\s*\/?\s*>|<p>|<\/p>)\s*\$\$([\s\S]+?)\$\$\s*(?=\n|<br\s*\/?\s*>|<\/p>|$)/gi,(Y,L,V)=>{try{let q=katex.renderToString($(V.trim()),{displayMode:!0,throwOnError:!1});return`${L}${q}`}catch(q){let Q=q instanceof Error?q.message:String(q);return`<span class="math-error" title="${Z7(Q)}">${Y}</span>`}}),G(X,Z.blocks)}function zH(_){if(!_)return _;let $=new DOMParser().parseFromString(_,"text/html"),j=$.createTreeWalker($.body,NodeFilter.SHOW_TEXT),G=[],Z;while(Z=j.nextNode())G.push(Z);for(let X of G){let Y=X.nodeValue;if(!Y)continue;if(O6.lastIndex=0,!O6.test(Y))continue;O6.lastIndex=0;let L=X.parentElement;if(L&&(L.closest("a")||L.closest("code")||L.closest("pre")))continue;let V=Y.split(O6);if(V.length<=1)continue;let q=$.createDocumentFragment();V.forEach((Q,K)=>{if(K%2===1){let B=$.createElement("a");B.setAttribute("href","#"),B.className="hashtag",B.setAttribute("data-hashtag",Q),B.textContent=`#${Q}`,q.appendChild(B)}else q.appendChild($.createTextNode(Q))}),X.parentNode?.replaceChild(q,X)}return $.body.innerHTML}function JH(_){if(!_)return _;let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),G=[],Z=!1;for(let X of j){if(!Z&&X.trim().match(/^```(?:math|katex|latex)\s*$/i)){Z=!0,G.push("$$");continue}if(Z&&X.trim().match(/^```\s*$/)){Z=!1,G.push("$$");continue}G.push(X)}return G.join(`
`)}function AH(_){let $=QH(_||""),j=JH($),{text:G,blocks:Z}=NH(j),X=$5(G,2),L=sZ(X).replace(/</g,"&lt;");return{safeHtml:aZ(L),mermaidBlocks:Z}}function Z1(_,$,j={}){if(!_)return"";let{safeHtml:G,mermaidBlocks:Z}=AH(_),X=window.marked?marked.parse(G,{headerIds:!1,mangle:!1}):G.replace(/\n/g,"<br>");return X=tZ(X),X=eZ(X),X=HH(X),X=OH(X),X=zH(X),X=EH(X,Z),X=iZ(X,j),X}function j5(_){if(!_)return"";let $=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`),j=$5($,2),Z=sZ(j).replace(/</g,"&lt;").replace(/>/g,"&gt;"),X=aZ(Z),Y=window.marked?marked.parse(X):X.replace(/\n/g,"<br>");return Y=tZ(Y),Y=eZ(Y),Y=iZ(Y),Y}function kH(_,$=6){return _.replace(/<polyline\b([^>]*)\bpoints="([^"]+)"([^>]*)\/?\s*>/g,(j,G,Z,X)=>{let Y=Z.trim().split(/\s+/).map((V)=>{let[q,Q]=V.split(",").map(Number);return{x:q,y:Q}});if(Y.length<3)return`<polyline${G}points="${Z}"${X}/>`;let L=[`M ${Y[0].x},${Y[0].y}`];for(let V=1;V<Y.length-1;V++){let q=Y[V-1],Q=Y[V],K=Y[V+1],B=Q.x-q.x,N=Q.y-q.y,U=K.x-Q.x,D=K.y-Q.y,H=Math.sqrt(B*B+N*N),E=Math.sqrt(U*U+D*D),k=Math.min($,H/2,E/2);if(k<0.5){L.push(`L ${Q.x},${Q.y}`);continue}let z=Q.x-B/H*k,O=Q.y-N/H*k,I=Q.x+U/E*k,x=Q.y+D/E*k,y=B*D-N*U>0?1:0;L.push(`L ${z},${O}`),L.push(`A ${k},${k} 0 0 ${y} ${I},${x}`)}return L.push(`L ${Y[Y.length-1].x},${Y[Y.length-1].y}`),`<path${G}d="${L.join(" ")}"${X}/>`})}async function H$(_){if(!window.beautifulMermaid)return;let{renderMermaid:$,THEMES:j}=window.beautifulMermaid,Z=pZ()==="dark"?j["tokyo-night"]:j["github-light"],X=_.querySelectorAll(".mermaid-container[data-mermaid]");for(let Y of X)try{let L=Y.dataset.mermaid,V=UH(L||""),q=$5(V,2),Q=await $(q,{...Z,transparent:!0});Q=kH(Q),Y.innerHTML=Q,Y.removeAttribute("data-mermaid")}catch(L){console.error("Mermaid render error:",L);let V=document.createElement("pre");V.className="mermaid-error",V.textContent=`Diagram error: ${L.message}`,Y.innerHTML="",Y.appendChild(V),Y.removeAttribute("data-mermaid")}}I_();function QX(_){let $=new Date(_);if(Number.isNaN($.getTime()))return _;let G=new Date().getTime()-$.getTime(),Z=G/1000,X=86400000;if(G<X){if(Z<60)return"just now";if(Z<3600)return`${Math.floor(Z/60)}m`;return`${Math.floor(Z/3600)}h`}if(G<5*X){let V=$.toLocaleDateString(void 0,{weekday:"short"}),q=$.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});return`${V} ${q}`}let Y=$.toLocaleDateString(void 0,{month:"short",day:"numeric"}),L=$.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});return`${Y} ${L}`}function B5(_){if(!Number.isFinite(_))return"0";return Math.round(_).toLocaleString()}function a_(_){if(_<1024)return _+" B";if(_<1048576)return(_/1024).toFixed(1)+" KB";return(_/1048576).toFixed(1)+" MB"}function T4(_){let $=new Date(_);if(Number.isNaN($.getTime()))return _;return $.toLocaleString()}function n$(_){return String(_||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ND(_,$){let j=String(_||"").trim();if(!j)return j;if(/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(j)||j.startsWith("#")||j.startsWith("data:")||j.startsWith("blob:"))return j;let G=j.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/),Z=G?.[1]||j,X=G?.[2]||"",Y=G?.[3]||"",L=String($||"").split("/").slice(0,-1).join("/"),q=Z.startsWith("/")?Z:`${L?`${L}/`:""}${Z}`,Q=[];for(let B of q.split("/")){if(!B||B===".")continue;if(B===".."){if(Q.length>0)Q.pop();continue}Q.push(B)}let K=Q.join("/");return`${Q5(K)}${X}${Y}`}function F5(_){return _?.preview||null}function BD(_){let $=String(_||""),j=Math.max($.lastIndexOf("/"),$.lastIndexOf("\\")),G=j>=0?$.slice(j+1):$,Z=G.lastIndexOf(".");if(Z<=0||Z===G.length-1)return"none";return G.slice(Z+1)}function FD(_){if(!_)return"unknown";if(_.kind==="image")return"image";if(_.kind==="text")return _.content_type==="text/markdown"?"markdown":"text";if(_.kind==="binary")return"binary";return String(_.kind||"unknown")}function UD(_,$){let j=$?.path||_?.path||"",G=[];if($?.content_type)G.push(`<span><strong>type:</strong> ${n$($.content_type)}</span>`);if(typeof $?.size==="number")G.push(`<span><strong>size:</strong> ${n$(a_($.size))}</span>`);if($?.mtime)G.push(`<span><strong>modified:</strong> ${n$(T4($.mtime))}</span>`);if(G.push(`<span><strong>kind:</strong> ${n$(FD($))}</span>`),G.push(`<span><strong>extension:</strong> ${n$(BD(j))}</span>`),j)G.push(`<span><strong>path:</strong> ${n$(j)}</span>`);if($?.truncated)G.push("<span><strong>content:</strong> truncated</span>");return`<div class="workspace-preview-meta workspace-preview-meta-inline">${G.join("")}</div>`}function ED(_){let $=F5(_);if(!$)return'<div class="workspace-preview-text">No preview available.</div>';let j=UD(_,$);if($.kind==="image"){let G=$.url||($.path?Q5($.path):"");return`${j}
            <div class="workspace-preview-image">
                <img src="${n$(G)}" alt="preview" />
            </div>
        `}if($.kind==="text"){if($.content_type==="text/markdown"){let G=Z1($.text||"",null,{rewriteImageSrc:(Z)=>ND(Z,$.path||_?.path)});return`${j}<div class="workspace-preview-text">${G}</div>`}return`${j}<pre class="workspace-preview-text"><code>${n$($.text||"")}</code></pre>`}if($.kind==="binary")return`${j}<div class="workspace-preview-text">Binary file — download to view.</div>`;return`${j}<div class="workspace-preview-text">No preview available.</div>`}class R7{container;context;disposed=!1;host;constructor(_,$){this.container=_,this.context=$,this.host=document.createElement("div"),this.host.className="workspace-preview-render-host",this.host.tabIndex=0,this.container.appendChild(this.host),this.render()}render(){if(this.disposed)return;this.host.innerHTML=ED(this.context)}getContent(){let _=F5(this.context);return typeof _?.text==="string"?_.text:void 0}isDirty(){return!1}setContent(_,$){let j=F5(this.context);if(j&&j.kind==="text"){if(j.text=_,$!==void 0)j.mtime=$}if(this.context.content=_,$!==void 0)this.context.mtime=$;this.render()}focus(){this.host?.focus?.()}dispose(){if(this.disposed)return;this.disposed=!0,this.host?.remove(),this.container.innerHTML=""}}var S7={id:"workspace-markdown-preview",label:"Workspace Markdown Preview",icon:"preview",capabilities:["preview","readonly"],placement:"tabs",canHandle(_){let $=F5(_);if(_?.mode!=="view")return!1;if(!$||$.kind!=="text")return!1;return $.content_type==="text/markdown"?20:!1},mount(_,$){return new R7(_,$)}},u7={id:"workspace-preview-default",label:"Workspace Preview",icon:"preview",capabilities:["preview","readonly"],placement:"tabs",canHandle(_){if(_?.mode!=="view")return!1;return F5(_)||_?.path?1:!1},mount(_,$){return new R7(_,$)}};var HD=new Set([".docx",".doc",".odt",".rtf",".xlsx",".xls",".ods",".csv",".pptx",".ppt",".odp"]),DD={".docx":"Word Document",".doc":"Word (Legacy)",".odt":"OpenDocument Text",".rtf":"Rich Text",".xlsx":"Excel Spreadsheet",".xls":"Excel (Legacy)",".ods":"OpenDocument Spreadsheet",".csv":"CSV Data",".pptx":"PowerPoint",".ppt":"PowerPoint (Legacy)",".odp":"OpenDocument Presentation"},WD={".docx":"\uD83D\uDCDD",".doc":"\uD83D\uDCDD",".odt":"\uD83D\uDCDD",".rtf":"\uD83D\uDCDD",".xlsx":"\uD83D\uDCCA",".xls":"\uD83D\uDCCA",".ods":"\uD83D\uDCCA",".csv":"\uD83D\uDCCA",".pptx":"\uD83D\uDCFD️",".ppt":"\uD83D\uDCFD️",".odp":"\uD83D\uDCFD️"};function BX(_){if(!_)return"";let $=_.lastIndexOf(".");if($<0)return"";return _.slice($).toLowerCase()}function NX(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}class FX{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=j.split("/").pop()||"document",Z=BX(j),X=WD[Z]||"\uD83D\uDCC4",Y=DD[Z]||"Office Document",L=document.createElement("div");L.style.cssText="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary,#1a1a1a);",L.innerHTML=`
            <div style="text-align:center;max-width:360px;padding:24px;">
                <div style="font-size:56px;margin-bottom:12px;">${X}</div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary,#e0e0e0);margin-bottom:4px;word-break:break-word;">${NX(G)}</div>
                <div style="font-size:11px;color:var(--text-secondary,#888);margin-bottom:20px;">${NX(Y)}</div>
                <button id="ov-open-tab" style="padding:8px 20px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">
                    Open in Tab
                </button>
            </div>
        `,_.appendChild(L);let V=L.querySelector("#ov-open-tab");if(V)V.addEventListener("click",()=>{let q=new CustomEvent("office-viewer:open-tab",{bubbles:!0,detail:{path:j}});_.dispatchEvent(q)})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class UX{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=j.split("/").pop()||"document",Z=`/workspace/raw?path=${encodeURIComponent(j)}`,X=`/office-viewer/?url=${encodeURIComponent(Z)}&name=${encodeURIComponent(G)}`;this.iframe=document.createElement("iframe"),this.iframe.src=X,this.iframe.style.cssText="width:100%;height:100%;border:none;background:#1e1e1e;",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}var g7={id:"office-viewer",label:"Office Viewer",icon:"file-text",capabilities:["readonly","preview"],placement:"tabs",canHandle(_){let $=BX(_?.path);if(!$||!HD.has($))return!1;return 50},mount(_,$){if($?.mode==="view")return new FX(_,$);return new UX(_,$)}};var OD=/\.(csv|tsv)$/i;function EX(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}class HX{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=j.split("/").pop()||"table.csv",Z=j.toLowerCase().endsWith(".tsv")?"TSV Table":"CSV Table",X=document.createElement("div");X.style.cssText="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary,#1a1a1a);",X.innerHTML=`
            <div style="text-align:center;max-width:360px;padding:24px;">
                <div style="font-size:56px;margin-bottom:12px;">\uD83D\uDCCA</div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary,#e0e0e0);margin-bottom:4px;word-break:break-word;">${EX(G)}</div>
                <div style="font-size:11px;color:var(--text-secondary,#888);margin-bottom:20px;">${EX(Z)}</div>
                <button id="csv-open-tab" style="padding:8px 20px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">
                    Open in Tab
                </button>
            </div>
        `,_.appendChild(X);let Y=X.querySelector("#csv-open-tab");if(Y)Y.addEventListener("click",()=>{let L=new CustomEvent("csv-viewer:open-tab",{bubbles:!0,detail:{path:j}});_.dispatchEvent(L)})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class DX{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=`/csv-viewer/?path=${encodeURIComponent(j)}`;this.iframe=document.createElement("iframe"),this.iframe.src=G,this.iframe.style.cssText="width:100%;height:100%;border:none;background:var(--bg-primary,#000);",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}var b7={id:"csv-viewer",label:"CSV Viewer",icon:"table",capabilities:["readonly","preview"],placement:"tabs",canHandle(_){let $=_?.path||"";if(!OD.test($))return!1;return 55},mount(_,$){if($?.mode==="view")return new HX(_,$);return new DX(_,$)}};var zD=/\.pdf$/i;function JD(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}class WX{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=j.split("/").pop()||"document.pdf",Z=document.createElement("div");Z.style.cssText="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary,#1a1a1a);",Z.innerHTML=`
            <div style="text-align:center;max-width:360px;padding:24px;">
                <div style="font-size:56px;margin-bottom:12px;">\uD83D\uDCC4</div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary,#e0e0e0);margin-bottom:4px;word-break:break-word;">${JD(G)}</div>
                <div style="font-size:11px;color:var(--text-secondary,#888);margin-bottom:20px;">PDF Document</div>
                <button id="pdf-open-tab" style="padding:8px 20px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">
                    Open in Tab
                </button>
            </div>
        `,_.appendChild(Z);let X=Z.querySelector("#pdf-open-tab");if(X)X.addEventListener("click",()=>{let Y=new CustomEvent("pdf-viewer:open-tab",{bubbles:!0,detail:{path:j}});_.dispatchEvent(Y)})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class OX{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=`/pdf-viewer/?path=${encodeURIComponent(j)}`;this.iframe=document.createElement("iframe"),this.iframe.src=G,this.iframe.style.cssText="width:100%;height:100%;border:none;background:#1e1e1e;",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}var v7={id:"pdf-viewer",label:"PDF Viewer",icon:"file-text",capabilities:["readonly","preview"],placement:"tabs",canHandle(_){let $=_?.path||"";if(!zD.test($))return!1;return 52},mount(_,$){if($?.mode==="view")return new WX(_,$);return new OX(_,$)}};var AD=/\.(png|jpe?g|gif|webp|bmp|ico|svg)$/i;function m7(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}class zX{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=j.split("/").pop()||"image",Z=`/workspace/raw?path=${encodeURIComponent(j)}`,X=document.createElement("div");X.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;background:var(--bg-primary,#1a1a1a);",X.innerHTML=`
            <div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:16px;">
                <img src="${m7(Z)}" alt="${m7(G)}" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:4px;" />
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-top:1px solid var(--border-color,#333);flex-shrink:0;">
                <div style="font-size:12px;color:var(--text-secondary,#888);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;">${m7(G)}</div>
                <button id="img-open-tab" style="padding:5px 14px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:4px;font-size:12px;font-weight:500;cursor:pointer;flex-shrink:0;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">
                    Open in Tab
                </button>
            </div>
        `,_.appendChild(X);let Y=X.querySelector("#img-open-tab");if(Y)Y.addEventListener("click",()=>{let L=new CustomEvent("image-viewer:open-tab",{bubbles:!0,detail:{path:j}});_.dispatchEvent(L)})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class JX{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=`/image-viewer/?path=${encodeURIComponent(j)}`;this.iframe=document.createElement("iframe"),this.iframe.src=G,this.iframe.style.cssText="width:100%;height:100%;border:none;background:var(--bg-primary,#000);",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}var c7={id:"image-viewer",label:"Image Viewer",icon:"image",capabilities:["readonly","preview"],placement:"tabs",canHandle(_){let $=_?.path||"";if(!AD.test($))return!1;return 48},mount(_,$){if($?.mode==="view")return new zX(_,$);return new JX(_,$)}};var kD=/\.(html|htm)$/i;function AX(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}class kX{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=j.split("/").pop()||"index.html",Z=document.createElement("div");Z.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;background:var(--bg-primary,#1a1a1a);",Z.innerHTML=`
            <div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:24px;">
                <div style="text-align:center;">
                    <div style="font-size:48px;margin-bottom:12px;">\uD83C\uDF10</div>
                    <div style="font-size:14px;color:var(--text-primary,#e2e8f0);font-weight:500;margin-bottom:4px;">${AX(G)}</div>
                    <div style="font-size:12px;color:var(--text-secondary,#94a3b8);">HTML document</div>
                </div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-top:1px solid var(--border-color,#333);flex-shrink:0;">
                <div style="font-size:12px;color:var(--text-secondary,#888);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;">${AX(j)}</div>
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
        `,_.appendChild(Z);let X=Z.querySelector("#html-open-tab");if(X)X.addEventListener("click",()=>{_.dispatchEvent(new CustomEvent("html-viewer:open-tab",{bubbles:!0,detail:{path:j}}))});let Y=Z.querySelector("#html-edit-btn");if(Y)Y.addEventListener("click",()=>{_.dispatchEvent(new CustomEvent("html-viewer:edit-source",{bubbles:!0,detail:{path:j}}))})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class yX{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=`/html-viewer/?path=${encodeURIComponent(j)}`;this.iframe=document.createElement("iframe"),this.iframe.src=G,this.iframe.style.cssText="width:100%;height:100%;border:none;background:#fff;",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}var l7={id:"html-viewer",label:"HTML Preview",icon:"code",capabilities:["readonly","preview"],placement:"tabs",canHandle(_){let $=_?.path||"";if(!kD.test($))return!1;return 30},mount(_,$){if($?.mode==="view")return new kX(_,$);return new yX(_,$)}};var yD=/\.(mp4|m4v|mov|webm|ogv)$/i;function MD(_){return _.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}class MX{container;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=j.split("/").pop()||"video.mp4",Z=document.createElement("div");Z.style.cssText="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary,#1a1a1a);",Z.innerHTML=`
            <div style="text-align:center;max-width:360px;padding:24px;">
                <div style="font-size:56px;margin-bottom:12px;">\uD83C\uDFAC</div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary,#e0e0e0);margin-bottom:4px;word-break:break-word;">${MD(G)}</div>
                <div style="font-size:11px;color:var(--text-secondary,#888);margin-bottom:20px;">Video File</div>
                <button id="video-open-tab" style="padding:8px 20px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">
                    Open in Tab
                </button>
            </div>
        `,_.appendChild(Z);let X=Z.querySelector("#video-open-tab");if(X)X.addEventListener("click",()=>{let Y=new CustomEvent("video-viewer:open-tab",{bubbles:!0,detail:{path:j}});_.dispatchEvent(Y)})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){if(this.disposed)return;this.disposed=!0,this.container.innerHTML=""}}class wX{container;iframe=null;disposed=!1;constructor(_,$){this.container=_;let j=$.path||"",G=`/video-viewer/?path=${encodeURIComponent(j)}`;this.iframe=document.createElement("iframe"),this.iframe.src=G,this.iframe.style.cssText="width:100%;height:100%;border:none;background:#111;",_.appendChild(this.iframe)}getContent(){return}isDirty(){return!1}focus(){this.iframe?.focus()}resize(){}dispose(){if(this.disposed)return;if(this.disposed=!0,this.iframe)this.iframe.src="about:blank",this.iframe=null;this.container.innerHTML=""}}var h7={id:"video-viewer",label:"Video Viewer",icon:"play-circle",capabilities:["readonly","preview"],placement:"tabs",canHandle(_){let $=_?.path||"";if(!yD.test($))return!1;return 54},mount(_,$){if($?.mode==="view")return new MX(_,$);return new wX(_,$)}};I_();function wD(_){let $=_.includes(".")?_.slice(_.lastIndexOf(".")):"",j=_.includes(".")?_.slice(0,_.lastIndexOf(".")):_,G=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);return`${j}.${G}${$}`}function TX(_){let{path:$,getCurrentMtime:j,anchorParent:G,anchorBefore:Z,onReload:X,onSaveCopy:Y,onOverwrite:L,pollMs:V=3000,ownerDocument:q=document}=_,Q=null,K=null,B=!1,N=!1,U=!1;async function D(){if(N||U||B)return;let O=j();if(!O)return;try{let I=await x7($);if(N||U||!I?.mtime)return;if(I.mtime!==O)B=!0,E(),k()}catch(I){if(typeof console<"u")console.debug("[file-conflict-monitor] mtime poll skipped:",I)}}function H(){if(E(),N)return;Q=setInterval(D,V)}function E(){if(Q)clearInterval(Q),Q=null}function k(){if(K||N)return;let O=q.createElement("div");O.className="editor-conflict-bar",O.innerHTML=`
      <span class="editor-conflict-text">File changed on disk</span>
      <div class="editor-conflict-actions">
        <button class="editor-conflict-btn" data-action="reload" title="Discard and reload from disk">Reload</button>
        <button class="editor-conflict-btn" data-action="save-copy" title="Save current content with a new name">Save copy</button>
        <button class="editor-conflict-btn" data-action="overwrite" title="Overwrite the disk version">Overwrite</button>
        <button class="editor-conflict-btn editor-conflict-dismiss" data-action="dismiss" title="Dismiss">×</button>
      </div>
    `,O.addEventListener("click",(I)=>{let x=I.target.closest("[data-action]");if(!x)return;let A=x.getAttribute("data-action");if(A==="reload")z(),X();else if(A==="save-copy"){let y=wD($);Y(y)}else if(A==="overwrite")z(),L();else if(A==="dismiss")z()}),K=O,G.insertBefore(O,Z)}function z(){if(K)K.remove(),K=null;B=!1,H()}return{start(){H()},stop(){E()},onSaved(O){B=!1,U=!1,H()},dispose(){if(N=!0,E(),K)K.remove(),K=null}}}var TD=/\.mindmap\.ya?ml$/i,C6=String(Date.now());function xD(_){return String(_||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function xX(){let _=document.documentElement?.dataset?.theme;if(_==="dark")return!0;if(_==="light")return!1;try{return!!window.matchMedia?.("(prefers-color-scheme: dark)")?.matches}catch{return!1}}function n7(_){let $=_.split("?")[0];if(document.querySelector(`script[data-src="${$}"]`))return Promise.resolve();let G=document.querySelector(`script[src="${$}"]`);if(G)G.remove();return new Promise((Z,X)=>{let Y=document.createElement("script");Y.src=_,Y.dataset.src=$,Y.onload=()=>Z(),Y.onerror=()=>X(Error(`Failed to load ${_}`)),document.head.appendChild(Y)})}function ID(_){let $=_.split("?")[0],j=document.querySelector(`link[data-href="${$}"]`);if(j&&j.href.endsWith(_))return;document.querySelectorAll(`link[data-href="${$}"], link[href="${$}"]`).forEach((Z)=>Z.remove());let G=document.createElement("link");G.rel="stylesheet",G.href=_,G.dataset.href=$,document.head.appendChild(G)}function CD(_){let $=document.createElementNS("http://www.w3.org/2000/svg","svg");$.id="mindmap-svg",$.setAttribute("width","100%"),$.setAttribute("height","100%"),$.style.cssText="display:block;position:absolute;inset:0;",_.appendChild($);let j=document.createElement("div");j.id="toolbar",j.className="mindmap-toolbar",j.innerHTML=`
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
    `,_.appendChild(j);let G=document.createElement("div");G.id="context-menu",G.className="context-menu hidden",G.innerHTML=`
        <button data-action="cut">Cut</button>
        <button data-action="copy">Copy</button>
        <button data-action="paste">Paste</button>
        <hr/>
        <button data-action="add-child">Add child</button>
        <button data-action="add-sibling">Add sibling</button>
        <hr/>
        <button data-action="delete">Delete</button>
    `,_.appendChild(G)}class IX{container;constructor(_,$){this.container=_;let j=$.path||"",G=j.split("/").pop()||"mindmap",Z=document.createElement("div");Z.style.cssText="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-primary,#1a1a1a);",Z.innerHTML=`
            <div style="text-align:center;max-width:360px;padding:24px;">
                <div style="font-size:56px;margin-bottom:12px;">\uD83E\uDDE0</div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary,#e0e0e0);margin-bottom:4px;word-break:break-word;">${xD(G)}</div>
                <div style="font-size:11px;color:var(--text-secondary,#888);margin-bottom:20px;">Mindmap Editor</div>
                <button id="mm-open-tab" style="padding:8px 20px;background:var(--accent-color,#1d9bf0);color:var(--accent-contrast-text,#fff);
                    border:none;border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;
                    transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--accent-hover,#1a8cd8)'"
                    onmouseleave="this.style.background='var(--accent-color,#1d9bf0)'">Edit in Tab</button>
            </div>`,_.appendChild(Z),Z.querySelector("#mm-open-tab")?.addEventListener("click",()=>{_.dispatchEvent(new CustomEvent("mindmap:open-tab",{bubbles:!0,detail:{path:j}}))})}getContent(){return}isDirty(){return!1}focus(){}resize(){}dispose(){this.container.innerHTML=""}}class CX{container;filePath;dirty=!1;dirtyCallback=null;disposed=!1;mindmapEl=null;pendingContent=null;lastContent="";currentMtime=null;conflictMonitor=null;themeListener=()=>{window.__mindmapEditor?.setTheme?.(xX())};constructor(_,$){this.container=_,this.filePath=$.path||"",this.init($.content)}async resolveInitialContent(_){if(_!==void 0)return _;if(!this.filePath)return"";try{let j=await(await fetch(`/workspace/file?path=${encodeURIComponent(this.filePath)}&max=1000000&mode=edit`)).json();if(j?.mtime)this.currentMtime=j.mtime;return j?.text||""}catch{return""}}async init(_){let $=await this.resolveInitialContent(_);if(this.disposed)return;if(this.lastContent=$,ID("/static/css/mindmap.css?v="+C6),await Promise.all([n7("/static/js/vendor/d3-mindmap.min.js?v="+C6),n7("/static/js/vendor/js-yaml.min.js?v="+C6)]),this.disposed)return;this.mindmapEl=document.createElement("div"),this.mindmapEl.id="mindmap-container",this.mindmapEl.tabIndex=-1,this.mindmapEl.style.cssText="width:100%;height:100%;overflow:hidden;position:relative;outline:none;",this.container.appendChild(this.mindmapEl),CD(this.mindmapEl);let j=xX(),G=this.filePath.replace(/\/[^/]+$/,"")||"/";try{if(await n7("/static/js/vendor/mindmap-editor.js?v="+C6),this.disposed)return;let Z=window.__mindmapEditor;if(!Z)throw Error("__mindmapEditor not found");if(Z.mount({content:$,isDark:j,onEdit:(X)=>{this.lastContent=X,this.dirty=!0,this.dirtyCallback?.(!0),this.saveToWorkspace(X)},resolveImagePath:(X)=>{if(X.startsWith("data:")||X.startsWith("http"))return X;return`/workspace/raw?path=${encodeURIComponent(G+"/"+X)}`}}),this.pendingContent!==null)Z.update(this.pendingContent),this.lastContent=this.pendingContent,this.pendingContent=null;window.addEventListener("piclaw-theme-change",this.themeListener),this.initConflictMonitor()}catch(Z){if(console.error("[mindmap] Failed to load mindmap renderer:",Z),this.mindmapEl)this.mindmapEl.innerHTML='<div style="padding:24px;color:var(--text-secondary);">Failed to load mindmap editor.</div>'}}async saveToWorkspace(_){if(!this.filePath)return;try{let $=await fetch("/workspace/file",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:this.filePath,content:_})});if(!$.ok)throw Error(`HTTP ${$.status}`);let j=await $.json().catch(()=>({}));this.currentMtime=j?.mtime||this.currentMtime,this.conflictMonitor?.onSaved(this.currentMtime),this.dirty=!1,this.dirtyCallback?.(!1)}catch($){console.error("[mindmap] Save failed:",$)}}initConflictMonitor(){if(this.conflictMonitor?.dispose(),!this.filePath)return;this.conflictMonitor=TX({path:this.filePath,getCurrentMtime:()=>this.currentMtime,anchorParent:this.container,anchorBefore:this.mindmapEl||this.container.firstElementChild,onReload:async()=>{try{let $=await(await fetch(`/workspace/file?path=${encodeURIComponent(this.filePath)}&max=1000000&mode=edit`)).json();if(this.disposed)return;this.currentMtime=$?.mtime||null;let j=$?.text||"";this.lastContent=j;let G=window.__mindmapEditor;if(G?.update)G.update(j);this.dirty=!1,this.dirtyCallback?.(!1),this.conflictMonitor?.onSaved(this.currentMtime)}catch(_){console.error("[mindmap] Reload failed:",_)}},onSaveCopy:async(_)=>{try{await fetch("/workspace/file",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:_,content:this.lastContent})})}catch($){console.error("[mindmap] Save copy failed:",$)}},onOverwrite:()=>this.saveToWorkspace(this.lastContent)}),this.conflictMonitor.start()}getContent(){return}isDirty(){return this.dirty}setContent(_,$){if(_===this.lastContent)return;let j=window.__mindmapEditor;if(j?.update)j.update(_);else this.pendingContent=_;this.lastContent=_,this.dirty=!1,this.dirtyCallback?.(!1)}focus(){this.mindmapEl?.focus()}resize(){window.dispatchEvent(new Event("resize"))}onDirtyChange(_){this.dirtyCallback=_}dispose(){if(this.disposed)return;this.disposed=!0,this.conflictMonitor?.dispose(),window.removeEventListener("piclaw-theme-change",this.themeListener),window.__mindmapEditor?.destroy(),this.pendingContent=null,this.container.innerHTML=""}}var r7={id:"mindmap-editor",label:"Mindmap Editor",icon:"mindmap",capabilities:["edit","preview"],placement:"tabs",canHandle(_){let $=_?.path||"";if(!TD.test($))return!1;return 50},mount(_,$){if($?.mode==="view")return new IX(_,$);return new CX(_,$)}};class fX{tabs=new Map;activeId=null;mruOrder=[];listeners=new Set;onChange(_){return this.listeners.add(_),()=>this.listeners.delete(_)}notify(){let _=this.getTabs(),$=this.activeId;for(let j of this.listeners)try{j(_,$)}catch(G){console.warn("[tab-store] Change listener failed:",G)}}open(_,$){let j=this.tabs.get(_);if(!j)j={id:_,label:$||_.split("/").pop()||_,path:_,dirty:!1,pinned:!1},this.tabs.set(_,j);return this.activate(_),j}activate(_){if(!this.tabs.has(_))return;this.activeId=_,this.mruOrder=[_,...this.mruOrder.filter(($)=>$!==_)],this.notify()}close(_){if(!this.tabs.get(_))return!1;if(this.tabs.delete(_),this.mruOrder=this.mruOrder.filter((j)=>j!==_),this.activeId===_)this.activeId=this.mruOrder[0]||null;return this.notify(),!0}closeOthers(_){for(let[$,j]of this.tabs)if($!==_&&!j.pinned)this.tabs.delete($),this.mruOrder=this.mruOrder.filter((G)=>G!==$);if(this.activeId&&!this.tabs.has(this.activeId))this.activeId=_;this.notify()}closeAll(){for(let[_,$]of this.tabs)if(!$.pinned)this.tabs.delete(_),this.mruOrder=this.mruOrder.filter((j)=>j!==_);if(this.activeId&&!this.tabs.has(this.activeId))this.activeId=this.mruOrder[0]||null;this.notify()}setDirty(_,$){let j=this.tabs.get(_);if(!j||j.dirty===$)return;j.dirty=$,this.notify()}togglePin(_){let $=this.tabs.get(_);if(!$)return;$.pinned=!$.pinned,this.notify()}saveViewState(_,$){let j=this.tabs.get(_);if(j)j.viewState=$}getViewState(_){return this.tabs.get(_)?.viewState}rename(_,$,j){let G=this.tabs.get(_);if(!G)return;if(this.tabs.delete(_),G.id=$,G.path=$,G.label=j||$.split("/").pop()||$,this.tabs.set($,G),this.mruOrder=this.mruOrder.map((Z)=>Z===_?$:Z),this.activeId===_)this.activeId=$;this.notify()}getTabs(){return Array.from(this.tabs.values())}getActiveId(){return this.activeId}getActive(){return this.activeId?this.tabs.get(this.activeId)||null:null}get(_){return this.tabs.get(_)}get size(){return this.tabs.size}hasUnsaved(){for(let _ of this.tabs.values())if(_.dirty)return!0;return!1}getDirtyTabs(){return Array.from(this.tabs.values()).filter((_)=>_.dirty)}nextTab(){let _=this.getTabs();if(_.length<=1)return;let $=_.findIndex((G)=>G.id===this.activeId),j=_[($+1)%_.length];this.activate(j.id)}prevTab(){let _=this.getTabs();if(_.length<=1)return;let $=_.findIndex((G)=>G.id===this.activeId),j=_[($-1+_.length)%_.length];this.activate(j.id)}mruSwitch(){if(this.mruOrder.length>1)this.activate(this.mruOrder[1])}}var __=new fX;var D2=(_)=>{let $=new Set;return(_||[]).filter((j)=>{if(!j||$.has(j.id))return!1;return $.add(j.id),!0})};M0();function PX(){let[_,$]=f(null),[j,G]=f({text:"",totalLines:0}),[Z,X]=f(""),[Y,L]=f({text:"",totalLines:0}),[V,q]=f(null),[Q,K]=f(null),[B,N]=f(null),U=g(null),D=g(0),H=g(!1),E=g(""),k=g(""),z=g(!1),O=g(0),I=g(null),x=g(null),A=g(null),y=g(null),W=g(!1),M=g(!1);return{agentStatus:_,setAgentStatus:$,agentDraft:j,setAgentDraft:G,agentPlan:Z,setAgentPlan:X,agentThought:Y,setAgentThought:L,pendingRequest:V,setPendingRequest:q,currentTurnId:Q,setCurrentTurnId:K,steerQueuedTurnId:B,setSteerQueuedTurnId:N,lastAgentEventRef:U,lastSilenceNoticeRef:D,isAgentRunningRef:H,draftBufferRef:E,thoughtBufferRef:k,previewResyncPendingRef:z,previewResyncGenerationRef:O,pendingRequestRef:I,stalledPostIdRef:x,currentTurnIdRef:A,steerQueuedTurnIdRef:y,thoughtExpandedRef:W,draftExpandedRef:M}}M0();var fD=0.1,bX=4,vX=4,RX=160,SX=1600,uX=200,gX=1600;function D$(){if(typeof window>"u")return 0;return Number(window.innerWidth)||0}function mX(_=D$()){return _>0?Math.floor(_*fD):0}function U5(_,$=D$(),j=0){let G=mX($)+bX+(j>0?vX+Math.max(0,j):0),Z=$>0?Math.floor($-G):SX;return Math.min(Math.max(Number(_)||0,RX),Math.max(RX,Math.min(SX,Z)))}function E5(_,$=D$(),j=0){let G=mX($)+vX+(j>0?bX+Math.max(0,j):0),Z=$>0?Math.floor($-G):gX;return Math.min(Math.max(Number(_)||0,uX),Math.max(uX,Math.min(gX,Z)))}function cX({appShellRef:_,sidebarWidthRef:$,editorWidthRef:j,dockHeightRef:G}){let Z=g((Q)=>{Q.preventDefault();let K=_.current;if(!K)return;let B=Q.clientX,N=$.current||280,U=Q.currentTarget;U.classList.add("dragging"),K.classList.add("sidebar-resizing"),document.body.style.cursor="col-resize",document.body.style.userSelect="none";let D=B,H=(k)=>{D=k.clientX;let z=U5(N+(k.clientX-B),D$(),j?.current||0);K.style.setProperty("--sidebar-width",`${z}px`),$.current=z},E=()=>{let k=U5(N+(D-B),D$(),j?.current||0);$.current=k,U.classList.remove("dragging"),K.classList.remove("sidebar-resizing"),document.body.style.cursor="",document.body.style.userSelect="",V_("sidebarWidth",String(Math.round(k))),document.removeEventListener("mousemove",H),document.removeEventListener("mouseup",E)};document.addEventListener("mousemove",H),document.addEventListener("mouseup",E)}).current,X=g((Q)=>{Q.preventDefault();let K=_.current;if(!K)return;let B=Q.touches[0];if(!B)return;let N=B.clientX,U=$.current||280,D=Q.currentTarget;D.classList.add("dragging"),K.classList.add("sidebar-resizing"),document.body.style.userSelect="none";let H=(k)=>{let z=k.touches[0];if(!z)return;k.preventDefault();let O=U5(U+(z.clientX-N),D$(),j?.current||0);K.style.setProperty("--sidebar-width",`${O}px`),$.current=O},E=()=>{D.classList.remove("dragging"),K.classList.remove("sidebar-resizing"),document.body.style.userSelect="",V_("sidebarWidth",String(Math.round($.current||U))),document.removeEventListener("touchmove",H),document.removeEventListener("touchend",E),document.removeEventListener("touchcancel",E)};document.addEventListener("touchmove",H,{passive:!1}),document.addEventListener("touchend",E),document.addEventListener("touchcancel",E)}).current,Y=g((Q)=>{Q.preventDefault();let K=_.current;if(!K)return;let B=Q.clientX,N=j.current||$.current||280,U=Q.currentTarget;U.classList.add("dragging"),document.body.style.cursor="col-resize",document.body.style.userSelect="none";let D=B,H=(k)=>{D=k.clientX;let z=E5(N+(k.clientX-B),D$(),$?.current||0);K.style.setProperty("--editor-width",`${z}px`),j.current=z},E=()=>{let k=E5(N+(D-B),D$(),$?.current||0);j.current=k,U.classList.remove("dragging"),document.body.style.cursor="",document.body.style.userSelect="",V_("editorWidth",String(Math.round(k))),document.removeEventListener("mousemove",H),document.removeEventListener("mouseup",E)};document.addEventListener("mousemove",H),document.addEventListener("mouseup",E)}).current,L=g((Q)=>{Q.preventDefault();let K=_.current;if(!K)return;let B=Q.touches[0];if(!B)return;let N=B.clientX,U=j.current||$.current||280,D=Q.currentTarget;D.classList.add("dragging"),document.body.style.userSelect="none";let H=(k)=>{let z=k.touches[0];if(!z)return;k.preventDefault();let O=E5(U+(z.clientX-N),D$(),$?.current||0);K.style.setProperty("--editor-width",`${O}px`),j.current=O},E=()=>{D.classList.remove("dragging"),document.body.style.userSelect="",V_("editorWidth",String(Math.round(j.current||U))),document.removeEventListener("touchmove",H),document.removeEventListener("touchend",E),document.removeEventListener("touchcancel",E)};document.addEventListener("touchmove",H,{passive:!1}),document.addEventListener("touchend",E),document.addEventListener("touchcancel",E)}).current,V=g((Q)=>{Q.preventDefault();let K=_.current;if(!K)return;let B=Q.clientY,N=G?.current||200,U=Q.currentTarget;U.classList.add("dragging"),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let D=B,H=(k)=>{D=k.clientY;let z=Math.min(Math.max(N-(k.clientY-B),100),window.innerHeight*0.5);if(K.style.setProperty("--dock-height",`${z}px`),G)G.current=z;window.dispatchEvent(new CustomEvent("dock-resize"))},E=()=>{let k=Math.min(Math.max(N-(D-B),100),window.innerHeight*0.5);if(G)G.current=k;U.classList.remove("dragging"),document.body.style.cursor="",document.body.style.userSelect="",V_("dockHeight",String(Math.round(k))),window.dispatchEvent(new CustomEvent("dock-resize")),document.removeEventListener("mousemove",H),document.removeEventListener("mouseup",E)};document.addEventListener("mousemove",H),document.addEventListener("mouseup",E)}).current,q=g((Q)=>{Q.preventDefault();let K=_.current;if(!K)return;let B=Q.touches[0];if(!B)return;let N=B.clientY,U=G?.current||200,D=Q.currentTarget;D.classList.add("dragging"),document.body.style.userSelect="none";let H=(k)=>{let z=k.touches[0];if(!z)return;k.preventDefault();let O=Math.min(Math.max(U-(z.clientY-N),100),window.innerHeight*0.5);if(K.style.setProperty("--dock-height",`${O}px`),G)G.current=O;window.dispatchEvent(new CustomEvent("dock-resize"))},E=()=>{D.classList.remove("dragging"),document.body.style.userSelect="",V_("dockHeight",String(Math.round(G?.current||U))),window.dispatchEvent(new CustomEvent("dock-resize")),document.removeEventListener("touchmove",H),document.removeEventListener("touchend",E),document.removeEventListener("touchcancel",E)};document.addEventListener("touchmove",H,{passive:!1}),document.addEventListener("touchend",E),document.addEventListener("touchcancel",E)}).current;return{handleSplitterMouseDown:Z,handleSplitterTouchStart:X,handleEditorSplitterMouseDown:Y,handleEditorSplitterTouchStart:L,handleDockSplitterMouseDown:V,handleDockSplitterTouchStart:q}}M0();function p7(_,$){try{if(typeof window>"u")return $;let j=window.__PICLAW_SILENCE||{},G=`__PICLAW_SILENCE_${_.toUpperCase()}_MS`,Z=j[_]??window[G],X=Number(Z);return Number.isFinite(X)?X:$}catch{return $}}var lX=p7("warning",30000),hX=p7("finalize",120000),nX=p7("refresh",30000),rX=30000;function pX(_){let $={};return(_?.agents||[]).forEach((j)=>{$[j.id]=j}),$}function H5(){if(/iPad|iPhone/.test(navigator.userAgent))return!0;return navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1}function dX(_=30000){let[,$]=f(0);u(()=>{let j=setInterval(()=>$((G)=>G+1),_);return()=>clearInterval(j)},[_])}function iX(_,$=160){let j=String(_||"").replace(/\r\n/g,`
`);if(!j)return 0;return j.split(`
`).reduce((G,Z)=>G+Math.max(1,Math.ceil(Z.length/$)),0)}function f6(_){if(!_||typeof _!=="object")return null;let $=_.started_at??_.startedAt;if(typeof $!=="string"||!$)return null;let j=Date.parse($);return Number.isFinite(j)?j:null}function PD(_){if(!_||typeof _!=="object")return null;let $=_.retry_at??_.retryAt;if(typeof $!=="string"||!$)return null;let j=Date.parse($);return Number.isFinite(j)?j:null}function r$(_){if(!_||typeof _!=="object")return null;let $=_.last_event_at??_.lastEventAt??_.started_at??_.startedAt;if(typeof $!=="string"||!$)return null;let j=Date.parse($);return Number.isFinite(j)?j:null}function W$(_){if(!_||typeof _!=="object")return!1;let $=_.intent_key??_.intentKey;return _.type==="intent"&&$==="compaction"}function P6(_){if(!_||typeof _!=="object")return"";let $=_.title;if(typeof $==="string"&&$.trim())return $.trim();let j=_.status;if(typeof j==="string"&&j.trim())return j.trim();return W$(_)?"Compacting context":"Working..."}function oX(_){let $=Math.max(0,Math.floor(_/1000)),j=$%60,G=Math.floor($/60)%60,Z=Math.floor($/3600);if(Z>0)return`${Z}:${String(G).padStart(2,"0")}:${String(j).padStart(2,"0")}`;return`${G}:${String(j).padStart(2,"0")}`}function D5(_,$=Date.now()){let j=f6(_);if(j===null)return null;return oX(Math.max(0,$-j))}function sX(_,$=Date.now()){let j=PD(_);if(j===null)return null;let G=j-$;if(G<=0)return"retrying now";return`retry in ${oX(G)}`}M0();function KL(_={}){o1(_)}function QL(){let[_,$]=f(!1);if(u(()=>{let Z=(Y)=>{let L=W2(Y?.detail?.section);if(L)try{window.__piclawSettingsRequestedSection=L}catch(V){}$(!0)};window.addEventListener("piclaw:open-settings",Z);let X=R6();if(X.open){if(X.section)try{window.__piclawSettingsRequestedSection=X.section}catch(Y){}$(!0)}return()=>window.removeEventListener("piclaw:open-settings",Z)},[]),!_)return null;let[j,G]=f(null);if(u(()=>{Promise.resolve().then(() => (VL(),qL)).then((Z)=>{G(()=>Z.SettingsDialogContent)})},[]),!j)return F`
            <div class="settings-dialog-backdrop" onClick=${()=>$(!1)}>
                <div class="settings-dialog settings-dialog-loading-shell" data-testid="settings-dialog">
                    <div class="settings-loading-shell-body">
                        <span class="settings-spinner"></span>
                        <span>Loading settings…</span>
                    </div>
                </div>
            </div>
        `;return F`
        <div class="settings-dialog-backdrop" onClick=${(Z)=>{if(Z.target===Z.currentTarget)$(!1)}}>
            <${j} onClose=${()=>$(!1)} />
        </div>
    `}M0();function XO(_,$){return new URL(String(_||""),$).toString()}function NL(){let[_,$]=f(()=>typeof window>"u"?"http://localhost/":window.location.href);u(()=>{if(typeof window>"u")return;let Z=()=>$(window.location.href);return window.addEventListener("popstate",Z),()=>window.removeEventListener("popstate",Z)},[]);let j=R((Z,X={})=>{if(typeof window>"u")return;let{replace:Y=!1}=X||{},L=XO(Z,window.location.href);if(Y)window.history.replaceState(null,"",L);else window.history.pushState(null,"",L);$(window.location.href)},[]);return{locationParams:Y0(()=>new URL(_).searchParams,[_]),navigate:j}}M0();M0();function BL(_,$,j,G){try{let Z=_?.getItem?.($),X=Z?Number(Z):Number.NaN;return Number.isFinite(X)&&X>=j?X:G}catch(Z){return G}}function H9(_,$,j){try{return _?.setItem?.($,String(Math.round(j))),!0}catch(G){return!1}}var YO=400,D9=60,LO=220,W9="mdPreviewHeight";function qO(){return BL(localStorage,W9,D9,LO)}function i6({getContent:_,path:$,onClose:j}){let[G,Z]=f(""),[X,Y]=f(qO),L=g(null),V=g(null),q=g(""),Q=g(_);return Q.current=_,u(()=>{let N=()=>{let D=Q.current?.()||"";if(D===q.current)return;q.current=D;try{let H=Z1(D,null);Z(H)}catch{Z('<p style="color:var(--text-secondary)">Preview unavailable</p>')}};N();let U=setInterval(N,YO);return()=>clearInterval(U)},[]),u(()=>{if(L.current&&G)H$(L.current).catch((N)=>{console.debug("[markdown-preview] Mermaid rendering failed for the live preview.",N,{path:$})})},[G]),F`
        <div
            class="md-preview-splitter"
            onMouseDown=${(N)=>{N.preventDefault();let U=N.clientY,D=V.current?.offsetHeight||X,H=V.current?.parentElement,E=H?H.offsetHeight*0.7:500,k=N.currentTarget;k.classList.add("dragging"),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let z=(I)=>{let x=Math.min(Math.max(D-(I.clientY-U),D9),E);Y(x)},O=()=>{k.classList.remove("dragging"),document.body.style.cursor="",document.body.style.userSelect="",H9(localStorage,W9,V.current?.offsetHeight||X),document.removeEventListener("mousemove",z),document.removeEventListener("mouseup",O)};document.addEventListener("mousemove",z),document.addEventListener("mouseup",O)}}
            onTouchStart=${(N)=>{N.preventDefault();let U=N.touches[0];if(!U)return;let D=U.clientY,H=V.current?.offsetHeight||X,E=V.current?.parentElement,k=E?E.offsetHeight*0.7:500,z=N.currentTarget;z.classList.add("dragging"),document.body.style.userSelect="none";let O=(x)=>{let A=x.touches[0];if(!A)return;x.preventDefault();let y=Math.min(Math.max(H-(A.clientY-D),D9),k);Y(y)},I=()=>{z.classList.remove("dragging"),document.body.style.userSelect="",H9(localStorage,W9,V.current?.offsetHeight||X),document.removeEventListener("touchmove",O),document.removeEventListener("touchend",I),document.removeEventListener("touchcancel",I)};document.addEventListener("touchmove",O,{passive:!1}),document.addEventListener("touchend",I),document.addEventListener("touchcancel",I)}}
        ></div>
        <div class="md-preview-panel" ref=${V} style=${{height:X+"px"}}>
            <div class="md-preview-header">
                <span class="md-preview-title">Preview</span>
                <button class="md-preview-close" onClick=${j} title="Close preview" aria-label="Close preview">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                        <line x1="4" y1="4" x2="12" y2="12"/>
                        <line x1="12" y1="4" x2="4" y2="12"/>
                    </svg>
                </button>
            </div>
            <div
                class="md-preview-body post-content"
                ref=${L}
                dangerouslySetInnerHTML=${{__html:G}}
            />
        </div>
    `}function FL(_){if(_.branchLoaderMode)return"branch-loader";if(_.panePopoutMode)return"pane-popout";return"main"}function VO(_){return _==="error"?"Could not open branch window":"Opening branch…"}function UL(_){return F`
    <div class="app-shell chat-only">
      <div class="container" style=${{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"24px"}}>
        <div class="card" style=${{width:"min(560px, 100%)",padding:"24px"}}>
          <h1 style=${{margin:"0 0 12px",fontSize:"1.1rem"}}>
            ${VO(_.status)}
          </h1>
          <p style=${{margin:0,lineHeight:1.6}}>${_.message}</p>
        </div>
      </div>
    </div>
  `}function EL(_){let{appShellRef:$,editorOpen:j,hidePanePopoutControls:G,panePopoutHasMenuActions:Z,panePopoutTitle:X,tabStripTabs:Y,tabStripActiveId:L,handleTabActivate:V,previewTabs:q,diffTabs:Q,handleTabTogglePreview:K,handleTabToggleDiff:B,editorContainerRef:N,getPaneContent:U,panePopoutPath:D}=_,H=j&&!G&&Z,E=X?`Pane window controls for ${X}`:"Pane window controls";return F`
    <div class=${`app-shell pane-popout${j?" editor-open":""}`} ref=${$}>
      <div class="editor-pane-container pane-popout-container">
        ${H&&F`
          <div class="pane-popout-hover-zone" aria-hidden="true"></div>
          <div class="pane-popout-controls" role="toolbar" aria-label=${E}>
            <details class="pane-popout-controls-menu">
              <summary
                class="pane-popout-controls-trigger pane-popout-controls-icon-button"
                aria-label=${E}
                title=${E}
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 4.75h10" />
                  <path d="M5 8h8" />
                  <path d="M7 11.25h6" />
                </svg>
              </summary>
              <div class="pane-popout-controls-panel">
                ${Y.length>1&&F`
                  <div class="pane-popout-controls-section">
                    <div class="pane-popout-controls-section-title">Open panes</div>
                    <div class="pane-popout-controls-list">
                      ${Y.map((k)=>F`
                        <button
                          type="button"
                          class=${`pane-popout-controls-item${k.id===L?" active":""}`}
                          onClick=${(z)=>{V(k.id),z.currentTarget.closest("details")?.removeAttribute("open")}}
                        >
                          ${k.label}
                        </button>
                      `)}
                    </div>
                  </div>
                `}
                ${L&&Q.has(L)&&F`
                  <button
                    type="button"
                    class="pane-popout-controls-action"
                    onClick=${(k)=>{B(L),k.currentTarget.closest("details")?.removeAttribute("open")}}
                  >
                    Hide diff
                  </button>
                `}
                ${L&&q.has(L)&&F`
                  <button
                    type="button"
                    class="pane-popout-controls-action"
                    onClick=${(k)=>{K(L),k.currentTarget.closest("details")?.removeAttribute("open")}}
                  >
                    Hide preview
                  </button>
                `}
              </div>
            </details>
          </div>
        `}
        ${j?F`<div class="editor-pane-host" ref=${N}></div>`:F`
            <div class="card" style=${{margin:"24px",padding:"24px",maxWidth:"640px"}}>
              <h1 style=${{margin:"0 0 12px",fontSize:"1.1rem"}}>Opening pane…</h1>
              <p style=${{margin:0,lineHeight:1.6}}>${D||"No pane path provided."}</p>
            </div>
          `}
        ${j&&L&&q.has(L)&&F`
          <${i6}
            getContent=${U}
            path=${L}
            onClose=${()=>K(L)}
          />
        `}
      </div>
    </div>
  `}M0();M0();function o6(_){return String(_||"").toLowerCase().replace(/^@/,"").replace(/\s+/g," ").trim()}function KO(_,$){let j=o6(_),G=o6($);if(!G)return!1;return j.startsWith(G)||j.includes(G)}function A5(_){if(!_)return!1;if(_.isComposing)return!1;if(_.ctrlKey||_.metaKey||_.altKey)return!1;return typeof _.key==="string"&&_.key.length===1&&/\S/.test(_.key)}function O9(_,$,j=Date.now(),G=700){let Z=_&&typeof _==="object"?_:{value:"",updatedAt:0},X=String($||"").trim().toLowerCase();if(!X)return{value:"",updatedAt:j};return{value:!Z.value||!Number.isFinite(Z.updatedAt)||j-Z.updatedAt>G?X:`${Z.value}${X}`,updatedAt:j}}function QO(_,$){let j=Math.max(0,Number(_)||0);if(j<=0)return[];let Z=((Number.isInteger($)?$:0)%j+j)%j,X=[];for(let Y=0;Y<j;Y+=1)X.push((Z+Y)%j);return X}function NO(_,$,j=0,G=(Z)=>Z){let Z=o6($);if(!Z)return-1;let X=Array.isArray(_)?_:[],Y=QO(X.length,j),L=X.map((V)=>o6(G(V)));for(let V of Y)if(L[V].startsWith(Z))return V;for(let V of Y)if(L[V].includes(Z))return V;return-1}function z9(_,$,j=-1,G=(Z)=>Z){let Z=Array.isArray(_)?_:[];if(j>=0&&j<Z.length){let X=G(Z[j]);if(KO(X,$))return j}return NO(Z,$,0,G)}I_();function s6(_){return String(_||"").trim().toLowerCase()}function J9(_){let $=String(_||"").match(/^@([a-zA-Z0-9_-]*)$/);if(!$)return null;return s6($[1]||"")}function BO(_){let $=new Set,j=[];for(let G of Array.isArray(_)?_:[]){let Z=s6(G?.agent_name);if(!Z||$.has(Z))continue;$.add(Z),j.push(G)}return j}function HL(_,$,j={}){let G=J9($);if(G==null)return[];let Z=typeof j?.currentChatJid==="string"?j.currentChatJid:null;return BO(_).filter((X)=>{if(Z&&X?.chat_jid===Z)return!1;return s6(X?.agent_name).startsWith(G)})}function A9(_){let $=s6(_);return $?`@${$} `:""}function DL(_={}){if(_.searchMode)return!1;return Boolean(_.showSessionSwitcherButton)}function WL(_,$,j={}){if(!_||_.isComposing)return!1;if(!DL(j))return!1;if(_.ctrlKey||_.metaKey||_.altKey)return!1;if(_.key!=="@")return!1;return String($||"")===""}function k9(_,$={}){if(!DL($))return!1;return String(_||"")==="@"}function y9(_){let $=M9(_);return $?`@${$}`:""}function M9(_){return String(_||"").trim().toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").replace(/-{2,}/g,"-")}function a6(_,$=""){let j=String(_||""),G=M9(j),Z=M9($);if(!j.trim())return{normalized:G,handle:"",canSubmit:!1,kind:"error",message:"Enter a branch handle."};if(!G)return{normalized:G,handle:"",canSubmit:!1,kind:"error",message:"Handle must contain at least one letter or number."};let X=`@${G}`;if(G===Z)return{normalized:G,handle:X,canSubmit:!1,kind:"info",message:`Already using ${X}.`};if(G!==j.trim())return{normalized:G,handle:X,canSubmit:!0,kind:"info",message:`Will save as ${X}. Letters, numbers, - and _ are allowed; leading @ is optional.`};return{normalized:G,handle:X,canSubmit:!0,kind:"success",message:`Saving as ${X}.`}}function FO(_,$={}){let j=[],G=typeof $.currentChatJid==="string"?$.currentChatJid.trim():"",Z=typeof _?.chat_jid==="string"?_.chat_jid.trim():"";if(G&&Z===G)j.push("current");if(_?.archived_at)j.push("archived");else if(_?.is_active)j.push("active");return j}function t6(_,$={}){let j=y9(_?.agent_name)||String(_?.chat_jid||"").trim(),G=typeof _?.chat_jid==="string"&&_.chat_jid.trim()?_.chat_jid.trim():"unknown-chat",Z=FO(_,$);return Z.length>0?`${j} — ${G} • ${Z.join(" • ")}`:`${j} — ${G}`}function OL(_,$,j){let G=y9(_),Z=y9($),X=String(j||"").trim();if(G&&Z&&G!==Z)return`Restored archived ${G} as ${Z} because ${G} is already in use.`;if(Z)return`Restored ${Z}.`;if(G)return`Restored ${G}.`;return`Restored ${X||"branch"}.`}function e6({steerQueued:_=!1,pulsing:$=!1}={}){let j=["turn-dot"];if(_)j.push("turn-dot-queued");if($)j.push("turn-dot-pulsing");return j.join(" ")}function _8({pulsing:_=!1}={}){let $=["compose-inline-status-dot"];if(_)$.push("compose-inline-status-dot-pulsing");return $.join(" ")}function $8(_,{isLastActivity:$=!1,pendingRequest:j=!1}={}){if(j)return"dot";if($)return"none";if(_?.type==="error")return"none";if(_?.type==="intent")return"dot";let G=typeof _?.type==="string"?_.type:"";if(Boolean(typeof _?.tool_name==="string"&&_.tool_name.trim()||_?.tool_args))return"spinner";if(G==="tool_call"||G==="tool_status"||G==="thinking"||G==="waiting")return"spinner";return"dot"}function zL(_,$={}){return $8(_,$)==="dot"}M0();var JL=350;function UO(_){return String(_||"Connecting").replace(/[-_]+/g," ").replace(/^./,($)=>$.toUpperCase())}function EO(_,$={}){let j=typeof _==="string"&&_.trim()?_.trim():"connecting";if(j==="connected")return{show:!1,statusClass:"connected",label:"Connected",title:"Connection: Connected"};if(j!=="disconnected"){let L=UO(j);return{show:!0,statusClass:j,label:L,title:`Connection: ${L}`}}let G=Number.isFinite(Number($?.delayMs))?Math.max(0,Number($.delayMs)):JL,Z=Number.isFinite(Number($?.nowMs))?Number($.nowMs):Date.now(),X=Number.isFinite(Number($?.disconnectedAtMs))?Number($.disconnectedAtMs):Z;return Z-X>=G?{show:!0,statusClass:"disconnected",label:"Reconnecting",title:"Reconnecting"}:{show:!1,statusClass:"connecting",label:"Connecting",title:"Connecting"}}function w9(_,$={}){let j=Number.isFinite(Number($?.delayMs))?Math.max(0,Number($.delayMs)):JL,[G,Z]=f(null),[X,Y]=f(()=>Date.now());return u(()=>{if(_==="disconnected"){let L=Date.now();Z((V)=>V??L),Y(L);return}Z(null),Y(Date.now())},[_]),u(()=>{if(_!=="disconnected"||G===null)return;let L=j-(Date.now()-G);if(L<=0)return;let V=0,q=0,Q=setTimeout(()=>{if(typeof requestAnimationFrame!=="function"){Y(Date.now());return}V=requestAnimationFrame(()=>{q=requestAnimationFrame(()=>{Y(Date.now())})})},L);return()=>{if(clearTimeout(Q),V)cancelAnimationFrame(V);if(q)cancelAnimationFrame(q)}},[_,G,j]),Y0(()=>EO(_,{delayMs:j,disconnectedAtMs:G,nowMs:X}),[_,j,G,X])}M0();function L1({prefix:_="file",label:$,title:j,onRemove:G,onClick:Z,removeTitle:X="Remove",icon:Y="file"}){let L=`${_}-file-pill`,V=`${_}-file-name`,q=`${_}-file-remove`,Q=Y==="message"?F`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>`:Y==="folder"?F`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>`:F`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>`;return F`
    <span class=${L} title=${j||$} onClick=${Z}>
      ${Q}
      <span class=${V}>${$}</span>
      ${G&&F`
        <button
          class=${q}
          onClick=${(K)=>{K.preventDefault(),K.stopPropagation(),G()}}
          title=${X}
          type="button"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      `}
    </span>
  `}async function T9(_,$,j){if(typeof _!=="function")return!1;try{let G=await _($);if(!G)return!1;return j(G),!0}catch(G){return!1}}function HO(_={}){let $=_.navigator??(typeof navigator<"u"?navigator:null);if(!$)return!1;let j=String($.userAgent||"");if(/iPad|iPhone/.test(j))return!0;return $.platform==="MacIntel"&&Number($.maxTouchPoints||0)>1}function DO(_={}){let $=_.window??(typeof window<"u"?window:null);if(!$)return null;return $.SpeechRecognition||$.webkitSpeechRecognition||null}function x9(_={}){let $=_.window??(typeof window<"u"?window:null),j=typeof _.secureContext==="boolean"?_.secureContext:Boolean($?.isSecureContext),G=P1(_),Z=HO(_),X=DO(_);if(!j)return{mode:"unavailable",showButton:!1,canStart:!1,reason:"secure-context-required",title:"Voice input requires HTTPS",detail:"Native browser speech input needs a secure context (HTTPS or localhost).",recognitionCtor:null,ios:Z,standalone:G,secureContext:j};if(Z&&G)return{mode:"fallback",showButton:!0,canStart:!1,reason:"ios-standalone-fallback",title:"Use keyboard dictation",detail:"Speech input is intentionally downgraded in iPhone/iPad standalone web apps because browser-native recognition is not reliable there. Focus the compose box and use the keyboard dictation mic instead.",recognitionCtor:X,ios:Z,standalone:G,secureContext:j};if(!X){if(Z)return{mode:"fallback",showButton:!0,canStart:!1,reason:"ios-keyboard-dictation",title:"Use keyboard dictation",detail:"This browser does not expose native in-page speech recognition here. Focus the compose box and use the keyboard dictation mic instead.",recognitionCtor:null,ios:Z,standalone:G,secureContext:j};return{mode:"unavailable",showButton:!1,canStart:!1,reason:"unsupported",title:"Voice input unavailable",detail:"This browser does not expose native speech recognition in this context.",recognitionCtor:null,ios:Z,standalone:G,secureContext:j}}return{mode:"native",showButton:!0,canStart:!0,reason:"supported",title:"Start voice input",detail:Z?"Browser-native speech input is available here, but Safari/WebKit reliability may still vary.":"Browser-native speech input is available.",recognitionCtor:X,ios:Z,standalone:G,secureContext:j}}function AL(_,$="",j=""){let G=String(_||""),Z=String($||"").trim(),X=String(j||"").trim(),Y=[Z,X].filter(Boolean).join(" ").trim();if(!Y)return G;if(!G)return Y;let L=/[\s\n]$/.test(G)?"":" ";return`${G}${L}${Y}`}function kL(_,$=0){let j="",G="",Z=_&&typeof _.length==="number"?_:[];for(let X=Math.max(0,$);X<Z.length;X+=1){let Y=Z[X];if(!Y||!Y[0])continue;let L=String(Y[0].transcript||"").trim();if(!L)continue;if(Y.isFinal)j=`${j} ${L}`.trim();else G=`${G} ${L}`.trim()}return{finalText:j,interimText:G}}function I9(_,$=null){let j=String(_||"").trim().toLowerCase();switch(j){case"not-allowed":case"service-not-allowed":return $?.ios?"Microphone or speech-recognition permission was denied. On iPhone/iPad, using keyboard dictation may be more reliable.":"Microphone or speech-recognition permission was denied by the browser.";case"no-speech":return"No speech was detected. Try again and speak after the listening indicator appears.";case"audio-capture":return"The browser could not access a microphone for speech recognition.";case"network":return"The browser speech-recognition service reported a network or service failure.";case"aborted":return"Voice input was stopped.";default:return j?`Voice input failed (${j}).`:"Voice input failed."}}var WO=[{name:"/model",description:"Select model or list available models"},{name:"/cycle-model",description:"Cycle to the next available model"},{name:"/thinking",description:"Show or set thinking/effort level"},{name:"/effort",description:"Show or set thinking/effort level (alias for /thinking)"},{name:"/cycle-thinking",description:"Cycle thinking level"},{name:"/theme",description:"Set UI theme (no name to show available themes)"},{name:"/meters",description:"Toggle the top-right CPU/RAM HUD (/meters on|off|toggle)"},{name:"/tint",description:"Tint default light/dark UI (usage: /tint #hex or /tint off)"},{name:"/btw",description:"Open a side conversation panel without interrupting the main chat"},{name:"/state",description:"Show current session state"},{name:"/stats",description:"Show session token and cost stats"},{name:"/context",description:"Show context window usage"},{name:"/last",description:"Show last assistant response"},{name:"/compact",description:"Manually compact the session"},{name:"/auto-compact",description:"Toggle auto-compaction"},{name:"/auto-retry",description:"Toggle auto-retry"},{name:"/abort",description:"Abort the current response"},{name:"/abort-retry",description:"Abort retry backoff"},{name:"/abort-bash",description:"Abort running bash command"},{name:"/shell",description:"Run a shell command and return output"},{name:"/bash",description:"Run a shell command and add output to context"},{name:"/queue",description:"Queue a follow-up message (one-at-a-time)"},{name:"/queue-all",description:"Queue a follow-up message (batch all)"},{name:"/steer",description:"Steer the current response"},{name:"/steering-mode",description:"Set steering mode (all|one)"},{name:"/followup-mode",description:"Set follow-up mode (all|one)"},{name:"/session-name",description:"Set or show the session name"},{name:"/new-session",description:"Start a new session"},{name:"/switch-session",description:"Switch to a session file"},{name:"/session-rotate",description:"Rotate the current persisted session into an archived file"},{name:"/rollup",description:"Merge the current branch chat back into its parent chat"},{name:"/clone",description:"Duplicate the current active branch into a new session"},{name:"/fork",description:"Fork from a previous message"},{name:"/forks",description:"List forkable messages"},{name:"/tree",description:"List the session tree"},{name:"/label",description:"Set or clear a label on a tree entry"},{name:"/labels",description:"List labeled entries"},{name:"/agent-name",description:"Set or show the agent display name"},{name:"/agent-avatar",description:"Set or show the agent avatar URL"},{name:"/user-name",description:"Set or show your display name"},{name:"/user-avatar",description:"Set or show your avatar URL"},{name:"/user-github",description:"Set name/avatar from GitHub profile"},{name:"/export-html",description:"Export session to HTML"},{name:"/passkey",description:"Manage passkeys (enrol/list/delete)"},{name:"/totp",description:"Show a TOTP enrolment QR code"},{name:"/qr",description:"Generate a QR code for text or URL"},{name:"/search",description:"Search notes and skills in the workspace"},{name:"/dream",description:"Run Dream memory maintenance over recent days (default 7)"},{name:"/tasks",description:"List scheduled tasks"},{name:"/scheduled",description:"List scheduled tasks"},{name:"/pair",description:"Manage remote peer connections (/pair request <url> | /pair list)"},{name:"/ask",description:"Send a prompt to a paired remote instance (/ask <instance_id|fingerprint> <prompt>)"},{name:"/restart",description:"Restart the agent and stop subprocesses"},{name:"/exit",description:"Exit the current piclaw process immediately (Supervisor will restart it)"},{name:"/login",description:"Login to an AI model provider (OAuth or API key)"},{name:"/logout",description:"Logout from an AI model provider"},{name:"/settings",description:"Open the settings pane"},{name:"/help",description:"Open keyboard shortcuts help"},{name:"/commands",description:"List available commands"},{name:"/skill:",description:"Run a workspace skill (e.g. /skill:visual-artifact-generator, /skill:web-search)"}],yL="piclaw_compose_history";function OO(_,$,j=!1){if(j)return{shouldApply:!1,nextToken:$,text:""};if(!_||typeof _!=="object")return{shouldApply:!1,nextToken:$,text:""};let G=typeof _.token==="string"?_.token:"",Z=typeof _.text==="string"?_.text:"";if(!G||G===$||!Z.trim())return{shouldApply:!1,nextToken:$,text:""};return{shouldApply:!0,nextToken:G,text:Z}}function zO(_="web:default"){let $=typeof _==="string"&&_.trim()?_.trim():"web:default";if($==="web:default")return yL;return`${yL}:${encodeURIComponent($)}`}function JO(_,$=null){let j=new Set,G=[];for(let Z of Array.isArray(_)?_:[]){let X=typeof Z?.chat_jid==="string"?Z.chat_jid.trim():"";if(!X||j.has(X))continue;if(!(typeof Z?.agent_name==="string"?Z.agent_name.trim():""))continue;j.add(X),G.push(Z)}return G.sort((Z,X)=>{let Y=Boolean(Z?.archived_at),L=Boolean(X?.archived_at);if(Y!==L)return Y?1:-1;let V=String(Z?.agent_name||"").trim(),q=String(X?.agent_name||"").trim(),Q=V.localeCompare(q,void 0,{sensitivity:"base"});if(Q!==0)return Q;let K=String(Z?.chat_jid||"").trim(),B=String(X?.chat_jid||"").trim();return K.localeCompare(B,void 0,{sensitivity:"base"})}),G}function AO(_){return Boolean(_?.is_active&&!_?.archived_at)}function kO(_,$=null){let j=Array.isArray(_)?_:[],G=typeof $==="string"?$.trim():"";if(G){let X=j.findIndex((Y)=>{if(Y?.disabled)return!1;if(Y?.type!=="session")return!1;return(typeof Y?.chat?.chat_jid==="string"?Y.chat.chat_jid.trim():"")===G});if(X>=0)return X}let Z=j.findIndex((X)=>!X?.disabled);return Z>=0?Z:0}function ML(_,$){let j=typeof $?.command?.message==="string"?$.command.message.trim():"";if(!$?.ui_only||!j)return null;let G=typeof _==="string"?_.trim():"";if(!G.startsWith("/"))return null;let Z=G.split(/\s+/).filter(Boolean),X=Z[0]?.toLowerCase()||"";if(!(Z.length>1)&&(X==="/model"||X==="/thinking"||X==="/effort"))return j;return null}function yO(_,$,j=!1){if(_)return{mode:"queue",className:"icon-btn send-btn queue-mode",title:"Queue follow-up (Enter)",ariaLabel:"Queue follow-up message",disabled:!$};return{mode:"send",className:"icon-btn send-btn",title:"Send (Enter)",ariaLabel:"Send message",disabled:!$}}function wL(_,$,j={}){if(!_||j.searchMode)return!1;if(!(_.key===" "||_.key==="Spacebar"||_.code==="Space"))return!1;if(_.ctrlKey||_.metaKey||_.altKey||_.repeat)return!1;if(!j.speechButtonVisible||j.speechButtonActive)return!1;if(!j.canStartSpeech)return!1;return String($||"").trim().length===0}function MO(_,$){if(!$||!_)return!1;return _.key===" "||_.key==="Spacebar"||_.code==="Space"}function wO(_,$=!1){if(!_)return null;if($)return{mode:"compacting",className:"icon-btn send-btn abort-mode compacting-mode",title:"Compacting context — Stop response",ariaLabel:"Compacting context — Stop response",disabled:!1};return{mode:"abort",className:"icon-btn send-btn abort-mode",title:"Stop response",ariaLabel:"Stop response",disabled:!1}}function TO(_){return _==="abort"||_==="compacting"}function xO(_,$=0){if(_?.visible===!1)return{visible:!1,title:"",indicatorText:null,animateDot:!1};let j=typeof _?.message==="string"&&_.message.trim()?_.message.trim():null,G=_?.indicator&&typeof _.indicator==="object"?_.indicator:null;if(!j&&!G)return{visible:!1,title:"",indicatorText:null,animateDot:!1};if(G?.mode==="hidden")return{visible:Boolean(j),title:j||"Working…",indicatorText:null,animateDot:!1};if(G?.mode==="custom"&&Array.isArray(G.frames)&&G.frames.length>0){let Z=G.frames,X=Number.isFinite($)&&$>=0?Math.floor($)%Z.length:0;return{visible:!0,title:j||"Working…",indicatorText:Z[X],animateDot:!1}}return{visible:!0,title:j||"Working…",indicatorText:null,animateDot:!0}}function IO({usage:_,onCompact:$,compactionLabel:j="",compactionTitle:G=""}){let Z=Math.min(100,Math.max(0,_.percent||0)),X=_.tokens,Y=_.contextWindow,L="Compact context",V=X!=null?`Context: ${k5(X)} / ${k5(Y)} tokens (${Z.toFixed(0)}%)`:`Context: ${Z.toFixed(0)}%`,q=typeof j==="string"?j.trim():"",Q=typeof G==="string"?G.trim():"",K=q?`${V} — ${Q||"Smart compaction"} · ${q}`:`${V} — ${"Compact context"}`,B=9,N=2*Math.PI*9,U=Z/100*N,D=Z>90?"var(--context-red, #ef4444)":Z>75?"var(--context-amber, #f59e0b)":"var(--context-green, #22c55e)";return F`
        <button
            class=${`compose-context-pie icon-btn${q?" is-compacting":""}`}
            type="button"
            title=${K}
            aria-label=${q?`Smart compaction ${q}`:"Compact context"}
            onClick=${(H)=>{H.preventDefault(),H.stopPropagation(),$?.()}}
        >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r=${9}
                    fill="none"
                    stroke="var(--context-track, rgba(128,128,128,0.2))"
                    stroke-width="2.5" />
                <circle cx="12" cy="12" r=${9}
                    fill="none"
                    stroke=${D}
                    stroke-width="2.5"
                    stroke-dasharray=${`${U} ${N}`}
                    stroke-linecap="round"
                    transform="rotate(-90 12 12)" />
            </svg>
            ${q&&F`<span class="compose-context-pie-timer">${q}</span>`}
        </button>
    `}function k5(_){if(_==null)return"?";if(_>=1e6)return(_/1e6).toFixed(1)+"M";if(_>=1000)return(_/1000).toFixed(0)+"K";return String(_)}function CO(_){let $=Number(_?.tokens);return Number.isFinite($)&&$>0?$:null}function TL(_,$){let j=Number(_?.contextWindow??_?.context_window),G=CO($);if(!Number.isFinite(j)||j<=0||!Number.isFinite(G)||G<=0)return{blocked:!1,note:"",title:"",tokens:G??null,contextWindow:Number.isFinite(j)&&j>0?j:null};if(G<=j)return{blocked:!1,note:"",title:"",tokens:G,contextWindow:j};return{blocked:!0,note:"Current context won’t fit — compact first",title:`Current context uses ${k5(G)} tokens, but this model only fits ${k5(j)}. Compact first.`,tokens:G,contextWindow:j}}function C9(_){let $=Number(_);if(!Number.isFinite($)||$<=0)return"";return`${k5($)} ctx`}function fO(_,$){let j=typeof _==="string"?_.trim():"",G=C9($);if(!j)return G;if(!G)return j;return`${j} • ${G}`}function PO(_,$="",j=""){let G=typeof _==="string"?_.trim():"";if(G)return G;let Z=typeof $==="string"?$.trim():"",X=typeof j==="string"?j.trim():"";if(Z&&X)return`${Z}/${X}`;return X||Z||""}function CL(_){let $=Array.isArray(_?.model_options)?_.model_options:null,j=Array.isArray(_?.models)?_.models:[],G=$&&$.length>0?$:j,Z=[];for(let X of G){if(typeof X==="string"){let K=X.trim();if(!K)continue;let B=K.indexOf("/"),N=B>0?K.slice(0,B).trim():"",U=B>0?K.slice(B+1).trim():K;Z.push({label:K,provider:N,id:U,name:null,contextWindow:null,reasoning:!1});continue}if(!X||typeof X!=="object")continue;let Y=typeof X.provider==="string"?X.provider.trim():"",L=typeof X.id==="string"?X.id.trim():"",V=PO(X.label,Y,L);if(!V)continue;let q=typeof X.name==="string"&&X.name.trim()?X.name.trim():null,Q=Number(X.context_window??X.contextWindow);Z.push({label:V,provider:Y,id:L,name:q,contextWindow:Number.isFinite(Q)&&Q>0?Q:null,reasoning:Boolean(X.reasoning)})}return Z.sort((X,Y)=>X.label.localeCompare(Y.label,void 0,{sensitivity:"base"})),Z}function RO(_){if(!_||typeof _!=="object")return"";return[_.label,_.provider,_.id,_.name,C9(_.contextWindow)].filter(Boolean).join(" ")}function SO(_,$){let j=typeof _==="string"?_.trim():"";if(j)return{showPicker:!0,label:j,hasAvailableModels:!0};let G=CL($).length>0;return{showPicker:G,label:G?"Select model":"",hasAvailableModels:G}}function j8(_){return(typeof _==="string"?_.trim():"")||null}function xL(_){return j8(_)?.toLowerCase()??null}function IL(_,$){let j=xL(_),G=xL($);if(!j||!G)return!1;return j===G||j.endsWith(`/${G}`)||G.endsWith(`/${j}`)}function uO(_,$){let j=$&&typeof $==="object"?$:{},G=j8(j.latest_response_model??j.response_model??j.responseModel??j.routed_model??j.routedModel);if(!G)return null;let Z=j8(j.latest_requested_model??j.requested_model??j.requestedModel??j.current??j.model??_);if(Z&&IL(G,Z))return null;let X=j8(_??j.current??j.model);if(X&&Z&&!IL(X,Z))return null;return{label:`Routed: ${G}`,title:Z?`Requested model: ${Z} • Routed model: ${G}`:`Routed model: ${G}`,requestedModel:Z,responseModel:G}}function gO(_){if(!_)return _;let $=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`);if(!$.includes(" @ ")||!$.includes(`:
`))return _;let j=$.split(`
`),G=[],Z=0,X=!1;while(Z<j.length){let L=j[Z].trim();if(!L){Z+=1;continue}if(L==="Messages:"||L.startsWith("Channel:")||L.startsWith("Chat:")){X=!0,Z+=1;continue}if(/^[^\n]+\s@\s[^\n]+:$/.test(L)){X=!0,Z+=1;let V=[];while(Z<j.length){let q=j[Z],Q=q.trim();if(/^[^\n]+\s@\s[^\n]+:$/.test(Q))break;if(Q.startsWith("Channel:")||Q.startsWith("Chat:")||Q==="Messages:")break;V.push(q.startsWith("  ")?q.slice(2):q),Z+=1}if(V.length>0)G.push(V.join(`
`).trim());continue}return _}return X&&G.length>0?G.filter(Boolean).join(`

`):_}function fL(_){let $=String(_||"").trim(),j=$.match(/^`([^`]+)`$/);return(j?j[1]:$).trim()}function bO(_){if(!_)return{content:_,fileRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),G=-1;for(let q=0;q<j.length;q+=1)if(j[q].trim()==="Files:"&&j[q+1]&&/^\s*-\s+/.test(j[q+1])){G=q;break}if(G===-1)return{content:_,fileRefs:[]};let Z=[],X=G+1;for(;X<j.length;X+=1){let q=j[X];if(/^\s*-\s+/.test(q)){let Q=fL(q.replace(/^\s*-\s+/,"").trim());if(Q)Z.push(Q)}else if(!q.trim())break;else break}if(Z.length===0)return{content:_,fileRefs:[]};let Y=j.slice(0,G),L=j.slice(X);return{content:[...Y,...L].join(`
`).replace(/\n{3,}/g,`

`).trim(),fileRefs:Z}}function vO(_){if(!_)return{content:_,folderRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),G=-1;for(let q=0;q<j.length;q+=1)if(j[q].trim()==="Folders:"&&j[q+1]&&/^\s*-\s+/.test(j[q+1])){G=q;break}if(G===-1)return{content:_,folderRefs:[]};let Z=[],X=G+1;for(;X<j.length;X+=1){let q=j[X];if(/^\s*-\s+/.test(q)){let Q=fL(q.replace(/^\s*-\s+/,"").trim());if(Q)Z.push(Q)}else if(!q.trim())break;else break}if(Z.length===0)return{content:_,folderRefs:[]};let Y=j.slice(0,G),L=j.slice(X);return{content:[...Y,...L].join(`
`).replace(/\n{3,}/g,`

`).trim(),folderRefs:Z}}function mO(_){if(!_)return{content:_,messageRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),G=-1;for(let q=0;q<j.length;q+=1)if(j[q].trim()==="Referenced messages:"&&j[q+1]&&/^\s*-\s+/.test(j[q+1])){G=q;break}if(G===-1)return{content:_,messageRefs:[]};let Z=[],X=G+1;for(;X<j.length;X+=1){let q=j[X];if(/^\s*-\s+/.test(q)){let Q=q.replace(/^\s*-\s+/,"").trim().match(/^message:(\S+)$/i);if(Q)Z.push(Q[1])}else if(!q.trim())break;else break}if(Z.length===0)return{content:_,messageRefs:[]};let Y=j.slice(0,G),L=j.slice(X);return{content:[...Y,...L].join(`
`).replace(/\n{3,}/g,`

`).trim(),messageRefs:Z}}function cO(_){if(!_)return{content:_,attachmentRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),G=-1;for(let q=0;q<j.length;q+=1)if(j[q].trim()==="Attachments:"&&j[q+1]&&/^\s*-\s+/.test(j[q+1])){G=q;break}if(G===-1)return{content:_,attachmentRefs:[]};let Z=[],X=G+1;for(;X<j.length;X+=1){let q=j[X];if(/^\s*-\s+/.test(q)){let Q=q.replace(/^\s*-\s+/,"").trim(),K=Q.match(/^attachment:(\d+)(?:\s*\((.+)\))?$/i);if(K)Z.push({id:K[1],label:(K[2]||"").trim()||`attachment:${K[1]}`,raw:Q})}else if(!q.trim())break;else break}if(Z.length===0)return{content:_,attachmentRefs:[]};let Y=j.slice(0,G),L=j.slice(X);return{content:[...Y,...L].join(`
`).replace(/\n{3,}/g,`

`).trim(),attachmentRefs:Z}}function PL(_){let $=gO(_||""),j=bO($||""),G=vO(j.content||""),Z=mO(G.content||""),X=cO(Z.content||"");return{text:X.content||"",fileRefs:j.fileRefs,folderRefs:G.folderRefs,messageRefs:Z.messageRefs,attachmentRefs:X.attachmentRefs}}function lO(_){let $=PL(_),j=$.attachmentRefs.length>0?`Attachments:
${$.attachmentRefs.map((Z)=>`- ${Z.raw}`).join(`
`)}`:"";return{content:[String($.text||"").trim(),j].filter(Boolean).join(`

`).trim(),fileRefs:[...$.fileRefs],folderRefs:[...$.folderRefs],messageRefs:[...$.messageRefs],attachmentRefs:[...$.attachmentRefs]}}function hO(_){let{queuedItem:$,buildDraft:j=lO,onRemoveQueuedFollowup:G,setSubmitError:Z,setSubmitNotice:X,setMediaFiles:Y,onSetFileRefs:L,onSetFolderRefs:V,onSetMessageRefs:q,setContent:Q,textareaRef:K,resizeTextarea:B=()=>{},scheduleTimeout:N=(k,z=0)=>setTimeout(k,z),scheduleRaf:U=(k)=>requestAnimationFrame(k),logger:D=console}=_||{};if(!$)return!1;let H=j($?.content||""),E=H.content;return D?.info?.("[compose-box] Returning queued item to editor",{text:E?.slice(0,80),fileRefs:H.fileRefs?.length,folderRefs:H.folderRefs?.length,messageRefs:H.messageRefs?.length}),Z?.(null),X?.(null),Y?.([]),L?.(H.fileRefs),V?.(H.folderRefs),q?.(H.messageRefs),Q?.(E),U(()=>{let k=K?.current;if(!k)return;if(k.value=E,typeof k.dispatchEvent==="function")k.dispatchEvent(new Event("input",{bubbles:!0}));B();let z=E.length;k.selectionStart=z,k.selectionEnd=z,k.focus()}),N(()=>{try{G?.($)}catch(k){D?.warn?.("[compose-box] Failed to remove returned queued follow-up.",k)}},0),!0}function f9({items:_=[],onInjectQueuedFollowup:$,onRemoveQueuedFollowup:j,onMoveQueuedFollowup:G,onReturnQueuedFollowup:Z,onOpenFilePill:X}){if(!Array.isArray(_)||_.length===0)return null;return F`
        <div class="compose-queue-stack">
            ${_.map((Y,L)=>{let V=typeof Y?.content==="string"?Y.content:"",q=PL(V);if(!q.text.trim()&&q.fileRefs.length===0&&q.folderRefs.length===0&&q.messageRefs.length===0&&q.attachmentRefs.length===0)return null;let Q=L>0,K=L<_.length-1,B=!0;return F`
                    <div class="compose-queue-stack-item" data-testid="queue-item" role="listitem">
                        <div class="compose-queue-stack-content" title=${V}>
                            ${q.text.trim()&&F`<div class="compose-queue-stack-text">${q.text}</div>`}
                            ${(q.messageRefs.length>0||q.fileRefs.length>0||q.folderRefs.length>0||q.attachmentRefs.length>0)&&F`
                                <div class="compose-queue-stack-refs">
                                    ${q.messageRefs.map((N)=>F`
                                        <${L1}
                                            key=${"queue-msg-"+N}
                                            prefix="compose"
                                            label=${"msg:"+N}
                                            title=${"Message reference: "+N}
                                            icon="message"
                                        />
                                    `)}
                                    ${q.fileRefs.map((N)=>{let U=N.split("/").pop()||N;return F`
                                            <${L1}
                                                key=${"queue-file-"+N}
                                                prefix="compose"
                                                label=${U}
                                                title=${N}
                                                onClick=${()=>X?.(N)}
                                            />
                                        `})}
                                    ${q.folderRefs.map((N)=>{let U=N.split("/").pop()||N;return F`
                                            <${L1}
                                                key=${"queue-folder-"+N}
                                                prefix="compose"
                                                label=${U}
                                                title=${N}
                                                icon="folder"
                                                onClick=${()=>X?.(N)}
                                            />
                                        `})}
                                    ${q.attachmentRefs.map((N)=>F`
                                        <${L1}
                                            key=${"queue-attachment-"+N.id}
                                            prefix="compose"
                                            label=${N.label}
                                            title=${N.raw}
                                        />
                                    `)}
                                </div>
                            `}
                        </div>
                        <div class="compose-queue-stack-actions" role="group" aria-label="Queued follow-up controls">
                            ${_.length>1&&F`
                                <button
                                    class="compose-queue-stack-move-btn"
                                    data-action="move-up"
                                    type="button"
                                    title="Move up"
                                    aria-label="Move up in queue"
                                    disabled=${!Q}
                                    onClick=${()=>Q&&G?.(L,L-1)}
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
                                    disabled=${!K}
                                    onClick=${()=>K&&G?.(L,L+1)}
                                >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                            `}
                            ${B&&F`
                                <button
                                    class="compose-queue-stack-move-btn queue-edit"
                                    data-action="edit"
                                    type="button"
                                    title="Edit in compose"
                                    aria-label="Return queued message to editor"
                                    onClick=${(N)=>{N.stopPropagation(),Z?.(Y)}}
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
                                onClick=${()=>$?.(Y)}
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
                                onClick=${()=>j?.(Y)}
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
    `}function RL({onPost:_,onFocus:$,searchMode:j,searchScope:G="current",onSearch:Z,onSearchScopeChange:X,onEnterSearch:Y,onExitSearch:L,fileRefs:V=[],onRemoveFileRef:q,onClearFileRefs:Q,folderRefs:K=[],onRemoveFolderRef:B,onClearFolderRefs:N,messageRefs:U=[],onRemoveMessageRef:D,onClearMessageRefs:H,activeModel:E=null,agentModelsPayload:k=null,modelUsage:z=null,thinkingLevel:O=null,supportsThinking:I=!1,contextUsage:x=null,onContextCompact:A,notificationsEnabled:y=!1,notificationPermission:W="default",onToggleNotifications:M,onModelChange:T,onModelStateChange:J,activeEditorPath:C=null,onAttachEditorFile:P,onOpenFilePill:b,followupQueueItems:m=[],onInjectQueuedFollowup:h,onRemoveQueuedFollowup:_0,onMoveQueuedFollowup:v,onSubmitIntercept:e,onMessageResponse:W0,isAgentActive:G0=!1,activeChatAgents:$0=[],currentChatJid:L0="web:default",connectionStatus:B0="connected",stateAccessFailed:t=!1,onSetFileRefs:V0,onSetFolderRefs:K0,onSetMessageRefs:k0,onSubmitError:s,onSwitchChat:X0,onRenameSession:D0,isRenameSessionInProgress:C0=!1,onCreateSession:g0,onCreateRootSession:p0,onDeleteSession:j_,onPurgeArchivedSession:m0,onRestoreSession:d0,showQueueStack:u0=!0,statusNotice:o0=null,extensionWorkingState:v0=null,prefillRequest:a0=null}){let[n0,N_]=f(""),[t0,b0]=f(""),[A0,L_]=f(!1),[e0,z_]=f(!1),[E0,R0]=f("or"),[T0,i0]=f([]),[A_,q_]=f(!1),[H_,E_]=f([]),[y_,C_]=f(0),[u_,D_]=f(!1),j0=g(null),[O0,n]=f([]),[i,o]=f(0),[Z0,q0]=f(!1),[J0,c0]=f(!1),[S0,I0]=f(!1),[w0,l0]=f(!1),[U0,h0]=f([]),[Y_,G_]=f(0),[f0,W_]=f(0),[B_,d]=f(!1),[z0,Z_]=f(!1),[K_,n_]=f(0),[F1,g_]=f(null),[J1,f_]=f(null),[M_,A1]=f(()=>x9()),[O_,k_]=f({kind:"idle",title:"",detail:""}),[U1,m_]=f(()=>Date.now()),[p_,s_]=f(0),U_=g(null),x1=g(null),E1=g(null),g1=g(null),k1=g(null),e1=g(null),c4=g(null),A$=g(null),t_=g({value:"",updatedAt:0}),c_=g(null),y1=g(""),H1=g(""),_1=g(""),k$=g(""),y$=g(!1),_$=g(!1),w_=g(!1),q1=g(0),M$=g(!1),l4=200,$$=zO(L0),h4=(w)=>{let c=new Set,p=[];for(let N0 of w||[]){if(typeof N0!=="string")continue;let P0=N0.trim();if(!P0||c.has(P0))continue;c.add(P0),p.push(P0)}return p},n4=(w=$$)=>{let c=O1(w);if(!c)return[];try{let p=JSON.parse(c);if(!Array.isArray(p))return[];return h4(p)}catch{return[]}},w$=(w,c=$$)=>{V_(c,JSON.stringify(w))},T$=g(n4($$)),b1=g(-1),v1=g(""),r4=g("");u(()=>{T$.current=n4($$),b1.current=-1,v1.current=""},[$$]),u(()=>{if(!j)return;fetch("/agent/settings-data").then((w)=>w.json()).then((w)=>{if(w?.searchMatchMode)R0(w.searchMatchMode)}).catch(()=>{})},[j]),u(()=>{let w=!1;return fetch(`/agent/commands?chat_jid=${encodeURIComponent(L0||"web:default")}`).then((p)=>p.ok?p.json():null).then((p)=>{if(w||!p?.commands)return;j0.current=p.commands.map((N0)=>({name:N0.name,description:N0.description||""}))}).catch((p)=>{console.debug("[compose] failed to fetch dynamic commands",p)}),()=>{w=!0}},[L0]),u(()=>{let w=OO(a0,r4.current,j);if(!w.shouldApply)return;r4.current=w.nextToken,g_(null),N_(w.text),H0(w.text),r_(w.text),requestAnimationFrame(()=>{x0();let c=U_.current;if(!c)return;try{c.focus({preventScroll:!0})}catch{c.focus()}let p=w.text.length;c.setSelectionRange?.(p,p)})},[a0,j]),u(()=>{A1(x9())},[]);let V1=n0.trim()||T0.length>0||V.length>0||K.length>0||U.length>0,R_=O_.kind!=="idle",p4=O_.kind==="requesting_permission"||O_.kind==="listening",I1=!j&&Boolean(M_?.showButton),x$=O_.kind==="requesting_permission"||O_.kind==="listening",d4=x$?"Stop voice input":M_?.title||"Voice input",g2=typeof window<"u"&&typeof navigator<"u"&&Boolean(navigator.geolocation)&&Boolean(window.isSecureContext),b2=typeof window<"u"&&typeof Notification<"u",X4=typeof window<"u"?Boolean(window.isSecureContext):!1,i4=b2&&X4&&W!=="denied",o4=W==="granted"&&y,K1=W$(o0),C$=P6(o0),Y4=typeof o0?.detail==="string"&&o0.detail.trim()?o0.detail.trim():"",L4=K1?D5(o0,U1):null,m1=xO(v0,p_),D1=v0?.indicator&&typeof v0.indicator==="object"?v0.indicator:null,v2=o4?"Disable notifications":"Enable notifications",q4=T0.length>0||V.length>0||K.length>0||U.length>0,j$=w9(t?B0:"connected"),e_=j$.label,f$=j$.title,s4=yO(G0,V1,K1),G$=wO(G0,K1),b5=(Array.isArray($0)?$0:[]).filter((w)=>!w?.archived_at),b_=(()=>{for(let w of Array.isArray($0)?$0:[]){let c=typeof w?.chat_jid==="string"?w.chat_jid.trim():"";if(c&&c===L0)return w}return null})(),d8=Boolean(b_&&b_.chat_jid===(b_.root_chat_jid||b_.chat_jid)),i8=Boolean(d8&&(b_?.chat_jid||L0)==="web:default"),C1=(()=>{let w=typeof b_?.parent_branch_id==="string"?b_.parent_branch_id.trim():"",c=typeof b_?.branch_id==="string"?b_.branch_id.trim():"";if(!b_||!w||!c||b_.archived_at)return null;if((Array.isArray($0)?$0:[]).filter((P0)=>{let F_=typeof P0?.parent_branch_id==="string"?P0.parent_branch_id.trim():"";return F_&&F_===c}).length>0)return null;return(Array.isArray($0)?$0:[]).find((P0)=>{let F_=typeof P0?.branch_id==="string"?P0.branch_id.trim():"";return F_&&F_===w&&!P0?.archived_at})||null})(),V4=Y0(()=>JO($0,L0),[$0,L0]),P$=V4.length>0,R$=P$&&typeof X0==="function",S$=P$&&typeof d0==="function",a4=Boolean(C0||M$.current),Z$=!j&&typeof D0==="function"&&!a4,X$=!j&&typeof g0==="function",K4=!j&&typeof p0==="function",Q4=!j&&!G0&&!z0&&Boolean(C1?.chat_jid),Y$=!j&&typeof j_==="function"&&!i8,v5=!j&&typeof m0==="function",L$=!j&&(R$||S$||Z$||X$||K4||Q4||Y$||v5),m5=SO(E,k),m2=m5.showPicker,c2=m5.label,l2=I&&O?` (${O})`:"",o8=l2.trim()?`${O}`:"",S=uO(E,k),l=typeof z?.hint_short==="string"?z.hint_short.trim():"",r=[o8||null,S?.label||null,l||null].filter(Boolean).join(" • "),a=[E?`Current model: ${c2}${l2}`:null,S?.title||null,z?.plan?`Plan: ${z.plan}`:null,l||null,z?.primary?.reset_description||null,z?.secondary?.reset_description||null].filter(Boolean),F0=J0?"Switching model…":a.join(" • ")||(m2?"Select a model (tap to open model picker)":`Current model: ${c2}${l2} (tap to open model picker)`),Q0=!j&&(m2||x&&x.percent!=null),y0=(w)=>{if(!w||typeof w!=="object")return;let c=w.model??w.current;if(typeof J==="function")J({...w,model:c??null,thinking_level:w.thinking_level??null,thinking_level_label:w.thinking_level_label??null,supports_thinking:w.supports_thinking,provider_usage:w.provider_usage??null});if(c&&typeof T==="function")T(c)},x0=(w)=>{let c=w||U_.current;if(!c)return;c.style.height="auto",c.style.height=`${c.scrollHeight}px`,c.style.overflowY="hidden"},H0=(w)=>{if(!w.startsWith("/")||w.includes(`
`)){D_(!1),E_([]);return}let c=w.toLowerCase().split(" ")[0];if(c.length<1){D_(!1),E_([]);return}let N0=(j0.current||WO).filter((P0)=>P0.name.startsWith(c)||P0.name.replace(/-/g,"").startsWith(c.replace(/-/g,"")));if(N0.length>0&&!(N0.length===1&&N0[0].name===c))q0(!1),n([]),E_(N0),C_(0),D_(!0);else D_(!1),E_([])},s0=(w)=>{let c=n0,p=c.indexOf(" "),N0=p>=0?c.slice(p):"",P0=w.name+N0;N_(P0),D_(!1),E_([]),requestAnimationFrame(()=>{let F_=U_.current;if(!F_)return;let i_=P0.length;F_.selectionStart=i_,F_.selectionEnd=i_,F_.focus()})},r_=(w)=>{if(k9(w,{searchMode:j,showSessionSwitcherButton:L$})){q0(!1),n([]);return}if(J9(w)==null){q0(!1),n([]);return}let c=HL(b5,w,{currentChatJid:L0});if(c.length>0&&!(c.length===1&&A9(c[0].agent_name).trim().toLowerCase()===String(w||"").trim().toLowerCase()))D_(!1),E_([]),n(c),o(0),q0(!0);else q0(!1),n([])},$1=(w)=>{let c=A9(w?.agent_name);if(!c)return;N_(c),q0(!1),n([]),requestAnimationFrame(()=>{let p=U_.current;if(!p)return;let N0=c.length;p.selectionStart=N0,p.selectionEnd=N0,p.focus()})},q$=()=>{if(j||!R$&&!S$&&!Z$&&!X$&&!Y$)return!1;return t_.current={value:"",updatedAt:0},I0(!1),D_(!1),E_([]),q0(!1),n([]),l0(!0),!0},uj=(w)=>{if(w?.preventDefault?.(),w?.stopPropagation?.(),j||!R$&&!S$&&!Z$&&!X$&&!Y$)return;if(w0){t_.current={value:"",updatedAt:0},l0(!1);return}q$()},gj=(w)=>{let c=typeof w==="string"?w.trim():"";if(l0(!1),!c||c===L0){requestAnimationFrame(()=>U_.current?.focus());return}X0?.(c)},bj=async(w)=>{let c=typeof w==="string"?w.trim():"";if(l0(!1),!c||typeof d0!=="function"){requestAnimationFrame(()=>U_.current?.focus());return}try{await d0(c)}catch(p){console.warn("Failed to restore session:",p),requestAnimationFrame(()=>U_.current?.focus())}},d_=Y0(()=>{let w=[];for(let c of V4){let p=Boolean(c?.archived_at),N0=typeof c?.agent_name==="string"?c.agent_name.trim():"",P0=typeof c?.chat_jid==="string"?c.chat_jid.trim():"";if(!N0||!P0)continue;w.push({type:"session",key:`session:${P0}`,label:`@${N0} — ${P0}${c?.is_active?" active":""}${p?" archived":""}`,chat:c,disabled:p?!S$:!R$})}if(X$)w.push({type:"action",key:"action:new",label:"New branch",action:"new",disabled:!1});if(K4)w.push({type:"action",key:"action:new-root",label:"New root session…",action:"new-root",disabled:!1});if(C1?.chat_jid)w.push({type:"action",key:"action:rollup",label:"Merge current w/ parent",action:"rollup",disabled:!Q4});if(Z$)w.push({type:"action",key:"action:rename",label:"Rename current session",action:"rename",disabled:a4});if(Y$)w.push({type:"action",key:"action:delete",label:"Delete current session",action:"delete",disabled:!1});return w},[V4,S$,R$,X$,K4,C1,Q4,Z$,Y$,a4]),vj=async(w)=>{if(w?.preventDefault)w.preventDefault();if(w?.stopPropagation)w.stopPropagation();if(typeof D0!=="function"||C0||M$.current)return;M$.current=!0,l0(!1);try{await D0()}catch(c){console.warn("Failed to rename session:",c)}finally{M$.current=!1}requestAnimationFrame(()=>U_.current?.focus())},mj=async()=>{if(typeof g0!=="function")return;l0(!1);try{await g0()}catch(w){console.warn("Failed to create session:",w)}requestAnimationFrame(()=>U_.current?.focus())},cj=async()=>{if(typeof p0!=="function")return;l0(!1);let w=typeof window<"u"?window.prompt("New root session handle (for example: ops)"):"",c=String(w||"").trim();if(!c){requestAnimationFrame(()=>U_.current?.focus());return}try{await p0(c)}catch(p){console.warn("Failed to create root session:",p)}requestAnimationFrame(()=>U_.current?.focus())},lj=async()=>{let w=typeof C1?.chat_jid==="string"?C1.chat_jid.trim():"";if(!w||z0||G0)return;l0(!1),g_(null),f_(null),Z_(!0);try{let c=await z1("default","/rollup",null,[],null,L0);W0?.(c),_?.(c);let p=c?.command;if(p?.status==="error"){let P0=p?.message||"Failed to merge current session with parent.";g_(P0),s?.(P0);return}let N0=typeof p?.rolled_up_to==="string"&&p.rolled_up_to.trim()?p.rolled_up_to.trim():w;X0?.(N0)}catch(c){let p=c?.message||"Failed to merge current session with parent.";g_(p),s?.(p),console.warn("Failed to merge session with parent:",c)}finally{Z_(!1)}requestAnimationFrame(()=>U_.current?.focus())},hj=async()=>{if(typeof j_!=="function")return;l0(!1);try{await j_(L0)}catch(w){console.warn("Failed to delete session:",w)}requestAnimationFrame(()=>U_.current?.focus())},u$=(w)=>{if(j)b0(w);else N_(w),H0(w),r_(w);requestAnimationFrame(()=>x0())},nB=(w)=>{let c=j?t0:n0,p=c&&!c.endsWith(`
`)?`
`:"",N0=`${c}${p}${w}`.trimStart();u$(N0)},s8=R(()=>{requestAnimationFrame(()=>{let w=U_.current;if(!w)return;try{w.focus({preventScroll:!0})}catch{w.focus()}})},[]),c1=R(()=>{k_({kind:"idle",title:"",detail:""})},[]),a8=R((w=H1.current,c=_1.current)=>{if(j)return;u$(AL(y1.current,w,c))},[j]),l1=R(()=>{y$.current=!0;let w=c_.current;if(!w){c1();return}try{w.stop()}catch{c_.current=null,c1()}},[c1]),t8=R(()=>{if(g_(null),f_(null),c_.current){l1();return}if(!M_?.showButton)return;if(M_.mode==="fallback"){s8(),k_({kind:"guidance",title:M_.title||"Use keyboard dictation",detail:M_.detail||"Use your keyboard dictation mic for voice input here."});return}if(!M_?.canStart||!M_?.recognitionCtor){k_({kind:"error",title:M_?.title||"Voice input unavailable",detail:M_?.detail||"This browser does not expose native speech recognition in this context."});return}try{let w=new M_.recognitionCtor;if(c_.current=w,y1.current=String(n0||""),H1.current="",_1.current="",k$.current="",y$.current=!1,w.lang=typeof navigator<"u"&&navigator.language?navigator.language:"en-US",w.interimResults=!0,w.continuous=!1,"maxAlternatives"in w)w.maxAlternatives=1;w.onstart=()=>{k_({kind:"listening",title:"Listening…",detail:"Speak now. Tap the mic again to stop."})},w.onresult=(c)=>{let{finalText:p,interimText:N0}=kL(c?.results,c?.resultIndex||0);if(p)H1.current=`${H1.current} ${p}`.trim();_1.current=N0,a8(),k_({kind:"listening",title:"Listening…",detail:N0?`Heard: ${N0}`:"Speak now. Tap the mic again to stop."})},w.onerror=(c)=>{let p=String(c?.error||"").trim();if(k$.current=p,c_.current=null,_1.current="",p==="aborted"){c1();return}k_({kind:"error",title:"Voice input failed",detail:I9(p,M_)})},w.onend=()=>{let c=k$.current,p=y$.current,N0=Boolean(H1.current.trim()||_1.current.trim());if(c_.current=null,y$.current=!1,k$.current="",_1.current.trim())H1.current=`${H1.current} ${_1.current}`.trim(),_1.current="";if(N0)a8(H1.current,"");if(c&&c!=="aborted")return;if(!N0&&!p){k_({kind:"error",title:"No speech detected",detail:I9("no-speech",M_)});return}c1()},k_({kind:"requesting_permission",title:"Starting voice input…",detail:"Allow microphone access if the browser asks."}),s8(),w.start()}catch(w){c_.current=null,k_({kind:"error",title:"Voice input failed",detail:w?.message||"Could not start native browser speech recognition."})}},[a8,c1,n0,s8,M_,l1]),rB=(w)=>{let c=w?.command?.model_label;if(c)return c;let p=w?.command?.message;if(typeof p==="string"){let N0=p.match(/•\s+([^\n]+?)\s+\(current\)/);if(N0?.[1])return N0[1].trim()}return null},nj=async(w)=>{if(j||J0)return;g_(null),f_(null),c0(!0);try{let c=await z1("default",w,null,[],null,L0),p=rB(c);return y0({model:p??E??null,thinking_level:c?.command?.thinking_level,thinking_level_label:c?.command?.thinking_level_label,supports_thinking:c?.command?.supports_thinking}),await T9(w4,L0,y0),f_(ML(w,c)),_?.(c),!0}catch(c){return console.error("Failed to switch model:",c),alert("Failed to switch model: "+c.message),!1}finally{c0(!1)}},pB=(w)=>{if(w.pointerType==="mouse")return;let c=U_.current?.value??(j?t0:n0);if(!wL(w,c,{searchMode:j,speechButtonVisible:I1,speechButtonActive:x$,canStartSpeech:Boolean(M_?.canStart&&M_?.recognitionCtor)}))return;w.preventDefault(),_$.current=!0,w_.current=!0,t8()},e8=(w)=>{if(!_$.current)return;if(w?.preventDefault?.(),_$.current=!1,c_.current)l1()},dB=(w)=>{if(w_.current){w_.current=!1,w.preventDefault();return}t8()},iB=async()=>{await nj("/cycle-model")},_3=async(w)=>{let c=typeof w==="string"?w:typeof w?.label==="string"?w.label:"";if(!c||J0)return;let p=TL(w,x);if(p.blocked){g_(null),f_(p.note);return}if(await nj(`/model ${c}`))I0(!1)},oB=(w)=>{if(!w||w.disabled)return;if(w.type==="session"){let c=w.chat;if(c?.archived_at)bj(c.chat_jid);else gj(c.chat_jid);return}if(w.type==="action"){if(w.action==="new"){mj();return}if(w.action==="new-root"){cj();return}if(w.action==="rollup"){lj();return}if(w.action==="rename"){vj();return}if(w.action==="delete")hj()}},sB=(w)=>{w.preventDefault(),w.stopPropagation(),t_.current={value:"",updatedAt:0},l0(!1),I0((c)=>!c)},aB=async()=>{if(j)return;A?.(),await t4("/compact",null,{includeMedia:!1,includeFileRefs:!1,includeFolderRefs:!1,includeMessageRefs:!1,clearAfterSubmit:!1,recordHistory:!1})},tB=(w)=>{if(w==="queue"||w==="steer"||w==="auto")return w;return G0?"queue":void 0},t4=async(w,c,p={})=>{let N0=typeof w==="string"?w:n0;if(/^\/settings\s*$/i.test(N0.trim())){N_(""),requestAnimationFrame(()=>x0()),o1();return}if(/^\/help\s*$/i.test(N0.trim())){N_(""),requestAnimationFrame(()=>x0()),o1({section:"keyboard"});return}let{includeMedia:P0=!0,includeFileRefs:F_=!0,includeFolderRefs:i_=!0,includeMessageRefs:l_=!0,clearAfterSubmit:f1=!0,recordHistory:M1=!0}=p||{},rj=typeof w==="string"?w:w&&typeof w?.target?.value==="string"?w.target.value:n0,pj=typeof rj==="string"?rj:"";if(!pj.trim()&&(P0?T0.length===0:!0)&&(F_?V.length===0:!0)&&(i_?K.length===0:!0)&&(l_?U.length===0:!0))return;if(c_.current)l1();c1(),D_(!1),E_([]),q0(!1),n([]),l0(!1),g_(null),f_(null);let c5=P0?[...T0]:[],l5=F_?[...V]:[],h5=i_?[...K]:[],n5=l_?[...U]:[],N4=pj.trim();if(M1&&N4){let B4=T$.current,Q1=h4(B4.filter((j3)=>j3!==N4));if(Q1.push(N4),Q1.length>200)Q1.splice(0,Q1.length-200);T$.current=Q1,w$(Q1),b1.current=-1,v1.current=""}let BF=()=>{if(P0)i0([...c5]);if(F_)V0?.(l5);if(i_)K0?.(h5);if(l_)k0?.(n5);N_(N4),requestAnimationFrame(()=>x0())};if(f1)N_(""),i0([]),Q?.(),N?.(),H?.();(async()=>{try{let B4=await e?.({content:N4,submitMode:c,fileRefs:l5,folderRefs:h5,messageRefs:n5,mediaFiles:c5});if(B4){_?.(B4);return}let Q1=[];for(let V$ of c5){let r5=await O7(V$);Q1.push(r5.id)}let j3=l5.length?`Files:
${l5.map((V$)=>`- ${V$}`).join(`
`)}`:"",FF=h5.length?`Folders:
${h5.map((V$)=>`- ${V$}`).join(`
`)}`:"",UF=n5.length?`Referenced messages:
${n5.map((V$)=>`- message:${V$}`).join(`
`)}`:"",EF=Q1.length?`Attachments:
${Q1.map((V$,r5)=>{let DF=c5[r5]?.name||`attachment-${r5+1}`;return`- attachment:${V$} (${DF})`}).join(`
`)}`:"",HF=[N4,j3,FF,UF,EF].filter(Boolean).join(`

`),g$=await z1("default",HF,null,Q1,tB(c),L0);if(W0?.(g$),g$?.command)y0({model:g$.command.model_label??E??null,thinking_level:g$.command.thinking_level,thinking_level_label:g$.command.thinking_level_label,supports_thinking:g$.command.supports_thinking}),await T9(w4,L0,y0);f_(ML(N4,g$)),_?.(g$)}catch(B4){if(f1)BF();let Q1=B4?.message||"Failed to send message.";g_(Q1),s?.(Q1),console.error("Failed to post:",B4)}})()},eB=(w)=>{h?.(w)},_F=R((w)=>{hO({queuedItem:w,onRemoveQueuedFollowup:_0,setSubmitError:g_,setSubmitNotice:f_,setMediaFiles:i0,onSetFileRefs:V0,onSetFolderRefs:K0,onSetMessageRefs:k0,setContent:N_,textareaRef:U_,resizeTextarea:x0})},[_0,V0,K0,k0,x0]),h2=R((w)=>{if(j||!S0&&!w0||w?.isComposing)return!1;let c=()=>{w.preventDefault?.(),w.stopPropagation?.()},p=()=>{t_.current={value:"",updatedAt:0}};if(w.key==="Escape"){if(c(),p(),S0)I0(!1);if(w0)l0(!1);return!0}if(S0){if(w.key==="ArrowDown"){if(c(),p(),U0.length>0)G_((N0)=>(N0+1)%U0.length);return!0}if(w.key==="ArrowUp"){if(c(),p(),U0.length>0)G_((N0)=>(N0-1+U0.length)%U0.length);return!0}if((w.key==="Enter"||w.key==="Tab")&&U0.length>0)return c(),p(),_3(U0[Math.max(0,Math.min(Y_,U0.length-1))]),!0;if(A5(w)&&U0.length>0){c();let N0=O9(t_.current,w.key);t_.current=N0;let P0=z9(U0,N0.value,Y_,(F_)=>RO(F_));if(P0>=0)G_(P0);return!0}}if(w0){if(w.key==="ArrowDown"){if(c(),p(),d_.length>0)W_((N0)=>(N0+1)%d_.length);return!0}if(w.key==="ArrowUp"){if(c(),p(),d_.length>0)W_((N0)=>(N0-1+d_.length)%d_.length);return!0}if((w.key==="Enter"||w.key==="Tab")&&d_.length>0)return c(),p(),oB(d_[Math.max(0,Math.min(f0,d_.length-1))]),!0;if(A5(w)&&d_.length>0){c();let N0=O9(t_.current,w.key);t_.current=N0;let P0=z9(d_,N0.value,f0,(F_)=>F_.label);if(P0>=0)W_(P0);return!0}}return!1},[j,S0,w0,U0,Y_,d_,f0,_3]),$F=(w)=>{if(w.isComposing)return;if(j&&w.key==="Escape"){w.preventDefault(),b0(""),L?.();return}if(h2(w))return;let c=U_.current?.value??(j?t0:n0);if(wL(w,c,{searchMode:j,speechButtonVisible:I1,speechButtonActive:x$,canStartSpeech:Boolean(M_?.canStart&&M_?.recognitionCtor)})){w.preventDefault(),_$.current=!0,t8();return}if(WL(w,c,{searchMode:j,showSessionSwitcherButton:L$})){w.preventDefault(),q$();return}if(Z0&&O0.length>0){let p=U_.current?.value??(j?t0:n0);if(!String(p||"").match(/^@([a-zA-Z0-9_-]*)$/))q0(!1),n([]);else{if(w.key==="ArrowDown"){w.preventDefault(),o((N0)=>(N0+1)%O0.length);return}if(w.key==="ArrowUp"){w.preventDefault(),o((N0)=>(N0-1+O0.length)%O0.length);return}if(w.key==="Tab"||w.key==="Enter"){w.preventDefault(),$1(O0[i]);return}if(w.key==="Escape"){w.preventDefault(),q0(!1),n([]);return}}}if(u_&&H_.length>0){let p=U_.current?.value??(j?t0:n0);if(!String(p||"").startsWith("/"))D_(!1),E_([]);else{if(w.key==="ArrowDown"){w.preventDefault(),C_((N0)=>(N0+1)%H_.length);return}if(w.key==="ArrowUp"){w.preventDefault(),C_((N0)=>(N0-1+H_.length)%H_.length);return}if(w.key==="Tab"){w.preventDefault(),s0(H_[y_]);return}if(w.key==="Enter"&&!w.shiftKey){if(!c.includes(" ")){w.preventDefault();let P0=H_[y_];D_(!1),E_([]),t4(P0.name);return}}if(w.key==="Escape"){w.preventDefault(),D_(!1),E_([]);return}}}if(!j&&(w.key==="ArrowUp"||w.key==="ArrowDown")&&!w.metaKey&&!w.ctrlKey&&!w.altKey&&!w.shiftKey){let p=U_.current;if(!p)return;let N0=p.value||"",P0=p.selectionStart===0&&p.selectionEnd===0,F_=p.selectionStart===N0.length&&p.selectionEnd===N0.length;if(w.key==="ArrowUp"&&P0||w.key==="ArrowDown"&&F_){let i_=T$.current;if(!i_.length)return;w.preventDefault();let l_=b1.current;if(w.key==="ArrowUp"){if(l_===-1)v1.current=N0,l_=i_.length-1;else if(l_>0)l_-=1;b1.current=l_,u$(i_[l_]||"")}else{if(l_===-1)return;if(l_<i_.length-1)l_+=1,b1.current=l_,u$(i_[l_]||"");else b1.current=-1,u$(v1.current||""),v1.current=""}requestAnimationFrame(()=>{let f1=U_.current;if(!f1)return;let M1=f1.value.length;f1.selectionStart=M1,f1.selectionEnd=M1});return}}if(w.key==="Enter"&&!w.shiftKey&&(w.ctrlKey||w.metaKey)){if(w.preventDefault(),j){if(c.trim())Z?.(c.trim(),G,{images:A0,attachments:e0})}else t4(c,"steer");return}if(w.key==="Enter"&&!w.shiftKey){if(w.preventDefault(),j){if(c.trim())Z?.(c.trim(),G,{images:A0,attachments:e0})}else t4(c);return}if(w.key==="Escape"){if(S0||w0||u_||Z0)return;w.preventDefault(),U_.current?.blur()}},jF=(w)=>{if(MO(w,_$.current)){if(w.preventDefault(),_$.current=!1,c_.current)l1()}},$3=(w)=>{let c=Array.from(w||[]).filter((p)=>p instanceof File&&!String(p.name||"").startsWith(".DS_Store"));if(!c.length)return;i0((p)=>[...p,...c]),g_(null)},GF=(w)=>{$3(w.target.files),w.target.value=""},ZF=(w)=>{if(j)return;w.preventDefault(),w.stopPropagation(),q1.current+=1,q_(!0)},XF=(w)=>{if(j)return;if(w.preventDefault(),w.stopPropagation(),q1.current=Math.max(0,q1.current-1),q1.current===0)q_(!1)},YF=(w)=>{if(j)return;if(w.preventDefault(),w.stopPropagation(),w.dataTransfer)w.dataTransfer.dropEffect="copy";q_(!0)},LF=(w)=>{if(j)return;w.preventDefault(),w.stopPropagation(),q1.current=0,q_(!1),$3(w.dataTransfer?.files||[])},qF=(w)=>{if(j)return;let c=w.clipboardData?.items;if(!c||!c.length)return;let p=[];for(let N0 of c){if(N0.kind!=="file")continue;let P0=N0.getAsFile?.();if(P0)p.push(P0)}if(p.length>0)w.preventDefault(),$3(p)},VF=(w)=>{i0((c)=>c.filter((p,N0)=>N0!==w))},KF=()=>{g_(null),i0([]),Q?.(),N?.(),H?.()},QF=()=>{if(!navigator.geolocation){alert("Geolocation is not available in this browser.");return}navigator.geolocation.getCurrentPosition((w)=>{let{latitude:c,longitude:p,accuracy:N0}=w.coords,P0=`${c.toFixed(5)}, ${p.toFixed(5)}`,F_=Number.isFinite(N0)?` ±${Math.round(N0)}m`:"",i_=`https://maps.google.com/?q=${c},${p}`,l_=`Location: ${P0}${F_} ${i_}`;nB(l_)},(w)=>{let c=w?.message||"Unable to retrieve location.";alert(`Location error: ${c}`)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})};u(()=>{if(!S0)return;t_.current={value:"",updatedAt:0},d(!0),w4(L0).then((w)=>{h0(CL(w)),y0(w)}).catch((w)=>{console.warn("Failed to load model list:",w),h0([])}).finally(()=>{d(!1)})},[S0,E]),u(()=>{if(j)I0(!1),l0(!1),D_(!1),E_([]),q0(!1),n([])},[j]),u(()=>{if(w0&&!L$)l0(!1)},[w0,L$]),u(()=>{if(!S0)return;let w=U0.findIndex((c)=>c?.label===E);G_(w>=0?w:0)},[S0,U0,E]),u(()=>{if(!w0)return;W_(kO(d_,L0)),t_.current={value:"",updatedAt:0}},[w0,L0,d_]),u(()=>{if(!S0)return;let w=(c)=>{let p=g1.current,N0=k1.current,P0=c.target;if(p&&p.contains(P0))return;if(N0&&N0.contains(P0))return;I0(!1)};return document.addEventListener("pointerdown",w),()=>document.removeEventListener("pointerdown",w)},[S0]),u(()=>{if(!w0)return;let w=(c)=>{let p=e1.current,N0=c4.current,P0=c.target;if(p&&p.contains(P0))return;if(N0&&N0.contains(P0))return;l0(!1)};return document.addEventListener("pointerdown",w),()=>document.removeEventListener("pointerdown",w)},[w0]),u(()=>{if(j||!S0&&!w0)return;let w=(c)=>{h2(c)};return document.addEventListener("keydown",w,!0),()=>document.removeEventListener("keydown",w,!0)},[j,S0,w0,h2]),u(()=>{if(!S0)return;let w=g1.current;w?.focus?.(),w?.querySelector?.(".compose-model-popup-item.active")?.scrollIntoView?.({block:"nearest"})},[S0,Y_,U0]),u(()=>{if(!w0)return;let w=e1.current;w?.focus?.(),w?.querySelector?.(".compose-model-popup-item.active")?.scrollIntoView?.({block:"nearest"})},[w0,f0,d_.length]),u(()=>{if(!Z0||!E1.current)return;E1.current.querySelector?.(".slash-item.active")?.scrollIntoView?.({block:"nearest"})},[Z0,i,O0.length]),u(()=>{if(!u_||!x1.current)return;x1.current.querySelector?.(".slash-item.active")?.scrollIntoView?.({block:"nearest"})},[u_,y_,H_.length]),u(()=>{let w=(p)=>{if(!p||typeof p!=="object")return!1;if(p.isContentEditable)return!0;if(typeof p.closest!=="function")return!1;return Boolean(p.closest('input, textarea, select, [contenteditable="true"], .compose-box, .compose-model-popup, .compose-session-popup, .settings-dialog, .workspace-sidebar, .editor-pane-container, .dock-panel, .timeline-menu-dropdown, .rename-branch-overlay, .agent-request-modal, .attachment-preview-modal, .vnc-pane-shell, .kanban-plugin, .mindmap-editor, .timeline-quick-actions'))},c=(p)=>{if(p.ctrlKey||p.metaKey||p.altKey)return;let N0=U_.current;if(!N0)return;let P0=document.activeElement===N0;if(p.key==="Escape"&&!P0&&!w(p.target)){p.preventDefault(),N0.focus();return}if(p.key==="/"&&!P0&&!w(p.target))p.preventDefault(),u$("/"),requestAnimationFrame(()=>{N0.focus(),N0.selectionStart=1,N0.selectionEnd=1,H0("/")})};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[]),u(()=>{let w=()=>{let F_=A$.current?.clientWidth||0;n_((i_)=>i_===F_?i_:F_)};w();let c=A$.current,p=0,N0=()=>{if(p)cancelAnimationFrame(p);p=requestAnimationFrame(()=>{p=0,w()})},P0=null;if(c&&typeof ResizeObserver<"u")P0=new ResizeObserver(()=>N0()),P0.observe(c);if(typeof window<"u")window.addEventListener("resize",N0);return()=>{if(p)cancelAnimationFrame(p);if(P0?.disconnect?.(),typeof window<"u")window.removeEventListener("resize",N0)}},[j,E,b_?.agent_name,L$,x?.percent]);let NF=(w)=>{let c=w.target.value;if(c_.current&&w?.isTrusted)l1();if(g_(null),f_(null),O_.kind==="guidance"||O_.kind==="error")c1();if(w0)l0(!1);if(x0(w.target),k9(c,{searchMode:j,showSessionSwitcherButton:L$})){u$(""),requestAnimationFrame(()=>{let p=U_.current;if(!p)return;p.value="",p.selectionStart=0,p.selectionEnd=0,p.focus()}),q$();return}u$(c)};return u(()=>{requestAnimationFrame(()=>x0())},[n0,t0,j]),u(()=>{if(!j)return;if(c_.current)l1();return},[j,l1]),u(()=>{if(c_.current)l1();c1()},[L0,c1,l1]),u(()=>{return()=>{if(!c_.current)return;try{c_.current.stop()}catch(w){console.debug("[compose] failed to stop speech recognition during cleanup",w)}c_.current=null}},[]),u(()=>{if(!K1)return;m_(Date.now());let w=setInterval(()=>m_(Date.now()),1000);return()=>clearInterval(w)},[K1,o0?.started_at,o0?.startedAt]),u(()=>{if(s_(0),D1?.mode!=="custom"||!Array.isArray(D1.frames)||D1.frames.length<=1)return;let w=typeof D1.intervalMs==="number"&&Number.isFinite(D1.intervalMs)&&D1.intervalMs>0?D1.intervalMs:120,c=setInterval(()=>{s_((p)=>(p+1)%D1.frames.length)},w);return()=>clearInterval(c)},[D1]),u(()=>{if(j)return;r_(n0)},[b5,L0,n0,j]),F`
        <div class="compose-box" data-testid="compose-box">
            ${R_&&F`
                <div class=${`compose-inline-status compose-speech-status compose-speech-status-${O_.kind}`} role="status" aria-live="polite">
                    <div class="compose-inline-status-row">
                        <span class=${_8({pulsing:p4})} aria-hidden="true"></span>
                        <span class="compose-inline-status-title">${O_.title}</span>
                    </div>
                    ${O_.detail&&F`<div class="compose-inline-status-detail">${O_.detail}</div>`}
                </div>
            `}
            ${u0&&!j&&F`
                <${f9}
                    items=${m}
                    onInjectQueuedFollowup=${eB}
                    onRemoveQueuedFollowup=${_0}
                    onMoveQueuedFollowup=${v}
                    onReturnQueuedFollowup=${_F}
                    onOpenFilePill=${b}
                />
            `}
            ${m1.visible&&F`
                <div class="compose-inline-status extension-working" role="status" aria-live="polite">
                    <div class="compose-inline-status-row">
                        ${m1.indicatorText?F`<span class="compose-inline-status-glyph" aria-hidden="true">${m1.indicatorText}</span>`:m1.animateDot?F`<span class=${_8({pulsing:!0})} aria-hidden="true"></span>`:null}
                        <span class="compose-inline-status-title">${m1.title}</span>
                    </div>
                </div>
            `}
            ${o0&&!K1&&F`
                <div
                    class="compose-inline-status"
                    role="status"
                    aria-live="polite"
                    title=${Y4||""}
                >
                    <div class="compose-inline-status-row">
                        <span class=${_8({pulsing:!1})} aria-hidden="true"></span>
                        <span class="compose-inline-status-title">${C$}</span>
                        ${L4&&F`<span class="compose-inline-status-elapsed">${L4}</span>`}
                    </div>
                    ${Y4&&F`<div class="compose-inline-status-detail">${Y4}</div>`}
                </div>
            `}
            ${J1&&F`
                <div class="compose-inline-status compose-command-notice" role="status" aria-live="polite">
                    <div class="compose-inline-status-detail compose-command-notice-text" dangerouslySetInnerHTML=${{__html:Z1(J1)}}></div>
                </div>
            `}
            <div
                class=${`compose-input-wrapper${A_?" drag-active":""}`}
                onDragEnter=${ZF}
                onDragOver=${YF}
                onDragLeave=${XF}
                onDrop=${LF}
            >
                ${L$&&F`
                    <div
                        ref=${c4}
                        class="compose-session-trigger-group compose-session-trigger-top"
                    >
                        <button
                            type="button"
                            class=${`compose-session-trigger compose-session-trigger-pill${w0?" active":""}`}
                            data-testid="session-switcher"
                            onClick=${uj}
                            title=${b_?.chat_jid||L0}
                            aria-label=${b_?.agent_name?`Manage sessions for @${b_.agent_name}`:"Manage Sessions/Agents"}
                            aria-expanded=${w0?"true":"false"}
                        >
                            <span class="compose-current-agent-label active">${b_?.agent_name?`@${b_.agent_name}`:"Sessions"}</span>
                        </button>
                    </div>
                `}
                <div class="compose-input-main">
                    ${q4&&F`
                        <div class="compose-file-refs">
                            ${U.map((w)=>{return F`
                                    <${L1}
                                        key=${"msg-"+w}
                                        prefix="compose"
                                        label=${"msg:"+w}
                                        title=${"Message reference: "+w}
                                        removeTitle="Remove reference"
                                        icon="message"
                                        onRemove=${()=>D?.(w)}
                                    />
                                `})}
                            ${V.map((w)=>{let c=w.split("/").pop()||w;return F`
                                    <${L1}
                                        prefix="compose"
                                        label=${c}
                                        title=${w}
                                        onClick=${()=>b?.(w)}
                                        removeTitle="Remove file"
                                        onRemove=${()=>q?.(w)}
                                    />
                                `})}
                            ${K.map((w)=>{let c=w.split("/").pop()||w;return F`
                                    <${L1}
                                        prefix="compose"
                                        label=${c}
                                        title=${w}
                                        icon="folder"
                                        onClick=${()=>b?.(w)}
                                        removeTitle="Remove folder hint"
                                        onRemove=${()=>B?.(w)}
                                    />
                                `})}
                            ${T0.map((w,c)=>{let p=w?.name||`attachment-${c+1}`;return F`
                                    <${L1}
                                        key=${p+c}
                                        prefix="compose"
                                        label=${p}
                                        title=${p}
                                        removeTitle="Remove attachment"
                                        onRemove=${()=>VF(c)}
                                    />
                                `})}
                            <button
                                type="button"
                                class="compose-clear-attachments-btn"
                                onClick=${KF}
                                title="Clear all attachments and references"
                                aria-label="Clear all attachments and references"
                            >
                                Clear all
                            </button>
                        </div>
                    `}
                    <textarea
                        ref=${U_}
                        data-testid="compose-input"
                        placeholder=${j?"Search (Enter to run)...":"Message (Enter to send, Shift+Enter for newline)..."}
                        value=${j?t0:n0}
                        onInput=${NF}
                        onKeyDown=${$F}
                        onKeyUp=${jF}
                        onPaste=${qF}
                        onFocus=${$}
                        onClick=${$}
                        rows="1"
                    />
                    ${Z0&&O0.length>0&&F`
                        <div class="slash-autocomplete" ref=${E1}>
                            ${O0.map((w,c)=>F`
                                <div
                                    key=${w.chat_jid||w.agent_name}
                                    class=${`slash-item${c===i?" active":""}`}
                                    onMouseDown=${(p)=>{p.preventDefault(),$1(w)}}
                                    onMouseEnter=${()=>o(c)}
                                >
                                    <span class="slash-name">@${w.agent_name}</span>
                                    <span class="slash-desc">${w.chat_jid||"Active agent"}</span>
                                </div>
                            `)}
                        </div>
                    `}
                    ${u_&&H_.length>0&&F`
                        <div class="slash-autocomplete" ref=${x1}>
                            ${H_.map((w,c)=>F`
                                <div
                                    key=${w.name}
                                    class=${`slash-item${c===y_?" active":""}`}
                                    onMouseDown=${(p)=>{p.preventDefault(),s0(w)}}
                                    onMouseEnter=${()=>C_(c)}
                                >
                                    <span class="slash-name">${w.name}</span>
                                    <span class="slash-desc">${w.description}</span>
                                </div>
                            `)}
                        </div>
                    `}
                    ${S0&&!j&&F`
                        <div class="compose-model-popup" ref=${g1} tabIndex="-1" onKeyDown=${h2}>
                            <div class="compose-model-popup-title">Select model</div>
                            <div class="compose-model-popup-menu" role="menu" aria-label="Model picker">
                                ${B_&&F`
                                    <div class="compose-model-popup-empty">Loading models…</div>
                                `}
                                ${!B_&&U0.length===0&&F`
                                    <div class="compose-model-popup-empty">No models available.</div>
                                `}
                                ${!B_&&U0.map((w,c)=>{let p=typeof w?.label==="string"?w.label:"",N0=C9(w?.contextWindow),P0=w?.name||null,F_=TL(w,x);return F`
                                        <button
                                            key=${p}
                                            type="button"
                                            role="menuitem"
                                            class=${`compose-model-popup-item compose-model-popup-model-item${Y_===c?" active":""}${E===p?" current-model":""}${F_.blocked?" context-blocked":""}`}
                                            onClick=${()=>{_3(w)}}
                                            disabled=${J0||F_.blocked}
                                            title=${[p,P0,N0,F_.title].filter(Boolean).join(" • ")}
                                        >
                                            <span class="compose-model-popup-model-stack">
                                                <span class="compose-model-popup-model-label">${fO(p,w?.contextWindow)}${P0?F` <span class="compose-model-popup-model-subtitle">${P0}</span>`:""}</span>
                                                ${F_.blocked&&F`<span class="compose-model-popup-model-note">${F_.note}</span>`}
                                            </span>
                                        </button>
                                    `})}
                            </div>
                            <div class="compose-model-popup-actions">
                                <button
                                    type="button"
                                    class="compose-model-popup-btn"
                                    onClick=${()=>{iB()}}
                                    disabled=${J0}
                                >
                                    Next model
                                </button>
                            </div>
                        </div>
                    `}
                    ${w0&&!j&&F`
                        <div class="compose-model-popup" data-testid="session-popup" ref=${e1} tabIndex="-1" onKeyDown=${h2}>
                            <div class="compose-model-popup-title">Manage sessions & agents</div>
                            <div class="compose-model-popup-menu" role="menu" aria-label="Sessions and agents">
                                ${!P$&&F`
                                    <div class="compose-model-popup-empty">No other sessions yet.</div>
                                `}
                                ${P$&&V4.map((w,c)=>{let p=Boolean(w.archived_at),N0=w.chat_jid===(w.root_chat_jid||w.chat_jid),P0=!N0&&!w.is_active&&!p&&typeof j_==="function",F_=p&&v5,i_=t6(w,{currentChatJid:L0});return F`
                                        <div key=${w.chat_jid} class=${`compose-model-popup-item-row${p?" archived":""}`}>
                                            <button
                                                type="button"
                                                role="menuitem"
                                                class=${`compose-model-popup-item session-item${p?" archived":""}${f0===c?" active":""}`}
                                                data-testid="session-item"
                                                onClick=${()=>{if(p){bj(w.chat_jid);return}gj(w.chat_jid)}}
                                                disabled=${p?!S$:!R$}
                                                title=${p?`Restore archived ${`@${w.agent_name}`}`:`Switch to ${`@${w.agent_name}`}`}
                                            >
                                                <span style=${AO(w)?"font-weight:700":""}>${i_}</span>
                                            </button>
                                            <button
                                                type="button"
                                                class="compose-model-popup-item-popout"
                                                title=${`Open @${w.agent_name} in new window`}
                                                aria-label=${`Open @${w.agent_name} in new window`}
                                                onClick=${(l_)=>{l_.stopPropagation(),l0(!1);let f1=new URL(window.location.href);f1.searchParams.set("chat_jid",w.chat_jid),f1.searchParams.set("chat_only","1");let M1=document.createElement("a");M1.href=f1.toString(),M1.target="_blank",M1.rel="noopener",M1.style.display="none",document.body.appendChild(M1),M1.click(),M1.remove()}}
                                            >
                                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M6 2h8v8"/>
                                                    <path d="M14 2 7 9"/>
                                                    <path d="M12 9v5H2V4h5"/>
                                                </svg>
                                            </button>
                                            ${(P0||F_)&&F`
                                                <button
                                                    type="button"
                                                    class="compose-model-popup-item-delete"
                                                    title=${F_?N0?"Permanently delete this archived session":"Permanently delete this archived branch":"Delete this branch"}
                                                    aria-label=${F_?N0?`Permanently delete archived session @${w.agent_name}`:`Permanently delete archived branch @${w.agent_name}`:`Delete @${w.agent_name}`}
                                                    onClick=${(l_)=>{if(l_.stopPropagation(),l0(!1),F_){m0?.(w.chat_jid);return}j_(w.chat_jid)}}
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
                            ${(X$||K4||Z$||Y$)&&F`
                                <div class="compose-model-popup-actions">
                                    ${X$&&F`
                                        <button
                                            type="button"
                                            class=${`compose-model-popup-btn primary${d_.findIndex((w)=>w.key==="action:new")===f0?" active":""}`}
                                            onClick=${()=>{mj()}}
                                            title="Create a new branch from this chat"
                                        >
                                            New branch
                                        </button>
                                    `}
                                    ${K4&&F`
                                        <button
                                            type="button"
                                            class=${`compose-model-popup-btn${d_.findIndex((w)=>w.key==="action:new-root")===f0?" active":""}`}
                                            onClick=${()=>{cj()}}
                                            title="Create a clean root session such as web:ops"
                                        >
                                            New root…
                                        </button>
                                    `}
                                    ${C1?.chat_jid&&F`
                                        <button
                                            type="button"
                                            class=${`compose-model-popup-btn${d_.findIndex((w)=>w.key==="action:rollup")===f0?" active":""}`}
                                            onClick=${()=>{lj()}}
                                            title=${Q4?`Merge this branch into ${C1.agent_name?`@${C1.agent_name}`:C1.chat_jid}`:"This branch cannot be merged while active or while it has children"}
                                            disabled=${!Q4}
                                        >
                                            Merge current w/ parent
                                        </button>
                                    `}
                                    ${Z$&&F`
                                        <button
                                            type="button"
                                            class=${`compose-model-popup-btn${d_.findIndex((w)=>w.key==="action:rename")===f0?" active":""}`}
                                            onClick=${(w)=>{vj(w)}}
                                            title="Rename the current session"
                                            disabled=${a4}
                                        >
                                            Rename current…
                                        </button>
                                    `}
                                    ${Y$&&F`
                                        <button
                                            type="button"
                                            class=${`compose-model-popup-btn danger${d_.findIndex((w)=>w.key==="action:delete")===f0?" active":""}`}
                                            onClick=${()=>{hj()}}
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
                <div class="compose-footer" ref=${A$}>
                    ${j$.show&&F`
                        <span class="compose-connection-status connection-status ${j$.statusClass}" title=${f$}>
                            ${e_}
                        </span>
                    `}
                    ${Q0&&F`
                    <div class="compose-meta-row">
                        ${m2&&F`
                            <div class="compose-model-meta">
                                <button
                                    ref=${k1}
                                    type="button"
                                    class="compose-model-hint compose-model-hint-btn"
                                    title=${F0}
                                    aria-label="Open model picker"
                                    onClick=${sB}
                                    disabled=${J0}
                                >
                                    ${J0?"Switching…":c2}
                                </button>
                                <div class="compose-model-meta-subline">
                                    ${!J0&&r&&F`
                                        <span class="compose-model-usage-hint" title=${F0}>
                                            ${r}
                                        </span>
                                    `}
                                </div>
                            </div>
                        `}
                        ${!j&&x&&x.percent!=null&&F`
                            <${IO}
                                usage=${x}
                                onCompact=${aB}
                                compactionLabel=${K1?L4||"0:00":""}
                                compactionTitle=${K1?C$||"Smart compaction":""}
                            />
                        `}
                    </div>
                    `}
                    <div class="compose-actions ${j?"search-mode":""}">
                    ${j&&F`
                        <label class="compose-search-scope-wrap" title="Search scope">
                            <span class="compose-search-scope-label">Scope</span>
                            <select
                                class="compose-search-scope-select"
                                value=${G}
                                onChange=${(w)=>X?.(w.currentTarget.value)}
                            >
                                <option value="current">Current</option>
                                <option value="root">Branch family</option>
                                <option value="all">All chats</option>
                            </select>
                        </label>
                        <label class="compose-search-filter-wrap" title="Only show messages with images">
                            <input type="checkbox" checked=${A0} onChange=${()=>L_((w)=>!w)} />
                            <span class="compose-search-filter-label">Images</span>
                        </label>
                        <label class="compose-search-filter-wrap" title="Only show messages with attachments">
                            <input type="checkbox" checked=${e0} onChange=${()=>z_((w)=>!w)} />
                            <span class="compose-search-filter-label">Attachments</span>
                        </label>
                        <button
                            class=${`compose-search-match-toggle ${E0==="and"?"active":""}`}
                            onClick=${()=>{let w=E0==="or"?"and":"or";R0(w),fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({searchMatchMode:w})}).catch((c)=>{})}}
                            title=${E0==="or"?"Any keyword (OR) — click for all keywords (AND)":"All keywords (AND) — click for any keyword (OR)"}
                            type="button"
                        >
                            ${E0==="or"?"OR":"AND"}
                        </button>
                    `}
                    <button
                        class="icon-btn search-toggle"
                        onClick=${j?L:Y}
                        title=${j?"Close search":"Search"}
                    >
                        ${j?F`
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        `:F`
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="M21 21l-4.35-4.35"/>
                            </svg>
                        `}
                    </button>
                    ${g2&&!j&&F`
                        <button
                            class="icon-btn location-btn"
                            onClick=${QF}
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
                    ${I1&&F`
                        <button
                            class=${`icon-btn voice-input-btn${x$?" active":""}${M_.mode==="fallback"?" fallback":""}`}
                            onClick=${dB}
                            onPointerDown=${pB}
                            onPointerUp=${e8}
                            onPointerCancel=${e8}
                            onPointerLeave=${e8}
                            title=${d4}
                            aria-label=${d4}
                            type="button"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <path d="M12 19v3" />
                            </svg>
                        </button>
                    `}
                    ${i4&&!j&&F`
                        <button
                            class=${`icon-btn notification-btn${o4?" active":""}`}
                            onClick=${M}
                            title=${v2}
                            type="button"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>
                    `}
                    ${!j&&F`
                        ${C&&P&&F`
                            <button
                                class="icon-btn attach-editor-btn"
                                onClick=${P}
                                title=${`Attach open file: ${C}`}
                                type="button"
                                disabled=${V.includes(C)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                            </button>
                        `}
                        <label class="icon-btn" title="Attach file">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <input type="file" multiple hidden onChange=${GF} />
                        </label>
                    `}
                    ${!j&&F`
                        <div class="compose-send-stack">
                                <button 
                                    class=${s4.className}
                                    data-testid="send-button"
                                    type="button"
                                    onClick=${()=>{t4()}}
                                    disabled=${s4.disabled}
                                    title=${s4.title}
                                    aria-label=${s4.ariaLabel}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                                </button>
                                ${G$&&F`
                                    <button 
                                        class=${G$.className}
                                        data-testid="stop-button"
                                        type="button"
                                        onClick=${()=>{if(TO(G$.mode))t4("/abort","steer",{clearAfterSubmit:!1,includeMedia:!1,includeFileRefs:!1,includeFolderRefs:!1,includeMessageRefs:!1,recordHistory:!1})}}
                                        disabled=${G$.disabled}
                                        title=${G$.title}
                                        aria-label=${G$.ariaLabel}
                                    >
                                        ${G$.mode==="compacting"?F`
                                                <span class="compose-submit-spinner" aria-hidden="true">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <circle class="compose-submit-spinner-ring" cx="12" cy="12" r="10.5" stroke-width="2.25" stroke-linecap="round"></circle>
                                                        <rect class="compose-submit-spinner-stop" x="6" y="6" width="12" height="12" rx="0" fill="currentColor"></rect>
                                                    </svg>
                                                </span>
                                            `:F`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2.5"/></svg>`}
                                    </button>
                                `}
                        </div>
                    `}
                </div>
            </div>
        </div>
        </div>
    `}M0();function SL({kind:_="hidden",onSetupProvider:$,onDismiss:j}){if(_==="hidden")return null;let G=_==="provider-missing",Z=G?"Instance needs setup":"Instance is configured",X=G?"This instance is not yet configured. Open Settings and set up AI providers/models to start sending requests.":"This instance looks configured. Review or update provider and model settings in Settings.";return F`
    <section class=${`oobe-panel oobe-panel-${_}`} aria-label="Getting started">
      <div class="oobe-panel-copy">
        <div class="oobe-panel-eyebrow">Getting started</div>
        <h2 class="oobe-panel-title">${Z}</h2>
        <p class="oobe-panel-body">${X}</p>
      </div>
      <div class="oobe-panel-actions">
        <button type="button" class="oobe-panel-btn oobe-panel-btn-primary" onClick=${()=>$?.()}>
          Open Settings
        </button>
        <button type="button" class="oobe-panel-btn" onClick=${()=>j?.()}>
          ${G?"Dismiss":"Done"}
        </button>
      </div>
    </section>
  `}M0();function uL(_){let $=String(_||"").trim();if(!$.startsWith("/btw"))return null;let j=$.slice(4).trim();if(!j)return{type:"help"};if(j==="clear"||j==="close")return{type:"clear"};return{type:"ask",question:j}}function gL(_){return String(_||"").trim()||"web:default"}function bL(_){if(!_)return!1;let $=String(_.answer||"").trim();return _.status!=="running"&&Boolean($)}function vL(_){if(!_)return!1;return _.status!=="running"}function mL(_){let $=String(_?.question||"").trim(),j=String(_?.answer||"").trim();if(!$&&!j)return"";return["BTW side conversation",$?`Question: ${$}`:null,j?`Answer:
${j}`:null].filter(Boolean).join(`

`)}function cL({session:_,onClose:$,onInject:j,onRetry:G}){let Z=g(null),X=g(null),Y=_?.thinking?j5(_.thinking):"",L=_?.answer?Z1(_.answer,null):"";if(u(()=>{if(Z.current&&Y)H$(Z.current).catch((D)=>{console.debug("[btw-panel] Mermaid rendering failed for BTW thinking content.",D)})},[Y]),u(()=>{if(X.current&&L)H$(X.current).catch((D)=>{console.debug("[btw-panel] Mermaid rendering failed for BTW answer content.",D)})},[L]),!_)return null;let V=_.status==="running",q=Boolean(String(_.answer||"").trim()),Q=Boolean(String(_.thinking||"").trim()),K=bL(_),B=vL(_),N=!V&&q,U=V?"Thinking…":_.status==="error"?"Error":"Done";return F`
        <section class="btw-panel" aria-label="BTW side conversation">
            <div class="btw-panel-header">
                <div class="btw-panel-title-wrap">
                    <span class="btw-panel-title">Question</span>
                    <span class=${`btw-panel-status btw-panel-status-${_.status||"idle"}`}>${U}</span>
                </div>
                <button class="btw-panel-close" onClick=${()=>$?.()} title="Close BTW" aria-label="Close BTW">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                        <line x1="4" y1="4" x2="12" y2="12"/>
                        <line x1="12" y1="4" x2="4" y2="12"/>
                    </svg>
                </button>
            </div>

            ${_.question&&F`<div class="btw-block btw-question">${_.question}</div>`}
            ${_.error&&F`<div class="btw-block btw-error">${_.error}</div>`}
            ${Q&&F`
                <details class="btw-block btw-thinking" open=${V?!0:void 0}>
                    <summary>Thinking</summary>
                    <div
                        class="btw-thinking-body post-content"
                        ref=${Z}
                        dangerouslySetInnerHTML=${{__html:Y}}
                    ></div>
                </details>
            `}
            ${K&&F`
                <div class="btw-block btw-answer">
                    <div class="btw-answer-label">Answer</div>
                    <div
                        class="btw-answer-body post-content"
                        ref=${X}
                        dangerouslySetInnerHTML=${{__html:L}}
                    ></div>
                </div>
            `}

            ${B&&F`
                <div class="btw-panel-footer">
                    <div class="btw-panel-footer-left">
                        ${_.question&&F`
                            <button class="btw-btn btw-btn-secondary" onClick=${()=>G?.()}>
                                Retry
                            </button>
                        `}
                    </div>
                    <div class="btw-panel-footer-right">
                        <button class="btw-btn btw-btn-primary" onClick=${()=>j?.()} disabled=${!N}>
                            Inject into chat
                        </button>
                    </div>
                </div>
            `}
        </section>
    `}M0();function P9(_,$){try{if(_)_.name=$;return!0}catch(j){return!1}}function R9(_,$){try{return _?.contentWindow?.postMessage?.($,"*"),!0}catch(j){return!1}}function nO(_){let $=_?.artifact||{},j=$.kind||_?.kind||null;if(j!=="html"&&j!=="svg"&&j!=="session_tree")return null;if(j==="html"){let Z=typeof $.html==="string"?$.html:typeof _?.html==="string"?_.html:"";return Z?{kind:j,html:Z}:null}if(j==="svg"){let Z=typeof $.svg==="string"?$.svg:typeof _?.svg==="string"?_.svg:"";return Z?{kind:j,svg:Z}:null}let G=$.tree&&typeof $.tree==="object"?$.tree:_?.tree&&typeof _.tree==="object"?_.tree:null;return{kind:j,tree:G}}function rO(_){let $=_?.artifact&&typeof _.artifact==="object"?_.artifact:{},j=typeof $.svg==="string"?$.svg:typeof _?.svg==="string"?_.svg:"",G=typeof $.html==="string"?$.html:typeof _?.html==="string"?_.html:typeof _?.w==="string"?_.w:typeof _?.content==="string"?_.content:"",Z=$.tree&&typeof $.tree==="object"?$.tree:_?.tree&&typeof _.tree==="object"?_.tree:null,X=$.kind||_?.kind||null,Y=X==="session_tree"?"session_tree":X==="svg"||j?"svg":"html";if(Y==="session_tree")return{kind:Y,tree:Z};if(Y==="svg")return j?{kind:Y,svg:j}:{kind:Y};return G?{kind:Y,html:G}:{kind:Y}}function t$(_){return typeof _==="number"&&Number.isFinite(_)?_:null}function $_(_){return typeof _==="string"&&_.trim()?_.trim():null}function hL(_,$=!1){let G=(Array.isArray(_)?_:$?["interactive"]:[]).filter((Z)=>typeof Z==="string").map((Z)=>Z.trim().toLowerCase()).filter(Boolean);return Array.from(new Set(G))}var nL="__PICLAW_WIDGET_HOST__:";function lL(_){return JSON.stringify(_).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function S9(_,$){if(!_||_.type!=="generated_widget")return null;let j=nO(_);if(!j)return null;return{title:_.title||_.name||"Generated widget",subtitle:typeof _.subtitle==="string"?_.subtitle:"",description:_.description||_.subtitle||"",originPostId:Number.isFinite($?.id)?$.id:null,originChatJid:typeof $?.chat_jid==="string"?$.chat_jid:null,widgetId:_.widget_id||_.id||null,artifact:j,capabilities:hL(_.capabilities,_.interactive===!0),source:"timeline",status:"final"}}function rL(_){if(!_||typeof _!=="object")return null;let $=rO(_),j=$_(_?.widget_id)||$_(_?.widgetId)||$_(_?.tool_call_id)||$_(_?.toolCallId),G=$_(_?.tool_call_id)||$_(_?.toolCallId),Z=$_(_?.turn_id)||$_(_?.turnId),X=$_(_?.title)||$_(_?.name)||"Generated widget",Y=$_(_?.subtitle)||"",L=$_(_?.description)||Y,V=$_(_?.status),q=V==="loading"||V==="streaming"||V==="final"||V==="error"?V:"streaming";return{title:X,subtitle:Y,description:L,originPostId:t$(_?.origin_post_id)??t$(_?.originPostId),originChatJid:$_(_?.origin_chat_jid)||$_(_?.originChatJid)||$_(_?.chat_jid)||null,widgetId:j,artifact:$,capabilities:hL(_?.capabilities,!0),source:"live",status:q,turnId:Z,toolCallId:G,width:t$(_?.width),height:t$(_?.height),error:$_(_?.error)}}function pL(_){return S9(_,null)!==null}function B1(_){let $=$_(_?.toolCallId)||$_(_?.tool_call_id);if($)return $;let j=$_(_?.widgetId)||$_(_?.widget_id);if(j)return j;let G=t$(_?.originPostId)??t$(_?.origin_post_id);if(G!==null)return`post:${G}`;return null}function dL(_){let j=(_?.artifact||{}).kind||_?.kind||null,Z=(Array.isArray(_?.capabilities)?_.capabilities:[]).some((X)=>typeof X==="string"&&X.trim().toLowerCase()==="interactive");return j==="html"&&(_?.source==="live"||Z)}function iL(_){return dL(_)?"allow-downloads allow-scripts allow-same-origin allow-forms":"allow-downloads"}function G8(_){return{title:$_(_?.title)||"Generated widget",widgetId:$_(_?.widgetId)||$_(_?.widget_id),toolCallId:$_(_?.toolCallId)||$_(_?.tool_call_id),turnId:$_(_?.turnId)||$_(_?.turn_id),capabilities:Array.isArray(_?.capabilities)?_.capabilities:[],source:_?.source==="live"?"live":"timeline",status:$_(_?.status)||"final"}}function Z8(_){return{...G8(_),subtitle:$_(_?.subtitle)||"",description:$_(_?.description)||"",error:$_(_?.error)||null,width:t$(_?.width),height:t$(_?.height),runtimeState:_?.runtimeState&&typeof _.runtimeState==="object"?_.runtimeState:null}}function X8(_){return`${nL}${JSON.stringify(Z8(_))}`}function oL(_){if(typeof _==="string"&&_.trim())return _.trim();if(!_||typeof _!=="object")return null;let $=$_(_.text)||$_(_.content)||$_(_.message)||$_(_.prompt)||$_(_.value);if($)return $;let j=_.data;if(typeof j==="string"&&j.trim())return j.trim();if(j&&typeof j==="object"){let G=$_(j.text)||$_(j.content)||$_(j.message)||$_(j.prompt)||$_(j.value);if(G)return G}return null}function sL(_){if(!_||typeof _!=="object")return!1;return _.close===!0||_.dismiss===!0||_.closeAfterSubmit===!0}function aL(_){let $=$_(_?.status);if($==="loading"||$==="streaming")return"Widget is loading…";if($==="error")return $_(_?.error)||"Widget failed to load.";if((_?.artifact?.kind||_?.kind)==="session_tree")return"Session tree widget is unavailable.";return"Widget artifact is missing or unsupported."}function pO(_){let $=G8(_);return`<script>
(function () {
  const meta = ${lL($)};
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

  const windowNamePrefix = ${lL(nL)};
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
</script>`}function tL(_){let $=_?.artifact||{},j=$.kind||_?.kind||null,G=typeof $.html==="string"?$.html:typeof _?.html==="string"?_.html:"",Z=typeof $.svg==="string"?$.svg:typeof _?.svg==="string"?_.svg:"",X=typeof _?.title==="string"&&_.title.trim()?_.title.trim():"Generated widget",Y=j==="svg"?Z:G;if(!Y)return"";let L=dL(_),V=["default-src 'none'","img-src data: blob: https: http:","style-src 'unsafe-inline'","font-src 'self' data: https: http:","media-src data: blob: https: http:","connect-src 'none'","frame-src 'none'",L?"script-src 'unsafe-inline' 'self'":"script-src 'none'","object-src 'none'","base-uri 'none'","form-action 'none'"].join("; "),q=j==="svg"?`<div class="widget-svg-shell">${Y}</div>`:Y,Q=L?pO(_):"";return`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="Content-Security-Policy" content="${V}" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${X.replace(/[<&>]/g,"")}</title>
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
${Q}
</head>
<body>${q}</body>
</html>`}M0();function dO(_){let $=new Map,j=[];for(let Y of _||[])$.set(Y.id,{...Y,children:[],depth:0});for(let Y of _||[]){let L=$.get(Y.id);if(!L)continue;let V=Y.parentId?$.get(Y.parentId):null;if(V)V.children.push(L);else j.push(L)}let G=new Set;for(let[,Y]of $){if(Y.role!=="assistant"||!Y.toolName)continue;if(Y.children.length!==1)continue;let L=Y.children[0];if(L.role!=="toolResult")continue;Y.resultDetail=L.detail||null,Y.resultLength=L.contentLength||0,Y.resultId=L.id,Y.merged=!0,Y.children=L.children;for(let V of Y.children)V.parentId=Y.id;G.add(L.id)}let Z=j.filter((Y)=>!G.has(Y.id)),X=[];for(let Y=Z.length-1;Y>=0;Y--)Z[Y].depth=0,X.push(Z[Y]);while(X.length>0){let Y=X.pop(),L=Y.children.length>1;for(let V=Y.children.length-1;V>=0;V--)Y.children[V].depth=L?Y.depth+1:Y.depth,X.push(Y.children[V])}return Z}function iO(_){let $=[],j=[];for(let G=_.length-1;G>=0;G--)j.push(_[G]);while(j.length>0){let G=j.pop();$.push(G);for(let Z=G.children.length-1;Z>=0;Z--)j.push(G.children[Z])}return $}function eL(_){if(!_||_<=0)return"";if(_<1000)return`${_}`;if(_<1e6)return`${(_/1000).toFixed(1)}k`;return`${(_/1e6).toFixed(1)}M`}function y2(_){if(!_||_<=0)return"";if(_<1000)return`${_} chars`;if(_<1e6)return`${(_/1000).toFixed(1)}k chars`;return`${(_/1e6).toFixed(1)}M chars`}function oO(_){let $=_.type;if($==="model_change")return{tag:"model",tagClass:"system",text:`${_.preview?.replace("[model ","").replace("]","")||""}`};if($==="thinking_level_change")return{tag:"thinking",tagClass:"system",text:_.preview?.replace("[thinking ","").replace("]","")||""};if($==="compaction")return{tag:"compaction",tagClass:"system",text:_.preview?.replace("[compaction: ","").replace("]","")||""};if($==="label")return{tag:"label",tagClass:"system",text:_.preview?.replace("[label ","").replace("]","")||""};if($==="session_info")return{tag:"session",tagClass:"system",text:_.preview?.replace("[session name ","").replace("]","")||""};if($==="branch_summary")return{tag:"summary",tagClass:"system",text:_.preview||""};if($!=="message")return{tag:$||"?",tagClass:"system",text:_.preview||""};let j=_.role||"message";if(_.merged&&_.toolName){let Z=(_.toolInput||"").split(`
`)[0],X=Z.length>120?Z.slice(0,119)+"…":Z;return{tag:_.toolName,tagClass:"tool",text:X||""}}if(j==="assistant"&&_.toolName){let Z=(_.toolInput||"").split(`
`)[0],X=Z.length>120?Z.slice(0,119)+"…":Z;return{tag:_.toolName,tagClass:"tool",text:X||"…"}}if(j==="toolResult"){let Z=(_.detail||"").split(`
`)[0],X=Z.length>120?Z.slice(0,119)+"…":Z;return{tag:`→ ${_.toolName||"result"}`,tagClass:"result",text:X}}if(j==="user"){let X=(_.previewText||_.detail||_.preview||"").replace(/^user:\s*"?/,"").replace(/"?\s*$/,"").split(`
`)[0];return{tag:"user",tagClass:"user",text:X.length>120?X.slice(0,119)+"…":X}}if(j==="assistant"){let X=(_.detail||_.preview||"").replace(/^assistant:\s*"?/,"").replace(/"?\s*$/,"").split(`
`)[0];return{tag:"assistant",tagClass:"assistant",text:X.length>120?X.slice(0,119)+"…":X}}return{tag:j,tagClass:"other",text:_.preview||""}}function sO(_,$=!1){let j=typeof _==="string"?_.trim():"";if(!j)return null;return{text:$?`/tree ${j} --summarize`:`/tree ${j}`,navigateTargetId:j,summarize:Boolean($)}}function _q(_){let $=typeof _==="string"?_.trim():"";if(!$.startsWith("/tree"))return null;let j=$.split(/\s+/).filter(Boolean);if(j[0]!=="/tree")return null;let G=null,Z=!1;for(let X=1;X<j.length;X++){let Y=j[X];if(Y==="--summarize"){Z=!0;continue}if(!G&&!Y.startsWith("--"))G=Y}return G?{targetId:G,summarize:Z}:null}function aO(_,$,j,G){let Z=Array.isArray(_)?_:[];if(Z.length===0)return null;let X=(L)=>typeof L==="string"&&Z.some((V)=>V?.id===L);if(X($))return $;if(X(j))return j;if(X(G))return G;let Y=Z.find((L)=>L?.active);if(Y?.id)return Y.id;return Z[0]?.id||null}function tO(_){if(!_||typeof _!=="object")return null;let $=typeof _.type==="string"?_.type:"",j=typeof _.preview==="string"?_.preview.trim():"",G=typeof _.error==="string"?_.error.trim():"",Z=_q(j),X=j||"tree command";if($==="submit_pending")return{tone:"pending",text:Z?`Sending ${X}`:"Sending tree command…",refreshDelays:[]};if($==="submit_sent")return{tone:"info",text:Z?`Running ${X}`:"Tree command sent.",refreshDelays:Z?[500,1500,3500,8000]:[]};if($==="submit_queued")return{tone:"info",text:Z?`Queued ${X}`:"Tree command queued.",refreshDelays:Z?[1200,3200,7000,12000]:[]};if($==="submit_failed")return{tone:"error",text:G?`Tree command failed: ${G}`:"Tree command failed.",refreshDelays:[]};if($==="refresh_building")return{tone:"pending",text:"Refreshing widget…",refreshDelays:[]};if($==="refresh_failed")return{tone:"error",text:G?`Refresh failed: ${G}`:"Refresh failed.",refreshDelays:[]};if($==="refresh_dashboard"||$==="refresh_ack")return{tone:"success",text:"Widget refreshed.",refreshDelays:[]};return null}function $q({widget:_,onWidgetEvent:$}){let j=_?.artifact?.tree&&typeof _.artifact.tree==="object"?_.artifact.tree:null,G=typeof _?.originChatJid==="string"&&_.originChatJid.trim()?_.originChatJid.trim():null,Z=_?.runtimeState&&typeof _.runtimeState==="object"?_.runtimeState:null,X=Z?.lastHostUpdate&&typeof Z.lastHostUpdate==="object"?Z.lastHostUpdate:null,[Y,L]=f(()=>({loading:!j,error:null,data:j})),[V,q]=f(()=>j?.leafId||null),[Q,K]=f(""),B=g(null),N=g(null),U=g(j?.leafId||null),D=g(null),H=g(""),E=async()=>{L((y)=>({...y,loading:!0,error:null}));try{let y=G?`?chat_jid=${encodeURIComponent(G)}`:"",W=await fetch(`/agent/session-tree${y}`,{method:"GET",credentials:"same-origin",headers:{Accept:"application/json"}}),M=await W.json().catch(()=>({}));if(!W.ok)throw Error(M?.error||`HTTP ${W.status}`);L({loading:!1,error:null,data:M})}catch(y){L((W)=>({loading:!1,error:y?.message||"Failed to load tree.",data:W?.data||j||null}))}};D.current=E,u(()=>{E()},[G]);let k=Y0(()=>{let y=Y.data;if(!y||!Array.isArray(y.nodes)||y.nodes.length===0)return[];return iO(y.flat?dO(y.nodes):y.nodes)},[Y.data]);u(()=>{let y=aO(k,V,U.current,Y.data?.leafId||null);if(y!==V)q(y);if(U.current&&Y.data?.leafId===U.current)U.current=null},[k,V,Y.data?.leafId]);let z=Y0(()=>{let y=(Q||"").trim().toLowerCase();if(!y)return k;return k.filter((W)=>{return[W.preview,W.toolInput,W.toolInputFull,W.detail,W.toolName,W.role,W.id,W.resultDetail,W.type,W.label].some((T)=>typeof T==="string"&&T.toLowerCase().includes(y))})},[k,Q]),O=Y0(()=>z.find((y)=>y.id===V)||null,[z,V]),I=Y0(()=>tO(X),[X?.type,X?.preview,X?.error,X?.submittedAt]);u(()=>{if(N.current)N.current.scrollIntoView({block:"center",behavior:"auto"})},[V,Y.data?.leafId,z.length]),u(()=>{let y=_q(X?.preview);if(y?.targetId)U.current=y.targetId;let W=I?.refreshDelays||[];if(!W.length)return;let M=[G||"",X?.type||"",X?.submittedAt||"",X?.preview||""].join("|");if(H.current===M)return;H.current=M;let T=W.map((J)=>setTimeout(()=>D.current?.(),J));return()=>T.forEach((J)=>clearTimeout(J))},[G,X?.type,X?.submittedAt,X?.preview,I?.refreshDelays]);let x=(y=!1)=>{let W=O?.id,M=sO(W,y);if(!M)return;U.current=M.navigateTargetId,$?.({kind:"widget.submit",payload:M},_)},A=I?.tone||"info";return F`
        <div class="session-tree-widget">
            <div class="session-tree-toolbar">
                <div class="session-tree-toolbar-left">
                    <button class="session-tree-btn" type="button" onClick=${()=>E()} disabled=${Y.loading}>${Y.loading?"Loading…":"Refresh"}</button>
                    <input ref=${B}
                        class="st-search-input" type="text" placeholder="Filter\u2026"
                        value=${Q}
                        onInput=${(y)=>K(y.currentTarget.value)}
                        onKeyDown=${(y)=>{if(y.key==="Escape")K(""),y.currentTarget.blur()}}
                    />
                    ${Q&&F`<span class="session-tree-meta">${z.length} match${z.length!==1?"es":""}</span>`}
                    ${Y.error&&F`<span class="session-tree-error-inline">${Y.error}</span>`}
                </div>
                <div class="session-tree-toolbar-right">
                    ${I?.text&&F`<span class=${`session-tree-host-update ${A}`}>${I.text}</span>`}
                    ${Y.data?.capped&&F`<span class="session-tree-meta">Showing ${Y.data?.nodes?.length||0} of ${Y.data?.total||0}</span>`}
                    ${G&&F`<span class="session-tree-meta">${G}</span>`}
                </div>
            </div>

            <div class="session-tree-content">
                <div class="session-tree-list" role="tree" aria-label="Session tree">
                    ${Y.loading&&z.length===0&&!Q&&F`<div class="session-tree-empty">Loading session tree\u2026</div>`}
                    ${!Y.loading&&z.length===0&&!Q&&F`<div class="session-tree-empty">Session tree is empty.</div>`}
                    ${!Y.loading&&z.length===0&&Q&&F`<div class="session-tree-empty">No entries match \u201c${Q}\u201d</div>`}
                    ${z.map((y)=>{let W=V===y.id,M=`st-row${y.active?" active":""}${W?" selected":""}`,T=(y.children||[]).length>1,J=oO(y);return F`
                            <button key=${y.id} ref=${y.active||W?N:null}
                                class=${M} type="button" role="treeitem" aria-selected=${W}
                                onClick=${()=>q(y.id)}>
                                <span class="st-indent" style=${`width:${(y.depth||0)*16+6}px`}></span>
                                <span class=${`st-dot${y.active?" active":T?" branch":""}`}></span>
                                <span class=${`st-tag ${J.tagClass}`}>${J.tag}</span>
                                <span class="st-text">${J.text}</span>
                                ${y.merged&&y.resultLength>0&&F`<span class="st-size">${eL(y.resultLength)}</span>`}
                                ${!y.merged&&y.contentLength>3000&&F`<span class="st-size">${eL(y.contentLength)}</span>`}
                                ${y.hasThinking&&F`<span class="st-badge thinking">\u{1F4AD}</span>`}
                                ${y.label&&F`<span class="st-label">${y.label}</span>`}
                                ${y.active&&F`<span class="st-active">\u25C0</span>`}
                            </button>
                        `})}
                </div>

                <aside class="session-tree-sidebar">
                    ${O?F`
                        <div class="st-side-section">
                            <div class="st-side-label">Entry</div>
                            <div class="st-side-mono">${O.id}${O.resultId?` → ${O.resultId}`:""}</div>
                        </div>
                        <div class="st-side-section">
                            <div class="st-side-label">Type</div>
                            <div class="st-side-value">${O.role||O.type||"entry"}${O.toolName?` → ${O.toolName}`:""}${O.merged?" (merged)":""}</div>
                        </div>
                        ${O.toolInputFull&&F`
                            <div class="st-side-section">
                                <div class="st-side-label">${O.toolName==="bash"?"Command":"Input"}</div>
                                <pre class="st-side-code">${O.toolInputFull}</pre>
                            </div>
                        `}
                        ${O.resultDetail&&F`
                            <div class="st-side-section">
                                <div class="st-side-label">Result${O.resultLength?` (${y2(O.resultLength)})`:""}</div>
                                <pre class="st-side-code">${O.resultDetail}</pre>
                            </div>
                        `}
                        ${O.detail&&!O.toolInput&&F`
                            <div class="st-side-section">
                                <div class="st-side-label">${O.role==="toolResult"?"Output":"Content"}${O.contentLength?` (${y2(O.contentLength)})`:""}</div>
                                <pre class="st-side-code">${O.detail}</pre>
                            </div>
                        `}
                        ${O.rawDetail&&F`
                            <div class="st-side-section">
                                <div class="st-side-label">Raw prompt${O.rawContentLength?` (${y2(O.rawContentLength)})`:""}</div>
                                <pre class="st-side-code">${O.rawDetail}</pre>
                            </div>
                        `}
                        ${O.timestamp&&F`
                            <div class="st-side-section">
                                <div class="st-side-label">Time</div>
                                <div class="st-side-value">${new Date(O.timestamp).toLocaleString()}</div>
                            </div>
                        `}
                        ${(O.contentLength>0||O.hasThinking)&&F`
                            <div class="st-side-section">
                                <div class="st-side-label">Size</div>
                                <div class="st-side-badges">
                                    ${O.contentLength>0&&F`<span class="st-pill">${y2(O.contentLength)} content</span>`}
                                    ${O.hasThinking&&F`<span class="st-pill thinking">${y2(O.thinkingLength)} thinking</span>`}
                                    ${O.merged&&O.resultLength>0&&F`<span class="st-pill">${y2(O.resultLength)} result</span>`}
                                </div>
                            </div>
                        `}
                        <div class="st-side-actions">
                            <button class="session-tree-btn primary" type="button" onClick=${()=>x(!1)}>Navigate here</button>
                            <button class="session-tree-btn" type="button" onClick=${()=>x(!0)}>Navigate + summarize</button>
                        </div>
                    `:F`<div class="session-tree-empty side">Select an entry to inspect.</div>`}
                </aside>
            </div>
        </div>
    `}function eO(_=!1){return`floating-widget-backdrop${_?" maximized":""}`}function _z(_=!1){return`floating-widget-pane${_?" maximized":""}`}function jq({widget:_,onClose:$,onWidgetEvent:j}){let G=g(null),Z=g(!1),[X,Y]=f(!1),L=B1(_),V=Y0(()=>tL(_),[_?.artifact?.kind,_?.artifact?.html,_?.artifact?.svg,_?.widgetId,_?.toolCallId,_?.turnId,_?.title]);if(u(()=>{Y(!1)},[L]),u(()=>{if(!_)return;let O=(I)=>{if(I.key!=="Escape")return;if(X){Y(!1);return}$?.()};return document.addEventListener("keydown",O),()=>document.removeEventListener("keydown",O)},[X,_,$]),u(()=>{Z.current=!1},[V]),u(()=>{if(!_)return;let O=G.current;if(!O)return;let I=(M)=>{let T=X8(_),J=M==="widget.init"?G8(_):Z8(_);P9(O,T),R9(O,{__piclawGeneratedWidgetHost:!0,type:M,widgetId:_?.widgetId||null,toolCallId:_?.toolCallId||null,turnId:_?.turnId||null,payload:J})},x=()=>{I("widget.init"),I("widget.update")},A=()=>{Z.current=!0,x()};O.addEventListener("load",A);let W=[0,40,120,300,800].map((M)=>setTimeout(x,M));return()=>{O.removeEventListener("load",A),W.forEach((M)=>clearTimeout(M))}},[V,_?.widgetId,_?.toolCallId,_?.turnId]),u(()=>{if(!_)return;let O=G.current;if(!O?.contentWindow)return;let I=X8(_),x=Z8(_);P9(O,I),R9(O,{__piclawGeneratedWidgetHost:!0,type:"widget.update",widgetId:_?.widgetId||null,toolCallId:_?.toolCallId||null,turnId:_?.turnId||null,payload:x});return},[_?.widgetId,_?.toolCallId,_?.turnId,_?.status,_?.subtitle,_?.description,_?.error,_?.width,_?.height,_?.runtimeState]),u(()=>{if(!_)return;let O=(I)=>{let x=I?.data;if(!x||x.__piclawGeneratedWidget!==!0)return;let A=G.current,y=B1(_),W=B1({widgetId:x.widgetId,toolCallId:x.toolCallId});if(W&&y&&W!==y)return;if(!W&&A?.contentWindow&&I.source!==A.contentWindow)return;j?.(x,_)};return window.addEventListener("message",O),()=>window.removeEventListener("message",O)},[_,j]),!_)return null;let Q=(_?.artifact||{}).kind||_?.kind||"html",K=typeof _?.title==="string"&&_.title.trim()?_.title.trim():"Generated widget",B=typeof _?.subtitle==="string"&&_.subtitle.trim()?_.subtitle.trim():"",N=_?.source==="live"?"live":"timeline",U=typeof _?.status==="string"&&_.status.trim()?_.status.trim():"final",D=N==="live"?`Live widget • ${U.toUpperCase()}`:_?.originPostId?`Message #${_.originPostId}`:"Timeline launch",H=typeof _?.description==="string"&&_.description.trim()?_.description.trim():"",E=!V,k=aL(_),z=iL(_);return F`
        <div class=${eO(X)} onClick=${()=>$?.()}>
            <section
                class=${_z(X)}
                aria-label=${K}
                onClick=${(O)=>O.stopPropagation()}
            >
                <div class="floating-widget-header">
                    <div class="floating-widget-heading">
                        <div class="floating-widget-eyebrow">${D} • ${Q.toUpperCase()}</div>
                        <div class="floating-widget-title">${K}</div>
                        ${(B||H)&&F`
                            <div class="floating-widget-subtitle">${B||H}</div>
                        `}
                    </div>
                    <div class="floating-widget-header-actions">
                        <button
                            class="floating-widget-action floating-widget-maximize"
                            type="button"
                            onClick=${()=>Y((O)=>!O)}
                            title=${X?"Exit zen mode":"Enter zen mode"}
                            aria-label=${X?"Exit zen mode":"Enter zen mode"}
                            aria-pressed=${X?"true":"false"}
                        >
                            ${X?"Restore":"Maximize"}
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
                    ${Q==="session_tree"?F`<${$q} widget=${_} onWidgetEvent=${j} />`:E?F`<div class="floating-widget-empty">${k}</div>`:F`
                                <iframe
                                    ref=${G}
                                    class="floating-widget-frame"
                                    title=${K}
                                    name=${X8(_)}
                                    sandbox=${z}
                                    allow="microphone; clipboard-read; clipboard-write"
                                    referrerpolicy="no-referrer"
                                    srcdoc=${V}
                                ></iframe>
                            `}
                </div>
            </section>
        </div>
    `}M0();S6();I_();O2();var $z=new Set,Gq=new Set,u9=new Set,P4=new Map,Zq=!1,Y8=null;function jz(_=typeof window<"u"?window:null){let $=typeof _?.__piclawCurrentChatJid==="string"?_.__piclawCurrentChatJid.trim():"";if($)return $;try{let j=_?.location?.href||"http://localhost/",G=new URL(j).searchParams.get("chat_jid")?.trim()||"";if(G)return G}catch(j){}return"web:default"}function Gz(_,$){let j=typeof _==="string"?_.trim():"";if(!j)return null;try{return new URL(j,$).href}catch{return null}}function Xq(_){if(!_||typeof _.id!=="string"||!_.id.trim())return!1;return X_.register(_),$z.add(_.id),!0}function Zz(_){return Xq(_)}function Xz(_){if(!_||typeof _.id!=="string"||!_.id.trim())return()=>{};return d$(_),Gq.add(_.id),o7(),()=>{aX(_.id),Gq.delete(_.id),o7()}}function Yz(_){if(typeof _!=="function")return()=>{};return u9.add(_),()=>{u9.delete(_)}}function Yq(_,$={}){let j=typeof _==="string"?_.trim():"";if(!j)return null;for(let G of[...u9].reverse())try{let Z=G(j,$);if(typeof Z==="string"&&Z.trim())return Z.trim()}catch(Z){console.warn("[addon-web] standalone tab URL resolver failed:",Z)}return null}function Lz(_){if(!_||typeof _.id!=="string"||!_.id.trim()||typeof _.match!=="function"||typeof _.buildFrameUrl!=="function")return()=>{};return P4.set(_.id,_),()=>{if(P4.get(_.id)===_)P4.delete(_.id)}}function L8(_,$){for(let j of Array.from(P4.values()).reverse())try{if(j.match(_,$))return j}catch(G){console.warn("[addon-web] attachment preview matcher failed:",G)}return null}function Lq(_){let $=typeof _==="string"?_.trim():"";if(!$)return null;return P4.get($)?.label||null}function qq(_){let $=typeof _==="string"?_.trim():"";if(!$)return null;return P4.get($)?.note||null}function Vq(_,$,j){let G=typeof _==="string"?_.trim():"";if(!G)return null;let Z=P4.get(G);if(!Z)return null;try{return Z.buildFrameUrl($,j)||null}catch(X){return console.warn("[addon-web] attachment preview URL builder failed:",X),null}}function qz(_=typeof window<"u"?window:null){return{registerPane:Zz,registerWorkspacePane:Xq,registerSettingsPane:Xz,registerStandaloneTabUrlResolver:Yz,registerAttachmentPreview:Lz,getCurrentChatJid:()=>jz(_)}}function g9(_=typeof window<"u"?window:null){let $=qz(_);if(!_||Zq)return $;return _.__piclaw_web=$,_.__piclaw_registerPane=$.registerPane,_.__piclaw_registerWorkspacePane=$.registerWorkspacePane,_.__piclaw_registerSettingsPane=$.registerSettingsPane,_.__piclaw_registerStandaloneTabUrlResolver=$.registerStandaloneTabUrlResolver,_.__piclaw_registerAttachmentPreview=$.registerAttachmentPreview,_.__piclawSettingsPaneRegistry={registerSettingsPane:$.registerSettingsPane,notifySettingsPanesChanged:()=>_?.dispatchEvent?.(new CustomEvent("piclaw:settings-panes-changed"))},Zq=!0,$}async function Kq(_=typeof window<"u"?window:null){if(!_)return;if(Y8)return Y8;return Y8=(async()=>{g9(_);try{let $=await fetch("/agent/addons/web-entries",{credentials:"same-origin"});if(!$.ok)return;let j=await $.json().catch(()=>null),G=Array.isArray(j?.entries)?j.entries:[],Z=_.location?.origin||"http://localhost";for(let X of G){let Y=Gz(X?.url,Z);if(!Y)continue;try{await import(Y)}catch(L){console.warn("[addon-web] Failed to load installed addon web entry:",Y,L)}}}catch($){console.warn("[addon-web] Failed to fetch installed addon web entries:",$)}})(),Y8}var Vz=["\t",",",";","|"];function Qq(_){return typeof _==="string"?_.trim().toLowerCase():""}function Nq(_){return typeof _==="string"?_.split(";")[0]?.trim().toLowerCase()||"":""}function Bq(_,$){let j=Nq(_),G=Qq($);return j==="text/csv"||j==="application/csv"||j==="text/tab-separated-values"||j==="text/tsv"||G.endsWith(".csv")||G.endsWith(".tsv")||G.endsWith(".tab")}function Fq(_,$){let j=Nq(_),G=Qq($);if(j==="text/tab-separated-values"||j==="text/tsv"||G.endsWith(".tsv")||G.endsWith(".tab"))return"\t";if(j==="text/csv"||j==="application/csv"||G.endsWith(".csv"))return",";return null}function Kz(_,$){let j=0,G=!1;for(let Z=0;Z<_.length;Z+=1){let X=_[Z];if(X==='"')if(G&&_[Z+1]==='"')Z+=1;else G=!G;else if(!G&&X===$)j+=1}return j}function Qz(_){let $=_.split(/\r?\n/).map((G)=>G.trimEnd()).filter((G)=>G.trim().length>0).slice(0,10),j={delimiter:"\t",score:-1};for(let G of Vz){let Z=$.map((V)=>Kz(V,G)).filter((V)=>V>0);if(!Z.length)continue;let X=Z.reduce((V,q)=>V+q,0)/Z.length,Y=Z.filter((V)=>Math.abs(V-X)<1).length/Z.length,L=X*Y*Z.length;if(L>j.score)j={delimiter:G,score:L}}return j.delimiter}function Nz(_,$,j){let G=[],Z=[],X="",Y=!1,L=!1,V=()=>{Z.push(X),X=""},q=()=>{if(V(),!(Z.length===1&&Z[0]===""&&G.length>0))G.push(Z);if(Z=[],G.length>=j)L=!0};for(let Q=0;Q<_.length;Q+=1){if(L)break;let K=_[Q];if(K==='"')if(Y&&_[Q+1]==='"')X+='"',Q+=1;else Y=!Y;else if(!Y&&K===$)V();else if(!Y&&(K===`
`||K==="\r")){if(K==="\r"&&_[Q+1]===`
`)Q+=1;q()}else X+=K}if(!L&&(X.length>0||Z.length>0))q();return{rows:G,truncatedRows:L}}function Bz(_,$){return _.map((j)=>{let G=j.slice(0,$);while(G.length<$)G.push("");return G})}function Uq(_,$={}){let j=Math.max(1,$.maxRows??500),G=Math.max(1,$.maxColumns??80),Z=$.delimiter||Qz(_),X=Nz(_,Z,j+1),Y=X.rows.slice(0,j),L=Y.reduce((H,E)=>Math.max(H,E.length),0),V=Math.min(Math.max(1,L),G),q=L>G,Q=Bz(Y,V),K=Q[0]||[],B=Q.slice(1),N=K.some((H)=>H.trim().length>0)&&B.length>0,U=N?K.map((H,E)=>H.trim()||`Column ${E+1}`):Array.from({length:V},(H,E)=>`Column ${E+1}`),D=N?B:Q;return{delimiter:Z,headers:U,rows:D,columnCount:V,rowCount:D.length,truncatedRows:X.truncatedRows||X.rows.length>j,truncatedColumns:q}}var Fz=new Set(["application/json","application/xml","text/csv","text/html","text/markdown","text/plain","text/x-yaml","text/xml","text/yaml"]),Uz=new Set(["text/markdown"]),Ez=new Set(["application/msword","application/rtf","application/vnd.ms-excel","application/vnd.ms-powerpoint","application/vnd.oasis.opendocument.presentation","application/vnd.oasis.opendocument.spreadsheet","application/vnd.oasis.opendocument.text","application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.openxmlformats-officedocument.wordprocessingml.document"]),Hz=new Set(["application/eml","message/rfc822"]);function e$(_){return typeof _==="string"?_.trim().toLowerCase():""}function Dz(_){let $=e$(_);return!!$&&$.endsWith(".eml")}function Wz(_){let $=e$(_);return!!$&&$.endsWith(".pdf")}function Oz(_){let $=e$(_);return!!$&&($.endsWith(".docx")||$.endsWith(".doc")||$.endsWith(".odt")||$.endsWith(".rtf")||$.endsWith(".xlsx")||$.endsWith(".xls")||$.endsWith(".ods")||$.endsWith(".pptx")||$.endsWith(".ppt")||$.endsWith(".odp"))}var zz=new Set(["application/zip","application/x-zip-compressed"]);function Jz(_){let $=e$(_);return!!$&&$.endsWith(".zip")}function Az(_){let $=e$(_);return!!$&&($.endsWith(".html")||$.endsWith(".htm"))}function kz(_){let $=e$(_);if(!$)return!1;return $.endsWith(".sh")||$.endsWith(".bash")||$.endsWith(".zsh")||$.endsWith(".sb")||$.endsWith(".yaml")||$.endsWith(".yml")}function y5(_,$){let j=L8(_,$);if(j?.id)return j.id;let G=e$(_);if(Wz($)||G==="application/pdf")return"pdf";if(Oz($)||Ez.has(G))return"office";if(Dz($)||Hz.has(G))return"eml";if(Jz($)||zz.has(G))return"archive";if(Az($)||G==="text/html")return"html";if(Bq(G,$))return"delimited";if(kz($))return"text";if(!G)return"unsupported";if(G.startsWith("video/"))return"video";if(G.startsWith("image/"))return"image";if(Fz.has(G)||G.startsWith("text/"))return"text";return"unsupported"}function Eq(_){let $=e$(_);return Uz.has($)}function q8(_){switch(_){case"image":return"Image preview";case"video":return"Video player";case"pdf":return"PDF preview";case"office":return"Office viewer";case"eml":return"Email preview";case"html":return"HTML preview";case"text":return"Text preview";case"delimited":return"Table preview";case"archive":return"ZIP archive preview";default:return Lq(_)||"Preview unavailable"}}var yz=new TextDecoder("utf-8",{fatal:!1});function M2(_,$){return _[$]|_[$+1]<<8}function R4(_,$){return(_[$]|_[$+1]<<8|_[$+2]<<16|_[$+3]<<24)>>>0}function Hq(_,$,j){return yz.decode(_.subarray($,$+j))}function Mz(_){let $=Math.max(0,_.length-65557);for(let j=_.length-22;j>=$;j-=1)if(R4(_,j)===101010256)return j;return-1}function wz(_,$){let j=Math.max(0,$-20);for(let G=j;G<=$-4;G+=1)if(R4(_,G)===117853008)return!0;return!1}function Tz(_){let $=new Set;for(let j of _){let G=j.path.replace(/\/+/g,"/");if(!G)continue;if(j.isDirectory){$.add(G.endsWith("/")?G.slice(0,-1):G);continue}let Z=G.split("/").filter(Boolean);if(Z.length<=1)continue;let X="";for(let Y=0;Y<Z.length-1;Y+=1)X=X?`${X}/${Z[Y]}`:Z[Y],$.add(X)}return $}function xz(_){return String(_||"").replace(/\\/g,"/").trim()}function Dq(_){switch(Number(_)){case 0:return"Stored";case 8:return"Deflate";case 9:return"Deflate64";case 12:return"BZIP2";case 14:return"LZMA";case 93:return"Zstandard";default:return`Method ${_}`}}function Wq(_){let $=_ instanceof Uint8Array?_:_ instanceof ArrayBuffer?new Uint8Array(_):new Uint8Array(_.buffer,_.byteOffset,_.byteLength);if($.length<22)throw Error("ZIP archive is too small to contain a valid directory.");let j=Mz($);if(j<0)throw Error("ZIP archive directory could not be found.");if(wz($,j))throw Error("ZIP64 archives are not previewable yet.");let G=M2($,j+10),Z=R4($,j+12),X=R4($,j+16);if(X+Z>$.length)throw Error("ZIP archive directory is truncated.");let Y=[],L=X,V=X+Z;while(L<V){if(L+46>$.length)throw Error("ZIP archive directory entry is truncated.");if(R4($,L)!==33639248)throw Error("ZIP archive directory contains an unexpected record.");let K=M2($,L+8),B=M2($,L+10),N=R4($,L+20),U=R4($,L+24),D=M2($,L+28),H=M2($,L+30),E=M2($,L+32),k=L+46,z=k+D+H,O=z+E;if(O>$.length)throw Error("ZIP archive directory entry metadata is truncated.");let I=(K&2048)===2048,x=xz(Hq($,k,D)),A=Hq($,z,E),y=x.endsWith("/");if(x)Y.push({path:x,isDirectory:y,compressedSize:N,uncompressedSize:U,compressionMethod:B,comment:I?A:A});L=O}Y.sort((K,B)=>{if(K.isDirectory!==B.isDirectory)return K.isDirectory?-1:1;return K.path.localeCompare(B.path)});let q=Y.filter((K)=>!K.isDirectory),Q=Tz(Y);return{entries:Y,summary:{fileCount:q.length,directoryCount:Q.size,totalEntries:Y.length,compressedBytes:q.reduce((K,B)=>K+B.compressedSize,0),uncompressedBytes:q.reduce((K,B)=>K+B.uncompressedSize,0)}}}function Oq(_){if(!_)return null;if(_.uncompressedBytes<=0)return null;let $=1-_.compressedBytes/_.uncompressedBytes;if(!Number.isFinite($))return null;return`${Math.round($*100)}% smaller`}var Iz="allow-scripts";function Cz(_=!1){return`image-modal attachment-preview-modal${_?" maximized":""}`}function fz(_){if(!(_ instanceof Uint8Array)||_.length===0)return!0;let $=0,j=_.subarray(0,Math.min(_.length,4096));for(let G of j){if(G===0)return!1;if(G<32&&G!==9&&G!==10&&G!==13&&G!==12)$+=1}return $/j.length<0.02}function Pz(_,$){let j=String(_?.content_type||"").trim().toLowerCase(),G=String($||"").trim().toLowerCase();if(j.startsWith("text/")||j==="application/json"||j==="application/xml")return!1;return j==="application/octet-stream"||G.endsWith(".sb")||G.endsWith(".sh")}function Rz(_){try{return new TextDecoder("utf-8",{fatal:!1}).decode(_)}catch{return new TextDecoder().decode(_)}}function Sz(_){if(_==="\t")return"Tab";if(_===",")return"Comma";if(_===";")return"Semicolon";if(_==="|")return"Pipe";return null}function uz(_,$=null,j=null,G=null){let Z=_?.metadata?.size,X=_?.content_type||"application/octet-stream",Y=j?.summary||null;return[{label:"Type",value:X},{label:"Syntax",value:$},{label:"Delimiter",value:G?Sz(G.delimiter):null},{label:"Rows",value:G?`${G.rowCount}${G.truncatedRows?"+":""}`:null},{label:"Columns",value:G?`${G.columnCount}${G.truncatedColumns?"+":""}`:null},{label:"Entries",value:Y?String(Y.totalEntries):null},{label:"Files",value:Y?String(Y.fileCount):null},{label:"Folders",value:Y?String(Y.directoryCount):null},{label:"Compressed",value:Y?a_(Y.compressedBytes):null},{label:"Uncompressed",value:Y?a_(Y.uncompressedBytes):null},{label:"Savings",value:Oq(Y)},{label:"Size",value:typeof Z==="number"?a_(Z):null},{label:"Added",value:_?.created_at?T4(_.created_at):null}].filter((L)=>L.value)}function gz(_,$){let j=String(_?.content_type||"").trim().toLowerCase(),G=String($||"").trim().toLowerCase(),Z=G.split("/").pop()||G;if(G.endsWith(".yaml")||G.endsWith(".yml")||j==="text/yaml"||j==="application/yaml")return"yaml";if(G.endsWith(".json")||G.endsWith(".jsonl")||j==="application/json")return"json";if(G.endsWith(".xml")||G.endsWith(".svg")||j==="application/xml"||j==="text/xml"||j==="image/svg+xml")return"xml";if(G.endsWith(".html")||G.endsWith(".htm")||j==="text/html")return"html";if(G.endsWith(".css")||j==="text/css")return"css";if(G.endsWith(".ts")||G.endsWith(".tsx")||j==="text/typescript")return G.endsWith(".tsx")?"tsx":"ts";if(G.endsWith(".js")||G.endsWith(".jsx")||j==="text/javascript"||j==="application/javascript")return G.endsWith(".jsx")?"jsx":"js";if(G.endsWith(".py")||j==="text/x-python"||j==="application/x-python-code")return"python";if(G.endsWith(".go")||j==="text/x-go")return"go";if(G.endsWith(".c++")||G.endsWith(".cc")||G.endsWith(".cp")||G.endsWith(".cpp")||G.endsWith(".cxx")||G.endsWith(".hh")||G.endsWith(".hpp")||G.endsWith(".hxx")||j==="text/x-c++src"||j==="text/x-c++hdr")return"cpp";if(G.endsWith(".rb")||j==="text/x-ruby")return"ruby";if(G.endsWith(".rs")||j==="text/x-rustsrc")return"rust";if(G.endsWith(".ps1")||G.endsWith(".psm1")||G.endsWith(".psd1")||j==="text/x-powershell")return"powershell";if(Z==="dockerfile"||G.endsWith(".dockerfile"))return"dockerfile";if(G.endsWith(".md")||G.endsWith(".markdown")||j==="text/markdown")return"markdown";if(G.endsWith(".sh")||G.endsWith(".bash")||G.endsWith(".zsh")||Z===".bashrc"||Z===".bash_profile"||Z===".profile"||Z===".zshrc"||Z===".zprofile"||Z===".zshenv"||Z===".env"||Z.startsWith(".env.")||j==="text/x-shellscript")return"bash";if(G.endsWith(".sql"))return"sql";if(G.endsWith(".toml")||G.endsWith(".ini")||G.endsWith(".cfg")||G.endsWith(".conf")||G.endsWith(".properties")||j==="text/toml")return"toml";return null}function bz(_,$,j){let G=encodeURIComponent($||`attachment-${_}`),Z=encodeURIComponent(String(_));if(j==="pdf")return`/pdf-viewer/?media=${Z}&name=${G}#media=${Z}&name=${G}`;if(j==="office"){let X=u1(_);return`/office-viewer/?url=${encodeURIComponent(X)}&name=${G}`}if(j==="eml")return`/eml-viewer/?media=${Z}&name=${G}`;return null}function zq({mediaId:_,info:$,onClose:j}){let G=$?.filename||`attachment-${_}`,Z=Y0(()=>L8($?.content_type,G),[$?.content_type,G]),X=Y0(()=>y5($?.content_type,G),[$?.content_type,G]),Y=Z?.label||q8(X),L=Y0(()=>Eq($?.content_type),[$?.content_type]),[V,q]=f(X==="text"||X==="html"||X==="archive"||X==="delimited"),[Q,K]=f(""),[B,N]=f(null),[U,D]=f(null),[H,E]=f(null),[k,z]=f(!1),O=g(null),I=Y0(()=>gz($,G),[$,G]),x=Y0(()=>I?gZ(I):null,[I]),A=Y0(()=>uz($,!L?x:null,B,U),[$,L,x,B,U]),y=Y0(()=>Z?Vq(Z.id,_,G):bz(_,G,X),[Z,_,G,X]),W=Y0(()=>qq(Z?.id||X),[Z?.id,X]),M=Y0(()=>{if(!L||!Q)return"";return Z1(Q)},[L,Q]),T=Y0(()=>{if(L||!Q||!I)return"";return F6(Q,I)},[L,Q,I]);return u(()=>{let J=(C)=>{if(C.key!=="Escape")return;if(k){z(!1);return}j()};return document.addEventListener("keydown",J),()=>document.removeEventListener("keydown",J)},[k,j]),u(()=>{if(!O.current||!M)return;H$(O.current);return},[M]),u(()=>{let J=!1;async function C(){if(X!=="text"&&X!=="html"&&X!=="archive"&&X!=="delimited"){q(!1),E(null),K(""),N(null),D(null);return}q(!0),E(null),K(""),N(null),D(null);try{let P=await k7(_),b=new Uint8Array(await P.arrayBuffer());if(X==="text"||X==="html"||X==="delimited"){if(X==="text"&&Pz($,G)&&!fz(b))throw Error("Attachment does not appear to contain text content.");let h=Rz(b);if(!J){if(K(h),X==="delimited")D(Uq(h,{delimiter:Fq($?.content_type,G)}))}return}let m=Wq(b);if(!J)N(m)}catch(P){if(!J){let b=P instanceof Error?P.message:String(P||"Unknown error");E(X==="archive"?`Failed to load ZIP preview. ${b}`:X==="delimited"?`Failed to load table preview. ${b}`:`Failed to load text preview. ${b}`)}}finally{if(!J)q(!1)}}return C(),()=>{J=!0}},[_,X,$?.content_type,G]),F`
        <${p$} className="attachment-preview-portal-root">
            <div class=${Cz(k)} onClick=${j}>
                <div class="attachment-preview-shell" onClick=${(J)=>{J.stopPropagation()}}>
                    <div class="attachment-preview-header">
                        <div class="attachment-preview-heading">
                            <div class="attachment-preview-title">${G}</div>
                            <div class="attachment-preview-subtitle">${Y}</div>
                        </div>
                        <div class="attachment-preview-header-actions">
                            <button
                                class="attachment-preview-zen"
                                type="button"
                                onClick=${()=>z((J)=>!J)}
                                title=${k?"Exit zen mode":"Enter zen mode"}
                                aria-label=${k?"Exit zen mode":"Enter zen mode"}
                                aria-pressed=${k?"true":"false"}
                            >
                                ${k?"Restore":"Maximize"}
                            </button>
                            ${y&&F`
                                <a
                                    href=${y}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="attachment-preview-download"
                                    onClick=${(J)=>J.stopPropagation()}
                                >
                                    Open in Tab
                                </a>
                            `}
                            <a
                                href=${u1(_)}
                                download=${G}
                                class="attachment-preview-download"
                                onClick=${(J)=>J.stopPropagation()}
                            >
                                Download
                            </a>
                            <button class="attachment-preview-close" type="button" onClick=${j}>Close</button>
                        </div>
                    </div>
                    <div class="attachment-preview-body">
                        ${V&&F`<div class="attachment-preview-state">Loading preview…</div>`}
                        ${!V&&H&&F`<div class="attachment-preview-state">${H}</div>`}
                        ${!V&&!H&&X==="image"&&F`
                            <img class="attachment-preview-image" src=${u1(_)} alt=${G} />
                        `}
                        ${!V&&!H&&X==="video"&&F`
                            <video class="attachment-preview-video" src=${u1(_)} controls autoplay style="max-width:100%;max-height:100%;" />
                        `}
                        ${!V&&!H&&X==="html"&&F`
                            <iframe class="attachment-preview-frame" srcdoc=${Q||""} sandbox=${Iz} title=${G}></iframe>
                        `}
                        ${!V&&!H&&(X==="pdf"||X==="office"||X==="eml"||Boolean(Z))&&y&&F`
                            <iframe class="attachment-preview-frame" src=${y} title=${G}></iframe>
                        `}
                        ${!V&&!H&&W&&F`
                            <div class="attachment-preview-readonly-note">${W}</div>
                        `}
                        ${!V&&!H&&X==="delimited"&&U&&F`
                            <div class="attachment-preview-delimited">
                                ${(U.truncatedRows||U.truncatedColumns)&&F`
                                    <div class="attachment-preview-delimited-note">
                                        Showing first ${U.rowCount} rows and ${U.columnCount} columns.
                                        Download the file for the complete dataset.
                                    </div>
                                `}
                                <div class="attachment-preview-delimited-table-wrap">
                                    <table class="attachment-preview-delimited-table">
                                        <thead>
                                            <tr>
                                                ${U.headers.map((J,C)=>F`
                                                    <th key=${`h-${C}`}>${J}</th>
                                                `)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${U.rows.map((J,C)=>F`
                                                <tr key=${`r-${C}`}>
                                                    ${J.map((P,b)=>F`
                                                        <td key=${`c-${C}-${b}`}>${P}</td>
                                                    `)}
                                                </tr>
                                            `)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `}
                        ${!V&&!H&&X==="archive"&&B&&F`
                            <div class="attachment-preview-archive">
                                <div class="attachment-preview-archive-summary">
                                    <div class="attachment-preview-archive-card">
                                        <span class="attachment-preview-archive-card-label">Files</span>
                                        <strong class="attachment-preview-archive-card-value">${B.summary.fileCount}</strong>
                                    </div>
                                    <div class="attachment-preview-archive-card">
                                        <span class="attachment-preview-archive-card-label">Folders</span>
                                        <strong class="attachment-preview-archive-card-value">${B.summary.directoryCount}</strong>
                                    </div>
                                    <div class="attachment-preview-archive-card">
                                        <span class="attachment-preview-archive-card-label">Compressed</span>
                                        <strong class="attachment-preview-archive-card-value">${a_(B.summary.compressedBytes)}</strong>
                                    </div>
                                    <div class="attachment-preview-archive-card">
                                        <span class="attachment-preview-archive-card-label">Uncompressed</span>
                                        <strong class="attachment-preview-archive-card-value">${a_(B.summary.uncompressedBytes)}</strong>
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
                                            ${B.entries.map((J)=>F`
                                                <tr key=${J.path}>
                                                    <td class="attachment-preview-archive-name">${J.path}</td>
                                                    <td>${J.isDirectory?"Folder":"File"}</td>
                                                    <td>${J.isDirectory?"—":Dq(J.compressionMethod)}</td>
                                                    <td>${J.isDirectory?"—":a_(J.compressedSize)}</td>
                                                    <td>${J.isDirectory?"—":a_(J.uncompressedSize)}</td>
                                                </tr>
                                            `)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `}
                        ${!V&&!H&&X==="text"&&L&&F`
                            <div
                                ref=${O}
                                class="attachment-preview-markdown post-content"
                                dangerouslySetInnerHTML=${{__html:M}}
                            />
                        `}
                        ${!V&&!H&&X==="text"&&!L&&T&&F`
                            <pre class="attachment-preview-text attachment-preview-code"><code dangerouslySetInnerHTML=${{__html:T}} /></pre>
                        `}
                        ${!V&&!H&&X==="text"&&!L&&!T&&F`
                            <pre class="attachment-preview-text">${Q}</pre>
                        `}
                        ${!V&&!H&&X==="unsupported"&&F`
                            <div class="attachment-preview-state">
                                Preview is not available for this file type yet. You can still download it directly.
                            </div>
                        `}
                    </div>
                    <div class="attachment-preview-meta">
                        ${A.map((J)=>F`
                            <div class="attachment-preview-meta-item" key=${J.label}>
                                <span class="attachment-preview-meta-label">${J.label}</span>
                                <span class="attachment-preview-meta-value">${J.value}</span>
                            </div>
                        `)}
                    </div>
                </div>
            </div>
        </${p$}>
    `}M0();I_();m6();Q9();function vz(_){if(!_||typeof _!=="object")return!1;if(_.isContentEditable)return!0;if(typeof _.closest!=="function")return!1;return Boolean(_.closest(["input","textarea","select",'[contenteditable="true"]',".compose-box",".compose-model-popup",".compose-session-popup",".settings-dialog",".workspace-sidebar",".workspace-explorer",".editor-pane-container",".dock-panel",".timeline-menu-dropdown",".rename-branch-overlay",".agent-request-modal",".attachment-preview-modal",".vnc-pane-shell",".kanban-plugin",".mindmap-editor"].join(", ")))}function mz(_){if(!_||typeof _!=="object")return!0;if(vz(_))return!1;let $=String(_.tagName||"").toUpperCase();if($==="BODY"||$==="HTML")return!0;if(typeof _.closest!=="function")return!0;return Boolean(_.closest(".container, .timeline, .post, .post-body, .post-content, .agent-status-panel"))}function cz(_){if(!A5(_))return!1;if(!mz(_?.target))return!1;return!i$.some((j)=>z$(_,j.id))}function Jq(_){let $=new URL(window.location.href);if(_)$.searchParams.delete("chat_only");else $.searchParams.set("chat_only","1");window.location.href=$.toString()}function lz(_){let $=[],j=new Map(s$.map((Z)=>[Z.id,Z])),G=(Z,X={})=>{let Y=j.get(Z);if(!Y)return;$.push({...Y,...X})};if(G("toggle-workspace",{label:_.workspaceOpen?"Hide workspace":"Show workspace",description:_.workspaceOpen?"Hide the workspace sidebar.":"Show the workspace sidebar."}),!_.workspaceOpen&&!_.chatOnlyMode)G("open-explorer");if(G("toggle-chat-only",{label:_.chatOnlyMode?"Exit chat-only mode":"Chat-only mode",description:_.chatOnlyMode?"Return to the split workspace layout.":"Switch to the chat-only layout."}),typeof _.onOpenTerminalTab==="function")G("open-terminal-tab");if(typeof _.onOpenVncTab==="function")G("open-vnc-tab");if(typeof _.onToggleTerminalDock==="function")G("toggle-terminal-dock",{label:_.terminalVisible?"Hide terminal dock":"Show terminal dock",description:_.terminalVisible?"Hide the terminal dock.":"Show the terminal dock."});return G("open-settings"),$}function Aq(_){if(_==="agent")return"Agents";if(_==="workspace")return"Workspace";return"Slash commands"}function hz(_){if(_?.imageUrl)return F`<img class="timeline-quick-actions-item-avatar" src=${_.imageUrl} alt="" aria-hidden="true" />`;return F`<span class="timeline-quick-actions-item-placeholder" aria-hidden="true">${_?.visualHint||""}</span>`}function V8(_,$){return F`
        <span class="timeline-quick-actions-keyhint">
            <kbd>${$}</kbd>
            <span>${_}</span>
        </span>
    `}function nz(_){let $=new URL(window.location.href);$.searchParams.set("chat_jid",_),$.searchParams.set("chat_only","1");let j=document.createElement("a");j.href=$.toString(),j.target="_blank",j.rel="noopener",j.style.display="none",document.body.appendChild(j),j.click(),j.remove()}function kq({activeChatAgents:_=[],currentChatJid:$="web:default",workspaceOpen:j=!1,chatOnlyMode:G=!1,terminalVisible:Z=!1,onSwitchChat:X,onToggleWorkspace:Y,onOpenTerminalTab:L,onOpenVncTab:V,onToggleTerminalDock:q,onPrefillCompose:Q}){let[K,B]=f(!1),[N,U]=f(""),[D,H]=f(0),[E,k]=f([]),[z,O]=f({workspaceCommands:null,slashCommands:null}),I=g(null),x=g(null),A=R(async()=>{try{let T=await q5();O(a$(T?.settings))}catch{O({workspaceCommands:null,slashCommands:null})}},[]);u(()=>{A()},[A]),u(()=>{let T=!1;return L5($).then((J)=>{if(T)return;k(Array.isArray(J?.commands)?J.commands:[])}).catch(()=>{if(T)return;k([])}),()=>{T=!0}},[$]);let y=Y0(()=>lz({workspaceOpen:j,chatOnlyMode:G,terminalVisible:Z,onOpenTerminalTab:L,onOpenVncTab:V,onToggleTerminalDock:q}),[G,L,V,q,Z,j]),W=Y0(()=>lY({agents:_,workspaceCommands:y,slashCommands:E,settings:z,query:N}),[_,N,z,E,y]);if(u(()=>{if(W.length===0){H(-1);return}if(!N.trim()){H(0);return}let T=N.toLowerCase().replace(/^[@/]+/,"").trim();if(!T){H(0);return}let J=0,C=0;for(let P=0;P<W.length;P++){let b=W[P],m=(b.title||"").toLowerCase().replace(/^[@/]+/,"");if(m===T){J=P;break}let h=0;if(m.startsWith(T))h=3;else if(m.includes(T))h=2;else if((b.subtitle||"").toLowerCase().includes(T))h=1;if(h>C)C=h,J=P}H(J)},[W,N]),u(()=>{if(!K)return;requestAnimationFrame(()=>x.current?.focus?.())},[K]),u(()=>{let T=(C)=>{if(!K){if(!cz(C))return;C.preventDefault(),U(String(C.key||"")),H(0),B(!0);return}if(C.key==="Escape"){C.preventDefault(),B(!1),U("");return}if(C.key==="ArrowDown"){C.preventDefault(),H((P)=>W.length>0?(P+1+W.length)%W.length:0);return}if(C.key==="ArrowUp"){C.preventDefault(),H((P)=>W.length>0?(P-1+W.length)%W.length:0);return}if(C.key==="Enter"&&W[D]){C.preventDefault();let P=W[D],b=C.altKey;if(P){if(P.kind==="agent"&&P.chatJid)if(b)nz(P.chatJid);else X?.(P.chatJid);else if(P.kind==="workspace"&&P.commandId){if(P.commandId==="toggle-workspace"||P.commandId==="open-explorer")Y?.();if(P.commandId==="toggle-chat-only")Jq(G);if(P.commandId==="open-terminal-tab")L?.();if(P.commandId==="open-vnc-tab")V?.();if(P.commandId==="toggle-terminal-dock")q?.();if(P.commandId==="open-settings")window.dispatchEvent(new CustomEvent("piclaw:open-settings"))}else if(P.kind==="slash"&&P.commandName)Q?.(P.commandName)}B(!1),U("")}},J=(C)=>{if(!K)return;if(I.current?.contains(C.target))return;B(!1),U("")};return window.addEventListener("keydown",T,!0),document.addEventListener("pointerdown",J,!0),()=>{window.removeEventListener("keydown",T,!0),document.removeEventListener("pointerdown",J,!0)}},[G,D,W,L,V,Q,X,q,Y,K]),u(()=>{let T=(J)=>{let C=a$(J?.detail?.settings);if(J?.detail?.settings){O(C);return}A()};return window.addEventListener("focus",T),window.addEventListener("piclaw:quick-actions-settings-updated",T),()=>{window.removeEventListener("focus",T),window.removeEventListener("piclaw:quick-actions-settings-updated",T)}},[A]),!K)return null;let M=null;return F`
        <div class="timeline-quick-actions-portal">
            <div class="timeline-quick-actions-overlay">
                <div class="timeline-quick-actions" ref=${I}>
                    <div class="timeline-quick-actions-header">
                        <div class="timeline-quick-actions-search-row">
                            <input
                                ref=${x}
                                class="timeline-quick-actions-input"
                                type="text"
                                value=${N}
                                placeholder="Type to jump to an agent, workspace action, or slash command…"
                                onInput=${(T)=>{U(T.currentTarget?.value||""),H(0)}}
                            />
                            <div class="timeline-quick-actions-hints" aria-hidden="true">
                                ${V8("Move","↑↓")}
                                ${V8("Select","↵")}
                                ${V8("Pop out","Alt+↵")}
                                ${V8("Close","Esc")}
                            </div>
                        </div>
                    </div>
                    <div class="timeline-quick-actions-list">
                        ${W.length===0&&F`<div class="timeline-quick-actions-empty">No quick actions match.</div>`}
                        ${W.map((T,J)=>{let C=T.kind!==M;return M=T.kind,F`
                                ${C&&F`<div class="timeline-quick-actions-section">${Aq(T.kind)}</div>`}
                                <button
                                    key=${T.key}
                                    type="button"
                                    class=${`timeline-quick-actions-item timeline-quick-actions-item-${T.kind}${J===D?" active":""}`}
                                    onMouseEnter=${null}
                                    onClick=${()=>{if(T.kind==="agent"&&T.chatJid)X?.(T.chatJid);if(T.kind==="workspace"&&T.commandId==="toggle-workspace")Y?.();if(T.kind==="workspace"&&T.commandId==="open-explorer")Y?.();if(T.kind==="workspace"&&T.commandId==="toggle-chat-only")Jq(G);if(T.kind==="workspace"&&T.commandId==="open-terminal-tab")L?.();if(T.kind==="workspace"&&T.commandId==="open-vnc-tab")V?.();if(T.kind==="workspace"&&T.commandId==="toggle-terminal-dock")q?.();if(T.kind==="workspace"&&T.commandId==="open-settings")window.dispatchEvent(new CustomEvent("piclaw:open-settings"));if(T.kind==="slash"&&T.commandName)Q?.(T.commandName);B(!1),U("")}}
                                >
                                    <span class="timeline-quick-actions-item-media">
                                        ${hz(T)}
                                    </span>
                                    <span class="timeline-quick-actions-item-copy">
                                        <span class="timeline-quick-actions-item-title-row">
                                            <span class="timeline-quick-actions-item-title">${T.title}</span>
                                            ${T.actionHint?F`<span class="timeline-quick-actions-item-action-hint">${T.actionHint}</span>`:null}
                                        </span>
                                        <span class="timeline-quick-actions-item-subtitle">${T.subtitle}</span>
                                    </span>
                                    <span class="timeline-quick-actions-item-category">${T.categoryLabel||Aq(T.kind)}</span>
                                </button>
                            `})}
                    </div>
                </div>
            </div>
        </div>
    `}M0();function yq({workspaceOpen:_,toggleWorkspace:$,chatOnlyMode:j,onOpenTerminalTab:G,onOpenVncTab:Z,onToggleTerminal:X,terminalVisible:Y}){let[L,V]=f(!1),[q,Q]=f({top:8,left:8}),K=g(null),B=g(null),N=g(null);u(()=>{if(typeof document>"u")return;let E=document.createElement("div");return E.className="timeline-menu-portal in-chat",document.body.appendChild(E),N.current=E,()=>{E.remove(),N.current=null}},[]),u(()=>{let E=()=>{if(_){let O=document.querySelector(".workspace-sidebar");if(O){let I=O.getBoundingClientRect();Q({top:I.top+8,left:I.left+8})}}else Q({top:8,left:8})};E();let k=new ResizeObserver(E),z=document.querySelector(".workspace-sidebar");if(z)k.observe(z);return window.addEventListener("resize",E),()=>{k.disconnect(),window.removeEventListener("resize",E)}},[_]),u(()=>{if(N.current)N.current.className=`timeline-menu-portal ${_?"in-workspace":"in-chat"}`},[_]),u(()=>{if(!N.current)return;let E=N.current.style;E.top=`${q.top}px`,E.left=`${q.left}px`,E.right="auto"},[q]),u(()=>{if(!L)return;let E=(k)=>{if(K.current?.contains(k.target))return;if(B.current?.contains(k.target))return;V(!1)};return document.addEventListener("mousedown",E,!0),()=>document.removeEventListener("mousedown",E,!0)},[L]),u(()=>{if(!L)return;let E=(k)=>{if(k.key==="Escape")V(!1)};return document.addEventListener("keydown",E),()=>document.removeEventListener("keydown",E)},[L]),u(()=>{V(!1)},[_]);let U=R((E)=>{V(!1),E?.()},[]),D=R(()=>{let E=new URL(window.location.href);if(j)E.searchParams.delete("chat_only");else E.searchParams.set("chat_only","1");window.location.href=E.toString()},[j]),H=F`
        <button ref=${B} class=${`timeline-menu-btn${L?" active":""}`}
            onClick=${()=>V((E)=>!E)} title="Menu" aria-label="Menu"
            aria-haspopup="menu" aria-expanded=${L?"true":"false"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
        </button>
        ${L&&F`
            <div class="workspace-menu-dropdown timeline-menu-dropdown" ref=${K} role="menu">
                <button class="workspace-menu-item" role="menuitem" onClick=${()=>U($)}>
                    ${_?"Hide workspace":"Show workspace"}
                </button>
                ${!_&&!j&&F`
                    <button class="workspace-menu-item" role="menuitem" onClick=${()=>U(()=>{$()})}>
                        Open explorer
                    </button>
                `}
                <button class=${`workspace-menu-item${j?" active":""}`} role="menuitem" onClick=${()=>U(D)}>
                    ${j?"Exit chat-only mode":"Chat-only mode"}
                </button>

                ${(G||Z||X)&&F`<div class="workspace-menu-separator"></div>`}
                ${G&&F`<button class="workspace-menu-item" role="menuitem" onClick=${()=>U(G)}>Open terminal in tab</button>`}
                ${Z&&F`<button class="workspace-menu-item" role="menuitem" onClick=${()=>U(Z)}>Open VNC in tab</button>`}
                ${X&&F`<button class="workspace-menu-item" role="menuitem" onClick=${()=>U(X)}>${Y?"Hide terminal dock":"Show terminal dock"}</button>`}

                <div class="workspace-menu-separator"></div>
                <button class="workspace-menu-item" role="menuitem" onClick=${()=>U(()=>window.dispatchEvent(new CustomEvent("piclaw:open-settings")))}>Settings</button>
            </div>
        `}
    `;return j2(()=>{if(N.current)Q$(H,N.current)}),null}M0();I_();var Mq="PiClaw";function b9(_,$,j=!1){let G=_||"PiClaw",Z=G.charAt(0).toUpperCase(),X=["#FF6B6B","#4ECDC4","#45B7D1","#FFA07A","#98D8C8","#F7DC6F","#BB8FCE","#85C1E2","#F8B195","#6C5CE7","#00B894","#FDCB6E","#E17055","#74B9FF","#A29BFE","#FD79A8","#00CEC9","#FFEAA7","#DFE6E9","#FF7675","#55EFC4","#81ECEC","#FAB1A0","#74B9FF","#A29BFE","#FD79A8"],Y=Z.charCodeAt(0)%X.length,L=X[Y],V=G.trim().toLowerCase(),q=typeof $==="string"?$.trim():"",Q=q?q:null,K=j||V==="PiClaw".toLowerCase()||V==="pi";return{letter:Z,color:L,image:Q||(K?"/static/icon-192.png":null)}}function wq(_,$){if(!_)return"PiClaw";let j=$[_]?.name||_;return j?j.charAt(0).toUpperCase()+j.slice(1):"PiClaw"}function Tq(_,$){if(!_)return null;let j=$[_]||{};return j.avatar_url||j.avatarUrl||j.avatar||null}function xq(_){if(!_)return null;if(typeof document<"u"){let X=document.documentElement,Y=X?.dataset?.colorTheme||"",L=X?.dataset?.tint||"",V=getComputedStyle(X).getPropertyValue("--accent-color")?.trim();if(V&&(L||Y&&Y!=="default"))return V}let $=["#4ECDC4","#FF6B6B","#45B7D1","#BB8FCE","#FDCB6E","#00B894","#74B9FF","#FD79A8","#81ECEC","#FFA07A"],j=String(_),G=0;for(let X=0;X<j.length;X+=1)G=(G*31+j.charCodeAt(X))%2147483647;let Z=Math.abs(G)%$.length;return $[Z]}function v9(..._){for(let $ of _)if(typeof $==="string"&&$.trim())return $.trim();return null}function rz(_){if(_.startsWith('"')&&_.endsWith('"')||_.startsWith("'")&&_.endsWith("'"))return _.slice(1,-1);return _}function Iq(_){if(typeof _!=="string"||!_.trim())return null;let $=_.match(/^\s*cd\s+(.+?)(?:\s*(?:&&|;|\n))/s);if(!$?.[1])return null;return rz($[1].trim())||null}function Cq(_,$){let j=$&&typeof $==="object"?$:null;if(!j)return null;let G=v9(j.cwd,j.working_directory,j.workingDirectory);if(G)return G;let Z=v9(j.project_dir,j.projectDir,j.repo_path,j.repoPath);if(Z)return Z;let X=v9(j.command),Y=Iq(X);if(Y)return Y;if(Array.isArray(j.commands))for(let L of j.commands){let V=Iq(L);if(V)return V}return null}var pz=F`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="9" y="9" width="10" height="10" rx="2"></rect>
        <path d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"></path>
    </svg>
`,dz=F`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M6 3v12"></path>
        <circle cx="18" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle>
        <path d="M18 9a9 9 0 0 1-9 9"></path>
    </svg>
`,iz=F`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M12 7v5l3 2"></path>
    </svg>
`,oz=1e4,fq=132;function sz(_,$=fq){let j=Number.isFinite($)&&$>0?Math.floor($):fq;return String(_||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`).map((G)=>G.length>j?`${G.slice(0,j)}…`:G).join(`
`)}function az(_){return(Array.isArray(_)?_:_&&Array.isArray(_.status_hints)?_.status_hints:[]).filter((j)=>j&&typeof j==="object").map((j,G)=>({key:typeof j.key==="string"&&j.key.trim()?j.key.trim():`hint-${G}`,iconSvg:typeof j.icon_svg==="string"?j.icon_svg.trim():"",label:typeof j.label==="string"?j.label.trim():"",title:typeof j.title==="string"?j.title.trim():""})).filter((j)=>j.iconSvg&&j.label)}function tz(_){if(!(_ instanceof Set)||_.size===0)return null;let $=Array.from(_.values());for(let j=$.length-1;j>=0;j-=1){let G=$[j];if(G==="thought"||G==="draft")return G}return null}function ez(_){if(!Array.isArray(_)||_.length===0)return[];let $=new Map([["ssh",0]]);return _.map((j,G)=>({hint:j,index:G})).sort((j,G)=>{let Z=$.get(j.hint?.key)??100,X=$.get(G.hint?.key)??100;if(Z!==X)return Z-X;return j.index-G.index}).map((j)=>j.hint)}function _J(_,$){let j=typeof _==="string"?_.trim():"",G=typeof $==="string"?$.trim():"";return[j?j.split(/[\\/]+/).filter(Boolean).pop()||j:"",G].filter(Boolean).join(" • ")}function Pq(_){if(!_||typeof _!=="object")return!1;let $=typeof _.type==="string"?_.type:"",j=Boolean(_.last_activity||_.lastActivity),G=$==="tool_call"||$==="tool_status"||Boolean(_.tool_name||_.tool_args);if(!j&&!G)return!1;return r$(_)!==null}function Rq(_){if(!_||typeof _!=="object")return!1;return _.type==="intent"&&f6(_)!==null}function $J(_,$=Date.now()){if(!Number.isFinite(_))return!1;return $-_>=oz}function jJ(_,$=Date.now()){if(!Pq(_))return null;let j=r$(_);if(j===null||!$J(j,$))return null;let G=gq(new Date(j).toISOString(),$);return G?`${G} ago`:null}function GJ(_,$=Date.now()){if(!Rq(_))return null;if(f6(_)===null)return null;return D5(_,$)}function ZJ(_,$={}){let j=$?.isLastActivity??Boolean(_?.last_activity||_?.lastActivity),G=_?.title,Z=_?.status,X="";if(_?.type==="plan")X=G?`Planning: ${G}`:"Planning...";else if(_?.type==="tool_call")X=G?`Running: ${G}`:"Running tool...";else if(_?.type==="tool_status")X=G?`${G}: ${Z||"Working..."}`:Z||"Working...";else if(_?.type==="error")X=G||"Agent error";else X=G||Z||"Working...";if(!j)return X;if(X&&X!=="Working...")return`Recent activity: ${X}`;return"Last activity"}function XJ(_){let $=_?.tool_name||_?.toolName||"";return typeof $==="string"?$.trim().toLowerCase():""}function Sq(_){if(!_)return null;if(typeof _==="string")try{let $=JSON.parse(_);return Sq($)}catch{return null}if(typeof _==="object"){let $=_,j=$.input||$.params||$.parameters||$.args||$.payload;return j&&typeof j==="object"?j:$}return null}function uq(_,$){let j=typeof _==="string"?_:"";if(!j)return null;let G=j.match(/^(bash:\s*)(.+)$/is);if(G)return{prefix:G[1],command:G[2]};if(XJ($)!=="bash")return null;let Z=Sq($?.tool_args||$?.toolArgs),X=typeof Z?.command==="string"?Z.command.replace(/\s+/g," ").trim():"";if(!X||!j.includes(X))return null;let Y=j.indexOf(X);return{prefix:j.slice(0,Y),command:X,suffix:j.slice(Y+X.length)}}function YJ(_,$){let j=typeof _==="string"?_:"",G=typeof $?.title==="string"?$.title.trim():"",Z=uq(G,$);if(!Z?.command)return j;let X=j.lastIndexOf(Z.command);if(X<0)return j;let Y=X+Z.command.length;return F`
        ${j.slice(0,X)}<span class="agent-tool-command-line">${Z.command}</span>${j.slice(Y)}
    `}function LJ(_,$){let j=uq(_,$);if(!j?.command)return _;return F`
        ${j.prefix}<span class="agent-tool-command-line">${j.command}</span>${j.suffix||""}
    `}function gq(_,$=Date.now()){if(!_)return null;let j=$-new Date(_).getTime();if(!Number.isFinite(j)||j<0)return null;let G=Math.floor(j/1000),Z=Math.floor(G/3600),X=Math.floor(G%3600/60),Y=G%60;if(Z>0)return`${Z}h ${X}m`;if(X>0)return`${X}m ${Y}s`;return`${Y}s`}function m9({status:_,draft:$,plan:j,thought:G,pendingRequest:Z,intent:X,extensionPanels:Y=[],pendingPanelActions:L=new Set,onExtensionPanelAction:V,turnId:q,steerQueued:Q,onPanelToggle:K,showCorePanels:B=!0,showExtensionPanels:N=!0}){let E=(j0)=>{if(!j0)return{text:"",totalLines:0,fullText:""};if(typeof j0==="string"){let o=j0,Z0=o?o.replace(/\r\n/g,`
`).split(`
`).length:0;return{text:o,totalLines:Z0,fullText:o}}let O0=j0.text||"",n=j0.fullText||j0.full_text||O0,i=Number.isFinite(j0.totalLines)?j0.totalLines:n?n.replace(/\r\n/g,`
`).split(`
`).length:0;return{text:O0,totalLines:i,fullText:n}},k=160,z=(j0)=>String(j0||"").replace(/<\/?internal>/gi,""),O=(j0)=>{if(!j0)return 1;return Math.max(1,Math.ceil(j0.length/160))},I=(j0,O0,n,i={})=>{let o=(j0||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`);if(!o)return{text:"",omitted:0,totalLines:Number.isFinite(n)?n:0,visibleLines:0};let Z0=o.split(`
`),q0=i.direction==="tail",J0=Z0.length>O0?(q0?Z0.slice(-O0):Z0.slice(0,O0)).join(`
`):o,c0=Number.isFinite(n)?n:Z0.reduce((w0,l0)=>w0+O(l0),0),S0=J0?J0.split(`
`).reduce((w0,l0)=>w0+O(l0),0):0,I0=Math.max(c0-S0,0);return{text:J0,omitted:I0,totalLines:c0,visibleLines:S0}},x=E(j),A=E(G),y=E($),W=E({text:_?.output_preview||_?.outputPreview||"",fullText:_?.output_preview||_?.outputPreview||"",totalLines:_?.output_total_lines||_?.outputTotalLines}),M=Boolean(x.text)||x.totalLines>0,T=Boolean(A.text)||A.totalLines>0,J=Boolean(y.fullText?.trim()||y.text?.trim()),C=Boolean(W.fullText?.trim()||W.text?.trim()),P=Boolean(_||J||M||T||C||Z||X),b=Array.isArray(Y)&&Y.length>0,[m,h]=f(new Set),[_0,v]=f(null),[e,W0]=f(()=>Date.now()),G0=(j0)=>h((O0)=>{let n=new Set(O0),i=!n.has(j0);if(i)n.add(j0);else n.delete(j0);if(typeof K==="function")K(j0,i);return n});u(()=>{h(new Set),v(null)},[q]),u(()=>{if(!(Array.isArray(Y)&&Y.some((n)=>n?.started_at||n?.last_activity_at)))return;let O0=setInterval(()=>W0(Date.now()),1000);return()=>clearInterval(O0)},[Y]);let $0=Y0(()=>tz(m),[m]);u(()=>{if(!$0||typeof document>"u")return;let j0=(O0)=>{if(O0?.defaultPrevented)return;if(O0?.key!=="Escape")return;if(O0?.altKey||O0?.ctrlKey||O0?.metaKey||O0?.shiftKey)return;let n=O0?.target;if(n instanceof Element){if(n.closest?.('input, textarea, select, [contenteditable="true"]'))return;if(n.isContentEditable)return}if(h((i)=>{if(!(i instanceof Set)||!i.has($0))return i;let o=new Set(i);return o.delete($0),o}),typeof K==="function")K($0,!1);O0.preventDefault?.(),O0.stopPropagation?.()};return document.addEventListener("keydown",j0),()=>document.removeEventListener("keydown",j0)},[$0,K]);let L0=W$(_),B0=Boolean(_?.last_activity||_?.lastActivity),t=Y0(()=>Pq(_),[_]),V0=Y0(()=>Rq(_),[_]),K0=Y0(()=>Cq(_?.tool_name,_?.tool_args),[_?.tool_name,_?.tool_args]),[k0,s]=f(null);u(()=>{if(!Boolean(V0||_?.retry_at||_?.retryAt||t))return;W0(Date.now());let O0=setInterval(()=>W0(Date.now()),1000);return()=>clearInterval(O0)},[t,V0,_?.retry_at,_?.retryAt,_?.last_event_at,_?.lastEventAt,_?.started_at,_?.startedAt,_?.type,_?.tool_name,_?.tool_args]),u(()=>{if(!(_?.type==="tool_call"||_?.type==="tool_status")||!K0){s(null);return}let O0=!0;return y7(K0).then((n)=>{if(!O0)return;if(n?.branch)s({branch:n.branch,repoPath:n.repo_path||null,path:K0});else s(null)}).catch(()=>{if(O0)s(null)}),()=>{O0=!1}},[_?.type,K0]);let X0=_?.turn_id||q,D0=xq(X0),C0=e6({steerQueued:Q}),g0=(j0)=>j0,p0=zL(_,{isLastActivity:B0}),j_=$8(_,{isLastActivity:B0}),m0=$8(null,{pendingRequest:!0}),d0=(j0)=>j0==="warning"?"#f59e0b":j0==="error"?"var(--danger-color)":j0==="success"?"var(--success-color)":D0,u0=X?.kind||"info",o0=d0(u0),v0=d0(_?.kind||(L0?"warning":"info")),a0=ZJ(_,{isLastActivity:B0}),n0=jJ(_,e),N_=k0?.repoPath||"",t0=k0?.branch||"",b0=k0?_J(N_,t0):"",A0=az(_?.status_hints||_?.statusHints),L_=Y0(()=>ez(A0),[A0]),e0=Y0(()=>L_.filter((j0)=>j0?.key==="ssh"),[L_]),z_=Y0(()=>L_.filter((j0)=>j0?.key!=="ssh"),[L_]);if((!B||!P)&&(!N||!b))return null;let E0=({panelTitle:j0,text:O0,fullText:n,totalLines:i,maxLines:o,titleClass:Z0,panelKey:q0})=>{let J0=m.has(q0),c0=n||O0||"",S0=q0==="thought"||q0==="draft"?z(c0):c0,I0=typeof o==="number",w0=J0&&I0,l0=q0==="tool-output",U0=I0?I(S0,o,i,{direction:l0?"tail":"head"}):{text:S0||"",omitted:0,totalLines:Number.isFinite(i)?i:0},h0=l0&&!J0?sz(U0.text):S0;if(!S0&&!(Number.isFinite(U0.totalLines)&&U0.totalLines>0))return null;let Y_=`agent-thinking-body${I0?" agent-thinking-body-collapsible":""}`,G_=I0?`--agent-thinking-collapsed-lines: ${o};`:"",f0=!J0&&U0.omitted>0&&F`
            <button class="agent-thinking-truncation" onClick=${()=>G0(q0)}>
                ▸ ${U0.omitted} more lines
            </button>
        `;return F`
            <div
                class="agent-thinking"
                data-expanded=${J0?"true":"false"}
                data-collapsible=${I0?"true":"false"}
                data-panel-key=${q0||""}
                style=${D0?`--turn-color: ${D0};`:""}
            >
                <div class="agent-thinking-title ${Z0||""}">
                    ${D0&&F`<span class=${C0} aria-hidden="true"></span>`}
                    ${j0}
                    ${w0&&F`
                        <button
                            class="agent-thinking-close"
                            aria-label=${`Close ${j0} panel`}
                            onClick=${()=>G0(q0)}
                        >
                            ×
                        </button>
                    `}
                </div>
                ${l0?f0:null}
                <div
                    class=${Y_}
                    style=${G_}
                    dangerouslySetInnerHTML=${{__html:j5(h0)}}
                />
                ${l0?null:f0}
                ${J0&&U0.omitted>0&&F`
                    <button class="agent-thinking-truncation" onClick=${()=>G0(q0)}>
                        ▴ show less
                    </button>
                `}
            </div>
        `},R0=Z?.tool_call?.title,T0=R0?`Awaiting approval: ${R0}`:"Awaiting approval",i0=GJ(_,e),A_=(j0,O0,n=null)=>{let i=P6(j0),o=sX(j0,e),Z0=[n,o].filter(Boolean).join(" · "),q0=e6({steerQueued:Q,pulsing:W$(j0)||Boolean(o)});return F`
            <div
                class="agent-thinking agent-thinking-intent"
                aria-live="polite"
                style=${O0?`--turn-color: ${O0};`:""}
                title=${j0?.detail||""}
            >
                <div class="agent-thinking-title intent">
                    ${O0&&F`<span class=${q0} aria-hidden="true"></span>`}
                    <span class="agent-thinking-title-text">${LJ(i,j0)}</span>
                    ${Z0&&F`<span class="agent-status-elapsed">${Z0}</span>`}
                </div>
                ${j0.detail&&F`<div class="agent-thinking-body">${j0.detail}</div>`}
            </div>
        `},q_=(j0,O0,n,i,o,Z0,q0,J0=8,c0=8)=>{let S0=Math.max(o-i,0.000000001),I0=Math.max(O0-J0*2,1),w0=Math.max(n-c0*2,1),l0=Math.max(q0-Z0,1),U0=q0===Z0?O0/2:J0+(j0.run-Z0)/l0*I0,h0=c0+(w0-(j0.value-i)/S0*w0);return{x:U0,y:h0}},H_=(j0,O0,n,i,o,Z0,q0,J0=8,c0=8)=>{if(!Array.isArray(j0)||j0.length===0)return"";return j0.map((S0,I0)=>{let{x:w0,y:l0}=q_(S0,O0,n,i,o,Z0,q0,J0,c0);return`${I0===0?"M":"L"} ${w0.toFixed(2)} ${l0.toFixed(2)}`}).join(" ")},E_=(j0,O0="")=>{if(!Number.isFinite(j0))return"—";return`${Math.abs(j0)>=100?j0.toFixed(0):j0.toFixed(2).replace(/\.0+$/,"").replace(/(\.\d*[1-9])0+$/,"$1")}${O0}`},y_=["var(--accent-color)","var(--success-color)","var(--warning-color, #f59e0b)","var(--danger-color)"],C_=(j0,O0)=>{let n=y_;if(!Array.isArray(n)||n.length===0)return"var(--accent-color)";if(n.length===1||!Number.isFinite(O0)||O0<=1)return n[0];let o=Math.max(0,Math.min(Number.isFinite(j0)?j0:0,O0-1))/Math.max(1,O0-1)*(n.length-1),Z0=Math.floor(o),q0=Math.min(n.length-1,Z0+1),J0=o-Z0,c0=n[Z0],S0=n[q0];if(!S0||Z0===q0||J0<=0.001)return c0;if(J0>=0.999)return S0;let I0=Math.round((1-J0)*1000)/10,w0=Math.round(J0*1000)/10;return`color-mix(in oklab, ${c0} ${I0}%, ${S0} ${w0}%)`},u_=(j0,O0="autoresearch")=>{let n=Array.isArray(j0)?j0.map((U0)=>({...U0,points:Array.isArray(U0?.points)?U0.points.filter((h0)=>Number.isFinite(h0?.value)&&Number.isFinite(h0?.run)):[]})).filter((U0)=>U0.points.length>0):[],i=n.map((U0,h0)=>({...U0,color:C_(h0,n.length)}));if(i.length===0)return null;let o=320,Z0=120,q0=i.flatMap((U0)=>U0.points),J0=q0.map((U0)=>U0.value),c0=q0.map((U0)=>U0.run),S0=Math.min(...J0),I0=Math.max(...J0),w0=Math.min(...c0),l0=Math.max(...c0);return F`
            <div class="agent-series-chart agent-series-chart-combined">
                <div class="agent-series-chart-header">
                    <span class="agent-series-chart-title">Tracked variables</span>
                    <span class="agent-series-chart-value">${i.length} series</span>
                </div>
                <div class="agent-series-chart-plot">
                    <svg class="agent-series-chart-svg" viewBox=${`0 0 ${o} ${Z0}`} preserveAspectRatio="none" aria-hidden="true">
                        ${i.map((U0)=>{let h0=U0?.key||U0?.label||"series",Y_=_0?.panelKey===O0&&_0?.seriesKey===h0;return F`
                                <g key=${h0}>
                                    <path
                                        class=${`agent-series-chart-line${Y_?" is-hovered":""}`}
                                        d=${H_(U0.points,o,Z0,S0,I0,w0,l0)}
                                        style=${`--agent-series-color: ${U0.color};`}
                                        onMouseEnter=${()=>v({panelKey:O0,seriesKey:h0})}
                                        onMouseLeave=${()=>v((G_)=>G_?.panelKey===O0&&G_?.seriesKey===h0?null:G_)}
                                    ></path>
                                </g>
                            `})}
                    </svg>
                    <div class="agent-series-chart-points-layer">
                        ${i.flatMap((U0)=>{let h0=typeof U0?.unit==="string"?U0.unit:"",Y_=U0?.key||U0?.label||"series";return U0.points.map((G_,f0)=>{let W_=q_(G_,o,Z0,S0,I0,w0,l0);return F`
                                    <button
                                        key=${`${Y_}-point-${f0}`}
                                        type="button"
                                        class="agent-series-chart-point-hit"
                                        style=${`--agent-series-color: ${U0.color}; left:${W_.x/o*100}%; top:${W_.y/Z0*100}%;`}
                                        onMouseEnter=${()=>v({panelKey:O0,seriesKey:Y_,run:G_.run,value:G_.value,unit:h0})}
                                        onMouseLeave=${()=>v((B_)=>B_?.panelKey===O0?null:B_)}
                                        onFocus=${()=>v({panelKey:O0,seriesKey:Y_,run:G_.run,value:G_.value,unit:h0})}
                                        onBlur=${()=>v((B_)=>B_?.panelKey===O0?null:B_)}
                                        aria-label=${`${U0?.label||"Series"} ${E_(G_.value,h0)} at run ${G_.run}`}
                                    >
                                        <span class="agent-series-chart-point"></span>
                                    </button>
                                `})})}
                    </div>
                </div>
                <div class="agent-series-legend">
                    ${i.map((U0)=>{let h0=U0.points[U0.points.length-1]?.value,Y_=typeof U0?.unit==="string"?U0.unit:"",G_=U0?.key||U0?.label||"series",f0=_0?.panelKey===O0&&_0?.seriesKey===G_?_0:null,W_=f0&&Number.isFinite(f0.value)?f0.value:h0,B_=f0&&typeof f0.unit==="string"?f0.unit:Y_,d=f0&&Number.isFinite(f0.run)?f0.run:null;return F`
                            <div key=${`${G_}-legend`} class=${`agent-series-legend-item${f0?" is-hovered":""}`} style=${`--agent-series-color: ${U0.color};`}>
                                <span class="agent-series-legend-swatch" style=${`--agent-series-color: ${U0.color};`}></span>
                                <span class="agent-series-legend-label">${U0?.label||"Series"}</span>
                                ${d!==null&&F`<span class="agent-series-legend-run">run ${d}</span>`}
                                <span class="agent-series-legend-value">${E_(W_,B_)}</span>
                            </div>
                        `})}
                </div>
            </div>
        `},D_=(j0)=>{if(!j0)return null;let O0=typeof j0?.key==="string"?j0.key:`panel-${Math.random()}`,n=m.has(O0),i=j0?.title||"Extension status",o=j0?.collapsed_text||"",Z0=String(j0?.state||"").replace(/[-_]+/g," ").replace(/^./,(W_)=>W_.toUpperCase()),q0=d0(j0?.state==="completed"?"success":j0?.state==="failed"?"error":j0?.state==="stopped"?"warning":"info"),J0=e6({steerQueued:Q,pulsing:j0?.state==="running"}),c0=typeof j0?.detail_markdown==="string"?j0.detail_markdown.trim():"",S0=typeof j0?.last_run_text==="string"?j0.last_run_text.trim():"",I0=typeof j0?.tmux_command==="string"?j0.tmux_command.trim():"",w0=Array.isArray(j0?.series)?j0.series:[],l0=Array.isArray(j0?.actions)?j0.actions:[],U0=j0?.started_at?D5(j0,e):null,h0=o,Y_=Boolean(c0||I0||U0),G_=Boolean(c0||w0.length>0||I0),f0=[i,h0].filter(Boolean).join(" — ");return F`
            <div
                class="agent-thinking agent-thinking-intent agent-thinking-autoresearch"
                aria-live="polite"
                data-expanded=${n?"true":"false"}
                style=${q0?`--turn-color: ${q0};`:""}
                title=${!n?f0||i:""}
            >
                <div class="agent-thinking-header agent-thinking-header-inline">
                    <button
                        class="agent-thinking-title intent agent-thinking-title-clickable"
                        type="button"
                        onClick=${()=>G_?G0(O0):null}
                    >
                        ${q0&&F`<span class=${J0} aria-hidden="true"></span>`}
                        <span class="agent-thinking-title-text">${i}</span>
                        ${h0&&F`<span class="agent-thinking-title-meta">${h0}</span>`}
                        ${U0&&F`<span class="agent-status-elapsed">${U0}</span>`}
                    </button>
                    ${(l0.length>0||G_)&&F`
                        <div class="agent-thinking-tools-inline">
                            ${l0.length>0&&F`
                                <div class="agent-thinking-actions agent-thinking-actions-inline">
                                    ${l0.map((W_)=>{let B_=`${O0}:${W_?.key||""}`,d=L?.has?.(B_);return F`
                                            <button
                                                key=${B_}
                                                class=${`agent-thinking-action-btn${W_?.tone==="danger"?" danger":""}`}
                                                onClick=${()=>V?.(j0,W_)}
                                                disabled=${Boolean(d)}
                                            >
                                                ${d?"Working…":W_?.label||"Run"}
                                            </button>
                                        `})}
                                </div>
                            `}
                            ${G_&&F`
                                <button
                                    class="agent-thinking-corner-toggle agent-thinking-corner-toggle-inline"
                                    type="button"
                                    aria-label=${`${n?"Collapse":"Expand"} ${i}`}
                                    title=${n?"Collapse details":"Expand details"}
                                    onClick=${()=>G0(O0)}
                                >
                                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        ${n?F`<polyline points="4 6 8 10 12 6"></polyline>`:F`<polyline points="4 10 8 6 12 10"></polyline>`}
                                    </svg>
                                </button>
                            `}
                        </div>
                    `}
                </div>
                ${n&&F`
                    <div class=${`agent-thinking-autoresearch-layout${Y_?"":" chart-only"}`}>
                        ${Y_&&F`
                            <div class="agent-thinking-autoresearch-meta-stack">
                                ${U0&&F`
                                    <div class="agent-thinking-autoresearch-elapsed">
                                        <span title="Experiment duration">⏱ ${U0}</span>
                                        ${j0?.last_activity_at&&j0?.state==="running"&&F`<span title="Since last activity">⟳ ${gq(j0.last_activity_at)} ago</span>`}
                                    </div>
                                `}
                                ${c0&&F`
                                    <div
                                        class="agent-thinking-body agent-thinking-autoresearch-detail"
                                        dangerouslySetInnerHTML=${{__html:j5(c0)}}
                                    />
                                `}
                                ${I0&&F`
                                    <div class="agent-series-chart-command">
                                        <div class="agent-series-chart-command-header">
                                            <span>Attach to session</span>
                                        </div>
                                        <div class="agent-series-chart-command-shell">
                                            <pre class="agent-series-chart-command-code">${I0}</pre>
                                            <button
                                                type="button"
                                                class="agent-series-chart-command-copy"
                                                aria-label="Copy tmux command"
                                                title="Copy tmux command"
                                                onClick=${()=>V?.(j0,{key:"copy_tmux",action_type:"autoresearch.copy_tmux",label:"Copy tmux"})}
                                            >
                                                ${pz}
                                            </button>
                                        </div>
                                    </div>
                                `}
                            </div>
                        `}
                        ${w0.length>0?F`
                                <div class="agent-series-chart-stack">
                                    ${u_(w0,O0)}
                                    ${S0&&F`<div class="agent-series-chart-note">${S0}</div>`}
                                </div>
                            `:F`<div class="agent-thinking-body agent-thinking-autoresearch-summary">Variable history will appear after the first completed run.</div>`}
                    </div>
                `}
            </div>
        `};return F`
        <div class="agent-status-panel">
            ${B&&X&&A_(X,o0)}
            ${N&&Array.isArray(Y)&&Y.map((j0)=>D_(j0))}
            ${B&&_?.type==="intent"&&A_(_,v0,i0)}
            ${B&&Z&&F`
                <div class="agent-status agent-status-request" aria-live="polite" style=${D0?`--turn-color: ${D0};`:""}>
                    ${m0==="dot"&&F`<span class=${C0} aria-hidden="true"></span>`}
                    ${m0==="spinner"&&F`<div class="agent-status-spinner"></div>`}
                    <span class="agent-status-text">${T0}</span>
                </div>
            `}
            ${B&&M&&E0({panelTitle:g0("Planning"),text:x.text,fullText:x.fullText,totalLines:x.totalLines,panelKey:"plan"})}
            ${B&&J&&E0({panelTitle:g0("Draft"),text:y.text,fullText:y.fullText,totalLines:y.totalLines,maxLines:8,titleClass:"thought",panelKey:"draft"})}
            ${B&&T&&E0({panelTitle:g0("Thoughts"),text:A.text,fullText:A.fullText,totalLines:A.totalLines,maxLines:8,titleClass:"thought",panelKey:"thought"})}
            ${B&&C&&E0({panelTitle:g0("Output"),text:W.text,fullText:W.fullText,totalLines:W.totalLines,maxLines:5,titleClass:"tool-output",panelKey:"tool-output"})}
            ${B&&_&&_?.type!=="intent"&&F`
                <div class=${`agent-status${B0?" agent-status-last-activity":""}${_?.type==="error"?" agent-status-error":""}${b0||A0.length>0||n0?" agent-status-multiline":""}`} aria-live="polite" style=${D0?`--turn-color: ${D0};`:""}>
                    ${D0&&p0&&F`<span class=${C0} aria-hidden="true"></span>`}
                    ${_?.type==="error"?F`<span class="agent-status-error-icon" aria-hidden="true">⚠</span>`:j_==="spinner"&&F`<div class="agent-status-spinner"></div>`}
                    <div class="agent-status-copy">
                        <span class="agent-status-text">${YJ(a0,_)}</span>
                        ${(b0||L_.length>0||n0)&&F`
                            <span class="agent-status-meta-row">
                                ${e0.map((j0)=>F`
                                    <span key=${j0.key} class="agent-status-hint-row" title=${j0.title||j0.label}>
                                        <span class="agent-status-hint-icon" dangerouslySetInnerHTML=${{__html:j0.iconSvg}}></span>
                                        <span class="agent-status-hint-label">${j0.label}</span>
                                    </span>
                                `)}
                                ${b0&&F`
                                    <span class="agent-status-git-row" title=${K0||b0}>
                                        <span class="agent-status-git-icon">${dz}</span>
                                        <span class="agent-status-git-label">
                                            ${N_&&F`<span class="agent-status-git-part">${N_}</span>`}
                                            ${N_&&t0&&F`<span class="agent-status-git-separator" aria-hidden="true">•</span>`}
                                            ${t0&&F`<span class="agent-status-git-part">${t0}</span>`}
                                        </span>
                                    </span>
                                `}
                                ${z_.map((j0)=>F`
                                    <span key=${j0.key} class="agent-status-hint-row" title=${j0.title||j0.label}>
                                        <span class="agent-status-hint-icon" dangerouslySetInnerHTML=${{__html:j0.iconSvg}}></span>
                                        <span class="agent-status-hint-label">${j0.label}</span>
                                    </span>
                                `)}
                                ${n0&&F`
                                    <span class="agent-status-hint-row agent-status-activity-row" title=${`${B0?"Recent activity":"Last event"} ${n0}`}>
                                        <span class="agent-status-hint-icon">${iz}</span>
                                        <span class="agent-status-hint-label">${n0}</span>
                                    </span>
                                `}
                            </span>
                        `}
                    </div>
                </div>
            `}
        </div>
    `}function bq({request:_,onRespond:$}){if(!_)return null;let{request_id:j,tool_call:G,options:Z,chat_jid:X}=_,Y=G?.title||"Agent Request",L=G?.kind||"other",V=G?.rawInput||{},q=V.command||V.commands&&V.commands[0]||null,Q=V.diff||null,K=V.fileName||V.path||null,B=G?.description||V.description||V.explanation||null,U=(Array.isArray(G?.locations)?G.locations:[]).map((z)=>z?.path).filter((z)=>Boolean(z)),D=Array.from(new Set([K,...U].filter(Boolean)));console.log("AgentRequestModal:",{request_id:j,tool_call:G,options:Z});let H=async(z)=>{try{await H2(j,z,X||null),$()}catch(O){console.error("Failed to respond to agent request:",O)}},E=async()=>{try{await J7(Y,`Auto-approved: ${Y}`),await H2(j,"approved",X||null),$()}catch(z){console.error("Failed to add to whitelist:",z)}},k=Z&&Z.length>0;return F`
        <div class="agent-request-modal">
            <div class="agent-request-content">
                <div class="agent-request-header">
                    <div class="agent-request-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <div class="agent-request-title">${Y}</div>
                </div>
                ${(B||q||Q||D.length>0)&&F`
                    <div class="agent-request-body">
                        ${B&&F`
                            <div class="agent-request-description">${B}</div>
                        `}
                        ${D.length>0&&F`
                            <div class="agent-request-files">
                                <div class="agent-request-subtitle">Files</div>
                                <ul>
                                    ${D.map((z,O)=>F`<li key=${O}>${z}</li>`)}
                                </ul>
                            </div>
                        `}
                        ${q&&F`
                            <pre class="agent-request-command">${q}</pre>
                        `}
                        ${Q&&F`
                            <details class="agent-request-diff">
                                <summary>Proposed diff</summary>
                                <pre>${Q}</pre>
                            </details>
                        `}
                    </div>
                `}
                <div class="agent-request-actions">
                    ${k?Z.map((z)=>F`
                            <button 
                                key=${z.optionId||z.id||String(z)}
                                class="agent-request-btn ${z.kind==="allow_once"||z.kind==="allow_always"?"primary":""}"
                                onClick=${()=>H(z.optionId||z.id||z)}
                            >
                                ${z.name||z.label||z.optionId||z.id||String(z)}
                            </button>
                        `):F`
                        <button class="agent-request-btn primary" onClick=${()=>H("approved")}>
                            Allow
                        </button>
                        <button class="agent-request-btn" onClick=${()=>H("denied")}>
                            Deny
                        </button>
                        <button class="agent-request-btn always-allow" onClick=${E}>
                            Always Allow This
                        </button>
                    `}
                </div>
            </div>
        </div>
    `}M0();M0();I_();function M5(_){if(_==null)return"";if(typeof _==="string")return _.trim();if(typeof _==="number")return String(_);if(typeof _==="boolean")return _?"yes":"no";if(Array.isArray(_))return _.map(($)=>M5($)).filter(Boolean).join(", ");if(typeof _==="object")return Object.entries(_).filter(([$])=>!$.startsWith("__")).map(([$,j])=>`${$}: ${M5(j)}`).filter(($)=>!$.endsWith(": ")).join(", ");return String(_).trim()}function vq(_){if(typeof _!=="object"||_==null||Array.isArray(_))return[];return Object.entries(_).filter(([$])=>!$.startsWith("__")).map(([$,j])=>({key:$,value:M5(j)})).filter(($)=>$.value)}function qJ(_){if(!_||typeof _!=="object")return!1;let $=_;return $.type==="adaptive_card_submission"&&typeof $.card_id==="string"&&typeof $.source_post_id==="number"&&typeof $.submitted_at==="string"}function c9(_){if(!Array.isArray(_))return[];return _.filter(qJ)}function K8(_){let $=String(_.title||_.card_id||"card").trim()||"card",j=_.data;if(j==null)return`Card submission: ${$}`;if(typeof j==="string"||typeof j==="number"||typeof j==="boolean"){let G=M5(j);return G?`Card submission: ${$} — ${G}`:`Card submission: ${$}`}if(typeof j==="object"){let Z=vq(j).map(({key:X,value:Y})=>`${X}: ${Y}`);return Z.length>0?`Card submission: ${$} — ${Z.join(", ")}`:`Card submission: ${$}`}return`Card submission: ${$}`}function mq(_){let $=String(_.title||_.card_id||"Card submission").trim()||"Card submission",j=vq(_.data),G=j.length>0?j.slice(0,2).map(({key:X,value:Y})=>`${X}: ${Y}`).join(", "):M5(_.data)||null,Z=j.length;return{title:$,summary:G,fields:j,fieldCount:Z,submittedAt:_.submitted_at}}function P_(_){return typeof _==="string"?_.trim():""}function cq(_){return _.map(($)=>String($||"").trim()).filter(Boolean).join(`

`).replace(/\n{3,}/g,`

`).trim()}function VJ(_,$){let j=[],G=[],Z=[];if(_.forEach((X,Y)=>{if(!X||typeof X!=="object")return;let L=P_(X.type);if(L==="text"){let V=P_(X.text)||P_(X.content);if(V)j.push(V);return}if(L==="resource_link"){let V=P_(X.uri),q=P_(X.title)||P_(X.name)||V;if(V&&q)j.push(q===V?V:`[${q}](${V})`);return}if(L==="resource"){let V=P_(X.title)||P_(X.name)||P_(X.uri)||"Embedded resource",q=P_(X.text);if(q)j.push(`### ${V}

\`\`\`
${q}
\`\`\``);else j.push(`### ${V}`);return}if(L==="generated_widget"){let V=P_(X.title)||P_(X.name)||"Generated widget",q=P_(X.description)||P_(X.subtitle);j.push(cq([`### ${V}`,q]));return}if(L==="adaptive_card"&&P_(X.fallback_text)){j.push(P_(X.fallback_text));return}if(L==="adaptive_card_submission"){let V=K8(X);if(P_(V))j.push(P_(V));return}if(L==="file"){let V=P_(X.name)||P_(X.filename)||P_(X.title)||`attachment:${$[Y]??Y+1}`;G.push(`- ${V}`);return}if(L==="image"||!L){let V=P_(X.name)||P_(X.filename)||P_(X.title)||`attachment:${$[Y]??Y+1}`;Z.push(`- ${V}`)}}),Z.length>0)j.push(`Images:
${Z.join(`
`)}`);if(G.length>0)j.push(`Attachments:
${G.join(`
`)}`);return cq(j)}function Q8(_){let $=_?.data||{},j=typeof $.content==="string"?$.content.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trimEnd():"";if(j.trim())return j;let G=Array.isArray($.content_blocks)?$.content_blocks:[],Z=Array.isArray($.media_ids)?$.media_ids:[];return VJ(G,Z)}function lq(_,$,j){try{return _.setAttribute($,j),!0}catch(G){return!1}}function hq(_,$){try{return _[$]=!0,!0}catch(j){return!1}}function nq(_){_.classList.add("adaptive-card-readonly");for(let $ of Array.from(_.querySelectorAll("input, textarea, select, button"))){let j=$;if(lq(j,"aria-disabled","true"),lq(j,"tabindex","-1"),"disabled"in j)hq(j,"disabled");if("readOnly"in j)hq(j,"readOnly")}}function KJ(_){let j=String(_||"").trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(!j)return null;let G=j[1].length===3?j[1].split("").map((Z)=>`${Z}${Z}`).join(""):j[1];return{r:parseInt(G.slice(0,2),16),g:parseInt(G.slice(2,4),16),b:parseInt(G.slice(4,6),16)}}function QJ(_){let j=String(_||"").trim().match(/^rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);if(!j)return null;let G=Number(j[1]),Z=Number(j[2]),X=Number(j[3]);if(![G,Z,X].every((Y)=>Number.isFinite(Y)))return null;return{r:G,g:Z,b:X}}function rq(_){return KJ(_)||QJ(_)}function N8(_){let $=(X)=>{let Y=X/255;return Y<=0.03928?Y/12.92:((Y+0.055)/1.055)**2.4},j=$(_.r),G=$(_.g),Z=$(_.b);return 0.2126*j+0.7152*G+0.0722*Z}function NJ(_,$){let j=Math.max(N8(_),N8($)),G=Math.min(N8(_),N8($));return(j+0.05)/(G+0.05)}function BJ(_,$,j="#ffffff"){let G=rq(_);if(!G)return j;let Z=j,X=-1;for(let Y of $){let L=rq(Y);if(!L)continue;let V=NJ(G,L);if(V>X)Z=Y,X=V}return Z}function l9(){let _=getComputedStyle(document.documentElement),$=(U,D)=>{for(let H of U){let E=_.getPropertyValue(H).trim();if(E)return E}return D},j=$(["--text-primary","--color-text"],"#0f1419"),G=$(["--text-secondary","--color-text-muted"],"#536471"),Z=$(["--bg-primary","--color-bg-primary"],"#ffffff"),X=$(["--bg-secondary","--color-bg-secondary"],"#f7f9fa"),Y=$(["--bg-hover","--bg-tertiary","--color-bg-tertiary"],"#e8ebed"),L=$(["--accent-color","--color-accent"],"#1d9bf0"),V=$(["--success-color","--color-success"],"#00ba7c"),q=$(["--warning-color","--color-warning","--accent-color"],"#f0b429"),Q=$(["--danger-color","--color-error"],"#f4212e"),K=$(["--border-color","--color-border"],"#eff3f4"),B=$(["--font-family"],"system-ui, sans-serif"),N=BJ(L,[j,Z],j);return{fg:j,fgMuted:G,bgPrimary:Z,bg:X,bgEmphasis:Y,accent:L,good:V,warning:q,attention:Q,border:K,fontFamily:B,buttonTextColor:N}}function pq(){let{fg:_,fgMuted:$,bg:j,bgEmphasis:G,accent:Z,good:X,warning:Y,attention:L,border:V,fontFamily:q}=l9();return{fontFamily:q,containerStyles:{default:{backgroundColor:j,foregroundColors:{default:{default:_,subtle:$},accent:{default:Z,subtle:Z},good:{default:X,subtle:X},warning:{default:Y,subtle:Y},attention:{default:L,subtle:L}}},emphasis:{backgroundColor:G,foregroundColors:{default:{default:_,subtle:$},accent:{default:Z,subtle:Z},good:{default:X,subtle:X},warning:{default:Y,subtle:Y},attention:{default:L,subtle:L}}}},actions:{actionsOrientation:"horizontal",actionAlignment:"left",buttonSpacing:8,maxActions:5,showCard:{actionMode:"inline"},spacing:"default"},adaptiveCard:{allowCustomStyle:!1},spacing:{small:4,default:8,medium:12,large:16,extraLarge:24,padding:12},separator:{lineThickness:1,lineColor:V},fontSizes:{small:12,default:14,medium:16,large:18,extraLarge:22},fontWeights:{lighter:300,default:400,bolder:600},imageSizes:{small:40,medium:80,large:120},textBlock:{headingLevel:2}}}var FJ=new Set(["1.0","1.1","1.2","1.3","1.4","1.5","1.6"]),dq=!1,B8=null,iq=!1;function h9(_){_.querySelector(".adaptive-card-notice")?.remove()}function UJ(_,$,j="error"){h9(_);let G=document.createElement("div");G.className=`adaptive-card-notice adaptive-card-notice-${j}`,G.textContent=$,_.appendChild(G)}function EJ(_,$=(j)=>Z1(j,null)){let j=typeof _==="string"?_:String(_??"");if(!j.trim())return{outputHtml:"",didProcess:!1};return{outputHtml:$(j),didProcess:!0}}function HJ(_=($)=>Z1($,null)){return($,j)=>{try{let G=EJ($,_);j.outputHtml=G.outputHtml,j.didProcess=G.didProcess}catch(G){console.error("[adaptive-card] Failed to process markdown:",G),j.outputHtml=String($??""),j.didProcess=!1}}}function DJ(_){if(iq||!_?.AdaptiveCard)return;_.AdaptiveCard.onProcessMarkdown=HJ(),iq=!0}async function WJ(){if(dq)return;if(B8)return B8;return B8=new Promise((_,$)=>{let j=document.createElement("script");j.src="/static/js/vendor/adaptivecards.min.js",j.onload=()=>{dq=!0,_()},j.onerror=()=>$(Error("Failed to load adaptivecards SDK")),document.head.appendChild(j)}),B8}function OJ(){return globalThis.AdaptiveCards}function zJ(_){if(!_||typeof _!=="object")return!1;let $=_;return $.type==="adaptive_card"&&typeof $.card_id==="string"&&typeof $.schema_version==="string"&&typeof $.payload==="object"&&$.payload!==null}function JJ(_){return FJ.has(_)}function r9(_){if(!Array.isArray(_))return[];return _.filter(zJ)}function AJ(_){let $=(typeof _?.getJsonTypeName==="function"?_.getJsonTypeName():"")||_?.constructor?.name||"Unknown",j=(typeof _?.title==="string"?_.title:"")||"",G=(typeof _?.url==="string"?_.url:"")||void 0,Z=_?.data??void 0;return{type:$,title:j,data:Z,url:G,raw:_}}function n9(_){if(_==null)return"";if(typeof _==="string")return _.trim();if(typeof _==="number")return String(_);if(typeof _==="boolean")return _?"yes":"no";if(Array.isArray(_))return _.map(($)=>n9($)).filter(Boolean).join(", ");if(typeof _==="object")return Object.entries(_).map(([j,G])=>`${j}: ${n9(G)}`).filter((j)=>!j.endsWith(": ")).join(", ");return String(_).trim()}function kJ(_,$,j){if($==null)return $;if(_==="Input.Toggle"){if(typeof $==="boolean"){if($)return j?.valueOn??"true";return j?.valueOff??"false"}return typeof $==="string"?$:String($)}if(_==="Input.ChoiceSet"){if(Array.isArray($))return $.join(",");return typeof $==="string"?$:String($)}if(Array.isArray($))return $.join(", ");if(typeof $==="object")return n9($);return typeof $==="string"?$:String($)}function yJ(_,$){if(!_||typeof _!=="object")return _;if(!$||typeof $!=="object"||Array.isArray($))return _;let j=$,G=(Z)=>{if(Array.isArray(Z))return Z.map((L)=>G(L));if(!Z||typeof Z!=="object")return Z;let Y={...Z};if(typeof Y.id==="string"&&Y.id in j&&String(Y.type||"").startsWith("Input."))Y.value=kJ(Y.type,j[Y.id],Y);for(let[L,V]of Object.entries(Y))if(Array.isArray(V)||V&&typeof V==="object")Y[L]=G(V);return Y};return G(_)}function MJ(_){if(typeof _!=="string"||!_.trim())return"";let $=new Date(_);if(Number.isNaN($.getTime()))return"";return new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format($)}function wJ(_){if(_.state==="active")return null;let $=_.state==="completed"?"Submitted":_.state==="cancelled"?"Cancelled":"Failed",j=_.last_submission&&typeof _.last_submission==="object"?_.last_submission:null,G=j&&typeof j.title==="string"?j.title.trim():"",Z=MJ(_.completed_at||j?.submitted_at),X=[G||null,Z||null].filter(Boolean).join(" · ")||null;return{label:$,detail:X}}async function oq(_,$,j){if(!JJ($.schema_version))return console.warn(`[adaptive-card] Unsupported schema version ${$.schema_version} for card ${$.card_id}`),!1;try{await WJ()}catch(G){return console.error("[adaptive-card] Failed to load SDK:",G),!1}try{let G=OJ();DJ(G);let Z=new G.AdaptiveCard,X=l9();Z.hostConfig=new G.HostConfig(pq());let Y=$.last_submission&&typeof $.last_submission==="object"?$.last_submission.data:void 0,L=$.state==="active"?$.payload:yJ($.payload,Y);Z.parse(L),Z.onExecuteAction=(Q)=>{let K=AJ(Q);if(j?.onAction)h9(_),_.classList.add("adaptive-card-busy"),Promise.resolve(j.onAction(K)).catch((B)=>{console.error("[adaptive-card] Action failed:",B);let N=B instanceof Error?B.message:String(B||"Action failed.");UJ(_,N||"Action failed.","error")}).finally(()=>{_.classList.remove("adaptive-card-busy")});else console.log("[adaptive-card] Action executed (not wired yet):",K)};let V=Z.render();if(!V)return console.warn(`[adaptive-card] Card ${$.card_id} rendered to null`),!1;_.classList.add("adaptive-card-container"),_.style.setProperty("--adaptive-card-button-text-color",X.buttonTextColor);let q=wJ($);if(q){_.classList.add("adaptive-card-finished");let Q=document.createElement("div");Q.className=`adaptive-card-status adaptive-card-status-${$.state}`;let K=document.createElement("span");if(K.className="adaptive-card-status-label",K.textContent=q.label,Q.appendChild(K),q.detail){let B=document.createElement("span");B.className="adaptive-card-status-detail",B.textContent=q.detail,Q.appendChild(B)}_.appendChild(Q)}if(h9(_),_.appendChild(V),q)nq(V);return!0}catch(G){return console.error(`[adaptive-card] Failed to render card ${$.card_id}:`,G),!1}}M0();S6();function sq({src:_,onClose:$}){return u(()=>{let j=(G)=>{if(G.key==="Escape")$()};return document.addEventListener("keydown",j),()=>document.removeEventListener("keydown",j)},[$]),F`
        <${p$} className="image-modal-portal-root">
            <div class="image-modal" onClick=${$}>
                <img src=${_} alt="Full size" />
            </div>
        </${p$}>
    `}var F8=0,p9=null,w5={activePostId:null,speaking:!1},d9=new Set;function o9(_={}){return _.window??(typeof window<"u"?window:null)}function aq(_={}){return o9(_)?.speechSynthesis||null}function i9(){let _={...w5};for(let $ of d9)try{$(_)}catch(j){console.warn("[post-speech] playback listener failed:",j)}}function s9(){return{...w5}}function tq(_){if(typeof _!=="function")return()=>{};return d9.add(_),_(s9()),()=>d9.delete(_)}function eq(_={}){let $=o9(_);return Boolean($&&$.speechSynthesis&&typeof $.SpeechSynthesisUtterance==="function")}function _V(_){let $=Q8(_);if(!$)return"";return String($).replace(/```[\s\S]*?```/g," Code block omitted. ").replace(/`([^`]+)`/g,"$1").replace(/!\[([^\]]*)\]\(([^)]+)\)/g,"$1").replace(/\[([^\]]+)\]\(([^)]+)\)/g,"$1").replace(/^#{1,6}\s+/gm,"").replace(/^>\s?/gm,"").replace(/^[-*+]\s+/gm,"• ").replace(/\n{3,}/g,`

`).replace(/\n\n+/g,". ").replace(/\s+/g," ").replace(/\s+([.,;:!?])/g,"$1").trim().slice(0,1600)}function $V(_={}){let $=aq(_);if(F8+=1,p9=null,w5={activePostId:null,speaking:!1},$)try{$.cancel()}catch(j){console.warn("[post-speech] cancel failed:",j)}i9()}function jV(_,$,j={}){let G=o9(j),Z=aq(j);if(!G||!Z||typeof G.SpeechSynthesisUtterance!=="function")return!1;let X=String($||"").trim();if(!X)return!1;let Y=F8+1;F8=Y;try{Z.cancel()}catch{}let L=new G.SpeechSynthesisUtterance(X);p9=L,w5={activePostId:_,speaking:!0},i9();let V=()=>{if(Y!==F8)return;p9=null,w5={activePostId:null,speaking:!1},i9()};L.onend=V,L.onerror=V;try{return Z.speak(L),!0}catch(q){return console.warn("[post-speech] speak failed:",q),V(),!1}}async function ZV(_,$){try{return await _?.writeText?.($),!0}catch(j){return!1}}function a9(_,$){let j=typeof $?.text==="string"?$.text:"",G=typeof $?.html==="string"?$.html:"";if(!_||!j||typeof _.createElement!=="function"||typeof _.execCommand!=="function")return!1;let Z=null,X=!1,Y=(L)=>{let V=L?.clipboardData;if(!V||typeof V.setData!=="function")return;if(V.setData("text/plain",j),G)V.setData("text/html",G);if(typeof L.preventDefault==="function")L.preventDefault();X=!0};try{if(Z=_.createElement("textarea"),Z.value=j,typeof Z.setAttribute==="function")Z.setAttribute("readonly","");if(Z.style)Z.style.position="fixed",Z.style.opacity="0",Z.style.pointerEvents="none";if(_.body?.appendChild?.(Z),typeof Z.select==="function")Z.select();if(typeof Z.setSelectionRange==="function")Z.setSelectionRange(0,Z.value.length);_.addEventListener?.("copy",Y,!0);let L=_.execCommand("copy");return Boolean(X||L)}catch{return!1}finally{if(_.removeEventListener?.("copy",Y,!0),Z)_.body?.removeChild?.(Z)}}function GV(_){if(!_||typeof _!=="object")return null;let $=_;if(typeof $.nodeType==="number"&&$.nodeType===3)return $.parentNode||null;return $}function XV(_,$){let j=_?.clipboardData,G=$?.root,Z=$?.selection;if(!j||typeof j.setData!=="function"||!G||!Z)return!1;if(Z.isCollapsed)return!1;let X=!1;if(Number(Z.rangeCount||0)>0&&typeof Z.getRangeAt==="function")try{let V=Z.getRangeAt(0);if(V&&typeof V.intersectsNode==="function")X=Boolean(V.intersectsNode(G))}catch{X=!1}if(!X&&typeof G.contains==="function"){let V=GV(Z.anchorNode),q=GV(Z.focusNode);X=Boolean(V&&G.contains(V)||q&&G.contains(q))}if(!X)return!1;let L=typeof Z.toString==="function"?String(Z.toString()||"").replace(/\u00a0/g," "):"";if(!L)return!1;return j.setData("text/plain",L),_?.preventDefault?.(),!0}function YV(_,$){try{return Boolean(_?.getItem?.($))}catch(j){return!1}}function LV(_,$,j){try{return _?.setItem?.($,j),!0}catch(G){return!1}}function qV(_,$){let j=typeof _==="string"&&_.trim()?_.trim():null;if(j)return j;if(!$)return null;try{return new URL($).hostname}catch(G){return $}}function TJ({mediaId:_,onPreview:$}){let[j,G]=f(null);if(u(()=>{M6(_).then(G).catch((q)=>{console.warn("[post] Failed to load attachment metadata for file card:",_,q)})},[_]),!j)return null;let Z=j.filename||"file",X=j.metadata?.size,Y=X?a_(X):"",V=y5(j.content_type,j.filename)!=="unsupported";return F`
        <div class="file-attachment" onClick=${(q)=>q.stopPropagation()}>
            <a href=${u1(_)} download=${Z} class="file-attachment-main">
                <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                </svg>
                <div class="file-info">
                    <span class="file-name">${Z}</span>
                    <span class="file-meta-row">
                        ${Y&&F`<span class="file-size">${Y}</span>`}
                        ${j.content_type&&F`<span class="file-size">${j.content_type}</span>`}
                    </span>
                </div>
                <svg class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
            </a>
            ${V&&F`
                <button
                    class="file-attachment-preview"
                    type="button"
                    onClick=${(q)=>{q.preventDefault(),q.stopPropagation(),$?.({mediaId:_,info:j})}}
                >
                    Preview
                </button>
            `}
        </div>
    `}function xJ(_){if(!Array.isArray(_))return[];return _.filter(($)=>$&&typeof $==="object"&&$.type==="recovery_marker"&&$.recovered)}function IJ(_){if(!Array.isArray(_))return[];return _.filter(($)=>$&&typeof $==="object"&&$.type==="timeout_marker"&&($.timed_out??!0))}function CJ(_){if(!Array.isArray(_))return[];return _.filter(($)=>$&&typeof $==="object"&&$.type==="turn_outcome_marker")}function fJ(_){if(!Array.isArray(_))return[];return _.filter(($)=>$&&typeof $==="object"&&$.type==="peer_message")}function PJ(_){return String(_||"").split(/[:/]/).filter(Boolean).pop()||"agent"}function VV(_){let $=fJ(_)[0]||null;if(!$)return null;let j=typeof $.source_chat_jid==="string"?$.source_chat_jid.trim():"",G=typeof $.source_agent_name==="string"&&$.source_agent_name.trim()?$.source_agent_name.trim():PJ(j),Z=typeof $.target_chat_jid==="string"?$.target_chat_jid.trim():"",X=typeof $.target_agent_name==="string"?$.target_agent_name.trim():"",Y=typeof $.body==="string"?$.body:"";return{block:$,sourceChatJid:j,sourceAgentName:G,targetChatJid:Z,targetAgentName:X,body:Y}}function RJ(_,$){let j=VV($),G=typeof _==="string"?_:"";if(!j)return G;if(j.body&&j.body.trim())return j.body;let Z=j.sourceAgentName?j.sourceAgentName.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"):"[^\\s>]+",X=j.sourceChatJid?j.sourceChatJid.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"):"[^>\\n]+";return G.replace(new RegExp(`^from:\\s+@${Z}\\s+<jid:${X}>\\s*\\n\\n`,"i"),"")||G}var SJ={context_recover:"context limit exceeded",rate_limit:"rate limit hit",api_error:"API error",timeout:"request timeout",overloaded:"service overloaded",connection:"connection error"};function uJ(_){let $=Number(_?.attempts_used||0),j=String(_?.classifier||"").trim(),G=SJ[j]||(j?j.replace(/_/g," "):""),Z=["Recovered automatically"];if($>1)Z[0]=`Recovered after ${$} attempts`;if(G)Z.push(G);return Z.join(" — ")}function gJ(_){let $=typeof _?.tool_action_summary==="string"?_.tool_action_summary.trim():"",j=_?.draft_recovered?" Showing recovered draft.":"";return $?`Turn timed out — ${$}${j}`:`Turn timed out before the model finished responding${j}`}function bJ({marker:_}){let[$,j]=f(!1),G=R((K)=>{K.stopPropagation(),j((B)=>!B)},[]),Z=typeof _?.title==="string"?_.title.trim():"",X=typeof _?.detail==="string"?_.detail.trim():"",Y=typeof _?.tool_action_summary==="string"?_.tool_action_summary.trim():"",L=_?.draft_recovered,V=String(_?.severity||"warning"),q=Y||Z||String(_?.label||_?.kind||"issue"),Q=Boolean(X||Z&&Y);return F`
        <div class=${`post-outcome-pill post-outcome-pill-${V}`}>
            <div class="post-outcome-pill-header" onClick=${Q?G:void 0}>
                ${Q&&F`
                    <span class=${`post-outcome-pill-toggle${$?" expanded":""}`} aria-hidden="true">▶</span>
                `}
                <span class="post-outcome-pill-label">${q}</span>
                ${L&&F`<span class="post-outcome-pill-badge">draft recovered</span>`}
            </div>
            ${$&&Q&&F`
                <div class="post-outcome-pill-detail">
                    ${Z&&F`<div><strong>${Z}</strong></div>`}
                    ${X&&X!==Z&&F`<div>${X}</div>`}
                </div>
            `}
        </div>
    `}function vJ({attachment:_,onPreview:$}){let j=Number(_?.id),[G,Z]=f(null);u(()=>{if(!Number.isFinite(j))return;M6(j).then(Z).catch((Q)=>{console.warn("[post] Failed to load attachment metadata for attachment pill:",j,Q)});return},[j]);let X=G?.filename||_.label||`attachment-${_.id}`,Y=Number.isFinite(j)?u1(j):null,L=y5(G?.content_type,G?.filename||_?.label),V=q8(L),q=L!=="unsupported";return F`
        <span class="attachment-pill" title=${X}>
            ${Y?F`
                    <a href=${Y} download=${X} class="attachment-pill-main" onClick=${(Q)=>Q.stopPropagation()}>
                        <${L1}
                            prefix="post"
                            label=${_.label}
                            title=${X}
                        />
                    </a>
                `:F`
                    <${L1}
                        prefix="post"
                        label=${_.label}
                        title=${X}
                    />
                `}
            ${Number.isFinite(j)&&G&&q&&F`
                <button
                    class="attachment-pill-preview"
                    type="button"
                    title=${V}
                    onClick=${(Q)=>{Q.preventDefault(),Q.stopPropagation(),$?.({mediaId:j,info:G})}}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </button>
            `}
        </span>
    `}function U8({annotations:_}){if(!_)return null;let{audience:$,priority:j,lastModified:G}=_,Z=G?T4(G):null;return F`
        <div class="content-annotations">
            ${$&&$.length>0&&F`
                <span class="content-annotation">Audience: ${$.join(", ")}</span>
            `}
            ${typeof j==="number"&&F`
                <span class="content-annotation">Priority: ${j}</span>
            `}
            ${Z&&F`
                <span class="content-annotation">Updated: ${Z}</span>
            `}
        </div>
    `}function mJ({block:_}){let $=_.title||_.name||_.uri,j=_.description,G=_.size?a_(_.size):"",Z=_.mime_type||"",X=hJ(Z),Y=J4(_.uri);return F`
        <a
            href=${Y||"#"}
            class="resource-link"
            target=${Y?"_blank":void 0}
            rel=${Y?"noopener noreferrer":void 0}
            onClick=${(L)=>L.stopPropagation()}>
            <div class="resource-link-main">
                <div class="resource-link-header">
                    <span class="resource-link-icon-inline">${X}</span>
                    <div class="resource-link-title">${$}</div>
                </div>
                ${j&&F`<div class="resource-link-description">${j}</div>`}
                <div class="resource-link-meta">
                    ${Z&&F`<span>${Z}</span>`}
                    ${G&&F`<span>${G}</span>`}
                </div>
            </div>
            <div class="resource-link-icon">↗</div>
        </a>
    `}function cJ({block:_}){let[$,j]=f(!1),G=_.uri||"Embedded resource",Z=_.text||"",X=Boolean(_.data),Y=_.mime_type||"";return F`
        <div class="resource-embed">
            <button class="resource-embed-toggle" onClick=${(L)=>{L.preventDefault(),L.stopPropagation(),j(!$)}}>
                ${$?"▼":"▶"} ${G}
            </button>
            ${$&&F`
                ${Z&&F`<pre class="resource-embed-content">${Z}</pre>`}
                ${X&&F`
                    <div class="resource-embed-blob">
                        <span class="resource-embed-blob-label">Embedded blob</span>
                        ${Y&&F`<span class="resource-embed-blob-meta">${Y}</span>`}
                        <button class="resource-embed-blob-btn" onClick=${(L)=>{L.preventDefault(),L.stopPropagation();let V=new Blob([Uint8Array.from(atob(_.data),(K)=>K.charCodeAt(0))],{type:Y||"application/octet-stream"}),q=URL.createObjectURL(V),Q=document.createElement("a");Q.href=q,Q.download=G.split("/").pop()||"resource",Q.click(),URL.revokeObjectURL(q)}}>Download</button>
                    </div>
                `}
            `}
        </div>
    `}function lJ({block:_,post:$,onOpenWidget:j}){if(!_)return null;let G=S9(_,$),Z=pL(_),X=G?.artifact?.kind||_?.artifact?.kind||_?.kind||null,Y=G?.title||_.title||_.name||"Generated widget",L=G?.description||_.description||_.subtitle||"",V=_.open_label||"Open widget",q=g(!1),Q=(K)=>{if(K)K.preventDefault(),K.stopPropagation();if(!G)return;j?.(G)};return u(()=>{if(!_?.auto_open||!G||!Z||q.current)return;let K=$?.timestamp?new Date($.timestamp).getTime():0;if(K&&Date.now()-K>1e4)return;let B=`widget_opened_${_.widget_id||$?.id||""}`;if(YV(sessionStorage,B))return;q.current=!0,LV(sessionStorage,B,"1"),j?.(G)},[_?.auto_open,G,Z]),F`
        <div class="generated-widget-launch" onClick=${(K)=>K.stopPropagation()}>
            <div class="generated-widget-launch-header">
                <div class="generated-widget-launch-eyebrow">Generated widget${X?` • ${String(X).toUpperCase()}`:""}</div>
                <div class="generated-widget-launch-title">${Y}</div>
            </div>
            ${L&&F`<div class="generated-widget-launch-description">${L}</div>`}
            <div class="generated-widget-launch-actions">
                <button
                    class="generated-widget-launch-btn"
                    type="button"
                    disabled=${!Z}
                    onClick=${Q}
                    title=${Z?"Open widget in a floating pane with a zen-mode toggle":"Unsupported widget artifact"}
                >
                    ${V}
                </button>
                <span class="generated-widget-launch-note">
                    ${Z?"Opens in a dismissible floating pane with a zen-mode toggle.":"This widget artifact is missing or unsupported."}
                </span>
            </div>
        </div>
    `}function hJ(_){if(!_)return"\uD83D\uDCCE";if(_.startsWith("image/"))return"\uD83D\uDDBC️";if(_.startsWith("audio/"))return"\uD83C\uDFB5";if(_.startsWith("video/"))return"\uD83C\uDFAC";if(_.includes("pdf"))return"\uD83D\uDCC4";if(_.includes("zip")||_.includes("gzip"))return"\uD83D\uDDDC️";if(_.startsWith("text/"))return"\uD83D\uDCC4";return"\uD83D\uDCCE"}function nJ(_){let $=J4(_,{allowDataImage:!0});return $?{backgroundImage:`url("${$}")`}:void 0}function rJ({preview:_}){let $=J4(_.url),j=nJ(_.image),G=qV(_.site_name,$);return F`
        <a
            href=${$||"#"}
            class="link-preview ${j?"has-image":""}"
            target=${$?"_blank":void 0}
            rel=${$?"noopener noreferrer":void 0}
            onClick=${(Z)=>Z.stopPropagation()}
            style=${j}>
            <div class="link-preview-overlay">
                <div class="link-preview-site">${G||""}</div>
                <div class="link-preview-title">${_.title}</div>
                ${_.description&&F`
                    <div class="link-preview-description">${_.description}</div>
                `}
            </div>
        </a>
    `}function pJ(_,$){return typeof _==="string"?_:""}var KV=1800,dJ=40,iJ=24576,oJ=16,sJ=`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="9" y="9" width="10" height="10" rx="2"></rect>
        <path d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"></path>
    </svg>`,aJ=`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20 6L9 17l-5-5"></path>
    </svg>`,tJ=`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M9 9l6 6M15 9l-6 6"></path>
    </svg>`,eJ=`
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
</style>`;function _A(_,$={}){let j=typeof _==="string"?_:"",G=j?j.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`):[],Z=new TextEncoder().encode(j).byteLength,X=Number.isFinite($.lineThreshold)?$.lineThreshold:dJ,Y=Number.isFinite($.byteThreshold)?$.byteThreshold:iJ,L=G.length>X||Z>Y,V=Math.min(G.length,Number.isFinite($.previewLines)?$.previewLines:oJ);return{shouldCollapse:L,lineCount:G.length,byteLength:Z,visibleLines:V,omittedLines:Math.max(0,G.length-V)}}async function QV(_){let $=typeof _==="string"?_:"";if(!$)return!1;if(a9(document,{text:$}))return!0;if(await ZV(navigator.clipboard,$))return!0;try{let j=document.createElement("textarea");j.value=$,j.setAttribute("readonly",""),j.style.position="fixed",j.style.opacity="0",j.style.pointerEvents="none",document.body.appendChild(j),j.select(),j.setSelectionRange(0,j.value.length);let G=document.execCommand("copy");return document.body.removeChild(j),G}catch{return!1}}async function $A(_){let $=typeof _==="string"?_:"";if(!$)return!1;let j=Z1($,null),G=`<html><head>${eJ}</head><body>${j}</body></html>`;if(a9(document,{text:$,html:G}))return!0;if(navigator.clipboard?.write&&typeof ClipboardItem<"u")try{let Z=new ClipboardItem({"text/plain":new Blob([$],{type:"text/plain"}),"text/html":new Blob([G],{type:"text/html"})});return await navigator.clipboard.write([Z]),!0}catch(Z){console.warn("[post] Rich clipboard write failed, falling back to plain text copy.",Z)}return QV($)}function jA(_){if(!_)return()=>{};let $=Array.from(_.querySelectorAll("pre")).filter((Y)=>Y.querySelector("code"));if($.length===0)return()=>{};let j=new Map,G=[],Z=(Y)=>{let L=window.getSelection?.();if(!L||L.isCollapsed)return;for(let V of $)if(XV(Y,{root:V,selection:L}))return};document.addEventListener("copy",Z,!0),G.push(()=>document.removeEventListener("copy",Z,!0));let X=(Y,L)=>{let V=L||"idle";if(Y.dataset.copyState=V,V==="success")Y.innerHTML=aJ,Y.setAttribute("aria-label","Copied"),Y.setAttribute("title","Copied"),Y.classList.add("is-success"),Y.classList.remove("is-error");else if(V==="error")Y.innerHTML=tJ,Y.setAttribute("aria-label","Copy failed"),Y.setAttribute("title","Copy failed"),Y.classList.add("is-error"),Y.classList.remove("is-success");else Y.innerHTML=sJ,Y.setAttribute("aria-label","Copy code"),Y.setAttribute("title","Copy code"),Y.classList.remove("is-success","is-error")};return $.forEach((Y)=>{let L=document.createElement("div");L.className="post-code-block";let V=Y.querySelector("code"),q=_A(V?.textContent||"");if(q.shouldCollapse){L.classList.add("post-code-block-collapsed"),L.style.setProperty("--post-code-preview-lines",String(q.visibleLines));let B=document.createElement("button");B.type="button",B.className="post-code-expand-btn";let N=()=>{let D=L.classList.contains("post-code-block-expanded");B.textContent=D?"▴ Collapse output":`▸ Expand output · ${q.lineCount.toLocaleString()} lines · ${a_(q.byteLength)}${q.omittedLines?` · ${q.omittedLines.toLocaleString()} hidden`:""}`,B.setAttribute("aria-expanded",D?"true":"false")},U=(D)=>{D.preventDefault(),D.stopPropagation(),L.classList.toggle("post-code-block-expanded"),N()};B.addEventListener("click",U),N(),L.appendChild(B),G.push(()=>B.removeEventListener("click",U))}Y.parentNode?.insertBefore(L,Y),L.appendChild(Y);let Q=document.createElement("button");Q.type="button",Q.className="post-code-copy-btn",X(Q,"idle"),L.appendChild(Q);let K=async(B)=>{B.preventDefault(),B.stopPropagation();let U=Y.querySelector("code")?.textContent||"",D=await QV(U);X(Q,D?"success":"error");let H=j.get(Q);if(H)clearTimeout(H);let E=setTimeout(()=>{X(Q,"idle"),j.delete(Q)},KV);j.set(Q,E)};Q.addEventListener("click",K),G.push(()=>{Q.removeEventListener("click",K);let B=j.get(Q);if(B)clearTimeout(B);if(L.parentNode)L.parentNode.insertBefore(Y,L),L.remove()})}),()=>{G.forEach((Y)=>Y())}}function NV(_){let $=String(_||"").trim(),j=$.match(/^`([^`]+)`$/);return(j?j[1]:$).trim()}function GA(_){if(!_)return{content:_,fileRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),G=-1;for(let q=0;q<j.length;q+=1)if(j[q].trim()==="Files:"&&j[q+1]&&/^\s*-\s+/.test(j[q+1])){G=q;break}if(G===-1)return{content:_,fileRefs:[]};let Z=[],X=G+1;for(;X<j.length;X+=1){let q=j[X];if(/^\s*-\s+/.test(q)){let Q=NV(q.replace(/^\s*-\s+/,"").trim());if(Q)Z.push(Q)}else if(!q.trim())break;else break}if(Z.length===0)return{content:_,fileRefs:[]};let Y=j.slice(0,G),L=j.slice(X),V=[...Y,...L].join(`
`);return V=V.replace(/\n{3,}/g,`

`).trim(),{content:V,fileRefs:Z}}function ZA(_){if(!_)return{content:_,folderRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),G=-1;for(let q=0;q<j.length;q+=1)if(j[q].trim()==="Folders:"&&j[q+1]&&/^\s*-\s+/.test(j[q+1])){G=q;break}if(G===-1)return{content:_,folderRefs:[]};let Z=[],X=G+1;for(;X<j.length;X+=1){let q=j[X];if(/^\s*-\s+/.test(q)){let Q=NV(q.replace(/^\s*-\s+/,"").trim());if(Q)Z.push(Q)}else if(!q.trim())break;else break}if(Z.length===0)return{content:_,folderRefs:[]};let Y=j.slice(0,G),L=j.slice(X),V=[...Y,...L].join(`
`);return V=V.replace(/\n{3,}/g,`

`).trim(),{content:V,folderRefs:Z}}function XA(_){if(!_)return{content:_,messageRefs:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),G=-1;for(let q=0;q<j.length;q+=1)if(j[q].trim()==="Referenced messages:"&&j[q+1]&&/^\s*-\s+/.test(j[q+1])){G=q;break}if(G===-1)return{content:_,messageRefs:[]};let Z=[],X=G+1;for(;X<j.length;X+=1){let q=j[X];if(/^\s*-\s+/.test(q)){let K=q.replace(/^\s*-\s+/,"").trim().match(/^message:(\S+)$/i);if(K)Z.push(K[1])}else if(!q.trim())break;else break}if(Z.length===0)return{content:_,messageRefs:[]};let Y=j.slice(0,G),L=j.slice(X),V=[...Y,...L].join(`
`);return V=V.replace(/\n{3,}/g,`

`).trim(),{content:V,messageRefs:Z}}function YA(_){if(!_)return{content:_,attachments:[]};let j=_.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),G=-1;for(let q=0;q<j.length;q+=1){let Q=j[q].trim();if((Q==="Images:"||Q==="Attachments:")&&j[q+1]&&/^\s*-\s+/.test(j[q+1])){G=q;break}}if(G===-1)return{content:_,attachments:[]};let Z=[],X=G+1;for(;X<j.length;X+=1){let q=j[X];if(/^\s*-\s+/.test(q)){let Q=q.replace(/^\s*-\s+/,"").trim(),K=Q.match(/^attachment:([^\s)]+)\s*(?:\((.+)\))?$/i)||Q.match(/^attachment:([^\s]+)\s+(.+)$/i);if(K){let B=K[1],N=(K[2]||"").trim()||B;Z.push({id:B,label:N,raw:Q})}else Z.push({id:null,label:Q,raw:Q})}else if(!q.trim())break;else break}if(Z.length===0)return{content:_,attachments:[]};let Y=j.slice(0,G),L=j.slice(X),V=[...Y,...L].join(`
`);return V=V.replace(/\n{3,}/g,`

`).trim(),{content:V,attachments:Z}}function LA(_){return _.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function qA(_,$){if(!_||!$)return _;let j=String($).trim().split(/\s+/).filter(Boolean);if(j.length===0)return _;let G=j.map(LA).sort((Q,K)=>K.length-Q.length),Z=new RegExp(`(${G.join("|")})`,"gi"),X=new RegExp(`^(${G.join("|")})$`,"i"),Y=new DOMParser().parseFromString(_,"text/html"),L=Y.createTreeWalker(Y.body,NodeFilter.SHOW_TEXT),V=[],q;while(q=L.nextNode())V.push(q);for(let Q of V){let K=Q.nodeValue;if(!K||!Z.test(K)){Z.lastIndex=0;continue}Z.lastIndex=0;let B=Q.parentElement;if(B&&B.closest("code, pre, script, style"))continue;let N=K.split(Z).filter((D)=>D!=="");if(N.length===0)continue;let U=Y.createDocumentFragment();for(let D of N)if(X.test(D)){let H=Y.createElement("mark");H.className="search-highlight-term",H.textContent=D,U.appendChild(H)}else U.appendChild(Y.createTextNode(D));Q.parentNode.replaceChild(U,Q)}return Y.body.innerHTML}function BV({post:_,onClick:$,onHashtagClick:j,onMessageRef:G,onScrollToMessage:Z,agentName:X,agentAvatarUrl:Y,userName:L,userAvatarUrl:V,userAvatarBackground:q,onDelete:Q,isThreadReply:K,isThreadPrev:B,isThreadNext:N,isRemoving:U,highlightQuery:D,onFileRef:H,onOpenWidget:E,onOpenAttachmentPreview:k}){let[z,O]=f(null),[I,x]=f("idle"),[A,y]=f(()=>s9()),W=g(null),M=g(null),T=_.data,J=T.type==="agent_response",C=L||"You",P=J?X||Mq:C,b=typeof _.chat_agent_name==="string"?_.chat_agent_name.trim():"",m=Boolean(J&&D&&b&&b!==P),h=J?b9(X,Y,!0):b9(C,V),_0=typeof q==="string"?q.trim().toLowerCase():"",v=!J&&h.image&&(_0==="clear"||_0==="transparent"),e=J&&Boolean(h.image),W0=`background-color: ${v||e?"transparent":h.color}`,G0=T.content_meta,$0=Boolean(G0?.truncated),L0=Boolean(G0?.preview),B0=$0&&!L0,t=$0?{originalLength:Number.isFinite(G0?.original_length)?G0.original_length:T.content?T.content.length:0,maxLength:Number.isFinite(G0?.max_length)?G0.max_length:0}:null,V0=T.content_blocks||[],K0=T.media_ids||[],k0=VV(V0),s=Boolean(k0?.sourceAgentName),X0=pJ(T.content,T.link_previews);X0=RJ(X0,V0);let{content:D0,fileRefs:C0}=GA(X0),{content:g0,folderRefs:p0}=ZA(D0),{content:j_,messageRefs:m0}=XA(g0),d0=(d)=>{d?.preventDefault?.(),d?.stopPropagation?.(),G?.(_.id,_.chat_jid||null)},u0=(d)=>{if(d.key==="Enter"||d.key===" ")d0(d)},{content:o0,attachments:v0}=YA(j_);X0=o0;let a0=r9(V0),n0=c9(V0),t0=xJ(V0)[0]||null,A0=IJ(V0)[0]||null,e0=CJ(V0)[0]||null,z_=a0.length===1&&typeof a0[0]?.fallback_text==="string"?a0[0].fallback_text.trim():"",E0=n0.length===1?K8(n0[0]).trim():"",R0=Boolean(z_)&&X0?.trim()===z_||Boolean(E0)&&X0?.trim()===E0,T0=Boolean(X0)&&!B0&&!R0,i0=typeof D==="string"?D.trim():"",A_=Y0(()=>{if(!X0||R0)return"";let d=Z1(X0,j);return i0?qA(d,i0):d},[X0,R0,i0]),q_=Y0(()=>Q8(_),[_]),H_=Y0(()=>eq(),[]),E_=Y0(()=>_V(_),[_]),y_=Boolean(A.speaking&&A.activePostId===_.id),C_=(d,z0)=>{d.stopPropagation(),O(u1(z0))},u_=(d)=>{k?.(d)},D_=(d)=>{d.stopPropagation(),Q?.(_)},j0=async(d)=>{d.stopPropagation();let z0=await $A(q_);if(x(z0?"success":"error"),M.current)clearTimeout(M.current);M.current=setTimeout(()=>{M.current=null,x("idle")},KV)},O0=(d)=>{if(d.stopPropagation(),y_){$V();return}jV(_.id,E_)},n=(d,z0)=>{let Z_=new Set;if(!d||z0.length===0)return{content:d,usedIds:Z_};return{content:d.replace(/attachment:([^\s)"']+)/g,(n_,F1,g_,J1)=>{let f_=F1.replace(/^\/+/,""),A1=z0.find((k_)=>k_.name&&k_.name.toLowerCase()===f_.toLowerCase()&&!Z_.has(k_.id))||z0.find((k_)=>!Z_.has(k_.id));if(!A1)return n_;if(Z_.add(A1.id),J1.slice(Math.max(0,g_-2),g_)==="](")return`/media/${A1.id}`;return A1.name||"attachment"}),usedIds:Z_}},i=[],o=[],Z0=[],q0=[],J0=[],c0=[],S0=[],I0=0;if(V0.length>0)V0.forEach((d)=>{if(d?.type==="text"&&d.annotations)S0.push(d.annotations);if(d?.type==="generated_widget")c0.push(d);else if(d?.type==="resource_link")q0.push(d);else if(d?.type==="resource")J0.push(d);else if(d?.type==="file"){let z0=K0[I0++];if(z0)o.push(z0),Z0.push({id:z0,name:d?.name||d?.filename||d?.title})}else if(d?.type==="image"||!d?.type){let z0=K0[I0++];if(z0){let Z_=typeof d?.mime_type==="string"?d.mime_type:void 0;i.push({id:z0,annotations:d?.annotations,mimeType:Z_}),Z0.push({id:z0,name:d?.name||d?.filename||d?.title})}}});else if(K0.length>0){let d=v0.length>0;K0.forEach((z0,Z_)=>{let K_=v0[Z_]||null;if(Z0.push({id:z0,name:K_?.label||null}),d)o.push(z0);else i.push({id:z0,annotations:null})})}if(v0.length>0)v0.forEach((d)=>{if(!d?.id)return;let z0=Z0.find((Z_)=>String(Z_.id)===String(d.id));if(z0&&!z0.name)z0.name=d.label});let{content:w0,usedIds:l0}=n(X0,Z0);X0=w0;let U0=i.filter(({id:d})=>!l0.has(d)),h0=o.filter((d)=>!l0.has(d)),Y_=v0.length>0?v0.map((d,z0)=>({id:d.id||`attachment-${z0+1}`,label:d.label||`attachment-${z0+1}`})):Z0.map((d,z0)=>({id:d.id,label:d.name||`attachment-${z0+1}`})),G_=Y0(()=>r9(V0),[V0]),f0=Y0(()=>c9(V0),[V0]),W_=Y0(()=>{return G_.map((d)=>`${d.card_id}:${d.state}`).join("|")},[G_]);u(()=>{if(!W.current)return;return H$(W.current),jA(W.current)},[A_]),u(()=>{return tq((d)=>{y(d)})},[]),u(()=>()=>{if(M.current)clearTimeout(M.current)},[]);let B_=g(null);return u(()=>{if(!B_.current||G_.length===0)return;let d=B_.current;d.innerHTML="";for(let z0 of G_){let Z_=document.createElement("div");d.appendChild(Z_),oq(Z_,z0,{onAction:async(K_)=>{if(K_.type==="Action.OpenUrl"){let n_=J4(K_.url||"");if(!n_)throw Error("Invalid URL");window.open(n_,"_blank","noopener,noreferrer");return}if(K_.type==="Action.Submit"){await z7({post_id:_.id,thread_id:T.thread_id||_.id,chat_jid:_.chat_jid||null,card_id:z0.card_id,action:{type:K_.type,title:K_.title||"",data:K_.data}});return}console.warn("[post] unsupported adaptive card action:",K_.type,K_)}}).catch((K_)=>{console.error("[post] adaptive card render error:",K_),Z_.textContent=z0.fallback_text||"Card failed to render."})}},[W_,_.id]),F`
        <div id=${`post-${_.id}`} class="post ${J?"agent-post":""} ${K?"thread-reply":""} ${B?"thread-prev":""} ${N?"thread-next":""} ${U?"removing":""}" onClick=${$}>
            <div class="post-avatar ${J?"agent-avatar":""} ${h.image?"has-image":""}" style=${W0}>
                ${h.image?F`<img src=${h.image} alt=${P} />`:h.letter}
            </div>
            <div class="post-body">
                <div class="post-actions">
                    ${J&&H_&&E_&&F`
                        <button
                            class=${`post-action-btn post-speak-btn${y_?" is-active":""}`}
                            type="button"
                            title=${y_?"Stop reading aloud":"Read aloud"}
                            aria-label=${y_?"Stop reading aloud":"Read aloud"}
                            onClick=${O0}
                        >
                            ${y_?F`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>`:F`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11 5 6 9H3v6h3l5 4z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M18 6a8.5 8.5 0 0 1 0 12"></path></svg>`}
                        </button>
                    `}
                    <button
                        class=${`post-action-btn post-copy-btn${I==="success"?" is-success":I==="error"?" is-error":""}`}
                        type="button"
                        title=${I==="success"?"Copied":I==="error"?"Copy failed":"Copy message"}
                        aria-label=${I==="success"?"Copied":I==="error"?"Copy failed":"Copy message"}
                        onClick=${j0}
                        disabled=${!q_}
                    >
                        ${I==="success"?F`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 6L9 17l-5-5"></path></svg>`:I==="error"?F`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="M9 9l6 6M15 9l-6 6"></path></svg>`:F`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="9" y="9" width="10" height="10" rx="2"></rect><path d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"></path></svg>`}
                    </button>
                    <button
                        class="post-action-btn post-delete-btn"
                        type="button"
                        title="Delete message"
                        aria-label="Delete message"
                        onClick=${D_}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="post-meta">
                    <span class="post-author">${P}</span>
                    ${s&&F`
                        <span
                            class="post-chat-agent-tag"
                            title=${`From ${k0?.sourceChatJid||""}`.trim()}
                        >
                            @${k0?.sourceAgentName}
                        </span>
                    `}
                    ${m&&F`
                        <span
                            class="post-chat-agent-tag"
                            role="button"
                            tabIndex="0"
                            style="cursor:pointer"
                            title=${`Open ${b} and reference this message`}
                            onClick=${d0}
                            onKeyDown=${u0}
                        >
                            @${b}
                        </span>
                    `}
                    <a class="post-time" href=${`#msg-${_.id}`} onClick=${d0}>${QX(_.timestamp)}</a>
                    ${t0&&F`
                        <span
                            class="post-recovery-chip"
                            title=${uJ(t0)}
                        >
                            recovered
                        </span>
                    `}
                    ${A0&&F`
                        <span
                            class="post-recovery-chip post-timeout-chip"
                            title=${gJ(A0)}
                        >
                            timeout
                        </span>
                    `}
                    ${e0&&F`
                        <span
                            class=${`post-recovery-chip post-outcome-chip post-outcome-chip-${String(e0.severity||"warning")}${e0.kind==="tool_budget"?" post-outcome-chip-tool-budget":""}`}
                            title=${String(e0.label||e0.kind||"issue")}
                        >
                            ${String(e0.label||e0.kind||"issue")}
                        </span>
                    `}
                </div>
                ${e0&&F`
                    <${bJ} marker=${e0} />
                `}
                ${B0&&t&&F`
                    <div class="post-content truncated">
                        <div class="truncated-title">Message too large to display.</div>
                        <div class="truncated-meta">
                            Original length: ${B5(t.originalLength)} chars
                            ${t.maxLength?F` • Display limit: ${B5(t.maxLength)} chars`:""}
                        </div>
                    </div>
                `}
                ${L0&&t&&F`
                    <div class="post-content preview">
                        <div class="truncated-title">Preview truncated.</div>
                        <div class="truncated-meta">
                            Showing first ${B5(t.maxLength)} of ${B5(t.originalLength)} chars. Download full text below.
                        </div>
                    </div>
                `}
                ${(C0.length>0||p0.length>0||m0.length>0||Y_.length>0)&&F`
                    <div class="post-file-refs">
                        ${m0.map((d)=>{let z0=(Z_)=>{if(Z_.preventDefault(),Z_.stopPropagation(),Z)Z(d,_.chat_jid||null);else{let K_=document.getElementById("post-"+d);if(K_)K_.scrollIntoView({behavior:"smooth",block:"center"}),K_.classList.add("post-highlight"),setTimeout(()=>K_.classList.remove("post-highlight"),2000)}};return F`
                                <a href=${`#msg-${d}`} class="post-msg-pill-link" onClick=${z0}>
                                    <${L1}
                                        prefix="post"
                                        label=${"msg:"+d}
                                        title=${"Message "+d}
                                        icon="message"
                                        onClick=${z0}
                                    />
                                </a>
                            `})}
                        ${C0.map((d)=>{let z0=d.split("/").pop()||d;return F`
                                <${L1}
                                    prefix="post"
                                    label=${z0}
                                    title=${d}
                                    onClick=${()=>H?.(d)}
                                />
                            `})}
                        ${p0.map((d)=>{let z0=d.split("/").pop()||d;return F`
                                <${L1}
                                    prefix="post"
                                    label=${z0}
                                    title=${d}
                                    icon="folder"
                                />
                            `})}
                        ${Y_.map((d)=>F`
                            <${vJ}
                                key=${d.id}
                                attachment=${d}
                                onPreview=${u_}
                            />
                        `)}
                    </div>
                `}
                ${T0&&F`
                    <div 
                        ref=${W}
                        class="post-content"
                        dangerouslySetInnerHTML=${{__html:A_}}
                        onClick=${(d)=>{if(d.target.classList.contains("hashtag")){d.preventDefault(),d.stopPropagation();let z0=d.target.dataset.hashtag;if(z0)j?.(z0)}else if(d.target.tagName==="IMG")d.preventDefault(),d.stopPropagation(),O(d.target.src)}}
                    />
                `}
                ${G_.length>0&&F`
                    <div ref=${B_} class="post-adaptive-cards" />
                `}
                ${f0.length>0&&F`
                    <div class="post-adaptive-card-submissions">
                        ${f0.map((d,z0)=>{let Z_=mq(d),K_=`${d.card_id}-${z0}`;return F`
                                <div key=${K_} class="adaptive-card-submission-receipt">
                                    <div class="adaptive-card-submission-header">
                                        <span class="adaptive-card-submission-icon" aria-hidden="true">✓</span>
                                        <div class="adaptive-card-submission-title-wrap">
                                            <span class="adaptive-card-submission-title">Submitted</span>
                                            <span class="adaptive-card-submission-title-action">${Z_.title}</span>
                                        </div>
                                    </div>
                                    ${Z_.fields.length>0&&F`
                                        <div class="adaptive-card-submission-fields">
                                            ${Z_.fields.map((n_)=>F`
                                                <span class="adaptive-card-submission-field" title=${`${n_.key}: ${n_.value}`}>
                                                    <span class="adaptive-card-submission-field-key">${n_.key}</span>
                                                    <span class="adaptive-card-submission-field-sep">:</span>
                                                    <span class="adaptive-card-submission-field-value">${n_.value}</span>
                                                </span>
                                            `)}
                                        </div>
                                    `}
                                    <div class="adaptive-card-submission-meta">
                                        Submitted ${T4(Z_.submittedAt)}
                                    </div>
                                </div>
                            `})}
                    </div>
                `}
                ${c0.length>0&&F`
                    <div class="generated-widget-launches">
                        ${c0.map((d,z0)=>F`
                            <${lJ}
                                key=${d.widget_id||d.id||`${_.id}-widget-${z0}`}
                                block=${d}
                                post=${_}
                                onOpenWidget=${E}
                            />
                        `)}
                    </div>
                `}
                ${S0.length>0&&F`
                    ${S0.map((d,z0)=>F`
                        <${U8} key=${z0} annotations=${d} />
                    `)}
                `}
                ${U0.length>0&&F`
                    <div class="media-preview">
                        ${U0.map(({id:d,mimeType:z0})=>{let K_=typeof z0==="string"&&z0.toLowerCase().startsWith("image/svg")?u1(d):A7(d);return F`
                                <img
                                    key=${d}
                                    src=${K_}
                                    alt="Media"
                                    loading="lazy"
                                    decoding="async"
                                    onClick=${(n_)=>C_(n_,d)}
                                />
                            `})}
                    </div>
                `}
                ${U0.length>0&&F`
                    ${U0.map(({annotations:d},z0)=>F`
                        ${d&&F`<${U8} key=${z0} annotations=${d} />`}
                    `)}
                `}
                ${h0.length>0&&F`
                    <div class="file-attachments">
                        ${h0.map((d)=>F`
                            <${TJ} key=${d} mediaId=${d} onPreview=${u_} />
                        `)}
                    </div>
                `}
                ${q0.length>0&&F`
                    <div class="resource-links">
                        ${q0.map((d,z0)=>F`
                            <div key=${z0}>
                                <${mJ} block=${d} />
                                <${U8} annotations=${d.annotations} />
                            </div>
                        `)}
                    </div>
                `}
                ${J0.length>0&&F`
                    <div class="resource-embeds">
                        ${J0.map((d,z0)=>F`
                            <div key=${z0}>
                                <${cJ} block=${d} />
                                <${U8} annotations=${d.annotations} />
                            </div>
                        `)}
                    </div>
                `}
                ${T.link_previews?.length>0&&F`
                    <div class="link-previews">
                        ${T.link_previews.map((d,z0)=>F`
                            <${rJ} key=${z0} preview=${d} />
                        `)}
                    </div>
                `}
            </div>
        </div>
        ${z&&F`<${sq} src=${z} onClose=${()=>O(null)} />`}

    `}function FV({posts:_,hasMore:$,onLoadMore:j,onPostClick:G,onHashtagClick:Z,onMessageRef:X,onScrollToMessage:Y,onFileRef:L,onOpenWidget:V,onOpenAttachmentPreview:q,emptyMessage:Q,timelineRef:K,agents:B,user:N,onDeletePost:U,reverse:D=!0,removingPostIds:H,searchQuery:E}){let[k,z]=f(!1),O=g(null),I=typeof IntersectionObserver<"u",x=R(async()=>{if(!j||!$||k)return;z(!0);try{await j({preserveScroll:!0,preserveMode:"top"})}finally{z(!1)}},[$,k,j]),A=R((b)=>{let{scrollTop:m,scrollHeight:h,clientHeight:_0}=b.target,v=D?h-_0-m:m,e=Math.max(300,_0);if(v<e)x()},[D,x]);u(()=>{if(!I)return;let b=O.current,m=K?.current;if(!b||!m)return;let h=300,_0=new IntersectionObserver((v)=>{for(let e of v){if(!e.isIntersecting)continue;x()}},{root:m,rootMargin:`${h}px 0px ${h}px 0px`,threshold:0});return _0.observe(b),()=>_0.disconnect()},[I,$,j,K,x]);let y=g(x);if(y.current=x,u(()=>{if(I)return;if(!K?.current)return;let{scrollTop:b,scrollHeight:m,clientHeight:h}=K.current,_0=D?m-h-b:b,v=Math.max(300,h);if(_0<v)y.current?.()},[I,_,$,D,K]),u(()=>{if(!K?.current)return;if(!$||k)return;let{scrollTop:b,scrollHeight:m,clientHeight:h}=K.current,_0=D?m-h-b:b,v=Math.max(300,h);if(m<=h+1||_0<v)y.current?.()},[_,$,k,D,K]),!_)return F`<div class="loading"><div class="spinner"></div></div>`;if(_.length===0)return F`
            <div class="timeline" ref=${K}>
                <div class="timeline-content">
                    <div style="padding: var(--spacing-xl); text-align: center; color: var(--text-secondary)">
                        ${Q||"No messages yet. Start a conversation!"}
                    </div>
                </div>
            </div>
        `;let W=_.slice().sort((b,m)=>b.id-m.id),M=(b)=>{let m=b?.data?.thread_id;if(m===null||m===void 0||m==="")return null;let h=Number(m);return Number.isFinite(h)?h:null},T=new Map;for(let b=0;b<W.length;b+=1){let m=W[b],h=Number(m?.id),_0=M(m);if(_0!==null){let v=T.get(_0)||{anchorIndex:-1,replyIndexes:[]};v.replyIndexes.push(b),T.set(_0,v)}else if(Number.isFinite(h)){let v=T.get(h)||{anchorIndex:-1,replyIndexes:[]};v.anchorIndex=b,T.set(h,v)}}let J=new Map;for(let[b,m]of T.entries()){let h=new Set;if(m.anchorIndex>=0)h.add(m.anchorIndex);for(let _0 of m.replyIndexes)h.add(_0);J.set(b,Array.from(h).sort((_0,v)=>_0-v))}let C=W.map((b,m)=>{let h=M(b);if(h===null)return{hasThreadPrev:!1,hasThreadNext:!1};let _0=J.get(h);if(!_0||_0.length===0)return{hasThreadPrev:!1,hasThreadNext:!1};let v=_0.indexOf(m);if(v<0)return{hasThreadPrev:!1,hasThreadNext:!1};return{hasThreadPrev:v>0,hasThreadNext:v<_0.length-1}}),P=F`<div class="timeline-sentinel" ref=${O}></div>`;return F`
        <div class="timeline ${D?"reverse":"normal"}" ref=${K} onScroll=${A}>
            <div class="timeline-content">
                ${D?P:null}
                ${W.map((b,m)=>{let h=Boolean(b.data?.thread_id&&b.data.thread_id!==b.id),_0=H?.has?.(b.id),v=C[m]||{};return F`
                    <${BV}
                        key=${b.id}
                        post=${b}
                        isThreadReply=${h}
                        isThreadPrev=${v.hasThreadPrev}
                        isThreadNext=${v.hasThreadNext}
                        isRemoving=${_0}
                        highlightQuery=${E}
                        agentName=${wq(b.data?.agent_id,B||{})}
                        agentAvatarUrl=${Tq(b.data?.agent_id,B||{})}
                        userName=${N?.name||N?.user_name}
                        userAvatarUrl=${N?.avatar_url||N?.avatarUrl||N?.avatar}
                        userAvatarBackground=${N?.avatar_background||N?.avatarBackground}
                        onClick=${()=>G?.(b)}
                        onHashtagClick=${Z}
                        onMessageRef=${X}
                        onScrollToMessage=${Y}
                        onFileRef=${L}
                        onOpenWidget=${V}
                        onDelete=${U}
                        onOpenAttachmentPreview=${q}
                    />
                `})}
                ${D?null:P}
            </div>
        </div>
    `}M0();I_();function UV(_){try{return _?.focus?.(),_?.select?.(),!0}catch($){return!1}}var E8="workspaceExplorerScale",VA=["compact","default","comfortable"],KA=new Set(VA),QA={compact:{indentPx:14},default:{indentPx:16},comfortable:{indentPx:18}};function EV(_,$="default"){if(typeof _!=="string")return $;let j=_.trim().toLowerCase();return KA.has(j)?j:$}function t9(){if(typeof window>"u")return{width:0,isTouch:!1};let _=Number(window.innerWidth)||0,$=Boolean(window.matchMedia?.("(pointer: coarse)")?.matches),j=Boolean(window.matchMedia?.("(hover: none)")?.matches),G=Number(globalThis.navigator?.maxTouchPoints||0)>0;return{width:_,isTouch:$||G&&j}}function NA(_={}){let $=Math.max(0,Number(_.width)||0);if(Boolean(_.isTouch))return"comfortable";if($>0&&$<1180)return"comfortable";return"default"}function BA(_,$={}){if(Boolean($.isTouch)&&_==="compact")return"default";return _}function e9(_={}){let $=NA(_),j=_.stored?EV(_.stored,$):$;return BA(j,_)}function HV(_){return QA[EV(_)]}X9();function FA(_){if(!_||_.kind!=="text")return!1;let $=Number(_.size);return!Number.isFinite($)||$<=262144}function _j(_,$){let j=String(_||"").trim();if(!j||j.endsWith("/"))return!1;if(typeof $!=="function")return!1;let G=$({path:j,mode:"edit"});if(!G||typeof G!=="object")return!1;return G.id!=="editor"}function DV(_,$,j={}){let G=j.resolvePane;if(_j(_,G))return!0;return FA($)}var AV=(_)=>{if(!_||!_.name)return!1;if(_.path===".")return!1;return _.name.startsWith(".")};function UA(_){let $=String(_||"").trim();if(!$||$.endsWith("/"))return!1;return _j($,(j)=>X_.resolve(j))}function kV(_,$,j,G=0,Z=[]){if(!j&&AV(_))return Z;if(!_)return Z;if(Z.push({node:_,depth:G}),_.type==="dir"&&_.children&&$.has(_.path))for(let X of _.children)kV(X,$,j,G+1,Z);return Z}function WV(_,$,j){if(!_)return"";let G=[],Z=(X)=>{if(!j&&AV(X))return;if(G.push(X.type==="dir"?`d:${X.path}`:`f:${X.path}`),X.children&&$?.has(X.path))for(let Y of X.children)Z(Y)};return Z(_),G.join("|")}function Zj(_,$){if(!$)return null;if(!_)return $;if(_.path!==$.path||_.type!==$.type)return $;let j=Array.isArray(_.children)?_.children:null,G=Array.isArray($.children)?$.children:null;if(!G)return _;let Z=j?new Map(j.map((L)=>[L?.path,L])):new Map,X=!j||j.length!==G.length,Y=G.map((L)=>{let V=Zj(Z.get(L.path),L);if(V!==Z.get(L.path))X=!0;return V});return X?{...$,children:Y}:_}function jj(_,$,j){if(!_)return _;if(_.path===$)return Zj(_,j);if(!Array.isArray(_.children))return _;let G=!1,Z=_.children.map((X)=>{let Y=jj(X,$,j);if(Y!==X)G=!0;return Y});return G?{..._,children:Z}:_}var yV=4,$j=14,EA=16;function MV(_){if(!_)return 0;if(_.type==="file"){let G=Math.max(0,Number(_.size)||0);return _.__bytes=G,G}let $=Array.isArray(_.children)?_.children:[],j=0;for(let G of $)j+=MV(G);return _.__bytes=j,j}function wV(_,$=0){let j=Math.max(0,Number(_?.__bytes??_?.size??0)),G={name:_?.name||_?.path||".",path:_?.path||".",size:j,children:[]};if(!_||_.type!=="dir"||$>=yV)return G;let Z=Array.isArray(_.children)?_.children:[],X=[];for(let L of Z){let V=Math.max(0,Number(L?.__bytes??L?.size??0));if(V<=0)continue;if(L.type==="dir")X.push({kind:"dir",node:L,size:V});else X.push({kind:"file",name:L.name,path:L.path,size:V})}X.sort((L,V)=>V.size-L.size);let Y=X;if(X.length>$j){let L=X.slice(0,$j-1),V=X.slice($j-1),q=V.reduce((Q,K)=>Q+K.size,0);L.push({kind:"other",name:`+${V.length} more`,path:`${G.path}/[other]`,size:q}),Y=L}return G.children=Y.map((L)=>{if(L.kind==="dir")return wV(L.node,$+1);return{name:L.name,path:L.path,size:L.size,children:[]}}),G}function OV(){if(typeof window>"u"||typeof document>"u")return!1;let{documentElement:_,body:$}=document,j=_?.getAttribute?.("data-theme")?.toLowerCase?.()||"";if(j==="dark")return!0;if(j==="light")return!1;if(_?.classList?.contains("dark")||$?.classList?.contains("dark"))return!0;if(_?.classList?.contains("light")||$?.classList?.contains("light"))return!1;return Boolean(window.matchMedia?.("(prefers-color-scheme: dark)")?.matches)}function TV(_,$,j){let G=((_+Math.PI/2)*180/Math.PI+360)%360,Z=j?Math.max(30,70-$*10):Math.max(34,66-$*8),X=j?Math.min(70,45+$*5):Math.min(60,42+$*4);return`hsl(${G.toFixed(1)} ${Z}% ${X}%)`}function H8(_,$,j,G){return{x:_+j*Math.cos(G),y:$+j*Math.sin(G)}}function Xj(_,$,j,G,Z,X){let Y=Math.PI*2-0.0001,L=X-Z>Y?Z+Y:X,V=H8(_,$,G,Z),q=H8(_,$,G,L),Q=H8(_,$,j,L),K=H8(_,$,j,Z),B=L-Z>Math.PI?1:0;return[`M ${V.x.toFixed(3)} ${V.y.toFixed(3)}`,`A ${G} ${G} 0 ${B} 1 ${q.x.toFixed(3)} ${q.y.toFixed(3)}`,`L ${Q.x.toFixed(3)} ${Q.y.toFixed(3)}`,`A ${j} ${j} 0 ${B} 0 ${K.x.toFixed(3)} ${K.y.toFixed(3)}`,"Z"].join(" ")}var xV={1:[26,46],2:[48,68],3:[70,90],4:[92,112]};function IV(_,$,j){let G=[],Z=[],X=Math.max(0,Number($)||0),Y=(L,V,q,Q)=>{let K=Array.isArray(L?.children)?L.children:[];if(!K.length)return;let B=Math.max(0,Number(L.size)||0);if(B<=0)return;let N=q-V,U=V;K.forEach((D,H)=>{let E=Math.max(0,Number(D.size)||0);if(E<=0)return;let k=E/B,z=U,O=H===K.length-1?q:U+N*k;if(U=O,O-z<0.003)return;let I=xV[Q];if(I){let x=TV(z,Q,j);if(G.push({key:D.path,path:D.path,label:D.name,size:E,color:x,depth:Q,startAngle:z,endAngle:O,innerRadius:I[0],outerRadius:I[1],d:Xj(120,120,I[0],I[1],z,O)}),Q===1)Z.push({key:D.path,name:D.name,size:E,pct:X>0?E/X*100:0,color:x})}if(Q<yV)Y(D,z,O,Q+1)})};return Y(_,-Math.PI/2,Math.PI*3/2,1),{segments:G,legend:Z}}function Gj(_,$){if(!_||!$)return null;if(_.path===$)return _;let j=Array.isArray(_.children)?_.children:[];for(let G of j){let Z=Gj(G,$);if(Z)return Z}return null}function CV(_,$,j,G){if(!j||j<=0)return{segments:[],legend:[]};let Z=xV[1];if(!Z)return{segments:[],legend:[]};let X=-Math.PI/2,Y=Math.PI*3/2,L=TV(X,1,G),q=`${$||"."}/[files]`;return{segments:[{key:q,path:q,label:_,size:j,color:L,depth:1,startAngle:X,endAngle:Y,innerRadius:Z[0],outerRadius:Z[1],d:Xj(120,120,Z[0],Z[1],X,Y)}],legend:[{key:q,name:_,size:j,pct:100,color:L}]}}function zV(_,$=!1,j=!1){if(!_)return null;let G=MV(_),Z=wV(_,0),X=Z.size||G,{segments:Y,legend:L}=IV(Z,X,j);if(!Y.length&&X>0){let V=CV("[files]",Z.path,X,j);Y=V.segments,L=V.legend}return{root:Z,totalSize:X,segments:Y,legend:L,truncated:$,isDarkTheme:j}}function HA({payload:_}){if(!_)return null;let[$,j]=f(null),[G,Z]=f(_?.root?.path||"."),[X,Y]=f(()=>[_?.root?.path||"."]),[L,V]=f(!1);u(()=>{let M=_?.root?.path||".";Z(M),Y([M]),j(null)},[_?.root?.path,_?.totalSize]),u(()=>{if(!G)return;V(!0);let M=setTimeout(()=>V(!1),180);return()=>clearTimeout(M)},[G]);let q=Y0(()=>{return Gj(_.root,G)||_.root},[_?.root,G]),Q=q?.size||_.totalSize||0,{segments:K,legend:B}=Y0(()=>{let M=IV(q,Q,_.isDarkTheme);if(M.segments.length>0)return M;if(Q<=0)return M;let T=q?.children?.length?"Total":"[files]";return CV(T,q?.path||_?.root?.path||".",Q,_.isDarkTheme)},[q,Q,_.isDarkTheme,_?.root?.path]),[N,U]=f(K),D=g(new Map),H=g(0);u(()=>{let M=D.current,T=new Map(K.map((b)=>[b.key,b])),J=performance.now(),C=220,P=(b)=>{let m=Math.min(1,(b-J)/220),h=m*(2-m),_0=K.map((v)=>{let W0=M.get(v.key)||{startAngle:v.startAngle,endAngle:v.startAngle,innerRadius:v.innerRadius,outerRadius:v.innerRadius},G0=(V0,K0)=>V0+(K0-V0)*h,$0=G0(W0.startAngle,v.startAngle),L0=G0(W0.endAngle,v.endAngle),B0=G0(W0.innerRadius,v.innerRadius),t=G0(W0.outerRadius,v.outerRadius);return{...v,d:Xj(120,120,B0,t,$0,L0)}});if(U(_0),m<1)H.current=requestAnimationFrame(P)};if(H.current)cancelAnimationFrame(H.current);return H.current=requestAnimationFrame(P),D.current=T,()=>{if(H.current)cancelAnimationFrame(H.current)}},[K]);let E=N.length?N:K,k=Q>0?a_(Q):"0 B",z=q?.name||"",I=(z&&z!=="."?z:"Total")||"Total",x=k,A=X.length>1,y=(M)=>{if(!M?.path)return;let T=Gj(_.root,M.path);if(!T||!Array.isArray(T.children)||T.children.length===0)return;Y((J)=>[...J,T.path]),Z(T.path),j(null)},W=()=>{if(!A)return;Y((M)=>{let T=M.slice(0,-1);return Z(T[T.length-1]||_?.root?.path||"."),T}),j(null)};return F`
        <div class="workspace-folder-starburst">
            <svg viewBox="0 0 240 240" class=${`workspace-folder-starburst-svg${L?" is-zooming":""}`} role="img"
                aria-label=${`Folder sizes for ${q?.path||_?.root?.path||"."}`}
                data-segments=${E.length}
                data-base-size=${Q}>
                ${E.map((M)=>F`
                    <path
                        key=${M.key}
                        d=${M.d}
                        fill=${M.color}
                        stroke="var(--bg-primary)"
                        stroke-width="1"
                        class=${`workspace-folder-starburst-segment${$?.key===M.key?" is-hovered":""}`}
                        onMouseEnter=${()=>j(M)}
                        onMouseLeave=${()=>j(null)}
                        onTouchStart=${()=>j(M)}
                        onTouchEnd=${()=>j(null)}
                        onClick=${()=>y(M)}
                    >
                        <title>${M.label} — ${a_(M.size)}</title>
                    </path>
                `)}
                <g
                    class=${`workspace-folder-starburst-center-hit${A?" is-drill":""}`}
                    onClick=${W}
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
                    <text x="120" y="114" text-anchor="middle" class="workspace-folder-starburst-total-label">${I}</text>
                    <text x="120" y="130" text-anchor="middle" class="workspace-folder-starburst-total-value">${x}</text>
                </g>
            </svg>
            ${B.length>0&&F`
                <div class="workspace-folder-starburst-legend">
                    ${B.slice(0,8).map((M)=>F`
                        <div key=${M.key} class="workspace-folder-starburst-legend-item">
                            <span class="workspace-folder-starburst-swatch" style=${`background:${M.color}`}></span>
                            <span class="workspace-folder-starburst-name" title=${M.name}>${M.name}</span>
                            <span class="workspace-folder-starburst-size">${a_(M.size)}</span>
                            <span class="workspace-folder-starburst-pct">${M.pct.toFixed(1)}%</span>
                        </div>
                    `)}
                </div>
            `}
            ${_.truncated&&F`
                <div class="workspace-folder-starburst-note">Preview is truncated by tree depth/entry limits.</div>
            `}
        </div>
    `}function JV(_){if(typeof document>"u"||!_)return;let $=document.createElement("a");$.href=_,$.setAttribute("download",""),$.rel="noopener",$.style.display="none",document.body.appendChild($),$.click(),$.remove()}function fV(_){switch(_?.state){case"indexing":return"Indexing workspace…";case"ready":return"Workspace index ready";case"stale":return"Workspace index may be stale";case"failed":return"Workspace index failed";case"never_indexed":return"Workspace index not built yet";default:return"Checking workspace index…"}}function DA(_){if(!_)return"Workspace index status";let $=[fV(_)];if(_.last_indexed_at)$.push(`Last indexed: ${_.last_indexed_at}`);if(typeof _.indexed_file_count==="number")$.push(`Indexed files: ${_.indexed_file_count}`);if(Array.isArray(_.roots)&&_.roots.length)$.push(`Roots: ${_.roots.join(", ")}`);if(_.last_error)$.push(`Error: ${_.last_error}`);return $.join(`
`)}function WA(_){let $=_?.target;if($&&typeof $==="object")return $;return $?.parentElement||null}function OA(_){return Boolean(_?.closest?.(".workspace-node-icon, .workspace-label-text"))}function zA(_,$=null){let j=WA(_),G=j?.closest?.(".workspace-row");if(!G)return null;let Z=G.dataset.type,X=G.dataset.path;if(!X||X===".")return null;if($===X)return null;let Y=_?.touches?.[0];if(!Y)return null;return{type:Z,path:X,dragPath:OA(j)?X:null,startX:Y.clientX,startY:Y.clientY}}function PV({onFileSelect:_,onFolderSelect:$,visible:j=!0,active:G=void 0,onOpenEditor:Z,onOpenTerminalTab:X,onOpenVncTab:Y,onToggleTerminal:L,terminalVisible:V=!1}){let[q,Q]=f(null),[K,B]=f(new Set(["."])),[N,U]=f(null),[D,H]=f(null),[E,k]=f(""),[z,O]=f(null),[,I]=f(null),[x,A]=f(!0),[y,W]=f(!1),[M,T]=f(null),[J,C]=f(()=>F$("workspaceShowHidden",!1)),[P,b]=f(!1),[m,h]=f(null),[_0,v]=f(null),[e,W0]=f(null),[G0,$0]=f(!1),[L0,B0]=f(null),[t,V0]=f(null),[K0,k0]=f(null),[s,X0]=f(!1),[D0,C0]=f(()=>J2()),[g0,p0]=f(()=>OV()),[j_,m0]=f(()=>e9({stored:O1(E8),...t9()})),[d0,u0]=f(!1),o0=Math.max(15000,(Number(D0?.refreshIntervalSec)||60)*1000),v0=Math.max(0,Number(D0?.folderPreviewDepth)||0),a0=g(K),n0=g(""),N_=g(null),t0=g(0),b0=g(new Set),A0=g(null),L_=g(null),e0=g(new Map),z_=g(_),E0=g($),R0=g(Z),T0=g(null),i0=g(null),A_=g(null),q_=g(null),H_=g(null),E_=g(null),y_=g("."),C_=g(0),u_=g({path:null,dragging:!1,startX:0,startY:0}),D_=g({path:null,dragging:!1,startX:0,startY:0}),j0=g({path:null,timer:0}),O0=g(!1),n=g(0),i=g(new Map),o=g(null),Z0=g(null),q0=g(null),J0=g(null),c0=g(null),S0=g(null),I0=g(J),w0=g(j),l0=g(G??j),U0=g(0),h0=g(e),Y_=g(P),G_=g(m),f0=g(null),W_=g({x:0,y:0}),B_=g(0),d=g(null),z0=g(N),Z_=g(D),K_=g(null),n_=g(z);z_.current=_,E0.current=$,R0.current=Z,u(()=>{a0.current=K},[K]),u(()=>{I0.current=J},[J]),u(()=>{w0.current=j},[j]),u(()=>{l0.current=G??j},[G,j]),u(()=>{h0.current=e},[e]);let F1=R(()=>{if(!C_.current)return;clearTimeout(C_.current),C_.current=0},[]);u(()=>()=>F1(),[F1]),u(()=>{if(typeof window>"u")return;let S=()=>{m0(e9({stored:O1(E8),...t9()}))};S();let l=()=>S(),r=()=>S(),a=(H0)=>{if(!H0||H0.key===null||H0.key===E8)S()};window.addEventListener("resize",l),window.addEventListener("focus",r),window.addEventListener("storage",a);let F0=window.matchMedia?.("(pointer: coarse)"),Q0=window.matchMedia?.("(hover: none)"),y0=(H0,s0)=>{if(!H0)return;if(H0.addEventListener)H0.addEventListener("change",s0);else if(H0.addListener)H0.addListener(s0)},x0=(H0,s0)=>{if(!H0)return;if(H0.removeEventListener)H0.removeEventListener("change",s0);else if(H0.removeListener)H0.removeListener(s0)};return y0(F0,l),y0(Q0,l),()=>{window.removeEventListener("resize",l),window.removeEventListener("focus",r),window.removeEventListener("storage",a),x0(F0,l),x0(Q0,l)}},[]),u(()=>{if(typeof window>"u")return;let S=()=>{C0(J2())},l=(F0)=>{if(!F0||F0.key===null||F0.key===l6||F0.key===h6)S()},r=()=>S(),a=(F0)=>{let Q0=F0?.detail?.settings;if(Q0&&typeof Q0==="object"){C0({refreshIntervalSec:Number(Q0.refreshIntervalSec)||60,folderPreviewDepth:Math.max(0,Number(Q0.folderPreviewDepth)||0)});return}S()};return window.addEventListener("focus",r),window.addEventListener("storage",l),window.addEventListener(c6,a),()=>{window.removeEventListener("focus",r),window.removeEventListener("storage",l),window.removeEventListener(c6,a)}},[]),u(()=>{let S=(l)=>{let r=l?.detail?.path;if(!r)return;let a=r.split("/"),F0=[];for(let Q0=1;Q0<a.length;Q0++)F0.push(a.slice(0,Q0).join("/"));if(F0.length)B((Q0)=>{let y0=new Set(Q0);y0.add(".");for(let x0 of F0)y0.add(x0);return y0});U(r),requestAnimationFrame(()=>{let Q0=document.querySelector(`[data-path="${CSS.escape(r)}"]`);if(Q0)Q0.scrollIntoView({block:"nearest",behavior:"smooth"})})};return window.addEventListener("workspace-reveal-path",S),()=>window.removeEventListener("workspace-reveal-path",S)},[]),u(()=>{Y_.current=P},[P]),u(()=>{G_.current=m},[m]),u(()=>{z0.current=N},[N]),u(()=>{Z_.current=D},[D]),u(()=>{n_.current=z},[z]),u(()=>{if(typeof window>"u"||typeof document>"u")return;let S=()=>p0(OV());S();let l=window.matchMedia?.("(prefers-color-scheme: dark)"),r=()=>S();if(l?.addEventListener)l.addEventListener("change",r);else if(l?.addListener)l.addListener(r);let a=typeof MutationObserver<"u"?new MutationObserver(()=>S()):null;if(a?.observe(document.documentElement,{attributes:!0,attributeFilter:["class","data-theme"]}),document.body)a?.observe(document.body,{attributes:!0,attributeFilter:["class","data-theme"]});return()=>{if(l?.removeEventListener)l.removeEventListener("change",r);else if(l?.removeListener)l.removeListener(r);a?.disconnect()}},[]),u(()=>{if(!D)return;let S=H_.current;if(!S)return;let l=requestAnimationFrame(()=>{UV(S)});return()=>cancelAnimationFrame(l)},[D]),u(()=>{if(!d0)return;let S=(r)=>{let a=r?.target;if(!(a instanceof Element))return;if(c0.current?.contains(a))return;if(S0.current?.contains(a))return;u0(!1)},l=(r)=>{if(r?.key==="Escape")u0(!1),S0.current?.focus?.()};return document.addEventListener("mousedown",S),document.addEventListener("touchstart",S,{passive:!0}),document.addEventListener("keydown",l),()=>{document.removeEventListener("mousedown",S),document.removeEventListener("touchstart",S),document.removeEventListener("keydown",l)}},[d0]);let g_=async(S,l={})=>{let r=Boolean(l?.autoOpen),a=String(S||"").trim();W(!0),O(null),I(null);try{let F0=await T7(a,20000);if(r&&a&&DV(a,F0,{resolvePane:(Q0)=>X_.resolve(Q0)}))return R0.current?.(a,F0),F0;return O(F0),F0}catch(F0){let Q0={error:F0.message||"Failed to load preview"};return O(Q0),Q0}finally{W(!1)}};T0.current=g_;let J1=R(async()=>{try{let S=await M7("all");return k0(S),S}catch(S){return console.warn("[workspace-explorer] Failed to load workspace index status:",S),null}},[]);L_.current=J1;let f_=R(()=>{L_.current?.()},[]),M_=async()=>{if(!w0.current)return;try{let S=await V5("",1,I0.current),l=WV(S.root,a0.current,I0.current);if(l===n0.current){A(!1);return}if(n0.current=l,N_.current=S.root,!t0.current)t0.current=requestAnimationFrame(()=>{t0.current=0,Q((r)=>Zj(r,N_.current)),A(!1)})}catch(S){T(S.message||"Failed to load workspace"),A(!1)}},A1=async(S)=>{if(!S)return;if(b0.current.has(S))return;b0.current.add(S);try{let l=await V5(S,1,I0.current);Q((r)=>jj(r,S,l.root))}catch(l){T(l.message||"Failed to load workspace")}finally{b0.current.delete(S)}};i0.current=A1;let O_=R(()=>{let S=N;if(!S)return".";let l=e0.current?.get(S);if(l&&l.type==="dir")return l.path;if(S==="."||!S.includes("/"))return".";let r=S.split("/");return r.pop(),r.join("/")||"."},[N]),k_=R((S)=>{let l=S?.closest?.(".workspace-row");if(!l)return null;let r=l.dataset.path,a=l.dataset.type;if(!r)return null;if(a==="dir")return r;if(r.includes("/")){let F0=r.split("/");return F0.pop(),F0.join("/")||"."}return"."},[]),U1=R((S)=>{return k_(S?.target||null)},[k_]),m_=R((S)=>{h0.current=S,W0(S)},[]),p_=R(()=>{let S=j0.current;if(S?.timer)clearTimeout(S.timer);j0.current={path:null,timer:0}},[]),s_=R((S)=>{if(!S||S==="."){p_();return}let l=e0.current?.get(S);if(!l||l.type!=="dir"){p_();return}if(a0.current?.has(S)){p_();return}if(j0.current?.path===S)return;p_();let r=setTimeout(()=>{j0.current={path:null,timer:0},i0.current?.(S),B((a)=>{let F0=new Set(a);return F0.add(S),F0})},600);j0.current={path:S,timer:r}},[p_]),U_=R((S,l)=>{if(W_.current={x:S,y:l},B_.current)return;B_.current=requestAnimationFrame(()=>{B_.current=0;let r=f0.current;if(!r)return;let a=W_.current;r.style.transform=`translate(${a.x+12}px, ${a.y+12}px)`})},[]),x1=R((S)=>{if(!S)return;let r=(e0.current?.get(S)?.name||S.split("/").pop()||S).trim();if(!r)return;v({path:S,label:r})},[]),E1=R(()=>{if(v(null),B_.current)cancelAnimationFrame(B_.current),B_.current=0;if(f0.current)f0.current.style.transform="translate(-9999px, -9999px)"},[]),g1=R((S)=>{if(!S)return".";let l=e0.current?.get(S);if(l&&l.type==="dir")return l.path;if(S==="."||!S.includes("/"))return".";let r=S.split("/");return r.pop(),r.join("/")||"."},[]),k1=R(()=>{H(null),k("")},[]),e1=R((S)=>{if(!S)return;let r=(e0.current?.get(S)?.name||S.split("/").pop()||S).trim();if(!r||S===".")return;H(S),k(r)},[]),c4=R(async()=>{let S=Z_.current;if(!S)return;let l=(E||"").trim();if(!l){k1();return}let r=e0.current?.get(S),a=(r?.name||S.split("/").pop()||S).trim();if(l===a){k1();return}try{let Q0=(await C7(S,l))?.path||S,y0=S.includes("/")?S.split("/").slice(0,-1).join("/")||".":".";if(k1(),T(null),window.dispatchEvent(new CustomEvent("workspace-file-renamed",{detail:{oldPath:S,newPath:Q0,type:r?.type||"file"}})),r?.type==="dir")B((x0)=>{let H0=new Set;for(let s0 of x0)if(s0===S)H0.add(Q0);else if(s0.startsWith(`${S}/`))H0.add(`${Q0}${s0.slice(S.length)}`);else H0.add(s0);return H0});if(U(Q0),r?.type==="dir")O(null),W(!1),I(null);else T0.current?.(Q0);i0.current?.(y0),f_()}catch(F0){T(F0?.message||"Failed to rename file")}},[k1,E,f_]),A$=R(async(S)=>{let a=S||".";for(let F0=0;F0<50;F0+=1){let y0=`untitled${F0===0?"":`-${F0}`}.md`;try{let H0=(await I7(a,y0,""))?.path||(a==="."?y0:`${a}/${y0}`);if(a&&a!==".")B((s0)=>new Set([...s0,a]));U(H0),T(null),i0.current?.(a),T0.current?.(H0),f_();return}catch(x0){if(x0?.status===409||x0?.code==="file_exists")continue;T(x0?.message||"Failed to create file");return}}T("Failed to create file (untitled name already in use).")},[]),t_=R((S)=>{if(S?.stopPropagation?.(),G0)return;let l=g1(z0.current);A$(l)},[G0,g1,A$]);u(()=>{if(typeof window>"u")return;let S=(l)=>{let r=l?.detail?.updates||[];if(!Array.isArray(r)||r.length===0)return;Q((x0)=>{let H0=x0;for(let s0 of r){if(!s0?.root)continue;if(!H0||s0.path==="."||!s0.path)H0=s0.root;else H0=jj(H0,s0.path,s0.root)}if(H0)n0.current=WV(H0,a0.current,I0.current);return A(!1),H0});let a=z0.current;if(Boolean(a)&&r.some((x0)=>{let H0=x0?.path||"";if(!H0||H0===".")return!0;return a===H0||a.startsWith(`${H0}/`)||H0.startsWith(`${a}/`)}))i.current.clear();if(f_(),!a||!n_.current)return;let Q0=e0.current?.get(a);if(Q0&&Q0.type==="dir")return;if(r.some((x0)=>{let H0=x0?.path||"";if(!H0||H0===".")return!0;return a===H0||a.startsWith(`${H0}/`)}))T0.current?.(a)};return window.addEventListener("workspace-update",S),()=>window.removeEventListener("workspace-update",S)},[]),A0.current=M_;let c_=g(()=>{if(typeof window>"u")return;let S=window.matchMedia("(min-width: 1024px) and (orientation: landscape)"),l=l0.current??w0.current,r=document.visibilityState!=="hidden"&&(l||S.matches&&w0.current);K5(r,I0.current).catch((a)=>{console.debug("[workspace-explorer] Workspace visibility ping failed.",a,{visible:r,showHidden:I0.current})})}).current,y1=g(0),H1=g(()=>{if(y1.current)clearTimeout(y1.current);y1.current=setTimeout(()=>{y1.current=0,c_()},250)}).current;u(()=>{if(w0.current)A0.current?.(),L_.current?.();H1()},[j,G]),u(()=>{A0.current(),L_.current?.();let S=setInterval(()=>{A0.current(),L_.current?.()},o0);return()=>clearInterval(S)},[o0]),u(()=>{c_();let S=W4("previewHeight",null),l=Number.isFinite(S)?Math.min(Math.max(S,80),600):280;if(n.current=l,A_.current)A_.current.style.setProperty("--preview-height",`${l}px`);let r=window.matchMedia("(min-width: 1024px) and (orientation: landscape)"),a=()=>H1();if(r.addEventListener)r.addEventListener("change",a);else if(r.addListener)r.addListener(a);return document.addEventListener("visibilitychange",a),()=>{if(t0.current)cancelAnimationFrame(t0.current),t0.current=0;if(r.removeEventListener)r.removeEventListener("change",a);else if(r.removeListener)r.removeListener(a);if(document.removeEventListener("visibilitychange",a),y1.current)clearTimeout(y1.current),y1.current=0;K5(!1,I0.current).catch((F0)=>{console.debug("[workspace-explorer] Workspace visibility teardown ping failed.",F0,{showHidden:I0.current})})}},[]);let _1=Y0(()=>kV(q,K,J),[q,K,J]),k$=Y0(()=>new Map(_1.map((S)=>[S.node.path,S.node])),[_1]),y$=Y0(()=>HV(j_),[j_]);e0.current=k$;let w_=(N?e0.current.get(N):null)?.type==="dir";u(()=>{if(!N||!w_){V0(null),o.current=null,Z0.current=null;return}if(v0<=0){V0({loading:!1,error:null,payload:null,disabled:!0}),o.current=null,Z0.current=null;return}let S=N,l=`${J?"hidden":"visible"}:${v0}:${N}`,r=i.current,a=r.get(l);if(a?.root){r.delete(l),r.set(l,a);let y0=zV(a.root,Boolean(a.truncated),g0);if(y0)o.current=y0,Z0.current=N,V0({loading:!1,error:null,payload:y0,disabled:!1});return}let F0=o.current,Q0=Z0.current;V0({loading:!0,error:null,payload:Q0===N?F0:null,disabled:!1}),V5(N,v0,J).then((y0)=>{if(z0.current!==S)return;let x0={root:y0?.root,truncated:Boolean(y0?.truncated)};r.delete(l),r.set(l,x0);while(r.size>EA){let s0=r.keys().next().value;if(!s0)break;r.delete(s0)}let H0=zV(x0.root,x0.truncated,g0);o.current=H0,Z0.current=N,V0({loading:!1,error:null,payload:H0,disabled:!1})}).catch((y0)=>{if(z0.current!==S)return;V0({loading:!1,error:y0?.message||"Failed to load folder size chart",payload:Q0===N?F0:null,disabled:!1})})},[N,w_,J,g0,v0]);let q1=Boolean(z&&z.kind==="text"&&!w_&&(!z.size||z.size<=262144)),M$=q1?"Open in editor":z?.size>262144?"File too large to edit":"File is not editable",l4=Boolean(N&&!w_&&UA(N)),$$=Boolean(N&&N!=="."),h4=Boolean(N&&!w_),n4=Boolean(N&&!w_),w$=N&&w_?x6(N,J):null,T$=fV(K0),b1=DA(K0),v1=K0?.state||"never_indexed",r4=v1!=="ready",V1=R(()=>u0(!1),[]),R_=R(async(S)=>{V1();try{await S?.()}catch(l){console.warn("[workspace-explorer] Header menu action failed:",l)}},[V1]),p4=R(async(S)=>{S?.stopPropagation?.(),X0(!0),k0((l)=>({scope:"all",last_indexed_at:l?.last_indexed_at||null,last_error:null,indexed_file_count:l?.indexed_file_count||0,roots:l?.roots||[],updated_at:l?.updated_at||null,state:"indexing"}));try{let l=await w7("all");k0(l),T(null),n0.current="",A0.current?.()}catch(l){let r=l?.message||"Failed to reindex workspace";k0((a)=>({scope:"all",last_indexed_at:a?.last_indexed_at||null,last_error:r,indexed_file_count:a?.indexed_file_count||0,roots:a?.roots||[],updated_at:a?.updated_at||null,state:"failed"})),T(r)}finally{X0(!1)}},[]);u(()=>{let S=q0.current;if(J0.current)J0.current.dispose(),J0.current=null;if(!S)return;if(S.innerHTML="",!N||w_||!z||z.error)return;let l={path:N,content:typeof z.text==="string"?z.text:void 0,mtime:z.mtime,size:z.size,preview:z,mode:"view"},r=X_.resolve(l)||X_.get("workspace-preview-default");if(!r)return;let a=r.mount(S,l);return J0.current=a,()=>{if(J0.current===a)a.dispose(),J0.current=null;S.innerHTML=""}},[N,w_,z]);let I1=(S)=>{let l=S?.target;if(l instanceof Element)return l;return l?.parentElement||null},x$=(S)=>{return Boolean(S?.closest?.(".workspace-node-icon, .workspace-label-text"))},d4=(S)=>{if(!S)return!1;if(S.closest?.('input, textarea, [contenteditable="true"]'))return!0;return Boolean(S.isContentEditable)},g2=g((S)=>{let l=I1(S),r=l?.closest?.("[data-path]");if(!r)return;let a=r.dataset.path;if(!a||a===".")return;let F0=Boolean(l?.closest?.("button"))||Boolean(l?.closest?.("a"))||Boolean(l?.closest?.("input")),Q0=Boolean(l?.closest?.(".workspace-caret"));if(F0||Q0)return;if(Z_.current===a)return;e1(a)}).current,b2=g((S)=>{if(O0.current){O0.current=!1;return}let l=I1(S),r=l?.closest?.("[data-path]");if(q_.current?.focus?.(),!r)return;let a=r.dataset.path,F0=r.dataset.type,Q0=Boolean(l?.closest?.(".workspace-caret")),y0=Boolean(l?.closest?.("button"))||Boolean(l?.closest?.("a"))||Boolean(l?.closest?.("input")),x0=z0.current===a,H0=Z_.current;if(H0){if(H0===a)return;k1()}if(F0==="dir"){if(K_.current=null,U(a),O(null),I(null),W(!1),!a0.current.has(a))i0.current?.(a);if(x0&&!Q0)return;B((r_)=>{let $1=new Set(r_);if($1.has(a))$1.delete(a);else $1.add(a);return $1})}else{K_.current=null,U(a);let s0=e0.current.get(a);if(s0)z_.current?.(s0.path,s0);if(!y0&&!Q0)T0.current?.(a)}}).current,X4=g(()=>{n0.current="",A0.current(),L_.current?.(),Array.from(a0.current||[]).filter((l)=>l&&l!==".").forEach((l)=>i0.current?.(l))}).current,I$=g(()=>{K_.current=null,U(null),O(null),I(null),W(!1)}).current,i4=g(()=>{C((S)=>{let l=!S;if(typeof window<"u")V_("workspaceShowHidden",String(l));return I0.current=l,K5(!0,l).catch((a)=>{console.debug("[workspace-explorer] Workspace visibility refresh after toggling hidden files failed.",a,{showHidden:l})}),n0.current="",A0.current?.(),Array.from(a0.current||[]).filter((a)=>a&&a!==".").forEach((a)=>i0.current?.(a)),l})}).current,o4=g((S)=>{if(I1(S)?.closest?.("[data-path]"))return;I$()}).current,K1=R(async(S)=>{if(!S)return;let l=S.split("/").pop()||S;if(!window.confirm(`Delete "${l}"? This cannot be undone.`))return;try{await P7(S);let a=S.includes("/")?S.split("/").slice(0,-1).join("/")||".":".";if(z0.current===S)I$();i0.current?.(a),T(null),f_()}catch(a){O((F0)=>({...F0||{},error:a.message||"Failed to delete file"}))}},[I$]),C$=R((S)=>{let l=q_.current;if(!l||!S||typeof CSS>"u"||typeof CSS.escape!=="function")return;l.querySelector(`[data-path="${CSS.escape(S)}"]`)?.scrollIntoView?.({block:"nearest"})},[]),Y4=R((S)=>{let l=I1(S);if(Z_.current||d4(l))return;let r=_1;if(!r||r.length===0)return;let a=N?r.findIndex((F0)=>F0.node.path===N):-1;if(S.key==="ArrowDown"){S.preventDefault();let F0=Math.min(a+1,r.length-1),Q0=r[F0];if(!Q0)return;if(U(Q0.node.path),Q0.node.type!=="dir")z_.current?.(Q0.node.path,Q0.node),T0.current?.(Q0.node.path);else O(null),W(!1),I(null);C$(Q0.node.path);return}if(S.key==="ArrowUp"){S.preventDefault();let F0=a<=0?0:a-1,Q0=r[F0];if(!Q0)return;if(U(Q0.node.path),Q0.node.type!=="dir")z_.current?.(Q0.node.path,Q0.node),T0.current?.(Q0.node.path);else O(null),W(!1),I(null);C$(Q0.node.path);return}if(S.key==="ArrowRight"&&a>=0){let F0=r[a];if(F0?.node?.type==="dir"&&!K.has(F0.node.path))S.preventDefault(),i0.current?.(F0.node.path),B((Q0)=>new Set([...Q0,F0.node.path]));return}if(S.key==="ArrowLeft"&&a>=0){let F0=r[a];if(F0?.node?.type==="dir"&&K.has(F0.node.path))S.preventDefault(),B((Q0)=>{let y0=new Set(Q0);return y0.delete(F0.node.path),y0});return}if(S.key==="Enter"&&a>=0){S.preventDefault();let F0=r[a];if(!F0)return;let Q0=F0.node.path;if(F0.node.type==="dir"){if(!a0.current.has(Q0))i0.current?.(Q0);B((x0)=>{let H0=new Set(x0);if(H0.has(Q0))H0.delete(Q0);else H0.add(Q0);return H0}),O(null),I(null),W(!1)}else z_.current?.(Q0,F0.node),T0.current?.(Q0);return}if((S.key==="Delete"||S.key==="Backspace")&&a>=0){let F0=r[a];if(!F0||F0.node.type==="dir")return;S.preventDefault(),K1(F0.node.path);return}if(S.key==="Escape")S.preventDefault(),I$()},[I$,K1,K,_1,C$,N]),L4=R((S)=>{let l=zA(S,Z_.current);if(!l)return;u_.current={path:l.dragPath,dragging:!1,startX:l.startX,startY:l.startY}},[]),m1=R(()=>{let S=u_.current;if(S?.dragging&&S.path){let l=h0.current||O_(),r=d.current;if(typeof r==="function")r(S.path,l)}u_.current={path:null,dragging:!1,startX:0,startY:0},U0.current=0,b(!1),h(null),m_(null),p_(),E1()},[O_,E1,m_,p_]),D1=R((S)=>{let l=u_.current,r=S?.touches?.[0];if(!r||!l?.path)return;let a=Math.abs(r.clientX-l.startX),F0=Math.abs(r.clientY-l.startY),Q0=a>8||F0>8;if(!l.dragging&&Q0)l.dragging=!0,b(!0),h("move"),x1(l.path);if(l.dragging){S.preventDefault(),U_(r.clientX,r.clientY);let y0=document.elementFromPoint(r.clientX,r.clientY),x0=k_(y0)||O_();if(h0.current!==x0)m_(x0);s_(x0)}},[k_,O_,x1,U_,m_,s_]),v2=g((S)=>{S.preventDefault();let l=A_.current;if(!l)return;let r=S.clientY,a=n.current||280,F0=S.currentTarget;F0.classList.add("dragging"),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let Q0=r,y0=(H0)=>{Q0=H0.clientY;let s0=l.clientHeight-80,r_=Math.min(Math.max(a-(H0.clientY-r),80),s0);l.style.setProperty("--preview-height",`${r_}px`),n.current=r_},x0=()=>{let H0=l.clientHeight-80,s0=Math.min(Math.max(a-(Q0-r),80),H0);n.current=s0,F0.classList.remove("dragging"),document.body.style.cursor="",document.body.style.userSelect="",V_("previewHeight",String(Math.round(s0))),document.removeEventListener("mousemove",y0),document.removeEventListener("mouseup",x0)};document.addEventListener("mousemove",y0),document.addEventListener("mouseup",x0)}).current,q4=g((S)=>{S.preventDefault();let l=A_.current;if(!l)return;let r=S.touches[0];if(!r)return;let a=r.clientY,F0=n.current||280,Q0=S.currentTarget;Q0.classList.add("dragging"),document.body.style.userSelect="none";let y0=(H0)=>{let s0=H0.touches[0];if(!s0)return;H0.preventDefault();let r_=l.clientHeight-80,$1=Math.min(Math.max(F0-(s0.clientY-a),80),r_);l.style.setProperty("--preview-height",`${$1}px`),n.current=$1},x0=()=>{Q0.classList.remove("dragging"),document.body.style.userSelect="",V_("previewHeight",String(Math.round(n.current||F0))),document.removeEventListener("touchmove",y0),document.removeEventListener("touchend",x0),document.removeEventListener("touchcancel",x0)};document.addEventListener("touchmove",y0,{passive:!1}),document.addEventListener("touchend",x0),document.addEventListener("touchcancel",x0)}).current,j$=R((S=N)=>{if(!S)return;JV(T6(S))},[N]),e_=async()=>{if(!N||w_)return;await K1(N)},f$=(S)=>{return Array.from(S?.dataTransfer?.types||[]).includes("Files")},s4=R((S)=>{if(!f$(S))return;if(S.preventDefault(),U0.current+=1,!Y_.current)b(!0);h("upload");let l=U1(S)||O_();m_(l),s_(l)},[O_,U1,m_,s_]),G$=R((S)=>{if(!f$(S))return;if(S.preventDefault(),S.dataTransfer)S.dataTransfer.dropEffect="copy";if(!Y_.current)b(!0);if(G_.current!=="upload")h("upload");let l=U1(S)||O_();if(h0.current!==l)m_(l);s_(l)},[O_,U1,m_,s_]),b5=R((S)=>{if(!f$(S))return;if(S.preventDefault(),U0.current=Math.max(0,U0.current-1),U0.current===0)b(!1),h(null),m_(null),p_()},[m_,p_]),b_=R(async(S,l=".")=>{let r=Array.from(S||[]);if(r.length===0)return;let a=l&&l!==""?l:".",F0=a!=="."?a:"workspace root";F1(),$0(!0),B0({current:0,total:r.length,name:"",percent:0,done:!1,error:null});try{let Q0=null;for(let y0=0;y0<r.length;y0++){let x0=r[y0],H0=x0?.name||`file ${y0+1}`;B0((r_)=>({...r_,current:y0+1,name:H0,percent:0}));let s0=(r_)=>B0(($1)=>({...$1,percent:r_.percent}));try{Q0=await w6(x0,a,{onProgress:s0})}catch(r_){let $1=r_?.status,q$=r_?.code;if($1===409||q$==="file_exists"){if(!window.confirm(`"${H0}" already exists in ${F0}. Overwrite?`))continue;Q0=await w6(x0,a,{overwrite:!0,onProgress:s0})}else throw r_}}if(Q0?.path)K_.current=Q0.path,U(Q0.path),T0.current?.(Q0.path);i0.current?.(a),f_(),B0((y0)=>({...y0,done:!0})),F1(),C_.current=window.setTimeout(()=>{C_.current=0,B0(null)},1500)}catch(Q0){T(Q0.message||"Failed to upload file"),B0((y0)=>y0?{...y0,error:Q0.message||"Upload failed"}:null),F1(),C_.current=window.setTimeout(()=>{C_.current=0,B0(null)},4000)}finally{$0(!1)}},[F1]),d8=R(async(S,l)=>{if(!S)return;let r=e0.current?.get(S);if(!r)return;let a=l&&l!==""?l:".",F0=S.includes("/")?S.split("/").slice(0,-1).join("/")||".":".";if(a===F0)return;try{let y0=(await f7(S,a))?.path||S;if(r.type==="dir")B((x0)=>{let H0=new Set;for(let s0 of x0)if(s0===S)H0.add(y0);else if(s0.startsWith(`${S}/`))H0.add(`${y0}${s0.slice(S.length)}`);else H0.add(s0);return H0});if(U(y0),r.type==="dir")O(null),W(!1),I(null);else T0.current?.(y0);i0.current?.(F0),i0.current?.(a),f_()}catch(Q0){T(Q0?.message||"Failed to move entry")}},[]);d.current=d8;let i8=R(async(S)=>{if(!f$(S))return;S.preventDefault(),U0.current=0,b(!1),h(null),W0(null),p_();let l=Array.from(S?.dataTransfer?.files||[]);if(l.length===0)return;let r=h0.current||U1(S)||O_();await b_(l,r)},[O_,U1,b_]),C1=R((S)=>{if(S?.stopPropagation?.(),G0)return;let l=S?.currentTarget?.dataset?.uploadTarget||".";y_.current=l,E_.current?.click()},[G0]),V4=R((S)=>{S?.preventDefault?.(),S?.stopPropagation?.();let l=S?.currentTarget?.dataset?.folderHintTarget||z0.current||".";if(!l)return;E0.current?.(l,e0.current.get(l))},[]),P$=R(()=>{if(G0)return;let S=z0.current,l=S?e0.current?.get(S):null;y_.current=l?.type==="dir"?l.path:".",E_.current?.click()},[G0]),R$=R(()=>{R_(()=>t_(null))},[R_,t_]),S$=R(()=>{R_(()=>P$())},[R_,P$]),a4=R(()=>{R_(()=>X4())},[R_,X4]),Z$=R(()=>{R_(()=>i4())},[R_,i4]),X$=R(()=>{if(!N||!l4)return;R_(()=>R0.current?.(N,z))},[R_,N,l4,z]),K4=R(()=>{if(!N||!q1)return;R_(()=>R0.current?.(N,z))},[R_,N,q1,z]),Q4=R(()=>{if(!N||N===".")return;R_(()=>e1(N))},[R_,N,e1]),Y$=R(()=>{if(!N||w_)return;R_(()=>e_())},[R_,N,w_,e_]),v5=R(()=>{if(!N||w_)return;R_(()=>j$())},[R_,N,w_,j$]),L$=R(()=>{if(!w$)return;V1(),JV(w$)},[V1,w$]),m5=R(()=>{V1(),X?.()},[V1,X]),m2=R(()=>{V1(),Y?.()},[V1,Y]),c2=R(()=>{V1(),L?.()},[V1,L]),l2=R((S)=>{if(!S||S.button!==0)return;let l=S.currentTarget;if(!l||!l.dataset)return;let r=l.dataset.path;if(!r||r===".")return;if(Z_.current===r)return;let a=I1(S);if(a?.closest?.("button, a, input, .workspace-caret"))return;if(!x$(a))return;S.preventDefault(),D_.current={path:r,dragging:!1,startX:S.clientX,startY:S.clientY};let F0=(y0)=>{let x0=D_.current;if(!x0?.path)return;let H0=Math.abs(y0.clientX-x0.startX),s0=Math.abs(y0.clientY-x0.startY),r_=H0>4||s0>4;if(!x0.dragging&&r_)x0.dragging=!0,O0.current=!0,b(!0),h("move"),x1(x0.path),U_(y0.clientX,y0.clientY),document.body.style.userSelect="none",document.body.style.cursor="grabbing";if(x0.dragging){y0.preventDefault(),U_(y0.clientX,y0.clientY);let $1=document.elementFromPoint(y0.clientX,y0.clientY),q$=k_($1)||O_();if(h0.current!==q$)m_(q$);s_(q$)}},Q0=()=>{document.removeEventListener("mousemove",F0),document.removeEventListener("mouseup",Q0);let y0=D_.current;if(y0?.dragging&&y0.path){let x0=h0.current||O_(),H0=d.current;if(typeof H0==="function")H0(y0.path,x0)}D_.current={path:null,dragging:!1,startX:0,startY:0},U0.current=0,b(!1),h(null),m_(null),p_(),E1(),document.body.style.userSelect="",document.body.style.cursor="",setTimeout(()=>{O0.current=!1},0)};document.addEventListener("mousemove",F0),document.addEventListener("mouseup",Q0)},[k_,O_,x1,U_,E1,m_,s_,p_]),o8=R(async(S)=>{let l=Array.from(S?.target?.files||[]);if(l.length===0)return;let r=y_.current||".";if(await b_(l,r),y_.current=".",S?.target)S.target.value=""},[b_]);return F`
        <aside
            class=${`workspace-sidebar${P?" workspace-drop-active":""}`}
            data-workspace-scale=${j_}
            ref=${A_}
            onDragEnter=${s4}
            onDragOver=${G$}
            onDragLeave=${b5}
            onDrop=${i8}
        >
            <input type="file" multiple style="display:none" ref=${E_} onChange=${o8} />
            <div class="workspace-header">
                <div class="workspace-header-left">
                    <div class="workspace-menu-wrap">
                        <button
                            ref=${S0}
                            class=${`workspace-menu-button${d0?" active":""}`}
                            onClick=${(S)=>{S.stopPropagation(),u0((l)=>!l)}}
                            title="Workspace actions"
                            aria-label="Workspace actions"
                            aria-haspopup="menu"
                            aria-expanded=${d0?"true":"false"}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <line x1="4" y1="7" x2="20" y2="7" />
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="17" x2="20" y2="17" />
                            </svg>
                        </button>
                        ${d0&&F`
                            <div class="workspace-menu-dropdown" ref=${c0} role="menu" aria-label="Workspace options">
                                <button class="workspace-menu-item" role="menuitem" onClick=${R$} disabled=${G0}>New file</button>
                                <button class="workspace-menu-item" role="menuitem" onClick=${S$} disabled=${G0}>Upload files</button>
                                <button class="workspace-menu-item" role="menuitem" onClick=${a4}>Refresh tree</button>
                                <button class="workspace-menu-item" role="menuitem" onClick=${()=>R_(()=>p4())} disabled=${s}>
                                    ${s?"Reindexing workspace…":"Reindex workspace"}
                                </button>
                                <button class=${`workspace-menu-item${J?" active":""}`} role="menuitem" onClick=${Z$}>
                                    ${J?"Hide hidden files":"Show hidden files"}
                                </button>

                                ${(X||Y||L)&&F`<div class="workspace-menu-separator"></div>`}
                                ${X&&F`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${m5}>
                                        Open terminal in tab
                                    </button>
                                `}
                                ${Y&&F`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${m2}>
                                        Open VNC in tab
                                    </button>
                                `}
                                ${L&&F`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${c2}>
                                        ${V?"Hide terminal dock":"Show terminal dock"}
                                    </button>
                                `}

                                ${N&&F`<div class="workspace-menu-separator"></div>`}
                                ${l4&&F`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${X$}>Open in tab</button>
                                `}
                                ${N&&!w_&&F`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${K4} disabled=${!q1}>Open in editor</button>
                                `}
                                ${$$&&F`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${Q4}>Rename selected</button>
                                `}
                                ${n4&&F`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${v5}>Download selected file</button>
                                `}
                                ${w$&&F`
                                    <button class="workspace-menu-item" role="menuitem" onClick=${L$}>Download selected folder (zip)</button>
                                `}
                                ${h4&&F`
                                    <button class="workspace-menu-item danger" role="menuitem" onClick=${Y$}>Delete selected file</button>
                                `}
                                <div class="workspace-menu-separator"></div>
                                <button class="workspace-menu-item" role="menuitem" onClick=${()=>{u0(!1),window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:{section:"workspace"}}))}}>Settings</button>
                            </div>
                        `}
                    </div>
                    <span>Workspace</span>
                </div>
                <div class="workspace-header-actions">
                    <button class="workspace-create" onClick=${t_} title="New file" disabled=${G0}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                    <button class="workspace-refresh" onClick=${X4} title="Refresh tree">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="8.5" stroke-dasharray="42 12" stroke-dashoffset="6"
                                transform="rotate(75 12 12)" />
                            <polyline points="21 3 21 9 15 9" />
                        </svg>
                    </button>
                </div>
            </div>
            ${r4&&F`
                <div class="workspace-index-status-row">
                    <div class=${`workspace-index-status-chip state-${v1}`} title=${b1}>
                        <span class="workspace-index-status-dot" aria-hidden="true"></span>
                        <span>${T$}</span>
                    </div>
                </div>
            `}
            <div class="workspace-tree" onClick=${o4}>
                ${L0&&F`
                    <div class="workspace-upload-strip">
                        <div class="workspace-upload-strip-text">
                            ${L0.error?F`<span class="workspace-upload-strip-error">${L0.error}</span>`:L0.done?F`<span>Done</span>`:F`<span>${L0.total>1?`Uploading ${L0.current}/${L0.total}: ${L0.name}`:`Uploading ${L0.name}`}${L0.percent>0?` (${L0.percent}%)`:"…"}</span>`}
                        </div>
                        ${!L0.done&&!L0.error&&F`
                            <div class="workspace-upload-strip-bar">
                                <div class="workspace-upload-strip-fill" style=${`width:${L0.percent||0}%`}></div>
                            </div>
                        `}
                    </div>
                `}
                ${x&&F`<div class="workspace-loading">Loading…</div>`}
                ${M&&F`<div class="workspace-error">${M}</div>`}
                ${q&&F`
                    <div
                        class="workspace-tree-list"
                        ref=${q_}
                        tabIndex="0"
                        onClick=${b2}
                        onDblClick=${g2}
                        onKeyDown=${Y4}
                        onTouchStart=${L4}
                        onTouchEnd=${m1}
                        onTouchMove=${D1}
                        onTouchCancel=${m1}
                    >
                        ${_1.map(({node:S,depth:l})=>{let r=S.type==="dir",a=S.path===N,F0=S.path===D,Q0=r&&K.has(S.path),y0=e&&S.path===e,x0=Array.isArray(S.children)&&S.children.length>0?S.children.length:Number(S.child_count)||0;return F`
                                <div
                                    key=${S.path}
                                    class=${`workspace-row${a?" selected":""}${y0?" drop-target":""}`}
                                    style=${{paddingLeft:`${8+l*y$.indentPx}px`}}
                                    data-path=${S.path}
                                    data-type=${S.type}
                                    onMouseDown=${l2}
                                >
                                    <span class="workspace-caret" aria-hidden="true">
                                        ${r?Q0?F`<svg viewBox="0 0 12 12"><polygon points="1,2 11,2 6,11"/></svg>`:F`<svg viewBox="0 0 12 12"><polygon points="2,1 11,6 2,11"/></svg>`:null}
                                    </span>
                                    <svg class=${`workspace-node-icon${r?" folder":""}`}
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        aria-hidden="true">
                                        ${r?F`<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`:F`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>`}
                                    </svg>
                                    ${F0?F`
                                            <input
                                                class="workspace-rename-input"
                                                ref=${H_}
                                                value=${E}
                                                onInput=${(H0)=>k(H0?.target?.value||"")}
                                                onKeyDown=${(H0)=>{if(H0.stopPropagation(),H0.key==="Enter")H0.preventDefault(),c4();else if(H0.key==="Escape")H0.preventDefault(),k1()}}
                                                onBlur=${k1}
                                                onClick=${(H0)=>H0.stopPropagation()}
                                            />
                                        `:F`<span class="workspace-label"><span class="workspace-label-text">${S.name}</span></span>`}
                                    ${r&&!Q0&&x0>0&&F`
                                        <span class="workspace-count">${x0}</span>
                                    `}
                                    ${r&&F`
                                        <button
                                            class="workspace-folder-upload"
                                            data-folder-hint-target=${S.path}
                                            title="Add folder hint to compose"
                                            aria-label=${`Add folder hint for ${S.path}`}
                                            onClick=${V4}
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
                                            onClick=${C1}
                                            disabled=${G0}
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
            ${N&&F`
                <div class="workspace-preview-splitter-h" onMouseDown=${v2} onTouchStart=${q4}></div>
                <div class="workspace-preview">
                    <div class="workspace-preview-header">
                        <span class="workspace-preview-title">${N}</span>
                        <div class="workspace-preview-actions">
                            <button class="workspace-create" onClick=${t_} title="New file" disabled=${G0}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>
                            ${!w_&&F`
                                <button
                                    class="workspace-download workspace-edit"
                                    onClick=${()=>q1&&R0.current?.(N,z)}
                                    title=${M$}
                                    disabled=${!q1}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                    </svg>
                                </button>
                                <button
                                    class="workspace-download workspace-delete"
                                    onClick=${e_}
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
                            ${w_?F`
                                    <button
                                        class="workspace-download"
                                        data-folder-hint-target=${N}
                                        onClick=${V4}
                                        title="Add folder hint to compose"
                                        aria-label=${`Add folder hint for ${N}`}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                            <path d="M12 11v6"/>
                                            <path d="M9 14h6"/>
                                        </svg>
                                    </button>
                                    <button class="workspace-download" onClick=${P$}
                                        title="Upload files to this folder" disabled=${G0}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="7 8 12 3 17 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                    </button>
                                    <a class="workspace-download" href=${x6(N,J)} download
                                        title="Download folder as zip" onClick=${(S)=>S.stopPropagation()}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="7 10 12 15 17 10"/>
                                            <line x1="12" y1="15" x2="12" y2="3"/>
                                        </svg>
                                    </a>`:F`<a class="workspace-download" href=${T6(N)} download
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
                    ${y&&F`<div class="workspace-loading">Loading preview…</div>`}
                    ${z?.error&&F`<div class="workspace-error">${z.error}</div>`}
                    ${w_&&F`
                        <div class="workspace-preview-text">Folder selected — create file, upload files, or download as zip.</div>
                        ${t?.disabled&&F`<div class="workspace-preview-text">Folder size preview scanning is disabled in Workspace settings.</div>`}
                        ${t?.loading&&F`<div class="workspace-loading">Loading folder size preview…</div>`}
                        ${t?.error&&F`<div class="workspace-error">${t.error}</div>`}
                        ${t?.payload&&t.payload.segments?.length>0&&F`
                            <${HA} payload=${t.payload} />
                        `}
                        ${t?.payload&&(!t.payload.segments||t.payload.segments.length===0)&&F`
                            <div class="workspace-preview-text">No file size data available for this folder yet.</div>
                        `}
                    `}
                    ${z&&!z.error&&!w_&&F`
                        <div class="workspace-preview-body" ref=${q0}></div>
                    `}
                </div>
            `}
            ${_0&&F`
                <div class="workspace-drag-ghost" ref=${f0}>${_0.label}</div>
            `}
        </aside>
    `}M0();var JA=new Set(["html-viewer","kanban-editor","mindmap-editor"]);function D8(_,$,j){let G=String(_||"").trim();if(!G)return null;if($)return $;if(typeof j!=="function")return null;return j({path:G,mode:"edit"})?.id||null}function RV(_,$,j){let G=D8(_,$,j);return G!=null&&JA.has(G)}function SV(_,$,j){return D8(_,$,j)==="html-viewer"?"Edit":"Edit Source"}function uV(_,$,j){return D8(_,$,j)==="editor"}var AA=/\.(docx?|xlsx?|pptx?|odt|ods|odp|rtf)$/i,kA=/\.(csv|tsv)$/i,yA=/\.pdf$/i,MA=/\.(png|jpe?g|gif|webp|bmp|ico|svg)$/i;function wA(_,{hasPopOutTab:$=!1}={}){let j=typeof _==="string"?_.trim():"";if(!j)return null;let G=Yq(j,{hasPopOutTab:$});if(G)return G;if(AA.test(j)){let Z="/workspace/raw?path="+encodeURIComponent(j),X=j.split("/").pop()||"document";return"/office-viewer/?url="+encodeURIComponent(Z)+"&name="+encodeURIComponent(X)}if(kA.test(j))return"/csv-viewer/?path="+encodeURIComponent(j);if(yA.test(j))return"/workspace/raw?path="+encodeURIComponent(j);if(MA.test(j))return"/image-viewer/?path="+encodeURIComponent(j);return null}function gV({tabs:_,activeId:$,onActivate:j,onClose:G,onCloseOthers:Z,onCloseAll:X,onTogglePin:Y,onTogglePreview:L,onToggleDiff:V,onEditSource:q,previewTabs:Q,diffTabs:K,paneOverrides:B,detachedTabs:N,onReattachTab:U,onToggleDock:D,dockVisible:H,onToggleZen:E,zenMode:k,onPopOutTab:z}){let[O,I]=f(null),x=g(null);u(()=>{if(!O)return;let v=(e)=>{if(e.type==="keydown"&&e.key!=="Escape")return;I(null)};return document.addEventListener("click",v),document.addEventListener("keydown",v),()=>{document.removeEventListener("click",v),document.removeEventListener("keydown",v)}},[O]),u(()=>{let v=(e)=>{if(e.ctrlKey&&e.key==="Tab"){if(e.preventDefault(),!_.length)return;let W0=_.findIndex((G0)=>G0.id===$);if(e.shiftKey){let G0=_[(W0-1+_.length)%_.length];j?.(G0.id)}else{let G0=_[(W0+1)%_.length];j?.(G0.id)}return}if((e.ctrlKey||e.metaKey)&&e.key==="w"){let W0=document.querySelector(".editor-pane");if(W0&&W0.contains(document.activeElement)){if(e.preventDefault(),$)G?.($)}}};return document.addEventListener("keydown",v),()=>document.removeEventListener("keydown",v)},[_,$,j,G]);let A=R((v,e)=>{if(v.button===0){j?.(e);return}if(v.button===1)v.preventDefault(),G?.(e)},[j,G]),y=R((v,e)=>{if(v.defaultPrevented)return;if(v.button===0)j?.(e)},[j]),W=R((v,e)=>{v.preventDefault(),I({id:e,x:v.clientX,y:v.clientY})},[]),M=R((v)=>{v.stopPropagation()},[]),T=R((v,e)=>{v.preventDefault(),v.stopPropagation(),G?.(e)},[G]);u(()=>{if(!$||!x.current)return;let v=x.current.querySelector(".tab-item.active");if(v)v.scrollIntoView({block:"nearest",inline:"nearest",behavior:"smooth"})},[$]);let J=R((v)=>{if(!(B instanceof Map))return null;return B.get(v)||null},[B]),C=Y0(()=>_.find((v)=>v.id===O?.id)||null,[O?.id,_]),P=Y0(()=>{let v=O?.id;if(!v)return!1;return RV(v,J(v),(e)=>X_.resolve(e))},[O?.id,J]),b=Y0(()=>{let v=O?.id;if(!v)return"Edit Source";return SV(v,J(v),(e)=>X_.resolve(e))},[O?.id,J]),m=Y0(()=>{let v=O?.id;if(!v||!(N instanceof Map))return!1;return N.has(v)},[O?.id,N]),h=Y0(()=>{let v=O?.id;if(!v||!(K instanceof Set))return!1;return K.has(v)},[O?.id,K]),_0=Y0(()=>{let v=O?.id;if(!v)return!1;let e=_.find((G0)=>G0.id===v)||null;if(!e)return!1;return uV(v,J(v),(G0)=>X_.resolve(G0))&&Boolean(e.dirty||h)},[O?.id,h,J,_]);if(!_.length)return null;return F`
        <div class="tab-strip" ref=${x} role="tablist">
            ${_.map((v)=>F`
                <div
                    key=${v.id}
                    class=${`tab-item${v.id===$?" active":""}${v.dirty?" dirty":""}${v.pinned?" pinned":""}`}
                    role="tab"
                    aria-selected=${v.id===$}
                    title=${v.path}
                    onMouseDown=${(e)=>A(e,v.id)}
                    onClick=${(e)=>y(e,v.id)}
                    onContextMenu=${(e)=>W(e,v.id)}
                >
                    ${v.pinned&&F`
                        <span class="tab-pin-icon" aria-label="Pinned">
                            <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                                <path d="M4.456.734a1.75 1.75 0 0 1 2.826.504l.613 1.327a3.1 3.1 0 0 0 2.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-2.204 2.205c-.968.968-2.623.5-2.94-.832l-.584-2.454a3.1 3.1 0 0 0-1.707-2.084l-1.327-.613a1.75 1.75 0 0 1-.504-2.826z"/>
                            </svg>
                        </span>
                    `}
                    <span class="tab-label">${v.label}</span>
                    ${N instanceof Map&&N.has(v.id)&&F`
                        <span class="tab-detached-badge" aria-label="Detached" title="Open in separate window">↗</span>
                    `}
                    <button
                        type="button"
                        class="tab-close"
                        onPointerDown=${M}
                        onMouseDown=${M}
                        onClick=${(e)=>T(e,v.id)}
                        title=${v.dirty?"Unsaved changes":"Close"}
                        aria-label=${v.dirty?"Unsaved changes":`Close ${v.label}`}
                    >
                        ${v.dirty?F`<span class="tab-dirty-dot" aria-hidden="true"></span>`:F`<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" focusable="false" style=${{pointerEvents:"none"}}>
                                <line x1="4" y1="4" x2="12" y2="12" style=${{pointerEvents:"none"}}/>
                                <line x1="12" y1="4" x2="4" y2="12" style=${{pointerEvents:"none"}}/>
                            </svg>`}
                    </button>
                </div>
            `)}
            ${D&&F`
                <div class="tab-strip-spacer"></div>
                <button
                    class=${`tab-strip-dock-toggle${H?" active":""}`}
                    onClick=${D}
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
            ${E&&F`
                <button
                    class=${`tab-strip-zen-toggle${k?" active":""}`}
                    onClick=${E}
                    title=${`${k?"Exit":"Enter"} zen mode (Ctrl+Shift+Z)`}
                    aria-label=${`${k?"Exit":"Enter"} zen mode`}
                    aria-pressed=${k?"true":"false"}
                >
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        ${k?F`<polyline points="4 8 1.5 8 1.5 1.5 14.5 1.5 14.5 8 12 8"/><polyline points="4 8 1.5 8 1.5 14.5 14.5 14.5 14.5 8 12 8"/>`:F`<polyline points="5.5 1.5 1.5 1.5 1.5 5.5"/><polyline points="10.5 1.5 14.5 1.5 14.5 5.5"/><polyline points="5.5 14.5 1.5 14.5 1.5 10.5"/><polyline points="10.5 14.5 14.5 14.5 14.5 10.5"/>`}
                    </svg>
                </button>
            `}
        </div>
        ${O&&F`
            <div class="tab-context-menu" style=${{left:O.x+"px",top:O.y+"px"}}>
                <button onClick=${()=>{G?.(O.id),I(null)}}>Close</button>
                <button onClick=${()=>{Z?.(O.id),I(null)}}>Close Others</button>
                <button onClick=${()=>{X?.(),I(null)}}>Close All</button>
                <hr />
                <button onClick=${()=>{Y?.(O.id),I(null)}}>
                    ${C?.pinned?"Unpin":"Pin"}
                </button>
                ${P&&q&&F`
                    <button onClick=${()=>{q(O.id),I(null)}}>${b}</button>
                `}
                ${m&&U&&F`
                    <button onClick=${()=>{U(O.id),I(null)}}>Reattach</button>
                `}
                ${z&&!m&&F`
                    <button onClick=${()=>{let v=_.find((e)=>e.id===O.id);z(O.id,v?.label),I(null)}}>Open in Window</button>
                `}
                ${_0&&V&&F`
                    <hr />
                    <button onClick=${()=>{j?.(O.id),V(O.id),I(null)}}>${h?"Hide Diff":"Compare to Saved"}</button>
                `}
                ${L&&/\.(md|mdx|markdown)$/i.test(O.id)&&F`
                    <hr />
                    <button onClick=${()=>{L(O.id),I(null)}}>
                        ${Q?.has(O.id)?"Hide Preview":"Preview"}
                    </button>
                `}
                ${(()=>{let v=wA(O.id,{hasPopOutTab:typeof z==="function"});if(!v)return null;return F`
                        <hr />
                        <button onClick=${()=>{window.open(v,"_blank","noopener"),I(null)}}>Open in New Tab</button>
                    `})()}
            </div>
        `}
    `}M0();I_();b6();function S4(_,$=30){let j=Array.isArray(_)?_.map((G)=>Number(G)).filter((G)=>Number.isFinite(G)):[];return j.length>$?j.slice(j.length-$):j}function W8(_,$=30){return S4(_,$).map((j)=>Math.max(0,Math.min(100,j)))}function w2(_,$=56,j=16,G={}){let Z=S4(_);if(Z.length===0)return"";let X=Number.isFinite(G.min)?Number(G.min):Math.min(...Z),Y=Number.isFinite(G.max)?Number(G.max):Math.max(...Z);if(!(Y>X)){let L=(j/2).toFixed(2);return`M 0 ${L} L ${$} ${L}`}if(Z.length===1){let L=(Z[0]-X)/(Y-X),V=(j-L*j).toFixed(2);return`M 0 ${V} L ${$} ${V}`}return Z.map((L,V)=>{let q=V/(Z.length-1||1)*$,Q=(L-X)/(Y-X),K=j-Q*j;return`${V===0?"M":"L"} ${q.toFixed(2)} ${K.toFixed(2)}`}).join(" ")}function _4(_){return`${Math.round(Number(_)||0)}%`}function Yj(_){let $=Number(_);if(!Number.isFinite($)||$<=0)return"0B";let j=["B","K","M","G","T"],G=0,Z=$;while(Z>=1024&&G<j.length-1)Z/=1024,G+=1;let X=Z>=100||G===0?0:Z>=10?0:1;return`${Z.toFixed(X)}${j[G]}`}function TA(_){let $=[`CPU ${_4(_?.cpu_percent)}`,`RAM ${_4(_?.ram_percent)}`];if(Number(_?.buffer_cache_bytes)>0)$.push(`BUF ${Yj(_?.buffer_cache_bytes)}`);if(vV(_))$.push(`VRAM ${_4(_?.vram_percent)}`);if(Number.isFinite(Number(_?.swap_percent))&&Number(_?.swap_total_bytes)>0)$.push(`SWP ${_4(_?.swap_percent)}`);return $.join(" • ")}function bV(_){return Number(_?.process_memory?.vm_rss_bytes)>0?Number(_.process_memory.vm_rss_bytes):Number(_?.process_memory?.rss_bytes)||0}function xA(_){return bV(_)>0&&S4(_?.process_rss_series_bytes).length>0}function vV(_){return _?.vram_percent!==null&&_?.vram_percent!==void 0&&Number.isFinite(Number(_?.vram_percent))&&Number(_?.vram_total_bytes)>0&&Number(_?.vram_used_bytes)>=0&&S4(_?.vram_series).length>0}function IA(){if(typeof window>"u"||typeof window.matchMedia!=="function")return!1;return window.matchMedia("(max-width: 900px)").matches}function mV({mode:_="overlay"}){let[$,j]=f(()=>W5(!1)),[G,Z]=f(()=>jY(!1)),[X,Y]=f(()=>IA()),[L,V]=f({cpu_percent:0,ram_percent:0,swap_percent:null,cpu_series:[],ram_series:[],swap_series:[],vram_percent:null,vram_series:[],vram_total_bytes:0,vram_used_bytes:0,gpu_provider:null,buffer_cache_bytes:null,buffer_cache_series_bytes:[],process_rss_series_bytes:[],process_memory:{rss_bytes:0,vm_rss_bytes:null},swap_total_bytes:0,swap_used_bytes:0,sample_interval_ms:2000,platform:""}),[q,Q]=f(!1);u(()=>{let T=(C)=>{j(Boolean(C?.detail?.enabled))},J=(C)=>{Z(Boolean(C?.detail?.collapsed))};return window.addEventListener(I4,T),window.addEventListener(g6,J),()=>{window.removeEventListener(I4,T),window.removeEventListener(g6,J)}},[]),u(()=>{if(typeof window>"u"||typeof window.matchMedia!=="function")return;let T=window.matchMedia("(max-width: 900px)"),J=()=>Y(Boolean(T.matches));if(J(),typeof T.addEventListener==="function")return T.addEventListener("change",J),()=>T.removeEventListener("change",J);return T.addListener(J),()=>T.removeListener(J)},[]);let B=_==="overlay";u(()=>{if(!$||!B)return;let T=!1,J=0,C=async()=>{Q((P)=>P||L.cpu_series.length>0?P:!0);try{let P=await V7();if(T)return;V({cpu_percent:Number(P?.cpu_percent)||0,ram_percent:Number(P?.ram_percent)||0,swap_percent:Number.isFinite(Number(P?.swap_percent))?Number(P?.swap_percent):null,vram_percent:Number.isFinite(Number(P?.vram_percent))?Number(P?.vram_percent):null,cpu_series:W8(P?.cpu_series),ram_series:W8(P?.ram_series),swap_series:W8(P?.swap_series),vram_series:W8(P?.vram_series),vram_total_bytes:Number(P?.vram_total_bytes)||0,vram_used_bytes:Number(P?.vram_used_bytes)||0,gpu_provider:typeof P?.gpu_provider==="string"&&P.gpu_provider.trim()?P.gpu_provider.trim():null,buffer_cache_bytes:Number.isFinite(Number(P?.buffer_cache_bytes))?Number(P?.buffer_cache_bytes):null,buffer_cache_series_bytes:S4(P?.buffer_cache_series_bytes),process_rss_series_bytes:S4(P?.process_rss_series_bytes),process_memory:{rss_bytes:Number(P?.process_memory?.rss_bytes)||0,vm_rss_bytes:Number.isFinite(Number(P?.process_memory?.vm_rss_bytes))?Number(P?.process_memory?.vm_rss_bytes):null},swap_total_bytes:Number(P?.swap_total_bytes)||0,swap_used_bytes:Number(P?.swap_used_bytes)||0,sample_interval_ms:Number(P?.sample_interval_ms)||2000,platform:String(P?.platform||"")})}catch{if(T)return}finally{if(!T)Q(!1)}};return C(),J=window.setInterval(()=>{if(document?.visibilityState==="hidden")return;C()},Math.max(1000,Number(L.sample_interval_ms)||2000)),()=>{if(T=!0,J)window.clearInterval(J)}},[$,B]);let N=Y0(()=>w2(L.cpu_series,56,16,{min:0,max:100}),[L.cpu_series]),U=Y0(()=>w2(L.ram_series,56,16,{min:0,max:100}),[L.ram_series]),D=Y0(()=>w2(L.swap_series,56,16,{min:0,max:100}),[L.swap_series]),H=Y0(()=>w2(L.vram_series,56,16,{min:0,max:100}),[L.vram_series]),E=Y0(()=>w2(L.buffer_cache_series_bytes),[L.buffer_cache_series_bytes]),k=Y0(()=>w2(L.process_rss_series_bytes),[L.process_rss_series_bytes]),z=Number(L.buffer_cache_bytes)>0&&S4(L.buffer_cache_series_bytes).length>0,O=Number.isFinite(Number(L.swap_percent))&&L.swap_total_bytes>0,I=vV(L),x=bV(L),A=xA(L),y=Y0(()=>TA(L),[L]);if(!$||!B)return null;let W=G?"Show system meters":q?"Updating system meters… Click to collapse.":"System meters — click to collapse.",M=(T)=>{T?.stopPropagation?.();let J=!G;Z(J),s7(J)};return F`
        <div class=${`system-meters-hud system-meters-hud-${_}${G?" is-collapsed":""}`} aria-live="polite">
            <button
                class="system-meters-card"
                type="button"
                title=${W}
                aria-label=${W}
                aria-expanded=${G?"false":"true"}
                onClick=${M}
            >
                ${G?F`<span class="system-meters-collapse-tab" aria-hidden="true">◂</span>`:X?F`<span class="system-meters-compact-summary">${y}</span>`:F`
                            <div class="system-meters-row cpu">
                                <span class="system-meters-label">CPU</span>
                                <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                    <path d=${N}></path>
                                </svg>
                                <span class="system-meters-value">${_4(L.cpu_percent)}</span>
                            </div>
                            <div class="system-meters-row ram">
                                <span class="system-meters-label">RAM</span>
                                <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                    <path d=${U}></path>
                                </svg>
                                <span class="system-meters-value">${_4(L.ram_percent)}</span>
                            </div>
                            ${A&&F`
                                <div class="system-meters-row rss">
                                    <span class="system-meters-label">RSS</span>
                                    <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                        <path d=${k}></path>
                                    </svg>
                                    <span class="system-meters-value">${Yj(x)}</span>
                                </div>
                            `}
                            ${I&&F`
                                <div class="system-meters-row vram" title=${L.gpu_provider?`GPU telemetry: ${L.gpu_provider}`:"GPU memory telemetry"}>
                                    <span class="system-meters-label">VRAM</span>
                                    <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                        <path d=${H}></path>
                                    </svg>
                                    <span class="system-meters-value">${_4(L.vram_percent)}</span>
                                </div>
                            `}
                            ${z&&F`
                                <div class="system-meters-row buf">
                                    <span class="system-meters-label">BUF</span>
                                    <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                        <path d=${E}></path>
                                    </svg>
                                    <span class="system-meters-value">${Yj(L.buffer_cache_bytes)}</span>
                                </div>
                            `}
                            ${O&&F`
                                <div class="system-meters-row swap">
                                    <span class="system-meters-label">SWP</span>
                                    <svg class="system-meters-spark" viewBox="0 0 56 16" preserveAspectRatio="none" aria-hidden="true">
                                        <path d=${D}></path>
                                    </svg>
                                    <span class="system-meters-value">${_4(L.swap_percent)}</span>
                                </div>
                            `}
                        `}
            </button>
        </div>
    `}function CA(_){let{workspaceOpen:$,editorOpen:j,chatOnlyMode:G,zenMode:Z}=_;return`app-shell${$?"":" workspace-collapsed"}${j?" editor-open":""}${G?" chat-only":""}${Z?" zen-mode":""}`}function fA(_){let $=_?.user_message?.id??_?.row_id;if($===null||$===void 0||$==="")return null;let j=Number($);return Number.isFinite(j)?j:null}function PA(_){let{id:$,scrollToBottom:j,getElementById:G=(q)=>document.getElementById(q),scheduleRaf:Z=(q)=>requestAnimationFrame(q),scheduleTimeout:X=(q,Q)=>{setTimeout(q,Q)},maxAttempts:Y=12}=_,L=(q)=>{q.scrollIntoView({behavior:"smooth",block:"center"}),q.classList.add("post-highlight"),X(()=>q.classList.remove("post-highlight"),2000)},V=(q)=>{let Q=G(`post-${$}`);if(Q){L(Q);return}if(q<=0){j?.();return}Z(()=>{X(()=>V(q-1),40)})};V(Y)}function RA(_){let{response:$,viewStateRef:j,scrollToBottom:G,scrollPostedMessage:Z=(V)=>PA({id:V,scrollToBottom:G})}=_,{searchQuery:X,searchOpen:Y}=j.current||{};if(X||Y)return;let L=fA($);if(L){Z(L);return}G()}function cV(_){let{appShellRef:$,workspaceOpen:j,editorOpen:G,chatOnlyMode:Z,zenMode:X,isRenameBranchFormOpen:Y,closeRenameCurrentBranchForm:L,handleRenameCurrentBranch:V,renameBranchNameDraft:q,renameBranchNameInputRef:Q,setRenameBranchNameDraft:K,renameBranchDraftState:B,isRenamingBranch:N,addFileRef:U,addFolderRef:D,openEditor:H,openTerminalTab:E,openVncTab:k,hasDockPanes:z,toggleDock:O,dockVisible:I,handleSplitterMouseDown:x,handleSplitterTouchStart:A,showEditorPaneContainer:y,tabStripTabs:W,tabStripActiveId:M,handleTabActivate:T,handleTabClose:J,handleTabCloseOthers:C,handleTabCloseAll:P,handleTabTogglePin:b,handleTabTogglePreview:m,handleTabToggleDiff:h,handleTabEditSource:_0,handleReattachPane:v,previewTabs:e,diffTabs:W0,tabPaneOverrides:G0,toggleZenMode:$0,handlePopOutPane:L0,isWebAppMode:B0,editorContainerRef:t,editorInstanceRef:V0,detachedTabs:K0,activeDetachedTab:k0,detachedDockPane:s,handleDockSplitterMouseDown:X0,handleDockSplitterTouchStart:D0,TERMINAL_TAB_PATH:C0,dockContainerRef:g0,handleEditorSplitterMouseDown:p0,handleEditorSplitterTouchStart:j_,searchQuery:m0,isIOSDevice:d0,currentBranchRecord:u0,currentChatJid:o0,currentChatBranches:v0,handleBranchPickerChange:a0,formatBranchPickerLabel:n0,openRenameCurrentBranchForm:N_,handlePruneCurrentBranch:t0,handlePurgeArchivedBranch:b0,currentHashtag:A0,handleBackToTimeline:L_,activeSearchScopeLabel:e0,oobePanelState:z_,composePrefillRequest:E0,requestComposePrefill:R0,handleOobeSetupProvider:T0,handleOobeShowModelPicker:i0,handleOobeOpenWorkspace:A_,handleDismissProviderMissingOobe:q_,handleCompleteProviderReadyOobe:H_,posts:E_,isMainTimelineView:y_,hasMore:C_,loadMore:u_,timelineRef:D_,handleHashtagClick:j0,addMessageRef:O0,scrollToMessage:n,openFileFromPill:i,openTimelineFileFromPill:o,handleDeletePost:Z0,handleOpenFloatingWidget:q0,agents:J0,userProfile:c0,removingPostIds:S0,agentStatus:I0,isCompactionStatus:w0,agentDraft:l0,agentPlan:U0,agentThought:h0,pendingRequest:Y_,intentToast:G_,currentTurnId:f0,steerQueued:W_,handlePanelToggle:B_,btwSession:d,closeBtwPanel:z0,handleBtwRetry:Z_,handleBtwInject:K_,floatingWidget:n_,handleCloseFloatingWidget:F1,handleFloatingWidgetEvent:g_,attachmentPreview:J1,setAttachmentPreview:f_,extensionStatusPanels:M_,pendingExtensionPanelActions:A1,handleExtensionPanelAction:O_,searchOpen:k_,followupQueueItems:U1,handleInjectQueuedFollowup:m_,handleRemoveQueuedFollowup:p_,handleMoveQueuedFollowup:s_,viewStateRef:U_,loadPosts:x1,scrollToBottom:E1,searchScope:g1,handleSearch:k1,handleSearchScopeChange:e1,setSearchScope:c4,enterSearchMode:A$,exitSearchMode:t_,fileRefs:c_,removeFileRef:y1,clearFileRefs:H1,setFileRefsFromCompose:_1,folderRefs:k$,removeFolderRef:y$,clearFolderRefs:_$,setFolderRefsFromCompose:w_,messageRefs:q1,removeMessageRef:M$,clearMessageRefs:l4,setMessageRefsFromCompose:$$,handleCreateSessionFromCompose:h4,handleCreateRootSessionFromCompose:n4,handleRestoreBranch:w$,attachActiveEditorFile:T$,followupQueueCount:b1,handleBtwIntercept:v1,handleMessageResponse:r4,handleComposeSubmitError:V1,isComposeBoxAgentActive:R_,activeChatAgents:p4,connectionStatus:I1,stateAccessFailed:x$,activeModel:d4,agentModelsPayload:g2,activeModelUsage:b2,activeThinkingLevel:X4,supportsThinking:I$,contextUsage:i4,extensionWorkingState:o4,notificationsEnabled:K1,notificationPermission:C$,handleToggleNotifications:Y4,setActiveModel:L4,applyModelState:m1,setPendingRequest:D1,pendingRequestRef:v2,toggleWorkspace:q4}=_,j$=()=>{if(d0())return;E1()};return F`
    <div class=${CA({workspaceOpen:j,editorOpen:G,chatOnlyMode:Z,zenMode:X})} ref=${$}>
      <${mV} mode="overlay" />
      ${Y&&F`
        <div class="rename-branch-overlay" onPointerDown=${(e_)=>{if(e_.target===e_.currentTarget)L()}}>
          <form
            class="rename-branch-panel"
            onSubmit=${(e_)=>{e_.preventDefault(),V(q)}}
          >
            <div class="rename-branch-title">Rename session</div>
            <input
              ref=${Q}
              value=${q}
              onInput=${(e_)=>{let f$=e_.currentTarget?.value??"";K(String(f$))}}
              onKeyDown=${(e_)=>{if(e_.key==="Escape")e_.preventDefault(),L()}}
              autocomplete="off"
              placeholder="Session handle (letters, numbers, - and _ only)"
            />
            <div class=${`rename-branch-help ${B.kind||"info"}`}>
              ${B.message}
            </div>
            <div class="rename-branch-actions">
              <button type="submit" class="compose-model-popup-btn primary" disabled=${N||!B.canSubmit}>
                ${N?"Renaming…":"Save"}
              </button>
              <button
                type="button"
                class="compose-model-popup-btn"
                onClick=${L}
                disabled=${N}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      `}
      ${!Z&&F`
        <${PV}
          onFileSelect=${U}
          onFolderSelect=${D}
          visible=${j}
          active=${j||G}
          onOpenEditor=${H}
          onOpenTerminalTab=${E}
          onOpenVncTab=${k}
          onToggleTerminal=${z?O:void 0}
          terminalVisible=${Boolean(z&&I)}
        />
        <button
          class=${`workspace-toggle-tab${j?" open":" closed"}`}
          onClick=${q4}
          title=${j?"Hide workspace":"Show workspace"}
          aria-label=${j?"Hide workspace":"Show workspace"}
        >
          <svg class="workspace-toggle-tab-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 3 11 8 6 13" />
          </svg>
        </button>
        <div class="workspace-splitter" onMouseDown=${x} onTouchStart=${A}></div>
      `}
      ${y&&F`
        <div class="editor-pane-container">
          ${X&&F`<div class="zen-hover-zone"></div>`}
          ${G&&F`
            <${gV}
              tabs=${W}
              activeId=${M}
              onActivate=${T}
              onClose=${J}
              onCloseOthers=${C}
              onCloseAll=${P}
              onTogglePin=${b}
              onTogglePreview=${m}
              onToggleDiff=${h}
              onEditSource=${_0}
              previewTabs=${e}
              diffTabs=${W0}
              paneOverrides=${G0}
              detachedTabs=${K0}
              onReattachTab=${v}
              onToggleDock=${z?O:void 0}
              dockVisible=${z&&I}
              onToggleZen=${$0}
              zenMode=${X}
              onPopOutTab=${B0?void 0:L0}
            />
          `}
          ${G&&k0&&F`
            <div class="editor-pane-host editor-pane-detached-host">
              <div class="editor-empty-state">
                <div class="editor-empty-state-title">${k0.label||k0.panePath||"Detached pane"}</div>
                <div class="editor-empty-state-body">This pane is detached into another window.</div>
                <div class="editor-empty-state-actions">
                  <button class="editor-empty-state-button" onClick=${()=>v(k0.panePath)}>Reattach here</button>
                </div>
              </div>
            </div>
          `}
          ${G&&!k0&&F`<div class="editor-pane-host" ref=${t}></div>`}
          ${G&&!k0&&M&&e.has(M)&&F`
            <${i6}
              getContent=${()=>V0.current?.getContent?.()}
              path=${M}
              onClose=${()=>m(M)}
            />
          `}
          ${z&&I&&F`<div class="dock-splitter" onMouseDown=${X0} onTouchStart=${D0}></div>`}
          ${z&&F`<div class=${`dock-panel${I?"":" hidden"}${G?"":" standalone"}`}>
            <div class="dock-panel-header">
              <span class="dock-panel-title">Terminal</span>
              <div class="dock-panel-actions">
                ${!B0&&!s&&F`
                  <button class="dock-panel-action" onClick=${()=>L0(C0,"Terminal")} title="Open terminal in window" aria-label="Open terminal in window">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2.25" y="2.25" width="8.5" height="8.5" rx="1.5"/>
                      <path d="M8.5 2.25h5.25v5.25"/>
                      <path d="M13.75 2.25 7.75 8.25"/>
                    </svg>
                  </button>
                `}
                ${s&&F`
                  <button class="dock-panel-action" onClick=${()=>v(C0)} title="Reattach terminal" aria-label="Reattach terminal">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.5"/>
                      <path d="M5.25 8h5.5"/>
                      <path d="M8 5.25v5.5"/>
                    </svg>
                  </button>
                `}
                <button class="dock-panel-close" onClick=${O} title="Hide terminal (Ctrl+\`)" aria-label="Hide terminal">
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                    <line x1="4" y1="4" x2="12" y2="12"/>
                    <line x1="12" y1="4" x2="4" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
            ${s?F`
                <div class="dock-panel-body dock-panel-body-detached">
                  <div class="editor-empty-state">
                    <div class="editor-empty-state-title">Terminal detached</div>
                    <div class="editor-empty-state-body">The terminal is open in another window.</div>
                    <div class="editor-empty-state-actions">
                      <button class="editor-empty-state-button" onClick=${()=>v(C0)}>Reattach here</button>
                    </div>
                  </div>
                </div>
              `:F`<div class="dock-panel-body" ref=${g0}></div>`}
          </div>`}
        </div>
        <div class="editor-splitter" onMouseDown=${p0} onTouchStart=${j_}></div>
      `}
      <${yq}
        workspaceOpen=${j}
        toggleWorkspace=${q4}
        chatOnlyMode=${Z}
        onOpenTerminalTab=${E}
        onOpenVncTab=${k}
        onToggleTerminal=${z?O:void 0}
        terminalVisible=${Boolean(z&&I)}
      />
      <${kq}
        activeChatAgents=${p4}
        currentChatJid=${o0}
        workspaceOpen=${j}
        chatOnlyMode=${Z}
        terminalVisible=${Boolean(z&&I)}
        onSwitchChat=${a0}
        onToggleWorkspace=${q4}
        onOpenTerminalTab=${E}
        onOpenVncTab=${k}
        onToggleTerminalDock=${z?O:void 0}
        onPrefillCompose=${R0}
      />
      <div class="container">
        ${m0&&d0()&&F`<div class="search-results-spacer"></div>`}
        ${(A0||m0)&&F`
          <div class="hashtag-header">
            <button class="back-btn" onClick=${L_}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <span>${A0?`#${A0}`:`Search: ${m0} · ${e0}`}</span>
          </div>
        `}
        ${z_?.kind&&z_.kind!=="hidden"&&F`
          <${SL}
            kind=${z_.kind}
            onSetupProvider=${T0}
            onShowModelPicker=${i0}
            onOpenWorkspace=${A_}
            onDismiss=${z_.kind==="provider-missing"?q_:H_}
          />
        `}
        <${FV}
          posts=${E_}
          hasMore=${y_?C_:!1}
          onLoadMore=${y_?u_:void 0}
          timelineRef=${D_}
          onHashtagClick=${j0}
          onMessageRef=${O0}
          onScrollToMessage=${n}
          onFileRef=${o||i}
          onPostClick=${void 0}
          onDeletePost=${Z0}
          onOpenWidget=${q0}
          onOpenAttachmentPreview=${f_}
          emptyMessage=${A0?`No posts with #${A0}`:m0?`No results for "${m0}"`:void 0}
          agents=${J0}
          user=${c0}
          reverse=${y_}
          removingPostIds=${S0}
          searchQuery=${m0}
        />
        <${m9}
          status=${w0(I0)?null:I0}
          draft=${l0}
          plan=${U0}
          thought=${h0}
          pendingRequest=${Y_}
          intent=${G_}
          turnId=${f0}
          steerQueued=${W_}
          onPanelToggle=${B_}
          showExtensionPanels=${!1}
        />
        <${cL}
          session=${d}
          onClose=${z0}
          onRetry=${Z_}
          onInject=${K_}
        />
        <${jq}
          widget=${n_}
          onClose=${F1}
          onWidgetEvent=${g_}
        />
        ${J1&&F`
          <${zq}
            mediaId=${J1.mediaId}
            info=${J1.info}
            onClose=${()=>f_(null)}
          />
        `}
        <${QL} />
        <${m9}
          extensionPanels=${Array.from(M_.values())}
          pendingPanelActions=${A1}
          onExtensionPanelAction=${O_}
          turnId=${f0}
          steerQueued=${W_}
          onPanelToggle=${B_}
          showCorePanels=${!1}
        />
        <${f9}
          items=${k_?[]:U1}
          onInjectQueuedFollowup=${m_}
          onRemoveQueuedFollowup=${p_}
          onMoveQueuedFollowup=${s_}
          onOpenFilePill=${i}
        />
        <${RL}
          onPost=${(e_)=>{RA({response:e_,viewStateRef:U_,scrollToBottom:E1})}}
          onFocus=${j$}
          searchMode=${k_}
          searchScope=${g1}
          onSearch=${k1}
          onSearchScopeChange=${e1||c4}
          onEnterSearch=${A$}
          onExitSearch=${t_}
          fileRefs=${c_}
          onRemoveFileRef=${y1}
          onClearFileRefs=${H1}
          onSetFileRefs=${_1}
          folderRefs=${k$}
          onRemoveFolderRef=${y$}
          onClearFolderRefs=${_$}
          onSetFolderRefs=${w_}
          messageRefs=${q1}
          onRemoveMessageRef=${M$}
          onClearMessageRefs=${l4}
          onSetMessageRefs=${$$}
          onSwitchChat=${a0}
          onRenameSession=${V}
          isRenameSessionInProgress=${N}
          onCreateSession=${h4}
          onCreateRootSession=${n4}
          onDeleteSession=${t0}
          onPurgeArchivedSession=${b0}
          onRestoreSession=${w$}
          activeEditorPath=${Z?null:M}
          onAttachEditorFile=${Z?void 0:T$}
          onOpenFilePill=${i}
          followupQueueCount=${b1}
          followupQueueItems=${U1}
          showQueueStack=${!1}
          onInjectQueuedFollowup=${m_}
          onRemoveQueuedFollowup=${p_}
          onMoveQueuedFollowup=${s_}
          onSubmitIntercept=${v1}
          onMessageResponse=${r4}
          onSubmitError=${V1}
          isAgentActive=${R_}
          activeChatAgents=${p4}
          currentChatJid=${o0}
          connectionStatus=${I1}
          stateAccessFailed=${x$}
          activeModel=${d4}
          agentModelsPayload=${g2}
          modelUsage=${b2}
          thinkingLevel=${X4}
          supportsThinking=${I$}
          contextUsage=${i4}
          notificationsEnabled=${K1}
          notificationPermission=${C$}
          onToggleNotifications=${Y4}
          onModelChange=${L4}
          onModelStateChange=${m1}
          statusNotice=${w0(I0)?I0:null}
          extensionWorkingState=${o4}
          prefillRequest=${E0}
        />
        <${bq}
          request=${Y_}
          onRespond=${()=>{D1(null),v2.current=null}}
        />
      </div>
    </div>
  `}function lV(_){let{branchLoaderMode:$,panePopoutMode:j,branchLoaderState:G,panePopoutOptions:Z,mainShellOptions:X,renderers:Y}=_,L=FL({branchLoaderMode:$,panePopoutMode:j}),V=Y?.renderBranchLoaderMode||UL,q=Y?.renderPanePopoutMode||EL,Q=Y?.renderMainShell||cV;if(L==="branch-loader")return V(G);if(L==="pane-popout")return q(Z);return Q(X)}var z8="piclaw_btw_session",nV=900,hV="__piclawRenameBranchFormLock__";function SA(){try{return import.meta.url}catch{return null}}function Lj(_){let $=typeof _==="string"?_.trim().toLowerCase():"";return $==="1"||$==="true"||$==="yes"}function uA(_){try{let $=_?new URL(_).searchParams.get("v"):null;return $&&$.trim()?$.trim():null}catch{return null}}function O8(_,$,j=""){let G=_?.get?.($);return G&&G.trim()?G.trim():j}function rV(_={}){let $=_.importMetaUrl===void 0?SA():_.importMetaUrl,j=_.document===void 0?typeof document<"u"?document:null:_.document,G=_.origin===void 0?typeof window<"u"?window.location.origin:"http://localhost":_.origin||"http://localhost",Z=uA($);if(Z)return Z;try{let Y=Array.from(j?.querySelectorAll?.('script[type="module"][src]')||[]).find((q)=>String(q?.getAttribute?.("src")||"").includes("/static/dist/app.bundle.js"))?.getAttribute?.("src")||"";if(!Y)return null;let V=new URL(Y,G).searchParams.get("v");return V&&V.trim()?V.trim():null}catch{return null}}function pV(_={}){let $=_.window===void 0?typeof window<"u"?window:null:_.window;if(!$)return null;let j=$[hV];if(j&&typeof j==="object")return j;let G={inFlight:!1,cooldownUntil:0};return $[hV]=G,G}function dV(_){if(_==="root")return"Branch family";if(_==="all")return"All chats";return"Current branch"}function iV(_={}){let $=typeof _.readItem==="function"?_.readItem:O1,j=_.storageKey||z8,G=$(j);if(!G)return null;try{let Z=JSON.parse(G);if(!Z||typeof Z!=="object")return null;let X=typeof Z.question==="string"?Z.question:"",Y=typeof Z.answer==="string"?Z.answer:"",L=typeof Z.thinking==="string"?Z.thinking:"",V=typeof Z.error==="string"&&Z.error.trim()?Z.error:null,q=Z.status==="running"?"error":Z.status==="success"||Z.status==="error"?Z.status:"success";return{question:X,answer:Y,thinking:L,error:q==="error"?V||"BTW stream interrupted. You can retry.":V,model:null,status:q}}catch{return null}}function oV(_,$={}){let j=$.defaultChatJid||"web:default",G=O8(_,"chat_jid",j),Z=Lj(_?.get?.("chat_only")||_?.get?.("chat-only")),X=Lj(_?.get?.("pane_popout")),Y=O8(_,"pane_path"),L=O8(_,"pane_label"),V=Lj(_?.get?.("branch_loader")),q=O8(_,"branch_source_chat_jid",G);return{currentChatJid:G,chatOnlyMode:Z,panePopoutMode:X,panePopoutPath:Y,panePopoutLabel:L,branchLoaderMode:V,branchLoaderSourceChatJid:q}}function sV(_,$){let j=Array.isArray(_)?_:[];return j.find((G)=>G?.id===$)||j[0]||null}function aV(_,$){if(!$||!_||typeof _.get!=="function")return null;return _.get($)||null}function qj(_,$,j){return _||$?.label||j||"Pane"}function tV(_,$,j){return`${qj(_,$,j)} · PiClaw`}function eV(_,$,j,G){let Z=Array.isArray(_)?_.length:0,X=Boolean(G&&$?.has?.(G)),Y=Boolean(G&&j?.has?.(G));return Z>1||X||Y}function _K(_,$){let j=typeof _==="string"?_:"";return j===$||j.startsWith(`${$}/`)}function $K(_,$,j,G){return _===$&&!j||G}function jK(_,$,j,G,Z){return _||!$&&(j||G&&Z)}I_();function gA(_,$){if(typeof window<"u")console.warn(`[app] API export missing: ${_}. Using fallback behavior.`);return async()=>$}function Y1(_,$,j){let G=_?.[$];return typeof G==="function"?G:gA($,j)}var GK=!1,ZK=!1,XK=!1;function bA(_){if(!_||typeof _.setOptions!=="function")return;_.setOptions({breaks:!0,gfm:!0})}function vA(_=typeof window<"u"?window:null){if(!_||ZK)return;let $=(j)=>{let G=String(j?.message||j?.error?.message||"").trim();if(!/ResizeObserver loop (completed with undelivered notifications|limit exceeded)/i.test(G)){if(!(G==="Script error."&&(j?.lineno===0||!j?.filename)))return}j.preventDefault?.(),j.stopImmediatePropagation?.()};_.addEventListener("error",$,!0),ZK=!0}function mA(){X_.register(H3),X_.register(u7),X_.register(S7),X_.register(g7),X_.register(b7),X_.register(v7),X_.register(c7),X_.register(l7),X_.register(h7),X_.register(r7),X_.register(s3),D3(),X_.register(k3),X_.register(y3)}function cA(_=typeof window<"u"?window:null){if(!_||XK)return;if(!_.isSecureContext)return;if(!("serviceWorker"in _.navigator))return;XK=!0,_.navigator.serviceWorker.register("/sw.js").catch(($)=>{console.warn("Failed to register app service worker:",$)})}async function YK(){if(GK)return;let _=typeof window<"u"?window:null,$=_?_?.marked:null;if(bA($),vA(_),g9(_),_)try{let j=await Promise.resolve().then(() => (M0(),OG));_.__piclawPreactHtm=j,_.__piclawPreact=j}catch(j){}mA(),await Kq(_),cA(_),GK=!0}function lA(_=N5){return{searchPosts:_.searchPosts,deletePost:_.deletePost,getAgents:_.getAgents,getAgentThought:_.getAgentThought,setAgentThoughtVisibility:_.setAgentThoughtVisibility,getAgentStatus:_.getAgentStatus,getWorkspaceFile:_.getWorkspaceFile,getThread:_.getThread,getTimeline:_.getTimeline,sendAgentMessage:_.sendAgentMessage,forkChatBranch:_.forkChatBranch,getAgentContext:Y1(_,"getAgentContext",null),getAutoresearchStatus:Y1(_,"getAutoresearchStatus",null),stopAutoresearch:Y1(_,"stopAutoresearch",{status:"ok"}),dismissAutoresearch:Y1(_,"dismissAutoresearch",{status:"ok"}),getAgentModels:Y1(_,"getAgentModels",{current:null,models:[]}),completeInstanceOobe:Y1(_,"completeInstanceOobe",{status:"ok"}),getActiveChatAgents:Y1(_,"getActiveChatAgents",{chats:[]}),getChatBranches:Y1(_,"getChatBranches",{chats:[]}),renameChatBranch:Y1(_,"renameChatBranch",null),pruneChatBranch:Y1(_,"pruneChatBranch",null),restoreChatBranch:Y1(_,"restoreChatBranch",null),getAgentQueueState:Y1(_,"getAgentQueueState",{count:0}),steerAgentQueueItem:Y1(_,"steerAgentQueueItem",{removed:!1,queued:"steer"}),removeAgentQueueItem:Y1(_,"removeAgentQueueItem",{removed:!1}),streamSidePrompt:Y1(_,"streamSidePrompt",null)}}var LK=lA(N5);function qK(_){let{routing:$,paneRuntime:j,splitters:G,branchPaneActions:Z,timelineViewActions:X,composeReferenceActions:Y,sidepanelActions:L,shellState:V,agentState:q,composeState:Q,modelState:K}=_,B={appShellRef:V.appShellRef,editorOpen:V.editorOpen,hidePanePopoutControls:j.hidePanePopoutControls,panePopoutHasMenuActions:j.panePopoutHasMenuActions,panePopoutTitle:j.panePopoutTitle,tabStripTabs:V.tabStripTabs,tabStripActiveId:V.tabStripActiveId,handleTabActivate:V.handleTabActivate,previewTabs:V.previewTabs,diffTabs:V.diffTabs,handleTabTogglePreview:V.handleTabTogglePreview,handleTabToggleDiff:V.handleTabToggleDiff,editorContainerRef:j.editorContainerRef,getPaneContent:()=>j.editorInstanceRef?.current?.getContent?.(),panePopoutPath:V.panePopoutPath,canReattachPane:j.canReattachPanePopout,handleReattachPane:j.requestPanePopoutReattach},N={appShellRef:V.appShellRef,workspaceOpen:V.workspaceOpen,editorOpen:V.editorOpen,chatOnlyMode:V.chatOnlyMode,zenMode:j.zenMode,isRenameBranchFormOpen:V.isRenameBranchFormOpen,closeRenameCurrentBranchForm:Z.closeRenameCurrentBranchForm,handleRenameCurrentBranch:Z.handleRenameCurrentBranch,renameBranchNameDraft:V.renameBranchNameDraft,renameBranchNameInputRef:V.renameBranchNameInputRef,setRenameBranchNameDraft:V.setRenameBranchNameDraft,renameBranchDraftState:V.renameBranchDraftState,isRenamingBranch:V.isRenamingBranch,hasDockPanes:j.hasDockPanes,toggleDock:j.toggleDock,dockVisible:j.dockVisible,showEditorPaneContainer:j.showEditorPaneContainer,toggleZenMode:j.toggleZenMode,isWebAppMode:V.isWebAppMode,editorContainerRef:j.editorContainerRef,editorInstanceRef:j.editorInstanceRef,dockContainerRef:j.dockContainerRef,detachedTabs:j.detachedTabs,activeDetachedTab:j.activeDetachedTab,detachedDockPane:j.detachedDockPane,TERMINAL_TAB_PATH:V.TERMINAL_TAB_PATH,isIOSDevice:V.isIOSDevice,currentBranchRecord:V.currentBranchRecord,currentChatJid:V.currentChatJid,currentChatBranches:V.currentChatBranches,formatBranchPickerLabel:V.formatBranchPickerLabel,activeSearchScopeLabel:V.activeSearchScopeLabel,currentHashtag:V.currentHashtag,searchQuery:V.searchQuery,oobePanelState:V.oobePanelState,composePrefillRequest:V.composePrefillRequest,requestComposePrefill:V.requestComposePrefill,handleOobeSetupProvider:V.handleOobeSetupProvider,handleOobeShowModelPicker:V.handleOobeShowModelPicker,handleOobeOpenWorkspace:V.handleOobeOpenWorkspace,handleDismissProviderMissingOobe:V.handleDismissProviderMissingOobe,handleCompleteProviderReadyOobe:V.handleCompleteProviderReadyOobe,posts:V.posts,hasMore:V.hasMore,loadMore:V.loadMore,timelineRef:V.timelineRef,agents:V.agents,userProfile:V.userProfile,removingPostIds:V.removingPostIds,extensionStatusPanels:V.extensionStatusPanels,pendingExtensionPanelActions:V.pendingExtensionPanelActions,searchOpen:V.searchOpen,followupQueueItems:V.followupQueueItems,viewStateRef:V.viewStateRef,loadPosts:V.loadPosts,scrollToBottom:V.scrollToBottom,searchScope:V.searchScope,tabStripTabs:V.tabStripTabs,tabStripActiveId:V.tabStripActiveId,handleTabActivate:V.handleTabActivate,previewTabs:V.previewTabs,diffTabs:V.diffTabs,handleTabTogglePreview:V.handleTabTogglePreview,handleTabToggleDiff:V.handleTabToggleDiff,panePopoutPath:V.panePopoutPath,tabPaneOverrides:V.tabPaneOverrides,handleTabClose:V.handleTabClose,handleTabCloseOthers:V.handleTabCloseOthers,handleTabCloseAll:V.handleTabCloseAll,handleTabTogglePin:V.handleTabTogglePin,handleTabEditSource:V.handleTabEditSource,handleReattachPane:j.reattachPane,openEditor:V.openEditor,openTerminalTab:V.openTerminalTab,openVncTab:V.openVncTab,fileRefs:Q.fileRefs,folderRefs:Q.folderRefs,messageRefs:Q.messageRefs,followupQueueCount:Q.followupQueueCount,attachmentPreview:Q.attachmentPreview,setAttachmentPreview:Q.setAttachmentPreview,extensionWorkingState:Q.extensionWorkingState,activeChatAgents:K.activeChatAgents,connectionStatus:K.connectionStatus,stateAccessFailed:K.stateAccessFailed,activeModel:K.activeModel,activeModelUsage:K.activeModelUsage,activeThinkingLevel:K.activeThinkingLevel,supportsThinking:K.supportsThinking,contextUsage:K.contextUsage,notificationsEnabled:K.notificationsEnabled,notificationPermission:K.notificationPermission,handleToggleNotifications:K.handleToggleNotifications,setActiveModel:K.setActiveModel,applyModelState:K.applyModelState,setPendingRequest:q.setPendingRequest,pendingRequestRef:q.pendingRequestRef,...G,...Z,...X,...Y,...L,...q,...Q,...K};return{branchLoaderMode:$.branchLoaderMode,panePopoutMode:$.panePopoutMode,branchLoaderState:$.branchLoaderState,panePopoutOptions:B,mainShellOptions:N}}function hA(_){let{steerQueuedTurnId:$,currentTurnId:j,agentStatus:G}=_;return Boolean($&&$===(G?.turn_id||j))}function VK(_){let $=hA({steerQueuedTurnId:_.agentState.steerQueuedTurnId,currentTurnId:_.agentState.currentTurnId,agentStatus:_.agentState.agentStatus});return qK({routing:{branchLoaderMode:_.routeState.branchLoaderMode,panePopoutMode:_.routeState.panePopoutMode,branchLoaderState:_.surface.branchLoaderState},paneRuntime:_.paneRuntime,splitters:_.splitters,branchPaneActions:_.orchestration.branchPaneActions,timelineViewActions:_.orchestration.timelineViewActions,composeReferenceActions:_.interaction.composeReferenceActions,sidepanelActions:_.orchestration.sidepanelActions,shellState:{appShellRef:_.surface.appShellRef,workspaceOpen:_.surface.workspaceOpen,editorOpen:_.editorState.editorOpen,chatOnlyMode:_.routeState.chatOnlyMode,isRenameBranchFormOpen:_.surface.isRenameBranchFormOpen,renameBranchNameDraft:_.surface.renameBranchNameDraft,renameBranchNameInputRef:_.surface.renameBranchNameInputRef,setRenameBranchNameDraft:_.surface.setRenameBranchNameDraft,renameBranchDraftState:_.surface.renameBranchDraftState,isRenamingBranch:_.surface.isRenamingBranch,isWebAppMode:_.surface.isWebAppMode,TERMINAL_TAB_PATH:_.helpers.terminalTabPath,isIOSDevice:_.helpers.isIOSDevice,currentBranchRecord:_.surface.currentBranchRecord,currentChatJid:_.routeState.currentChatJid,currentChatBranches:_.surface.currentChatBranches,formatBranchPickerLabel:_.helpers.formatBranchPickerLabel,activeSearchScopeLabel:_.surface.activeSearchScopeLabel,currentHashtag:_.surface.currentHashtag,searchQuery:_.surface.searchQuery,oobePanelState:_.surface.oobePanelState,composePrefillRequest:_.surface.composePrefillRequest,requestComposePrefill:_.surface.requestComposePrefill,handleOobeSetupProvider:_.surface.handleOobeSetupProvider,handleOobeShowModelPicker:_.surface.handleOobeShowModelPicker,handleOobeOpenWorkspace:_.surface.handleOobeOpenWorkspace,handleDismissProviderMissingOobe:_.surface.handleDismissProviderMissingOobe,handleCompleteProviderReadyOobe:_.surface.handleCompleteProviderReadyOobe,posts:_.timeline.posts,hasMore:_.timeline.hasMore,loadMore:_.timeline.loadMore,timelineRef:_.surface.timelineRef,agents:_.surface.agents,userProfile:_.surface.userProfile,removingPostIds:_.surface.removingPostIds,extensionStatusPanels:_.surface.extensionStatusPanels,pendingExtensionPanelActions:_.surface.pendingExtensionPanelActions,searchOpen:_.surface.searchOpen,followupQueueItems:_.surface.followupQueueItems,viewStateRef:_.surface.viewStateRef,loadPosts:_.timeline.loadPosts,scrollToBottom:_.timeline.scrollToBottom,searchScope:_.surface.searchScope,tabStripTabs:_.editorState.tabStripTabs,tabStripActiveId:_.editorState.tabStripActiveId,handleTabActivate:_.editorState.handleTabActivate,previewTabs:_.editorState.previewTabs,diffTabs:_.editorState.diffTabs,handleTabTogglePreview:_.editorState.handleTabTogglePreview,handleTabToggleDiff:_.editorState.handleTabToggleDiff,panePopoutPath:_.routeState.panePopoutPath,tabPaneOverrides:_.editorState.tabPaneOverrides,handleTabClose:_.editorState.handleTabClose,handleTabCloseOthers:_.editorState.handleTabCloseOthers,handleTabCloseAll:_.editorState.handleTabCloseAll,handleTabTogglePin:_.editorState.handleTabTogglePin,handleTabEditSource:_.editorState.handleTabEditSource,openEditor:_.editorState.openEditor,openTerminalTab:_.paneRuntime.openTerminalTab,openVncTab:_.paneRuntime.openVncTab},agentState:{agentStatus:_.agentState.agentStatus,isCompactionStatus:_.agentState.isCompactionStatus,agentDraft:_.agentState.agentDraft,agentPlan:_.agentState.agentPlan,agentThought:_.agentState.agentThought,pendingRequest:_.agentState.pendingRequest,intentToast:_.surface.intentToast,currentTurnId:_.agentState.currentTurnId,steerQueued:$,handlePanelToggle:_.interaction.handlePanelToggle,setPendingRequest:_.agentState.setPendingRequest,pendingRequestRef:_.agentState.pendingRequestRef,handleInjectQueuedFollowup:_.orchestration.followupActions.handleInjectQueuedFollowup,handleRemoveQueuedFollowup:_.orchestration.followupActions.handleRemoveQueuedFollowup,handleMoveQueuedFollowup:_.orchestration.followupActions.handleMoveQueuedFollowup},composeState:{btwSession:_.surface.btwSession,floatingWidget:_.surface.floatingWidget,fileRefs:_.surface.fileRefs,folderRefs:_.surface.folderRefs,messageRefs:_.surface.messageRefs,followupQueueCount:_.surface.followupQueueCount,attachmentPreview:_.surface.attachmentPreview,setAttachmentPreview:_.surface.setAttachmentPreview,handleMessageResponse:_.orchestration.followupActions.handleMessageResponse,isComposeBoxAgentActive:_.orchestration.isComposeBoxAgentActive,extensionWorkingState:_.surface.extensionWorkingState},modelState:{activeChatAgents:_.surface.activeChatAgents,connectionStatus:_.surface.connectionStatus,stateAccessFailed:_.surface.stateAccessFailed,activeModel:_.surface.activeModel,agentModelsPayload:_.surface.agentModelsPayload,activeModelUsage:_.surface.activeModelUsage,activeThinkingLevel:_.surface.activeThinkingLevel,supportsThinking:_.surface.supportsThinking,contextUsage:_.surface.contextUsage,notificationsEnabled:_.surface.notificationsEnabled,notificationPermission:_.surface.notificationPermission,handleToggleNotifications:_.surface.handleToggleNotifications,setActiveModel:_.surface.setActiveModel,applyModelState:_.orchestration.chatRefreshLifecycle.applyModelState}})}M0();var QK="(min-width: 1024px) and (orientation: landscape)";function Vj(_=typeof window<"u"?window:null){return _&&typeof _==="object"?_:null}function KK(_,$){let j=Vj(_);if(!j?.localStorage?.getItem)return null;try{let G=j.localStorage.getItem($);if(G===null)return null;return G==="true"}catch{return null}}function nA(_,$,j){let G=Vj(_);if(!G?.localStorage?.setItem)return;try{G.localStorage.setItem($,String(Boolean(j)))}catch{return}}function T5(_=typeof window<"u"?window:null){let $=Vj(_);if(!$?.matchMedia)return"desktop";return $.matchMedia("(min-width: 1024px) and (orientation: landscape)").matches?"desktop":"narrow"}function NK(_){return _==="narrow"?"workspaceOpen.narrow":"workspaceOpen.desktop"}function BK(_={}){let{runtime:$=typeof window<"u"?window:null,bucket:j=null,allowLegacyFallback:G=!1,defaultValue:Z=!1}=_,X=j||T5($),Y=NK(X),L=KK($,Y);if(typeof L==="boolean")return L;if(G&&X==="desktop"){let V=KK($,"workspaceOpen");if(typeof V==="boolean")return V}return Z}function FK(_,$={}){let{runtime:j=typeof window<"u"?window:null,bucket:G=null}=$,Z=G||T5(j);nA(j,NK(Z),Boolean(_))}_5();var rA=["(display-mode: standalone)","(display-mode: minimal-ui)","(display-mode: fullscreen)"];function UK(_,$={}){let j=$.window??(typeof window<"u"?window:null),G=$.navigator??(typeof navigator<"u"?navigator:null);if(!j||typeof _!=="function")return()=>{};let Z=()=>{_(P1({window:j,navigator:G}))};Z();let Y=rA.map((L)=>{try{return j.matchMedia?.(L)??null}catch{return null}}).filter(Boolean).map((L)=>{if(typeof L.addEventListener==="function")return L.addEventListener("change",Z),()=>L.removeEventListener("change",Z);if(typeof L.addListener==="function")return L.addListener(Z),()=>L.removeListener(Z);return()=>{}});return j.addEventListener?.("focus",Z),j.addEventListener?.("pageshow",Z),()=>{for(let L of Y)L();j.removeEventListener?.("focus",Z),j.removeEventListener?.("pageshow",Z)}}function J8(_,$={}){let j=$.window??(typeof window<"u"?window:null),G=$.document??(typeof document<"u"?document:null);if(!j||!G||typeof _!=="function")return()=>{};let Z=()=>{if(G.visibilityState&&G.visibilityState!=="visible")return;_()};return j.addEventListener?.("focus",Z),j.addEventListener?.("pageshow",Z),G.addEventListener?.("visibilitychange",Z),()=>{j.removeEventListener?.("focus",Z),j.removeEventListener?.("pageshow",Z),G.removeEventListener?.("visibilitychange",Z)}}function EK(_={}){return P1(_)&&L6(_)}function pA(_={}){let $=_.window??(typeof window<"u"?window:null),j=Number($?.visualViewport?.height||0);if(Number.isFinite(j)&&j>0)return Math.round(j);let G=Number($?.innerHeight||0);if(Number.isFinite(G)&&G>0)return Math.round(G);return null}function dA(_={},$={}){if(!EK(_))return null;let j=_.window??(typeof window<"u"?window:null),G=_.document??(typeof document<"u"?document:null);if(!j||!G?.documentElement)return null;let Z=pA({window:j});if(Z&&Z>0)G.documentElement.style.setProperty("--app-height",`${Z}px`);if($.resetScroll===!0){try{if(typeof j.scrollTo==="function")j.scrollTo(0,0)}catch(X){console.debug("[mobile-viewport] Ignoring scrollTo failure during standalone viewport reset.",X)}try{if(G.scrollingElement)G.scrollingElement.scrollTop=0,G.scrollingElement.scrollLeft=0;if(G.documentElement)G.documentElement.scrollTop=0,G.documentElement.scrollLeft=0;if(G.body)G.body.scrollTop=0,G.body.scrollLeft=0}catch(X){console.debug("[mobile-viewport] Ignoring DOM scroll reset failure during standalone viewport sync.",X)}}return Z}function HK(_={}){if(!EK(_))return()=>{};let $=_.window??(typeof window<"u"?window:null),j=_.document??(typeof document<"u"?document:null);if(!$||!j)return()=>{};j.documentElement?.style?.setProperty?.("--app-height","100vh");let G=0,Z=new Set,X=()=>{if(G)$.cancelAnimationFrame?.(G),G=0;for(let K of Z)$.clearTimeout?.(K);Z.clear()},Y=()=>{G=0,dA({window:$,document:j})},L=()=>{if(G)$.cancelAnimationFrame?.(G);G=$.requestAnimationFrame?.(Y)??0},V=()=>{L();for(let K of[80,220,420]){let B=$.setTimeout?.(()=>{Z.delete(B),L()},K);if(B!=null)Z.add(B)}},q=()=>{if(j.visibilityState&&j.visibilityState!=="visible")return;V()},Q=$.visualViewport;return V(),$.addEventListener("focus",V),$.addEventListener("pageshow",V),$.addEventListener("resize",V),$.addEventListener("orientationchange",V),j.addEventListener("visibilitychange",q),j.addEventListener("focusin",V,!0),Q?.addEventListener?.("resize",V),Q?.addEventListener?.("scroll",V),()=>{X(),$.removeEventListener("focus",V),$.removeEventListener("pageshow",V),$.removeEventListener("resize",V),$.removeEventListener("orientationchange",V),j.removeEventListener("visibilitychange",q),j.removeEventListener("focusin",V,!0),Q?.removeEventListener?.("resize",V),Q?.removeEventListener?.("scroll",V)}}var Kj="resume-layout-settling",iA=220,T2=new WeakMap;function oA(_){if(!_){V_(z8,"");return}V_(z8,JSON.stringify({question:_.question||"",answer:_.answer||"",thinking:_.thinking||"",error:_.error||null,status:_.status||"success"}))}function sA(_={}){if(_.panePopoutMode)return!1;let $=typeof _.search==="string"?_.search:"";return!/(?:^|[?&])pane_popout=1(?:&|$)/.test($)}function aA(_,$={}){if(!_)return()=>{};let{durationMs:j=iA,scheduleTimeout:G=setTimeout,clearScheduledTimeout:Z=clearTimeout}=$,X=T2.get(_);if(X)Z(X);_.classList.add(Kj);let Y=G(()=>{if(T2.get(_)===Y)_.classList.remove(Kj),T2.delete(_)},j);return T2.set(_,Y),()=>{let L=T2.get(_);if(L)Z(L),T2.delete(_);_.classList.remove(Kj)}}function tA(_,$){if(!_?.getElementById)return;let j=encodeURIComponent(String($||"0")),G={"dynamic-manifest":`/manifest.json?v=${j}`,"dynamic-favicon":`/favicon.ico?v=${j}`,"dynamic-apple-touch-icon":`/apple-touch-icon.png?v=${j}`,"dynamic-apple-touch-icon-180":`/apple-touch-icon-180x180.png?v=${j}`,"dynamic-apple-touch-icon-167":`/apple-touch-icon-167x167.png?v=${j}`,"dynamic-apple-touch-icon-152":`/apple-touch-icon-152x152.png?v=${j}`,"dynamic-apple-touch-icon-precomposed":`/apple-touch-icon-precomposed.png?v=${j}`};for(let[Z,X]of Object.entries(G)){let Y=_.getElementById(Z);if(Y&&Y.href!==X)Y.href=X}}function DK(_){let{isRenameBranchFormOpen:$,renameBranchNameInputRef:j,appShellRef:G,setIsWebAppMode:Z,workspaceOpen:X,setWorkspaceOpen:Y,btwSession:L,agents:V,agentsRef:q,currentChatJid:Q,activeChatJidRef:K,userProfile:B,userProfileRef:N,brandingRef:U,panePopoutMode:D=!1}=_;dX(30000),u(()=>{if(!$)return;requestAnimationFrame(()=>{if($)j.current?.focus?.(),j.current?.select?.()})},[$,j]),u(()=>rZ(),[]),u(()=>UK(Z),[Z]),u(()=>{let k=()=>{},z=J8(()=>{G7(),k(),k=aA(G.current)});return()=>{z(),k()}},[G]);let H=g(T5());return u(()=>{FK(X,{bucket:H.current})},[X]),u(()=>{if(typeof window>"u"||!window.matchMedia)return;let k=window.matchMedia(QK),z=()=>{let O=T5(window);if(H.current===O)return;let I=H.current;if(H.current=O,I==="desktop"&&O==="narrow")Y(!1)};if(k.addEventListener)k.addEventListener("change",z);else if(k.addListener)k.addListener(z);return()=>{if(k.removeEventListener)k.removeEventListener("change",z);else if(k.removeListener)k.removeListener(z)}},[Y]),u(()=>HK(),[]),u(()=>{oA(L)},[L]),u(()=>{q.current=V||{}},[V,q]),u(()=>{K.current=Q},[K,Q]),u(()=>{N.current=B||{name:"You",avatar_url:null,avatar_background:null}},[B,N]),{applyBranding:R((k,z,O=null)=>{if(typeof document>"u")return;let I=(k||"").trim()||"PiClaw";if(U.current.title!==I){if(sA({panePopoutMode:D,search:typeof window<"u"?window.location.search:""})){document.title=I;let A=document.querySelector('meta[name="apple-mobile-web-app-title"]');if(A&&A.getAttribute("content")!==I)A.setAttribute("content",I)}U.current.title=I}let x=z?`${z}|${O||""}`:"";if(U.current.avatarBase!==x){U.current.avatarBase=x;let A=O||Date.now();tA(document,A)}},[U])}}M0();function WK(_,$){if(typeof _!=="string")return{kind:"ignore"};let j=_.trim();if(!j)return{kind:"toast",title:"No file selected",detail:"Use a valid file path from a file pill.",level:"warning"};if(!$.editorOpen&&!$.autoOpenEditor)return{kind:"toast",title:"Editor pane is not open",detail:"Open the editor pane to open files from pills.",level:"warning"};if(/^[a-z][a-z0-9+.-]*:/i.test(j))return{kind:"toast",title:"Cannot open external path from file pill",detail:"Use an in-workspace file path.",level:"warning"};try{if(!$.resolvePane({path:j,mode:"edit"}))return{kind:"toast",title:"No editor available",detail:`No editor can open: ${j}`,level:"warning"}}catch{return{kind:"toast",title:"No editor available",detail:`No editor can open: ${j}`,level:"warning"}}return{kind:"open",path:j}}function Qj(_){if(typeof _==="string")return _.trim();if(typeof _==="number")return Number.isFinite(_)?String(_):"";if(typeof _==="bigint")return String(_);return""}function A8(_,$){let j=Array.isArray(_)?_:[],G=Qj($);if(!G)return j;if(j.includes(G))return j;return[...j,G]}function k8(_,$){let j=Array.isArray(_)?_:[],G=Qj($);if(!G)return j;if(!j.includes(G))return j;return j.filter((Z)=>Z!==G)}function y8(_){if(!Array.isArray(_))return[];let $=[],j=new Set;for(let G of _){let Z=Qj(G);if(!Z||j.has(Z))continue;j.add(Z),$.push(Z)}return $}async function OK(_){let{hashtag:$,setCurrentHashtag:j,setPosts:G,loadPosts:Z}=_;j($),G(null),await Z($)}async function zK(_){let{setCurrentHashtag:$,setSearchQuery:j,setPosts:G,loadPosts:Z}=_;$(null),j(null),G(null),await Z()}async function Nj(_){let{query:$,scope:j,currentChatJid:G,currentRootChatJid:Z,searchPosts:X,setSearchScope:Y,setSearchQuery:L,setCurrentHashtag:V,setPosts:q,setHasMore:Q}=_,K=typeof $==="string"?$.trim():"";if(!K)return;let B=j==="root"||j==="all"?j:"current";Y(B),L(K),V(null),q(null);try{let N=await X(K,50,0,G,B,Z,_.filters);q(Array.isArray(N?.results)?N.results:[]),Q(!1)}catch(N){console.error("Failed to search:",N),q([])}}async function JK(_){let{post:$,posts:j,currentChatJid:G,deletePost:Z,preserveTimelineScrollTop:X,setPosts:Y,setRemovingPostIds:L,hasMoreRef:V,loadMoreRef:q,confirm:Q=(E)=>window.confirm(E),showAlert:K=(E)=>alert(E),scheduleTimeout:B=(E,k)=>{setTimeout(E,k)}}=_;if(!$)return;let N=$.id,U=typeof $?.chat_jid==="string"&&$.chat_jid.trim()?$.chat_jid.trim():G,D=j?.filter((E)=>E?.data?.thread_id===N&&E?.id!==N).length||0;if(D>0){if(!Q(`Delete this message and its ${D} replies?`))return}let H=(E)=>{if(!E.length)return;L((k)=>{let z=new Set(k);return E.forEach((O)=>z.add(O)),z}),B(()=>{if(X(()=>{Y((k)=>k?k.filter((z)=>!E.includes(z.id)):k)}),L((k)=>{let z=new Set(k);return E.forEach((O)=>z.delete(O)),z}),V.current)q.current?.({preserveScroll:!0,preserveMode:"top"})},180)};try{let E=await Z(N,D>0,U);if(E?.ids?.length)H(E.ids)}catch(E){let k=E instanceof Error?E.message:String(E||"");if(D===0&&k.includes("Replies exist")){if(!Q("Delete this message and its replies?"))return;let O=await Z(N,!0,U);if(O?.ids?.length)H(O.ids);return}console.error("Failed to delete post:",E),K(`Failed to delete message: ${k}`)}}async function AK(_){let{id:$,targetChatJid:j,currentChatJid:G,getThread:Z,setPosts:X,getElementById:Y=(K)=>document.getElementById(K),scheduleRaf:L=(K)=>requestAnimationFrame(K),scheduleTimeout:V=(K,B)=>{setTimeout(K,B)}}=_,q=(K)=>{K.scrollIntoView({behavior:"smooth",block:"center"}),K.classList.add("post-highlight"),V(()=>K.classList.remove("post-highlight"),2000)},Q=Y(`post-${$}`);if(Q){q(Q);return}try{let K=typeof j==="string"&&j.trim()?j.trim():G,N=(await Z($,K))?.thread?.[0];if(!N)return;X((U)=>{if(!U)return[N];if(U.some((D)=>D.id===N.id))return U;return[...U,N]}),L(()=>{V(()=>{let U=Y(`post-${$}`);if(U)q(U)},50)})}catch(K){console.error("[scrollToMessage] Failed to fetch message",$,K)}}function eA(_){if(typeof _==="string"&&_.trim())return _.trim();return"Could not send your message."}function _k(_){let{id:$,targetChatJid:j=null,currentChatJid:G,currentHashtag:Z=null,searchQuery:X=null,searchOpen:Y=!1,setCurrentHashtag:L,setSearchQuery:V,setSearchOpen:q,setMessageRefs:Q,navigate:K,chatOnlyMode:B,baseHref:N=typeof window<"u"?window.location.href:"http://localhost/"}=_,U=String($??"").trim();if(!U)return!1;let D=typeof j==="string"&&j.trim()?j.trim():G,H=D!==G,E=Boolean(Y||X||Z);if(!H&&!E)return Q((k)=>A8(k,U)),!0;if(Q([U]),L?.(null),V?.(null),q?.(!1),H&&typeof K==="function"){let k=T1(N,D,{chatOnly:B});K(k)}return!0}function kK(_){let{setIntentToast:$,intentToastTimerRef:j,editorOpen:G,openEditor:Z,resolvePane:X,tabStripActiveId:Y,setFileRefs:L,setFolderRefs:V,setMessageRefs:q,currentChatJid:Q,currentHashtag:K,searchQuery:B,searchOpen:N,setCurrentHashtag:U,setSearchQuery:D,setSearchOpen:H,navigate:E,chatOnlyMode:k,baseHref:z,getThread:O,setPosts:I}=_,x=R(()=>{if(j.current)clearTimeout(j.current),j.current=null;$(null)},[j,$]);u(()=>{return()=>{x()}},[x]);let A=R((t)=>{L((V0)=>A8(V0,t))},[L]),y=R((t)=>{L((V0)=>k8(V0,t))},[L]),W=R(()=>{L([])},[L]),M=R((t)=>{L(y8(t))},[L]),T=R((t)=>{V((V0)=>A8(V0,t))},[V]),J=R((t)=>{V((V0)=>k8(V0,t))},[V]),C=R(()=>{V([])},[V]),P=R((t)=>{V(y8(t))},[V]),b=R((t,V0=null,K0="info",k0=3000)=>{x(),$({title:t,detail:V0||null,kind:K0||"info"}),j.current=setTimeout(()=>{$((s)=>s?.title===t?null:s)},k0)},[x,j,$]),m=R((t,{autoOpenEditor:V0=!1}={})=>{let K0=WK(t,{editorOpen:G,autoOpenEditor:V0,resolvePane:X});if(K0.kind==="open"){Z(K0.path);return}if(K0.kind==="toast")b(K0.title,K0.detail,K0.level)},[G,Z,X,b]),h=R((t)=>{m(t,{autoOpenEditor:!1})},[m]),_0=R((t)=>{m(t,{autoOpenEditor:!0})},[m]),v=R(()=>{let t=Y;if(t)A(t)},[A,Y]),e=R((t,V0=null)=>{_k({id:t,targetChatJid:V0,currentChatJid:Q,currentHashtag:K,searchQuery:B,searchOpen:N,setCurrentHashtag:U,setSearchQuery:D,setSearchOpen:H,setMessageRefs:q,navigate:E,chatOnlyMode:k,baseHref:z})},[z,k,Q,K,E,N,B,U,q,H,D]),W0=R(async(t,V0=null)=>{await AK({id:t,targetChatJid:V0,currentChatJid:Q,getThread:O,setPosts:I})},[Q,O,I]),G0=R((t)=>{q((V0)=>k8(V0,t))},[q]),$0=R(()=>{q([])},[q]),L0=R((t)=>{q(y8(t))},[q]),B0=R((t)=>{b("Compose failed",eA(t),"error",5000)},[b]);return{clearIntentToast:x,addFileRef:A,removeFileRef:y,clearFileRefs:W,setFileRefsFromCompose:M,addFolderRef:T,removeFolderRef:J,clearFolderRefs:C,setFolderRefsFromCompose:P,showIntentToast:b,openFileFromPill:h,openTimelineFileFromPill:_0,attachActiveEditorFile:v,addMessageRef:e,scrollToMessage:W0,removeMessageRef:G0,clearMessageRefs:$0,setMessageRefsFromCompose:L0,handleComposeSubmitError:B0}}M0();async function yK(_){let{panelKey:$,expanded:j,currentTurnIdRef:G,thoughtExpandedRef:Z,draftExpandedRef:X,setAgentThoughtVisibility:Y,getAgentThought:L,thoughtBufferRef:V,draftBufferRef:q,setAgentThought:Q,setAgentDraft:K}=_;if($!=="thought"&&$!=="draft")return;let B=G.current;if($==="thought"){if(Z.current=j,B)try{await Y(B,"thought",j)}catch(N){console.warn("Failed to update thought visibility:",N)}if(!j)return;try{let N=B?await L(B,"thought"):null;if(N?.text)V.current=N.text;Q((U)=>({...U||{text:"",totalLines:0},fullText:V.current||U?.fullText||"",totalLines:Number.isFinite(N?.total_lines)?N.total_lines:U?.totalLines||0}))}catch(N){console.warn("Failed to fetch full thought:",N)}return}if(X.current=j,B)try{await Y(B,"draft",j)}catch(N){console.warn("Failed to update draft visibility:",N)}if(!j)return;try{let N=B?await L(B,"draft"):null;if(N?.text)q.current=N.text;K((U)=>({...U||{text:"",totalLines:0},fullText:q.current||U?.fullText||"",totalLines:Number.isFinite(N?.total_lines)?N.total_lines:U?.totalLines||0}))}catch(N){console.warn("Failed to fetch full draft:",N)}}function $k(_){if(!_)return _;if(!(_.last_activity||_.lastActivity))return _;let{last_activity:$,lastActivity:j,...G}=_;return G}function jk(_){if(!_||typeof _!=="object")return{type:"active",last_activity:!0};return{..._,last_activity:!0}}function MK(_){let{lastActivityTtlMs:$,lastActivityTimerRef:j,lastActivityTokenRef:G,lastAgentEventRef:Z,lastSilenceNoticeRef:X,isAgentRunningRef:Y,setIsAgentTurnActive:L,setAgentStatus:V,draftBufferRef:q,thoughtBufferRef:Q,pendingRequestRef:K,lastAgentResponseRef:B,currentTurnIdRef:N,steerQueuedTurnIdRef:U,agentStatusRef:D,silentRecoveryRef:H,thoughtExpandedRef:E,draftExpandedRef:k,setCurrentTurnId:z,setSteerQueuedTurnId:O,currentTurnIdRefForPanel:I,setAgentThoughtVisibility:x,getAgentThought:A,setAgentThought:y,setAgentDraft:W}=_,M=R((m={})=>{let h=Number(m.atMs),_0=Number.isFinite(h)&&h>0?h:Date.now();if(Z.current=_0,m.running)Y.current=!0,L((v)=>v?v:!0);if(m.clearSilence)X.current=0},[Y,Z,X,L]),T=R(()=>{if(j.current)clearTimeout(j.current),j.current=null;G.current=0},[j,G]);u(()=>()=>{T()},[T]);let J=R(()=>{T(),V((m)=>$k(m))},[T,V]),C=R((m)=>{if(!m)return;T();let h=Date.now();G.current=h,V(jk(m)),j.current=setTimeout(()=>{if(G.current!==h)return;V((_0)=>{if(!_0||!(_0.last_activity||_0.lastActivity))return _0;return null})},$)},[T,j,G,$,V]),P=R(()=>{Y.current=!1,L(!1),Z.current=null,X.current=0,q.current="",Q.current="",K.current=null,B.current=null,N.current=null,U.current=null,D.current=null,H.current={inFlight:!1,lastAttemptAt:0,turnId:null},T(),z(null),O(null),E.current=!1,k.current=!1},[D,T,N,q,k,Y,Z,B,X,K,z,L,O,H,U,Q,E]),b=R(async(m,h)=>{await yK({panelKey:m,expanded:h,currentTurnIdRef:I,thoughtExpandedRef:E,draftExpandedRef:k,setAgentThoughtVisibility:x,getAgentThought:A,thoughtBufferRef:Q,draftBufferRef:q,setAgentThought:y,setAgentDraft:W})},[I,q,k,A,W,y,x,Q,E]);return{noteAgentActivity:M,clearLastActivityTimer:T,clearLastActivityFlag:J,showLastActivity:C,clearAgentRunState:P,handlePanelToggle:b}}M0();function M8(_){return _?{..._}:{text:"",totalLines:0}}function wK(_){return Array.isArray(_)?_.map(($)=>({...$})):[]}function Gk(_){return{inFlight:Boolean(_?.inFlight),lastAttemptAt:Number(_?.lastAttemptAt||0),turnId:typeof _?.turnId==="string"?_.turnId:null}}function Zk(){return{agentStatus:null,agentDraft:{text:"",totalLines:0},agentPlan:"",agentThought:{text:"",totalLines:0},pendingRequest:null,currentTurnId:null,steerQueuedTurnId:null,isAgentTurnActive:!1,followupQueueItems:[],activeModel:null,activeThinkingLevel:null,supportsThinking:!1,activeModelUsage:null,contextUsage:null,isAgentRunning:!1,wasAgentActive:!1,draftBuffer:"",thoughtBuffer:"",lastAgentEvent:null,lastSilenceNotice:0,lastAgentResponse:null,currentTurnIdRef:null,steerQueuedTurnIdRef:null,thoughtExpanded:!1,draftExpanded:!1,agentStatusRef:null,silentRecovery:{inFlight:!1,lastAttemptAt:0,turnId:null}}}function TK(_){return{agentStatus:_.agentStatus,agentDraft:M8(_.agentDraft),agentPlan:_.agentPlan||"",agentThought:M8(_.agentThought),pendingRequest:_.pendingRequest,currentTurnId:_.currentTurnId||null,steerQueuedTurnId:_.steerQueuedTurnId||null,isAgentTurnActive:Boolean(_.isAgentTurnActive),followupQueueItems:wK(_.followupQueueItems),activeModel:_.activeModel,activeThinkingLevel:_.activeThinkingLevel,supportsThinking:Boolean(_.supportsThinking),activeModelUsage:_.activeModelUsage,contextUsage:_.contextUsage,isAgentRunning:Boolean(_.isAgentRunning),wasAgentActive:Boolean(_.wasAgentActive),draftBuffer:_.draftBuffer||"",thoughtBuffer:_.thoughtBuffer||"",lastAgentEvent:_.lastAgentEvent||null,lastSilenceNotice:Number(_.lastSilenceNotice||0),lastAgentResponse:_.lastAgentResponse||null,currentTurnIdRef:_.currentTurnIdRef||null,steerQueuedTurnIdRef:_.steerQueuedTurnIdRef||null,thoughtExpanded:Boolean(_.thoughtExpanded),draftExpanded:Boolean(_.draftExpanded),agentStatusRef:_.agentStatusRef||null,silentRecovery:Gk(_.silentRecovery)}}function xK(_){let $=_.snapshot||Zk(),{refs:j,setters:G}=_;return _.clearLastActivityTimer?.(),j.isAgentRunningRef.current=Boolean($.isAgentRunning),j.wasAgentActiveRef.current=Boolean($.wasAgentActive),G.setIsAgentTurnActive(Boolean($.isAgentTurnActive)),j.lastAgentEventRef.current=$.lastAgentEvent||null,j.lastSilenceNoticeRef.current=Number($.lastSilenceNotice||0),j.draftBufferRef.current=$.draftBuffer||"",j.thoughtBufferRef.current=$.thoughtBuffer||"",j.pendingRequestRef.current=$.pendingRequest||null,j.lastAgentResponseRef.current=$.lastAgentResponse||null,j.currentTurnIdRef.current=$.currentTurnIdRef||null,j.steerQueuedTurnIdRef.current=$.steerQueuedTurnIdRef||null,j.agentStatusRef.current=$.agentStatusRef||null,j.silentRecoveryRef.current=$.silentRecovery||{inFlight:!1,lastAttemptAt:0,turnId:null},j.thoughtExpandedRef.current=Boolean($.thoughtExpanded),j.draftExpandedRef.current=Boolean($.draftExpanded),G.setAgentStatus($.agentStatus||null),G.setAgentDraft(M8($.agentDraft)),G.setAgentPlan($.agentPlan||""),G.setAgentThought(M8($.agentThought)),G.setPendingRequest($.pendingRequest||null),G.setCurrentTurnId($.currentTurnId||null),G.setSteerQueuedTurnId($.steerQueuedTurnId||null),G.setFollowupQueueItems(wK($.followupQueueItems)),G.setActiveModel($.activeModel||null),G.setActiveThinkingLevel($.activeThinkingLevel||null),G.setSupportsThinking(Boolean($.supportsThinking)),G.setActiveModelUsage($.activeModelUsage??null),G.setContextUsage($.contextUsage??null),$}function Bj(_){return String(_||"").trim()||"web:default"}function IK({remainingQueueCount:_=0,currentTurnId:$=null,isAgentTurnActive:j=!1}={}){return Number(_||0)<=0&&!$&&!j}function Xk(_){return IK(_)}function Yk(_){let $=String(_?.data?.content||"").trim();if($)return $.replace(/\s+/g," ").slice(0,200);if((Array.isArray(_?.data?.content_blocks)?_.data.content_blocks:[]).length>0)return"Sent an attachment.";return""}function CK(_){let{isAgentTurnActive:$,steerQueuedTurnId:j,currentTurnId:G,steerQueuedTurnIdRef:Z,setSteerQueuedTurnId:X,agentStatus:Y,agentDraft:L,agentPlan:V,agentThought:q,pendingRequest:Q,pendingRequestRef:K,followupQueueItems:B,activeModel:N,activeThinkingLevel:U,supportsThinking:D,activeModelUsage:H,contextUsage:E,isAgentRunningRef:k,wasAgentActiveRef:z,draftBufferRef:O,thoughtBufferRef:I,lastAgentEventRef:x,lastSilenceNoticeRef:A,lastAgentResponseRef:y,currentTurnIdRef:W,thoughtExpandedRef:M,draftExpandedRef:T,agentStatusRef:J,silentRecoveryRef:C,clearLastActivityTimer:P,setIsAgentTurnActive:b,setAgentStatus:m,setAgentDraft:h,setAgentPlan:_0,setAgentThought:v,setPendingRequest:e,setCurrentTurnId:W0,setFollowupQueueItems:G0,setActiveModel:$0,setActiveThinkingLevel:L0,setSupportsThinking:B0,setActiveModelUsage:t,setContextUsage:V0,lastNotifiedIdRef:K0,agentsRef:k0,notify:s,shouldNotifyLocallyForChat:X0}=_,D0=R((m0)=>{if(!Xk({remainingQueueCount:m0,steerQueuedTurnId:Z.current,currentTurnId:W.current,isAgentTurnActive:$}))return;Z.current=null,X(null)},[$,W,X,Z]),C0=R(()=>TK({agentStatus:Y,agentDraft:L,agentPlan:V,agentThought:q,pendingRequest:Q,currentTurnId:G,steerQueuedTurnId:j,isAgentTurnActive:$,followupQueueItems:B,activeModel:N,activeThinkingLevel:U,supportsThinking:D,activeModelUsage:H,contextUsage:E,isAgentRunning:k.current,wasAgentActive:z.current,draftBuffer:O.current,thoughtBuffer:I.current,lastAgentEvent:x.current,lastSilenceNotice:A.current,lastAgentResponse:y.current,currentTurnIdRef:W.current,steerQueuedTurnIdRef:Z.current,thoughtExpanded:M.current,draftExpanded:T.current,agentStatusRef:J.current,silentRecovery:C.current}),[N,H,U,L,V,Y,q,E,G,B,$,Q,j,D,k,z,O,I,x,A,y,W,Z,M,T,J,C]),g0=R((m0)=>{xK({snapshot:m0,clearLastActivityTimer:P,refs:{isAgentRunningRef:k,wasAgentActiveRef:z,lastAgentEventRef:x,lastSilenceNoticeRef:A,draftBufferRef:O,thoughtBufferRef:I,pendingRequestRef:K,lastAgentResponseRef:y,currentTurnIdRef:W,steerQueuedTurnIdRef:Z,agentStatusRef:J,silentRecoveryRef:C,thoughtExpandedRef:M,draftExpandedRef:T},setters:{setIsAgentTurnActive:b,setAgentStatus:m,setAgentDraft:h,setAgentPlan:_0,setAgentThought:v,setPendingRequest:e,setCurrentTurnId:W0,setSteerQueuedTurnId:X,setFollowupQueueItems:G0,setActiveModel:$0,setActiveThinkingLevel:L0,setSupportsThinking:B0,setActiveModelUsage:t,setContextUsage:V0}})},[J,P,W,O,T,k,x,y,A,K,$0,t,L0,h,_0,m,v,V0,W0,G0,b,e,X,B0,C,Z,I,M,z]),p0=R((m0)=>{if(!m0)return;if(W.current===m0)return;W.current=m0,C.current={inFlight:!1,lastAttemptAt:0,turnId:m0},W0(m0),Z.current=null,X(null),O.current="",I.current="",h({text:"",totalLines:0}),_0(""),v({text:"",totalLines:0}),e(null),K.current=null,y.current=null,M.current=!1,T.current=!1},[W,O,T,y,K,h,_0,v,W0,e,X,C,Z,I,M]),j_=R((m0)=>{let d0=y.current;if(!d0||!d0.post)return;if(m0&&d0.turnId&&d0.turnId!==m0)return;let u0=d0.post,o0=typeof u0?.chat_jid==="string"&&u0.chat_jid.trim()?u0.chat_jid.trim():"";if(!o0||!X0(o0))return;if(u0.id&&K0.current===u0.id)return;let v0=Yk(u0);if(!v0)return;K0.current=u0.id||K0.current,y.current=null;let a0=k0.current||{},N_=(u0?.data?.agent_id?a0[u0.data.agent_id]:null)?.name||"Pi";s(N_,v0,{sourceLabel:"Local"})},[k0,y,K0,s,X0]);return{clearQueuedSteerStateIfStale:D0,snapshotCurrentChatPaneState:C0,restoreChatPaneState:g0,setActiveTurn:p0,notifyForFinalResponse:j_}}M0();function w8(_){return _?.turn_id||_?.turnId||null}function x2(_){if(typeof _?.text!=="string"||!_.text)return null;let $=Number.isFinite(_?.totalLines)?Number(_.totalLines):Number.isFinite(_?.total_lines)?Number(_.total_lines):0;return{text:_.text,totalLines:$}}function Fj(_,$){return typeof _?.text==="string"&&_.text.length>=$.length}function Uj(_,$){return Number.isFinite($)?Number($):_?_.replace(/\r\n/g,`
`).split(`
`).length:0}function T8(_,$){return{text:_,totalLines:Uj(_,$)}}function Ej(_,$){return{text:$?.text||"",totalLines:iX(_),fullText:_}}function fK(_,$,j){return j==="replace"?$:`${_||""}${$}`}function PK(_,$){let j=_||"";if($?.reset)j="";if($?.delta)j+=String($.delta);return j}function RK(_,$){let j=_||"";if($?.reset)j="";if(typeof $?.delta==="string")j+=$.delta;return j}function s1(_){return!_?.currentHashtag&&!_?.searchQuery&&!_?.searchOpen}function SK(_,$,j){return Boolean($&&j&&(_==="new_post"||_==="new_reply"||_==="agent_response"))}function Hj(_,$){return _&&$}function uK(_,$){if(!Array.isArray(_)||_.length===0)return[$];if(_.some((j)=>j?.id===$?.id))return _;return[..._,$]}function gK(_,$){if(!Array.isArray(_))return _;if(!_.some((j)=>j?.id===$?.id))return _;return _.map((j)=>j?.id===$?.id?$:j)}function bK(_,$){if(!Array.isArray(_))return _;let j=Array.isArray($)?$:[];if(j.length===0)return _;let G=new Set(j),Z=_.filter((X)=>!G.has(X?.id));return Z.length===_.length?_:Z}async function vK(_){let{currentChatJid:$,getAgentStatus:j,activeChatJidRef:G,wasAgentActiveRef:Z,viewStateRef:X,refreshTimeline:Y,clearAgentRunState:L,agentStatusRef:V,pendingRequestRef:q,thoughtBufferRef:Q,draftBufferRef:K,setAgentStatus:B,setAgentDraft:N,setAgentPlan:U,setAgentThought:D,setPendingRequest:H,setActiveTurn:E,noteAgentActivity:k,clearLastActivityFlag:z,onStateAccessResult:O}=_,I=$;try{let x=await j(I);if(O?.(!1),G.current!==I)return null;if(!x||x.status!=="active"||!x.data){if(Z.current&&s1(X.current))Y();return Z.current=!1,L(),V.current=null,B(null),N({text:"",totalLines:0}),U(""),D({text:"",totalLines:0}),H(null),q.current=null,x??null}Z.current=!0;let A=x.data;V.current=A;let y=w8(A);if(y)E(y);k({running:!0,clearSilence:!0,atMs:r$(A)??Date.now()}),z(),B(A);let W=x2(x.thought);if(W)D((T)=>{if(Fj(T,W.text))return T;return Q.current=W.text,W});let M=x2(x.draft);if(M)N((T)=>{if(Fj(T,M.text))return T;return K.current=M.text,M});return x}catch(x){return O?.(!0),console.warn("Failed to fetch agent status:",x),null}}async function mK(_){let{isAgentRunningRef:$,pendingRequestRef:j,currentTurnIdRef:G,silentRecoveryRef:Z,silenceRefreshMs:X,viewStateRef:Y,refreshTimeline:L,refreshQueueState:V,refreshAgentStatus:q,now:Q=()=>Date.now()}=_;if(!$.current)return null;if(j.current)return null;let K=G.current||null,B=Z.current,N=Q();if(B.inFlight)return null;if(B.turnId===K&&N-B.lastAttemptAt<X)return null;B.inFlight=!0,B.lastAttemptAt=N,B.turnId=K;try{if(s1(Y.current))await L();return await V(),await q()}finally{B.inFlight=!1}}function Lk(_){if(!_||typeof _!=="object")return!1;let $=typeof _.type==="string"?_.type:"";if($==="tool_call"||$==="tool_status"||$==="intent")return!0;return Boolean(_.tool_name||_.tool_args)}function cK(_){let{isAgentRunningRef:$,pendingRequestRef:j,lastAgentEventRef:G,lastSilenceNoticeRef:Z,agentStatusRef:X,silenceWarningMs:Y,silenceFinalizeMs:L,silenceRefreshMs:V,isCompactionStatus:q,setAgentStatus:Q,reconcileSilentTurn:K,now:B=()=>Date.now()}=_;if(!$.current)return;if(j.current)return;let N=G.current;if(!N)return;let U=B(),D=U-N,H=X.current,E=q(H),k=Lk(H);if(D>=L){if(!E&&!k)Q({type:"waiting",title:"Re-syncing after a quiet period…"});K();return}if(D>=Y&&U-Z.current>=V){if(!E&&!k){let z=Math.floor(D/1000);Q({type:"waiting",title:`Waiting for model… No events for ${z}s`})}Z.current=U,K()}}function qk(_){if(!_||typeof _!=="object")return null;let $=typeof _.type==="string"?_.type:"",j=typeof _.title==="string"&&_.title.trim()?_.title.trim():null,G=typeof _.tool_name==="string"&&_.tool_name.trim()?_.tool_name.trim():null,Z=typeof _.status==="string"&&_.status.trim()?_.status.trim():null;if($==="tool_call")return{summary:`Timed out while running ${j||G||"tool"}`,title:j,toolName:G,statusText:Z};if($==="tool_status"){let X=j||G||"tool";return{summary:Z?`Timed out after ${X}: ${Z}`:`Timed out after ${X}`,title:j,toolName:G,statusText:Z}}if(G||j)return{summary:`Timed out after ${j||G||"tool"}`,title:j,toolName:G,statusText:Z};return null}function lK(_){let{isAgentRunningRef:$,lastSilenceNoticeRef:j,lastAgentEventRef:G,currentTurnIdRef:Z,thoughtExpandedRef:X,draftExpandedRef:Y,draftBufferRef:L,thoughtBufferRef:V,pendingRequestRef:q,lastAgentResponseRef:Q,agentStatusRef:K,stalledPostIdRef:B,scrollToBottomRef:N,setCurrentTurnId:U,setAgentDraft:D,setAgentPlan:H,setAgentThought:E,setPendingRequest:k,setAgentStatus:z,setPosts:O,dedupePosts:I,now:x=()=>Date.now(),nowIso:A=()=>new Date().toISOString()}=_;if(!$.current)return;let y=qk(K.current);$.current=!1,j.current=0,G.current=null,K.current=null,Z.current=null,U(null),X.current=!1,Y.current=!1;let W=(L.current||"").trim();if(L.current="",V.current="",H(""),E({text:"",totalLines:0}),k(null),q.current=null,Q.current=null,!W){D({text:"",totalLines:0}),z({type:"error",title:"Response stalled - No content received"});return}D({text:W,totalLines:Uj(W,null),fullText:W});let M=W,T=x(),J=A(),C={id:T,timestamp:J,data:{type:"agent_response",content:M,content_blocks:[{type:"timeout_marker",timed_out:!0,title:"Timed out",tool_action_summary:y?.summary||"",tool_title:y?.title||"",tool_name:y?.toolName||"",tool_status:y?.statusText||"",draft_recovered:!0}],agent_id:"default",is_local_stall:!0}};B.current=T,O((P)=>P?I([...P,C]):[C]),N.current?.(),z(null)}function Vk(_){let{stalledPostIdRef:$,setPosts:j}=_,G=$.current;if(!G)return;j((Z)=>Z?Z.filter((X)=>X.id!==G):Z),$.current=null}function Kk(_){lK(_)}function hK(_){let{viewStateRef:$,currentHashtag:j,searchQuery:G,searchOpen:Z}=_;u(()=>{$.current={currentHashtag:j,searchQuery:G,searchOpen:Z}},[j,Z,G,$])}function nK(_){let{stalledPostIdRef:$,setPosts:j,isAgentRunningRef:G,lastSilenceNoticeRef:Z,lastAgentEventRef:X,currentTurnIdRef:Y,thoughtExpandedRef:L,draftExpandedRef:V,draftBufferRef:q,thoughtBufferRef:Q,pendingRequestRef:K,lastAgentResponseRef:B,agentStatusRef:N,scrollToBottomRef:U,setCurrentTurnId:D,setAgentDraft:H,setAgentPlan:E,setAgentThought:k,setPendingRequest:z,setAgentStatus:O,dedupePosts:I}=_,x=R(()=>{Vk({stalledPostIdRef:$,setPosts:j})},[j,$]),A=R(()=>{Kk({isAgentRunningRef:G,lastSilenceNoticeRef:Z,lastAgentEventRef:X,currentTurnIdRef:Y,thoughtExpandedRef:L,draftExpandedRef:V,draftBufferRef:q,thoughtBufferRef:Q,pendingRequestRef:K,lastAgentResponseRef:B,agentStatusRef:N,stalledPostIdRef:$,scrollToBottomRef:U,setCurrentTurnId:D,setAgentDraft:H,setAgentPlan:E,setAgentThought:k,setPendingRequest:z,setAgentStatus:O,setPosts:j,dedupePosts:I})},[Y,I,q,V,G,X,B,N,Z,K,U,H,E,O,k,D,z,j,$,Q,L]);return{removeStalledPost:x,finalizeStalledResponse:A}}function Qk(_){let{removeFileRefRef:$,composeReferenceActions:j}=_;$.current=j.removeFileRef||null}function Nk(_){return{applyBranding:_.applyBranding,composeReferenceActions:_.composeReferenceActions,..._.agentActivity,..._.chatPaneRuntime,recoveryCallbacks:_.recoveryCallbacks}}function rK(_){let{environment:$,composeReferences:j,agentActivity:G,chatPaneRuntime:Z,recovery:X,viewState:Y,removeFileRefRef:L}=_,{applyBranding:V}=DK($),q=kK(j);Qk({removeFileRefRef:L,composeReferenceActions:q});let Q=MK(G),K=CK({...Z,clearLastActivityTimer:Q.clearLastActivityTimer}),B=nK(X);return hK(Y),Nk({applyBranding:V,composeReferenceActions:q,agentActivity:Q,chatPaneRuntime:K,recoveryCallbacks:B})}M0();M0();I_();var x8=new Map,Dj=new Map;function pK(){return Date.now()}function x5(_){return String(_||"").trim()}function dK(_,$=600000){return Boolean(_&&pK()-_.cachedAt<=$)}function Bk(_){while(_.size>24){let $=_.keys().next().value;if(!$)break;_.delete($)}}function iK(_,$){return x8.delete(_),x8.set(_,$),Bk(x8),$}function I8(_,$){let j=x5(_);if(!j)return null;let G={posts:Array.isArray($?.posts)?$.posts:[],has_more:Boolean($?.has_more),cachedAt:pK()};return iK(j,G)}function Wj(_,$={}){let j=x5(_);if(!j)return null;let G=Number.isFinite($.maxAgeMs)?Number($.maxAgeMs):600000,Z=x8.get(j)||null;if(!dK(Z,G))return null;return iK(j,Z)}function oK(_,$,j=5){if(!Array.isArray(_))return[];let G=x5($),Z=Number.isFinite(j)?Math.max(1,Math.min(8,Number(j))):5,X=new Set,Y=[];for(let L of _){let V=x5(L?.chat_jid);if(!V||V===G||X.has(V))continue;if(X.add(V),Y.push(V),Y.length>=Z)break}return Y}async function sK(_){let $=Array.from(new Set((_.chatJids||[]).map((L)=>x5(L)).filter(Boolean)));if($.length===0)return;let j=Number.isFinite(_.maxAgeMs)?Number(_.maxAgeMs):600000,G=Number.isFinite(_.maxConcurrent)?Math.max(1,Math.min(4,Number(_.maxConcurrent))):2,Z=$.filter((L)=>!dK(Wj(L,{maxAgeMs:j}),j)),X=0,Y=Array.from({length:Math.min(G,Z.length)},async()=>{while(X<Z.length){let L=Z[X++],V=Dj.get(L);if(V){await V;continue}let q=(async()=>{try{let Q=await _.fetchTimeline(L);I8(L,Q)}catch(Q){console.debug("[app-timeline-cache] Ignoring timeline prewarm failure for a best-effort background fetch.",Q,{chatJid:L})}finally{Dj.delete(L)}})();Dj.set(L,q),await q}});await Promise.all(Y)}function aK(_,$){let j=Array.isArray(_)?_:[],G=Array.isArray($)?$:null;if(!G)return j;if(G.length===0)return G;if(j.length===0)return G;let Z=1/0;for(let Y of G){let L=Y?.id;if(typeof L==="number"&&Number.isFinite(L)&&L<Z)Z=L}if(!Number.isFinite(Z))return D2([...G,...j]);let X=j.filter((Y)=>{let L=Y?.id;return typeof L==="number"&&Number.isFinite(L)&&L<Z});return D2([...G,...X])}function tK({preserveTimelineScroll:_,preserveTimelineScrollTop:$,chatJid:j=null,currentHashtag:G=null,searchQuery:Z=null}){let[X,Y]=f(null),[L,V]=f(!1),q=g(!1),Q=g(null),K=g(!1),B=g(null),N=g(null),U=g(0),D=g(0);u(()=>{q.current=L},[L]),u(()=>{N.current=X},[X]);let H=!G&&!Z,E=g(H);u(()=>{E.current=H},[H]),u(()=>{U.current+=1,Y(null),N.current=null,B.current=null,K.current=!1,q.current=!1,V(!1),D.current=0},[j]);let k=R((y,W)=>{if(!H)return;I8(j,{posts:Array.isArray(y)?y:[],has_more:Boolean(W)})},[j,H]),z=R((y,W)=>{N.current=Array.isArray(y)?y:[],q.current=Boolean(W),Y(N.current),V(q.current),k(N.current,q.current)},[k]),O=R(async(y=null)=>{let W=U.current;try{if(y){let C=await q7(y,50,0,j);if(W!==U.current)return;Y(C.posts),V(!1);return}let M=(C)=>{if(W!==U.current)return;let P=Array.isArray(C?.posts)?C.posts:[],b=Boolean(C?.has_more);z(P,b)},T=Wj(j);if(T){z(T.posts,T.has_more);let C=D.current;h$(10,null,j).then((P)=>{if(W!==U.current||D.current!==C)return;if(!E.current)return;let b=Array.isArray(P?.posts)?P.posts:[],m=Boolean(P?.has_more);z(aK(N.current,b),m)}).catch((P)=>{if(W!==U.current)return;console.error("Failed to refresh cached timeline:",P)});return}let J=await h$(10,null,j);M(J)}catch(M){if(W!==U.current)return;throw console.error("Failed to load posts:",M),M}},[j,z]),I=R(async()=>{let y=U.current;try{let W=await h$(10,null,j);if(y!==U.current)return;z(aK(N.current,W?.posts),Boolean(W?.has_more))}catch(W){if(y!==U.current)return;console.error("Failed to refresh timeline:",W)}},[j,z]),x=R(async(y={})=>{let W=U.current,M=N.current;if(!M||M.length===0)return;if(K.current)return;let{preserveScroll:T=!0,preserveMode:J="top",allowRepeat:C=!1}=y,P=(h)=>{if(!T){h();return}if(J==="top")$(h);else _(h)},m=M.slice().sort((h,_0)=>h.id-_0.id)[0]?.id;if(!Number.isFinite(m))return;if(!C&&B.current===m)return;K.current=!0,B.current=m;try{let h=await h$(10,m,j);if(W!==U.current)return;if(D.current+=1,h.posts.length>0)P(()=>{let _0=D2([...h.posts,...N.current||[]]);z(_0,h.has_more)});else z(N.current||[],!1)}catch(h){if(W!==U.current)return;console.error("Failed to load more posts:",h)}finally{if(W===U.current)K.current=!1}},[j,_,$,z]);u(()=>{Q.current=x},[x]);let A=R((y)=>{Y((W)=>{let M=typeof y==="function"?y(W):y;if(N.current=M,Array.isArray(M)){if(D.current+=1,H)I8(j,{posts:M,has_more:q.current})}return M})},[j,H]);return{posts:X,setPosts:A,hasMore:L,setHasMore:V,hasMoreRef:q,loadPosts:O,refreshTimeline:I,loadMore:x,loadMoreRef:Q,loadingMoreRef:K,lastBeforeIdRef:B}}M0();function Fk(_){if(!_?.data?.is_bot_message)return!1;let $=_.data.content;return $==="Queued as a follow-up (one-at-a-time)."||$==="⁣"}function eK(_,$){if(!_||!Array.isArray(_))return _;let j=new Set($||[]),G=_.filter((Z)=>!j.has(Z?.id)&&!Fk(Z));return G.length===_.length?_:G}function _Q(_,$){let j=$||new Set;return Array.isArray(_)?_.map((G)=>({...G})).filter((G)=>!j.has(G.row_id)):[]}function $Q(_,$){if(!Array.isArray(_)||!Array.isArray($))return!1;return _.length===$.length&&_.every((j,G)=>j?.row_id===$[G]?.row_id)}function $4(_,$){let j=Array.isArray(_)&&$!=null?_.filter((G)=>G?.row_id!==$):Array.isArray(_)?[..._]:[];return{items:j,remainingQueueCount:j.length}}function jQ(_,$){let j=Array.isArray(_)?_:[],G=$?.row_id,Z=$?.content;if(G==null||typeof Z!=="string"||!Z.trim())return j;if(j.some((X)=>X?.row_id===G))return j;return[...j,{row_id:G,content:Z,timestamp:$?.timestamp||null,thread_id:$?.thread_id??null}]}function GQ(_){if(!_||typeof _!=="object")return!1;if(_.queued==="followup"||_.queued==="steer")return!0;let $=_.command;return Boolean($&&typeof $==="object"&&($.queued_followup||$.queued_steer))}function Uk(_,$=150){return Math.abs(_)<=$}function ZQ(_){let{timelineRef:$,viewStateRef:j,followupQueueRowIdsRef:G}=_,Z=R(()=>{let V=$.current;if(!V)return;if(Uk(V.scrollTop))V.scrollTop=0},[$]),X=R((V)=>{let q=$.current;if(!q||typeof V!=="function"){V?.();return}let{currentHashtag:Q,searchQuery:K,searchOpen:B}=j.current||{},N=!((K||B)&&!Q),U=N?q.scrollHeight-q.scrollTop:q.scrollTop;V(),requestAnimationFrame(()=>{let D=$.current;if(!D)return;if(N){let H=Math.max(D.scrollHeight-U,0);D.scrollTop=H}else{let H=Math.max(D.scrollHeight-D.clientHeight,0),E=Math.min(U,H);D.scrollTop=E}})},[$,j]),Y=R((V)=>{let q=$.current;if(!q||typeof V!=="function"){V?.();return}let Q=q.scrollTop;V(),requestAnimationFrame(()=>{let K=$.current;if(!K)return;let B=Math.max(K.scrollHeight-K.clientHeight,0);K.scrollTop=Math.min(Q,B)})},[$]),L=R((V)=>{return eK(V,G.current)},[G]);return{scrollToBottom:Z,preserveTimelineScroll:X,preserveTimelineScrollTop:Y,filterQueuedPosts:L}}function Ek(_){let{rawPosts:$,filterQueuedPosts:j}=_;return j($)}function Hk(_){_.scrollToBottomRef.current=_.scrollToBottom}function XQ(_){let{timelineRef:$,viewStateRef:j,followupQueueRowIdsRef:G,currentChatJid:Z,currentHashtag:X,searchQuery:Y,followupQueueItems:L}=_,V=g(null),{scrollToBottom:q,preserveTimelineScroll:Q,preserveTimelineScrollTop:K,filterQueuedPosts:B}=ZQ({timelineRef:$,viewStateRef:j,followupQueueRowIdsRef:G});Hk({scrollToBottomRef:V,scrollToBottom:q});let{posts:N,setPosts:U,hasMore:D,setHasMore:H,hasMoreRef:E,loadPosts:k,refreshTimeline:z,loadMore:O,loadMoreRef:I}=tK({preserveTimelineScroll:Q,preserveTimelineScrollTop:K,chatJid:Z,currentHashtag:X,searchQuery:Y}),x=Y0(()=>Ek({rawPosts:N,followupQueueItems:L,filterQueuedPosts:B}),[B,L,N]);return{scrollToBottomRef:V,scrollToBottom:q,preserveTimelineScroll:Q,preserveTimelineScrollTop:K,rawPosts:N,setPosts:U,hasMore:D,setHasMore:H,hasMoreRef:E,loadPosts:k,refreshTimeline:z,loadMore:O,loadMoreRef:I,posts:x}}M0();function Dk(_){let{currentHashtag:$,searchQuery:j,searchOpen:G}=_;return!$&&!j&&!G}function YQ(_){let{currentHashtag:$,searchQuery:j,searchOpen:G,searchScope:Z,currentChatJid:X,currentRootChatJid:Y,posts:L,loadPosts:V,searchPosts:q,setCurrentHashtag:Q,setSearchQuery:K,setSearchOpen:B,setSearchScope:N,setPosts:U,setHasMore:D,preserveTimelineScrollTop:H,setRemovingPostIds:E,deletePost:k,hasMoreRef:z,loadMoreRef:O}=_,I=R(async(C)=>{await OK({hashtag:C,setCurrentHashtag:Q,setPosts:U,loadPosts:V})},[V,Q,U]),x=R(async()=>{await zK({setCurrentHashtag:Q,setSearchQuery:K,setPosts:U,loadPosts:V})},[V,Q,U,K]),A=R(async(C,P=Z,b)=>{await Nj({query:C,scope:P,currentChatJid:X,currentRootChatJid:Y,searchPosts:q,setSearchScope:N,setSearchQuery:K,setCurrentHashtag:Q,setPosts:U,setHasMore:D,filters:b})},[X,Y,q,Z,Q,D,U,K,N]),y=R((C)=>{if(N(C),j&&j.trim())Nj({query:j,scope:C,currentChatJid:X,currentRootChatJid:Y,searchPosts:q,setSearchScope:N,setSearchQuery:K,setCurrentHashtag:Q,setPosts:U,setHasMore:D})},[X,Y,q,j,Q,D,U,K,N]),W=R(()=>{B(!0),K(null),Q(null),N("current"),U([])},[Q,U,B,K,N]),M=R(()=>{B(!1),K(null),V()},[V,B,K]),T=Y0(()=>Dk({currentHashtag:$,searchQuery:j,searchOpen:G}),[$,G,j]),J=R(async(C)=>{await JK({post:C,posts:L,currentChatJid:X,deletePost:k,preserveTimelineScrollTop:H,setPosts:U,setRemovingPostIds:E,hasMoreRef:z,loadMoreRef:O})},[X,k,z,O,L,H,U,E]);return{handleHashtagClick:I,handleBackToTimeline:x,handleSearch:A,handleSearchScopeChange:y,enterSearchMode:W,exitSearchMode:M,isMainTimelineView:T,handleDeletePost:J}}M0();function Oj(_){if(!Array.isArray(_?.content))return null;return _.content.find((j)=>j?.type==="status_panel"&&j?.panel)?.panel||null}function LQ(_,$){let j=new Map(_),G=Oj($);if(typeof $?.key==="string"&&$.key&&G)j.set($.key,G);else j.delete("autoresearch");return j}function qQ(_,$){let j=typeof $?.key==="string"?$.key:"";if(!j)return _;let G=new Map(_),Z=Oj($);if($?.options?.remove||!Z)G.delete(j);else G.set(j,Z);return G}function VQ(_){if(_?.options?.remove)return!0;return Oj(_)?.state!=="running"}function zj(_,$){return`${_}:${$}`}function KQ(_,$,j){let G=zj($,j);if(_.has(G))return _;let Z=new Set(_);return Z.add(G),Z}function QQ(_,$){if(!_.has($))return _;let j=new Set(_);return j.delete($),j}function C8(_,$){if(_.size===0)return _;let j=`${$}:`,G=new Set(Array.from(_).filter((Z)=>!String(Z).startsWith(j)));return G.size===_.size?_:G}async function NQ(_){let $=typeof _.action?.action_type==="string"?_.action.action_type:"",j=typeof _.action?.key==="string"?_.action.key:"";if($==="autoresearch.stop")return await _.stopAutoresearch(_.currentChatJid,{generateReport:!0}),{refreshAutoresearchStatus:!0};if($==="autoresearch.dismiss")return await _.dismissAutoresearch(_.currentChatJid),{refreshAutoresearchStatus:!0};if($==="autoresearch.copy_tmux"){let G=typeof _.panel?.tmux_command==="string"?_.panel.tmux_command.trim():"";if(!G)throw Error("No tmux command available.");return await _.writeClipboard(G),{refreshAutoresearchStatus:!1,toast:{title:"Copied",detail:"tmux command copied to clipboard.",kind:"success"}}}throw Error(`Unsupported panel action: ${$||j}`)}var BQ="piclaw:ctx:";function j4(_){if(!_||typeof _!=="object")return null;let $=_,j=$.tokens==null?null:Number($.tokens),G=$.contextWindow==null?null:Number($.contextWindow),Z=$.percent==null?null:Number($.percent);return{tokens:Number.isFinite(j)?j:null,contextWindow:Number.isFinite(G)?G:null,percent:Number.isFinite(Z)?Z:null}}function u4(_,$){let j=j4(_),G=j4($);if(!j&&!G)return!0;if(!j||!G)return!1;return j.tokens===G.tokens&&j.contextWindow===G.contextWindow&&j.percent===G.percent}function I2(_,$){if(!_||!$||typeof $!=="object")return;if($.percent==null)return;try{V_(BQ+_,JSON.stringify($))}catch(G){console.debug("[app-status-refresh] Ignoring best-effort context usage persistence failure.",G,{chatJid:_})}}function FQ(_){if(!_)return null;return U6(BQ+_)}async function UQ(_){let{currentChatJid:$,queueRefreshGenRef:j,activeChatJidRef:G,dismissedQueueRowIdsRef:Z,getAgentQueueState:X,setFollowupQueueItems:Y,clearQueuedSteerStateIfStale:L}=_,V=++j.current,q=$;try{let Q=await X(q);if(V!==j.current)return;if(G.current!==q)return;let K=Z.current,B=Array.isArray(Q?.items)?Q.items:[],N=_Q(B,K);if(N.length){Y((U)=>$Q(U,N)?U:N);return}if(B.length>0)return;K.clear(),L(0),Y((U)=>U.length===0?U:[])}catch{if(V!==j.current)return;if(G.current!==q)return;Y((Q)=>Q.length===0?Q:[])}}async function EQ(_){let{currentChatJid:$,activeChatJidRef:j,getAgentContext:G,setContextUsage:Z}=_,X=$;try{let Y=j4(await G(X));if(j.current!==X)return;if(Y&&Y.percent!=null)Z((L)=>u4(L,Y)?L:Y),I2(X,Y)}catch(Y){if(j.current!==X)return;console.warn("Failed to fetch agent context:",Y)}}async function HQ(_){let{currentChatJid:$,activeChatJidRef:j,getAutoresearchStatus:G,setExtensionStatusPanels:Z,setPendingExtensionPanelActions:X}=_,Y=$;try{let L=await G(Y);if(j.current!==Y)return;Z((V)=>LQ(V,L)),X((V)=>C8(V,"autoresearch"))}catch(L){if(j.current!==Y)return;console.warn("Failed to fetch autoresearch status:",L)}}function DQ(_){let{refreshModelState:$,refreshActiveChatAgents:j,refreshCurrentChatBranches:G,refreshQueueState:Z,refreshContextUsage:X,refreshAutoresearchStatus:Y}=_;$(),j(),G(),Z(),X(),Y()}function WQ(_){let{viewStateRef:$,refreshTimeline:j,refreshModelAndQueueState:G}=_;if(s1($.current))j();G()}Y5();var f8=new Map,P8=new Map,Wk=250,OQ=1500,zQ=300000;function C2(){if(typeof performance<"u"&&typeof performance.now==="function")return performance.now();return Date.now()}function Ok(_,$){return`${_}:${$}`}function zk(_){for(let[$,j]of P8.entries())if(_-j>zQ)P8.delete($)}function Jk(_){for(let[$,j]of f8.entries()){if(j.inFlight)continue;if(!Number.isFinite(j.lastCompletedAt)||_-j.lastCompletedAt>zQ)f8.delete($)}}function JQ(_=C2()){zk(_),Jk(_)}function AQ(_){let{chatJid:$,nowMs:j=C2()}=_;if(!$)return;P8.set($,j),JQ(j)}function I5(_,$=OQ,j=C2()){if(!_)return!1;let G=P8.get(_);if(!Number.isFinite(G))return!1;return j-Number(G)<=$}async function J$(_){let{kind:$,chatJid:j,run:G,cooldownMs:Z=Wk,activationWindowMs:X=OQ,nowMs:Y=C2()}=_;JQ(Y);let L=Ok($,j),V=f8.get(L)||{inFlight:null,lastCompletedAt:Number.NaN,lastValue:null};if(f8.set(L,V),V.inFlight)return await V.inFlight;if(Boolean(A6("thread-switch",j)||I5(j,X,Y))&&Number.isFinite(V.lastCompletedAt)&&Y-V.lastCompletedAt<=Z)return V.lastValue;let Q=Promise.resolve().then(G).then((K)=>{return V.lastCompletedAt=C2(),V.lastValue=K??null,V.inFlight=null,K}).catch((K)=>{throw V.lastCompletedAt=C2(),V.inFlight=null,K});return V.inFlight=Q,await Q}function kQ(_){let{serverVersion:$,currentAppAssetVersion:j,staleUiVersionRef:G,staleUiReloadScheduledRef:Z,tabStoreHasUnsaved:X,isAgentRunningRef:Y,pendingRequestRef:L,showIntentToast:V}=_,q=typeof $==="string"&&$.trim()?$.trim():null;if(!q||!j||q===j)return!1;if(G.current===q)return!0;G.current=q;let Q=typeof document<"u"?String(document.querySelector(".compose-box textarea")?.value||"").trim():"";if(!X()&&!Q&&!Y.current&&!L.current&&!Z.current);return V("New UI available","Reload this page to apply the latest interface update.","warning",8000),!0}function Jj(_){let{currentHashtag:$,searchQuery:j,searchOpen:G}=_||{};return!$&&!j&&!G}function yQ(_){let{currentChatJid:$,status:j,setConnectionStatus:G,setAgentStatus:Z,setAgentDraft:X,setAgentPlan:Y,setAgentThought:L,setPendingRequest:V,pendingRequestRef:q,clearAgentRunState:Q,hasConnectedOnceRef:K,viewStateRef:B,refreshTimeline:N,refreshAgentStatus:U,refreshQueueState:D,refreshContextUsage:H}=_;if(G(j),j!=="connected"){Z(null),X({text:"",totalLines:0}),Y(""),L({text:"",totalLines:0}),V(null),q.current=null,Q();return}if(!K.current){if(K.current=!0,Z(null),X({text:"",totalLines:0}),Y(""),L({text:"",totalLines:0}),V(null),q.current=null,Q(),I5($))return;if(Jj(B.current))N();U(),D(),H();return}if(Jj(B.current))N();U(),D(),H()}function MQ(_){let{viewStateRef:$,isAgentActive:j,refreshTimeline:G,refreshQueueState:Z,refreshAgentStatus:X,refreshContextUsage:Y,refreshAutoresearchStatus:L}=_,V=Jj($.current);if(j){if(V)G();Z(),X(),Y(),L();return}if(V)G();X(),Y(),L()}function Ak(_){return Math.min(1000,Math.max(100,Math.floor(_/2)))}function wQ(_){let{currentChatJid:$,activeChatJidRef:j,queueRefreshGenRef:G,dismissedQueueRowIdsRef:Z,getAgentQueueState:X,setFollowupQueueItems:Y,clearQueuedSteerStateIfStale:L,getAgentContext:V,setContextUsage:q,getAutoresearchStatus:Q,setExtensionStatusPanels:K,setPendingExtensionPanelActions:B,getAgentStatus:N,wasAgentActiveRef:U,viewStateRef:D,refreshTimeline:H,clearAgentRunState:E,agentStatusRef:k,pendingRequestRef:z,thoughtBufferRef:O,draftBufferRef:I,setAgentStatus:x,setAgentDraft:A,setAgentPlan:y,setAgentThought:W,setPendingRequest:M,setActiveTurn:T,noteAgentActivity:J,clearLastActivityFlag:C,isAgentRunningRef:P,currentTurnIdRef:b,silentRecoveryRef:m,silenceRefreshMs:h,lastAgentEventRef:_0,lastSilenceNoticeRef:v,silenceWarningMs:e,silenceFinalizeMs:W0,isCompactionStatus:G0,serverVersionContext:$0,setConnectionStatus:L0,setStateAccessFailed:B0,setPendingRequestForConnection:t,hasConnectedOnceRef:V0}=_,K0=R(()=>{return J$({kind:"queue-state",chatJid:$,run:async()=>{return await UQ({currentChatJid:$,queueRefreshGenRef:G,activeChatJidRef:j,dismissedQueueRowIdsRef:Z,getAgentQueueState:X,setFollowupQueueItems:Y,clearQueuedSteerStateIfStale:L}),null}})},[j,L,$,Z,X,G,Y]),k0=R(async()=>{await J$({kind:"context-usage",chatJid:$,run:async()=>{return await EQ({currentChatJid:$,activeChatJidRef:j,getAgentContext:V,setContextUsage:q}),null}})},[j,$,V,q]),s=R(async()=>{await J$({kind:"autoresearch-status",chatJid:$,run:async()=>{return await HQ({currentChatJid:$,activeChatJidRef:j,getAutoresearchStatus:Q,setExtensionStatusPanels:K,setPendingExtensionPanelActions:B}),null}})},[j,$,Q,K,B]),X0=R(async()=>{return await J$({kind:"agent-status",chatJid:$,run:async()=>{return await vK({currentChatJid:$,getAgentStatus:N,activeChatJidRef:j,wasAgentActiveRef:U,viewStateRef:D,refreshTimeline:H,clearAgentRunState:E,agentStatusRef:k,pendingRequestRef:z,thoughtBufferRef:O,draftBufferRef:I,setAgentStatus:x,setAgentDraft:A,setAgentPlan:y,setAgentThought:W,setPendingRequest:M,setActiveTurn:T,noteAgentActivity:J,clearLastActivityFlag:C,onStateAccessResult:B0})}})},[j,k,E,C,$,I,N,J,z,H,T,A,y,x,W,M,B0,O,D,U]),D0=R(async()=>{return await mK({isAgentRunningRef:P,pendingRequestRef:z,currentTurnIdRef:b,silentRecoveryRef:m,silenceRefreshMs:h,viewStateRef:D,refreshTimeline:H,refreshQueueState:K0,refreshAgentStatus:X0})},[b,P,z,X0,K0,H,h,m,D]);u(()=>{let p0=Ak(e),j_=setInterval(()=>{cK({isAgentRunningRef:P,pendingRequestRef:z,lastAgentEventRef:_0,lastSilenceNoticeRef:v,agentStatusRef:k,silenceWarningMs:e,silenceFinalizeMs:W0,silenceRefreshMs:h,isCompactionStatus:G0,setAgentStatus:x,reconcileSilentTurn:D0})},p0);return()=>clearInterval(j_)},[k,P,G0,_0,v,z,D0,x,W0,h,e]);let C0=R((p0)=>{return kQ({serverVersion:p0,...$0})},[$0]),g0=R((p0)=>{if(p0==="connected")B0(!1);yQ({currentChatJid:$,status:p0,setConnectionStatus:L0,setAgentStatus:x,setAgentDraft:A,setAgentPlan:y,setAgentThought:W,setPendingRequest:t,pendingRequestRef:z,clearAgentRunState:E,hasConnectedOnceRef:V0,viewStateRef:D,refreshTimeline:H,refreshAgentStatus:X0,refreshQueueState:K0,refreshContextUsage:k0})},[E,$,V0,z,X0,k0,K0,H,A,y,x,W,L0,t,B0,D]);return{refreshQueueState:K0,refreshContextUsage:k0,refreshAutoresearchStatus:s,refreshAgentStatus:X0,handleUiVersionDrift:C0,handleConnectionStatusChange:g0}}M0();function C5(_){return typeof _==="string"}function f5(_){return typeof _==="string"&&_.trim().length>0}function R8(_){if(!f5(_))return 0;let $=Date.parse(_);return Number.isFinite($)?$:0}function Aj(_){if(!Array.isArray(_))return[];return _.filter(($)=>f5($?.chat_jid)&&f5($?.agent_name))}function TQ(_){if(!Array.isArray(_))return[];return _.filter(($)=>C5($?.chat_jid)&&C5($?.agent_name))}function xQ(_,$,j){if(!Array.isArray($)||$.length===0)return Array.isArray(_)?_:[];let G=new Map;if(Array.isArray(_)){for(let Y of _)if(C5(Y?.chat_jid))G.set(Y.chat_jid,Y)}let Z=$.map((Y)=>{if(!C5(Y?.chat_jid))return Y;let L=G.get(Y.chat_jid);return L?{...Y,...L,is_active:L.is_active??Y.is_active}:Y}),X=C5(j)?j:"";return Z.sort((Y,L)=>{if(Y.chat_jid===X&&L.chat_jid!==X)return-1;if(L.chat_jid===X&&Y.chat_jid!==X)return 1;let V=Boolean(Y.archived_at),q=Boolean(L.archived_at);if(V!==q)return V?1:-1;if(Boolean(Y.is_active)!==Boolean(L.is_active))return Y.is_active?-1:1;let Q=R8(Y.updated_at)||R8(Y.created_at),K=R8(L.updated_at)||R8(L.created_at);if(Q!==K)return K-Q;let B=f5(Y.agent_name)?Y.agent_name.trim():"",N=f5(L.agent_name)?L.agent_name.trim():"",U=B.localeCompare(N,void 0,{sensitivity:"base"});if(U!==0)return U;return String(Y.chat_jid).localeCompare(String(L.chat_jid))}),Z}var kk={hasModel:!1,model:void 0,hasThinkingLevel:!1,thinkingLevel:null,thinkingLevelLabel:null,hasSupportsThinking:!1,supportsThinking:!1,hasProviderUsage:!1,providerUsage:null};function IQ(_){if(!_||typeof _!=="object")return kk;let $=_.model??_.current;return{hasModel:$!==void 0,model:$,hasThinkingLevel:_.thinking_level!==void 0,thinkingLevel:_.thinking_level??null,thinkingLevelLabel:_.thinking_level_label??_.thinking_level??null,hasSupportsThinking:_.supports_thinking!==void 0,supportsThinking:Boolean(_.supports_thinking),hasProviderUsage:_.provider_usage!==void 0,providerUsage:_.provider_usage??null}}function CQ(_){let j=(Array.isArray(_)?_:[]).find((G)=>G?.id==="default");return{name:j?.name,avatarUrl:j?.avatar_url}}function fQ(_,$){if(!_||typeof _!=="object")return null;let j=_.agent_id;if(!j)return null;let G=String(j),Z=_.agent_name,X=_.agent_avatar;if(!Z&&X===void 0)return null;let Y=$||{id:G},L=Y.name||null,V=Y.avatar_url??Y.avatarUrl??Y.avatar??null,q=!1,Q=!1;if(Z&&Z!==Y.name)L=Z,q=!0;if(X!==void 0){let K=typeof X==="string"?X.trim():null,B=typeof V==="string"?V.trim():null,N=K||null;if(N!==(B||null))V=N,Q=!0}if(!q&&!Q)return null;return{agentId:G,nameChanged:q,avatarChanged:Q,resolvedName:L,resolvedAvatar:V}}function PQ(_,$){let j=typeof $?.name==="string"&&$.name.trim()?$.name.trim():"You",G=typeof $?.avatar_url==="string"?$.avatar_url.trim():null,Z=typeof $?.avatar_background==="string"&&$.avatar_background.trim()?$.avatar_background.trim():null;if(_.name===j&&_.avatar_url===G&&_.avatar_background===Z)return _;return{name:j,avatar_url:G,avatar_background:Z}}function RQ(_,$){if(!$||typeof $!=="object")return _;let j=$.user_name??$.userName,G=$.user_avatar??$.userAvatar,Z=$.user_avatar_background??$.userAvatarBackground;if(j===void 0&&G===void 0&&Z===void 0)return _;let X=typeof j==="string"&&j.trim()?j.trim():_.name||"You",Y=G===void 0?_.avatar_url:typeof G==="string"&&G.trim()?G.trim():null,L=Z===void 0?_.avatar_background:typeof Z==="string"&&Z.trim()?Z.trim():null;if(_.name===X&&_.avatar_url===Y&&_.avatar_background===L)return _;return{name:X,avatar_url:Y,avatar_background:L}}async function uQ(_){let{getAgents:$,setAgents:j,setUserProfile:G,applyBranding:Z}=_;try{let X=await $();j(pX(X));let Y=X?.user||{};G((V)=>PQ(V,Y));let L=CQ(X?.agents);Z(L.name,L.avatarUrl)}catch(X){console.warn("Failed to load agents:",X)}}function gQ(_){let{payload:$,agentsRef:j,setAgents:G,applyBranding:Z}=_,X=fQ($,$?.agent_id?j.current?.[String($.agent_id)]||{id:String($.agent_id)}:null);if(!X)return;if(G((Y)=>{let V={...Y[X.agentId]||{id:X.agentId}};if(X.nameChanged)V.name=X.resolvedName;if(X.avatarChanged)V.avatar_url=X.resolvedAvatar;return{...Y,[X.agentId]:V}}),X.agentId==="default")Z(X.resolvedName,X.resolvedAvatar,X.avatarChanged?Date.now():null)}function bQ(_){let{payload:$,setUserProfile:j}=_;j((G)=>RQ(G,$))}function SQ(_,$){if(Object.is(_,$))return!0;try{return JSON.stringify(_)===JSON.stringify($)}catch{return!1}}function vQ(_){let{payload:$,setActiveModel:j,setActiveThinkingLevel:G,setSupportsThinking:Z,setActiveModelUsage:X,setAgentModelsPayload:Y,setHasLoadedAgentModels:L}=_;if($&&typeof $==="object")Y?.((q)=>SQ(q,$)?q:$),L?.(!0);let V=IQ($);if(V.hasModel)j((q)=>Object.is(q,V.model)?q:V.model);if(V.hasThinkingLevel){let q=V.thinkingLevelLabel??V.thinkingLevel;G((Q)=>Object.is(Q,q)?Q:q)}if(V.hasSupportsThinking)Z((q)=>q===V.supportsThinking?q:V.supportsThinking);if(V.hasProviderUsage)X((q)=>SQ(q,V.providerUsage)?q:V.providerUsage)}async function mQ(_){let{currentChatJid:$,getActiveChatAgents:j,getChatBranches:G,activeChatJidRef:Z,setActiveChatAgents:X}=_,Y=$;try{let[L,V]=await Promise.all([j().catch(()=>({chats:[]})),G(null,{includeArchived:!0}).catch(()=>({chats:[]}))]);if(Z.current!==Y)return[];let q=Aj(L?.chats),Q=Aj(V?.chats),K=xQ(q,Q,Y);return X(K),K}catch{if(Z.current!==Y)return[];return X([]),[]}}async function cQ(_){let{currentRootChatJid:$,getChatBranches:j,setCurrentChatBranches:G}=_;try{let Z=await j($);G(TQ(Z?.chats))}catch{G([])}}function lQ(_){let{response:$,refreshActiveChatAgents:j,refreshCurrentChatBranches:G,refreshContextUsage:Z,refreshAutoresearchStatus:X,refreshQueueState:Y}=_;if(!$||typeof $!=="object")return;if(j(),G(),Z(),X(),GQ($))Y()}function hQ(_){let{readStoredNumber:$,sidebarWidthRef:j,shellElement:G,minWidth:Z=160,maxWidth:X=600,fallbackWidth:Y=280}=_,L=$("sidebarWidth",null),V=Number.isFinite(L)?Math.min(Math.max(Number(L),Z),X):Y;if(j.current=V,G)G.style.setProperty("--sidebar-width",`${V}px`);return V}async function nQ(_){let{currentHashtag:$,searchQuery:j,searchScope:G,currentChatJid:Z,currentRootChatJid:X,loadPosts:Y,searchPosts:L,setPosts:V,setHasMore:q,scrollToBottom:Q,isCancelled:K,scheduleRaf:B=(O)=>{if(typeof requestAnimationFrame==="function"){requestAnimationFrame(O);return}setTimeout(O,0)},scheduleTimeout:N=(O,I)=>{setTimeout(O,I)},onTimelineLoadStart:U,onTimelineDataReady:D,onTimelineFirstPaint:H,onTimelineError:E}=_,k=(O)=>{if(K())return;B(()=>{if(K())return;B(()=>{if(K())return;H?.(O)})})},z=()=>{if(K())return;B(()=>{if(K())return;N(()=>{if(K())return;Q()},0)})};if($){U?.({mode:"hashtag",hashtag:$});try{if(await Y($),K())return;D?.({mode:"hashtag",hashtag:$}),k({mode:"hashtag"})}catch(O){if(K())return;throw E?.(O,{mode:"hashtag",hashtag:$}),O}return}if(j){U?.({mode:"search",searchQuery:j,searchScope:G});try{let O=await L(j,50,0,Z,G,X);if(K())return;V(Array.isArray(O?.results)?O.results:[]),q(!1),D?.({mode:"search",resultCount:Array.isArray(O?.results)?O.results.length:0}),k({mode:"search"})}catch(O){if(K())return;E?.(O,{mode:"search",searchQuery:j,searchScope:G}),console.error("Failed to search:",O),V([]),q(!1)}return}U?.({mode:"timeline"});try{if(await Y(),K())return;D?.({mode:"timeline"}),k({mode:"timeline"}),z()}catch(O){if(K())return;E?.(O,{mode:"timeline"}),console.error("Failed to load timeline:",O)}}Y5();I_();function yk(_){let{refreshModelAndQueueState:$,refreshModelState:j,refreshActiveChatAgents:G,refreshCurrentChatBranches:Z,refreshQueueState:X,runImmediately:Y=!0,intervalMs:L=60000,scheduleInterval:V=(K,B)=>setInterval(K,B),clearScheduledInterval:q=(K)=>clearInterval(K)}=_;if(Y)$();let Q=V(()=>{j(),G(),Z(),X()},L);return()=>{q(Q)}}function Mk(_){let{refreshModelState:$,refreshActiveChatAgents:j,refreshCurrentChatBranches:G,refreshQueueState:Z,refreshContextUsage:X,refreshAutoresearchStatus:Y,prewarmLimit:L=5}=_;$(),j({prewarmRecent:!0,prewarmLimit:L}),G(),Z(),X(),Y()}function wk(_){let $=oK(_.chats,_.currentChatJid,_.prewarmLimit??5);if($.length===0)return;sK({chatJids:$,fetchTimeline:_.fetchTimeline??((j)=>h$(10,null,j))})}function rQ(_){let{getAgents:$,setAgents:j,setUserProfile:G,applyBranding:Z,readStoredNumber:X,sidebarWidthRef:Y,appShellRef:L,currentChatJid:V,currentRootChatJid:q,getAgentModels:Q,getAgentContext:K,getActiveChatAgents:B,getChatBranches:N,activeChatJidRef:U,setActiveChatAgents:D,setCurrentChatBranches:H,setActiveModel:E,setActiveThinkingLevel:k,setSupportsThinking:z,setActiveModelUsage:O,setAgentModelsPayload:I,setHasLoadedAgentModels:x,agentsRef:A,refreshQueueState:y,refreshContextUsage:W,refreshAutoresearchStatus:M,setContextUsage:T,setExtensionWorkingState:J}=_,C=R(async()=>{await uQ({getAgents:$,setAgents:j,setUserProfile:G,applyBranding:Z})},[Z,$,j,G]);u(()=>{C(),hQ({readStoredNumber:X,sidebarWidthRef:Y,shellElement:L.current,maxWidth:U5(Number.POSITIVE_INFINITY)})},[L,C,X,Y]);let P=R(($0)=>{vQ({payload:$0,setActiveModel:E,setActiveThinkingLevel:k,setSupportsThinking:z,setActiveModelUsage:O,setAgentModelsPayload:I,setHasLoadedAgentModels:x})},[E,O,k,I,x,z]),b=R(()=>A6("thread-switch",V),[V]),m=R(()=>{return J$({kind:"model-state",chatJid:V,run:async()=>{let $0=b();if($0)X1($0,"runtime-hydration-start",{phase:"model-state"});let L0=V;try{let[t,V0]=await Promise.all([(async()=>{let k0=$0||b();if(k0)X1(k0,"model-request-start",{chatJid:L0});let s=await Q(L0);if(k0)X1(k0,"model-request-ready",{chatJid:L0,hasCurrent:Boolean(s?.current),modelCount:Array.isArray(s?.models)?s.models.length:0});return s})(),K(L0).catch(()=>null)]);if(U.current&&U.current!==L0)return null;P(t);let K0=j4(V0);if(K0&&K0.percent!=null)T((k0)=>u4(k0,K0)?k0:K0),I2(L0,K0)}catch{if(U.current&&U.current!==L0)return null;P(null)}let B0=$0||b();if(B0)X1(B0,"runtime-hydration-ready",{chatJid:V}),k6(B0,["runtime-hydration-ready","timeline-first-paint"],"settled",{chatJid:V});return null}})},[U,P,V,K,Q,b,T]);u(()=>{AQ({chatJid:V}),E(null),k(null),z(!1),O(null),x(!1),I(null),J({message:null,indicator:null,visible:!0});let $0=FQ(V);if($0)T($0);else T(null);m()},[V,m,E,O,k,I,T,J,x,z]);let h=R(($0)=>{gQ({payload:$0,agentsRef:A,setAgents:j,applyBranding:Z})},[A,Z,j]),_0=R(($0)=>{bQ({payload:$0,setUserProfile:G})},[G]),v=R(($0)=>{let L0=Boolean($0?.prewarmRecent),B0=Number.isFinite($0?.prewarmLimit)?Number($0?.prewarmLimit):5;return J$({kind:"active-chat-agents",chatJid:V,run:async()=>{let t=b(),V0=await mQ({currentChatJid:V,getActiveChatAgents:async()=>{if(t)X1(t,"active-chat-list-request-start",{chatJid:V});let K0=await B(V);if(t)X1(t,"active-chat-list-request-ready",{rowCount:Array.isArray(K0?.chats)?K0.chats.length:0});return K0},getChatBranches:async(K0,k0)=>{if(t)X1(t,"branch-list-request-start",{rootChatJid:K0});let s=await N(K0,k0);if(t)X1(t,"branch-list-request-ready",{rootChatJid:K0,rowCount:Array.isArray(s?.chats)?s.chats.length:0});return s},activeChatJidRef:U,setActiveChatAgents:D});if(L0)wk({chats:V0,currentChatJid:V,prewarmLimit:B0});return null}})},[U,V,B,N,b,D]),e=R(()=>{return J$({kind:"current-chat-branches",chatJid:V,run:async()=>{let $0=b();return await cQ({currentRootChatJid:q,getChatBranches:async(L0,B0)=>{if($0)X1($0,"root-branch-request-start",{rootChatJid:L0});let t=await N(L0,B0);if($0)X1($0,"root-branch-request-ready",{rootChatJid:L0,rowCount:Array.isArray(t?.chats)?t.chats.length:0});return t},setCurrentChatBranches:H}),null}})},[V,q,N,b,H]),W0=R(()=>{DQ({refreshModelState:m,refreshActiveChatAgents:v,refreshCurrentChatBranches:e,refreshQueueState:y,refreshContextUsage:W,refreshAutoresearchStatus:M})},[v,M,W,e,m,y]),G0=R(()=>{Mk({refreshModelState:m,refreshActiveChatAgents:v,refreshCurrentChatBranches:e,refreshQueueState:y,refreshContextUsage:W,refreshAutoresearchStatus:M,prewarmLimit:5})},[v,M,W,e,m,y]);return u(()=>yk({refreshModelAndQueueState:W0,refreshModelState:m,refreshActiveChatAgents:v,refreshCurrentChatBranches:e,refreshQueueState:y,runImmediately:!1}),[v,e,W0,m,y]),u(()=>{let $0=setInterval(()=>{m()},5000);return()=>clearInterval($0)},[m]),{updateAgentProfile:h,updateUserProfile:_0,applyModelState:P,refreshModelState:m,refreshActiveChatAgents:v,refreshCurrentChatBranches:e,refreshModelAndQueueState:W0,refreshPostPaintThreadState:G0}}M0();function Tk(_,$){let j=B1(_);return Boolean(_&&j===$)}function f2(_,$,j){if(!Tk(_,$))return _;return{..._,runtimeState:{..._?.runtimeState&&typeof _.runtimeState==="object"?_.runtimeState:{},...j}}}function pQ(_,$){return{..._,openedAt:$}}function dQ(_){let $=B1(_);return{nextWidget:null,dismissedSessionKey:_?.source==="live"&&$?$:null}}function iQ(_,$,j){let G=rL({...$,...$&&$.status?{}:{status:j.fallbackStatus||"streaming"}});if(!G)return _;let Z=B1(G);if(Z&&j.dismissedSessionKeys?.has(Z))return _;let X=B1(_),Y=Boolean(Z&&X&&Z===X),L={...Y&&_?.artifact?_.artifact:{},...G.artifact||{}};return{...Y&&_?_:{},...G,artifact:L,source:"live",originChatJid:G.originChatJid||j.currentChatJid,openedAt:Y&&_?.openedAt?_.openedAt:j.updatedAt,liveUpdatedAt:j.updatedAt}}function oQ(_,$){if(!_||_?.source!=="live")return _||null;let j=B1($),G=B1(_);if(j&&G&&j!==G)return _;return null}function sQ(_,$,j){return f2(_,$,{lastEventKind:j.kind,lastEventPayload:j.payload||null,lastSubmitAt:j.submittedAt,lastHostUpdate:{type:"submit_pending",submittedAt:j.submittedAt,preview:j.submissionText||null}})}function kj(_,$,j){if(j.errorMessage)return f2(_,$,{lastHostUpdate:{type:"submit_failed",submittedAt:j.submittedAt,preview:j.submissionText,error:j.errorMessage}});return f2(_,$,{lastHostUpdate:{type:j.queued==="followup"?"submit_queued":"submit_sent",submittedAt:j.submittedAt,preview:j.submissionText,queued:j.queued||null}})}function aQ(_,$,j){return f2(_,$,{lastEventKind:j.kind,lastEventPayload:j.payload||null,...j.kind==="widget.ready"?{readyAt:j.eventAt,lastHostUpdate:{type:"ready_ack",at:j.eventAt}}:{},...j.kind==="widget.request_refresh"?{lastRefreshRequestAt:j.eventAt,refreshCount:j.nextRefreshCount,lastHostUpdate:{type:j.shouldBuildDashboard?"refresh_building":"refresh_ack",at:j.eventAt,count:j.nextRefreshCount,echo:j.payload||null}}:{}})}function tQ(_,$,j){return f2(_,$,{dashboard:j.dashboard,lastHostUpdate:{type:"refresh_dashboard",at:j.at,count:j.count,echo:j.echo||null}})}function eQ(_,$,j){return f2(_,$,{lastHostUpdate:{type:"refresh_failed",at:j.at,count:j.count,error:j.errorMessage}})}Y5();function xk(_){let{setExtensionStatusPanels:$,setPendingExtensionPanelActions:j,setExtensionWorkingState:G}=_;$(new Map),j(new Set),G({message:null,indicator:null,visible:!0})}function _N(_){let{refreshAgentStatus:$,refreshPostPaintThreadState:j}=_;j(),$()}function $N(_){let{currentChatJid:$,currentRootChatJid:j,currentHashtag:G,searchQuery:Z,searchScope:X,loadPosts:Y,searchPosts:L,setPosts:V,setHasMore:q,scrollToBottom:Q,setExtensionStatusPanels:K,setPendingExtensionPanelActions:B,setExtensionWorkingState:N,paneStateOwnerChatJidRef:U,chatPaneStateByChatRef:D,snapshotCurrentChatPaneState:H,restoreChatPaneState:E,dismissedQueueRowIdsRef:k,refreshAgentStatus:z,viewStateRef:O,refreshTimeline:I,refreshModelAndQueueState:x,refreshPostPaintThreadState:A,setFloatingWidget:y,dismissedLiveWidgetKeysRef:W}=_;u(()=>{xk({setExtensionStatusPanels:K,setPendingExtensionPanelActions:B,setExtensionWorkingState:N})},[$,K,B,N]),u(()=>{let J=!1,C=XX("thread-switch",$,{currentRootChatJid:j,currentHashtag:G||null,searchQuery:Z||null,searchScope:X});return X1(C,"route-effect-start",{currentChatJid:$,currentRootChatJid:j}),nQ({currentHashtag:G,searchQuery:Z,searchScope:X,currentChatJid:$,currentRootChatJid:j,loadPosts:Y,searchPosts:L,setPosts:V,setHasMore:q,scrollToBottom:Q,isCancelled:()=>J,onTimelineLoadStart:(P)=>{X1(C,"timeline-load-start",P||null)},onTimelineDataReady:(P)=>{X1(C,"timeline-data-ready",P||null)},onTimelineFirstPaint:(P)=>{X1(C,"timeline-first-paint",P||null),k6(C,["runtime-hydration-ready","timeline-first-paint"],"settled",P||null),_N({refreshAgentStatus:z,refreshPostPaintThreadState:A})},onTimelineError:(P,b)=>{YX(C,P,"timeline-load-failed",b||null),_N({refreshAgentStatus:z,refreshPostPaintThreadState:A})}}),()=>{J=!0,LX(C,"route-effect-cancelled",{currentChatJid:$})}},[$,G,Z,X,j,Y,Q,L,q,V,z,A]),u(()=>{let J=U.current||$;D.current.set(J,H())},[D,$,U,H]),u(()=>{let J=U.current||$;if(J===$)return;D.current.set(J,H()),U.current=$,k.current.clear(),E(D.current.get($)||null)},[D,$,k,U,E,H]);let M=R(()=>{WQ({viewStateRef:O,refreshTimeline:I,refreshModelAndQueueState:x})},[x,I,O]),T=R((J,C="streaming")=>{let P=new Date().toISOString();y((b)=>iQ(b,J,{fallbackStatus:C,currentChatJid:$,dismissedSessionKeys:W.current,updatedAt:P}))},[$,W,y]);return{refreshCurrentView:M,applyLiveGeneratedWidgetUpdate:T}}M0();M0();I_();function Ik({sse:_,onWake:$},j={}){let G=j.window??(typeof window<"u"?window:null),Z=j.document??(typeof document<"u"?document:null);if(!G||!Z||!_)return()=>{};let X=()=>{if(typeof _.forceReconnect==="function"){_.forceReconnect();return}_.reconnectIfNeeded()},Y=typeof j.useFocusReconnect==="boolean"?j.useFocusReconnect:!H5(),L=Z.visibilityState&&Z.visibilityState!=="visible",V=()=>{if(Z.visibilityState&&Z.visibilityState!=="visible")return L=!0,!0;return!1},q=()=>{if(V())return;if(L)L=!1,X(),$?.()},Q=()=>{if(V())return;if(L){q();return}if(Y)_.reconnectIfNeeded()},K=()=>{q()},B=()=>{q()};return G.addEventListener("focus",Q),G.addEventListener("pageshow",K),Z.addEventListener("visibilitychange",B),()=>{G.removeEventListener("focus",Q),G.removeEventListener("pageshow",K),Z.removeEventListener("visibilitychange",B)}}function jN({handleSseEvent:_,handleConnectionStatusChange:$,loadPosts:j,onWake:G,chatJid:Z}){let X=g(_);X.current=_;let Y=g($);Y.current=$;let L=g(j);L.current=j;let V=g(G);V.current=G,u(()=>{let q=new I6((K,B)=>X.current(K,B),(K)=>Y.current(K),{chatJid:Z});q.connect();let Q=Ik({sse:q,onWake:()=>V.current?.()});return()=>{Q(),q.disconnect()}},[Z])}_5();b6();function g4(_,$){return Boolean(_)&&Boolean($)&&_!==$}function P2(_,$){return Boolean(_)&&!Boolean($)}function GN(_,$){return _||$||null}function ZN(_){switch(_){case"generated_widget_open":return{kind:"update",fallbackStatus:"loading",shouldAdoptTurn:!0};case"generated_widget_delta":return{kind:"update",fallbackStatus:"streaming",shouldAdoptTurn:!0};case"generated_widget_final":return{kind:"update",fallbackStatus:"final",shouldAdoptTurn:!0};case"generated_widget_error":return{kind:"update",fallbackStatus:"error",shouldAdoptTurn:!1};case"generated_widget_close":return{kind:"close",fallbackStatus:null,shouldAdoptTurn:!1};default:return{kind:null,fallbackStatus:null,shouldAdoptTurn:!1}}}function R2(_,$){let j=$?.row_id??$?.id;if(j==null||typeof j!=="string"&&typeof j!=="number")return null;let G=$4(_,j);return{rowId:j,items:G.items,remainingQueueCount:G.remainingQueueCount}}function yj(_){if(_==="steer")return{title:"Failed to steer message",detail:"The queued message could not be sent as steering."};return{title:"Failed to remove message",detail:"The queued message could not be removed."}}function Ck(_,$){return typeof _?.chat_jid==="string"&&_.chat_jid.trim()?_.chat_jid.trim():$}function XN(_,$,j){return{isStatusPanelWidgetEvent:_==="extension_ui_widget"&&$?.options?.surface==="status-panel",eventChatJid:Ck($,j),panelKey:typeof $?.key==="string"?$.key:""}}function fk(_,$){if(_!=="extension_ui_working_indicator")return;if(!Array.isArray($?.frames))return{mode:"default",frames:[],intervalMs:null};let j=$.frames.filter((X)=>typeof X==="string"),G=$.interval_ms??$.intervalMs,Z=typeof G==="number"&&Number.isFinite(G)&&G>0?G:null;if(j.length===0)return{mode:"hidden",frames:[],intervalMs:Z};return{mode:"custom",frames:j,intervalMs:Z}}function YN(_,$,j){if($==="extension_ui_working_visible"){let Z=j?.visible!==!1;if(Z===_.visible)return;return{..._,visible:Z}}if($==="extension_ui_working")return{message:typeof j?.message==="string"&&j.message.trim()?j.message.trim():null,indicator:_.indicator,visible:_.visible};let G=fk($,j);if(G===void 0)return;return{message:_.message,indicator:G,visible:_.visible}}function LN(_,$){if(_!=="extension_ui_status")return null;if($?.key!=="context_usage")return null;let j=typeof $?.text==="string"?$.text.trim():"";if(!j)return null;try{let G=JSON.parse(j);if(!G||typeof G!=="object")return null;let Z=G,X=Z.tokens==null?null:Number(Z.tokens),Y=Z.contextWindow==null?null:Number(Z.contextWindow),L=Z.percent==null?null:Number(Z.percent);return{tokens:Number.isFinite(X)?X:null,contextWindow:Number.isFinite(Y)?Y:null,percent:Number.isFinite(L)?L:null,estimated:Z.estimated===!0,source:typeof Z.source==="string"?Z.source:null,phase:typeof Z.phase==="string"?Z.phase:null}}catch{return null}}function qN(_,$){if(_==="extension_ui_notify"&&typeof $?.message==="string")return{title:$.message,detail:null,kind:typeof $?.type==="string"&&$.type.trim()?$.type:"info"};if(_==="extension_ui_error"){let j=$?.error;return{title:"Extension UI error",detail:typeof j==="string"?j:j&&typeof j==="object"&&typeof j.error==="string"?j.error:j?String(j):"Unknown extension error",kind:"error",durationMs:5000}}return null}var Pk=new Set(["extension_ui_request","extension_ui_timeout","extension_ui_notify","extension_ui_status","extension_ui_working","extension_ui_working_indicator","extension_ui_working_visible","extension_ui_widget","extension_ui_title","extension_ui_editor_text","extension_ui_error"]);function VN(_){return Pk.has(String(_||"").trim())}function Rk(_){let $=String(_||"").trim();if(!$.startsWith("extension_ui_"))return"piclaw-extension-ui";return`piclaw-extension-ui:${$.slice(13).replace(/_/g,"-")}`}function S8(_,$,j=globalThis.window){if(!j||typeof j.dispatchEvent!=="function"||typeof CustomEvent>"u")return!1;let G={type:_,payload:$};return j.dispatchEvent(new CustomEvent("piclaw-extension-ui",{detail:G})),j.dispatchEvent(new CustomEvent(Rk(_),{detail:G})),!0}function KN(_,$,j){let G=$?.turn_id,Z=$?.chat_jid,X=typeof Z==="string"&&Z.trim()?Z.trim():null,Y=_==="connected"||_==="workspace_update";return{turnId:G,eventChatJid:X,isGlobalUiEvent:Y,isCurrentChatEvent:X?X===j:Y}}function QN(_){return _==="agent_draft_delta"||_==="agent_thought_delta"||_==="agent_draft"||_==="agent_thought"}function NN(_,$,j){let{currentChatJid:G,updateAgentProfile:Z,updateUserProfile:X,currentTurnIdRef:Y,activeChatJidRef:L,pendingRequestRef:V,draftBufferRef:q,thoughtBufferRef:Q,previewResyncPendingRef:K,previewResyncGenerationRef:B,steerQueuedTurnIdRef:N,thoughtExpandedRef:U,draftExpandedRef:D,draftThrottleRef:H,thoughtThrottleRef:E,viewStateRef:k,followupQueueItemsRef:z,dismissedQueueRowIdsRef:O,scrollToBottomRef:I,hasMoreRef:x,loadMoreRef:A,lastAgentResponseRef:y,wasAgentActiveRef:W,setActiveTurn:M,applyLiveGeneratedWidgetUpdate:T,setFloatingWidget:J,clearLastActivityFlag:C,handleUiVersionDrift:P,setAgentStatus:b,setAgentDraft:m,setAgentPlan:h,setAgentThought:_0,setPendingRequest:v,clearAgentRunState:e,getAgentStatus:W0,noteAgentActivity:G0,showLastActivity:$0,refreshTimeline:L0,refreshModelAndQueueState:B0,refreshActiveChatAgents:t,refreshCurrentChatBranches:V0,notifyForFinalResponse:K0,setContextUsage:k0,refreshContextUsage:s,refreshQueueState:X0,setFollowupQueueItems:D0,clearQueuedSteerStateIfStale:C0,setSteerQueuedTurnId:g0,applyModelState:p0,getAgentContext:j_,setExtensionStatusPanels:m0,setPendingExtensionPanelActions:d0,setExtensionWorkingState:u0,refreshActiveEditorFromWorkspace:o0,showIntentToast:v0,removeStalledPost:a0,setPosts:n0,preserveTimelineScrollTop:N_,openEditor:t0}=j,{turnId:b0,isCurrentChatEvent:A0}=KN(_,$,G);if(A0)Z($),X($);if(_==="ui_theme"){F2($);return}if(_==="ui_meters"){a7($);return}if(_==="ui_open_tab"){let E0=typeof $?.path==="string"?$.path.trim():"",R0=typeof $?.label==="string"?$.label.trim():void 0;if(E0==="piclaw://settings"){let T0=typeof $?.section==="string"?$.section.trim():"";window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:T0?{section:T0}:void 0}));return}if(E0&&typeof t0==="function")t0(E0,R0?{label:R0}:void 0);return}let L_=ZN(_);if(L_.kind==="update"){if(!A0)return;if(L_.shouldAdoptTurn&&P2(b0,Y.current))M(b0);T($,L_.fallbackStatus||"streaming");return}if(L_.kind==="close"){if(!A0)return;J((E0)=>oQ(E0,$));return}if(_?.startsWith("agent_")&&!QN(_))C();if(_==="connected"){if(P($?.app_asset_version))return;if($?.ui_theme){let T0=$.ui_theme.theme||"default",i0=$.ui_theme.tint||null;F2({theme:T0,tint:i0})}if($?.ui_meters)a7($.ui_meters);let E0=B.current+1;if(B.current=E0,K.current=!0,q.current="",Q.current="",b(null),m({text:"",totalLines:0}),h(""),_0({text:"",totalLines:0}),u0({message:null,indicator:null,visible:!0}),v(null),V.current=null,e(),I5(G)){if(B.current===E0)K.current=!1;return}let R0=G;if(W0(R0).then((T0)=>{if(L.current!==R0)return;if(!T0||T0.status!=="active"||!T0.data)return;let i0=T0.data,A_=w8(i0);if(A_)M(A_);b(i0),G0({clearSilence:!0,atMs:r$(i0)??Date.now()}),$0(i0);let q_=x2(T0.thought);if(q_)Q.current=q_.text,_0(q_);let H_=x2(T0.draft);if(H_)q.current=H_.text,m(H_)}).catch((T0)=>{console.warn("Failed to fetch agent status:",T0)}).finally(()=>{if(B.current===E0)K.current=!1}),s1(k.current))L0();B0();return}if(_==="agent_status"){if(!A0){if($?.type==="done"||$?.type==="error")t(),V0();return}let E0=j4($.context_usage);if(E0&&E0.percent!=null)k0((R0)=>u4(R0,E0)?R0:E0),I2(G,E0);if($.type==="context_usage")return;if($.type==="done"||$.type==="error"){if(g4(b0,Y.current))return;if($.type==="done"){if(K0(b0||Y.current),s1(k.current))L0()}if(s(),W.current=!1,e(),O.current.clear(),t(),B0(),m({text:"",totalLines:0}),h(""),_0({text:"",totalLines:0}),u0({message:null,indicator:null,visible:!0}),v(null),$.type==="error")b({type:"error",title:$.title||"Agent error"}),setTimeout(()=>b(null),8000);else b(null)}else{if(b0)M(b0);if(G0({running:!0,clearSilence:!0,atMs:r$($)??Date.now()}),$.type==="thinking")q.current="",Q.current="",m({text:"",totalLines:0}),h(""),_0({text:"",totalLines:0});b($)}return}if(_==="agent_steer_queued"){if(!A0)return;if(g4(b0,Y.current))return;let E0=GN(b0,Y.current);if(!E0)return;N.current=E0,g0(E0);return}if(_==="agent_followup_queued"){if(!A0)return;D0((E0)=>jQ(E0,$)),X0();return}if(_==="agent_followup_consumed"){if(!A0)return;let E0=R2(z.current,$);if(E0)C0(E0.remainingQueueCount),D0((R0)=>$4(R0,E0.rowId).items);if(X0(),s1(k.current))L0();return}if(_==="agent_followup_removed"){if(!A0)return;let E0=R2(z.current,$);if(E0)O.current.add(E0.rowId),C0(E0.remainingQueueCount),D0((R0)=>$4(R0,E0.rowId).items);X0();return}if(_==="agent_draft_delta"){if(!A0)return;if(K.current)return;if(g4(b0,Y.current))return;if(P2(b0,Y.current))M(b0);G0({running:!0,clearSilence:!0}),q.current=PK(q.current,$);let E0=Date.now();if(!H.current||E0-H.current>=100){H.current=E0;let R0=q.current;if(D.current)m((T0)=>Ej(R0,T0));else m(T8(R0,null))}return}if(_==="agent_draft"){if(!A0)return;if(K.current)return;if(g4(b0,Y.current))return;if(P2(b0,Y.current))M(b0);G0({running:!0,clearSilence:!0});let E0=$.text||"",R0=$.mode||($.kind==="plan"?"replace":"append");if($.kind==="plan")h((T0)=>fK(T0,E0,R0));else if(!D.current)q.current=E0,m(T8(E0,$.total_lines));return}if(_==="agent_thought_delta"){if(!A0)return;if(K.current)return;if(g4(b0,Y.current))return;if(P2(b0,Y.current))M(b0);G0({running:!0,clearSilence:!0}),Q.current=RK(Q.current,$);let E0=Date.now();if(U.current&&(!E.current||E0-E.current>=100)){E.current=E0;let R0=Q.current;_0((T0)=>Ej(R0,T0))}return}if(_==="agent_thought"){if(!A0)return;if(K.current)return;if(g4(b0,Y.current))return;if(P2(b0,Y.current))M(b0);G0({running:!0,clearSilence:!0});let E0=$.text||"";if(!U.current)Q.current=E0,_0(T8(E0,$.total_lines));return}if(_==="model_changed"){if(!A0)return;p0($);let E0=G;j_(E0).then((R0)=>{if(L.current!==E0)return;let T0=j4(R0);if(T0&&T0.percent!=null)k0((i0)=>u4(i0,T0)?i0:T0),I2(E0,T0)}).catch(()=>{if(L.current!==E0)return});return}let e0=XN(_,$,G);if(e0.isStatusPanelWidgetEvent){if(e0.eventChatJid!==G)return;if(!e0.panelKey)return;if(m0((E0)=>qQ(E0,$)),VQ($))d0((E0)=>C8(E0,e0.panelKey));S8(_,$);return}if(_==="workspace_update"){if(typeof window<"u")window.dispatchEvent(new CustomEvent("workspace-update",{detail:$}));o0($?.updates);return}if(VN(_)){if(_==="extension_ui_title"){t(),V0(),S8(_,$);return}if(!A0)return;let E0=LN(_,$);if(E0&&E0.percent!=null)k0((T0)=>u4(T0,E0)?T0:E0);u0((T0)=>{return YN(T0,_,$)??T0}),S8(_,$);let R0=qN(_,$);if(R0)v0(R0.title,R0.detail,R0.kind,R0.durationMs);return}let z_=s1(k.current);if(_==="agent_response"){if(!A0)return;u0({message:null,indicator:null,visible:!0}),a0(),y.current={post:$,turnId:Y.current}}if(SK(_,A0,z_))n0((E0)=>uK(E0,$)),I.current?.();if(_==="interaction_updated"){if(!Hj(A0,z_))return;n0((E0)=>gK(E0,$))}if(_==="interaction_deleted"){if(!Hj(A0,z_))return;let E0=$?.ids||[];if(E0.length){if(N_(()=>{n0((R0)=>bK(R0,E0))}),x.current)A.current?.({preserveScroll:!0,preserveMode:"top"})}}}function Sk(_){return _?15000:60000}function BN(_){let{currentChatJid:$,posts:j,scrollToMessage:G,handleConnectionStatusChange:Z,loadPosts:X,refreshCurrentView:Y,updateAgentProfile:L,updateUserProfile:V,currentTurnIdRef:q,activeChatJidRef:Q,pendingRequestRef:K,draftBufferRef:B,thoughtBufferRef:N,previewResyncPendingRef:U,previewResyncGenerationRef:D,steerQueuedTurnIdRef:H,thoughtExpandedRef:E,draftExpandedRef:k,draftThrottleRef:z,thoughtThrottleRef:O,viewStateRef:I,followupQueueItemsRef:x,dismissedQueueRowIdsRef:A,scrollToBottomRef:y,hasMoreRef:W,loadMoreRef:M,lastAgentResponseRef:T,wasAgentActiveRef:J,setActiveTurn:C,applyLiveGeneratedWidgetUpdate:P,setFloatingWidget:b,clearLastActivityFlag:m,handleUiVersionDrift:h,setAgentStatus:_0,setAgentDraft:v,setAgentPlan:e,setAgentThought:W0,setPendingRequest:G0,clearAgentRunState:$0,getAgentStatus:L0,noteAgentActivity:B0,showLastActivity:t,refreshTimeline:V0,refreshModelAndQueueState:K0,refreshActiveChatAgents:k0,refreshCurrentChatBranches:s,notifyForFinalResponse:X0,setContextUsage:D0,refreshContextUsage:C0,refreshQueueState:g0,setFollowupQueueItems:p0,clearQueuedSteerStateIfStale:j_,setSteerQueuedTurnId:m0,applyModelState:d0,getAgentContext:u0,setExtensionStatusPanels:o0,setPendingExtensionPanelActions:v0,setExtensionWorkingState:a0,refreshActiveEditorFromWorkspace:n0,showIntentToast:N_,removeStalledPost:t0,setPosts:b0,preserveTimelineScrollTop:A0,openEditor:L_,finalizeStalledResponse:e0,connectionStatus:z_,agentStatus:E0,refreshAgentStatus:R0,refreshAutoresearchStatus:T0}=_,i0=R((q_,H_)=>{NN(q_,H_,{currentChatJid:$,updateAgentProfile:L,updateUserProfile:V,currentTurnIdRef:q,activeChatJidRef:Q,pendingRequestRef:K,draftBufferRef:B,thoughtBufferRef:N,previewResyncPendingRef:U,previewResyncGenerationRef:D,steerQueuedTurnIdRef:H,thoughtExpandedRef:E,draftExpandedRef:k,draftThrottleRef:z,thoughtThrottleRef:O,viewStateRef:I,followupQueueItemsRef:x,dismissedQueueRowIdsRef:A,scrollToBottomRef:y,hasMoreRef:W,loadMoreRef:M,lastAgentResponseRef:T,wasAgentActiveRef:J,setActiveTurn:C,applyLiveGeneratedWidgetUpdate:P,setFloatingWidget:b,clearLastActivityFlag:m,handleUiVersionDrift:h,setAgentStatus:_0,setAgentDraft:v,setAgentPlan:e,setAgentThought:W0,setPendingRequest:G0,clearAgentRunState:$0,getAgentStatus:L0,noteAgentActivity:B0,showLastActivity:t,refreshTimeline:V0,refreshModelAndQueueState:K0,refreshActiveChatAgents:k0,refreshCurrentChatBranches:s,notifyForFinalResponse:X0,setContextUsage:D0,refreshContextUsage:C0,refreshQueueState:g0,setFollowupQueueItems:p0,clearQueuedSteerStateIfStale:j_,setSteerQueuedTurnId:m0,applyModelState:d0,getAgentContext:u0,setExtensionStatusPanels:o0,setPendingExtensionPanelActions:v0,setExtensionWorkingState:a0,refreshActiveEditorFromWorkspace:n0,showIntentToast:N_,removeStalledPost:t0,setPosts:b0,preserveTimelineScrollTop:A0,openEditor:L_})},[Q,P,d0,$0,m,j_,$,q,A,B,k,z,x,u0,L0,h,W,T,M,B0,X0,K,A0,D,U,k0,n0,C0,s,K0,g0,V0,t0,y,C,v,e,_0,W0,D0,o0,a0,b,p0,v0,G0,b0,m0,N_,t,H,N,E,O,L,V,I,J,L_]);u(()=>{if(typeof window>"u")return;let q_=window.__PICLAW_TEST_API||{};return q_.emit=i0,q_.reset=()=>{t0(),$0(),_0(null),v({text:"",totalLines:0}),e(""),W0({text:"",totalLines:0}),a0({message:null,indicator:null,visible:!0}),G0(null)},q_.finalize=()=>e0(),window.__PICLAW_TEST_API=q_,()=>{if(window.__PICLAW_TEST_API===q_)window.__PICLAW_TEST_API=void 0}},[$0,e0,i0,t0,v,e,_0,W0,a0,G0]),jN({handleSseEvent:i0,handleConnectionStatusChange:Z,loadPosts:X,onWake:Y,chatJid:$}),u(()=>{if(!j||j.length===0)return;let q_=location.hash;if(!q_||!q_.startsWith("#msg-"))return;let H_=q_.slice(5);G(H_),history.replaceState(null,"",location.pathname+location.search)},[j,G]);let A_=E0!==null;u(()=>{if(z_!=="connected")return;let q_=Sk(A_),H_=setInterval(()=>{MQ({viewStateRef:I,isAgentActive:A_,refreshTimeline:V0,refreshQueueState:g0,refreshAgentStatus:R0,refreshContextUsage:C0,refreshAutoresearchStatus:T0})},q_);return()=>clearInterval(H_)},[z_,A_,R0,T0,C0,g0,V0,I]),u(()=>{return J8(()=>{R0(),C0(),g0(),T0()})},[R0,T0,C0,g0])}function uk(_){return{currentChatJid:_.currentChatJid,activeChatJidRef:_.activeChatJidRef,queueRefreshGenRef:_.queueRefreshGenRef,dismissedQueueRowIdsRef:_.dismissedQueueRowIdsRef,getAgentQueueState:_.getAgentQueueState,setFollowupQueueItems:_.setFollowupQueueItems,clearQueuedSteerStateIfStale:_.clearQueuedSteerStateIfStale,getAgentContext:_.getAgentContext,setContextUsage:_.setContextUsage,getAutoresearchStatus:_.getAutoresearchStatus,setExtensionStatusPanels:_.setExtensionStatusPanels,setPendingExtensionPanelActions:_.setPendingExtensionPanelActions,getAgentStatus:_.getAgentStatus,wasAgentActiveRef:_.wasAgentActiveRef,viewStateRef:_.viewStateRef,refreshTimeline:_.refreshTimeline,clearAgentRunState:_.clearAgentRunState,agentStatusRef:_.agentStatusRef,pendingRequestRef:_.pendingRequestRef,thoughtBufferRef:_.thoughtBufferRef,draftBufferRef:_.draftBufferRef,setAgentStatus:_.setAgentStatus,setAgentDraft:_.setAgentDraft,setAgentPlan:_.setAgentPlan,setAgentThought:_.setAgentThought,setPendingRequest:_.setPendingRequest,setActiveTurn:_.setActiveTurn,noteAgentActivity:_.noteAgentActivity,clearLastActivityFlag:_.clearLastActivityFlag,isAgentRunningRef:_.isAgentRunningRef,currentTurnIdRef:_.currentTurnIdRef,silentRecoveryRef:_.silentRecoveryRef,silenceRefreshMs:_.silenceRefreshMs,lastAgentEventRef:_.lastAgentEventRef,lastSilenceNoticeRef:_.lastSilenceNoticeRef,silenceWarningMs:_.silenceWarningMs,silenceFinalizeMs:_.silenceFinalizeMs,isCompactionStatus:_.isCompactionStatus,serverVersionContext:_.serverVersionContext,setConnectionStatus:_.setConnectionStatus,setStateAccessFailed:_.setStateAccessFailed,setPendingRequestForConnection:_.setPendingRequest,hasConnectedOnceRef:_.hasConnectedOnceRef}}function gk(_){return{getAgents:_.getAgents,setAgents:_.setAgents,setUserProfile:_.setUserProfile,applyBranding:_.applyBranding,readStoredNumber:_.readStoredNumber,sidebarWidthRef:_.sidebarWidthRef,appShellRef:_.appShellRef,currentChatJid:_.currentChatJid,currentRootChatJid:_.currentRootChatJid,getAgentModels:_.getAgentModels,getAgentContext:_.getAgentContext,getActiveChatAgents:_.getActiveChatAgents,getChatBranches:_.getChatBranches,activeChatJidRef:_.activeChatJidRef,setActiveChatAgents:_.setActiveChatAgents,setCurrentChatBranches:_.setCurrentChatBranches,setActiveModel:_.setActiveModel,setActiveThinkingLevel:_.setActiveThinkingLevel,setSupportsThinking:_.setSupportsThinking,setActiveModelUsage:_.setActiveModelUsage,setAgentModelsPayload:_.setAgentModelsPayload,setHasLoadedAgentModels:_.setHasLoadedAgentModels,agentsRef:_.agentsRef,refreshQueueState:_.refreshQueueState,refreshContextUsage:_.refreshContextUsage,refreshAutoresearchStatus:_.refreshAutoresearchStatus,setContextUsage:_.setContextUsage,setExtensionWorkingState:_.setExtensionWorkingState}}function bk(_){return{currentChatJid:_.currentChatJid,currentRootChatJid:_.currentRootChatJid,currentHashtag:_.currentHashtag,searchQuery:_.searchQuery,searchScope:_.searchScope,loadPosts:_.loadPosts,searchPosts:_.searchPosts,setPosts:_.setPosts,setHasMore:_.setHasMore,scrollToBottom:_.scrollToBottom,setExtensionStatusPanels:_.setExtensionStatusPanels,setPendingExtensionPanelActions:_.setPendingExtensionPanelActions,setExtensionWorkingState:_.setExtensionWorkingState,paneStateOwnerChatJidRef:_.paneStateOwnerChatJidRef,chatPaneStateByChatRef:_.chatPaneStateByChatRef,snapshotCurrentChatPaneState:_.snapshotCurrentChatPaneState,restoreChatPaneState:_.restoreChatPaneState,dismissedQueueRowIdsRef:_.dismissedQueueRowIdsRef,refreshQueueState:_.refreshQueueState,refreshAgentStatus:_.refreshAgentStatus,refreshContextUsage:_.refreshContextUsage,viewStateRef:_.viewStateRef,refreshTimeline:_.refreshTimeline,refreshModelAndQueueState:_.refreshModelAndQueueState,refreshPostPaintThreadState:_.refreshPostPaintThreadState,setFloatingWidget:_.setFloatingWidget,dismissedLiveWidgetKeysRef:_.dismissedLiveWidgetKeysRef}}function vk(_){return{currentChatJid:_.currentChatJid,posts:_.posts,scrollToMessage:_.scrollToMessage,handleConnectionStatusChange:_.handleConnectionStatusChange,loadPosts:_.loadPosts,refreshCurrentView:_.refreshCurrentView,updateAgentProfile:_.updateAgentProfile,updateUserProfile:_.updateUserProfile,currentTurnIdRef:_.currentTurnIdRef,activeChatJidRef:_.activeChatJidRef,pendingRequestRef:_.pendingRequestRef,draftBufferRef:_.draftBufferRef,thoughtBufferRef:_.thoughtBufferRef,previewResyncPendingRef:_.previewResyncPendingRef,previewResyncGenerationRef:_.previewResyncGenerationRef,steerQueuedTurnIdRef:_.steerQueuedTurnIdRef,thoughtExpandedRef:_.thoughtExpandedRef,draftExpandedRef:_.draftExpandedRef,draftThrottleRef:_.draftThrottleRef,thoughtThrottleRef:_.thoughtThrottleRef,viewStateRef:_.viewStateRef,followupQueueItemsRef:_.followupQueueItemsRef,dismissedQueueRowIdsRef:_.dismissedQueueRowIdsRef,scrollToBottomRef:_.scrollToBottomRef,hasMoreRef:_.hasMoreRef,loadMoreRef:_.loadMoreRef,lastAgentResponseRef:_.lastAgentResponseRef,wasAgentActiveRef:_.wasAgentActiveRef,setActiveTurn:_.setActiveTurn,applyLiveGeneratedWidgetUpdate:_.applyLiveGeneratedWidgetUpdate,setFloatingWidget:_.setFloatingWidget,clearLastActivityFlag:_.clearLastActivityFlag,handleUiVersionDrift:_.handleUiVersionDrift,setAgentStatus:_.setAgentStatus,setAgentDraft:_.setAgentDraft,setAgentPlan:_.setAgentPlan,setAgentThought:_.setAgentThought,setPendingRequest:_.setPendingRequest,clearAgentRunState:_.clearAgentRunState,getAgentStatus:_.getAgentStatus,noteAgentActivity:_.noteAgentActivity,showLastActivity:_.showLastActivity,refreshTimeline:_.refreshTimeline,refreshModelAndQueueState:_.refreshModelAndQueueState,refreshActiveChatAgents:_.refreshActiveChatAgents,refreshCurrentChatBranches:_.refreshCurrentChatBranches,notifyForFinalResponse:_.notifyForFinalResponse,setContextUsage:_.setContextUsage,refreshContextUsage:_.refreshContextUsage,refreshQueueState:_.refreshQueueState,setFollowupQueueItems:_.setFollowupQueueItems,clearQueuedSteerStateIfStale:_.clearQueuedSteerStateIfStale,setSteerQueuedTurnId:_.setSteerQueuedTurnId,applyModelState:_.applyModelState,getAgentContext:_.getAgentContext,setExtensionStatusPanels:_.setExtensionStatusPanels,setPendingExtensionPanelActions:_.setPendingExtensionPanelActions,setExtensionWorkingState:_.setExtensionWorkingState,refreshActiveEditorFromWorkspace:_.refreshActiveEditorFromWorkspace,showIntentToast:_.showIntentToast,removeStalledPost:_.removeStalledPost,setPosts:_.setPosts,preserveTimelineScrollTop:_.preserveTimelineScrollTop,finalizeStalledResponse:_.finalizeStalledResponse,connectionStatus:_.connectionStatus,agentStatus:_.agentStatus,refreshAgentStatus:_.refreshAgentStatus,refreshAutoresearchStatus:_.refreshAutoresearchStatus}}function FN(_){let $=wQ(uk(_)),j=rQ(gk({..._,refreshQueueState:$.refreshQueueState,refreshContextUsage:$.refreshContextUsage,refreshAutoresearchStatus:$.refreshAutoresearchStatus})),G=$N(bk({..._,refreshQueueState:$.refreshQueueState,refreshAgentStatus:$.refreshAgentStatus,refreshContextUsage:$.refreshContextUsage,refreshModelAndQueueState:j.refreshModelAndQueueState,refreshPostPaintThreadState:j.refreshPostPaintThreadState}));return BN(vk({..._,handleConnectionStatusChange:$.handleConnectionStatusChange,handleUiVersionDrift:$.handleUiVersionDrift,refreshCurrentView:G.refreshCurrentView,updateAgentProfile:j.updateAgentProfile,updateUserProfile:j.updateUserProfile,applyLiveGeneratedWidgetUpdate:G.applyLiveGeneratedWidgetUpdate,refreshModelAndQueueState:j.refreshModelAndQueueState,refreshActiveChatAgents:j.refreshActiveChatAgents,refreshCurrentChatBranches:j.refreshCurrentChatBranches,refreshContextUsage:$.refreshContextUsage,refreshQueueState:$.refreshQueueState,applyModelState:j.applyModelState,refreshAgentStatus:$.refreshAgentStatus,refreshAutoresearchStatus:$.refreshAutoresearchStatus})),{agentStatusLifecycle:$,chatRefreshLifecycle:j,viewRefreshLifecycle:G}}M0();var UN="piclaw:pane-host-transfer:",mk=300000;function EN(_){try{return _?.localStorage??null}catch{return null}}function HN(_){return typeof _==="string"?_.trim():""}function DN(_){if(!_||typeof _!=="object"||Array.isArray(_))return null;return _}function ck(_=Date.now()){return`pane-transfer-${_.toString(36)}-${Math.random().toString(36).slice(2,10)}`}function lk(_,$){try{return _?.removeItem($),!0}catch(j){return!1}}function hk(_,$=globalThis,j=Date.now()){let G=EN($),Z=HN(_?.path),X=DN(_?.payload);if(!G||!Z||!X)return null;let Y=ck(j);try{return G.setItem(`${UN}${Y}`,JSON.stringify({path:Z,payload:X,capturedAt:j})),Y}catch{return null}}function Mj(_,$=globalThis,j=Date.now()){let G=typeof _==="string"?_.trim():"",Z=EN($);if(!G||!Z)return null;let X=`${UN}${G}`,Y="";try{Y=Z.getItem(X)||""}catch{return null}if(!Y)return null;lk(Z,X);try{let L=JSON.parse(Y),V=typeof L?.capturedAt==="number"&&Number.isFinite(L.capturedAt)?L.capturedAt:j;if(V+mk<j)return null;let q=HN(L?.path),Q=DN(L?.payload);if(!q||!Q)return null;return{path:q,payload:Q,capturedAt:V}}catch{return null}}function u8(_,$=globalThis,j=Date.now()){let G=hk(_,$,j);return G?{pane_transfer:G}:null}function WN(_=globalThis,$=Date.now()){let j=G2("pane_transfer",_);return Mj(j,_,$)}function b4(_){return typeof _==="string"?_.trim():""}function nk(_){return Boolean(_)&&typeof _.get==="function"&&typeof _.set==="function"&&typeof _.delete==="function"&&typeof _.entries==="function"}function wj(_){if(!_)return null;let $=_.__piclawPaneLiveTransferRegistry__;if(nk($))return $;let j=new Map;return _.__piclawPaneLiveTransferRegistry__=j,j}function rk(_){try{return _?.(),!0}catch($){return!1}}function S2(_,$=typeof window<"u"?window:null){let j=wj($),G=b4(_?.panePath),Z=b4(_?.paneInstanceId),X=b4(_?.paneWindowId);if(!j||!G||!Z||!X||typeof _?.instance?.moveHost!=="function")return!1;return j.set(X,{..._,panePath:G,paneInstanceId:Z,paneWindowId:X,registeredAt:typeof _?.registeredAt==="number"?_.registeredAt:Date.now()}),!0}function ON(_,$=typeof window<"u"?window:null){let j=wj($),G=b4(_);if(!j||!G)return;for(let[Z,X]of j.entries())if(X?.panePath===G)j.delete(Z)}async function zN(_,$,j,G){let Z=wj(_),X=b4($?.panePath),Y=b4($?.paneInstanceId),L=b4($?.paneWindowId);if(!Z||!X||!Y||!L)return null;let V=Z.get(L)||null;if(!V)return null;if(V.panePath!==X||V.paneInstanceId!==Y)return null;if(typeof V.instance?.moveHost!=="function")return null;if(!await V.instance.moveHost(j,G))return null;return Z.delete(L),rk(V.releaseSourceHost),V.instance}m6();function P5(_){if(!_||typeof _!=="object")return!1;let $=_;if(typeof $.closest==="function"&&$.closest('input, textarea, select, [contenteditable="true"], .compose-box, .compose-model-popup, .compose-session-popup'))return!0;return Boolean($.isContentEditable)}function JN(_,$={}){let j=$.document??(typeof document<"u"?document:null);if(!j)return()=>{};let G=_?.openTab,Z=_?.editSource,X=_?.popOutPane,Y=(Q)=>{let K=Q?.detail?.path,B=typeof Q?.detail?.label==="string"&&Q.detail.label.trim()?Q.detail.label.trim():void 0;if(K)G?.(K,B)},L=(Q)=>{let K=Q?.detail?.path,B=typeof Q?.detail?.label==="string"&&Q.detail.label.trim()?Q.detail.label.trim():void 0;if(K)Z?.(K,B)},V=(Q)=>{let K=Q?.detail?.path,B=typeof Q?.detail?.label==="string"&&Q.detail.label.trim()?Q.detail.label.trim():void 0;if(K)X?.(K,B)},q=["pane:open-tab","office-viewer:open-tab","csv-viewer:open-tab","pdf-viewer:open-tab","image-viewer:open-tab","video-viewer:open-tab","html-viewer:open-tab","mindmap:open-tab","vnc:open-tab"];return q.forEach((Q)=>j.addEventListener(Q,Y)),j.addEventListener("html-viewer:edit-source",L),j.addEventListener("pane:popout",V),()=>{q.forEach((Q)=>j.removeEventListener(Q,Y)),j.removeEventListener("html-viewer:edit-source",L),j.removeEventListener("pane:popout",V)}}function AN(_,$={}){let j=$.document??(typeof document<"u"?document:null);if(!j)return()=>{};let G=(Z)=>{if(P5(Z?.target))return;if(!z$(Z,"toggleDock"))return;Z.preventDefault?.(),_?.()};return j.addEventListener("keydown",G),()=>j.removeEventListener("keydown",G)}function kN(_,$={}){let j=$.document??(typeof document<"u"?document:null);if(!j)return()=>{};let G=_?.toggleZenMode,Z=_?.exitZenMode,X=typeof _?.isZenModeActive==="function"?_.isZenModeActive:()=>Boolean(_?.zenMode),Y=(L)=>{if(z$(L,"toggleZenMode")){L.preventDefault?.(),G?.();return}if(P5(L?.target))return;if(L?.key==="Escape"&&X())L.preventDefault?.(),Z?.()};return j.addEventListener("keydown",Y),()=>j.removeEventListener("keydown",Y)}function yN(_,$={}){let j=$.document??(typeof document<"u"?document:null);if(!j)return()=>{};let G=(Z)=>{if(P5(Z?.target))return;if(z$(Z,"previousChat")){Z.preventDefault?.(),_?.previousChat?.();return}if(z$(Z,"nextChat"))Z.preventDefault?.(),_?.nextChat?.()};return j.addEventListener("keydown",G),()=>j.removeEventListener("keydown",G)}function MN(_={}){let $=_.document??(typeof document<"u"?document:null);if(!$)return()=>{};let j=(G)=>{if(P5(G?.target))return;if(!z$(G,"openSettings"))return;G.preventDefault(),o1()};return $.addEventListener("keydown",j),()=>$.removeEventListener("keydown",j)}function wN(_={}){let $=_.document??(typeof document<"u"?document:null);if(!$)return()=>{};let j=(G)=>{if(P5(G?.target))return;if(!z$(G,"openHelp"))return;G.preventDefault(),o1({section:"keyboard"})};return $.addEventListener("keydown",j),()=>$.removeEventListener("keydown",j)}function TN(_){let{hasWindow:$=typeof window<"u",currentBranchRecord:j,renameBranchInFlight:G,renameBranchLockUntil:Z,getFormLock:X,setRenameBranchNameDraft:Y,setIsRenameBranchFormOpen:L,now:V=Date.now()}=_;if(!$||!j?.chat_jid)return!1;let q=X?.()||null;if(!q)return!1;if(G||V<Number(Z||0)||q.inFlight||V<Number(q.cooldownUntil||0))return!1;return Y?.(j.agent_name||""),L?.(!0),!0}function xN(_){let{setIsRenameBranchFormOpen:$,setRenameBranchNameDraft:j}=_;$?.(!1),j?.("")}async function IN(_){let{hasWindow:$=typeof window<"u",currentBranchRecord:j,nextName:G,openRenameForm:Z,renameBranchInFlightRef:X,renameBranchLockUntilRef:Y,getFormLock:L,setIsRenamingBranch:V,renameChatBranch:q,refreshActiveChatAgents:Q,refreshCurrentChatBranches:K,navigate:B,baseHref:N,chatOnlyMode:U,showIntentToast:D,closeRenameForm:H,now:E=()=>Date.now()}=_;if(!$||!j?.chat_jid)return!1;if(typeof G!=="string")return Z?.(),!1;let k=E(),z=L?.()||null;if(!z)return!1;if(X.current||k<Number(Y.current||0)||z.inFlight||k<Number(z.cooldownUntil||0))return!1;X.current=!0,z.inFlight=!0,V?.(!0);try{let O=j.agent_name||"",I=a6(G,O);if(!I.canSubmit)return D?.("Could not rename session",I.message||"Enter a valid session handle.","warning",4000),!1;let x=I.normalized||O,A=await q(j.chat_jid,{agentName:x});await Promise.allSettled([Q?.(),K?.()]);let y=A?.branch?.agent_name||x||O;return D?.("Session renamed",`@${y}`,"info",3500),H?.(),!0}catch(O){let I=O instanceof Error?O.message:String(O||"Could not rename session."),x=/already in use/i.test(I||"")?`${I} Switch to or restore that existing session from the session manager.`:I;return D?.("Could not rename session",x||"Could not rename session.","warning",5000),!1}finally{X.current=!1,V?.(!1);let O=E()+nV;Y.current=O;let I=L?.()||null;if(I)I.inFlight=!1,I.cooldownUntil=O}}async function CN(_){let{hasWindow:$=typeof window<"u",targetChatJid:j=null,currentChatJid:G,currentBranchRecord:Z,currentChatBranches:X=[],activeChatAgents:Y=[],pruneChatBranch:L,refreshActiveChatAgents:V,refreshCurrentChatBranches:q,showIntentToast:Q,baseHref:K,chatOnlyMode:B,navigate:N,confirm:U=(y)=>window.confirm(y)}=_;if(!$)return!1;let D=typeof j==="string"&&j.trim()?j.trim():"",H=typeof G==="string"&&G.trim()?G.trim():"",E=D||Z?.chat_jid||H;if(!E)return Q?.("Could not prune branch","No active session is selected yet.","warning",4000),!1;let k=(Z?.chat_jid===E?Z:null)||X.find((y)=>y?.chat_jid===E)||Y.find((y)=>y?.chat_jid===E)||null,z=k?.chat_jid===(k?.root_chat_jid||k?.chat_jid),O=Boolean(z&&E==="web:default"),I=Boolean(z&&X.some((y)=>{let W=typeof y?.chat_jid==="string"?y.chat_jid.trim():"",M=typeof y?.root_chat_jid==="string"?y.root_chat_jid.trim():W;return W&&W!==E&&M===E&&!y?.archived_at}));if(O)return Q?.("Cannot archive session","The default chat session cannot be archived.","warning",4000),!1;if(I)return Q?.("Cannot archive session","Archive or delete the child branch sessions first.","warning",4500),!1;let x=`@${k?.agent_name||E}${k?.chat_jid?` — ${k.chat_jid}`:""}`;if(!U(z?`Archive ${x}?

This removes the session from the session picker. Chat history is preserved.`:`Prune ${x}?

This archives the branch agent and removes it from the branch picker. Chat history is preserved.`))return!1;try{await L(E),await Promise.allSettled([V?.(),q?.()]);let y=z?"web:default":k?.root_chat_jid||"web:default";Q?.(z?"Session archived":"Branch pruned",`${x} has been archived.`,"info",3000);let W=T1(K,y,{chatOnly:B});return N?.(W),!0}catch(y){let W=y instanceof Error?y.message:String(y||"Could not prune branch.");return Q?.("Could not prune branch",W||"Could not prune branch.","warning",5000),!1}}async function fN(_){let{targetChatJid:$,purgeChatBranch:j,currentChatBranches:G=[],refreshActiveChatAgents:Z,refreshCurrentChatBranches:X,showIntentToast:Y,confirm:L=(D)=>window.confirm(D)}=_,V=typeof $==="string"?$.trim():"";if(!V||typeof j!=="function")return!1;let q=G.find((D)=>D?.chat_jid===V)||null;if(!Boolean(q?.archived_at))return Y?.("Could not delete branch","Only archived sessions can be permanently deleted.","warning",4500),!1;let K=Boolean(q?.chat_jid&&q.chat_jid===(q.root_chat_jid||q.chat_jid)),B=`@${q?.agent_name||V}`;if(!L(`Permanently delete ${B}?

This removes all chat history, token usage, cursor state, scheduled tasks, and session files for this ${K?"session":"branch"}. It cannot be undone.`))return!1;try{return await j(V),await Promise.allSettled([Z?.(),X?.()]),Y?.(K?"Archived session deleted":"Archived branch deleted",`${B} was permanently deleted.`,"info",4000),!0}catch(D){let H=D instanceof Error?D.message:String(D||`Could not permanently delete archived ${K?"session":"branch"}.`);return Y?.("Could not delete branch",H||`Could not permanently delete archived ${K?"session":"branch"}.`,"warning",5000),!1}}async function PN(_){let{targetChatJid:$,restoreChatBranch:j,currentChatBranches:G=[],refreshActiveChatAgents:Z,refreshCurrentChatBranches:X,showIntentToast:Y,baseHref:L,chatOnlyMode:V,navigate:q}=_,Q=typeof $==="string"?$.trim():"";if(!Q||typeof j!=="function")return!1;try{let K=G.find((E)=>E?.chat_jid===Q)||null,B=await j(Q);await Promise.allSettled([Z?.(),X?.()]);let N=B?.branch,U=typeof N?.chat_jid==="string"&&N.chat_jid.trim()?N.chat_jid.trim():Q,D=OL(K?.agent_name,N?.agent_name,U);Y?.("Branch restored",D,"info",4200);let H=T1(L,U,{chatOnly:V});return q?.(H),!0}catch(K){let B=K instanceof Error?K.message:String(K||"Could not restore branch.");return Y?.("Could not restore branch",B||"Could not restore branch.","warning",5000),!1}}async function RN(_){let{branchLoaderSourceChatJid:$,forkChatBranch:j,setBranchLoaderState:G,navigate:Z,baseHref:X,isCancelled:Y=()=>!1}=_;try{G?.({status:"running",message:"Preparing a new chat branch…"});let L=await j($);if(Y())return!1;let V=L?.branch,q=typeof V?.chat_jid==="string"&&V.chat_jid.trim()?V.chat_jid.trim():null;if(!q)throw Error("Branch fork did not return a chat id.");let Q=T1(X,q,{chatOnly:!0});return Z?.(Q,{replace:!0}),!0}catch(L){if(Y())return!1;return G?.({status:"error",message:U4(L)}),!1}}function uN(_){let{hasWindow:$=typeof window<"u",nextChatJid:j,currentChatJid:G,chatOnlyMode:Z,currentHref:X,navigate:Y}=_;if(!$)return!1;let L=typeof j==="string"?j.trim():"";if(!L||L===G)return!1;let V=T1(X,L,{chatOnly:Z});return Y?.(V),!0}function pk(_){return typeof _==="string"?_.trim():""}function dk(_){return new Promise(($)=>setTimeout($,_))}async function SN(_,$){if(typeof _?.beforeDetachFromHost!=="function")return;await _.beforeDetachFromHost({path:$,target:"popout"})}async function gN(_){let{panePath:$,tabStripActiveId:j,editorInstanceRef:G,dockInstanceRef:Z,terminalTabPath:X,activateTab:Y,getActiveTabId:L,resolveTab:V,buildEditorPopoutTransfer:q}=_,Q=$===X&&Boolean(V?.($));if($===X&&!Q){let D=Z.current;if(await SN(D,$),typeof D?.preparePopoutTransfer!=="function")return null;return await D.preparePopoutTransfer()}let K=()=>pk(L?.()??j),B=K(),N=G.current;if(B!==$)Y?.($);let U=B===$?G.current:null;if(typeof U?.preparePopoutTransfer!=="function")for(let D=0;D<12;D+=1){if(D>0)await dk(16);else await Promise.resolve();let H=K(),E=G.current,k=H===$,z=E!==N;if(!k||typeof E?.preparePopoutTransfer!=="function")continue;if(B===$||z||D>0){U=E;break}}if(await SN(U,$),typeof U?.preparePopoutTransfer==="function"){let D=await U.preparePopoutTransfer();if(D)return D}return q?.($)??null}function bN(_){let{panePath:$,terminalTabPath:j,dockVisible:G,resolveTab:Z,closeTab:X,setDockVisible:Y}=_,L=Z($);if(L&&!L.dirty){X($);return}if($===j&&G)Y(!1)}function vN(_){let{hasWindow:$=typeof window<"u",editorOpen:j,shellElement:G,editorWidthRef:Z,dockHeightRef:X,sidebarWidthRef:Y,readStoredNumber:L}=_;if(!j||!$||!G)return;if(!Z.current){let V=L("editorWidth",null),q=Y.current||280,Q=Number.isFinite(V)?Number(V):q;Z.current=E5(Q,typeof window<"u"?window.innerWidth:0,Y.current||0)}if(G.style.setProperty("--editor-width",`${Z.current}px`),!X.current){let V=L("dockHeight",null);X.current=Number.isFinite(V)?Number(V):200}G.style.setProperty("--dock-height",`${X.current}px`)}I_();async function mN(_){if(typeof _!=="function")return null;try{return await _()}catch{return null}}async function cN(_){let{currentChatJid:$,chatOnlyMode:j,forkChatBranch:G,refreshActiveChatAgents:Z,refreshCurrentChatBranches:X,showIntentToast:Y,navigate:L,baseHref:V}=_;if(typeof L==="function")try{let q=I3(V,$,{chatOnly:j});return L(q),!0}catch(q){return Y?.("Could not create branch",U4(q),"warning",5000),!1}try{let Q=(await G($))?.branch,K=typeof Q?.chat_jid==="string"&&Q.chat_jid.trim()?Q.chat_jid.trim():null;if(!K)throw Error("Branch fork did not return a chat id.");await Promise.allSettled([Z?.(),X?.()]);let B=Q?.agent_name?`@${Q.agent_name}`:K;Y?.("New branch created",`Switched to ${B}.`,"info",2500);let N=T1(V,K,{chatOnly:j});return L?.(N),!0}catch(q){return Y?.("Could not create branch",U4(q),"warning",5000),!1}}async function lN(_){let{rootName:$,chatOnlyMode:j,createRootChatSession:G,refreshActiveChatAgents:Z,refreshCurrentChatBranches:X,showIntentToast:Y,navigate:L,baseHref:V}=_,q=String($||"").trim();if(!q)return!1;try{let B=(await(typeof G==="function"?G:E7)(q))?.branch,N=typeof B?.chat_jid==="string"&&B.chat_jid.trim()?B.chat_jid.trim():null;if(!N)throw Error("Root session creation did not return a chat id.");await Promise.allSettled([Z?.(),X?.()]);let U=B?.agent_name?`@${B.agent_name}`:N;Y?.("Root session created",`Switched to ${U}.`,"info",2500);let D=T1(V,N,{chatOnly:j});return L?.(D),!0}catch(Q){return Y?.("Could not create root session",U4(Q),"warning",5000),!1}}async function hN(_){let{hasWindow:$=typeof window<"u",isWebAppMode:j=!1,path:G,label:Z,showIntentToast:X,resolveSourceTransfer:Y,closeSourcePaneIfTransferred:L,onPaneWindowOpened:V,currentChatJid:q,baseHref:Q}=_;if(!$||j)return!1;let K=typeof G==="string"&&G.trim()?G.trim():"";if(!K)return!1;let B=pG(K);if(!B)return X?.("Could not open pane window","Opening pane windows is unavailable in standalone webapp mode.","warning",5000),!1;let N=M3(B);if(!N)return X?.("Could not open pane window","The browser blocked opening a new tab or window.","warning",5000),!1;w3(N,{title:typeof Z==="string"&&Z.trim()?`Opening ${Z}…`:"Opening pane…",message:"Preparing a standalone pane window. This should only take a moment."});try{let U=await Y?.(K),D=Boolean(U&&Object.keys(U).length>0),H=rG(Q,K,{label:typeof Z==="string"&&Z.trim()?Z.trim():void 0,chatJid:q,params:U});if(T3(N,H),V?.(K,N,U||null),D&&!V)L?.(K);return!0}catch(U){x3(N);let D=U instanceof Error?U.message:"Could not transfer pane state to the new window.";return X?.("Could not open pane window",D,"warning",5000),!1}}async function nN(_){let{hasWindow:$=typeof window<"u",isWebAppMode:j=!1,currentChatJid:G,currentRootChatJid:Z,forkChatBranch:X,getActiveChatAgents:Y,getChatBranches:L,setActiveChatAgents:V,setCurrentChatBranches:q,showIntentToast:Q,baseHref:K}=_;if(!$||j)return!1;let B=nG(G);if(!B)return Q?.("Could not open branch window","Opening branch windows is unavailable in standalone webapp mode.","warning",5000),!1;if(B.mode==="tab"){let U=I3(K,G,{chatOnly:!0});if(!window.open(U,B.target))return Q?.("Could not open branch window","The browser blocked opening a new tab or window.","warning",5000),!1;return!0}let N=M3(B);if(!N)return Q?.("Could not open branch window","The browser blocked opening a new tab or window.","warning",5000),!1;w3(N,{title:"Opening branch…",message:"Preparing a new chat branch. This should only take a moment."});try{let D=(await X(G))?.branch,H=typeof D?.chat_jid==="string"&&D.chat_jid.trim()?D.chat_jid.trim():null;if(!H)throw Error("Branch fork did not return a chat id.");let E=await mN(()=>Y?.());if(E)V?.(Array.isArray(E?.chats)?E.chats:[]);let k=await mN(()=>L?.(Z));if(k)q?.(Array.isArray(k?.chats)?k.chats:[]);let z=T1(K,H,{chatOnly:!0});return T3(N,z),!0}catch(U){return x3(N),Q?.("Could not open branch window",U4(U),"error",5000),!1}}function ik(_){_(($)=>!$)}function ok(_){let{nextChatJid:$,currentChatJid:j,chatOnlyMode:G,navigate:Z,hasWindow:X=typeof window<"u",currentHref:Y=X?window.location.href:"http://localhost/"}=_;return uN({hasWindow:X,nextChatJid:$,currentChatJid:j,chatOnlyMode:G,currentHref:Y,navigate:Z})}function sk(_){let{currentBranchRecord:$,renameBranchInFlight:j,renameBranchLockUntil:G,getFormLock:Z,setRenameBranchNameDraft:X,setIsRenameBranchFormOpen:Y,hasWindow:L=typeof window<"u"}=_;return TN({hasWindow:L,currentBranchRecord:$,renameBranchInFlight:j,renameBranchLockUntil:G,getFormLock:Z,setRenameBranchNameDraft:X,setIsRenameBranchFormOpen:Y})}function ak(_){xN(_)}async function tk(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...G}=_;await IN({hasWindow:$,baseHref:String(j||"").trim()||($?window.location.href:"http://localhost/"),...G})}async function ek(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...G}=_;await CN({hasWindow:$,baseHref:j,...G})}async function _y(_){await fN(_)}async function $y(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...G}=_;await PN({baseHref:j,...G})}function jy(_){let{branchLoaderMode:$,branchLoaderSourceChatJid:j,forkChatBranch:G,setBranchLoaderState:Z,navigate:X,hasWindow:Y=typeof window<"u",baseHref:L=Y?window.location.href:"http://localhost/",runBranchLoaderImpl:V=RN}=_;if(!$||!Y)return;let q=!1;return V({branchLoaderSourceChatJid:j,forkChatBranch:G,setBranchLoaderState:Z,navigate:X,baseHref:L,isCancelled:()=>q}),()=>{q=!0}}async function Gy(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...G}=_;await cN({baseHref:j,...G})}async function Zy(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...G}=_;await lN({baseHref:j,...G})}async function Xy(_){let{isWebAppMode:$,path:j,label:G,showIntentToast:Z,currentChatJid:X,activateTab:Y,tabStripActiveId:L,editorInstanceRef:V,dockInstanceRef:q,terminalTabPath:Q,tabPaneOverrides:K,buildPaneDetachTransfer:B,registerDetachedPaneWindow:N,dockVisible:U,resolveTab:D,closeTab:H,setDockVisible:E,hasWindow:k=typeof window<"u",baseHref:z=k?window.location.href:"http://localhost/"}=_,O=B?.(j)||null;return await hN({hasWindow:k,isWebAppMode:$,path:j,label:G,showIntentToast:Z,currentChatJid:X,baseHref:z,resolveSourceTransfer:async(I)=>{let x=await gN({panePath:I,activateTab:Y,getActiveTabId:()=>__.getActiveId(),tabStripActiveId:L,editorInstanceRef:V,dockInstanceRef:q,terminalTabPath:Q,resolveTab:D,buildEditorPopoutTransfer:(M)=>{if(!M||M===Q)return null;let T=V.current,J=typeof T?.getContent==="function"?T.getContent():void 0,C=typeof T?.isDirty==="function"?T.isDirty():!1,P=K instanceof Map?K.get(M)||null:null,b=__.getViewState(M)||null;return Z6({path:M,content:C?J:void 0,paneOverrideId:P,viewState:b})}}),A=I===Q&&!D(I)?q.current:V.current,y=typeof A?.exportHostTransferState==="function"?A.exportHostTransferState():null,W=y?u8({path:I,payload:y}):null;if(O?.paneInstanceId&&O?.paneWindowId&&A&&I!==Q&&y?.kind!=="terminal")S2({panePath:I,paneInstanceId:O.paneInstanceId,paneWindowId:O.paneWindowId,instance:A,releaseSourceHost:()=>{if(I===Q){if(q.current===A)q.current=null;if(V.current===A)V.current=null;return}if(V.current===A)V.current=null}});return{...x||{},...W||{},...O?.params||{}}},onPaneWindowOpened:N?(I,x,A)=>{N(I,G,x,A)}:void 0,closeSourcePaneIfTransferred:N?void 0:(I)=>{bN({panePath:I,terminalTabPath:Q,dockVisible:U,resolveTab:D,closeTab:H,setDockVisible:E})}})}function Yy(_){let{openEditor:$,popOutPane:j,watchPaneOpenEventsImpl:G=JN}=_;return G({openTab:(Z,X)=>$(Z,X?{label:X}:void 0),editSource:(Z,X)=>$(Z,{...X?{label:X}:{},paneOverrideId:"editor"}),popOutPane:(Z,X)=>{j(Z,X)}})}async function Ly(_){let{hasWindow:$=typeof window<"u",baseHref:j=$?window.location.href:"http://localhost/",...G}=_;await nN({hasWindow:$,baseHref:j,...G})}function qy(_){let{hasWindow:$=typeof window<"u",...j}=_;vN({hasWindow:$,...j})}function rN(_){let{setWorkspaceOpen:$,currentChatJid:j,chatOnlyMode:G,navigate:Z,currentBranchRecord:X,renameBranchInFlightRef:Y,renameBranchLockUntilRef:L,getFormLock:V,setRenameBranchNameDraft:q,setIsRenameBranchFormOpen:Q,setIsRenamingBranch:K,renameChatBranch:B,refreshActiveChatAgents:N,refreshCurrentChatBranches:U,showIntentToast:D,currentChatBranches:H,activeChatAgents:E,pruneChatBranch:k,purgeChatBranch:z,restoreChatBranch:O,branchLoaderMode:I,branchLoaderSourceChatJid:x,forkChatBranch:A,createRootChatSession:y,setBranchLoaderState:W,currentRootChatJid:M,isWebAppMode:T,getActiveChatAgents:J,getChatBranches:C,setActiveChatAgents:P,setCurrentChatBranches:b,openEditor:m,activateTab:h,tabStripActiveId:_0,editorInstanceRef:v,dockInstanceRef:e,terminalTabPath:W0,tabPaneOverrides:G0,buildPaneDetachTransfer:$0,registerDetachedPaneWindow:L0,dockVisible:B0,resolveTab:t,closeTab:V0,setDockVisible:K0,editorOpen:k0,shellElement:s,editorWidthRef:X0,dockHeightRef:D0,sidebarWidthRef:C0,readStoredNumber:g0}=_,p0=R(()=>{ik($)},[$]),j_=R((A0)=>{ok({nextChatJid:A0,currentChatJid:j,chatOnlyMode:G,navigate:Z})},[G,j,Z]),m0=R(()=>{sk({currentBranchRecord:X,renameBranchInFlight:Y.current,renameBranchLockUntil:L.current,getFormLock:V,setRenameBranchNameDraft:q,setIsRenameBranchFormOpen:Q})},[X,V,Y,L,Q,q]),d0=R(()=>{ak({setIsRenameBranchFormOpen:Q,setRenameBranchNameDraft:q})},[Q,q]),u0=R(async(A0)=>{await tk({currentBranchRecord:X,nextName:A0,openRenameForm:m0,renameBranchInFlightRef:Y,renameBranchLockUntilRef:L,getFormLock:V,setIsRenamingBranch:K,renameChatBranch:B,refreshActiveChatAgents:N,refreshCurrentChatBranches:U,navigate:Z,chatOnlyMode:G,showIntentToast:D,closeRenameForm:d0})},[d0,X,G,V,Z,m0,N,U,Y,L,B,K,D]),o0=R(async(A0=null)=>{await ek({targetChatJid:A0,currentChatJid:j,currentBranchRecord:X,currentChatBranches:H,activeChatAgents:E,pruneChatBranch:k,refreshActiveChatAgents:N,refreshCurrentChatBranches:U,showIntentToast:D,chatOnlyMode:G,navigate:Z})},[E,G,X,H,j,Z,k,N,U,D]),v0=R(async(A0)=>{await _y({targetChatJid:A0,purgeChatBranch:z,currentChatBranches:H,refreshActiveChatAgents:N,refreshCurrentChatBranches:U,showIntentToast:D})},[H,z,N,U,D]),a0=R(async(A0)=>{await $y({targetChatJid:A0,restoreChatBranch:O,currentChatBranches:H,refreshActiveChatAgents:N,refreshCurrentChatBranches:U,showIntentToast:D,chatOnlyMode:G,navigate:Z})},[G,H,Z,N,U,O,D]);u(()=>jy({branchLoaderMode:I,branchLoaderSourceChatJid:x,forkChatBranch:A,setBranchLoaderState:W,navigate:Z}),[I,x,A,Z,W]);let n0=R(async()=>{await Gy({currentChatJid:j,chatOnlyMode:G,forkChatBranch:A,refreshActiveChatAgents:N,refreshCurrentChatBranches:U,showIntentToast:D,navigate:Z})},[G,j,A,Z,N,U,D]),N_=R(async(A0)=>{await Zy({rootName:A0,chatOnlyMode:G,createRootChatSession:y,refreshActiveChatAgents:N,refreshCurrentChatBranches:U,showIntentToast:D,navigate:Z})},[G,y,Z,N,U,D]),t0=R(async(A0,L_)=>{return await Xy({isWebAppMode:T,path:A0,label:L_,showIntentToast:D,currentChatJid:j,activateTab:h,tabStripActiveId:_0,editorInstanceRef:v,dockInstanceRef:e,terminalTabPath:W0,tabPaneOverrides:G0,buildPaneDetachTransfer:$0,registerDetachedPaneWindow:L0,dockVisible:B0,resolveTab:t,closeTab:V0,setDockVisible:K0})},[h,$0,V0,j,e,B0,v,T,L0,t,K0,D,G0,_0,W0]);u(()=>Yy({openEditor:m,popOutPane:(A0,L_)=>{t0(A0,L_)}}),[t0,m]);let b0=R(async()=>{await Ly({isWebAppMode:T,currentChatJid:j,currentRootChatJid:M,forkChatBranch:A,getActiveChatAgents:J,getChatBranches:C,setActiveChatAgents:P,setCurrentChatBranches:b,showIntentToast:D})},[j,M,A,J,C,T,P,b,D]);return u(()=>{qy({editorOpen:k0,shellElement:s,editorWidthRef:X0,dockHeightRef:D0,sidebarWidthRef:C0,readStoredNumber:g0})},[D0,k0,X0,g0,s,C0]),{toggleWorkspace:p0,handleBranchPickerChange:j_,openRenameCurrentBranchForm:m0,closeRenameCurrentBranchForm:d0,handleRenameCurrentBranch:u0,handlePruneCurrentBranch:o0,handlePurgeArchivedBranch:v0,handleRestoreBranch:a0,handleCreateSessionFromCompose:n0,handleCreateRootSessionFromCompose:N_,handlePopOutPane:t0,handlePopOutChat:b0}}M0();function G4(_){return _.status==="fulfilled"?_.value:null}function g8(_){return Math.max(0,Math.min(100,_))}function pN(_){let $=Array.isArray(_.timelinePayload?.posts)?_.timelinePayload.posts:Array.isArray(_.rawPosts)?_.rawPosts:[],j=$.length?$[$.length-1]:null,G=$.filter((H)=>H?.data?.is_bot_message).length,Z=$.filter((H)=>!H?.data?.is_bot_message).length,X=Number(_.queuePayload?.count??_.followupQueueItems?.length??0)||0,Y=Array.isArray(_.activeChatsPayload?.chats)?_.activeChatsPayload.chats.length:Array.isArray(_.activeChatAgents)?_.activeChatAgents.length:0,L=Array.isArray(_.branchesPayload?.chats)?_.branchesPayload.chats.length:Array.isArray(_.currentChatBranches)?_.currentChatBranches.length:0,V=Number(_.contextPayload?.percent??_.contextUsage?.percent??0)||0,q=Number(_.contextPayload?.tokens??_.contextUsage?.tokens??0)||0,Q=Number(_.contextPayload?.contextWindow??_.contextUsage?.contextWindow??0)||0,K=_.modelsPayload?.current??_.activeModel??null,B=_.modelsPayload?.thinking_level??_.activeThinkingLevel??null,N=_.modelsPayload?.supports_thinking??_.supportsThinking,U=_.statusPayload?.status||(_.isAgentTurnActive?"active":"idle"),D=_.statusPayload?.data?.type||_.statusPayload?.type||null;return{generatedAt:_.generatedAt,request:_.request,chat:{currentChatJid:_.currentChatJid,rootChatJid:_.currentRootChatJid,activeChats:Y,branches:L},agent:{status:U,phase:D,running:Boolean(_.isAgentTurnActive)},model:{current:K,thinkingLevel:B,supportsThinking:Boolean(N)},context:{tokens:q,contextWindow:Q,percent:V},queue:{count:X},timeline:{loadedPosts:$.length,botPosts:G,userPosts:Z,latestPostId:j?.id??null,latestTimestamp:j?.timestamp??null},bars:[{key:"context",label:"Context",value:g8(Math.round(V))},{key:"queue",label:"Queue",value:g8(X*18)},{key:"activeChats",label:"Active chats",value:g8(Y*12)},{key:"posts",label:"Timeline load",value:g8($.length*5)}]}}function dN(_){if(_==="followup")return{title:"Widget submission queued",detail:"The widget message was queued because the agent is busy.",kind:"info",durationMs:3500};return{title:"Widget submission sent",detail:"The widget message was sent to the chat.",kind:"info",durationMs:3500}}function iN(_){return{title:"Widget submission failed",detail:_||"Could not send the widget message.",kind:"warning",durationMs:5000}}function oN(_,$){return{shouldBuildDashboard:_?.buildDashboard!==!1,nextRefreshCount:Number($||0)+1}}function sN(){return{title:"Dashboard built",detail:"Live dashboard state pushed into the widget.",kind:"info",durationMs:3000}}function aN(_){return{title:"Dashboard build failed",detail:_||"Could not build dashboard.",kind:"warning",durationMs:5000}}function tN(){return{title:"Widget refresh requested",detail:"The widget received a host acknowledgement update.",kind:"info",durationMs:3000}}async function eN(_){let{requestPayload:$=null,currentChatJid:j,currentRootChatJid:G,getAgentStatus:Z,getAgentContext:X,getAgentQueueState:Y,getAgentModels:L,getActiveChatAgents:V,getChatBranches:q,getTimeline:Q,rawPosts:K,activeChatAgents:B,currentChatBranches:N,contextUsage:U,followupQueueItems:D,activeModel:H,activeThinkingLevel:E,supportsThinking:k,isAgentTurnActive:z}=_,[O,I,x,A,y,W,M]=await Promise.allSettled([Z(j),X(j),Y(j),L(j),V(),q(G),Q(20,null,j)]);return pN({generatedAt:new Date().toISOString(),request:$,currentChatJid:j,currentRootChatJid:G,statusPayload:G4(O),contextPayload:G4(I),queuePayload:G4(x),modelsPayload:G4(A),activeChatsPayload:G4(y),branchesPayload:G4(W),timelinePayload:G4(M),rawPosts:K,activeChatAgents:B,currentChatBranches:N,contextUsage:U,followupQueueItems:D,activeModel:H,activeThinkingLevel:E,supportsThinking:k,isAgentTurnActive:z})}function _B(_){let{queuedItem:$,followupQueueItemsRef:j,dismissedQueueRowIdsRef:G,currentChatJid:Z,refreshQueueState:X,setFollowupQueueItems:Y,showIntentToast:L,steerAgentQueueItem:V}=_,q=R2(j.current,$);if(!q)return;let{rowId:Q}=q;G.current.add(Q),Y((K)=>$4(K,Q).items),V(Q,Bj(Z)).then(()=>{X()}).catch((K)=>{console.warn("[queue] Failed to steer queued item:",K);let B=yj("steer");L(B.title,B.detail,"warning"),G.current.delete(Q),X()})}function $B(_){let{queuedItem:$,followupQueueItemsRef:j,dismissedQueueRowIdsRef:G,currentChatJid:Z,refreshQueueState:X,setFollowupQueueItems:Y,showIntentToast:L,clearQueuedSteerStateIfStale:V,removeAgentQueueItem:q}=_,Q=R2(j.current,$);if(!Q)return;let{rowId:K}=Q;G.current.add(K),V?.(Q.remainingQueueCount),Y((B)=>$4(B,K).items),q(K,Bj(Z)).then(()=>{X()}).catch((B)=>{console.warn("[queue] Failed to remove queued item:",B);let N=yj("remove");L(N.title,N.detail,"warning"),G.current.delete(K),X()})}function jB(_){let{widget:$,dismissedLiveWidgetKeysRef:j,setFloatingWidget:G}=_;if(!$||typeof $!=="object")return;let Z=B1($);if(Z)j.current.delete(Z);G(pQ($,new Date().toISOString()))}function GB(_){let{dismissedLiveWidgetKeysRef:$,setFloatingWidget:j}=_;j((G)=>{let Z=dQ(G);if(Z.dismissedSessionKey)$.current.add(Z.dismissedSessionKey);return Z.nextWidget})}function ZB(_){let{event:$,widget:j,currentChatJid:G,isComposeBoxAgentActive:Z,setFloatingWidget:X,handleCloseFloatingWidget:Y,handleMessageResponse:L,showIntentToast:V,sendAgentMessage:q,buildFloatingWidgetDashboardSnapshot:Q}=_,K=typeof $?.kind==="string"?$.kind:"",B=B1(j);if(!K||!B)return;if(K==="widget.close"){Y();return}if(K==="widget.submit"){let N=oL($?.payload),U=sL($?.payload),D=new Date().toISOString();if(X((H)=>sQ(H,B,{kind:K,payload:$?.payload||null,submittedAt:D,submissionText:N})),!N){if(V("Widget submission received","The widget submitted data without a message payload yet.","info",3500),U)Y();return}(async()=>{try{let H=await q("default",N,null,[],Z?"queue":null,G);L(H),X((k)=>kj(k,B,{submittedAt:D,submissionText:N,queued:H?.queued||null}));let E=dN(H?.queued);if(V(E.title,E.detail,E.kind,E.durationMs),U)Y()}catch(H){X((k)=>kj(k,B,{submittedAt:D,submissionText:N,errorMessage:H?.message||"Could not send the widget message."}));let E=iN(H?.message);V(E.title,E.detail,E.kind,E.durationMs)}})();return}if(K==="widget.ready"||K==="widget.request_refresh"){let N=new Date().toISOString(),U=oN($?.payload||null,j?.runtimeState?.refreshCount);if(X((D)=>aQ(D,B,{kind:K,payload:$?.payload||null,eventAt:N,nextRefreshCount:U.nextRefreshCount,shouldBuildDashboard:U.shouldBuildDashboard})),K==="widget.request_refresh")if(U.shouldBuildDashboard)(async()=>{try{let D=await Q($?.payload||null);X((E)=>tQ(E,B,{dashboard:D,at:new Date().toISOString(),count:U.nextRefreshCount,echo:$?.payload||null}));let H=sN();V(H.title,H.detail,H.kind,H.durationMs)}catch(D){X((E)=>eQ(E,B,{errorMessage:D?.message||"Could not build dashboard.",at:new Date().toISOString(),count:U.nextRefreshCount}));let H=aN(D?.message);V(H.title,H.detail,H.kind,H.durationMs)}})();else{let D=tN();V(D.title,D.detail,D.kind,D.durationMs)}}}function Vy(_,$=_B){$(_)}function Ky(_,$=$B){$(_)}function Qy(_,$,j=lQ){j({response:_,refreshActiveChatAgents:$.refreshActiveChatAgents,refreshCurrentChatBranches:$.refreshCurrentChatBranches,refreshContextUsage:$.refreshContextUsage,refreshAutoresearchStatus:$.refreshAutoresearchStatus,refreshQueueState:$.refreshQueueState})}function XB(_){let{currentChatJid:$,followupQueueItemsRef:j,dismissedQueueRowIdsRef:G,refreshQueueState:Z,setFollowupQueueItems:X,showIntentToast:Y,clearQueuedSteerStateIfStale:L,steerAgentQueueItem:V,removeAgentQueueItem:q,refreshActiveChatAgents:Q,refreshCurrentChatBranches:K,refreshContextUsage:B,refreshAutoresearchStatus:N}=_,U=R((k)=>{Vy({queuedItem:k,followupQueueItemsRef:j,dismissedQueueRowIdsRef:G,currentChatJid:$,refreshQueueState:Z,setFollowupQueueItems:X,showIntentToast:Y,steerAgentQueueItem:V,removeAgentQueueItem:q})},[$,G,j,Z,q,X,Y,V]),D=R((k)=>{Ky({queuedItem:k,followupQueueItemsRef:j,dismissedQueueRowIdsRef:G,currentChatJid:$,refreshQueueState:Z,setFollowupQueueItems:X,showIntentToast:Y,clearQueuedSteerStateIfStale:L,steerAgentQueueItem:V,removeAgentQueueItem:q})},[L,$,G,j,Z,q,X,Y,V]),H=R(async(k,z)=>{X((O)=>{if(!Array.isArray(O)||k<0||z<0||k>=O.length||z>=O.length||k===z)return O;let I=[...O],[x]=I.splice(k,1);return I.splice(z,0,x),I});try{let{reorderAgentQueueItem:O}=await Promise.resolve().then(() => (I_(),N5));await O(k,z,$)}catch(O){console.warn("Failed to persist queue reorder:",O),Z()}},[$,Z,X]),E=R((k)=>{Qy(k,{refreshActiveChatAgents:Q,refreshCurrentChatBranches:K,refreshContextUsage:B,refreshAutoresearchStatus:N,refreshQueueState:Z})},[Q,N,B,K,Z]);return{handleInjectQueuedFollowup:U,handleRemoveQueuedFollowup:D,handleMoveQueuedFollowup:H,handleMessageResponse:E}}M0();function YB(_){let{btwAbortRef:$,setBtwSession:j}=_;if($.current)$.current.abort(),$.current=null;j(null)}async function LB(_){let{question:$,currentChatJid:j,streamSidePrompt:G,resolveBtwChatJid:Z,showIntentToast:X,btwAbortRef:Y,setBtwSession:L}=_,V=String($||"").trim();if(!V)return X("BTW needs a question","Usage: /btw <question>","warning"),!0;if(Y.current)Y.current.abort();let q=new AbortController;Y.current=q,L({question:V,answer:"",thinking:"",error:null,model:null,status:"running"});try{let Q=await G(V,{signal:q.signal,chatJid:Z(j),systemPrompt:"Answer the user briefly and directly. This is a side conversation that should not affect the main chat until explicitly injected.",onEvent:(K)=>{if(K==="side_prompt_start")L((B)=>B?{...B,status:"running"}:B)},onThinkingDelta:(K)=>{L((B)=>B?{...B,thinking:`${B.thinking||""}${K||""}`}:B)},onTextDelta:(K)=>{L((B)=>B?{...B,answer:`${B.answer||""}${K||""}`}:B)}});if(Y.current!==q)return!0;L((K)=>K?{...K,answer:Q?.result||K.answer||"",thinking:Q?.thinking||K.thinking||"",model:Q?.model||null,status:"success",error:null}:K)}catch(Q){if(q.signal.aborted)return!0;L((K)=>K?{...K,status:"error",error:Q?.payload?.error||Q?.message||"BTW request failed."}:K)}finally{if(Y.current===q)Y.current=null}return!0}async function qB(_){let{content:$,parseBtwCommand:j,closeBtwPanel:G,runBtwPrompt:Z,showIntentToast:X}=_,Y=j($);if(!Y)return!1;if(Y.type==="help")return X("BTW usage","Use /btw <question> to open a side conversation.","info",4000),!0;if(Y.type==="clear")return G(),X("BTW cleared","Closed the side conversation panel.","info"),!0;if(Y.type==="ask")return await Z(Y.question),!0;return!1}async function VB(_){let{btwSession:$,buildBtwInjectionText:j,isComposeBoxAgentActive:G,currentChatJid:Z,sendAgentMessage:X,handleMessageResponse:Y,showIntentToast:L}=_,V=j($);if(!V)return!1;try{let q=await X("default",V,null,[],G?"queue":null,Z);return Y(q),L(q?.queued==="followup"?"BTW queued":"BTW injected",q?.queued==="followup"?"The BTW summary was queued as a follow-up because the agent is busy.":"The BTW summary was sent to the main chat.","info",3500),!0}catch(q){return L("BTW inject failed",q?.message||"Could not inject BTW answer into chat.","warning"),!1}}async function Ny(_){let $=typeof _==="string"?_:"";if(!$)return!1;let j=null;if(navigator.clipboard?.writeText)try{return await navigator.clipboard.writeText($),!0}catch(G){j=G}try{let G=document.createElement("textarea");G.value=$,G.setAttribute("readonly",""),G.style.position="fixed",G.style.opacity="0",G.style.pointerEvents="none",document.body.appendChild(G),G.select(),G.setSelectionRange(0,G.value.length);let Z=document.execCommand("copy");return document.body.removeChild(G),Z}catch(G){return console.debug("[sidepanel] Clipboard copy failed after falling back from navigator.clipboard.",G,{clipboardApiAvailable:Boolean(navigator.clipboard?.writeText),clipboardApiError:j}),!1}}function By(_){let{dismissedLiveWidgetKeysRef:$,setFloatingWidget:j}=_;$.current.clear(),j(null)}function KB(_){let{currentChatJid:$,currentRootChatJid:j,isComposeBoxAgentActive:G,showIntentToast:Z,setPendingExtensionPanelActions:X,refreshAutoresearchStatus:Y,stopAutoresearch:L,dismissAutoresearch:V,streamSidePrompt:q,btwAbortRef:Q,btwSession:K,setBtwSession:B,sendAgentMessage:N,handleMessageResponse:U,dismissedLiveWidgetKeysRef:D,setFloatingWidget:H,getAgentStatus:E,getAgentContext:k,getAgentQueueState:z,getAgentModels:O,getActiveChatAgents:I,getChatBranches:x,getTimeline:A,rawPosts:y,activeChatAgents:W,currentChatBranches:M,contextUsage:T,followupQueueItemsRef:J,activeModel:C,activeThinkingLevel:P,supportsThinking:b,isAgentTurnActive:m}=_,h=R(async(V0,K0)=>{let k0=typeof V0?.key==="string"?V0.key:"",s=typeof K0?.key==="string"?K0.key:"",X0=zj(k0,s);if(!k0||!s)return;X((D0)=>KQ(D0,k0,s));try{let D0=await NQ({panel:V0,action:K0,currentChatJid:$,stopAutoresearch:L,dismissAutoresearch:V,writeClipboard:async(C0)=>{if(!await Ny(C0))throw Error("Clipboard access is unavailable.")}});if(D0.refreshAutoresearchStatus)Y();if(D0.toast)Z(D0.toast.title,D0.toast.detail,D0.toast.kind,D0.toast.durationMs)}catch(D0){Z("Panel action failed",D0?.message||"Could not complete that action.","warning")}finally{X((D0)=>QQ(D0,X0))}},[$,V,Y,X,Z,L]),_0=R(()=>{YB({btwAbortRef:Q,setBtwSession:B})},[Q,B]),v=R(async(V0)=>{return await LB({question:V0,currentChatJid:$,streamSidePrompt:q,resolveBtwChatJid:gL,showIntentToast:Z,btwAbortRef:Q,setBtwSession:B})},[Q,$,B,Z,q]),e=R(async({content:V0})=>{return await qB({content:V0,parseBtwCommand:uL,closeBtwPanel:_0,runBtwPrompt:v,showIntentToast:Z})},[_0,v,Z]),W0=R(()=>{if(K?.question)v(K.question)},[K,v]),G0=R(async()=>{await VB({btwSession:K,buildBtwInjectionText:mL,isComposeBoxAgentActive:G,currentChatJid:$,sendAgentMessage:N,handleMessageResponse:U,showIntentToast:Z})},[K,$,U,G,N,Z]),$0=R(async(V0=null)=>{return eN({requestPayload:V0,currentChatJid:$,currentRootChatJid:j,getAgentStatus:E,getAgentContext:k,getAgentQueueState:z,getAgentModels:O,getActiveChatAgents:I,getChatBranches:x,getTimeline:A,rawPosts:y,activeChatAgents:W,currentChatBranches:M,contextUsage:T,followupQueueItems:J.current,activeModel:C,activeThinkingLevel:P,supportsThinking:b,isAgentTurnActive:m})},[W,C,P,T,M,$,j,J,I,k,O,z,E,x,A,m,y,b]),L0=R((V0)=>{jB({widget:V0,dismissedLiveWidgetKeysRef:D,setFloatingWidget:H})},[D,H]),B0=R(()=>{GB({dismissedLiveWidgetKeysRef:D,setFloatingWidget:H})},[D,H]),t=R((V0,K0)=>{ZB({event:V0,widget:K0,currentChatJid:$,isComposeBoxAgentActive:G,setFloatingWidget:H,handleCloseFloatingWidget:B0,handleMessageResponse:U,showIntentToast:Z,sendAgentMessage:N,buildFloatingWidgetDashboardSnapshot:$0})},[$0,$,B0,U,G,N,H,Z]);return u(()=>{By({dismissedLiveWidgetKeysRef:D,setFloatingWidget:H})},[$,D,H]),{handleExtensionPanelAction:h,closeBtwPanel:_0,handleBtwIntercept:e,handleBtwRetry:W0,handleBtwInject:G0,handleOpenFloatingWidget:L0,handleCloseFloatingWidget:B0,handleFloatingWidgetEvent:t}}M0();function Fy(_){let{hasDockPanes:$,chatOnlyMode:j}=_;return Boolean($&&!j)}function Uy(_){return!_}function QB(_){let{hasDockPanes:$,chatOnlyMode:j,toggleDock:G,toggleZenMode:Z,exitZenMode:X,zenMode:Y,previousChat:L,nextChat:V}=_;u(()=>{if(!Fy({hasDockPanes:$,chatOnlyMode:j}))return;return AN(G)},[j,$,G]),u(()=>{if(!Uy(j))return;return kN({toggleZenMode:Z,exitZenMode:X,zenMode:Y,isZenModeActive:()=>Y})},[j,X,Z,Y]),u(()=>{if(typeof L!=="function"&&typeof V!=="function")return;return yN({previousChat:L,nextChat:V})},[V,L]),u(()=>wN(),[]),u(()=>MN(),[])}function Ey(_){return Boolean(_&&typeof _.closest==="function")}function NB(_=typeof window<"u"?window:null){if(!_||typeof _.getSelection!=="function")return!1;try{let $=_.getSelection();if(!$||$.isCollapsed)return!1;return String($.toString()||"").trim().length>0}catch{return!1}}function Hy(){return{active:!1,horizontalLocked:!1,cancelled:!1,startX:0,startY:0,lastX:0,lastY:0,startedAt:0}}function Dy(){return{lastTriggeredAt:0,accumX:0}}function Tj(_){if(!_)return;_.active=!1,_.horizontalLocked=!1,_.cancelled=!1,_.startX=0,_.startY=0,_.lastX=0,_.lastY=0,_.startedAt=0}var Wy=["input","textarea","select","button","label","a[href]",'[contenteditable="true"]','[role="button"]',"[data-no-chat-swipe]",".compose-box",".compose-model-popup",".compose-session-popup",".workspace-explorer",".editor-pane-container",".dock-panel",".terminal-pane-content",".attachment-preview-modal",".rename-branch-overlay",".agent-request-modal",".adaptive-card-container",".adaptive-card-container input",".adaptive-card-container textarea",".adaptive-card-container select",".adaptive-card-container button"].join(", "),Oy=[".agent-thinking",".agent-status-panel",".agent-thinking-intent"].join(", ");function BB(_){if(!_||!Ey(_))return!1;let $=_.closest(Wy);if(!$)return!0;return Boolean($.closest(Oy))}function UB(_,$){if(!Array.isArray(_))return $?[$]:[];let j=new Set,G=_.filter((X)=>Boolean(X&&typeof X==="object")).filter((X)=>{let Y=typeof X.chat_jid==="string"?X.chat_jid.trim():"";if(!Y||j.has(Y))return!1;if(X.archived_at)return!1;return j.add(Y),!0});G.sort((X,Y)=>{if(Boolean(X.is_active)!==Boolean(Y.is_active))return X.is_active?-1:1;return String(X.chat_jid).localeCompare(String(Y.chat_jid))});let Z=G.map((X)=>String(X.chat_jid).trim());if($&&!j.has($))Z.unshift($);return Z}function xj(_){let $=UB(_.candidates,_.currentChatJid);if($.length<=1)return null;let j=$.indexOf(_.currentChatJid);if(j<0)return $[0]??null;let G=_.direction==="next"?(j+1)%$.length:(j-1+$.length)%$.length;return $[G]??null}function FB(_,$){let j=_.find((Z)=>Z.chat_jid===$);if(!j)return $.replace(/^[^:]+:/,"");return(typeof j.agent_name==="string"?j.agent_name.trim():"")||$.replace(/^[^:]+:/,"")}function zy(_){let $=UB(_.candidates,_.currentChatJid);if($.length<=1)return{prev:null,next:null};let j=$.indexOf(_.currentChatJid);if(j<0)return{prev:null,next:null};let G=$[(j-1+$.length)%$.length],Z=$[(j+1)%$.length];return{prev:{chatJid:G,name:FB(_.candidates,G)},next:{chatJid:Z,name:FB(_.candidates,Z)}}}function Jy(_){let $=Number.isFinite(_.minDistancePx)?Number(_.minDistancePx):72,j=Number.isFinite(_.axisRatio)?Number(_.axisRatio):1.35;return Math.abs(_.dx)>=$&&Math.abs(_.dx)>Math.abs(_.dy)*j}function Ay(_){let $=document.querySelector(".chat-swipe-indicator");if(!$)$=document.createElement("div"),$.className="chat-swipe-indicator",$.innerHTML='<span class="chat-swipe-chevron"></span><span class="chat-swipe-name"></span>',document.body.appendChild($);return $}function ky(_,$,j,G){let Z=Math.abs($),X=Math.min(Z/100,1),Y=Z>=72;_.style.display="flex",_.style.opacity=String(Math.min(X*2.5,1)),_.classList.toggle("chat-swipe-indicator--ready",Y);let L=$<0,V=L?G.next:G.prev,q=_.querySelector(".chat-swipe-chevron");if(q)q.textContent=L?"›":"‹",q.style.order=L?"2":"0";let Q=_.querySelector(".chat-swipe-name");if(Q)Q.textContent=V?.name??""}function R5(_){_.style.display="none",_.style.opacity="0"}function EB(_){let{timelineRef:$,activeChatAgents:j,currentChatJid:G,onSwitch:Z,isIOSDevice:X,isLikelySafari:Y}=_,L=$.current;if(!L)return()=>{};let V=X(),q=typeof Y==="function"?Y():!1;if(!V&&!q)return()=>{};let Q=Hy(),K=Dy(),B=null,N={prev:null,next:null},U=!1;function D(){N=zy({candidates:j,currentChatJid:G})}D();function H(){if(!B)B=Ay(L);return B}function E(y){let W=y==="next"?N.next:N.prev;if(W)Z(W.chatJid)}function k(y){U=String(y.pointerType||"").toLowerCase()==="pen"}function z(y){if(Tj(Q),D(),!V)return;if(y.touches.length!==1)return;if(U)return;if(NB())return;if(!BB(y.target))return;let W=y.touches[0];Q.active=!0,Q.startX=W.clientX,Q.startY=W.clientY,Q.lastX=W.clientX,Q.lastY=W.clientY,Q.startedAt=Date.now()}function O(y){if(!Q.active||Q.cancelled)return;if(NB()){Q.cancelled=!0,R5(H());return}let W=y.touches[0];if(!W)return;Q.lastX=W.clientX,Q.lastY=W.clientY;let M=Q.lastX-Q.startX,T=Q.lastY-Q.startY;if(!Q.horizontalLocked){if(Math.abs(T)>16&&Math.abs(T)>=Math.abs(M)){Q.cancelled=!0,R5(H());return}if(Math.abs(M)>12&&Math.abs(M)>Math.abs(T)*1.15)Q.horizontalLocked=!0}if(Q.horizontalLocked){if(y.cancelable)y.preventDefault();ky(H(),M,L.clientWidth,N)}}function I(){if(!Q.active)return;let y=Q.lastX-Q.startX,W=Q.lastY-Q.startY,M=!Q.cancelled&&Jy({dx:y,dy:W});if(R5(H()),Tj(Q),M)E(y<0?"next":"prev")}function x(){R5(H()),Tj(Q)}function A(y){if(V)return;if(!q)return;if(!BB(y.target))return;let{deltaX:W,deltaY:M}=y;if(!Number.isFinite(W)||Math.abs(W)<72)return;if(Math.abs(W)<=Math.abs(M)*1.35)return;if(y.cancelable)y.preventDefault();let T=Date.now();if(T-K.lastTriggeredAt<450)return;K.lastTriggeredAt=T,E(W>0?"next":"prev")}return L.addEventListener("pointerdown",k,{passive:!0}),L.addEventListener("touchstart",z,{passive:!0}),L.addEventListener("touchmove",O,{passive:!1}),L.addEventListener("touchend",I,{passive:!0}),L.addEventListener("touchcancel",x,{passive:!0}),L.addEventListener("wheel",A,{passive:!1}),()=>{if(L.removeEventListener("pointerdown",k),L.removeEventListener("touchstart",z),L.removeEventListener("touchmove",O),L.removeEventListener("touchend",I),L.removeEventListener("touchcancel",x),L.removeEventListener("wheel",A),B)R5(B),B.remove(),B=null}}function yy(_){return{currentChatJid:_.currentChatJid,followupQueueItemsRef:_.followupQueueItemsRef,dismissedQueueRowIdsRef:_.dismissedQueueRowIdsRef,refreshQueueState:_.refreshQueueState,setFollowupQueueItems:_.setFollowupQueueItems,showIntentToast:_.showIntentToast,clearQueuedSteerStateIfStale:_.clearQueuedSteerStateIfStale,steerAgentQueueItem:_.steerAgentQueueItem,removeAgentQueueItem:_.removeAgentQueueItem,refreshActiveChatAgents:_.refreshActiveChatAgents,refreshCurrentChatBranches:_.refreshCurrentChatBranches,refreshContextUsage:_.refreshContextUsage,refreshAutoresearchStatus:_.refreshAutoresearchStatus}}function My(_){return{currentChatJid:_.currentChatJid,currentRootChatJid:_.currentRootChatJid,isComposeBoxAgentActive:_.isComposeBoxAgentActive,showIntentToast:_.showIntentToast,setPendingExtensionPanelActions:_.setPendingExtensionPanelActions,refreshAutoresearchStatus:_.refreshAutoresearchStatus,stopAutoresearch:_.stopAutoresearch,dismissAutoresearch:_.dismissAutoresearch,streamSidePrompt:_.streamSidePrompt,btwAbortRef:_.btwAbortRef,btwSession:_.btwSession,setBtwSession:_.setBtwSession,sendAgentMessage:_.sendAgentMessage,handleMessageResponse:_.handleMessageResponse,dismissedLiveWidgetKeysRef:_.dismissedLiveWidgetKeysRef,setFloatingWidget:_.setFloatingWidget,getAgentStatus:_.getAgentStatus,getAgentContext:_.getAgentContext,getAgentQueueState:_.getAgentQueueState,getAgentModels:_.getAgentModels,getActiveChatAgents:_.getActiveChatAgents,getChatBranches:_.getChatBranches,getTimeline:_.getTimeline,rawPosts:_.rawPosts,activeChatAgents:_.activeChatAgents,currentChatBranches:_.currentChatBranches,contextUsage:_.contextUsage,followupQueueItemsRef:_.followupQueueItemsRef,activeModel:_.activeModel,activeThinkingLevel:_.activeThinkingLevel,supportsThinking:_.supportsThinking,isAgentTurnActive:_.isAgentTurnActive}}function wy(_){return{setWorkspaceOpen:_.setWorkspaceOpen,currentChatJid:_.currentChatJid,chatOnlyMode:_.chatOnlyMode,navigate:_.navigate,currentBranchRecord:_.currentBranchRecord,renameBranchInFlightRef:_.renameBranchInFlightRef,renameBranchLockUntilRef:_.renameBranchLockUntilRef,getFormLock:_.getFormLock,setRenameBranchNameDraft:_.setRenameBranchNameDraft,setIsRenameBranchFormOpen:_.setIsRenameBranchFormOpen,setIsRenamingBranch:_.setIsRenamingBranch,renameChatBranch:_.renameChatBranch,refreshActiveChatAgents:_.refreshActiveChatAgents,refreshCurrentChatBranches:_.refreshCurrentChatBranches,showIntentToast:_.showIntentToast,currentChatBranches:_.currentChatBranches,activeChatAgents:_.activeChatAgents,pruneChatBranch:_.pruneChatBranch,purgeChatBranch:_.purgeChatBranch,restoreChatBranch:_.restoreChatBranch,branchLoaderMode:_.branchLoaderMode,branchLoaderSourceChatJid:_.branchLoaderSourceChatJid,forkChatBranch:_.forkChatBranch,createRootChatSession:_.createRootChatSession,setBranchLoaderState:_.setBranchLoaderState,currentRootChatJid:_.currentRootChatJid,isWebAppMode:_.isWebAppMode,getActiveChatAgents:_.getActiveChatAgents,getChatBranches:_.getChatBranches,setActiveChatAgents:_.setActiveChatAgents,setCurrentChatBranches:_.setCurrentChatBranches,openEditor:_.openEditor,activateTab:_.activateTab,tabStripActiveId:_.tabStripActiveId,editorInstanceRef:_.editorInstanceRef,dockInstanceRef:_.dockInstanceRef,terminalTabPath:_.terminalTabPath,tabPaneOverrides:_.tabPaneOverrides,buildPaneDetachTransfer:_.buildPaneDetachTransfer,registerDetachedPaneWindow:_.registerDetachedPaneWindow,dockVisible:_.dockVisible,resolveTab:_.resolveTab,closeTab:_.closeTab,setDockVisible:_.setDockVisible,editorOpen:_.editorOpen,shellElement:_.shellElement,editorWidthRef:_.editorWidthRef,dockHeightRef:_.dockHeightRef,sidebarWidthRef:_.sidebarWidthRef,readStoredNumber:_.readStoredNumber}}function Ty(_){return{hasDockPanes:_.hasDockPanes,chatOnlyMode:_.chatOnlyMode,toggleDock:_.toggleDock,toggleZenMode:_.toggleZenMode,exitZenMode:_.exitZenMode,zenMode:_.zenMode,previousChat:()=>{let $=xj({candidates:_.activeChatAgents,currentChatJid:_.currentChatJid,direction:"prev"});if($)_.handleBranchPickerChange?.($)},nextChat:()=>{let $=xj({candidates:_.activeChatAgents,currentChatJid:_.currentChatJid,direction:"next"});if($)_.handleBranchPickerChange?.($)}}}function HB(_){let $=XB(yy(_)),j=KB(My({..._,handleMessageResponse:$.handleMessageResponse})),G=rN(wy(_));return QB(Ty({..._,handleBranchPickerChange:G.handleBranchPickerChange})),{followupActions:$,sidepanelActions:j,branchPaneActions:G}}function xy(_,$){return Boolean(_||$!==null)}function Iy(_){return{..._.agentStatusLifecycleBundle,..._.actionBundle,timelineViewActions:_.timelineViewActions,isComposeBoxAgentActive:_.isComposeBoxAgentActive}}function Cy(_,$){let{routeState:j,searchState:G,shellState:Z,timeline:X,interaction:Y,paneRuntime:L,refs:V,setters:q,services:Q,helpers:K}=_;return{currentChatJid:j.currentChatJid,activeChatJidRef:V.activeChatJidRef,queueRefreshGenRef:V.queueRefreshGenRef,dismissedQueueRowIdsRef:V.dismissedQueueRowIdsRef,getAgentQueueState:Q.getAgentQueueState,setFollowupQueueItems:q.setFollowupQueueItems,clearQueuedSteerStateIfStale:Y.clearQueuedSteerStateIfStale,getAgentContext:Q.getAgentContext,setContextUsage:q.setContextUsage,getAutoresearchStatus:Q.getAutoresearchStatus,setExtensionStatusPanels:q.setExtensionStatusPanels,setPendingExtensionPanelActions:q.setPendingExtensionPanelActions,setExtensionWorkingState:q.setExtensionWorkingState,getAgentStatus:Q.getAgentStatus,wasAgentActiveRef:V.wasAgentActiveRef,viewStateRef:V.viewStateRef,refreshTimeline:X.refreshTimeline,clearAgentRunState:Y.clearAgentRunState,agentStatusRef:V.agentStatusRef,pendingRequestRef:V.pendingRequestRef,thoughtBufferRef:V.thoughtBufferRef,draftBufferRef:V.draftBufferRef,previewResyncPendingRef:V.previewResyncPendingRef,previewResyncGenerationRef:V.previewResyncGenerationRef,setAgentStatus:q.setAgentStatus,setAgentDraft:q.setAgentDraft,setAgentPlan:q.setAgentPlan,setAgentThought:q.setAgentThought,setPendingRequest:q.setPendingRequest,setActiveTurn:Y.setActiveTurn,noteAgentActivity:Y.noteAgentActivity,showLastActivity:Y.showLastActivity,clearLastActivityFlag:Y.clearLastActivityFlag,isAgentRunningRef:V.isAgentRunningRef,currentTurnIdRef:V.currentTurnIdRef,silentRecoveryRef:V.silentRecoveryRef,silenceRefreshMs:Q.silenceRefreshMs,lastAgentEventRef:V.lastAgentEventRef,lastSilenceNoticeRef:V.lastSilenceNoticeRef,silenceWarningMs:Q.silenceWarningMs,silenceFinalizeMs:Q.silenceFinalizeMs,isCompactionStatus:Q.isCompactionStatus,serverVersionContext:{currentAppAssetVersion:Q.currentAppAssetVersion,staleUiVersionRef:V.staleUiVersionRef,staleUiReloadScheduledRef:V.staleUiReloadScheduledRef,tabStoreHasUnsaved:Q.tabStoreHasUnsaved,isAgentRunningRef:V.isAgentRunningRef,pendingRequestRef:V.pendingRequestRef,showIntentToast:$},setConnectionStatus:q.setConnectionStatus,setStateAccessFailed:q.setStateAccessFailed,hasConnectedOnceRef:V.hasConnectedOnceRef,getAgents:Q.getAgents,setAgents:q.setAgents,setUserProfile:q.setUserProfile,applyBranding:Y.applyBranding,readStoredNumber:K.readStoredNumber,sidebarWidthRef:V.sidebarWidthRef,appShellRef:V.appShellRef,currentRootChatJid:j.currentRootChatJid,getAgentModels:Q.getAgentModels,getActiveChatAgents:Q.getActiveChatAgents,getChatBranches:Q.getChatBranches,setActiveChatAgents:q.setActiveChatAgents,setCurrentChatBranches:q.setCurrentChatBranches,setActiveModel:q.setActiveModel,setActiveThinkingLevel:q.setActiveThinkingLevel,setSupportsThinking:q.setSupportsThinking,setActiveModelUsage:q.setActiveModelUsage,setAgentModelsPayload:q.setAgentModelsPayload,setHasLoadedAgentModels:q.setHasLoadedAgentModels,agentsRef:V.agentsRef,currentHashtag:G.currentHashtag,searchQuery:G.searchQuery,searchScope:G.searchScope,loadPosts:X.loadPosts,searchPosts:Q.searchPosts,setPosts:X.setPosts,setHasMore:X.setHasMore,scrollToBottom:X.scrollToBottom,paneStateOwnerChatJidRef:V.paneStateOwnerChatJidRef,chatPaneStateByChatRef:V.chatPaneStateByChatRef,snapshotCurrentChatPaneState:Y.snapshotCurrentChatPaneState,restoreChatPaneState:Y.restoreChatPaneState,setFloatingWidget:q.setFloatingWidget,dismissedLiveWidgetKeysRef:V.dismissedLiveWidgetKeysRef,posts:X.posts,scrollToMessage:Y.composeReferenceActions.scrollToMessage,draftThrottleRef:V.draftThrottleRef,thoughtThrottleRef:V.thoughtThrottleRef,followupQueueItemsRef:V.followupQueueItemsRef,scrollToBottomRef:X.scrollToBottomRef,hasMoreRef:X.hasMoreRef,loadMoreRef:X.loadMoreRef,lastAgentResponseRef:V.lastAgentResponseRef,notifyForFinalResponse:Y.notifyForFinalResponse,setSteerQueuedTurnId:q.setSteerQueuedTurnId,refreshActiveEditorFromWorkspace:L.refreshActiveEditorFromWorkspace,showIntentToast:$,removeStalledPost:Y.recoveryCallbacks.removeStalledPost,preserveTimelineScrollTop:X.preserveTimelineScrollTop,finalizeStalledResponse:()=>{q.setExtensionWorkingState({message:null,indicator:null,visible:!0}),Y.recoveryCallbacks.finalizeStalledResponse()},connectionStatus:Z.connectionStatus,agentStatus:Q.agentStatus,thoughtExpandedRef:V.thoughtExpandedRef,draftExpandedRef:V.draftExpandedRef,steerQueuedTurnIdRef:V.steerQueuedTurnIdRef}}function DB(_){let{routeState:$,searchState:j,shellState:G,timeline:Z,interaction:X,paneRuntime:Y,refs:L,setters:V,services:q,helpers:Q}=_,K=X.composeReferenceActions.showIntentToast,B=YQ({currentHashtag:j.currentHashtag,searchQuery:j.searchQuery,searchOpen:j.searchOpen,searchScope:j.searchScope,currentChatJid:$.currentChatJid,currentRootChatJid:$.currentRootChatJid,posts:Z.posts,loadPosts:Z.loadPosts,searchPosts:q.searchPosts,setCurrentHashtag:j.setCurrentHashtag,setSearchQuery:j.setSearchQuery,setSearchOpen:j.setSearchOpen,setSearchScope:j.setSearchScope,setPosts:Z.setPosts,setHasMore:Z.setHasMore,preserveTimelineScrollTop:Z.preserveTimelineScrollTop,setRemovingPostIds:V.setRemovingPostIds,deletePost:q.deletePost,hasMoreRef:Z.hasMoreRef,loadMoreRef:Z.loadMoreRef}),N=FN(Cy(_,K)),U=xy(q.isAgentTurnActive,q.agentStatus),D=HB({currentChatJid:$.currentChatJid,followupQueueItemsRef:L.followupQueueItemsRef,dismissedQueueRowIdsRef:L.dismissedQueueRowIdsRef,setFollowupQueueItems:V.setFollowupQueueItems,showIntentToast:K,clearQueuedSteerStateIfStale:X.clearQueuedSteerStateIfStale,steerAgentQueueItem:q.steerAgentQueueItem,removeAgentQueueItem:q.removeAgentQueueItem,refreshQueueState:N.agentStatusLifecycle.refreshQueueState,refreshActiveChatAgents:N.chatRefreshLifecycle.refreshActiveChatAgents,refreshCurrentChatBranches:N.chatRefreshLifecycle.refreshCurrentChatBranches,refreshContextUsage:N.agentStatusLifecycle.refreshContextUsage,refreshAutoresearchStatus:N.agentStatusLifecycle.refreshAutoresearchStatus,currentRootChatJid:$.currentRootChatJid,isComposeBoxAgentActive:U,setPendingExtensionPanelActions:V.setPendingExtensionPanelActions,stopAutoresearch:q.stopAutoresearch,dismissAutoresearch:q.dismissAutoresearch,streamSidePrompt:q.streamSidePrompt,btwAbortRef:L.btwAbortRef,btwSession:G.btwSession,setBtwSession:V.setBtwSession,sendAgentMessage:q.sendAgentMessage,dismissedLiveWidgetKeysRef:L.dismissedLiveWidgetKeysRef,setFloatingWidget:V.setFloatingWidget,getAgentStatus:q.getAgentStatus,getAgentContext:q.getAgentContext,getAgentQueueState:q.getAgentQueueState,getAgentModels:q.getAgentModels,getActiveChatAgents:q.getActiveChatAgents,getChatBranches:q.getChatBranches,getTimeline:q.getTimeline,rawPosts:Z.rawPosts,activeChatAgents:G.activeChatAgents,currentChatBranches:G.currentChatBranches,contextUsage:G.contextUsage,activeModel:G.activeModel,activeThinkingLevel:G.activeThinkingLevel,supportsThinking:G.supportsThinking,isAgentTurnActive:q.isAgentTurnActive,chatOnlyMode:$.chatOnlyMode,navigate:$.navigate,setWorkspaceOpen:G.setWorkspaceOpen,currentBranchRecord:G.currentBranchRecord,renameBranchInFlightRef:L.renameBranchInFlightRef,renameBranchLockUntilRef:L.renameBranchLockUntilRef,getFormLock:Q.getFormLock,setRenameBranchNameDraft:V.setRenameBranchNameDraft,setIsRenameBranchFormOpen:V.setIsRenameBranchFormOpen,setIsRenamingBranch:V.setIsRenamingBranch,renameChatBranch:q.renameChatBranch,pruneChatBranch:q.pruneChatBranch,purgeChatBranch:q.purgeChatBranch,restoreChatBranch:q.restoreChatBranch,branchLoaderMode:$.branchLoaderMode,branchLoaderSourceChatJid:$.branchLoaderSourceChatJid,forkChatBranch:q.forkChatBranch,createRootChatSession:q.createRootChatSession,setBranchLoaderState:V.setBranchLoaderState,isWebAppMode:$.isWebAppMode,setActiveChatAgents:V.setActiveChatAgents,setCurrentChatBranches:V.setCurrentChatBranches,openEditor:q.openEditor,tabStripActiveId:q.tabStripActiveId,editorInstanceRef:Y.editorInstanceRef,dockInstanceRef:Y.dockInstanceRef,terminalTabPath:q.terminalTabPath,tabPaneOverrides:q.tabPaneOverrides,buildPaneDetachTransfer:Y.buildPaneDetachTransfer,registerDetachedPaneWindow:Y.registerDetachedPaneWindow,dockVisible:Y.dockVisible,resolveTab:q.resolveTab,closeTab:q.closeTab,setDockVisible:Y.setDockVisible,editorOpen:q.editorOpen,shellElement:L.appShellRef.current,editorWidthRef:L.editorWidthRef,dockHeightRef:L.dockHeightRef,sidebarWidthRef:L.sidebarWidthRef,readStoredNumber:Q.readStoredNumber,hasDockPanes:Y.hasDockPanes,toggleDock:Y.toggleDock,toggleZenMode:Y.toggleZenMode,exitZenMode:Y.exitZenMode,zenMode:Y.zenMode});return Iy({agentStatusLifecycleBundle:N,actionBundle:D,timelineViewActions:B,isComposeBoxAgentActive:U})}M0();I_();M0();function WB(_){try{return _?.focus?.(),!0}catch($){return!1}}function S5(_,$){if(!_||!$)return null;try{return _.getItem($)}catch{return null}}function Ij(_,$,j){if(!_||!$)return;try{_.setItem($,j)}catch{return}}function OB(_,$){if(!_||!$)return;try{_.removeItem($)}catch{return}}function zB(_="piclaw"){try{if(typeof crypto<"u"&&typeof crypto.randomUUID==="function")return`${_}-${crypto.randomUUID()}`}catch($){console.debug("[notification-delivery-coordinator] crypto.randomUUID threw; falling back to Math.random-based id.",$)}return`${_}-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`}function Z4(_=typeof window<"u"?window:null){let $=_?.localStorage,j=S5($,"piclaw.notifications.deviceId");if(j)return j;let G=zB("device");return Ij($,"piclaw.notifications.deviceId",G),S5($,"piclaw.notifications.deviceId")||G}function u5(_=typeof window<"u"?window:null){let $=_?.sessionStorage,j=S5($,"piclaw.notifications.clientId");if(j)return j;let G=_?.__PICLAW_NOTIFICATION_CLIENT_ID__;if(typeof G==="string"&&G.trim())return G.trim();let Z=zB("client");if(Ij($,"piclaw.notifications.clientId",Z),_)_.__PICLAW_NOTIFICATION_CLIENT_ID__=S5($,"piclaw.notifications.clientId")||Z;return _?.__PICLAW_NOTIFICATION_CLIENT_ID__||Z}function JB(_,$){return`piclaw.notifications.presence.${String(_||"").trim()}:${String($||"").trim()}`}function Cj(_={}){let $=_.runtimeWindow??(typeof window<"u"?window:null),j=_.runtimeDocument??(typeof document<"u"?document:null),G=typeof _.chatJid==="string"&&_.chatJid.trim()?_.chatJid.trim():"",Z=typeof _.deviceId==="string"&&_.deviceId.trim()?_.deviceId.trim():Z4($),X=typeof _.clientId==="string"&&_.clientId.trim()?_.clientId.trim():u5($),Y=Number.isFinite(_.updatedAtMs)?Number(_.updatedAtMs):Date.now(),L=Boolean(typeof j?.hasFocus==="function"?j.hasFocus():!0),q=String(j?.visibilityState||"").trim().toLowerCase()==="hidden"?"hidden":"visible";return{deviceId:Z,clientId:X,chatJid:G,visibilityState:q,hasFocus:L,updatedAtMs:Y}}function AB(_,$=typeof window<"u"?window:null){let j=$?.localStorage,G=typeof _?.deviceId==="string"?_.deviceId.trim():"",Z=typeof _?.clientId==="string"?_.clientId.trim():"",X=typeof _?.chatJid==="string"?_.chatJid.trim():"";if(!j||!G||!Z||!X)return!1;return Ij(j,JB(G,Z),JSON.stringify({deviceId:G,clientId:Z,chatJid:X,visibilityState:_.visibilityState==="hidden"?"hidden":"visible",hasFocus:Boolean(_.hasFocus),updatedAtMs:Number.isFinite(_.updatedAtMs)?Number(_.updatedAtMs):Date.now()})),!0}function kB(_,$=typeof window<"u"?window:null){let j=$?.localStorage,G=typeof _?.deviceId==="string"?_.deviceId.trim():"",Z=typeof _?.clientId==="string"?_.clientId.trim():"";if(!j||!G||!Z)return!1;return OB(j,JB(G,Z)),!0}function fy(_={}){let $=_.runtimeWindow??(typeof window<"u"?window:null),j=$?.localStorage,G=typeof _.deviceId==="string"&&_.deviceId.trim()?_.deviceId.trim():Z4($),Z=Number.isFinite(_.nowMs)?Number(_.nowMs):Date.now(),X=Number.isFinite(_.ttlMs)?Number(_.ttlMs):120000;if(!j||!G)return[];let Y=`piclaw.notifications.presence.${G}:`,L=[],V=[];for(let q=0;q<j.length;q+=1){let Q=j.key(q);if(!Q||!Q.startsWith(Y))continue;let K=S5(j,Q);if(!K){V.push(Q);continue}try{let B=JSON.parse(K),N=Number(B?.updatedAtMs);if(!Number.isFinite(N)||Z-N>X){V.push(Q);continue}let U=typeof B?.chatJid==="string"?B.chatJid.trim():"",D=typeof B?.clientId==="string"?B.clientId.trim():"";if(!U||!D){V.push(Q);continue}L.push({deviceId:G,clientId:D,chatJid:U,visibilityState:B?.visibilityState==="hidden"?"hidden":"visible",hasFocus:Boolean(B?.hasFocus),updatedAtMs:N})}catch{V.push(Q)}}return V.forEach((q)=>OB(j,q)),L.sort((q,Q)=>q.clientId.localeCompare(Q.clientId))}function yB(_={}){let $=Cj(_),j=$.chatJid;if(!j)return!1;let G=fy({runtimeWindow:_.runtimeWindow,deviceId:$.deviceId,nowMs:$.updatedAtMs,ttlMs:_.ttlMs}).filter((Y)=>Y.chatJid===j&&Y.clientId!==$.clientId),Z=[$,...G];if(Z.some((Y)=>Y.visibilityState==="visible"))return!1;let X=[...Z].sort((Y,L)=>Y.clientId.localeCompare(L.clientId))[0]||null;return Boolean(X&&X.clientId===$.clientId)}function Py(_=typeof window<"u"?window:null){return Boolean(_?.__PICLAW_NOTIFICATION_SOURCE_LABELS_ENABLED__)}function Ry(_,$="",j=typeof window<"u"?window:null){let G=typeof _==="string"&&_.trim()?_.trim():"PiClaw",Z=Py(j)&&typeof $==="string"?$.trim():"";return Z?`${G} [${Z}]`:G}function Sy(_){let $=String(_||"").replace(/-/g,"+").replace(/_/g,"/"),j=$.padEnd(Math.ceil($.length/4)*4,"="),G=atob(j),Z=new Uint8Array(G.length);for(let X=0;X<G.length;X+=1)Z[X]=G.charCodeAt(X);return Z}function b8(_=typeof window<"u"?window:null){if(!_||!_.isSecureContext)return!1;return"serviceWorker"in _.navigator&&"PushManager"in _}async function wB(_){return await _.navigator.serviceWorker.register("/sw.js",{updateViaCache:"none"}),await _.navigator.serviceWorker.ready}async function uy(_){let $=await wB(_),j=await $.pushManager.getSubscription();if(j)return j;let G=await H7(),Z=typeof G?.publicKey==="string"?G.publicKey.trim():"";if(!Z)throw Error("Missing web push public key.");return $.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Sy(Z)})}async function MB(_,$){if(!b8(_))return!1;let j=await uy(_);return await D7(j.toJSON?j.toJSON():j,{deviceId:$}),!0}async function gy(_,$){if(!b8(_))return!1;let G=await(await wB(_)).pushManager.getSubscription();if(!G)return!1;let Z=G.toJSON?G.toJSON():G;try{await W7(Z,{deviceId:$})}catch(X){console.warn("Failed to remove web push subscription from the server:",X)}try{await G.unsubscribe()}catch(X){console.warn("Failed to unsubscribe from web push notifications:",X)}return!0}function by(_,$={}){let j=$.runtimeWindow??(typeof window<"u"?window:null);if(!j?.fetch)return Promise.resolve(!1);return j.fetch("/agent/push/presence",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(_),keepalive:Boolean($.keepalive)}).then(()=>!0).catch(()=>!1)}function vy(_,$=typeof window<"u"?window:null){try{if($?.navigator?.sendBeacon){let j=new Blob([JSON.stringify(_)],{type:"application/json"});return $.navigator.sendBeacon("/agent/push/presence",j)}}catch(j){console.debug("[use-notifications] Ignoring sendBeacon failure for best-effort notification presence teardown.",j,{hasNavigator:Boolean($?.navigator)})}return!1}function TB(_={}){let $=typeof _?.chatJid==="string"&&_.chatJid.trim()?_.chatJid.trim():"web:default",[j,G]=f(!1),[Z,X]=f("default"),Y=g(!1),L=g(null),V=g(null);u(()=>{let N=F$("notificationsEnabled",!1);if(Y.current=N,G(N),typeof window<"u")L.current=Z4(window),V.current=u5(window);if(typeof Notification>"u")return;let U=Notification.permission;if(X(U),U==="denied"&&N){Y.current=!1,G(!1),V_("notificationsEnabled","false");return}if(U==="granted"&&N&&typeof window<"u"&&b8(window))MB(window,L.current||Z4(window)).catch((D)=>{console.warn("Failed to refresh stored web push subscription:",D)})},[]),u(()=>{Y.current=j},[j]),u(()=>{if(typeof window>"u"||typeof document>"u")return;let N=L.current||Z4(window),U=V.current||u5(window);L.current=N,V.current=U;let D=(z=!0,O="fetch")=>{let I=Cj({chatJid:$,runtimeWindow:window,runtimeDocument:document,deviceId:N,clientId:U});if(z)AB(I,window);else kB({deviceId:N,clientId:U},window);let x={device_id:N,client_id:U,chat_jid:$,visibility_state:I.visibilityState,has_focus:I.hasFocus,active:z};if(!z&&O==="beacon"&&vy(x,window))return;by(x,{runtimeWindow:window,keepalive:!z||O==="keepalive"})},H=()=>D(!0),E=()=>D(!1,"beacon");D(!0);let k=setInterval(()=>D(!0),15000);return document.addEventListener("visibilitychange",H),window.addEventListener("focus",H),window.addEventListener("blur",H),window.addEventListener("pageshow",H),window.addEventListener("pagehide",E),window.addEventListener("beforeunload",E),()=>{clearInterval(k),document.removeEventListener("visibilitychange",H),window.removeEventListener("focus",H),window.removeEventListener("blur",H),window.removeEventListener("pageshow",H),window.removeEventListener("pagehide",E),window.removeEventListener("beforeunload",E),D(!1,"beacon")}},[$]);let q=R(()=>{if(typeof Notification>"u")return Promise.resolve("denied");try{let N=Notification.requestPermission();if(N&&typeof N.then==="function")return N;return Promise.resolve(N)}catch(N){return console.debug("[use-notifications] Notification permission request threw; returning default permission state.",N),Promise.resolve("default")}},[]),Q=R(async()=>{if(typeof window>"u"||typeof Notification>"u")return;if(!window.isSecureContext){alert("Notifications require a secure context (HTTPS or installed app).");return}if(Notification.permission==="denied"){X("denied"),alert("Browser notifications are blocked. Enable them in your browser settings.");return}if(Notification.permission==="default"){let D=await q();if(X(D||"default"),D!=="granted"){Y.current=!1,G(!1),V_("notificationsEnabled","false");return}}let N=!Y.current;Y.current=N,G(N),V_("notificationsEnabled",String(N));let U=L.current||Z4(window);if(L.current=U,b8(window))try{if(N)await MB(window,U);else await gy(window,U)}catch(D){if(console.warn("Failed to sync web push notifications:",D),N)alert("Notifications were enabled, but web push setup failed. If you are on iPhone or iPad, reopen PiClaw from the Home Screen and try again.")}},[q]),K=R((N,U,D={})=>{if(!Y.current)return!1;if(typeof Notification>"u")return!1;if(Notification.permission!=="granted")return!1;try{let H=new Notification(Ry(N,D?.sourceLabel||"",window),{body:U});return H.onclick=()=>{WB(window)},!0}catch(H){return console.debug("[use-notifications] Local notification creation failed.",H,{title:typeof N==="string"?N:null}),!1}},[]),B=R((N)=>{if(typeof window>"u"||typeof document>"u")return!1;return yB({chatJid:typeof N==="string"&&N.trim()?N.trim():$,runtimeWindow:window,runtimeDocument:document,deviceId:L.current||Z4(window),clientId:V.current||u5(window)})},[$]);return{notificationsEnabled:j,notificationPermission:Z,toggleNotifications:Q,notify:K,shouldNotifyLocallyForChat:B}}function my(_){let{activeChatAgents:$,currentChatBranches:j,currentChatJid:G}=_,Z=j.find((X)=>X?.chat_jid===G);if(Z)return Z;return $.find((X)=>X?.chat_jid===G)||null}function cy(_){return{status:_?"running":"idle",message:_?"Preparing a new chat branch…":""}}function ly(_,$){let j=typeof $?.root_chat_jid==="string"?$.root_chat_jid.trim():"";if(j)return j;let G=typeof _==="string"?_.trim():"";if(!G)return"web:default";let Z=G.indexOf(":branch:");if(Z<=0)return G;return G.slice(0,Z)||G}function xB(_){let{currentChatJid:$,branchLoaderMode:j}=_,[G,Z]=f("disconnected"),[X,Y]=f(!1),[L,V]=f(()=>P1()),[q,Q]=f(null),[K,B]=f(null),[N,U]=f(!1),[D,H]=f("current"),[E,k]=f([]),[z,O]=f([]),[I,x]=f([]),[A,y]=f(null),[W,M]=f({}),[T,J]=f(null),[C,P]=f(null),[b,m]=f(!1),[h,_0]=f(null),[v,e]=f(null),[W0,G0]=f(!1),[$0,L0]=f([]),[B0,t]=f([]),[V0,K0]=f(null),[k0,s]=f(()=>new Map),[X0,D0]=f(()=>new Set),[C0,g0]=f(()=>({message:null,indicator:null,visible:!0})),[p0,j_]=f([]),[m0,d0]=f(!1),[u0,o0]=f(()=>iV()),[v0,a0]=f(null),[n0,N_]=f(null),t0=g(new Set),b0=Y0(()=>my({activeChatAgents:$0,currentChatBranches:B0,currentChatJid:$}),[$0,B0,$]),A0=Y0(()=>ly($,b0),[b0,$]),L_=dV(D),[e0,z_]=f(()=>cy(j)),E0=p0.length,R0=g(new Set),T0=g([]),i0=g(new Set),A_=g(0),q_=g({inFlight:!1,lastAttemptAt:0,turnId:null});R0.current=new Set(p0.map((g1)=>g1.row_id)),T0.current=p0;let{notificationsEnabled:H_,notificationPermission:E_,toggleNotifications:y_,notify:C_,shouldNotifyLocallyForChat:u_}=TB({chatJid:$}),[D_,j0]=f(()=>new Set),[O0,n]=f(()=>BK({allowLegacyFallback:!0,defaultValue:!1})),[i,o]=f({name:"You",avatar_url:null,avatar_background:null}),Z0=g(null),q0=g(!1),J0=g(!1),c0=g(!1),S0=g(null),I0=g($),w0=g(new Map),l0=g($),U0=g(0),h0=g(0),Y_=g({}),G_=g({name:null,avatar_url:null}),f0=g({currentHashtag:null,searchQuery:null,searchOpen:!1}),W_=g(null),B_=g(null),d=g(0),z0=g(0),Z_=g(0),K_=g(null),n_=g(null),F1=g(null),g_=g(null),J1=g(0),f_=g({title:null,avatarBase:null}),M_=g(null),A1=g(!1),[O_,k_]=f(!1),U1=g(0),[m_,p_]=f(!1),[s_,U_]=f(""),x1=Y0(()=>a6(s_,b0?.agent_name||""),[b0?.agent_name,s_]),E1=g(null);return{connectionStatus:G,setConnectionStatus:Z,stateAccessFailed:X,setStateAccessFailed:Y,isWebAppMode:L,setIsWebAppMode:V,currentHashtag:q,setCurrentHashtag:Q,searchQuery:K,setSearchQuery:B,searchOpen:N,setSearchOpen:U,searchScope:D,setSearchScope:H,fileRefs:E,setFileRefs:k,folderRefs:z,setFolderRefs:O,messageRefs:I,setMessageRefs:x,intentToast:A,setIntentToast:y,agents:W,setAgents:M,activeModel:T,setActiveModel:J,activeThinkingLevel:C,setActiveThinkingLevel:P,supportsThinking:b,setSupportsThinking:m,activeModelUsage:h,setActiveModelUsage:_0,agentModelsPayload:v,setAgentModelsPayload:e,hasLoadedAgentModels:W0,setHasLoadedAgentModels:G0,activeChatAgents:$0,setActiveChatAgents:L0,currentChatBranches:B0,setCurrentChatBranches:t,contextUsage:V0,setContextUsage:K0,extensionStatusPanels:k0,setExtensionStatusPanels:s,pendingExtensionPanelActions:X0,setPendingExtensionPanelActions:D0,extensionWorkingState:C0,setExtensionWorkingState:g0,followupQueueItems:p0,setFollowupQueueItems:j_,isAgentTurnActive:m0,setIsAgentTurnActive:d0,btwSession:u0,setBtwSession:o0,floatingWidget:v0,setFloatingWidget:a0,attachmentPreview:n0,setAttachmentPreview:N_,dismissedLiveWidgetKeysRef:t0,currentBranchRecord:b0,currentRootChatJid:A0,activeSearchScopeLabel:L_,branchLoaderState:e0,setBranchLoaderState:z_,followupQueueCount:E0,followupQueueRowIdsRef:R0,followupQueueItemsRef:T0,dismissedQueueRowIdsRef:i0,queueRefreshGenRef:A_,silentRecoveryRef:q_,notificationsEnabled:H_,notificationPermission:E_,handleToggleNotifications:y_,notify:C_,shouldNotifyLocallyForChat:u_,removingPostIds:D_,setRemovingPostIds:j0,workspaceOpen:O0,setWorkspaceOpen:n,userProfile:i,setUserProfile:o,staleUiVersionRef:Z0,staleUiReloadScheduledRef:q0,hasConnectedOnceRef:J0,wasAgentActiveRef:c0,agentStatusRef:S0,activeChatJidRef:I0,chatPaneStateByChatRef:w0,paneStateOwnerChatJidRef:l0,draftThrottleRef:U0,thoughtThrottleRef:h0,agentsRef:Y_,userProfileRef:G_,viewStateRef:f0,timelineRef:W_,appShellRef:B_,sidebarWidthRef:d,editorWidthRef:z0,dockHeightRef:Z_,lastNotifiedIdRef:K_,lastAgentResponseRef:n_,btwAbortRef:F1,lastActivityTimerRef:g_,lastActivityTokenRef:J1,brandingRef:f_,intentToastTimerRef:M_,renameBranchInFlightRef:A1,isRenamingBranch:O_,setIsRenamingBranch:k_,renameBranchLockUntilRef:U1,isRenameBranchFormOpen:m_,setIsRenameBranchFormOpen:p_,renameBranchNameDraft:s_,setRenameBranchNameDraft:U_,renameBranchDraftState:x1,renameBranchNameInputRef:E1}}M0();M0();function hy(_,$,j,G){if(!(_ instanceof Map)||_.size===0||!$||!j)return _;let Z=!1,X=new Map;for(let[Y,L]of _.entries()){let V=Y;if(G==="dir"){if(Y===$)V=j,Z=!0;else if(Y.startsWith(`${$}/`))V=`${j}${Y.slice($.length)}`,Z=!0}else if(Y===$)V=j,Z=!0;X.set(V,L)}return Z?X:_}function IB(_,$,j,G){if(!(_ instanceof Set)||_.size===0||!$||!j)return _;let Z=!1,X=new Set;for(let Y of _.values()){let L=Y;if(G==="dir"){if(Y===$)L=j,Z=!0;else if(Y.startsWith(`${$}/`))L=`${j}${Y.slice($.length)}`,Z=!0}else if(Y===$)L=j,Z=!0;X.add(L)}return Z?X:_}function CB({onTabClosed:_}={}){let $=g(_);$.current=_;let[j,G]=f(()=>__.getTabs()),[Z,X]=f(()=>__.getActiveId()),[Y,L]=f(()=>__.getTabs().length>0);u(()=>{return __.onChange((J,C)=>{G(J),X(C),L(J.length>0)})},[]);let[V,q]=f(()=>new Set),[Q,K]=f(()=>new Set),[B,N]=f(()=>new Map),U=R((J)=>{q((C)=>{let P=new Set(C);if(P.has(J))P.delete(J);else P.add(J);return P})},[]),D=R((J)=>{q((C)=>{if(!C.has(J))return C;let P=new Set(C);return P.delete(J),P})},[]),H=R((J)=>{K((C)=>{if(!C.has(J))return C;let P=new Set(C);return P.delete(J),P})},[]),E=R((J)=>{N((C)=>{if(!C.has(J))return C;let P=new Map(C);return P.delete(J),P})},[]),k=R((J,C={})=>{if(!J)return;let P=typeof C?.paneOverrideId==="string"&&C.paneOverrideId.trim()?C.paneOverrideId.trim():null,b={path:J,mode:"edit"};try{if(!(P?X_.get(P):X_.resolve(b))){if(!X_.get("editor")){console.warn(`[openEditor] No pane handler for: ${J}`);return}}}catch(v){console.warn(`[openEditor] paneRegistry.resolve() error for "${J}":`,v)}let m=typeof C?.label==="string"&&C.label.trim()?C.label.trim():void 0,h=C?.viewState&&typeof C.viewState==="object"?C.viewState:null,_0=C?.diffMode==="saved"?"saved":null;if(__.open(J,m),h)__.saveViewState(J,h);if(P)N((v)=>{if(v.get(J)===P)return v;let e=new Map(v);return e.set(J,P),e});if(_0==="saved")K((v)=>{if(v.has(J))return v;let e=new Set(v);return e.add(J),e})},[]),z=R(()=>{let J=__.getActiveId();if(J){let C=__.get(J);if(C?.dirty){if(!window.confirm(`"${C.label}" has unsaved changes. Close anyway?`))return}__.close(J),D(J),H(J),E(J),$.current?.(J)}},[H,E,D]),O=R((J)=>{let C=__.get(J);if(C?.dirty){if(!window.confirm(`"${C.label}" has unsaved changes. Close anyway?`))return}__.close(J),D(J),H(J),E(J),$.current?.(J)},[H,E,D]),I=R((J)=>{__.activate(J)},[]),x=R((J)=>{let C=__.getTabs().filter((m)=>m.id!==J&&!m.pinned),P=C.filter((m)=>m.dirty).length;if(P>0){if(!window.confirm(`${P} unsaved tab${P>1?"s":""} will be closed. Continue?`))return}let b=C.map((m)=>m.id);__.closeOthers(J),b.forEach((m)=>{D(m),H(m),E(m),$.current?.(m)})},[H,E,D]),A=R(()=>{let J=__.getTabs().filter((b)=>!b.pinned),C=J.filter((b)=>b.dirty).length;if(C>0){if(!window.confirm(`${C} unsaved tab${C>1?"s":""} will be closed. Continue?`))return}let P=J.map((b)=>b.id);__.closeAll(),P.forEach((b)=>{D(b),H(b),E(b),$.current?.(b)})},[H,E,D]),y=R((J)=>{__.togglePin(J)},[]),W=R((J)=>{if(!J)return;K((C)=>{let P=new Set(C);if(P.has(J))P.delete(J);else P.add(J);return P}),__.activate(J)},[]),M=R((J)=>{if(!J)return;N((C)=>{if(C.get(J)==="editor")return C;let P=new Map(C);return P.set(J,"editor"),P}),__.activate(J)},[]),T=R(()=>{let J=__.getActiveId();if(J)window.dispatchEvent(new CustomEvent("workspace-reveal-path",{detail:{path:J}}))},[]);return u(()=>{let J=(C)=>{let{oldPath:P,newPath:b,type:m}=C.detail||{};if(!P||!b)return;if(m==="dir"){for(let h of __.getTabs())if(h.path===P||h.path.startsWith(`${P}/`)){let _0=`${b}${h.path.slice(P.length)}`;__.rename(h.id,_0)}}else __.rename(P,b);q((h)=>IB(h,P,b,m)),K((h)=>IB(h,P,b,m)),N((h)=>hy(h,P,b,m))};return window.addEventListener("workspace-file-renamed",J),()=>window.removeEventListener("workspace-file-renamed",J)},[]),u(()=>{let J=(C)=>{if(__.hasUnsaved())C.preventDefault(),C.returnValue=""};return window.addEventListener("beforeunload",J),()=>window.removeEventListener("beforeunload",J)},[]),{editorOpen:Y,tabStripTabs:j,tabStripActiveId:Z,previewTabs:V,diffTabs:Q,tabPaneOverrides:B,openEditor:k,closeEditor:z,handleTabClose:O,handleTabActivate:I,handleTabCloseOthers:x,handleTabCloseAll:A,handleTabTogglePin:y,handleTabTogglePreview:U,handleTabToggleDiff:W,handleTabEditSource:M,revealInExplorer:T}}M0();function a1(_){return typeof _==="string"&&_.trim()?_.trim():null}function ny(_=globalThis){try{return typeof _?.crypto?.randomUUID==="function"?_.crypto.randomUUID():null}catch($){return null}}function v4(_="pane"){let $=ny();if($)return`${_}-${$}`;return`${_}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`}function fB(_){let $=a1(_?.paneInstanceId),j=a1(_?.paneWindowId);if(!$||!j)return{};let G=a1(_?.paneSourceWindowId);return{pane_instance_id:$,pane_window_id:j,...G?{pane_source_window_id:G}:{}}}function PB(_={}){let $=new URLSearchParams(_.search||"");return{panePath:a1($.get("pane_path"))||a1(_.panePath),paneLabel:a1($.get("pane_label"))||a1(_.paneLabel),paneInstanceId:a1($.get("pane_instance_id")),paneWindowId:a1($.get("pane_window_id")),paneSourceWindowId:a1($.get("pane_source_window_id"))}}function m4(_){return Boolean(_?.panePath&&_?.paneInstanceId&&_?.paneWindowId)}function t1(_){return typeof _==="string"&&_.trim()?_.trim():null}function RB(_){let $=t1(_?.panePath),j=t1(_?.paneInstanceId),G=t1(_?.ownerWindowId);if(!$||!j||!G)return null;let Z=t1(_?.now)||new Date().toISOString();return{panePath:$,paneInstanceId:j,ownerWindowId:G,detachedAt:Z,requestedAt:Z,label:t1(_?.label),sourceWindowId:t1(_?.sourceWindowId)}}function fj(_,$){if(!_||!$)return!1;return t1($.panePath)===_.panePath&&t1($.paneInstanceId)===_.paneInstanceId&&t1($.paneWindowId)===_.ownerWindowId}function Pj(_,$){if(!_)return null;return{panePath:_.panePath,paneInstanceId:_.paneInstanceId,ownerWindowId:_.ownerWindowId,detachedAt:t1($)||new Date().toISOString(),label:_.label||null}}function v8(_){try{return _?.close?.(),!0}catch($){return!1}}function Rj(_,$,j){try{return _?.postMessage?.($,j),!0}catch(G){return!1}}function ry(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$)return!1;if(_.openTabIds?.has($))return!0;if(_.pendingDetachedTabPaths?.has?.($))return!0;if(_.detachedTabPaths?.has?.($))return!0;if($===_.terminalTabPath)return Boolean(_.hasPendingDetachedDockPane||_.hasDetachedDockPane);return!1}function SB(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$)return;let j=_?.sourceHost==="dock"?"dock":"tab";if($===_.terminalTabPath&&j==="dock"){_.setDockVisible?.(!1);return}_.closeTab?.($)}var py=400;function dy(_){let $=Array.isArray(_?.changed_paths)?_.changed_paths.map((G)=>typeof G==="string"?G.trim():"").filter(Boolean):[];if($.length>0)return $;let j=typeof _?.path==="string"?_.path.trim():"";return j?[j]:["."]}function iy(_,$){if(!_)return!1;if(!Array.isArray($)||$.length===0)return!0;return $.some((j)=>{return dy(j).some((Z)=>Z==="."||Z===_)})}async function uB(_,$){if(typeof _?.afterAttachToHost!=="function")return;await _.afterAttachToHost($)}function oy(_=typeof document<"u"?document:null){if(!_)return!0;let $=typeof _.visibilityState==="string"?_.visibilityState:"";return!$||$==="visible"}function l8(_=typeof navigator<"u"?navigator:null){if(!_)return!1;let $=String(_.userAgent||""),j=String(_.vendor||""),G=/AppleWebKit/i.test($),Z=/Safari/i.test($),X=/Chrome|Chromium|CriOS|EdgiOS|EdgA|Edg\//i.test($),Y=/FxiOS/i.test($);return G&&(j.includes("Apple")||Z)&&!X&&!Y}function gB(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$)return!1;if($!==_.terminalTabPath)return!1;if((_?.reason==="message"?"message":"closed-window")==="closed-window")return!0;return _?.allowLiveTransfer===!1}function m8(_){if(!gB(_))return!1;return l8(_?.runtimeNavigator)}function c8(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$||$!==_?.terminalTabPath)return!1;return l8(_?.runtimeNavigator)}function u2(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$)return!1;return $!==_?.terminalTabPath}function sy(_){let $=typeof _?.panePath==="string"?_.panePath.trim():"";if(!$)return null;let j=_?.runtime??globalThis,G=typeof _?.nowMs==="number"?_.nowMs:Date.now(),Z=typeof _?.paneInstanceId==="string"?_.paneInstanceId.trim():"",X=typeof _?.paneOverrideId==="string"?_.paneOverrideId.trim():"",Y=typeof _?.terminalTabPath==="string"?_.terminalTabPath:"piclaw://terminal",L=_?.allowLiveTransfer!==!1,V=_?.instance||null,q=typeof V?.exportHostTransferState==="function"?V.exportHostTransferState():null,Q=$===Y,K=q&&!Q?u8({path:$,payload:q},j,G):null,B=null;if($!==Y){let N=q&&typeof q==="object"?typeof q.mtime==="string"?q.mtime:q.mtime===null?null:void 0:void 0,U=typeof V?.isDirty==="function"?V.isDirty():!1,D=typeof V?.getContent==="function"?V.getContent():void 0;B=Z6({path:$,content:U?D:void 0,mtime:N,paneOverrideId:X||null,viewState:_?.viewState||null},j,G)}return{type:"piclaw-pane-reattach-request",panePath:$,...Z?{paneInstanceId:Z}:{},...B?.editor_popout?{editorPopoutToken:B.editor_popout}:{},...K?.pane_transfer?{paneTransferToken:K.pane_transfer}:{},...Q&&q?{paneTransferPayload:q}:{},...L?{}:{allowLiveTransfer:!1}}}function ay(_){let $=typeof _?.payload?.panePath==="string"?_.payload.panePath.trim():"";if(!$)return null;let j=_?.runtime??globalThis,G=typeof _?.nowMs==="number"?_.nowMs:Date.now(),Z=typeof _?.payload?.paneInstanceId==="string"&&_.payload.paneInstanceId.trim()?_.payload.paneInstanceId.trim():null,X=typeof _?.payload?.editorPopoutToken==="string"?_.payload.editorPopoutToken.trim():"",Y=typeof _?.payload?.paneTransferToken==="string"?_.payload.paneTransferToken.trim():"",L=_?.payload?.paneTransferPayload&&typeof _.payload.paneTransferPayload==="object"&&!Array.isArray(_.payload.paneTransferPayload)?_.payload.paneTransferPayload:null,V=X?W3(X,j,G):null,q=L?{panePath:$,path:$,payload:L,capturedAt:G}:Y?Mj(Y,j,G):null;return{panePath:$,paneInstanceId:Z,editorTransfer:V?.path===$?V:null,hostTransfer:q?.path===$?q:null,allowLiveTransfer:_?.payload?.allowLiveTransfer!==!1}}function bB(_){let{panePopoutMode:$,panePopoutPath:j,panePopoutLabel:G,chatOnlyMode:Z,editorOpen:X,tabStripTabs:Y,tabStripActiveId:L,previewTabs:V,diffTabs:q,tabPaneOverrides:Q,terminalTabPath:K,vncTabPrefix:B,openEditor:N,closeEditor:U,getWorkspaceFile:D}=_,H=g(null),E=g(null),k=g(null),z=g(null),O=g((()=>{if(!$)return null;let n=G2("editor_popout");return W3(n)})()),I=g((()=>{if(!$)return null;return WN()})()),x=g(PB({search:typeof window<"u"?window.location.search:"",panePath:j,paneLabel:G})),A=g(x.current.paneWindowId||v4("pane-window")),y=g(new Map),W=g(new Map),M=g(new Map),T=g(new Map),J=g(!1),C=g(new Map),P=g(v4("pane-instance")),b=g(new Map),m=g(new Map),h=g(new Set),[_0,v]=f(()=>new Map),e=g(_0);e.current=_0;let[W0,G0]=f(()=>new Map),$0=g(W0);$0.current=W0;let[L0,B0]=f(null),t=g(L0);t.current=L0;let[V0,K0]=f(null),k0=g(V0);k0.current=V0;let s=X_.getDockPanes().length>0,[X0,D0]=f(!1),C0=R(()=>D0((n)=>!n),[]),g0=R(()=>{N(K,{label:"Terminal"})},[N,K]),p0=R(()=>{N(B,{label:"VNC"})},[N,B]),j_=R((n)=>{let i=typeof n==="string"?n.trim():"";if(!i)return v4("pane-instance");if(i===K&&!__.get(i)){if(!P.current)P.current=v4("pane-instance");return P.current}let Z0=C.current.get(i);if(Z0)return Z0;let q0=v4("pane-instance");return C.current.set(i,q0),q0},[K]),m0=Y0(()=>!$&&L?W0.get(L)||null:null,[W0,$,L]),d0=!$?V0:null,u0=R((n)=>{if(!n)return;ON(n),m.current.delete(n),h.current.delete(n),B0((i)=>i?.panePath===n?null:i),v((i)=>{if(!i.has(n))return i;let o=new Map(i);return o.delete(n),o})},[]),o0=R((n)=>{if(!n)return;b.current.delete(n),m.current.delete(n),h.current.delete(n),u0(n),K0((i)=>i?.panePath===n?null:i),G0((i)=>{if(!i.has(n))return i;let o=new Map(i);return o.delete(n),o})},[u0]),v0=R((n,i={})=>{let o=typeof n==="string"?n.trim():"";if(!o)return!1;if(c8({panePath:o,terminalTabPath:K}))return!1;let Z0=b.current.get(o),q0=Boolean($0.current.get(o)),J0=Boolean(k0.current?.panePath===o);if(o0(o),o===K&&J0&&!q0)D0(!0);else if(o===K&&q0)N(o,{label:"Terminal"});else if(__.get(o))__.activate(o);else N(o);if(i.closeDetachedWindow!==!1&&Z0&&typeof Z0.close==="function")v8(Z0);return!0},[o0,N,D0,K]),a0=R(()=>{if($)return;if(!oy())return;let n=Date.now();for(let[i,o]of m.current.entries()){if(o>n)continue;m.current.delete(i),v0(i,{closeDetachedWindow:!1})}},[$,v0]),n0=R((n,i={})=>{let o=typeof n==="string"?n.trim():"";if(!o)return!1;let Z0={panePath:o,terminalTabPath:K,allowLiveTransfer:i.allowLiveTransfer,reason:i.reason};if(m8(Z0))return b.current.delete(o),m.current.delete(o),h.current.add(o),!0;if(!gB(Z0))return v0(o,{closeDetachedWindow:!1});return m.current.set(o,Date.now()+py),a0(),!0},[a0,v0,K]),N_=R((n)=>{let i=typeof n==="string"?n.trim():"";if(!i)return null;let o=j_(i),Z0=v4("pane-window");return{paneInstanceId:o,paneWindowId:Z0,params:fB({paneInstanceId:o,paneWindowId:Z0,paneSourceWindowId:A.current})}},[j_]),t0=R((n,i,o,Z0)=>{let q0=typeof n==="string"?n.trim():"";if(!q0||!Z0)return;let J0=RB({panePath:q0,paneInstanceId:Z0.pane_instance_id,ownerWindowId:Z0.pane_window_id,sourceWindowId:Z0.pane_source_window_id,label:i});if(!J0)return;if(b.current.set(q0,o||null),q0===K&&!__.get(q0)){B0(J0);return}v((S0)=>{let I0=new Map(S0);return I0.set(q0,J0),I0})},[K]),b0=R((n,i)=>{let o=typeof n?.panePath==="string"?n.panePath.trim():"";if(!o)return!1;let Z0=b.current.get(o);if(Z0&&i&&Z0!==i)return!1;let q0=e.current.get(o)||null;if(fj(q0,n)){let w0=E.current,l0=u2({panePath:o,terminalTabPath:K});if(l0&&w0&&typeof w0.moveHost==="function")S2({panePath:o,paneInstanceId:q0.paneInstanceId,paneWindowId:q0.ownerWindowId,instance:w0,releaseSourceHost:()=>{if(E.current===w0)E.current=null}});if(l0&&E.current)E.current=null;let U0=Pj(q0);if(!U0)return!1;return v((h0)=>{if(!h0.has(o))return h0;let Y_=new Map(h0);return Y_.delete(o),Y_}),G0((h0)=>{let Y_=new Map(h0);return Y_.set(o,U0),Y_}),SB({panePath:o,terminalTabPath:K,closeTab:(h0)=>__.close(h0),sourceHost:"tab"}),!0}if(o!==K)return!1;let J0=t.current,c0=z.current,S0=u2({panePath:o,terminalTabPath:K});if(S0&&J0&&c0&&typeof c0.moveHost==="function")S2({panePath:o,paneInstanceId:J0.paneInstanceId,paneWindowId:J0.ownerWindowId,instance:c0,releaseSourceHost:()=>{if(z.current===c0)z.current=null}});if(S0&&z.current)z.current=null;if(!fj(J0,n))return!1;let I0=Pj(J0);if(!I0)return!1;return B0(null),K0(I0),SB({panePath:o,terminalTabPath:K,setDockVisible:D0,sourceHost:"dock"}),!0},[D0,K]),A0=R((n=!1,i=!0)=>{if(!$)return!1;let o=x.current;if(!m4(o))return!1;if(typeof window>"u"||!window.opener||window.opener.closed)return!1;if(J.current){if(n)v8(window);return!0}let Z0=o.panePath||j,q0=Z0===K?z.current||E.current:E.current,J0=i&&u2({panePath:Z0,terminalTabPath:K}),c0=sy({panePath:Z0,paneInstanceId:o.paneInstanceId,paneOverrideId:Z0===K?null:typeof Q?.get==="function"?Q.get(Z0)||null:null,terminalTabPath:K,viewState:Z0===K?null:__.getViewState(Z0)||null,allowLiveTransfer:J0,instance:q0});if(!c0)return!1;if(J0&&c0.paneTransferToken&&typeof q0?.moveHost==="function"){if(z.current===q0)z.current=null;if(E.current===q0)E.current=null}if(!Rj(window.opener,c0,window.location.origin))return!1;if(J.current=!0,n)v8(window);return!0},[$,j,Q,K]),L_=R(()=>A0(!0,!0),[A0]);u(()=>{if(!$||typeof window>"u")return;let n=()=>{let i=x.current,o=m4(i)?i.panePath||j||"":"";if(m8({panePath:o,terminalTabPath:K,allowLiveTransfer:!1,reason:"closed-window"}))return;A0(!1,!1)};return window.addEventListener("pagehide",n),window.addEventListener("beforeunload",n),()=>{window.removeEventListener("pagehide",n),window.removeEventListener("beforeunload",n)}},[$,A0]);let e0=Y0(()=>sV(Y,L),[L,Y]),z_=Y0(()=>aV(Q,L),[Q,L]),E0=Y0(()=>qj(G,e0,j),[e0,G,j]),R0=Y0(()=>L&&q.has(L)?"saved":null,[q,L]),T0=g(R0);u(()=>{T0.current=R0},[R0]);let i0=Y0(()=>eV(Y,V,q,L),[q,V,L,Y]),A_=Y0(()=>_K(j,B),[j,B]),q_=Y0(()=>$K(j,K,i0,A_),[A_,i0,j,K]),H_=jK($,Z,X,s,X0),[E_,y_]=f(!1),C_=g(!1),u_=R(()=>{if(!X||Z)return;if(C_.current=X0,X0)D0(!1);y_(!0)},[Z,X0,X]),D_=R(()=>{if(!E_)return;if(y_(!1),C_.current)D0(!0),C_.current=!1},[E_]),j0=R(()=>{if(E_){D_();return}u_()},[u_,D_,E_]);u(()=>{if(E_&&!X)D_()},[X,D_,E_]),u(()=>{let n=new Set(Y.map((Z0)=>Z0.id)),i=new Set(e.current.keys()),o=new Set($0.current.keys());for(let Z0 of Array.from(C.current.keys()))if(!ry({panePath:Z0,openTabIds:n,pendingDetachedTabPaths:i,detachedTabPaths:o,terminalTabPath:K,hasPendingDetachedDockPane:Boolean(t.current),hasDetachedDockPane:Boolean(k0.current)}))C.current.delete(Z0)},[Y,K]),u(()=>{if($||typeof window>"u")return;let n=(i)=>{if(i.origin!==window.location.origin)return;let o=i.data;if(!o||typeof o!=="object")return;if(o.type==="piclaw-pane-detach-claim"){b0({panePath:o.panePath,paneInstanceId:o.paneInstanceId,paneWindowId:o.paneWindowId},i.source);return}if(o.type!=="piclaw-pane-reattach-request")return;let Z0=ay({payload:o}),q0=Z0?.panePath||"";if(!q0)return;if(Z0?.editorTransfer)y.current.set(q0,Z0.editorTransfer);if(Z0?.hostTransfer)if(W.current.set(q0,Z0.hostTransfer),Z0.allowLiveTransfer&&i.source)M.current.set(q0,i.source);else M.current.delete(q0);let J0=$0.current.get(q0)||null,c0=q0===K?k0.current:null,S0=u2({panePath:q0,terminalTabPath:K}),I0=J0||c0;if(!I0)return;if(Z0?.paneInstanceId&&Z0.paneInstanceId!==I0.paneInstanceId)return;if(c8({panePath:q0,terminalTabPath:K})){M.current.delete(q0),T.current.delete(q0),W.current.delete(q0),y.current.delete(q0);return}if(Z0?.hostTransfer&&Z0.allowLiveTransfer&&S0)T.current.set(q0,{panePath:q0,paneInstanceId:I0.paneInstanceId,paneWindowId:I0.ownerWindowId});else T.current.delete(q0);if(m8({panePath:q0,terminalTabPath:K,allowLiveTransfer:Z0?.allowLiveTransfer,reason:"message"})){M.current.delete(q0),b.current.delete(q0),m.current.delete(q0),h.current.add(q0);return}n0(q0,{allowLiveTransfer:Z0?.allowLiveTransfer,reason:"message"})};return window.addEventListener("message",n),()=>window.removeEventListener("message",n)},[b0,$,n0,K]),u(()=>{if($||typeof window>"u"||typeof document>"u")return;let n=()=>a0();window.addEventListener("focus",n),window.addEventListener("pageshow",n),document.addEventListener("visibilitychange",n);let i=setInterval(()=>{a0();for(let[o,Z0]of b.current.entries()){if(!Z0||!Z0.closed)continue;if(o===K?Boolean(t.current):e.current.has(o)){b.current.delete(o),u0(o);continue}if(c8({panePath:o,terminalTabPath:K})){o0(o);continue}if(m8({panePath:o,terminalTabPath:K,allowLiveTransfer:!1,reason:"closed-window"})){b.current.delete(o),m.current.delete(o),h.current.add(o);continue}if(h.current.has(o)){b.current.delete(o);continue}n0(o,{allowLiveTransfer:!1,reason:"closed-window"})}},750);return()=>{window.removeEventListener("focus",n),window.removeEventListener("pageshow",n),document.removeEventListener("visibilitychange",n),clearInterval(i)}},[o0,u0,a0,$,n0,K]),u(()=>{if(!$||!j)return;if(__.getActiveId()===j)return;let i=O.current?.path===j?O.current:null,o=I.current?.path===j?I.current:null;N(j,{...G?{label:G}:{},...i?.paneOverrideId?{paneOverrideId:i.paneOverrideId}:{},...i?.viewState?{viewState:i.viewState}:{},...o?.payload?.diffMode?{diffMode:o.payload.diffMode}:{}})},[N,G,$,j]),u(()=>{if(!$)return;let n=x.current;if(!m4(n))return;if(typeof window>"u"||!window.opener||window.opener.closed)return;Rj(window.opener,{type:"piclaw-pane-detach-claim",panePath:n.panePath,paneInstanceId:n.paneInstanceId,paneWindowId:n.paneWindowId},window.location.origin)},[$]),u(()=>{let n=H.current;if(!n)return;if(E.current)E.current.dispose(),E.current=null;let i=L;if(!i)return;if(!$&&m0?.panePath===i){n.innerHTML="";return}let o=O.current?.path===i?O.current:null,Z0=y.current.get(i)||null,q0=o||Z0,J0=I.current?.path===i?I.current:null,c0=W.current.get(i)||null,S0=J0||c0,I0=z_||q0?.paneOverrideId||null,w0=S0?.payload?{...S0.payload}:null;if(T0.current)w0={...w0||{},diffMode:T0.current};else if(w0&&"diffMode"in w0)delete w0.diffMode;let l0={path:i,mode:"edit",...q0?.content!==void 0?{content:q0.content}:{},...q0?.mtime!==void 0?{mtime:q0.mtime}:{},...w0?{transferState:w0}:{}},U0=(I0?X_.get(I0):null)||X_.resolve(l0)||X_.get("editor");if(!U0){n.innerHTML='<div style="padding:2em;color:var(--text-secondary);text-align:center;">No editor available for this file.</div>';return}let h0=null,Y_=!1,G_=(f0)=>{h0=f0,E.current=f0,f0.onDirtyChange?.((d)=>{__.setDirty(i,d)}),f0.onSaveRequest?.(()=>{}),f0.onClose?.(()=>{U()});let W_=__.getViewState(i);if(W_&&typeof f0.restoreViewState==="function")requestAnimationFrame(()=>f0.restoreViewState(W_));if(typeof f0.onViewStateChange==="function")f0.onViewStateChange((d)=>{__.saveViewState(i,d)});let B_=x.current;if($&&m4(B_)&&typeof f0?.moveHost==="function"&&u2({panePath:i,terminalTabPath:K}))S2({panePath:i,paneInstanceId:B_.paneInstanceId||"",paneWindowId:B_.paneWindowId||"",instance:f0,releaseSourceHost:()=>{if(z.current===f0)z.current=null;if(E.current===f0)E.current=null}});uB(f0,{path:i,hostMode:$?"popout":"main",transferState:w0}).catch((d)=>{console.warn("[pane-attach] afterAttachToHost failed:",d)}),requestAnimationFrame(()=>f0.focus?.())};return(async()=>{let f0=x.current,W_=$&&m4(f0)&&f0.panePath===i?{panePath:i,paneInstanceId:f0.paneInstanceId||"",paneWindowId:f0.paneWindowId||""}:null,B_=T.current.get(i)||null,d=u2({panePath:i,terminalTabPath:K})?W_||B_:null,z0=$?typeof window<"u"&&window.opener&&!window.opener.closed?window.opener:null:M.current.get(i)||null,Z_=$?"popout":"main";if(S0&&d&&z0)try{let K_=await zN(z0,d,n,{path:i,hostMode:Z_,transferState:w0});if(!Y_&&K_){if(G_(K_),o)O.current=null;if(Z0)y.current.delete(i);if(J0)I.current=null;if(c0)W.current.delete(i);M.current.delete(i),T.current.delete(i);return}}catch(K_){console.warn("[pane-live-transfer] Failed to claim live pane instance:",K_)}if(Y_)return;if(G_(U0.mount(n,l0)),o)O.current=null;if(Z0)y.current.delete(i);if(J0)I.current=null;if(c0)W.current.delete(i);M.current.delete(i),T.current.delete(i)})(),()=>{if(Y_=!0,E.current===h0)h0.dispose(),E.current=null}},[m0,z_,U,$,L]),u(()=>{let n=L,i=E.current;if(!n||typeof i?.setDiffMode!=="function")return;i.setDiffMode(R0)},[R0,L]);let O0=R(async(n)=>{let i=typeof L==="string"?L.trim():"",o=E.current;if(!i||!o?.setContent)return;if(typeof o.isDirty==="function"&&o.isDirty())return;if(!iy(i,n))return;try{let Z0=await D(i,1e6,"edit"),q0=typeof Z0?.text==="string"?Z0.text:"",J0=typeof Z0?.mtime==="string"&&Z0.mtime.trim()?Z0.mtime.trim():new Date().toISOString();o.setContent(q0,J0)}catch(Z0){console.warn("[workspace_update] Failed to refresh active pane:",Z0)}},[D,L]);return u(()=>{let n=k.current;if(z.current)z.current.dispose(),z.current=null;if(!n||!s||!X0)return;if(!$&&d0?.panePath===K){n.innerHTML="";return}let i=X_.getDockPanes()[0];if(!i){n.innerHTML='<div class="terminal-placeholder">No dock pane available.</div>';return}let o=I.current?.path===K?I.current:null,Z0=W.current.get(K)||null,q0=o||Z0,J0=i.mount(n,{mode:"view",...q0?.payload?{transferState:q0.payload}:{}});if(z.current=J0,uB(J0,{path:K,hostMode:$?"popout":"main",transferState:q0?.payload||null}).catch((c0)=>{console.warn("[pane-attach] afterAttachToHost failed:",c0)}),o)I.current=null;if(Z0)W.current.delete(K);return requestAnimationFrame(()=>J0.focus?.()),()=>{if(z.current===J0)J0.dispose(),z.current=null}},[d0,X0,s,$,K]),{editorContainerRef:H,editorInstanceRef:E,dockContainerRef:k,dockInstanceRef:z,hasDockPanes:s,dockVisible:X0,setDockVisible:D0,toggleDock:C0,openTerminalTab:g0,openVncTab:p0,panePopoutTitle:E0,panePopoutHasMenuActions:i0,hidePanePopoutControls:q_,showEditorPaneContainer:H_,zenMode:E_,exitZenMode:D_,toggleZenMode:j0,refreshActiveEditorFromWorkspace:O0,detachedTabs:W0,activeDetachedTab:m0,detachedDockPane:d0,buildPaneDetachTransfer:N_,registerDetachedPaneWindow:t0,reattachPane:v0,requestPanePopoutReattach:L_,canReattachPanePopout:$&&m4(x.current)&&!c8({panePath:j||"",terminalTabPath:K})}}function ty(_){return{removeFileRefRef:_.removeFileRefRef,editorState:_.editorState,paneRuntime:_.paneRuntime}}function vB(_){let $=g(null),j=CB({onTabClosed:(Z)=>$.current?.(Z)}),G=bB({panePopoutMode:_.panePopoutMode,panePopoutPath:_.panePopoutPath,panePopoutLabel:_.panePopoutLabel,chatOnlyMode:_.chatOnlyMode,editorOpen:j.editorOpen,tabStripTabs:j.tabStripTabs,tabStripActiveId:j.tabStripActiveId,previewTabs:j.previewTabs,diffTabs:j.diffTabs,tabPaneOverrides:j.tabPaneOverrides,terminalTabPath:_.terminalTabPath,vncTabPrefix:_.vncTabPrefix,openEditor:j.openEditor,closeEditor:j.closeEditor,getWorkspaceFile:_.getWorkspaceFile});return ty({removeFileRefRef:$,editorState:j,paneRuntime:G})}I_();var n8=1280,r8=820;function h8(_){if(typeof _!=="number"||!Number.isFinite(_)||_<=0)return null;return _}function g5(_){return typeof _==="string"&&_.trim()?_.trim():null}function ey(_){let $=g5(_);if(!$)return!1;if($.startsWith("/")||$.startsWith("\\"))return!1;if($.includes("://"))return!1;if($==="."||$===".."||$.startsWith("../"))return!1;return!0}function _M(_){if(_.isMobile)return!1;let $=h8(_.windowWidth),j=h8(_.windowHeight);if($===null||j===null)return!1;if($<n8||j<r8)return!1;let G=h8(_.screenWidth),Z=h8(_.screenHeight);if(G!==null&&G<n8)return!1;if(Z!==null&&Z<r8)return!1;return!0}function $M(_){let $=_?.navigator,j=String($?.userAgent||""),G=Number($?.maxTouchPoints||0);return(typeof _?.matchMedia==="function"?Boolean(_.matchMedia("(pointer: coarse)")?.matches):!1)||G>1||/Android|iPhone|iPad|iPod/i.test(j)}function jM(_){if(!_||_.kind!=="custom")return null;let $=g5(_.request_id),j=_.options&&typeof _.options==="object"?_.options:null;if(!$||!j||j.action!=="open_workspace_file")return null;let G=g5(j.path);if(!ey(G))return null;let Z=j.target==="tab"?"tab":"popout";return{requestId:$,chatJid:g5(_.chat_jid),path:G,label:g5(j.label),target:Z}}async function GM(_,$,j){await H2(_,$,j||void 0)}async function mB(_,$){let j=jM(_?.detail?.payload);if(!j)return!1;if(j.chatJid&&j.chatJid!==$.currentChatJid)return!1;let G=$.respond||GM,Z=$.windowObject||(typeof window<"u"?window:void 0),X={width:Number(Z?.innerWidth||0)||void 0,height:Number(Z?.innerHeight||0)||void 0},Y={width:n8,height:r8};if(j.target==="popout"){if(!_M({windowWidth:Z?.innerWidth,windowHeight:Z?.innerHeight,screenWidth:Z?.screen?.availWidth,screenHeight:Z?.screen?.availHeight,isMobile:$M(Z)}))return $.showIntentToast?.("Editor popout unavailable",`Need at least ${n8}×${r8} viewport space for a separate editor window.`,"warning",4500),await G(j.requestId,{ok:!1,opened:!1,reason:"insufficient_screen_space",detail:"Browser viewport is too small for a separate editor window.",target:j.target,path:j.path,viewport:X,minimum_viewport:Y},j.chatJid),!0;let V=await $.popOutPane(j.path,j.label);return await G(j.requestId,{ok:V,opened:V,reason:V?void 0:"popout_failed",detail:V?void 0:"The browser blocked the editor popout window.",target:j.target,path:j.path},j.chatJid),!0}return $.openEditor(j.path),await G(j.requestId,{ok:!0,opened:!0,target:j.target,path:j.path},j.chatJid),!0}var Sj="piclaw:oobe:provider-missing:dismissed";function ZM(_){if(!_||typeof _!=="object")return 0;let $=Array.isArray(_.model_options)?_.model_options.filter(Boolean):[];if($.length>0)return $.length;return(Array.isArray(_.models)?_.models.filter((G)=>typeof G==="string"&&G.trim()):[]).length}function XM(_){if(!_||typeof _!=="object")return!1;let $=_.current;return typeof $==="string"&&$.trim().length>0}function cB(_){let{panePopoutMode:$=!1,modelsLoaded:j,modelPayload:G,providerMissingDismissed:Z=!1}=_,X=ZM(G),Y=X>0,L=XM(G),V=Y||L;if($||!j)return{kind:"hidden",hasAvailableModels:Y,availableModelCount:X,hasConfiguredModelHint:L};if(V)return{kind:"hidden",hasAvailableModels:Y,availableModelCount:X,hasConfiguredModelHint:L};return{kind:Z?"hidden":"provider-missing",hasAvailableModels:Y,availableModelCount:X,hasConfiguredModelHint:L}}var YM=rV();await YK();var{searchPosts:LM,deletePost:qM,getAgents:VM,getAgentThought:lB,setAgentThoughtVisibility:hB,getAgentStatus:KM,getAgentContext:QM,getAutoresearchStatus:NM,stopAutoresearch:BM,dismissAutoresearch:FM,getAgentModels:UM,getActiveChatAgents:EM,getChatBranches:HM,renameChatBranch:DM,pruneChatBranch:WM,purgeChatBranch:OM,restoreChatBranch:zM,getAgentQueueState:JM,steerAgentQueueItem:AM,removeAgentQueueItem:kM,streamSidePrompt:yM,getWorkspaceFile:MM,getThread:wM,getTimeline:TM,sendAgentMessage:xM,forkChatBranch:IM,createRootChatSession:CM}=LK;function fM({locationParams:_,navigate:$}){let{currentChatJid:j,chatOnlyMode:G,panePopoutMode:Z,panePopoutPath:X,panePopoutLabel:Y,branchLoaderMode:L,branchLoaderSourceChatJid:V}=Y0(()=>oV(_),[_]);u(()=>{if(typeof window>"u")return;window.__piclawCurrentChatJid=j,window.dispatchEvent?.(new CustomEvent("piclaw:current-chat-changed",{detail:{chatJid:j}}))},[j]);let q=xB({currentChatJid:j,branchLoaderMode:L}),[Q,K]=f(()=>F$(Sj,!1)),[B,N]=f(null),U=R((u0)=>{let o0=typeof u0==="string"?u0:"";if(!o0.trim())return;N({token:`prefill-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,text:o0})},[]),{agentStatus:D,setAgentStatus:H,agentDraft:E,setAgentDraft:k,agentPlan:z,setAgentPlan:O,agentThought:I,setAgentThought:x,pendingRequest:A,setPendingRequest:y,currentTurnId:W,setCurrentTurnId:M,steerQueuedTurnId:T,setSteerQueuedTurnId:J,lastAgentEventRef:C,lastSilenceNoticeRef:P,isAgentRunningRef:b,draftBufferRef:m,thoughtBufferRef:h,previewResyncPendingRef:_0,previewResyncGenerationRef:v,pendingRequestRef:e,stalledPostIdRef:W0,currentTurnIdRef:G0,steerQueuedTurnIdRef:$0,thoughtExpandedRef:L0,draftExpandedRef:B0}=PX(),t=vB({panePopoutMode:Z,panePopoutPath:X,panePopoutLabel:Y,chatOnlyMode:G,terminalTabPath:X2,vncTabPrefix:i1,getWorkspaceFile:MM}),V0=XQ({timelineRef:q.timelineRef,viewStateRef:q.viewStateRef,followupQueueRowIdsRef:q.followupQueueRowIdsRef,currentChatJid:j,currentHashtag:q.currentHashtag,searchQuery:q.searchQuery,followupQueueItems:q.followupQueueItems,onIdentity:R((u0)=>{if(!u0)return;let{assistant_name:o0,assistant_avatar_url:v0}=u0;if(o0||v0)q.setAgents((b0)=>{let A0=b0.default||{id:"default"},L_=o0&&!A0.name,e0=v0&&!A0.avatar_url;if(!L_&&!e0)return b0;return{...b0,["default"]:{...A0,...L_?{name:o0}:{},...e0?{avatar_url:v0}:{}}}});let{user_name:a0,user_avatar_url:n0,user_avatar_background:N_}=u0;if(a0||n0||N_)q.setUserProfile((t0)=>{let b0=a0&&!t0.name,A0=n0&&!t0.avatar_url,L_=N_&&!t0.avatar_background;if(!b0&&!A0&&!L_)return t0;return{...t0,...b0?{name:a0}:{},...A0?{avatar_url:n0}:{},...L_?{avatar_background:N_}:{}}})},[q.setAgents,q.setUserProfile])}),K0=rK({environment:{isRenameBranchFormOpen:q.isRenameBranchFormOpen,renameBranchNameInputRef:q.renameBranchNameInputRef,appShellRef:q.appShellRef,setIsWebAppMode:q.setIsWebAppMode,workspaceOpen:q.workspaceOpen,setWorkspaceOpen:q.setWorkspaceOpen,btwSession:q.btwSession,agents:q.agents,agentsRef:q.agentsRef,currentChatJid:j,activeChatJidRef:q.activeChatJidRef,userProfile:q.userProfile,userProfileRef:q.userProfileRef,brandingRef:q.brandingRef,panePopoutMode:Z},composeReferences:{setIntentToast:q.setIntentToast,intentToastTimerRef:q.intentToastTimerRef,editorOpen:t.editorState.editorOpen,openEditor:t.editorState.openEditor,resolvePane:(u0)=>X_.resolve(u0),tabStripActiveId:t.editorState.tabStripActiveId,setFileRefs:q.setFileRefs,setFolderRefs:q.setFolderRefs,setMessageRefs:q.setMessageRefs,currentChatJid:j,currentHashtag:q.currentHashtag,searchQuery:q.searchQuery,searchOpen:q.searchOpen,setCurrentHashtag:q.setCurrentHashtag,setSearchQuery:q.setSearchQuery,setSearchOpen:q.setSearchOpen,navigate:$,chatOnlyMode:G,getThread:wM,setPosts:V0.setPosts},agentActivity:{lastActivityTtlMs:rX,lastActivityTimerRef:q.lastActivityTimerRef,lastActivityTokenRef:q.lastActivityTokenRef,lastAgentEventRef:C,lastSilenceNoticeRef:P,isAgentRunningRef:b,setIsAgentTurnActive:q.setIsAgentTurnActive,setAgentStatus:H,draftBufferRef:m,thoughtBufferRef:h,pendingRequestRef:e,lastAgentResponseRef:q.lastAgentResponseRef,currentTurnIdRef:G0,steerQueuedTurnIdRef:$0,agentStatusRef:q.agentStatusRef,silentRecoveryRef:q.silentRecoveryRef,thoughtExpandedRef:L0,draftExpandedRef:B0,setCurrentTurnId:M,setSteerQueuedTurnId:J,currentTurnIdRefForPanel:G0,setAgentThoughtVisibility:hB,getAgentThought:lB,setAgentThought:x,setAgentDraft:k},chatPaneRuntime:{isAgentTurnActive:q.isAgentTurnActive,steerQueuedTurnId:T,currentTurnId:W,steerQueuedTurnIdRef:$0,setSteerQueuedTurnId:J,agentStatus:D,agentDraft:E,agentPlan:z,agentThought:I,pendingRequest:A,pendingRequestRef:e,followupQueueItems:q.followupQueueItems,activeModel:q.activeModel,activeThinkingLevel:q.activeThinkingLevel,supportsThinking:q.supportsThinking,activeModelUsage:q.activeModelUsage,contextUsage:q.contextUsage,isAgentRunningRef:b,wasAgentActiveRef:q.wasAgentActiveRef,draftBufferRef:m,thoughtBufferRef:h,lastAgentEventRef:C,lastSilenceNoticeRef:P,lastAgentResponseRef:q.lastAgentResponseRef,currentTurnIdRef:G0,thoughtExpandedRef:L0,draftExpandedRef:B0,agentStatusRef:q.agentStatusRef,silentRecoveryRef:q.silentRecoveryRef,setIsAgentTurnActive:q.setIsAgentTurnActive,setAgentStatus:H,setAgentDraft:k,setAgentPlan:O,setAgentThought:x,setPendingRequest:y,setCurrentTurnId:M,setFollowupQueueItems:q.setFollowupQueueItems,setActiveModel:q.setActiveModel,setActiveThinkingLevel:q.setActiveThinkingLevel,setSupportsThinking:q.setSupportsThinking,setActiveModelUsage:q.setActiveModelUsage,setContextUsage:q.setContextUsage,lastNotifiedIdRef:q.lastNotifiedIdRef,agentsRef:q.agentsRef,notify:q.notify,shouldNotifyLocallyForChat:q.shouldNotifyLocallyForChat},recovery:{isAgentRunningRef:b,lastSilenceNoticeRef:P,lastAgentEventRef:C,currentTurnIdRef:G0,thoughtExpandedRef:L0,draftExpandedRef:B0,draftBufferRef:m,thoughtBufferRef:h,pendingRequestRef:e,lastAgentResponseRef:q.lastAgentResponseRef,agentStatusRef:q.agentStatusRef,stalledPostIdRef:W0,scrollToBottomRef:V0.scrollToBottomRef,setCurrentTurnId:M,setAgentDraft:k,setAgentPlan:O,setAgentThought:x,setPendingRequest:y,setAgentStatus:H,setPosts:V0.setPosts,dedupePosts:D2},viewState:{viewStateRef:q.viewStateRef,currentHashtag:q.currentHashtag,searchQuery:q.searchQuery,searchOpen:q.searchOpen},removeFileRefRef:t.removeFileRefRef}),k0=cX({appShellRef:q.appShellRef,sidebarWidthRef:q.sidebarWidthRef,editorWidthRef:q.editorWidthRef,dockHeightRef:q.dockHeightRef}),{chatRefreshLifecycle:s,timelineViewActions:X0,isComposeBoxAgentActive:D0,followupActions:C0,sidepanelActions:g0,branchPaneActions:p0}=DB({routeState:{currentChatJid:j,currentRootChatJid:q.currentRootChatJid,chatOnlyMode:G,navigate:$,branchLoaderMode:L,branchLoaderSourceChatJid:V,isWebAppMode:q.isWebAppMode},searchState:{currentHashtag:q.currentHashtag,setCurrentHashtag:q.setCurrentHashtag,searchQuery:q.searchQuery,setSearchQuery:q.setSearchQuery,searchOpen:q.searchOpen,setSearchOpen:q.setSearchOpen,searchScope:q.searchScope,setSearchScope:q.setSearchScope},shellState:{activeChatAgents:q.activeChatAgents,currentChatBranches:q.currentChatBranches,currentBranchRecord:q.currentBranchRecord,contextUsage:q.contextUsage,activeModel:q.activeModel,activeThinkingLevel:q.activeThinkingLevel,supportsThinking:q.supportsThinking,activeModelUsage:q.activeModelUsage,connectionStatus:q.connectionStatus,notificationsEnabled:q.notificationsEnabled,notificationPermission:q.notificationPermission,workspaceOpen:q.workspaceOpen,setWorkspaceOpen:q.setWorkspaceOpen,userProfile:q.userProfile,agents:q.agents,removingPostIds:q.removingPostIds,btwSession:q.btwSession},timeline:V0,interaction:K0,paneRuntime:t.paneRuntime,refs:{activeChatJidRef:q.activeChatJidRef,queueRefreshGenRef:q.queueRefreshGenRef,dismissedQueueRowIdsRef:q.dismissedQueueRowIdsRef,wasAgentActiveRef:q.wasAgentActiveRef,viewStateRef:q.viewStateRef,agentStatusRef:q.agentStatusRef,pendingRequestRef:e,thoughtBufferRef:h,draftBufferRef:m,previewResyncPendingRef:_0,previewResyncGenerationRef:v,isAgentRunningRef:b,currentTurnIdRef:G0,silentRecoveryRef:q.silentRecoveryRef,lastAgentEventRef:C,lastSilenceNoticeRef:P,staleUiVersionRef:q.staleUiVersionRef,staleUiReloadScheduledRef:q.staleUiReloadScheduledRef,hasConnectedOnceRef:q.hasConnectedOnceRef,sidebarWidthRef:q.sidebarWidthRef,appShellRef:q.appShellRef,agentsRef:q.agentsRef,paneStateOwnerChatJidRef:q.paneStateOwnerChatJidRef,chatPaneStateByChatRef:q.chatPaneStateByChatRef,dismissedLiveWidgetKeysRef:q.dismissedLiveWidgetKeysRef,draftThrottleRef:q.draftThrottleRef,thoughtThrottleRef:q.thoughtThrottleRef,followupQueueItemsRef:q.followupQueueItemsRef,lastAgentResponseRef:q.lastAgentResponseRef,thoughtExpandedRef:L0,draftExpandedRef:B0,steerQueuedTurnIdRef:$0,btwAbortRef:q.btwAbortRef,renameBranchInFlightRef:q.renameBranchInFlightRef,renameBranchLockUntilRef:q.renameBranchLockUntilRef,editorWidthRef:q.editorWidthRef,dockHeightRef:q.dockHeightRef},setters:{setFollowupQueueItems:q.setFollowupQueueItems,setContextUsage:q.setContextUsage,setExtensionStatusPanels:q.setExtensionStatusPanels,setPendingExtensionPanelActions:q.setPendingExtensionPanelActions,setExtensionWorkingState:q.setExtensionWorkingState,setAgentStatus:H,setAgentDraft:k,setAgentPlan:O,setAgentThought:x,setPendingRequest:y,setConnectionStatus:q.setConnectionStatus,setStateAccessFailed:q.setStateAccessFailed,setAgents:q.setAgents,setUserProfile:q.setUserProfile,setActiveChatAgents:q.setActiveChatAgents,setCurrentChatBranches:q.setCurrentChatBranches,setActiveModel:q.setActiveModel,setActiveThinkingLevel:q.setActiveThinkingLevel,setSupportsThinking:q.setSupportsThinking,setActiveModelUsage:q.setActiveModelUsage,setAgentModelsPayload:q.setAgentModelsPayload,setHasLoadedAgentModels:q.setHasLoadedAgentModels,setHasMore:V0.setHasMore,setFloatingWidget:q.setFloatingWidget,setSteerQueuedTurnId:J,setRemovingPostIds:q.setRemovingPostIds,setBtwSession:q.setBtwSession,setWorkspaceOpen:q.setWorkspaceOpen,setRenameBranchNameDraft:q.setRenameBranchNameDraft,setIsRenameBranchFormOpen:q.setIsRenameBranchFormOpen,setIsRenamingBranch:q.setIsRenamingBranch},services:{searchPosts:LM,deletePost:qM,getAgentQueueState:JM,getAgentContext:QM,getAutoresearchStatus:NM,getAgentStatus:KM,getAgents:VM,getAgentModels:UM,getActiveChatAgents:EM,getChatBranches:HM,getTimeline:TM,stopAutoresearch:BM,dismissAutoresearch:FM,streamSidePrompt:yM,sendAgentMessage:xM,renameChatBranch:DM,pruneChatBranch:WM,purgeChatBranch:OM,restoreChatBranch:zM,forkChatBranch:IM,createRootChatSession:CM,steerAgentQueueItem:AM,removeAgentQueueItem:kM,getAgentThought:lB,setAgentThoughtVisibility:hB,silenceRefreshMs:nX,silenceWarningMs:lX,silenceFinalizeMs:hX,isCompactionStatus:W$,currentAppAssetVersion:YM,tabStoreHasUnsaved:()=>__.hasUnsaved(),agentStatus:D,isAgentTurnActive:q.isAgentTurnActive,openEditor:t.editorState.openEditor,activateTab:t.editorState.handleTabActivate,tabStripActiveId:t.editorState.tabStripActiveId,terminalTabPath:X2,resolveTab:(u0)=>__.get(u0),closeTab:t.editorState.handleTabClose,editorOpen:t.editorState.editorOpen},helpers:{getFormLock:pV,readStoredNumber:W4}});u(()=>{return EB({timelineRef:q.timelineRef,activeChatAgents:q.activeChatAgents,currentChatJid:j,onSwitch:(u0)=>p0.handleBranchPickerChange(u0),isIOSDevice:H5,isLikelySafari:l8})},[q.timelineRef,q.activeChatAgents,j,p0.handleBranchPickerChange]);let j_=Y0(()=>cB({panePopoutMode:Z,modelsLoaded:q.hasLoadedAgentModels,modelPayload:q.agentModelsPayload,providerMissingDismissed:Q}),[Z,q.hasLoadedAgentModels,q.agentModelsPayload,Q]),m0=R(()=>{KL()},[]),d0=R(()=>{K(!0),V_(Sj,"true")},[]);return u(()=>{if(!Z||typeof document>"u")return;document.title=tV(Y,t.paneRuntime.activePaneTab,X)},[t.paneRuntime.activePaneTab,Y,Z,X]),u(()=>{if(typeof window>"u")return;let u0=(o0)=>{mB(o0,{currentChatJid:j,openEditor:t.editorState.openEditor,popOutPane:p0.handlePopOutPane,showIntentToast:K0.composeReferenceActions.showIntentToast})};return window.addEventListener("piclaw-extension-ui:request",u0),()=>{window.removeEventListener("piclaw-extension-ui:request",u0)}},[p0.handlePopOutPane,j,K0.composeReferenceActions.showIntentToast,t.editorState.openEditor]),lV(VK({routeState:{branchLoaderMode:L,panePopoutMode:Z,currentChatJid:j,chatOnlyMode:G,panePopoutPath:X},paneRuntime:t.paneRuntime,splitters:k0,orchestration:{branchPaneActions:p0,timelineViewActions:X0,sidepanelActions:g0,followupActions:C0,chatRefreshLifecycle:s,isComposeBoxAgentActive:D0},interaction:K0,timeline:V0,surface:{...q,oobePanelState:j_,composePrefillRequest:B,requestComposePrefill:U,handleOobeSetupProvider:m0,handleOobeShowModelPicker:m0,handleOobeOpenWorkspace:m0,handleDismissProviderMissingOobe:d0},editorState:t.editorState,agentState:{agentStatus:D,agentDraft:E,agentPlan:z,agentThought:I,pendingRequest:A,currentTurnId:W,steerQueuedTurnId:T,setPendingRequest:y,pendingRequestRef:e,isCompactionStatus:W$},helpers:{formatBranchPickerLabel:t6,isIOSDevice:H5,terminalTabPath:X2}}))}function PM(){let{locationParams:_,navigate:$}=NL();return F`<${fM} locationParams=${_} navigate=${$} />`}var p8=document.getElementById("app");if(typeof window<"u")window.__PICLAW_APP_BOOTED__=!1;if(p8){if(Q$(null,p8),p8.replaceChildren(),Q$(F`<${PM} />`,p8),typeof window<"u")window.__PICLAW_APP_BOOTED__=!0}

//# debugId=2476F74F9806329164756E2164756E21
//# sourceMappingURL=app.bundle.js.map
