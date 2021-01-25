// JavaScript Document

const size = 19;
const countmax = 5;
var CPlayer = 0; // Current Player (0 is O,1 is X)
var InGame = false;
var l_played = [], l_win = [];
var mode = 1; // 0: no block; 1: block
var timereturn = false;
var AI = false;
		
//New Game
// Render bàn cờ
function Loaded()
{
	CPlayer = 0; // Current Player (0 is O,1 is X)
	l_played = [], l_win = [];
	var imgp = document.getElementById("imgPlayer");
	imgp.style.backgroundImage = "url('Images/Opng.png')";
	
	
	var table = document.getElementById("table");
	var	row = document.getElementsByClassName("row");
	var square = document.getElementsByClassName("square");
	
	// Create Table
	table.innerHTML = "";
	for (y = 0; y < size; y++)
	{
		table.innerHTML += '<tr class="row"></tr>';
		for (x = 0;x < size; x++)
		{
			var div = '<div class="square" onClick="Click(id)" onMouseOver="MouseOver(id)" onMouseOut="MouseOut(id)"></div>';
			row.item(y).innerHTML += '<td class="col">' + div + '</td>';
			square.item(x+y*size).setAttribute("id",(x+y*size).toString());//Mỗi ô đề có id riêng
			square.item(x+y*size).setAttribute("player","-1");//Mặc định player là =-1
		}
	}
}

//Play Game
//
function Click(id)
{
	if (!InGame) return;//Check xem game bắt chưa
	var square = document.getElementsByClassName("square");
	var pos = parseInt(id);
	if (square.item(pos).getAttribute("player") != "-1") return;// ô khác -1 đánh rồi 
	var path = "url('Images/Opng.png')";// Mặc định O 
	if (CPlayer == 1) path = "url('Images/Xpng.png')"; // Thay đổi qua X
	square.item(pos).style.backgroundImage = path;//Gắn X O cho ô 
	square.item(pos).setAttribute("player",CPlayer.toString());//Gắn X or O vào player
	l_played.push(pos);//Push vào mảng để làm chức năng quay lại
	
	var win = WinGame();//lấy giá trị function WinGame
	var pwin = CPlayer;//Thay đổi cờ X or O
	
	
	if (!AI)//Đánh caro người với người
	{
		if (CPlayer == 0) CPlayer = 1;
		else CPlayer = 0;
		
		var iplayer = "url('Images/Opng.png')";
		if (CPlayer == 1) iplayer = "url('Images/Xpng.png')";
		var imgp = document.getElementById("imgPlayer");
		imgp.style.backgroundImage = iplayer;
	}
	else//Đánh caro người với Máy
	{

		if (!win)
		{
			AIMode();
			win = WinGame();
			pwin = 1;
		}
	}
	

	//Check win sau mỗi lần click
	if (win)
	{
		if(AI){
			var hide = document.getElementById("wingame");
			hide.style.width = "520px"
			if (pwin == 0) {hide.style.backgroundImage = "url('../images/youwin.png')";
							hide.style.width = "440px"}
			hide.style.top = "50%";
		}else{
		var mess = 'Player with "X" win';
		if (pwin == 0) mess = 'Player with "O" win';
		alert(mess);}
		InGame = false;//Sẽ chuyển qua false để không thể đánh tiếp
	}
	else
	{
		//Cho thời gian đầy lại
		// var pgr = document.getElementById("pgrTime");
		// pgr.value = pgr.getAttribute("max");
	}
}

//Lấy mảng các ô 
function GetBoard()
{
	var TBoard = [];
	var sqr = document.getElementsByClassName("square");
	for (i = 0; i < size*size;i++)
		
		TBoard.push(parseInt(sqr.item(i).getAttribute("player")));
		//lấy giá trị Attribute tên player
	return TBoard;
}
// Min Max

//Tìm số lớn nhất
function maxab(a,b)
{
	if (a > b) return a;
	else return b;
}

//Tìm số nhỏ nhất
function minab(a,b)
{
	if (a < b) return a;
	else return b;
}

//function này giống hover vào ô
function MouseOver(id)
{
	if (!InGame) return;
	var square = document.getElementsByClassName("square");
	var pos = parseInt(id);
	square.item(pos).style.backgroundColor = "#3F3";
}
//function này giống hover ra khỏi ô
function MouseOut(id)
{
	if (!InGame) return;
	var square = document.getElementsByClassName("square");
	var pos = parseInt(id);
	square.item(pos).style.backgroundColor = "#FFF";
}



function WinGame()
{
	var result = false;//Mặc định là false
	var Board = GetBoard();// Lấy thông tin bàn cờ,ô nào đưỢc đánh rồi
	for (x = 0;x < size;x++)
	{
		for (y = 0;y < size;y++)
		{
			if (winHor(x,y,Board) || winVer(x,y,Board) || winCross1(x,y,Board) 
			|| winCross2(x,y,Board))
			{
				var square = document.getElementsByClassName("square");
				for(i = 0;i < l_win.length;i++)
				{
					//Đổi màu các quân cờ win
					square.item(l_win[i]).style.backgroundColor = "#FF0";
				}
				result = true;
			}
		}
	}
	return result;
}

// Win Dir
//Kiểm tra win ngang
function winHor(x,y,Board)
{
	l_win = [];
	var count = 0, counto = 0;// count 	
	var player = Board[x + y*size];
	if (player == -1) return false;
	
	//Kiểm tra chặn 1 đầu tăng lên 1
	if (x > 0)
	{
		var p = Board[x-1+y*size];
		if (p != player && p != -1) counto++;
	}
	
	for (i = x; i < size;i++)
	{
		var p = Board[i+y*size];
		//Cho số phần vào l_win 
		if (p == player && p != -1)
		{
			count++;
			l_win.push(i+y*size);
		}
		else{ if (p != -1) counto++;break;};
	}
	if (count >= countmax) 
	{
		if (mode == 0)
		return true;
		else {
				if (counto >= 2) return false;
				else return true;
			 }
	}
	return false;
}
//Kiểm tra win dọc
function winVer(x,y,Board)
{
	l_win = [];
	var count = 0, counto = 0;
	var player = Board[x + y*size];
	if (player == -1) return false;
	
	//Kiểm tra chặn 1 đầu tăng lên 1
	if (y > 0)
	{
		var p = Board[x+(y-1)*size];
		if (p != player && p != -1) counto++;
	}
	
	for (i = y; i < size;i++)
	{
		var p = Board[x+i*size];
		if (p == player && p != -1)
		{
			count++;
			l_win.push(x+i*size);
		}
		else{ if (p != -1) counto++;break;};
	}
	if (count >= countmax) 
	{
		if (mode == 0)
		return true;
		else {
				if (counto >= 2) return false;
				else return true;
			 }
	}
	return false;
}

//Kiểm tra win chéo trái sang phải
function winCross1(x,y,Board)
{
	l_win = [];
	if (x > size-countmax || y < countmax-1) return false;
	var count = 0, counto = 0;
	var player = Board[x + y*size];
	if (player == -1) return false;
	
	//Kiểm tra chặn 1 đầu tăng lên 1
	if (y < size-1 && x > 0)
	{
		var p = Board[x-1+(y+1)*size];
		if (p != player && p != -1) counto++;
	}
	
	for (i = 0; i <= minab(size-x,y);i++)
	{
		var p = Board[(x+i)+(y-i)*size];
		if (p == player && p != -1)
		{
			count++;
			l_win.push((x+i)+(y-i)*size);
		}
		else{ if (p != -1) counto++;break;};
	}
	if (count >= countmax) 
	{
		if (mode == 0)
		return true;
		else {
				if (counto >= 2) return false;
				else return true;
			 }
	}
	return false;
	
}

//Kiểm tra win chéo phải sang sang
function winCross2(x,y,Board)
{
	l_win = [];
	if (x > size-countmax || y > size-countmax) return false;
	var count = 0, counto = 0;
	var player = Board[x + y*size];
	if (player == -1) return false;
	
	if (y > 0 && x > 0)
	{
		var p = Board[x-1+(y-1)*size];
		if (p != player && p != -1) counto++;
	}
	
	for (i = 0; i < minab(size-x,size-y);i++)
	{
		var p = Board[(x+i)+(y+i)*size];
		if (p == player && p != -1)
		{
			count++;
			l_win.push((x+i)+(y+i)*size);
		}
		else{ if (p != -1) counto++;break;};
	}
	if (count >= countmax) 
	{
		if (mode == 0)
		return true;
		else {
				if (counto >= 2) return false;
				else return true;
			 }
	}
	return false;
}

// Button Event
// Chơi người với người
function PvsP()
{
	AI = false;
	Loaded();
	InGame = true;
	var pgr = document.getElementById("pgrTime");
	pgr.value = pgr.getAttribute("max");
	LoadProgress();
}
// chơi với Ai
function PvsM()
{
	AI = true;
	Loaded();
	InGame = true;
	var pgr = document.getElementById("pgrTime");
	pgr.value = pgr.getAttribute("max");
	LoadProgress();
}

function Undo(time)
{
	if (time < 1) return;
	if (l_played.length <= 0 || !InGame) return;
	var sqr = document.getElementsByClassName("square");
	sqr.item(l_played[l_played.length-1]).setAttribute("player","-1");
	sqr.item(l_played[l_played.length-1]).style.backgroundImage = "";
	
	l_played.pop();
	if (CPlayer == 0) CPlayer = 1;
	else CPlayer = 0;
	
	var iplayer = "url('Images/Opng.png')";
	if (CPlayer == 1) iplayer = "url('Images/Xpng.png')";
	var imgp = document.getElementById("imgPlayer");
	imgp.style.backgroundImage = iplayer;
	
	var pgr = document.getElementById("pgrTime");
	pgr.value = pgr.getAttribute("max");
	if (AI)
	Undo(time-1);
}
// Chặn 2 đầu
function ChooseMode()
{
	var chb = document.getElementById("chbmode");
	if (l_played.length > 0)
	chb.checked = !chb.checked;
	if (chb.checked) mode = 1;
	else mode = 0;
}
// Chạy thời gian
function TimeReturn()
{
	var chb = document.getElementById("chbtime");
	if (l_played.length > 0)
	chb.checked = !chb.checked;
	if (chb.checked) timereturn = true;
	else timereturn = false;
	if (timereturn) LoadProgress();
}

//H
function LoadProgress()
{
	
	if (!timereturn || !InGame) return;//Nếu timereturn
	setTimeout(
	function()
	{
		var pgr = document.getElementById("pgrTime");
		pgr.value--;
		if (pgr.value > 0)
		LoadProgress();
		else
		{
			//Hết thời gian sẽ thua
			var mess = 'Player with "X" win';
			if (CPlayer == 1) mess = 'Player with "O" win';
			alert(mess);
			InGame = false;
		}
	},100);
}
function hide(){
	var hide = document.getElementById("wingame");
	hide.style.top = "-30rem"
}